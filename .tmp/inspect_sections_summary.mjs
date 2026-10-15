import fs from 'node:fs';

const content = fs.readFileSync('oemrawcssfigma.txt', 'utf8');
const lines = content.split('\n');

const lineNumbers = [45, 1405, 2800, 10539, 10881, 14199, 17272, 18968, 20013, 21347, 23843, 24164, 28083];

for (const num of lineNumbers) {
  const precedingComments = [];
  for (let j = Math.max(0, num - 12); j <= num; j++) {
    if (lines[j].trim().startsWith('/*') && lines[j].trim().endsWith('*/')) {
      precedingComments.push(`Line ${j+1}: ${lines[j].trim()}`);
    }
  }
  console.log(`=== At line ${num} ===`);
  console.log(precedingComments.slice(-3).join('\n'));
}
