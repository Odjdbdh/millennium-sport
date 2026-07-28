import { findMediaItem } from "../../../lib/admin-store";
import { getAdminRuntime } from "../../../lib/admin-runtime";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const runtime = await getAdminRuntime();
  if (!runtime.STORIES_DB || !runtime.STORY_MEDIA) {
    return new Response("Media storage is not configured", { status: 503 });
  }
  const { id } = await params;
  const item = await findMediaItem(runtime.STORIES_DB, id);
  if (!item) return new Response("Not found", { status: 404 });
  const object = await runtime.STORY_MEDIA.get(item.key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", item.mimeType);
  headers.set("ETag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(object.body, { headers });
}
