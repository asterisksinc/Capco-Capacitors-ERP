import fs from 'node:fs';

const content = fs.readFileSync('oemrawcssfigma.txt', 'utf8');
const lines = content.split('\n');

for (let idx = 0; idx < lines.length; idx++) {
  const line = lines[idx];
  // Check for 1920px wide frames or major sections
  if (line.includes('width: 1920px') || line.includes('width: 1800px')) {
    // Find preceding comment
    let comment = '';
    for (let j = idx - 1; j >= Math.max(0, idx - 10); j--) {
      if (lines[j].startsWith('/*') && lines[j].endsWith('*/')) {
        comment = lines[j];
        break;
      }
    }
    console.log(`Line ${idx + 1}: ${comment} -> ${line.trim()}`);
  }
}
