To: assessment@enam.com
Subject: IIT Delhi – AI Engineer - 2027

Dear ENAM team,

I’m submitting FINN, a mobile-first investment intelligence prototype built around two questions: “What changed that deserves my attention?” and “Did management deliver what it promised?”

Demo: https://finn-investment-agent-iota.vercel.app
Repository: https://github.com/ishaanbansal05/finn-investment-agent

The brief monitors an 18-company mock portfolio using real EOD prices and NSE announcements. It ranks events, collapses routine paperwork, supports configurable price/volume/category signals, and keeps the source behind every item inspectable.

The signature research workflow is a promise ledger. Infosys delivered 4.2% FY25 constant-currency growth against final guidance of 4.5–5.0%. FINN traces each forecast revision to its original call and compares the same horizon and accounting basis. The cash view adds a second check: 129.2% reported FCF conversion versus management’s 112% excluding tax refunds. Historical research dates are explicit and separate from the current portfolio snapshot.

For other NSE tickers, FINN discovers annual reports and transcripts, extracts page-linked evidence and uses Hyde GLM for a cited answer. Deterministic rules handle bulk work; the model runs only when reasoning is requested. Retrieval caches, bounded source reads and an extractive fallback keep cost and failure behavior visible.

I deliberately left out trade execution, background notification delivery, OCR and universal financial-table extraction. I prioritized a working attention queue and an auditable research interaction. Next I would persist immutable document versions, add a durable ingestion/alert ledger, and evaluate financial extraction and claim entailment against analyst-reviewed examples.

The repository includes setup instructions, validation results and a three-minute demo guide. I used Codex throughout the build.

Regards,
Ishaan Bansal
https://github.com/ishaanbansal05
