/**
 * @file scripts/build.js
 * @description Assemble the pages in src/ (index, privacy, 404, ...) into the
 * repository root and regenerate sitemap.xml.
 */

const fs = require('fs');
const path = require('path');
const { rootDir, listPages, assemblePage } = require('./pages');

const SITE_URL = 'https://www.davidelombardipianoforte.biz/';
// Pages that must not be listed in the sitemap
const SITEMAP_EXCLUDED = ['404.html'];

const today = new Date().toISOString().split('T')[0];
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const previousSitemap = fs.existsSync(sitemapPath)
  ? fs.readFileSync(sitemapPath, 'utf8')
  : '';

function pageUrl(pageName) {
  return pageName === 'index.html' ? SITE_URL : SITE_URL + pageName;
}

// Keep the previous <lastmod> of a page whose output did not change, so that
// rebuilding without real edits does not produce a new sitemap.
function previousLastmod(url) {
  const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = previousSitemap.match(
    new RegExp(`<loc>${escaped}</loc>\\s*<lastmod>([^<]+)</lastmod>`)
  );
  return match ? match[1] : null;
}

const sitemapEntries = [];

for (const pageName of listPages()) {
  console.log(`Building ${pageName}...`);

  const { content, missing } = assemblePage(pageName);

  if (missing.length > 0) {
    missing.forEach(name => console.error(`❌ Missing component: ${name}`));
    process.exit(1);
  }

  const destPath = path.join(rootDir, pageName);
  const previousContent = fs.existsSync(destPath)
    ? fs.readFileSync(destPath, 'utf8')
    : null;
  const changed = previousContent !== content;

  if (changed) {
    fs.writeFileSync(destPath, content, 'utf8');
  }

  console.log(`✅ ${pageName} ${changed ? 'updated' : 'unchanged'}.`);

  if (!SITEMAP_EXCLUDED.includes(pageName)) {
    const url = pageUrl(pageName);
    const lastmod = (!changed && previousLastmod(url)) || today;
    sitemapEntries.push({ url, lastmod, isHome: pageName === 'index.html' });
  }
}

// -----------------------------------------------------------------------------
// Sitemap generation
// -----------------------------------------------------------------------------
const urls = sitemapEntries
  .sort((a, b) => Number(b.isHome) - Number(a.isHome))
  .map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.isHome ? 'monthly' : 'yearly'}</changefreq>
    <priority>${entry.isHome ? '1.0' : '0.3'}</priority>
  </url>`)
  .join('\n');

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

if (sitemapContent !== previousSitemap) {
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  console.log('✅ sitemap.xml updated.');
} else {
  console.log('✅ sitemap.xml unchanged.');
}
