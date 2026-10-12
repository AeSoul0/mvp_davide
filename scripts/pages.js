/**
 * @file scripts/pages.js
 * @description Shared helpers for build.js and check.js: list the source pages
 * in src/ and assemble each one by resolving its INCLUDE markers.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const componentsDir = path.join(srcDir, 'components');

const includeRegex = /<!-- INCLUDE: (.*?) -->/g;

// Every top-level .html file in src/ becomes a page with the same name in the root.
function listPages() {
  return fs.readdirSync(srcDir)
    .filter(name => name.endsWith('.html'))
    .sort();
}

// Returns { content, missing } where missing lists components that do not exist.
function assemblePage(pageName) {
  let content = fs.readFileSync(path.join(srcDir, pageName), 'utf8');
  const missing = [];

  for (const match of [...content.matchAll(includeRegex)]) {
    const [marker, componentName] = match;
    const componentPath = path.join(componentsDir, componentName);

    if (!fs.existsSync(componentPath)) {
      missing.push(componentName);
      continue;
    }

    content = content.replace(marker, fs.readFileSync(componentPath, 'utf8'));
  }

  return { content, missing };
}

module.exports = { rootDir, listPages, assemblePage };
