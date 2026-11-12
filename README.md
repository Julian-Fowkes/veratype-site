# veratype-site

Marketing site for [veratype.ai](https://veratype.ai), deployed via Cloudflare Workers with static assets.

## Stack

- Static HTML/CSS — no build step, no npm
- Cloudflare Workers (Git integration) — auto-deploys on push to `main`

## Pages

| File | URL | Notes |
|------|-----|-------|
| `index.html` | `https://veratype.ai` | Marketing page, FAQ (with JSON-LD structured data) and contact modal |
| `privacy.html` | `https://veratype.ai/privacy.html` → `/privacy` | **The** privacy policy. Linked from the Chrome extension, and `api.veratype.ai/privacy` redirects here — must stay live |
| `trust.html` | `https://veratype.ai/trust.html` → `/trust` | Trust & security page: what is and is not collected, who sees what, subprocessors |
| `404.html` | — | Not-found page (not in the sitemap) |
| `site.js` | — | Shared script (CSP is `script-src 'self'`: no inline scripts) |
| `_headers` | — | Security headers for every path, including the Content-Security-Policy |
| `favicon.svg`, `og-image.png` | — | Icon and social-share image |
| `robots.txt` | `https://veratype.ai/robots.txt` | Allows all crawlers, references the sitemap |
| `sitemap.xml` | `https://veratype.ai/sitemap.xml` | `/`, `/privacy.html`, `/trust.html` — update `lastmod` when a page changes (last: 2026-11-11) |

## Contact Form

The contact modal on `index.html` POSTs directly to `https://api.veratype.ai/contact`. The site itself does not handle the submission — the backend forwards it via Resend to `support@veratype.ai`.

## Deployment

Push to `main` triggers an automatic deploy via Cloudflare's Git integration running `npx wrangler deploy`. No manual step needed.

`wrangler.toml` configures:
- `[assets]` directory — serves static files from the repo root
- `compatibility_date` — required by wrangler for Workers deployments

## Gotchas

- **Do NOT remove `[assets]` from `wrangler.toml`** — wrangler will fail with "Missing entry-point" error.
- **`privacy.html` must stay live** — linked directly from the published Chrome extension. Removing or renaming it breaks the link for all installed users.
- **Privacy and trust claims must match the product.** Update them together with the backend repo, and only merge once the live backend and the store extension behave as described.
- **The CSP in `_headers` blocks Cloudflare's injected Web Analytics beacon** (harmless console error). Turn Web Analytics off in Cloudflare or allow `static.cloudflareinsights.com`.

See `AGENTS.md` for change history.
