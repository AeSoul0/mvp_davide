/**
 * @file scripts/check.js
 * @description Verify required files, page/source synchronization and local references.
 */

const fs = require('fs');
const path = require('path');
const { rootDir, listPages, assemblePage } = require('./pages');

const requiredFiles = [
  'index.html',
  'assets/css/style.css',
  'assets/js/main.js',
  'assets/video/hero-chopin.mp4',
  'assets/video/hero-mobile.mp4',
  'assets/video/hero-poster.webp',
  'robots.txt',
  'sitemap.xml',
  '_headers',
  'assets/images/favicon.ico',
  'assets/images/apple-touch-icon.png',
  'assets/images/icon-192.png',
  'assets/images/icon-512.png',
  'site.webmanifest',
  '404.html',
  'privacy.html'
];

console.log('Running site checks...');

let errors = 0;

function fileExists(relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

// Required files
for (const file of requiredFiles) {
  if (!fileExists(file)) {
    console.error(`❌ Missing file: ${file}`);
    errors++;
  } else {
    console.log(`✅ Found: ${file}`);
  }
}

// Rebuild every page in memory and compare with the generated files
const generatedPages = [];

for (const pageName of listPages()) {
  const { content, missing } = assemblePage(pageName);

  missing.forEach(name => {
    console.error(`❌ Missing component: src/components/${name}`);
    errors++;
  });

  if (!fileExists(pageName)) {
    console.error(`❌ Missing generated page: ${pageName}. Run "npm run build".`);
    errors++;
    continue;
  }

  const generated = fs.readFileSync(path.join(rootDir, pageName), 'utf8');
  generatedPages.push({ pageName, content: generated });

  if (content !== generated) {
    console.error(
      `❌ ${pageName} is out of sync with src/. Run "npm run build".`
    );
    errors++;
  } else {
    console.log(`✅ ${pageName} is synchronized with src/.`);
  }
}

// Check local asset references in generated HTML
const localReferenceRegex = /(?:src|href)=["']([^"']+)["']/g;
// srcset holds a comma-separated list of "url descriptor" candidates
const srcsetRegex = /srcset=["']([^"']+)["']/g;
const ignoredPrefixes = [
  '#',
  'http://',
  'https://',
  '//',
  'mailto:',
  'tel:',
  'javascript:'
];

for (const { pageName, content } of generatedPages) {
  const srcsetReferences = [...content.matchAll(srcsetRegex)]
    .flatMap(match => match[1].split(','))
    .map(candidate => candidate.trim().split(/\s+/)[0]);

  const references = [...content.matchAll(localReferenceRegex)]
    .map(match => match[1])
    .concat(srcsetReferences)
    .filter(reference => {
      return !ignoredPrefixes.some(prefix => reference.startsWith(prefix));
    })
    .map(reference => reference.split('#')[0].split('?')[0])
    .filter(Boolean);

  for (const reference of [...new Set(references)]) {
    // "/" is the site root; root-relative paths resolve from the repository root
    const absolutePath = path.join(rootDir, reference === '/' ? 'index.html' : reference);

    if (!fs.existsSync(absolutePath)) {
      console.error(`❌ Broken local reference in ${pageName}: ${reference}`);
      errors++;
    }
  }
}

// Final result
if (errors > 0) {
  console.error(`\n❌ Check failed with ${errors} error(s).`);
  process.exit(1);
}

console.log('\n✅ All checks passed!');