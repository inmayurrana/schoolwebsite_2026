const fs = require('fs');

let code = fs.readFileSync('src/lib/pageRegistry.ts', 'utf8');

// Replace any remaining empty lecture hall references with proper authentic photos
const replacements = [
  {
    search: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600',
    replace: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80',
  },
  {
    search: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800',
    replace: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
  },
];

let totalReplaced = 0;
for (const r of replacements) {
  while (code.includes(r.search)) {
    code = code.replace(r.search, r.replace);
    totalReplaced++;
  }
}

fs.writeFileSync('src/lib/pageRegistry.ts', code);
console.log(`Successfully replaced ${totalReplaced} empty lecture hall instances in pageRegistry.ts`);
