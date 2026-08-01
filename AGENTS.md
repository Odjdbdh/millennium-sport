# AGENTS.md

## Scope
These instructions apply to the entire `millennium-sport` repository.

## Product context
Millennium Sport is a Persian RTL, mobile-first wholesale sportswear website for `millenniumsport.ir`. It includes a public catalog and a private admin panel at `/admin` for products, inquiries, customers, stories, media, and dashboard operations.

The business is an established sportswear manufacturer and wholesaler. Preserve the brand identity, product accuracy, wholesale focus, and clear Persian customer experience.

## Technical baseline
- Node.js `>=22.13.0`
- Next.js 16 / React 19 through Vinext and Vite
- Cloudflare Workers deployment
- Cloudflare D1 for products and inquiries
- Cloudflare R2 for product and story media
- Drizzle ORM
- Tailwind CSS 4
- npm with the committed lockfile
- ESM project

Read `README.md`, `package.json`, `wrangler.jsonc`, schema and migration files, and relevant nearby code before editing.

## Repository workflow
- Make the smallest safe change that fully solves the requested task.
- Preserve existing architecture, naming, formatting, component patterns, and design system.
- Do not add dependencies unless necessary and compatible with Cloudflare Workers.
- Do not replace working code merely because another approach is newer.
- Do not overwrite unrelated uncommitted or in-progress work.
- Review the final diff before reporting completion.

## Install, build, and validation
This repository uses Linux-oriented helper scripts. Do not assume they run natively in Windows PowerShell.

Important commands:
- `npm run install:ci` — bounded lockfile install
- `npm run dev` — local development server
- `npm run lint` — lint checks
- `npm run build` — verified production build
- `npm test` — build plus rendered HTML tests
- `npm run validate:artifact` — validate an existing artifact
- `npm run deploy:dry` — deployment dry run
- `npm run deploy` — production deployment; requires explicit approval
- `npm run db:generate` — generate Drizzle migrations

Run checks appropriate to the change. Never claim success when a required check failed, and clearly state any command that could not be run.

## Persian RTL and responsive UI
- Preserve full RTL layout and natural Persian reading order.
- Use the existing Persian typography and Vazirmatn setup.
- Keep the site mobile-first and test common phone widths.
- Avoid horizontal overflow, clipped controls, tiny tap targets, and layout shifts.
- Preserve accessible labels, focus states, semantic controls, contrast, and keyboard navigation.
- Keep technical identifiers, filenames, code symbols, and environment variable names in English.

## Brand and visual rules
- Preserve the Millennium Sport brand identity and the existing red/white visual language unless explicitly asked to change it.
- Do not change the logo, brand name, social handles, contact details, or business claims without explicit approval.
- Product images must not be silently cropped, recolored, stretched, or replaced in ways that misrepresent the real garment.
- Preserve image aspect ratios, responsive galleries, and media quality.
- Product titles, codes, colors, sizes, inventory status, and wholesale details must remain consistent across public and admin views.

## Public catalog and data fallbacks
- Preserve the safe public-catalog fallback behavior when D1 is unavailable or not yet provisioned.
- Do not expose drafts, hidden products, admin notes, supplier data, internal pricing, or customer details publicly.
- Keep cache behavior and stale-data implications explicit when changing catalog reads.

## Admin security
- `/admin` and all admin APIs must remain private and server-authorized.
- Never rely on client-side hiding for access control.
- Preserve the HttpOnly, Secure, SameSite=Strict session design, same-origin mutation checks, constant-time secret comparison, no-store/noindex headers, and lockout protections described in `README.md`.
- `ADMIN_TOKEN` must remain a Cloudflare secret and must never be committed, logged, displayed, or included in examples.
- Ask before changing authentication, session, authorization, lockout, or account-recovery behavior.

## Products, inquiries, customers, and stories
- Never delete products, inquiries, customers, stories, media, or audit-relevant records without explicit approval.
- Preserve product codes and stable identifiers.
- Treat inventory, pricing, visibility, customer details, and inquiry status changes as sensitive operations.
- Validate all admin mutations server-side.
- Keep story expiration and 24-hour behavior consistent and timezone-safe.
- Do not expose customer phone numbers, messages, or private inquiry data publicly.

## D1, R2, and migrations
- Inspect the current schema, bindings, and migration history before making changes.
- Prefer additive, backward-compatible migrations.
- Do not rewrite applied migrations.
- Explain data migration impact before changing existing columns, constraints, or storage keys.
- Avoid orphaning R2 objects when changing media records.
- Do not run destructive database or bucket operations without explicit approval and a recovery plan.

## Secrets, Cloudflare, and production
- Never reveal, log, copy, or commit passwords, API tokens, private keys, database credentials, Cloudflare secrets, or `.env` files.
- Do not modify DNS, domains, Workers settings, D1 databases, R2 buckets, access policies, billing, or production secrets without explicit approval.
- Do not deploy to production automatically.
- Before deployment, report the exact target, changed resources, migration requirements, rollback plan, and validation results.
- Use `npm run deploy:dry` before a real deploy when applicable.

## Git and pull requests
- Do not force push.
- Do not commit secrets, generated build artifacts, or unrelated files.
- Keep commits focused with clear English imperative messages.
- Create draft pull requests by default.
- Do not merge or deploy automatically.

## Final report
At the end of each task, report in Persian:
1. What changed
2. Important modified files
3. Tests, lint, type-check, and build results
4. Remaining risks or manual steps
5. Any action the user must perform
