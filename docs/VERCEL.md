# Vercel deployment

FINN supports Vercel using standard Next.js 16 and Node 24. The original Cloudflare/Vinext build remains available through `npm run build`.

Production: https://finn-investment-agent-iota.vercel.app

## Configuration

- `vercel.json` selects Next.js, `npm ci`, `npm run build:vercel`, and `.next`.
- `lib/runtime-env.ts` reads server-only process environment variables on Vercel. Vite aliases the same import to `runtime-env.cloudflare.ts` for the Worker build.
- `AI_API_KEY` is configured as a Vercel Secret. `AI_BASE_URL` and `AI_MODEL` are server-side configuration. They have no `NEXT_PUBLIC_` prefix.
- Research and refresh use Node functions with a 120-second execution allowance. The health route reads configuration dynamically rather than freezing key availability at build time.
- `unpdf` is external to the Next.js server bundle so its native ESM imports and PDF assets resolve under Node.
- `.vercelignore` excludes local keys, generated builds and deployment archives from uploaded source. `.vercel/` and local environment files are also ignored by Git.

## Deploy from this repository

```sh
npm ci
npm run build:vercel
vercel login
vercel link
vercel env add AI_API_KEY --environment production,preview --sensitive
vercel env add AI_BASE_URL --environment production,preview --no-sensitive
vercel env add AI_MODEL --environment production,preview --no-sensitive
vercel deploy --prod
```

Use `https://inference.hyde.tech/v1` and `hyde/glm-5.3-flash` for the last two values. Supply the API key through Vercel’s prompt or stdin, never a command argument or source file. The connected GitHub repository can also deploy new commits automatically.

## Verification

The standard Next.js production build, strict TypeScript checks, 15 domain/model checks and desktop/phone browser journeys passed locally. A Node research request retrieved eight passages and a cited Hyde answer without source warnings. Remote installation exposed missing exact-version children of an optional WASI package in the Windows-generated lockfile; the missing records were populated using official npm integrity metadata, and the runtime pinned to the tested Node 24 major. The Linux production build then passed.

The public production URL and health endpoint returned HTTP 200 without authentication. Both phone and desktop browser journeys also passed on the Vercel production deployment.
