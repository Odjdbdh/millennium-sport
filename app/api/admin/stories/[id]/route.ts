import { requireAdminRequest } from "../../../../lib/admin-api";
import { adminNoStoreHeaders } from "../../../../lib/story-auth";
import { removeStory } from "../../../../lib/story-store";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { runtime, response } = await requireAdminRequest(request, true);
  if (response) return response;
  if (!runtime.STORIES_DB || !runtime.STORY_MEDIA) {
    return Response.json(
      { error: "فضای ذخیره‌سازی استوری تنظیم نشده است." },
      { status: 503, headers: adminNoStoreHeaders() },
    );
  }

  const { id } = await params;
  const removed = await removeStory(
    runtime.STORIES_DB,
    runtime.STORY_MEDIA,
    id,
  );
  return removed
    ? Response.json({ removed: true }, { headers: adminNoStoreHeaders() })
    : Response.json(
        { error: "استوری پیدا نشد." },
        { status: 404, headers: adminNoStoreHeaders() },
      );
}
