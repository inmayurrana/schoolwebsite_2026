const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceInDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')) {
        content = content.replace(
          /max-w-7xl mx-auto px-4 sm:px-6 lg:px-8/g,
          'w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16'
        );
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated width in: ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, '../src/app'));
replaceInDir(path.join(__dirname, '../src/components'));
console.log('✅ Full width layout updated across all pages and components!');
