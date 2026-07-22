import { listActiveStories } from "../../lib/story-store";
import { getStoryRuntime } from "../../lib/story-runtime";
import { toPublicStory } from "../../lib/story-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const runtime = await getStoryRuntime();
  if (!runtime.STORIES_DB) {
    return Response.json(
      { stories: [], configured: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const stories = (await listActiveStories(runtime.STORIES_DB)).map(toPublicStory);
    return Response.json(
      { stories, configured: Boolean(runtime.STORY_MEDIA) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { stories: [], configured: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
