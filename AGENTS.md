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
| `index.html` | `https://veratype.ai` | Marketing page, FAQ (with JSON-LD structured data) and contact modal |
| `privacy.html` | `https://veratype.ai/privacy.html` → `/privacy` | **The** privacy policy. Linked from the Chrome extension, and `api.veratype.ai/privacy` redirects here — must stay live |
| `trust.html` | `https://veratype.ai/trust.html` → `/trust` | Trust & security page: what is and is not collected, who sees what, subprocessors |
| `404.html` | — | Not-found page (not in the sitemap) |
| `site.js` | — | Shared script (CSP is `script-src 'self'`: no inline scripts) |
| `_headers` | — | Security headers for every path, including the Content-Security-Policy |
| `favicon.svg`, `favicon-32.png`, `favicon-16.png`, `og-image.png` | — | Company logo icons (shared with the product — change both together) and social-share image |
| `robots.txt` | `https://veratype.ai/robots.txt` | Allows all crawlers, references the sitemap |
| `sitemap.xml` | `https://veratype.ai/sitemap.xml` | `/`, `/privacy`, `/trust` (the addresses that answer 200, not the `.html` ones that redirect) — update `lastmod` when a page changes (last: 2026-11-12) |

## Contact Form

The contact modal on `index.html` POSTs directly to `https://api.veratype.ai/contact` (the backend API). The site itself does not handle the form. Flow:

1. User submits email + question on `veratype.ai`
2. `index.html` JS POSTs to `https://api.veratype.ai/contact`
3. Backend (`routers/contact.py`) forwards via Resend to `support@veratype.ai`, with the sender as reply-to

---

## Known Gotchas

- **Do NOT remove `[assets]` from `wrangler.toml`** — wrangler will fail with "Missing entry-point". The site runs as a Workers static asset deployment, not Cloudflare Pages.
- **Deployment is automatic** — Cloudflare's Git integration runs `npx wrangler deploy` on every push to `main`. No manual deploy step needed day-to-day. Run `npx wrangler deploy` manually only if you need to force a deploy without a commit.
- **No build step** — the site is plain HTML/CSS/JS. No npm install, no bundler. Edit files and push.
- **`privacy.html` must stay live** — it is linked directly from the published Chrome extension. Removing or renaming it breaks the link for all installed extension users.
- **`.assetsignore` keeps repo files off the site.** `wrangler.toml` serves the whole repo root (`directory = "."`), so `AGENTS.md`, `README.md` and `wrangler.toml` were publicly downloadable until 2026-11-11. Add any new non-site file (docs, scripts, config) to `.assetsignore`.
- **`.html` URLs redirect.** Cloudflare answers `/privacy.html` and `/trust.html` with a 307 to `/privacy` and `/trust`. Both work, and the `.html` files must stay (the extension links to `privacy.html`). The site's own links, canonical tags and sitemap use the short addresses, because a canonical or sitemap entry that redirects sends search engines a mixed signal.
- **Cloudflare Web Analytics vs the CSP.** Cloudflare injects its analytics beacon (`static.cloudflareinsights.com`), and the CSP in `_headers` blocks it, so every page logs a console error. It is harmless. Either turn off Web Analytics in the Cloudflare dashboard or add that host to `script-src` (and `connect-src`) in `_headers`.
- **Privacy and trust claims track the product.** These pages state what the extension and backend actually do (e.g. "Nothing before registration", "Only the class the student chose", the per-session typing-rhythm summary). Change them together with the backend repo (`Julian-Fowkes/veratype`), and check before merging that the live backend and the extension in the store really behave that way.
- **Copy rules:** say "verification, not detection" — Veratype shows how a document was produced; it does not claim to detect AI-generated text. 19 behavioural signals.

---

## Recent Changes (November 2026)

- **Privacy policy: the class rule** (PR #5, `04b30c1`, 2026-11-12, merged after the backend change was live): each class a student chose for a document sees it; a class keeps a document once chosen. No account-holder email was sent; the wording has not had legal review.
- **Logo favicon** (PR #4, `283593b`, 2026-11-12): the company logo — nine white bars hanging from one line in a V, the fourth blue, on ink — replaces the two-tone V. Pages link `favicon-32.png` and a five-bar `favicon-16.png` (nine bars blur at 16 px); `favicon.svg` is the logo too. Same files as the product's dashboard and extension.
- **Favicon** (PR #3, `62a7457`, 2026-11-12): the two-tone V mark (white and blue `#2563FF` strokes on the ink colour, drawn as paths), the same mark as the product's dashboard, sign-in pages and extension icon. The old favicon drew a letter V in a font the browser might not have, in an off-palette blue.
- **Site copy, privacy policy and trust page for extension 0.2.5** (PR #2, `a0e236a`, merged 2026-11-11 and live the same night): the FAQ answer to "Does Veratype detect AI-generated writing?" is now "No, and it does not try to"; key-pair timing is described as a per-session summary under one-way hashes; copy/cut events and unexplained Google Docs growth are listed; "Nothing before registration" and "Only the class the student chose"; the 12-month retention is stated once; Cloudflare and Google Fonts added as subprocessors; "18 signals" corrected to 19 in the remaining places; dashboard address `api.veratype.ai/dashboard`; `404.html` removed from the sitemap.
- **Timing:** this was merged before extension 0.2.5 reached the Chrome Web Store (the store still serves 0.2.3). The backend makes "Nothing before registration" true regardless: `ACCEPT_ANONYMOUS_SESSIONS=false` has been set in App Runner since 2026-11-12, so unregistered batches are refused.

## Recent Changes (October 2026)

- **Signal count** updated from 18 to 19 across the marketing copy (`a7c73be`).

## Recent Changes (June 2026)

- **Visual redesign** — "the rhythm is the brand" (`32973c3`).
- **Compliance and security** — trust page added, security headers in `_headers`, dead code removed (`e98a77b`).
- OG image, mobile nav, email consistency and contact-error fixes; copy rewritten for directness.

## Recent Changes (May 2026)

- No changes this month — site is stable.

## Recent Changes (March 2026)

- **Contact form** — waitlist modal replaced with contact form. Form now POSTs to `https://api.veratype.ai/contact` instead of the local `functions/api/notify.js` Pages Function.
