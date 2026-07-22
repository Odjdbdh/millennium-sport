import { findStory, storyThumbnailKey } from "../../../../lib/story-store";
import { getStoryRuntime } from "../../../../lib/story-runtime";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const runtime = await getStoryRuntime();
  if (!runtime.STORIES_DB || !runtime.STORY_MEDIA) {
    return new Response("Story storage is not configured", { status: 503 });
  }

  const { id } = await params;
  const story = await findStory(runtime.STORIES_DB, id);
  if (!story || story.expires_at <= Date.now()) {
    return new Response("Not found", { status: 404 });
  }

  const wantsThumbnail = new URL(request.url).searchParams.get("variant") === "thumbnail" && story.media_type === "image";
  const thumbnail = wantsThumbnail ? await runtime.STORY_MEDIA.get(storyThumbnailKey(story.media_key)) : null;
  const object = thumbnail ?? await runtime.STORY_MEDIA.get(story.media_key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", thumbnail ? "image/webp" : story.mime_type);
  headers.set("ETag", object.httpEtag);
  const secondsRemaining = Math.max(0, Math.floor((story.expires_at - Date.now()) / 1000));
  headers.set("Cache-Control", `public, max-age=${Math.min(300, secondsRemaining)}`);
  headers.set("X-Content-Type-Options", "nosniff");

  return new Response(object.body, { headers });
}
