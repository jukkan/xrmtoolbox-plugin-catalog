#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRAFT_DIR = path.join(__dirname, '..', 'src', 'data', 'newsletter', 'drafts');
const PUBLISHED_DIR = path.join(__dirname, '..', 'src', 'data', 'newsletter', 'published');
const INDEX_PATH = path.join(PUBLISHED_DIR, 'index.json');
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

function parseArgs(argv) {
  const options = { month: null, requireApproved: true };

  for (const arg of argv) {
    if (arg.startsWith('--month=')) {
      options.month = arg.slice('--month='.length);
      continue;
    }

    if (arg === '--allow-unapproved') {
      options.requireApproved = false;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/publish-newsletter-page.js --month=YYYY-MM [--allow-unapproved]');
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!options.month) {
    throw new Error('Missing required argument: --month=YYYY-MM');
  }

  if (!MONTH_PATTERN.test(options.month)) {
    throw new Error(`Invalid month "${options.month}". Expected YYYY-MM.`);
  }

  return options;
}

function readDraft(month) {
  const draftPath = path.join(DRAFT_DIR, `${month}.json`);
  if (!fs.existsSync(draftPath)) {
    throw new Error(`Draft file not found: ${draftPath}`);
  }

  const raw = fs.readFileSync(draftPath, 'utf8');
  return JSON.parse(raw);
}

function toPublishedMarkdown(draft) {
  const lines = [];
  lines.push(`# XrmToolBox Monthly Digest — ${draft.month}`);
  lines.push('');
  lines.push('## Highlights');
  for (const highlight of draft.highlights ?? []) {
    lines.push(`- ${highlight}`);
  }
  lines.push('');
  lines.push('## New Plugins');
  for (const plugin of draft.topNewPlugins ?? []) {
    lines.push(`- **${plugin.name}** (${plugin.author})`);
    lines.push(`  - ${plugin.rationale}`);
  }
  lines.push('');
  lines.push('## Updated Plugins');
  for (const plugin of draft.topUpdatedPlugins ?? []) {
    lines.push(`- **${plugin.name}** (${plugin.author})`);
    lines.push(`  - ${plugin.rationale}`);
  }
  lines.push('');
  lines.push(`_Published at ${new Date().toISOString()}_`);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function updateIndex(month, publishedAt) {
  let index = [];

  if (fs.existsSync(INDEX_PATH)) {
    index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
  }

  const withoutMonth = index.filter((item) => item.month !== month);
  withoutMonth.push({
    month,
    path: `src/data/newsletter/published/${month}.md`,
    publishedAt,
  });

  withoutMonth.sort((a, b) => b.month.localeCompare(a.month));
  fs.writeFileSync(INDEX_PATH, `${JSON.stringify(withoutMonth, null, 2)}\n`, 'utf8');
}

function run() {
  const options = parseArgs(process.argv.slice(2));
  const draft = readDraft(options.month);

  if (options.requireApproved && draft.reviewStatus !== 'approved') {
    throw new Error(`Draft reviewStatus must be "approved" to publish. Current: "${draft.reviewStatus ?? 'undefined'}"`);
  }

  if (!fs.existsSync(PUBLISHED_DIR)) {
    fs.mkdirSync(PUBLISHED_DIR, { recursive: true });
  }

  const markdownPath = path.join(PUBLISHED_DIR, `${options.month}.md`);
  const publishedAt = new Date().toISOString();

  fs.writeFileSync(markdownPath, toPublishedMarkdown(draft), 'utf8');
  updateIndex(options.month, publishedAt);

  console.log(`✅ Published newsletter content for ${options.month}`);
  console.log(`   Markdown: ${markdownPath}`);
  console.log(`   Index: ${INDEX_PATH}`);
}

run();
