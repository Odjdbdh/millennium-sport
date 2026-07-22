import type { StoryRuntimeEnv } from "./story-types";

export async function getStoryRuntime() {
  const { env } = await import("cloudflare:workers");
  return env as unknown as StoryRuntimeEnv;
}

export function storyStorageReady(runtime: StoryRuntimeEnv) {
  return Boolean(runtime.STORIES_DB && runtime.STORY_MEDIA);
}
