# veratype-site

Marketing site for [veratype.ai](https://veratype.ai), deployed via Cloudflare Workers with static assets.

## Stack

- Static HTML/CSS — no build step, no npm
- Cloudflare Workers (Git integration) — auto-deploys on push to `main`
- `functions/api/notify.js` — legacy Pages Function (dead code, no longer called)
- KV namespace `WAITLIST` — legacy waitlist storage (no longer in use)

## Pages

| File | URL | Notes |
|------|-----|-------|
| `index.html` | `https://veratype.ai` | Main marketing page with contact modal |
| `privacy.html` | `https://veratype.ai/privacy.html` | Privacy policy — linked from Chrome extension, must stay live |

## Contact Form

The contact modal on `index.html` POSTs directly to `https://api.veratype.ai/contact`. The site itself does not handle the submission — the backend forwards it via Resend to `julian@veratype.ai`.

## Deployment

Push to `main` triggers an automatic deploy via Cloudflare's Git integration running `npx wrangler deploy`. No manual step needed.

`wrangler.toml` configures:
- `[assets]` directory — serves static files from the repo root
- `compatibility_date` — required by wrangler for Workers deployments

## Gotchas

- **Do NOT remove `[assets]` from `wrangler.toml`** — wrangler will fail with "Missing entry-point" error.
- **`privacy.html` must stay live** — linked directly from the published Chrome extension. Removing or renaming it breaks the link for all installed users.
- The `functions/` directory is dead code — do not add new Pages Functions here, they won't run in Workers static assets mode.
