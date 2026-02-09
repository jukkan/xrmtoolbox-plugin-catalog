# Newsletter drafts

Agentic proof-of-concept drafts are written to month folders with deterministic artifact names:

- `src/data/newsletter/drafts/<YYYY-MM>/draft.json`
- `src/data/newsletter/drafts/<YYYY-MM>/draft.md`

This keeps monthly snapshot data separate from generated copy while making CI outputs predictable and easy to diff.


Draft JSON files must include a `status` field (`draft`, `reviewed`, `approved`, `published`) and `aiClaims` entries with source references for every AI-generated factual claim.
