#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRAFT_DIR = path.join(__dirname, '..', 'src', 'data', 'newsletter', 'drafts');
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const ALLOWED_STATUS = new Set(['draft', 'reviewed', 'approved', 'published']);

function parseArgs(argv) {
  const options = { month: null, requireApproved: false };

  for (const arg of argv) {
    if (arg.startsWith('--month=')) {
      options.month = arg.slice('--month='.length);
      continue;
    }

    if (arg === '--require-approved') {
      options.requireApproved = true;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/validate-newsletter-draft.js --month=YYYY-MM [--require-approved]');
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!options.month || !MONTH_PATTERN.test(options.month)) {
    throw new Error('A valid --month=YYYY-MM is required.');
  }

  return options;
}

function resolveDraftPath(month) {
  const nestedPath = path.join(DRAFT_DIR, month, 'draft.json');
  if (fs.existsSync(nestedPath)) {
    return nestedPath;
  }

  const flatPath = path.join(DRAFT_DIR, `${month}.json`);
  if (fs.existsSync(flatPath)) {
    return flatPath;
  }

  throw new Error(`Draft file not found for ${month}. Checked: ${nestedPath} and ${flatPath}`);
}

function readDraft(month) {
  const draftPath = resolveDraftPath(month);
  const raw = fs.readFileSync(draftPath, 'utf8');
  return { draft: JSON.parse(raw), draftPath };
}

function hasNonEmptyText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function getValueAtPath(root, fieldPath) {
  if (!hasNonEmptyText(fieldPath)) {
    return undefined;
  }

  const segments = fieldPath
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);

  let cursor = root;
  for (const segment of segments) {
    if (cursor === null || cursor === undefined || !(segment in cursor)) {
      return undefined;
    }
    cursor = cursor[segment];
  }

  return cursor;
}

function inferRequiredSections(draft) {
  if (Array.isArray(draft.highlights) && Array.isArray(draft.authorResearch)) {
    return [
      { path: 'highlights', type: 'non-empty-array' },
      { path: 'authorResearch', type: 'non-empty-array' },
      { path: 'useCaseSummary', type: 'text' },
      { path: 'editorialContext', type: 'text' },
    ];
  }

  if (draft.summaries || draft.editorial) {
    return [
      { path: 'summaries.new', type: 'non-empty-array' },
      { path: 'summaries.updated', type: 'non-empty-array' },
      { path: 'editorial.intro', type: 'text' },
      { path: 'editorial.outro', type: 'text' },
    ];
  }

  return [];
}

function inferExpectedAiClaimFields(draft) {
  const fields = [];

  if (Array.isArray(draft.highlights)) {
    draft.highlights.forEach((_, index) => fields.push(`highlights[${index}].insight`));
  }

  if (Array.isArray(draft.authorResearch)) {
    draft.authorResearch.forEach((_, index) => fields.push(`authorResearch[${index}].findings`));
  }

  if (hasNonEmptyText(draft.useCaseSummary)) {
    fields.push('useCaseSummary');
  }

  if (hasNonEmptyText(draft.editorialContext)) {
    fields.push('editorialContext');
  }

  if (Array.isArray(draft.summaries?.new)) {
    draft.summaries.new.forEach((_, index) => {
      fields.push(`summaries.new[${index}].summary`);
      fields.push(`summaries.new[${index}].useCase`);
    });
  }

  if (Array.isArray(draft.summaries?.updated)) {
    draft.summaries.updated.forEach((_, index) => {
      fields.push(`summaries.updated[${index}].summary`);
      fields.push(`summaries.updated[${index}].useCase`);
    });
  }

  if (hasNonEmptyText(draft.editorial?.intro)) {
    fields.push('editorial.intro');
  }

  if (hasNonEmptyText(draft.editorial?.outro)) {
    fields.push('editorial.outro');
  }

  return fields;
}

function validateRequiredSections(draft, errors) {
  const requiredSections = inferRequiredSections(draft);
  if (requiredSections.length === 0) {
    errors.push('Unable to infer required sections for this draft format.');
    return;
  }

  for (const section of requiredSections) {
    const value = getValueAtPath(draft, section.path);
    if (section.type === 'non-empty-array') {
      if (!Array.isArray(value) || value.length === 0) {
        errors.push(`Missing required section content: ${section.path}`);
      }
      continue;
    }

    if (section.type === 'text' && !hasNonEmptyText(value)) {
      errors.push(`Missing required section content: ${section.path}`);
    }
  }
}

function validateAiClaimReferences(draft, errors) {
  if (!Array.isArray(draft.aiClaims) || draft.aiClaims.length === 0) {
    errors.push('Missing aiClaims entries. Every AI-generated factual claim field must include references.');
    return;
  }

  const claimFields = new Set();

  draft.aiClaims.forEach((claim, index) => {
    if (!hasNonEmptyText(claim.field)) {
      errors.push(`aiClaims[${index}].field is required.`);
      return;
    }

    claimFields.add(claim.field);

    if (!hasNonEmptyText(claim.claim)) {
      errors.push(`aiClaims[${index}].claim is required.`);
    }

    if (getValueAtPath(draft, claim.field) === undefined) {
      errors.push(`aiClaims[${index}].field does not resolve to a draft field: ${claim.field}`);
    }

    if (!Array.isArray(claim.references) || claim.references.length === 0) {
      errors.push(`aiClaims[${index}].references must include at least one source.`);
      return;
    }

    claim.references.forEach((reference, refIndex) => {
      const hasUrl = hasNonEmptyText(reference?.url);
      const hasCitation = hasNonEmptyText(reference?.citation);
      if (!hasUrl && !hasCitation) {
        errors.push(`aiClaims[${index}].references[${refIndex}] needs url or citation.`);
      }
    });
  });

  const expectedFields = inferExpectedAiClaimFields(draft);
  for (const field of expectedFields) {
    if (!claimFields.has(field)) {
      errors.push(`Missing aiClaims coverage for AI-generated field: ${field}`);
    }
  }
}

function run() {
  const options = parseArgs(process.argv.slice(2));
  const { draft, draftPath } = readDraft(options.month);
  const errors = [];

  if (!ALLOWED_STATUS.has(draft.status)) {
    errors.push(`Invalid status "${draft.status ?? 'undefined'}". Allowed: draft, reviewed, approved, published.`);
  }

  if (options.requireApproved && draft.status !== 'approved') {
    errors.push(`Status must be "approved" for publish. Current: "${draft.status ?? 'undefined'}".`);
  }

  validateRequiredSections(draft, errors);
  validateAiClaimReferences(draft, errors);

  if (errors.length > 0) {
    console.error(`❌ Draft validation failed for ${options.month}`);
    console.error(`   Draft file: ${draftPath}`);
    for (const error of errors) {
      console.error(`   - ${error}`);
    }
    process.exit(1);
  }

  console.log(`✅ Draft validation passed for ${options.month}`);
  console.log(`   Draft file: ${draftPath}`);
}

run();
