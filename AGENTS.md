# veratype-site — Agent Reference

Live infrastructure state and gotchas for AI agents working on this repo. Complements README.md.

---

## Live Infrastructure State

- **URL:** `https://veratype.ai`
- **Hosting:** Cloudflare Workers (static assets) — auto-deploys on push to `main` via Cloudflare Git integration
- **Workers project name:** `veratype-site`
- **Compatibility date:** `2026-04-27`

## Pages

| File | URL | Notes |
|------|-----|-------|
| `index.html` | `https://veratype.ai` | Main marketing page with contact modal |
| `privacy.html` | `https://veratype.ai/privacy.html` | Privacy policy — linked from Chrome extension, must stay live |
| `robots.txt` | `https://veratype.ai/robots.txt` | Allows all crawlers, references sitemap |
| `sitemap.xml` | `https://veratype.ai/sitemap.xml` | Lists `/` and `/privacy.html`; **update `lastmod` dates when pages change** (currently stale at 2026-03-22) |

## Contact Form

The contact modal on `index.html` POSTs directly to `https://api.veratype.ai/contact` (the backend API). The site itself does not handle the form. Flow:

1. User submits email + question on `veratype.ai`
2. `index.html` JS POSTs to `https://api.veratype.ai/contact`
3. Backend (`routers/contact.py`) forwards via Resend to `julian@veratype.ai`

---

## Known Gotchas

- **Do NOT remove `[assets]` from `wrangler.toml`** — wrangler will fail with "Missing entry-point". The site runs as a Workers static asset deployment, not Cloudflare Pages.
- **Deployment is automatic** — Cloudflare's Git integration runs `npx wrangler deploy` on every push to `main`. No manual deploy step needed day-to-day. Run `npx wrangler deploy` manually only if you need to force a deploy without a commit.
- **No build step** — the site is plain HTML/CSS/JS. No npm install, no bundler. Edit files and push.
- **`privacy.html` must stay live** — it is linked directly from the published Chrome extension. Removing or renaming it breaks the link for all installed extension users.

---

## Recent Changes (May 2026)

- No changes this month — site is stable.

## Recent Changes (March 2026)

- **Contact form** — waitlist modal replaced with contact form. Form now POSTs to `https://api.veratype.ai/contact` instead of the local `functions/api/notify.js` Pages Function.
