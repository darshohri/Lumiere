const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'frontend', '.next');
const destDir = path.join(__dirname, '..', '.next');

if (fs.existsSync(srcDir)) {
  fs.cpSync(srcDir, destDir, { recursive: true });
  const pkgSrc = path.join(__dirname, '..', 'frontend', 'package.json');
  if (fs.existsSync(pkgSrc)) {
    fs.copyFileSync(pkgSrc, path.join(destDir, 'package.json'));
  }
  console.log('[copy-dist] Successfully mirrored frontend/.next to .next for Vercel');
}
