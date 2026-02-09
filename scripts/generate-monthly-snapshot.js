#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLUGINS_PATH = path.join(__dirname, '..', 'src', 'data', 'plugins.json');
const MONTHLY_DIR = path.join(__dirname, '..', 'src', 'data', 'monthly');
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

function parseArgs(argv) {
  const options = {
    month: null,
    ci: false,
  };

  for (const arg of argv) {
    if (arg.startsWith('--month=')) {
      options.month = arg.slice('--month='.length);
      continue;
    }

    if (arg === '--ci') {
      options.ci = true;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/generate-monthly-snapshot.js [--month=YYYY-MM] [--ci]');
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

function readPlugins() {
  const raw = fs.readFileSync(PLUGINS_PATH, 'utf8');
  const parsed = JSON.parse(raw);

  if (!parsed || !Array.isArray(parsed.value)) {
    throw new Error('Invalid plugins.json format. Expected OData structure with a value array.');
  }

  return parsed.value;
}

function getMonthKey(dateValue) {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 7);
}

function daysSince(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const diffMs = Date.now() - date.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function toSnapshotPlugin(plugin, releaseDateField) {
  const totalDownloads = Number(plugin.mctools_totaldownloadcount ?? 0);
  const averageRating = Number.parseFloat(plugin.mctools_averagefeedbackratingallversions ?? '0');
  const releaseDate = plugin[releaseDateField] ?? null;

  return {
    mctools_pluginid: plugin.mctools_pluginid,
    name: plugin.mctools_name,
    author: plugin.mctools_authors,
    ranking: {
      totalDownloads: Number.isFinite(totalDownloads) ? totalDownloads : 0,
      averageRating: Number.isFinite(averageRating) ? averageRating : null,
      ratingDelta: null,
      recencyDays: daysSince(releaseDate),
      releaseDate,
    },
  };
}

function comparePlugins(a, b) {
  const aDownloads = a.ranking.totalDownloads ?? 0;
  const bDownloads = b.ranking.totalDownloads ?? 0;

  if (bDownloads !== aDownloads) {
    return bDownloads - aDownloads;
  }

  const aRating = a.ranking.averageRating ?? 0;
  const bRating = b.ranking.averageRating ?? 0;
  if (bRating !== aRating) {
    return bRating - aRating;
  }

  return (a.name ?? '').localeCompare(b.name ?? '');
}

function buildSnapshot(plugins, month) {
  const newPlugins = [];
  const updatedPlugins = [];

  for (const plugin of plugins) {
    const firstReleaseMonth = getMonthKey(plugin.mctools_firstreleasedate);
    const latestReleaseMonth = getMonthKey(plugin.mctools_latestreleasedate);

    if (firstReleaseMonth === month) {
      newPlugins.push(toSnapshotPlugin(plugin, 'mctools_firstreleasedate'));
    }

    if (latestReleaseMonth === month && firstReleaseMonth !== month) {
      updatedPlugins.push(toSnapshotPlugin(plugin, 'mctools_latestreleasedate'));
    }
  }

  newPlugins.sort(comparePlugins);
  updatedPlugins.sort(comparePlugins);

  return {
    month,
    generatedAt: new Date().toISOString(),
    counts: {
      newPlugins: newPlugins.length,
      updatedPlugins: updatedPlugins.length,
    },
    newPlugins,
    updatedPlugins,
  };
}

function writeSnapshot(snapshot, month) {
  if (!fs.existsSync(MONTHLY_DIR)) {
    fs.mkdirSync(MONTHLY_DIR, { recursive: true });
  }

  const outputPath = path.join(MONTHLY_DIR, `${month}.json`);
  fs.writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  return outputPath;
}

function run() {
  const options = parseArgs(process.argv.slice(2));
  const month = resolveMonth(options.month);
  const plugins = readPlugins();

  const snapshot = buildSnapshot(plugins, month);
  const outputPath = writeSnapshot(snapshot, month);

  console.log(`✅ Generated monthly snapshot: ${month}`);
  console.log(`   File: ${outputPath}`);
  console.log(`   New plugins: ${snapshot.counts.newPlugins}`);
  console.log(`   Updated plugins: ${snapshot.counts.updatedPlugins}`);

  if (options.ci && snapshot.counts.newPlugins === 0 && snapshot.counts.updatedPlugins === 0) {
    console.warn('⚠️  Snapshot contains no new or updated plugins for the target month.');
  }
}

run();
