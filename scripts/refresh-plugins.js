#!/usr/bin/env node

/**
 * Script to refresh plugins.json from the XrmToolBox OData feed
 * Source: https://www.xrmtoolbox.com/_odata/plugins
 *
 * This script fetches the latest plugin data and updates src/data/plugins.json
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ODATA_URL = 'https://www.xrmtoolbox.com/_odata/plugins';
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'plugins.json');

/**
 * Fetch data from URL using native https module
 */
function fetchData(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'XrmToolBox-Plugin-Catalog-Refresh/1.0'
      }
    };

    https.get(url, options, (res) => {
      let data = '';

      // Check for successful response
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Main function to refresh plugin data
 */
async function refreshPlugins() {
  console.log('🔄 Fetching plugin data from XrmToolBox OData feed...');
  console.log(`   Source: ${ODATA_URL}`);

  try {
    // Fetch data from OData endpoint
    const data = await fetchData(ODATA_URL);

    // Validate the response structure
    if (!data || !data.value || !Array.isArray(data.value)) {
      throw new Error('Invalid response structure: expected OData format with value array');
    }

    const pluginCount = data.value.length;
    console.log(`✅ Successfully fetched ${pluginCount} plugins`);

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the data to file with proper formatting
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log(`💾 Saved to: ${OUTPUT_PATH}`);

    // Display some stats
    const stats = {
      total: pluginCount,
      openSource: data.value.filter(p => p.mctools_isopensource).length,
      withRating: data.value.filter(p => parseFloat(p.mctools_averagefeedbackratingallversions) > 0).length
    };

    console.log('\n📊 Statistics:');
    console.log(`   Total plugins: ${stats.total}`);
    console.log(`   Open source: ${stats.openSource}`);
    console.log(`   With ratings: ${stats.withRating}`);

    console.log('\n✨ Plugin data refresh completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error refreshing plugin data:', error.message);
    console.error('\nDetails:', error);
    process.exit(1);
  }
}

// Run the refresh
refreshPlugins();
