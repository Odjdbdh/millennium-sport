import { hasAdminSession, isSameOrigin } from "../../../../lib/story-auth";
import { getStoryRuntime } from "../../../../lib/story-runtime";
import { removeStory } from "../../../../lib/story-store";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const runtime = await getStoryRuntime();
  if (!runtime.ADMIN_TOKEN || !(await hasAdminSession(request, runtime.ADMIN_TOKEN))) {
    return Response.json({ error: "دسترسی غیرمجاز است." }, { status: 401 });
  }
  if (!isSameOrigin(request)) {
    return Response.json({ error: "درخواست نامعتبر است." }, { status: 403 });
  }
  if (!runtime.STORIES_DB || !runtime.STORY_MEDIA) {
    return Response.json({ error: "فضای ذخیره‌سازی استوری تنظیم نشده است." }, { status: 503 });
  }

  const { id } = await params;
  const removed = await removeStory(runtime.STORIES_DB, runtime.STORY_MEDIA, id);
  return removed
    ? Response.json({ removed: true })
    : Response.json({ error: "استوری پیدا نشد." }, { status: 404 });
}
