import type { StoryMediaType, StoryRow } from "./story-types";

export function storyThumbnailKey(mediaKey: string) {
  return mediaKey.replace(/\.[^./]+$/, "-thumbnail.webp");
}

export const STORIES_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  media_key TEXT NOT NULL UNIQUE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  mime_type TEXT NOT NULL,
  link_url TEXT,
  button_label TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS stories_active_idx
  ON stories (expires_at, sort_order, created_at);
`;

export async function ensureStoriesSchema(db: D1Database) {
  await db.exec(STORIES_SCHEMA_SQL);
}

export async function listActiveStories(db: D1Database, now = Date.now()) {
  await ensureStoriesSchema(db);
  const result = await db
    .prepare(
      `SELECT id, title, media_key, media_type, mime_type, link_url,
              button_label, sort_order, created_at, expires_at
       FROM stories
       WHERE expires_at > ?1
       ORDER BY sort_order ASC, created_at ASC`,
    )
    .bind(now)
    .all<StoryRow>();

  return result.results ?? [];
}

export async function listRecentStories(db: D1Database, limit = 100) {
  await ensureStoriesSchema(db);
  const result = await db
    .prepare(
      `SELECT id, title, media_key, media_type, mime_type, link_url,
              button_label, sort_order, created_at, expires_at
       FROM stories
       ORDER BY created_at DESC
       LIMIT ?1`,
    )
    .bind(limit)
    .all<StoryRow>();

  return result.results ?? [];
}

export async function findStory(db: D1Database, id: string) {
  await ensureStoriesSchema(db);
  return db
    .prepare(
      `SELECT id, title, media_key, media_type, mime_type, link_url,
              button_label, sort_order, created_at, expires_at
       FROM stories
       WHERE id = ?1`,
    )
    .bind(id)
    .first<StoryRow>();
}

export async function insertStory(
  db: D1Database,
  story: {
    id: string;
    title: string;
    mediaKey: string;
    mediaType: StoryMediaType;
    mimeType: string;
    linkUrl: string | null;
    buttonLabel: string | null;
    sortOrder: number;
    createdAt: number;
    expiresAt: number;
  },
) {
  await ensureStoriesSchema(db);
  await db
    .prepare(
      `INSERT INTO stories (
        id, title, media_key, media_type, mime_type, link_url,
        button_label, sort_order, created_at, expires_at
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)`,
    )
    .bind(
      story.id,
      story.title,
      story.mediaKey,
      story.mediaType,
      story.mimeType,
      story.linkUrl,
      story.buttonLabel,
      story.sortOrder,
      story.createdAt,
      story.expiresAt,
    )
    .run();
}

export async function removeStory(db: D1Database, media: R2Bucket, id: string) {
  const story = await findStory(db, id);
  if (!story) return false;

  await Promise.all([
    media.delete(story.media_key),
    story.media_type === "image" ? media.delete(storyThumbnailKey(story.media_key)) : Promise.resolve(),
  ]);
  await db.prepare("DELETE FROM stories WHERE id = ?1").bind(id).run();
  return true;
}

export async function cleanupExpiredStories(
  db: D1Database,
  media: R2Bucket,
  now = Date.now(),
) {
  await ensureStoriesSchema(db);
  const result = await db
    .prepare("SELECT id, media_key, media_type FROM stories WHERE expires_at <= ?1")
    .bind(now)
    .all<{ id: string; media_key: string; media_type: StoryMediaType }>();
  const rows = result.results ?? [];

  if (rows.length === 0) return 0;

  await Promise.all(rows.flatMap((row) => [
    media.delete(row.media_key),
    row.media_type === "image" ? media.delete(storyThumbnailKey(row.media_key)) : Promise.resolve(),
  ]));
  await db.prepare("DELETE FROM stories WHERE expires_at <= ?1").bind(now).run();
  return rows.length;
}
