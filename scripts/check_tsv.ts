import * as fs from 'fs';

const content = fs.readFileSync('tufs-vocab.tsv', 'utf-8');
const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));

console.log(`Total lines: ${lines.length}`);
console.log('\nFirst 3 lines (raw):');
for (let i = 0; i < Math.min(3, lines.length); i++) {
  const parts = lines[i].split('\t');
  console.log(`\nLine ${i + 1} (${parts.length} columns):`);
  parts.forEach((part, idx) => {
    console.log(`  [${idx}] "${part.slice(0, 50)}${part.length > 50 ? '...' : ''}"`);
  });
}

// Count language codes
const langCounts: Record<string, number> = {};
lines.forEach(line => {
  const parts = line.split('\t');
  if (parts.length >= 2) {
    const lang = parts[1].trim();
    langCounts[lang] = (langCounts[lang] || 0) + 1;
  }
});

console.log('\nLanguage distribution:');
Object.entries(langCounts).slice(0, 20).forEach(([lang, count]) => {
  console.log(`  ${lang}: ${count}`);
});