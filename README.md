# Millennium Sport

وب‌سایت رسمی گروه تولیدی میلنیوم اسپرت، ساخته‌شده با Next.js/Vinext و آمادهٔ انتشار روی Cloudflare Workers.

## توسعه محلی

نیازمندی: Node.js 22 یا جدیدتر.

```bash
npm ci
npm run dev
```

بررسی نهایی:

```bash
npm run lint
npm test
npx wrangler deploy --dry-run
```

## انتشار از GitHub روی Cloudflare

پروژه برای اتصال مستقیم GitHub به Cloudflare Workers آماده است:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Production branch: `main`
- Node version: `22`

هر Push روی شاخهٔ `main` نسخهٔ اصلی را منتشر می‌کند. شاخه‌های دیگر می‌توانند برای Preview Build استفاده شوند.

## استوری ۲۴ ساعته

نوار استوری در تمام صفحات نمایش داده می‌شود. مدیریت آن از مسیر `/admin` انجام می‌شود و از عکس و ویدیوی عمودی پشتیبانی می‌کند. هر استوری دقیقاً ۲۴ ساعت پس از انتشار از سایت پنهان می‌شود؛ پاک‌سازی فایل و رکورد منقضی‌شده نیز هر ساعت اجرا می‌شود.

پیش از فعال‌سازی استوری‌ها، در Cloudflare این منابع را ایجاد کنید:

1. D1 database با نام `millennium-stories`
2. R2 bucket با نام `millennium-story-media`
3. Secret با نام `ADMIN_TOKEN` و مقدار تصادفی حداقل ۲۴ کاراکتر

سپس bindingهای زیر را با شناسهٔ واقعی D1 به `wrangler.jsonc` اضافه کنید:

```jsonc
"d1_databases": [
  {
    "binding": "STORIES_DB",
    "database_name": "millennium-stories",
    "database_id": "<D1_DATABASE_ID>",
    "migrations_dir": "migrations"
  }
],
"r2_buckets": [
  {
    "binding": "STORY_MEDIA",
    "bucket_name": "millennium-story-media"
  }
]
```

ساخت جدول:

```bash
npx wrangler d1 migrations apply millennium-stories --remote
```

ثبت رمز مدیریت:

```bash
npx wrangler secret put ADMIN_TOKEN
```

## داده‌های فروشگاه

- محصولات و مشخصات: `app/data/products.ts`
- تصاویر: `public/images/`
- پنل استوری: `app/admin/`
- API استوری: `app/api/stories/` و `app/api/admin/stories/`
- دیتابیس: `migrations/0001_stories.sql`

هیچ رمز یا شناسهٔ حساس نباید داخل GitHub Commit شود؛ Secretها فقط در Cloudflare نگه‌داری می‌شوند.
