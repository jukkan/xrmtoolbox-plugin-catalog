# Newsletter Automation (Current Implementation)

This document captures the **current** monthly newsletter implementation in this repository so it is easy to resume and refine later.

> Scope note: this describes what is implemented now (draft + publish automation, scoring, validation, and site pages).

## 1) End-to-end flow

The newsletter process currently follows a two-stage flow:

1. Build (or reuse) a monthly snapshot from `src/data/plugins.json`.
2. Generate a newsletter draft (`draft` status).
3. Open a PR with draft artifacts for human review.
4. Validate that the draft is approved and has source-backed AI claims.
5. Publish generated markdown to `src/data/newsletter/published/`.
6. Deploy to GitHub Pages through the existing Pages deployment workflow.

## 2) Main workflow and schedule

### Workflow: `Newsletter Draft & Publish`
- File: `.github/workflows/newsletter-draft.yml`
- Triggers:
  - Manual: `workflow_dispatch` with inputs:
    - `stage`: `draft` or `publish`
    - `month`: optional `YYYY-MM`
  - Scheduled: `0 8 1 * *` (08:00 UTC on day 1 of each month)
  - PR close on `main` when `src/data/newsletter/drafts/**` changes (for publish stage logic)

### Stage A: Draft generation
- Resolve target month.
- Build monthly snapshot if missing.
- Generate newsletter draft.
- Open PR with draft files.

### Stage B: Publish content
- Resolve approved month.
- Validate draft with `--require-approved`.
- Publish static markdown output.
- Commit published files.

## 3) Core scripts and responsibilities

### Snapshot generation
- Script: `scripts/generate-monthly-snapshot.js`
- Input: `src/data/plugins.json`
- Output: `src/data/monthly/<YYYY-MM>.json`
- Logic:
  - `newPlugins`: first release date falls in target month.
  - `updatedPlugins`: latest release date falls in target month, excluding same-month first releases.
- CLI:
  - `--month=YYYY-MM`
  - `--ci` (warn when no new/updated items)

### Basic draft generation (deterministic)
- Script: `scripts/generate-newsletter-draft.js`
- Input: `src/data/monthly/<YYYY-MM>.json`
- Output:
  - `src/data/newsletter/drafts/<YYYY-MM>.json`
  - `src/data/newsletter/drafts/<YYYY-MM>.md`
- Logic:
  - Takes top 5 new + top 5 updated entries.
  - Generates short rationale lines and editorial notes.
  - Sets `status: draft` and writes `aiClaims` with references to source snapshot.

### Agentic draft generation (proof-of-concept)
- Script: `scripts/generate-newsletter-agentic-draft.js`
- Inputs:
  - `src/data/monthly/<YYYY-MM>.json`
  - `.github/newsletter/ranking-heuristics.json`
  - `.github/newsletter/prompts/*.md`
- Output:
  - `src/data/newsletter/drafts/<YYYY-MM>/draft.json`
  - `src/data/newsletter/drafts/<YYYY-MM>/draft.md`
- Logic:
  - Select candidates with deterministic scoring and tie-breakers.
  - Build summary + use-case text.
  - Build intro/outro editorial context.
  - Record process metadata and `aiClaims` references.

### Draft validation
- Script: `scripts/validate-newsletter-draft.js`
- Validates:
  - Allowed status values.
  - Required sections for known draft formats.
  - AI claim coverage and source references.
- CLI:
  - `--month=YYYY-MM`
  - `--require-approved` (used before publish)

### Publish
- Script: `scripts/publish-newsletter-page.js`
- Reads draft (flat or nested location), requires approved status by default.
- Writes:
  - `src/data/newsletter/published/<YYYY-MM>.md`
  - `src/data/newsletter/published/index.json`

## 4) Scoring and selection controls

### Agentic ranking heuristics
- File: `.github/newsletter/ranking-heuristics.json`
- Controls:
  - `selection.maxNew`, `selection.maxUpdated`
  - scoring weights (`downloadsLog10`, `averageRating`, `recencyBoost`, `newPluginBonus`)
  - `recencyWindowDays`
  - tie-breakers

### Prompt contracts
- Files:
  - `.github/newsletter/prompts/01-select-candidates.md`
  - `.github/newsletter/prompts/02-summarize-use-cases.md`
  - `.github/newsletter/prompts/03-editorial-intro-outro.md`
- These define the deterministic, auditable contract used by the agentic POC flow.

## 5) Frontend newsletter pages

### Routes
- Defined in `src/App.tsx`:
  - `/newsletter` (archive)
  - `/newsletter/:month` (single month)

### Pages
- `src/pages/NewsletterArchivePage.tsx`
- `src/pages/NewsletterPage.tsx`

### Current data source used by pages
- The current pages read from `src/data/monthly/*.json` via `src/data/monthly/index.ts`.
- They do **not** currently render published markdown from `src/data/newsletter/published/`.

## 6) Data models and schema

- Type model (planned editorial shape): `src/types/newsletter.ts`
- JSON schema (draft validation target structure): `src/data/newsletter/schema/newsletter-draft.schema.json`
- Draft location/readme notes: `src/data/newsletter/drafts/README.md`

## 7) NPM commands

From `package.json`:

- `npm run generate-monthly-snapshot`
- `npm run generate-monthly-snapshot:ci`
- `npm run generate-newsletter-draft`
- `npm run generate-newsletter-agentic-draft`
- `npm run validate-newsletter-draft`
- `npm run publish-newsletter-page`

## 8) Practical "run now" examples

```bash
# Generate monthly snapshot
node scripts/generate-monthly-snapshot.js --month=2026-01

# Generate deterministic draft
node scripts/generate-newsletter-draft.js --month=2026-01

# Generate agentic POC draft
node scripts/generate-newsletter-agentic-draft.js --month=2026-01

# Validate draft (structure + AI claim references)
node scripts/validate-newsletter-draft.js --month=2026-01

# Validate publish readiness (must be approved)
node scripts/validate-newsletter-draft.js --month=2026-01 --require-approved

# Publish content from approved draft
node scripts/publish-newsletter-page.js --month=2026-01
```

## 9) Current known implementation notes

- There are currently two draft formats/paths (flat and nested); validation and publish scripts support both.
- Approval gate is enforced during publish stage (`--require-approved`).
- Agentic workflow currently uploads generated artifacts for review and can be used as a controlled POC path.

---

If/when you refine the newsletter content quality, this file is the quick index to where logic lives today.
