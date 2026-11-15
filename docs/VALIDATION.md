# Validation record

Validated on 15 November 2026 on Windows, Node 24.13.0.

Vercel deployment: https://finn-investment-agent-iota.vercel.app. The Linux Next.js production build passed on Node 24. Public phone and desktop browser journeys passed without authentication; the health endpoint returned HTTP 200 with AI configured. See [deployment details](VERCEL.md).

- TypeScript strict type check passed.
- Production Cloudflare Worker build passed.
- 15 data/domain/model-contract checks passed: comparison denominators; current-session exclusion from volume baseline; result-vs-ad classification; IST timestamp conversion; symbol validation; time-window boundaries and future filtering; attachment deduplication; threshold effects and stable IDs; mock-weight reconciliation; document discovery exclusions; page-preserving retrieval; public HTTPS URL checks; bounded low-effort model requests; invalid citations/empty output; rejection of truncated answers.
- Chromium desktop (1440×1000) and phone (iPhone 13 profile, 390px wide) journeys passed: source dialog, original attachment, bookmark, quiet time window, guidance ledger and source page, financial comparison table, cash caveat, threshold changes, local persistence, 18-company portfolio and absence of horizontal page overflow. No browser runtime errors in those journeys.
- Hyde model authentication and generated content verified; no key printed or committed.
- HCLTECH live research retrieved eight passages from official transcripts and produced a model answer with valid citation IDs and token usage. The report exceeded the 12 MB bound and was explicitly reported as unreadable; no report-derived claim was silently inferred.
- KPITTECH, outside the four verified dossiers, completed general live retrieval with eight passages from an annual report and transcripts, no source warnings, and a cited model response. This test exposed a cash-conversion inference with missing comparable profit; the prompt was tightened to require abstention when matching OCF and net profit are not both present.
- Public Yahoo and NSE adapters fetched all 18 companies. The bundle captured 258 announcements within 30 days. These are provider observations, not a completeness guarantee.
- Public hosted phone and desktop browser journeys also passed, without signing in. Public GitHub, README, covering email and both AI-history documents returned HTTP 200.
- The first hosted research request successfully extracted eight passages but exhausted the model's answer budget. Official Z.ai documentation confirmed GLM-5.3 defaults to maximum reasoning effort. Setting `reasoning_effort: low` produced a cited KPITTECH answer in approximately four seconds with 407 output tokens in the local verification. Truncated model responses are explicitly rejected; evidence remains available.

## Known limits

The verified dossiers are historical FY25 analysis. Live-source results can differ as documents and symbols change. Large/scanned PDFs, anti-bot controls, source outages and PDF text order can reduce coverage. Citation ID validation does not prove a claim follows from the cited passage. Classification is rule-based and can miss financial context. There is no automated attachment-table extraction on all pushed result filings, incoming-person biography lookup, background scheduler or notification delivery service.

The default window is seven days because the snapshot was collected on a Sunday with no filings in the preceding 24 hours. The 24-hour setting remains available and correctly returns an empty result. Signals use the most recent completed trading session and the preceding week of announcements.

Screenshots are in `docs/screenshots/`. Browser tests require a running server. Live provider/model calls are intentionally separate from deterministic tests so the repository tests do not need secrets or unstable upstream services.
