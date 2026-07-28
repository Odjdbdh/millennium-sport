import { products as fallbackProducts, type Product } from "../data/products";

export type InquiryStatus = "new" | "contacted" | "quoted" | "completed" | "cancelled";

export interface Inquiry {
  id: string;
  name: string;
  business: string;
  province: string;
  city: string;
  phone: string;
  product: string;
  details: string;
  status: InquiryStatus;
  createdAt: number;
  updatedAt: number;
}

export interface MediaItem {
  id: string;
  key: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: number;
}

export interface ManagedProduct {
  id: string;
  product: Product;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS stories (
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
  )`,
  `CREATE INDEX IF NOT EXISTS stories_active_idx
    ON stories (expires_at, sort_order, created_at)`,
  `CREATE TABLE IF NOT EXISTS catalog_products (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    data_json TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS catalog_products_active_idx
    ON catalog_products (is_active, updated_at DESC)`,
  `CREATE TABLE IF NOT EXISTS wholesale_inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    business TEXT NOT NULL,
    province TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT NOT NULL,
    product TEXT NOT NULL DEFAULT '',
    details TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS wholesale_inquiries_status_idx
    ON wholesale_inquiries (status, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS media_library (
    id TEXT PRIMARY KEY,
    object_key TEXT NOT NULL UNIQUE,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    byte_size INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS media_library_created_idx
    ON media_library (created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS admin_login_attempts (
    fingerprint TEXT PRIMARY KEY,
    failures INTEGER NOT NULL DEFAULT 0,
    lock_until INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL
  )`,
];

export async function ensureAdminSchema(db: D1Database) {
  await db.batch(schemaStatements.map((statement) => db.prepare(statement)));
}

export async function seedCatalogProducts(db: D1Database) {
  await ensureAdminSchema(db);
  const row = await db.prepare("SELECT COUNT(*) AS total FROM catalog_products").first<{ total: number }>();
  if ((row?.total ?? 0) > 0) return;

  const now = Date.now();
  await db.batch(
    fallbackProducts.map((product) =>
      db.prepare(
        `INSERT OR IGNORE INTO catalog_products
          (id, slug, data_json, is_active, created_at, updated_at)
         VALUES (?1, ?2, ?3, 1, ?4, ?4)`,
      ).bind(product.slug, product.slug, JSON.stringify(product), now),
    ),
  );
}

function parseProductRow(row: {
  id: string;
  data_json: string;
  is_active: number;
  created_at: number;
  updated_at: number;
}): ManagedProduct | null {
  try {
    const product = JSON.parse(row.data_json) as Product;
    if (!product?.slug || !product?.name) return null;
    return {
      id: row.id,
      product,
      isActive: row.is_active === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  } catch {
    return null;
  }
}

export async function listManagedProducts(db: D1Database, includeInactive = true) {
  await seedCatalogProducts(db);
  const result = await db.prepare(
    `SELECT id, data_json, is_active, created_at, updated_at
     FROM catalog_products
     ${includeInactive ? "" : "WHERE is_active = 1"}
     ORDER BY updated_at DESC`,
  ).all<{
    id: string;
    data_json: string;
    is_active: number;
    created_at: number;
    updated_at: number;
  }>();

  return (result.results ?? []).map(parseProductRow).filter((item): item is ManagedProduct => Boolean(item));
}

export async function findManagedProduct(db: D1Database, slug: string) {
  await seedCatalogProducts(db);
  const row = await db.prepare(
    `SELECT id, data_json, is_active, created_at, updated_at
     FROM catalog_products
     WHERE slug = ?1 AND is_active = 1`,
  ).bind(slug).first<{
    id: string;
    data_json: string;
    is_active: number;
    created_at: number;
    updated_at: number;
  }>();
  return row ? parseProductRow(row) : null;
}

export async function saveManagedProduct(
  db: D1Database,
  product: Product,
  isActive = true,
) {
  await ensureAdminSchema(db);
  const now = Date.now();
  await db.prepare(
    `INSERT INTO catalog_products
      (id, slug, data_json, is_active, created_at, updated_at)
     VALUES (?1, ?1, ?2, ?3, ?4, ?4)
     ON CONFLICT(id) DO UPDATE SET
       slug = excluded.slug,
       data_json = excluded.data_json,
       is_active = excluded.is_active,
       updated_at = excluded.updated_at`,
  ).bind(product.slug, JSON.stringify(product), isActive ? 1 : 0, now).run();
}

export async function archiveManagedProduct(db: D1Database, id: string) {
  await ensureAdminSchema(db);
  const result = await db.prepare(
    "UPDATE catalog_products SET is_active = 0, updated_at = ?2 WHERE id = ?1",
  ).bind(id, Date.now()).run();
  return (result.meta.changes ?? 0) > 0;
}

export async function createInquiry(
  db: D1Database,
  input: Omit<Inquiry, "id" | "status" | "createdAt" | "updatedAt">,
) {
  await ensureAdminSchema(db);
  const id = crypto.randomUUID();
  const now = Date.now();
  await db.prepare(
    `INSERT INTO wholesale_inquiries
      (id, name, business, province, city, phone, product, details, status, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'new', ?9, ?9)`,
  ).bind(
    id,
    input.name,
    input.business,
    input.province,
    input.city,
    input.phone,
    input.product,
    input.details,
    now,
  ).run();
  return id;
}

export async function listInquiries(db: D1Database) {
  await ensureAdminSchema(db);
  const result = await db.prepare(
    `SELECT id, name, business, province, city, phone, product, details,
            status, created_at, updated_at
     FROM wholesale_inquiries
     ORDER BY created_at DESC
     LIMIT 500`,
  ).all<{
    id: string;
    name: string;
    business: string;
    province: string;
    city: string;
    phone: string;
    product: string;
    details: string;
    status: InquiryStatus;
    created_at: number;
    updated_at: number;
  }>();

  return (result.results ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    business: row.business,
    province: row.province,
    city: row.city,
    phone: row.phone,
    product: row.product,
    details: row.details,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  } satisfies Inquiry));
}

export async function updateInquiryStatus(
  db: D1Database,
  id: string,
  status: InquiryStatus,
) {
  await ensureAdminSchema(db);
  const result = await db.prepare(
    "UPDATE wholesale_inquiries SET status = ?2, updated_at = ?3 WHERE id = ?1",
  ).bind(id, status, Date.now()).run();
  return (result.meta.changes ?? 0) > 0;
}

export async function addMediaItem(
  db: D1Database,
  item: Omit<MediaItem, "url">,
) {
  await ensureAdminSchema(db);
  await db.prepare(
    `INSERT INTO media_library
      (id, object_key, filename, mime_type, byte_size, created_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
  ).bind(item.id, item.key, item.filename, item.mimeType, item.size, item.createdAt).run();
}

export async function listMediaItems(db: D1Database) {
  await ensureAdminSchema(db);
  const result = await db.prepare(
    `SELECT id, object_key, filename, mime_type, byte_size, created_at
     FROM media_library
     ORDER BY created_at DESC
     LIMIT 300`,
  ).all<{
    id: string;
    object_key: string;
    filename: string;
    mime_type: string;
    byte_size: number;
    created_at: number;
  }>();
  return (result.results ?? []).map((row) => ({
    id: row.id,
    key: row.object_key,
    filename: row.filename,
    mimeType: row.mime_type,
    size: row.byte_size,
    url: `/api/media/${encodeURIComponent(row.id)}`,
    createdAt: row.created_at,
  } satisfies MediaItem));
}

export async function findMediaItem(db: D1Database, id: string) {
  await ensureAdminSchema(db);
  const row = await db.prepare(
    `SELECT id, object_key, filename, mime_type, byte_size, created_at
     FROM media_library WHERE id = ?1`,
  ).bind(id).first<{
    id: string;
    object_key: string;
    filename: string;
    mime_type: string;
    byte_size: number;
    created_at: number;
  }>();
  if (!row) return null;
  return {
    id: row.id,
    key: row.object_key,
    filename: row.filename,
    mimeType: row.mime_type,
    size: row.byte_size,
    url: `/api/media/${encodeURIComponent(row.id)}`,
    createdAt: row.created_at,
  } satisfies MediaItem;
}

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LOCK_MS = 15 * 60 * 1000;
const MAX_LOGIN_FAILURES = 5;

export async function loginLockRemaining(db: D1Database, fingerprint: string) {
  await ensureAdminSchema(db);
  const row = await db.prepare(
    "SELECT lock_until FROM admin_login_attempts WHERE fingerprint = ?1",
  ).bind(fingerprint).first<{ lock_until: number }>();
  return Math.max(0, (row?.lock_until ?? 0) - Date.now());
}

export async function recordLoginFailure(db: D1Database, fingerprint: string) {
  await ensureAdminSchema(db);
  const now = Date.now();
  const row = await db.prepare(
    "SELECT failures, updated_at FROM admin_login_attempts WHERE fingerprint = ?1",
  ).bind(fingerprint).first<{ failures: number; updated_at: number }>();
  const failures = row && now - row.updated_at <= LOGIN_WINDOW_MS ? row.failures + 1 : 1;
  const lockUntil = failures >= MAX_LOGIN_FAILURES ? now + LOGIN_LOCK_MS : 0;
  await db.prepare(
    `INSERT INTO admin_login_attempts (fingerprint, failures, lock_until, updated_at)
     VALUES (?1, ?2, ?3, ?4)
     ON CONFLICT(fingerprint) DO UPDATE SET
       failures = excluded.failures,
       lock_until = excluded.lock_until,
       updated_at = excluded.updated_at`,
  ).bind(fingerprint, failures, lockUntil, now).run();
  return lockUntil;
}

export async function clearLoginFailures(db: D1Database, fingerprint: string) {
  await ensureAdminSchema(db);
  await db.prepare("DELETE FROM admin_login_attempts WHERE fingerprint = ?1").bind(fingerprint).run();
}

export async function getDashboardStats(db: D1Database) {
  await seedCatalogProducts(db);
  const [product, inquiry, customer, media, story] = await db.batch([
    db.prepare("SELECT COUNT(*) AS total FROM catalog_products WHERE is_active = 1"),
    db.prepare("SELECT COUNT(*) AS total FROM wholesale_inquiries WHERE status = 'new'"),
    db.prepare("SELECT COUNT(DISTINCT phone) AS total FROM wholesale_inquiries"),
    db.prepare("SELECT COUNT(*) AS total FROM media_library"),
    db.prepare("SELECT COUNT(*) AS total FROM stories WHERE expires_at > ?1").bind(Date.now()),
  ]);
  const read = (result: D1Result<unknown>) =>
    Number((result.results?.[0] as { total?: number } | undefined)?.total ?? 0);
  return {
    products: read(product),
    newInquiries: read(inquiry),
    customers: read(customer),
    media: read(media),
    activeStories: read(story),
  };
}
