/** Cloudflare Worker entry point for Millennium Sport. */
import handler from "vinext/server/app-router-entry";

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

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handler.fetch(request, env, ctx);
  },
};

export default worker;
