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

function validateRequiredSections(draft, errors) {
  if (Array.isArray(draft.highlights)) {
    const required = ['highlights', 'topNewPlugins', 'topUpdatedPlugins', 'editorialNotes'];
    for (const section of required) {
      if (!Array.isArray(draft[section]) || draft[section].length === 0) {
        errors.push(`Missing required section content: ${section}`);
      }
    }
    return;
  }

  const required = ['summaries.new', 'summaries.updated', 'editorial.intro', 'editorial.outro'];
  if (!Array.isArray(draft.summaries?.new) || draft.summaries.new.length === 0) {
    errors.push('Missing required section content: summaries.new');
  }
  if (!Array.isArray(draft.summaries?.updated) || draft.summaries.updated.length === 0) {
    errors.push('Missing required section content: summaries.updated');
  }
  if (!hasNonEmptyText(draft.editorial?.intro)) {
    errors.push('Missing required section content: editorial.intro');
  }
  if (!hasNonEmptyText(draft.editorial?.outro)) {
    errors.push('Missing required section content: editorial.outro');
  }

  if (required.length === 0) {
    errors.push('No required sections were defined for validation.');
  }
}

function validateAiClaimReferences(draft, errors) {
  if (!Array.isArray(draft.aiClaims) || draft.aiClaims.length === 0) {
    errors.push('Missing aiClaims entries. Every AI-generated factual claim field must include references.');
    return;
  }

  draft.aiClaims.forEach((claim, index) => {
    if (!hasNonEmptyText(claim.field)) {
      errors.push(`aiClaims[${index}].field is required.`);
    }
    if (!hasNonEmptyText(claim.claim)) {
      errors.push(`aiClaims[${index}].claim is required.`);
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
