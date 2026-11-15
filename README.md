# FINN

**Less noise. Better questions.** A mobile-first investment intelligence prototype by **Ishaan Bansal**, built for the ENAM AI Engineer Build Challenge.

FINN turns an 18-company mock portfolio into a source-linked attention list. The research desk audits management’s claims against reported outcomes and lets you ask questions about any NSE ticker with available primary documents.

- **Demo:** https://finn-ishaan-investment-intelligence.lakshay-iit27.chatgpt.site
- **Repository:** https://github.com/ishaanbansal05/finn-investment-agent
- [Product decisions and architecture](docs/ARCHITECTURE.md)
- [Three-minute demo script](docs/DEMO.md)
- [Validation and known limits](docs/VALIDATION.md)
- [Covering email](submission/COVERING_EMAIL.md)
- [AI build history](docs/AI_BUILD_HISTORY.md)
- [Actual user/assistant conversation export](docs/BUILD_CONVERSATION.md)

## Try this first

1. Open **The brief**. Change the time window, inspect a filing, then save its original source. The default week is intentional: the bundled snapshot was collected on Sunday 15 November 2026, with no disclosures in its last 24 hours.
2. Select **Follow the evidence**. Infosys grew FY25 revenue 4.2% in constant currency, below the final 4.5–5.0% guidance range. Every forecast targets the same full fiscal year; each links to its original call.
3. Check **Cash quality**. Reported FCF/net profit is 129.2%; management’s tax-refund-adjusted measure is 112%. Both facts matter.
4. Change **Signals** to a ±1% price threshold. The list updates immediately, with the reason and source for every trigger.
5. In **Research**, enter another NSE ticker and ask about cash conversion or explicit guidance. FINN discovers company reports through Screener, extracts PDF passages, and uses Hyde AI to synthesize a cited answer. Provider failures remain visible.

## Run locally

Requires Node **24+** and npm. The underlying framework is React + Vinext, a Vite implementation of the Next.js App Router, deployed as a Cloudflare Worker.

```sh
npm ci
```

Copy `.env.example` to `.dev.vars`, then set `AI_API_KEY` to your Hyde key. Both the dated portfolio and verified research cases work without a key; the general research pipeline can retrieve evidence without model synthesis.

```dotenv
AI_BASE_URL=https://inference.hyde.tech/v1
AI_MODEL=hyde/glm-5.3-flash
AI_API_KEY=your-key
```

```sh
npm run dev
# http://127.0.0.1:5173
```

```sh
npm run typecheck
npm test
npx playwright install chromium
npm run test:browser  # requires the dev server
npm run build
npm start             # serves the built Worker locally
```

To regenerate the bundled real-data snapshot:

```sh
npm run data:sync
```

The snapshot records capture time, session date, source URLs and per-company provider status. Exchange data may be incomplete; the adapter requests up to 150 recent items for each symbol and the bundle retains 30 days. The current bundle contains 18 EOD series and 258 announcements.

## Deliberate scope

Two polished workflows: a portfolio attention queue and evidence-grounded research. Four verified FY25 research cases: INFY, TCS, WIPRO, HCLTECH. Historical research dates are displayed separately from the current filing snapshot. Live research follows the same document discovery and retrieval path for arbitrary valid NSE symbols; no ticker-specific analysis is generated from model memory.

No background notification infrastructure, trade execution, price targets, OCR, automated biography enrichment or general-purpose financial-table extraction. EBITDA is left unavailable where the chosen source table only reports operating profit. Those are deliberate boundaries, not mocked functionality.

## Implementation map

```text
components/finn-app.tsx    Responsive brief, research, signals, portfolio, evidence dialogs
styles/finn.css            Mobile-first interaction layout and visual system
lib/domain.ts              Classification, financial comparisons, windows, alerts
lib/providers.ts           Yahoo EOD and NSE adapters, bounded cache/concurrency
lib/research.ts            Primary-document discovery, PDF extraction, retrieval, Hyde synthesis
lib/server-config.ts       Server-only secrets and demo request limits
app/api/                  Snapshot, live refresh, discovery, research, health
data/                     Real portfolio snapshot + audited research evidence
tests/                    Financial/data checks and phone/desktop browser journeys
docs/                     Architecture, evidence policy, demo, validation, AI history
submission/               Ready-to-review covering email and submission checklist
```

No secret is required in browser code or source control. The hosted key is a server-side runtime secret. A per-isolate request limit reduces accidental API usage; use a durable global quota and authentication before operating beyond a small assessment demo.
