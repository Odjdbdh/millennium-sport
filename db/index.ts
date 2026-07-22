import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  const runtime = env as unknown as { STORIES_DB?: D1Database };
  if (!runtime.STORIES_DB) {
    throw new Error(
      "Cloudflare D1 binding `STORIES_DB` is unavailable. Connect the Millennium story database before using it."
    );
  }

  return drizzle(runtime.STORIES_DB, { schema });
}
