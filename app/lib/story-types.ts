export type StoryMediaType = "image" | "video";

export interface StoryRow {
  id: string;
  title: string;
  media_key: string;
  media_type: StoryMediaType;
  mime_type: string;
  link_url: string | null;
  button_label: string | null;
  sort_order: number;
  created_at: number;
  expires_at: number;
}

export interface PublicStory {
  id: string;
  title: string;
  mediaType: StoryMediaType;
  mediaUrl: string;
  thumbnailUrl: string;
  linkUrl: string | null;
  buttonLabel: string | null;
  createdAt: number;
  expiresAt: number;
}

export interface StoryRuntimeEnv {
  STORIES_DB?: D1Database;
  STORY_MEDIA?: R2Bucket;
  ADMIN_TOKEN?: string;
}

export const STORY_LIFETIME_MS = 24 * 60 * 60 * 1000;

export function toPublicStory(row: StoryRow): PublicStory {
  return {
    id: row.id,
    title: row.title,
    mediaType: row.media_type,
    mediaUrl: `/api/stories/${encodeURIComponent(row.id)}/media`,
    thumbnailUrl: `/api/stories/${encodeURIComponent(row.id)}/media?variant=thumbnail`,
    linkUrl: row.link_url,
    buttonLabel: row.button_label,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  };
}
