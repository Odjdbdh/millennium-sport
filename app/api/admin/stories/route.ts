import { requireAdminRequest } from "../../../lib/admin-api";
import { adminNoStoreHeaders } from "../../../lib/story-auth";
import {
  insertStory,
  listRecentStories,
  storyThumbnailKey,
} from "../../../lib/story-store";
import {
  STORY_LIFETIME_MS,
  toPublicStory,
  type StoryMediaType,
} from "../../../lib/story-types";

export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 20 * 1024 * 1024;
const MAX_THUMBNAIL_BYTES = 256 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

function safeMediaExtension(file: File) {
  const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
  };
  return extensionByType[file.type] ?? "bin";
}

function normalizeLink(value: FormDataEntryValue | null) {
  const link = typeof value === "string" ? value.trim() : "";
  if (!link) return null;
  if (link.startsWith("/") && !link.startsWith("//")) return link;
  try {
    const url = new URL(link);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { runtime, response } = await requireAdminRequest(request);
  if (response) return response;
  if (!runtime.STORIES_DB) {
    return Response.json(
      { error: "دیتابیس استوری متصل نشده است." },
      { status: 503, headers: adminNoStoreHeaders() },
    );
  }
  const stories = (await listRecentStories(runtime.STORIES_DB)).map(toPublicStory);
  return Response.json({ stories }, { headers: adminNoStoreHeaders() });
}

export async function POST(request: Request) {
  const { runtime, response } = await requireAdminRequest(request, true);
  if (response) return response;
  if (!runtime.STORIES_DB || !runtime.STORY_MEDIA) {
    return Response.json(
      { error: "فضای ذخیره‌سازی استوری متصل نشده است." },
      { status: 503, headers: adminNoStoreHeaders() },
    );
  }

  const formData = await request.formData();
  const media = formData.get("media");
  const thumbnail = formData.get("thumbnail");
  const title = String(formData.get("title") ?? "").trim().slice(0, 80);
  const buttonLabel =
    String(formData.get("buttonLabel") ?? "").trim().slice(0, 28) || null;
  const linkUrl = normalizeLink(formData.get("linkUrl"));
  const rawLink = String(formData.get("linkUrl") ?? "").trim();
  const sortOrder =
    Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0;

  if (!(media instanceof File) || media.size === 0) {
    return Response.json(
      { error: "یک عکس یا ویدیو انتخاب کنید." },
      { status: 400, headers: adminNoStoreHeaders() },
    );
  }

  let mediaType: StoryMediaType;
  if (ALLOWED_IMAGE_TYPES.has(media.type)) mediaType = "image";
  else if (ALLOWED_VIDEO_TYPES.has(media.type)) mediaType = "video";
  else {
    return Response.json(
      { error: "فرمت فایل پشتیبانی نمی‌شود." },
      { status: 400, headers: adminNoStoreHeaders() },
    );
  }

  const maxBytes = mediaType === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (media.size > maxBytes) {
    return Response.json(
      {
        error: `حجم ${mediaType === "image" ? "عکس" : "ویدیو"} باید حداکثر ${maxBytes / 1024 / 1024} مگابایت باشد.`,
      },
      { status: 400, headers: adminNoStoreHeaders() },
    );
  }
  if (
    thumbnail instanceof File &&
    (mediaType !== "image" ||
      thumbnail.type !== "image/webp" ||
      thumbnail.size > MAX_THUMBNAIL_BYTES)
  ) {
    return Response.json(
      { error: "پیش‌نمایش عکس نامعتبر است." },
      { status: 400, headers: adminNoStoreHeaders() },
    );
  }
  if (rawLink && !linkUrl) {
    return Response.json(
      { error: "لینک باید داخلی یا با https شروع شود." },
      { status: 400, headers: adminNoStoreHeaders() },
    );
  }

  const id = crypto.randomUUID();
  const createdAt = Date.now();
  const expiresAt = createdAt + STORY_LIFETIME_MS;
  const mediaKey = `stories/${id}.${safeMediaExtension(media)}`;

  try {
    await runtime.STORY_MEDIA.put(mediaKey, await media.arrayBuffer(), {
      httpMetadata: { contentType: media.type },
      customMetadata: { storyId: id, expiresAt: String(expiresAt) },
    });
    if (
      mediaType === "image" &&
      thumbnail instanceof File &&
      thumbnail.size > 0
    ) {
      await runtime.STORY_MEDIA.put(
        storyThumbnailKey(mediaKey),
        await thumbnail.arrayBuffer(),
        {
          httpMetadata: { contentType: thumbnail.type },
          customMetadata: {
            storyId: id,
            expiresAt: String(expiresAt),
            variant: "thumbnail",
          },
        },
      );
    }

    await insertStory(runtime.STORIES_DB, {
      id,
      title: title || "استوری جدید",
      mediaKey,
      mediaType,
      mimeType: media.type,
      linkUrl,
      buttonLabel: linkUrl ? buttonLabel || "مشاهده" : null,
      sortOrder,
      createdAt,
      expiresAt,
    });
  } catch (error) {
    await Promise.all([
      runtime.STORY_MEDIA.delete(mediaKey),
      mediaType === "image"
        ? runtime.STORY_MEDIA.delete(storyThumbnailKey(mediaKey))
        : Promise.resolve(),
    ]);
    throw error;
  }

  return Response.json(
    {
      story: {
        id,
        title: title || "استوری جدید",
        mediaType,
        mediaUrl: `/api/stories/${encodeURIComponent(id)}/media`,
        thumbnailUrl: `/api/stories/${encodeURIComponent(id)}/media?variant=thumbnail`,
        linkUrl,
        buttonLabel: linkUrl ? buttonLabel || "مشاهده" : null,
        createdAt,
        expiresAt,
      },
    },
    { status: 201, headers: adminNoStoreHeaders() },
  );
}
