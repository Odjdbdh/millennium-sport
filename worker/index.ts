/** Cloudflare Worker entry point for Millennium Sport. */
import handler from "vinext/server/app-router-entry";
import { cleanupExpiredStories } from "../app/lib/story-store";

interface Env {
  ASSETS: Fetcher;
  STORIES_DB?: D1Database;
  STORY_MEDIA?: R2Bucket;
  ADMIN_TOKEN?: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

interface ScheduledEvent {
  scheduledTime: number;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handler.fetch(request, env, ctx);
  },

  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    if (!env.STORIES_DB || !env.STORY_MEDIA) return;
    await cleanupExpiredStories(env.STORIES_DB, env.STORY_MEDIA, event.scheduledTime);
  },
};

export default worker;
