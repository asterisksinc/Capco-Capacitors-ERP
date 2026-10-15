import fs from 'node:fs';

const content = fs.readFileSync('oemrawcssfigma.txt', 'utf8');
const lines = content.split('\n');

const lineNumbers = [45, 1405, 2800, 10539, 10881, 14199, 17272, 18968, 20013, 21347, 23843, 24164, 28083];

for (const num of lineNumbers) {
  console.log(`\n=================== AROUND LINE ${num} ===================`);
  const start = Math.max(0, num - 15);
  const end = Math.min(lines.length, num + 25);
  for (let i = start; i < end; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
