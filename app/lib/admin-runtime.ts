export interface AdminRuntimeEnv {
  STORIES_DB?: D1Database;
  STORY_MEDIA?: R2Bucket;
  ADMIN_TOKEN?: string;
}

export async function getAdminRuntime(): Promise<AdminRuntimeEnv> {
  const { env } = await import("cloudflare:workers");
  const runtime = env as unknown as AdminRuntimeEnv & {
    DB?: D1Database;
    BUCKET?: R2Bucket;
  };
  return {
    STORIES_DB: runtime.STORIES_DB ?? runtime.DB,
    STORY_MEDIA: runtime.STORY_MEDIA ?? runtime.BUCKET,
    ADMIN_TOKEN: runtime.ADMIN_TOKEN,
  };
}

export function adminStorageReady(runtime: AdminRuntimeEnv) {
  return Boolean(runtime.STORIES_DB && runtime.STORY_MEDIA);
}
