import fs from 'node:fs';

const content = fs.readFileSync('oemrawcssfigma.txt', 'utf8');
const lines = content.split('\n');

function search(term) {
  console.log(`\n=================== SEARCH: "${term}" ===================`);
  let matches = 0;
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(term.toLowerCase())) {
      matches++;
      if (matches <= 5) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
        const start = Math.max(0, idx - 5);
        const end = Math.min(lines.length, idx + 20);
        console.log(lines.slice(start, end).map((l, i) => `  ${start + i + 1}: ${l}`).join('\n'));
      }
    }
  });
  console.log(`Total matches: ${matches}`);
}

const terms = process.argv.slice(2);
for (const term of terms) {
  search(term);
}
