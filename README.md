# veratype-site

Marketing site for [veratype.ai](https://veratype.ai), deployed via Cloudflare Workers with static assets.

## Stack

- Static HTML/CSS — no build step
- Cloudflare Workers (Git integration) — auto-deploys on push to `main`
- `functions/api/notify.js` — legacy Pages Function (dead code, contact form now routes to `api.veratype.ai/contact`)
- KV namespace `WAITLIST` — legacy waitlist storage (no longer in use)

## Deployment

Push to `main` triggers an automatic deploy via Cloudflare's Git integration running `npx wrangler deploy`.

`wrangler.toml` configures:
- `[assets]` directory — serves static files from the repo root
- `compatibility_date` — required by wrangler for Workers deployments

## Gotchas

- Do NOT remove `[assets]` from `wrangler.toml` — wrangler will fail with "Missing entry-point" error.
- The `functions/` directory is dead code — do not add new Pages Functions here, they won't run in Workers mode.
