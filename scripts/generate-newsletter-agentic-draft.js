#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.join(__dirname, '..');

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const MONTHLY_DIR = path.join(REPO_ROOT, 'src', 'data', 'monthly');
const DRAFTS_ROOT = path.join(REPO_ROOT, 'src', 'data', 'newsletter', 'drafts');
const HEURISTICS_PATH = path.join(REPO_ROOT, '.github', 'newsletter', 'ranking-heuristics.json');

function parseArgs(argv) {
  const options = { month: null };

  for (const arg of argv) {
    if (arg.startsWith('--month=')) {
      options.month = arg.slice('--month='.length);
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/generate-newsletter-agentic-draft.js --month=YYYY-MM');
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!options.month || !MONTH_PATTERN.test(options.month)) {
    throw new Error('A valid --month=YYYY-MM is required.');
  }

  return options;
}

function readJson(jsonPath) {
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

function loadSnapshot(month) {
  const snapshotPath = path.join(MONTHLY_DIR, `${month}.json`);
  if (!fs.existsSync(snapshotPath)) {
    throw new Error(`Monthly snapshot missing: ${snapshotPath}`);
  }

  return { snapshot: readJson(snapshotPath), snapshotPath };
}

function loadPrompts() {
  const files = [
    '01-select-candidates.md',
    '02-summarize-use-cases.md',
    '03-editorial-intro-outro.md',
  ];

  return files.map((file) => {
    const relPath = path.join('.github', 'newsletter', 'prompts', file);
    const absPath = path.join(REPO_ROOT, relPath);
    return {
      file: relPath,
      content: fs.readFileSync(absPath, 'utf8').trim(),
    };
  });
}

function toNumber(value, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function scorePlugin(plugin, heuristics, isNew) {
  const ranking = plugin.ranking ?? {};
  const downloads = toNumber(ranking.totalDownloads, 0);
  const averageRating = toNumber(ranking.averageRating, 0);
  const recencyDays = toNumber(ranking.recencyDays, heuristics.recencyWindowDays);

  const downloadsComponent = Math.log10(downloads + 1) * heuristics.weights.downloadsLog10;
  const ratingComponent = averageRating * heuristics.weights.averageRating;
  const recencyComponent = Math.max(0, heuristics.recencyWindowDays - recencyDays) * heuristics.weights.recencyBoost;
  const newBonusComponent = isNew ? heuristics.weights.newPluginBonus : 0;
  const score = downloadsComponent + ratingComponent + recencyComponent + newBonusComponent;

  return {
    score: Number(score.toFixed(4)),
    breakdown: {
      downloadsComponent: Number(downloadsComponent.toFixed(4)),
      ratingComponent: Number(ratingComponent.toFixed(4)),
      recencyComponent: Number(recencyComponent.toFixed(4)),
      newBonusComponent: Number(newBonusComponent.toFixed(4)),
    },
  };
}

function sortCandidates(candidates) {
  return candidates.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    if (a.name !== b.name) {
      return a.name.localeCompare(b.name);
    }

    return a.pluginId.localeCompare(b.pluginId);
  });
}

function selectCandidates(snapshot, heuristics) {
  const withScore = (plugins, isNew) =>
    plugins.map((plugin) => {
      const scoring = scorePlugin(plugin, heuristics, isNew);
      return {
        pluginId: plugin.mctools_pluginid,
        name: plugin.name,
        author: plugin.author,
        ranking: plugin.ranking ?? {},
        score: scoring.score,
        scoreBreakdown: scoring.breakdown,
      };
    });

  const newCandidates = sortCandidates(withScore(snapshot.newPlugins ?? [], true)).slice(0, heuristics.selection.maxNew);
  const updatedCandidates = sortCandidates(withScore(snapshot.updatedPlugins ?? [], false)).slice(0, heuristics.selection.maxUpdated);

  return { new: newCandidates, updated: updatedCandidates };
}

function ratingText(value) {
  return value > 0 ? `${value.toFixed(1)}/5` : 'unrated';
}

function summarizeCandidate(candidate, bucketLabel) {
  const ranking = candidate.ranking ?? {};
  const downloads = toNumber(ranking.totalDownloads, 0).toLocaleString();
  const rating = ratingText(toNumber(ranking.averageRating, 0));
  const recencyDays = toNumber(ranking.recencyDays, 0);

  return {
    pluginId: candidate.pluginId,
    name: candidate.name,
    author: candidate.author,
    score: candidate.score,
    summary: `${candidate.name} by ${candidate.author} is a ${bucketLabel} highlight with ${downloads} downloads and a ${rating} community rating.`,
    useCase: `Use ${candidate.name} when your team needs a proven option that was active within the last ${recencyDays} days.`,
  };
}

function buildEditorial(month, snapshot, summaries) {
  const leadNew = summaries.new[0]?.name ?? 'community tools';
  const leadUpdated = summaries.updated[0]?.name ?? 'core plugins';

  const intro = [
    `Welcome to the ${month} XrmToolBox digest.`,
    `This month we tracked ${snapshot.counts?.newPlugins ?? 0} new plugins and ${snapshot.counts?.updatedPlugins ?? 0} updated plugins.`,
    `Top picks include ${leadNew} and ${leadUpdated}, selected with deterministic ranking heuristics for repeatable output.`,
  ].join(' ');

  const outro = 'Before publication, validate each highlighted item against release notes and add editor commentary where needed.';

  return { intro, outro };
}

function toMarkdown(draft) {
  const lines = [];
  lines.push(`# XrmToolBox Monthly Digest Draft (${draft.month})`);
  lines.push('');
  lines.push('## Editorial Intro');
  lines.push(draft.editorial.intro);
  lines.push('');
  lines.push('## Top New Plugins');
  if (draft.summaries.new.length === 0) {
    lines.push('- No new plugin candidates selected.');
  } else {
    for (const item of draft.summaries.new) {
      lines.push(`- **${item.name}** (${item.author})`);
      lines.push(`  - Summary: ${item.summary}`);
      lines.push(`  - Use case: ${item.useCase}`);
    }
  }

  lines.push('');
  lines.push('## Top Updated Plugins');
  if (draft.summaries.updated.length === 0) {
    lines.push('- No updated plugin candidates selected.');
  } else {
    for (const item of draft.summaries.updated) {
      lines.push(`- **${item.name}** (${item.author})`);
      lines.push(`  - Summary: ${item.summary}`);
      lines.push(`  - Use case: ${item.useCase}`);
    }
  }

  lines.push('');
  lines.push('## Editorial Outro');
  lines.push(draft.editorial.outro);
  lines.push('');

  return `${lines.join('\n')}\n`;
}

function writeDraft(month, draft) {
  const monthDir = path.join(DRAFTS_ROOT, month);
  fs.mkdirSync(monthDir, { recursive: true });

  const jsonPath = path.join(monthDir, 'draft.json');
  const markdownPath = path.join(monthDir, 'draft.md');

  fs.writeFileSync(jsonPath, `${JSON.stringify(draft, null, 2)}\n`, 'utf8');
  fs.writeFileSync(markdownPath, toMarkdown(draft), 'utf8');

  return { jsonPath, markdownPath };
}

function run() {
  const options = parseArgs(process.argv.slice(2));
  const heuristics = readJson(HEURISTICS_PATH);
  const prompts = loadPrompts();
  const { snapshot, snapshotPath } = loadSnapshot(options.month);
  const candidates = selectCandidates(snapshot, heuristics);

  const summaries = {
    new: candidates.new.map((candidate) => summarizeCandidate(candidate, 'new')),
    updated: candidates.updated.map((candidate) => summarizeCandidate(candidate, 'notable update')),
  };

  const editorial = buildEditorial(options.month, snapshot, summaries);

  const draft = {
    month: options.month,
    generatedAt: snapshot.generatedAt,
    sourceSnapshot: path.relative(REPO_ROOT, snapshotPath).replaceAll(path.sep, '/'),
    process: {
      type: 'agentic-proof-of-concept',
      prompts,
      heuristicsPath: '.github/newsletter/ranking-heuristics.json',
      steps: [
        'select top candidates (new + notable updates)',
        'produce short summaries/use-cases',
        'draft editorial intro/outro',
      ],
    },
    candidates,
    summaries,
    editorial,
  };

  const output = writeDraft(options.month, draft);
  console.log(`✅ Agentic newsletter draft generated for ${options.month}`);
  console.log(`   JSON: ${output.jsonPath}`);
  console.log(`   Markdown: ${output.markdownPath}`);
}

run();
