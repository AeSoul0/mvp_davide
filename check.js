const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'index.html',
  'assets/css/style.css',
  'assets/js/main.js',
  'assets/video/hero-desktop.mp4' // wait I named it hero-chopin.mp4 and hero-mobile.mp4
];

const actualFiles = [
  'index.html',
  'assets/css/style.css',
  'assets/js/main.js',
  'assets/video/hero-chopin.mp4',
  'assets/video/hero-mobile.mp4',
  'assets/video/hero-poster.webp',
  'sitemap.xml',
  'robots.txt',
  '_headers'
];

console.log('Running site checks...');
let errors = 0;

actualFiles.forEach(file => {
  if (!fs.existsSync(path.join(__dirname, file))) {
    console.error(`❌ Missing file: ${file}`);
    errors++;
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

if (errors > 0) {
  console.error(`\nCheck failed with ${errors} errors.`);
  process.exit(1);
} else {
  console.log('\n✅ All checks passed!');
}
