# AI-assisted build history

This project was built by Ishaan Bansal with OpenAI Codex. AI assistance was requested for the entire implementation; this disclosure is intentional because the challenge explicitly asks how candidates work with coding agents.

The accompanying `BUILD_CONVERSATION.md` is an export of the actual visible user/assistant messages available in the local Codex session. System/developer instructions, internal model reasoning, credentials and raw tool payloads are excluded. It is not a fabricated transcript. The repository and the conversation record are complementary: the source shows the implementation; the conversation shows requirements, user decisions and progress reports.

## Work performed with the agent

1. Read both supplied PDFs with local PDF text extraction. Treated the brief as task requirements and the glossary as reference material.
2. Chose a portfolio attention queue and a promise-vs-delivery research workflow. Requested the candidate name, deadline, GitHub identity and model provider.
3. Researched official Infosys, Wipro, TCS and HCLTech annual reports/calls. Bounded research agents supplied primary-source evidence records. Accounting and time-horizon caveats were retained.
4. Built public EOD and NSE adapters. Diagnosed NSE’s domain redirect. Replaced a stale ticker with M&M to retain 18 observable companies. Captured source status rather than fabricating provider availability.
5. Implemented the React interface, mobile layouts, deterministic signal rules, evidence dialogs, historical dossiers and general PDF research pipeline.
6. Integrated Hyde’s documented OpenAI-compatible API, using the key entered locally by the user. Verified actual generation, then configured the hosted key as a runtime secret.
7. Ran type checking, domain tests, the production build and real browser journeys. Fixed Cloudflare fetch-mode differences, PDF redirects, hydration timing in tests and a text encoding issue. Recorded provider-size limitations.
8. Prepared deployment, repository publication, the covering email, demo script and engineering notes.

## Human decisions captured

- Candidate: Ishaan Bansal; GitHub account: `ishaanbansal05`.
- Time budget communicated by the candidate: approximately 2 hours 15 minutes from the initial clarification reply.
- Model provider and model selected by the candidate: Hyde, `hyde/glm-5.3-flash`.
- Candidate supplied the API key through an ignored local environment file.
- Candidate requested a hosted demo and GitHub repository and explicitly authorized public reviewer access.

No claim is made that the candidate manually authored every line. Before submitting, the candidate should follow the demo and read the architecture notes closely enough to explain the decisions, evidence limits and trade-offs in an interview.
