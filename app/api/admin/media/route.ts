import { requireAdminRequest } from "../../../lib/admin-api";
import { addMediaItem, listMediaItems } from "../../../lib/admin-store";
import { adminNoStoreHeaders } from "../../../lib/story-auth";

export const dynamic = "force-dynamic";

const MAX_MEDIA_BYTES = 12 * 1024 * 1024;
const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extensionFor(type: string) {
  return {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  }[type] ?? "bin";
}

export async function GET(request: Request) {
  const { runtime, response } = await requireAdminRequest(request);
  if (response) return response;
  if (!runtime.STORIES_DB) {
    return Response.json(
      { error: "دیتابیس رسانه متصل نشده است." },
      { status: 503, headers: adminNoStoreHeaders() },
    );
  }
  return Response.json(
    { media: await listMediaItems(runtime.STORIES_DB) },
    { headers: adminNoStoreHeaders() },
  );
}

export async function POST(request: Request) {
  const { runtime, response } = await requireAdminRequest(request, true);
  if (response) return response;
  if (!runtime.STORIES_DB || !runtime.STORY_MEDIA) {
    return Response.json(
      { error: "فضای ذخیره‌سازی تصاویر متصل نشده است." },
      { status: 503, headers: adminNoStoreHeaders() },
    );
  }
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json(
      { error: "یک تصویر انتخاب کنید." },
      { status: 400, headers: adminNoStoreHeaders() },
    );
  }
  if (!allowedTypes.has(file.type) || file.size > MAX_MEDIA_BYTES) {
    return Response.json(
      { error: "فرمت تصویر معتبر نیست یا حجم آن بیشتر از ۱۲ مگابایت است." },
      { status: 400, headers: adminNoStoreHeaders() },
    );
  }

  const id = crypto.randomUUID();
  const key = `catalog/${id}.${extensionFor(file.type)}`;
  const createdAt = Date.now();
  await runtime.STORY_MEDIA.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
    customMetadata: { mediaId: id, uploadedAt: String(createdAt) },
  });
  try {
    await addMediaItem(runtime.STORIES_DB, {
      id,
      key,
      filename: file.name.slice(0, 180),
      mimeType: file.type,
      size: file.size,
      createdAt,
    });
  } catch (error) {
    await runtime.STORY_MEDIA.delete(key);
    throw error;
  }

  return Response.json(
    {
      media: {
        id,
        key,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        url: `/api/media/${encodeURIComponent(id)}`,
        createdAt,
      },
    },
    { status: 201, headers: adminNoStoreHeaders() },
  );
}
