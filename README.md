# Millennium Sport

Persian RTL wholesale sportswear site for [millenniumsport.ir](https://millenniumsport.ir), built with Next.js/Vinext and deployed on Cloudflare Workers.

## Admin panel

The private management panel is available at `/admin` and includes:

- product creation, editing, inventory state, pricing, colors, sizes, and galleries
- wholesale inquiry pipeline and customer list
- 24-hour image/video stories
- R2-backed media library
- dashboard statistics and mobile-first Persian UI

Products and inquiries are stored in Cloudflare D1. Uploaded images and story media are stored in Cloudflare R2. The public catalog reads from D1 and safely falls back to the bundled catalog until storage is ready.

## Security setup

Create a Cloudflare Worker secret named `ADMIN_TOKEN` with a unique value of at least 16 characters. Never commit this value to GitHub.

The admin uses an HttpOnly, Secure, SameSite=Strict signed session cookie, same-origin mutation checks, constant-time password comparison, no-store/noindex headers, and temporary lockout after repeated failed attempts.

D1 and R2 bindings are declared in `wrangler.jsonc` and can be provisioned automatically by Workers Builds.

## Development

```bash
npm install
npm run dev
npm run lint
npm test
```

Production builds use `npm run build`.
