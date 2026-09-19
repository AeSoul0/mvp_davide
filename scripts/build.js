/**
 * @file scripts/build.js
 * @description Assemble static HTML components into the final index.html.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const srcIndex = path.join(rootDir, 'src', 'index.html');
const componentsDir = path.join(rootDir, 'src', 'components');
const destIndex = path.join(rootDir, 'index.html');

console.log('Building index.html...');

let content = fs.readFileSync(srcIndex, 'utf8');

const includeRegex = /<!-- INCLUDE: (.*?) -->/g;
const includes = [...content.matchAll(includeRegex)];

for (const match of includes) {
  const marker = match[0];
  const componentName = match[1];
  const componentPath = path.join(componentsDir, componentName);

  if (!fs.existsSync(componentPath)) {
    console.error(`❌ Missing component: ${componentName}`);
    process.exit(1);
  }

  const componentContent = fs.readFileSync(componentPath, 'utf8');
  content = content.replace(marker, componentContent);

  console.log(`✅ Included: ${componentName}`);
}

const unresolvedIncludes = content.match(/<!-- INCLUDE: .*? -->/g);

if (unresolvedIncludes) {
  console.error('❌ Unresolved INCLUDE markers found:');
  unresolvedIncludes.forEach(marker => console.error(`   ${marker}`));
  process.exit(1);
}

fs.writeFileSync(destIndex, content, 'utf8');

console.log('✅ Build complete: index.html updated.');

// -----------------------------------------------------------------------------
// Sitemap generation
// -----------------------------------------------------------------------------
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const today = new Date().toISOString().split('T')[0];
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://davidelombardipianoforte.biz/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log('✅ Generated sitemap.xml.');