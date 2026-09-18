/**
 * @file build.js
 * @description Script to assemble the static HTML components into the final index.html.
 */
const fs = require('fs');
const path = require('path');

console.log('Building index.html...');

const rootDir = path.join(__dirname, '..');
const srcIndex = path.join(rootDir, 'src', 'index.html');
const componentsDir = path.join(rootDir, 'src', 'components');
const destIndex = path.join(rootDir, 'index.html');

let content = fs.readFileSync(srcIndex, 'utf8');

const regex = /<!-- INCLUDE: (.*?) -->/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const componentName = match[1];
  const compPath = path.join(componentsDir, componentName);
  if (fs.existsSync(compPath)) {
    const compContent = fs.readFileSync(compPath, 'utf8');
    content = content.replace(match[0], compContent);
    console.log(`Included ${componentName}`);
  } else {
    console.warn(`Warning: component ${componentName} not found!`);
  }
}

fs.writeFileSync(destIndex, content);
console.log('Build complete! index.html has been updated.');
