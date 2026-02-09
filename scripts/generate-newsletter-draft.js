#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONTHLY_DIR = path.join(__dirname, '..', 'src', 'data', 'monthly');
const DRAFT_DIR = path.join(__dirname, '..', 'src', 'data', 'newsletter', 'drafts');
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

function parseArgs(argv) {
  const options = { month: null };

  for (const arg of argv) {
    if (arg.startsWith('--month=')) {
      options.month = arg.slice('--month='.length);
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/generate-newsletter-draft.js [--month=YYYY-MM]');
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function resolveMonth(inputMonth) {
  const month = inputMonth ?? new Date().toISOString().slice(0, 7);
  if (!MONTH_PATTERN.test(month)) {
    throw new Error(`Invalid month "${month}". Expected YYYY-MM.`);
  }

  return month;
}

function readSnapshot(month) {
  const snapshotPath = path.join(MONTHLY_DIR, `${month}.json`);
  if (!fs.existsSync(snapshotPath)) {
    throw new Error(`Monthly snapshot missing: ${snapshotPath}`);
  }

  const raw = fs.readFileSync(snapshotPath, 'utf8');
  return JSON.parse(raw);
}

function summarizePlugin(plugin, listType, index) {
  const rank = index + 1;
  const downloads = plugin.ranking?.totalDownloads ?? 0;
  const rating = plugin.ranking?.averageRating ?? null;
  const ratingText = typeof rating === 'number' ? ` with a ${rating.toFixed(1)}/5 rating` : '';

  return {
    rank,
    pluginId: plugin.mctools_pluginid,
    name: plugin.name,
    author: plugin.author,
    rationale: `#${rank} ${listType} this month by community interest with ${downloads.toLocaleString()} total downloads${ratingText}.`,
  };
}

function buildDraft(snapshot) {
  const topNew = (snapshot.newPlugins ?? []).slice(0, 5).map((plugin, index) => summarizePlugin(plugin, 'launched', index));
  const topUpdated = (snapshot.updatedPlugins ?? []).slice(0, 5).map((plugin, index) => summarizePlugin(plugin, 'was updated', index));

  const highlights = [
    `New plugins this month: ${snapshot.counts?.newPlugins ?? 0}`,
    `Updated plugins this month: ${snapshot.counts?.updatedPlugins ?? 0}`,
    'Verify highlighted plugins against release notes before publish.',
  ];

  const month = snapshot.month;
  const draft = {
    month,
    generatedAt: new Date().toISOString(),
    reviewStatus: 'draft',
    sourceSnapshot: `src/data/monthly/${month}.json`,
    highlights,
    topNewPlugins: topNew,
    topUpdatedPlugins: topUpdated,
    editorialNotes: [
      'AI-enriched draft generated automatically from monthly snapshot rankings.',
      'Replace rationale text with editor-approved commentary before moving to in_review.',
    ],
  };

  return draft;
}

function toMarkdown(draft) {
  const lines = [];
  lines.push(`# XrmToolBox Monthly Digest: ${draft.month}`);
  lines.push('');
  lines.push(`- Generated at: ${draft.generatedAt}`);
  lines.push(`- Review status: ${draft.reviewStatus}`);
  lines.push('');
  lines.push('## Highlights');
  for (const highlight of draft.highlights) {
    lines.push(`- ${highlight}`);
  }

  lines.push('');
  lines.push('## Top New Plugins');
  if (draft.topNewPlugins.length === 0) {
    lines.push('- No new plugins detected this month.');
  } else {
    for (const plugin of draft.topNewPlugins) {
      lines.push(`- **${plugin.name}** (${plugin.author}) — ${plugin.rationale}`);
    }
  }

  lines.push('');
  lines.push('## Top Updated Plugins');
  if (draft.topUpdatedPlugins.length === 0) {
    lines.push('- No updated plugins detected this month.');
  } else {
    for (const plugin of draft.topUpdatedPlugins) {
      lines.push(`- **${plugin.name}** (${plugin.author}) — ${plugin.rationale}`);
    }
  }

  lines.push('');
  lines.push('## Editorial Notes');
  for (const note of draft.editorialNotes) {
    lines.push(`- ${note}`);
  }

  lines.push('');
  return `${lines.join('\n')}\n`;
}

function writeDraftFiles(draft) {
  if (!fs.existsSync(DRAFT_DIR)) {
    fs.mkdirSync(DRAFT_DIR, { recursive: true });
  }

  const jsonPath = path.join(DRAFT_DIR, `${draft.month}.json`);
  const markdownPath = path.join(DRAFT_DIR, `${draft.month}.md`);

  fs.writeFileSync(jsonPath, `${JSON.stringify(draft, null, 2)}\n`, 'utf8');
  fs.writeFileSync(markdownPath, toMarkdown(draft), 'utf8');

  return { jsonPath, markdownPath };
}

function run() {
  const options = parseArgs(process.argv.slice(2));
  const month = resolveMonth(options.month);
  const snapshot = readSnapshot(month);
  const draft = buildDraft(snapshot);
  const files = writeDraftFiles(draft);

  console.log(`✅ Generated newsletter draft for ${month}`);
  console.log(`   JSON: ${files.jsonPath}`);
  console.log(`   Markdown: ${files.markdownPath}`);
}

run();
