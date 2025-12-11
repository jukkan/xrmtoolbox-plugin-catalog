import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read plugins data
const pluginsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/plugins.json'), 'utf-8')
);

const plugins = pluginsData.value || [];
const SITE_URL = 'https://xrm.jukkan.com';

// Get all unique categories
const allCategories = new Set();
plugins.forEach(plugin => {
  if (plugin.mctools_categorieslist) {
    const categories = plugin.mctools_categorieslist.split(';').filter(Boolean);
    categories.forEach(cat => allCategories.add(cat.trim()));
  }
});

// Get all unique authors
const allAuthors = new Set();
plugins.forEach(plugin => {
  if (plugin.mctools_authors) {
    allAuthors.add(plugin.mctools_authors.trim());
  }
});

// Format date to ISO 8601
const formatDate = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Generate sitemap XML
const generateSitemap = () => {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Main pages
  const mainPages = [
    { url: '/store', priority: '1.0', changefreq: 'daily' },
    { url: '/store/charts', priority: '0.8', changefreq: 'daily' },
    { url: '/getting-started', priority: '0.7', changefreq: 'weekly' },
  ];

  mainPages.forEach(page => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${SITE_URL}${page.url}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });

  // Plugin detail pages
  plugins.forEach(plugin => {
    if (plugin.mctools_nugetid) {
      const encodedId = encodeURIComponent(plugin.mctools_nugetid);
      const lastmod = formatDate(plugin.mctools_latestreleasedate);

      sitemap += '  <url>\n';
      sitemap += `    <loc>${SITE_URL}/store/plugin/${encodedId}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.9</priority>\n`;
      sitemap += '  </url>\n';
    }
  });

  // Category pages
  Array.from(allCategories).sort().forEach(category => {
    const encodedCategory = encodeURIComponent(category);

    sitemap += '  <url>\n';
    sitemap += `    <loc>${SITE_URL}/store/category/${encodedCategory}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    sitemap += `    <changefreq>daily</changefreq>\n`;
    sitemap += `    <priority>0.8</priority>\n`;
    sitemap += '  </url>\n';
  });

  // Author pages
  Array.from(allAuthors).sort().forEach(author => {
    const encodedAuthor = encodeURIComponent(author);

    sitemap += '  <url>\n';
    sitemap += `    <loc>${SITE_URL}/store/author/${encodedAuthor}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    sitemap += `    <changefreq>weekly</changefreq>\n`;
    sitemap += `    <priority>0.7</priority>\n`;
    sitemap += '  </url>\n';
  });

  sitemap += '</urlset>';
  return sitemap;
};

// Write sitemap to public directory
const sitemap = generateSitemap();
const outputPath = path.join(__dirname, '../public/sitemap.xml');

fs.writeFileSync(outputPath, sitemap);

console.log(`✓ Sitemap generated successfully!`);
console.log(`  - ${plugins.length} plugin pages`);
console.log(`  - ${allCategories.size} category pages`);
console.log(`  - ${allAuthors.size} author pages`);
console.log(`  - 3 main pages`);
console.log(`  Total: ${plugins.length + allCategories.size + allAuthors.size + 3} URLs`);
console.log(`  Output: ${outputPath}`);
