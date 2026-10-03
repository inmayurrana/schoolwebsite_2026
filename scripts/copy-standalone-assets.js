const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const standaloneDir = path.join(projectRoot, '.next', 'standalone');

if (fs.existsSync(standaloneDir)) {
  console.log('[INFO] Standalone build detected. Preparing standalone production assets...');

  // 1. Copy .next/static to .next/standalone/.next/static
  const staticSrc = path.join(projectRoot, '.next', 'static');
  const staticDest = path.join(standaloneDir, '.next', 'static');
  if (fs.existsSync(staticSrc)) {
    fs.mkdirSync(path.dirname(staticDest), { recursive: true });
    fs.cpSync(staticSrc, staticDest, { recursive: true, force: true });
    console.log('[SUCCESS] Copied .next/static -> .next/standalone/.next/static');
  }

  // 2. Copy public to .next/standalone/public
  const publicSrc = path.join(projectRoot, 'public');
  const publicDest = path.join(standaloneDir, 'public');
  if (fs.existsSync(publicSrc)) {
    fs.cpSync(publicSrc, publicDest, { recursive: true, force: true });
    console.log('[SUCCESS] Copied public -> .next/standalone/public');
  }

  // 3. Copy prisma schema to .next/standalone/prisma
  const prismaSrc = path.join(projectRoot, 'prisma');
  const prismaDest = path.join(standaloneDir, 'prisma');
  if (fs.existsSync(prismaSrc)) {
    fs.cpSync(prismaSrc, prismaDest, { recursive: true, force: true });
    console.log('[SUCCESS] Copied prisma -> .next/standalone/prisma');
  }

  // 4. Copy dev.db if it exists to .next/standalone/dev.db
  const dbSrc = path.join(projectRoot, 'dev.db');
  const dbDest = path.join(standaloneDir, 'dev.db');
  if (fs.existsSync(dbSrc)) {
    fs.copyFileSync(dbSrc, dbDest);
    console.log('[SUCCESS] Copied dev.db -> .next/standalone/dev.db');
  }
} else {
  console.log('[INFO] No .next/standalone directory found. Skipping asset copy.');
}
