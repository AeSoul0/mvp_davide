const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

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
  'assets/images/apple-touch-icon.png'
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

// Validate source components
const sourceIndexPath = path.join(rootDir, 'src', 'index.html');
const componentsDir = path.join(rootDir, 'src', 'components');

const sourceIndex = fs.readFileSync(sourceIndexPath, 'utf8');
const includeRegex = /<!-- INCLUDE: (.*?) -->/g;
const includes = [...sourceIndex.matchAll(includeRegex)];

for (const match of includes) {
  const componentName = match[1];
  const componentPath = path.join(componentsDir, componentName);

  if (!fs.existsSync(componentPath)) {
    console.error(`❌ Missing component: src/components/${componentName}`);
    errors++;
  }
}

// Rebuild in memory and compare with generated index.html
let expectedIndex = sourceIndex;

for (const match of includes) {
  const marker = match[0];
  const componentName = match[1];
  const componentPath = path.join(componentsDir, componentName);

  if (!fs.existsSync(componentPath)) {
    continue;
  }

  const componentContent = fs.readFileSync(componentPath, 'utf8');
  expectedIndex = expectedIndex.replace(marker, componentContent);
}

const generatedIndex = fs.readFileSync(
  path.join(rootDir, 'index.html'),
  'utf8'
);

if (expectedIndex !== generatedIndex) {
  console.error(
    '❌ index.html is out of sync with src/. Run "npm run build".'
  );
  errors++;
} else {
  console.log('✅ index.html is synchronized with src/.');
}

// Check local asset references in generated HTML
const localReferenceRegex = /(?:src|href)=["']([^"']+)["']/g;
const ignoredPrefixes = [
  '#',
  'http://',
  'https://',
  '//',
  'mailto:',
  'tel:',
  'javascript:'
];

const references = [...generatedIndex.matchAll(localReferenceRegex)]
  .map(match => match[1])
  .filter(reference => {
    return !ignoredPrefixes.some(prefix => reference.startsWith(prefix));
  })
  .map(reference => reference.split('#')[0].split('?')[0])
  .filter(Boolean);

for (const reference of [...new Set(references)]) {
  const absolutePath = path.join(rootDir, reference);

  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Broken local reference: ${reference}`);
    errors++;
  }
}

// Final result
if (errors > 0) {
  console.error(`\n❌ Check failed with ${errors} error(s).`);
  process.exit(1);
}

console.log('\n✅ All checks passed!');