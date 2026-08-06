#!/usr/bin/env node

/**
 * Script to refresh plugins.json from the XrmToolBox Web API
 * Source: https://www.xrmtoolbox.com/_api/mctools_plugins
 *
 * This script fetches the latest plugin data and updates src/data/plugins.json
 *
 * Features:
 * - Handles Web API pagination automatically (fetches all pages via @odata.nextLink)
 * - Validates response structure
 * - Provides detailed progress reporting
 * - Displays statistics about fetched plugins
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEBAPI_URL = 'https://www.xrmtoolbox.com/_api/mctools_plugins';
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
 * Fetch all pages from Web API endpoint with pagination support
 */
async function fetchAllPages(startUrl) {
  let allPlugins = [];
  let currentUrl = startUrl;
  let pageNumber = 1;

  while (currentUrl) {
    console.log(`   Fetching page ${pageNumber}...`);
    const data = await fetchData(currentUrl);

    // Validate the response structure
    if (!data || !data.value || !Array.isArray(data.value)) {
      throw new Error('Invalid response structure: expected Web API format with value array');
    }

    // Add plugins from this page
    allPlugins = allPlugins.concat(data.value);
    console.log(`   ✓ Page ${pageNumber}: ${data.value.length} plugins (total so far: ${allPlugins.length})`);

    // Check for next page link (Web API pagination uses @odata.nextLink)
    currentUrl = data['@odata.nextLink'] || null;
    pageNumber++;

    // Safety check to prevent infinite loops
    if (pageNumber > 100) {
      throw new Error('Exceeded maximum page limit (100). Possible infinite loop detected.');
    }
  }

  // Return complete dataset with page count
  return {
    value: allPlugins,
    _pageCount: pageNumber - 1  // Not part of the saved data, just for reporting
  };
}

/**
 * Main function to refresh plugin data
 */
async function refreshPlugins() {
  console.log('🔄 Fetching plugin data from XrmToolBox Web API...');
  console.log(`   Source: ${WEBAPI_URL}`);
  console.log('');

  try {
    // Fetch all pages from Web API endpoint
    const result = await fetchAllPages(WEBAPI_URL);

    const pluginCount = result.value.length;
    const pageCount = result._pageCount;
    console.log('');
    console.log(`✅ Successfully fetched all ${pluginCount} plugins from ${pageCount} page(s)`);

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Prepare data for saving (remove the _pageCount metadata)
    const data = {
      value: result.value
    };

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
