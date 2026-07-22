# Millennium Sport

وب‌سایت رسمی گروه تولیدی میلنیوم اسپرت؛ ساخته‌شده با Next.js/Vinext و آمادهٔ انتشار روی Cloudflare Workers.

## قابلیت‌های اصلی

- فروشگاه و کاتالوگ عمدهٔ پوشاک ورزشی با طراحی کامل راست‌به‌چپ
- صفحات محصولات، همکاری عمده، درخواست پیش‌فاکتور، درباره ما و تماس
- تصاویر واقعی محصولات و آواتار ثابت مدل زن
- نوار استوری در تمام صفحات با نمایش تمام‌صفحهٔ عکس و ویدیو
- پنل مدیریت استوری در مسیر `/admin`
- انقضای خودکار هر استوری دقیقاً ۲۴ ساعت پس از انتشار
- پاک‌سازی ساعتی فایل‌ها و رکوردهای منقضی‌شده با Cloudflare Cron

## توسعه و بررسی محلی

نیازمندی: Node.js 22 یا جدیدتر.

```bash
npm ci
npm run dev
```

بررسی نهایی:

```bash
npm run lint
npm test
npm run deploy:dry
```

## انتشار خودکار از GitHub روی Cloudflare

در Cloudflare Workers Builds این تنظیمات را وارد کنید:

- Production branch: `main`
- Deploy command: `npm run deploy`
- Node version: `22`

هر Push روی شاخهٔ `main` نسخهٔ اصلی را Build و منتشر می‌کند. فایل `wrangler.jsonc` تنظیمات Worker، فایل‌های استاتیک و پاک‌سازی ساعتی را نگه می‌دارد.

## بهینه‌سازی رسانه و سرعت بارگذاری

- تصاویر ثابت سایت با ابعاد متناسب و فرمت WebP نگه‌داری می‌شوند.
- تصاویر محصولات از قبل WebP و کم‌حجم هستند و فقط هنگام نزدیک‌شدن به محدودهٔ دید بارگذاری می‌شوند.
- عکس استوری در مرورگر به حداکثر ۱۰۸۰×۱۹۲۰ و WebP با کیفیت ۸۲٪ تبدیل می‌شود؛ یک تصویر بندانگشتی ۱۶۰×۱۶۰ نیز برای نوار استوری ساخته می‌شود تا فایل کامل در صفحه بارگذاری نشود.
- ویدیوی استوری تا زمان بازشدن آن بارگذاری نمی‌شود. برای بهترین نتیجه، ویدیوی MP4 با کدک H.264، ابعاد ۷۲۰×۱۲۸۰ و حجم کمتر از ۲۰ مگابایت استفاده شود.
- فایل استوری از R2 با کش کوتاه و متناسب با زمان باقی‌مانده تا انقضای ۲۴ساعته ارائه می‌شود.

## راه‌اندازی استوری ۲۴ساعته

پیش از استفاده از پنل، در Cloudflare این منابع را ایجاد کنید:

1. D1 database با نام `millennium-stories`
2. R2 bucket با نام `millennium-story-media`
3. Secret با نام `ADMIN_TOKEN` برای رمز ورود پنل

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

ساخت جدول و ثبت رمز مدیریت:

```bash
npx wrangler d1 migrations apply STORIES_DB --remote
npx wrangler secret put ADMIN_TOKEN
```

API هنگام نخستین اجرا نیز جدول را در صورت نبودن ایجاد می‌کند. فایل Migration برای مدیریت نسخه‌های بعدی دیتابیس نگه‌داری شده است.

## مسیر فایل‌های مهم

- محصولات و مشخصات: `app/data/products.ts`
- تصاویر: `public/images/`
- رابط استوری: `app/components/StoryBar.tsx`
- پنل استوری: `app/admin/`
- API استوری: `app/api/stories/` و `app/api/admin/`
- دیتابیس: `migrations/0001_stories.sql`

هیچ رمز، توکن یا شناسهٔ حساس نباید داخل GitHub Commit شود؛ Secretها فقط در Cloudflare نگه‌داری می‌شوند.
