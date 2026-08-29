import fs from 'fs';
import { globSync } from 'glob';

globSync('open-sse/**/*.ts', { recursive: true }).forEach(filepath => {
  let content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n');
  let fixed = false;

  const fixedLines = lines.map((line, i) => {
    let newLine = line;
    const orig = line;

    // Pattern 1: Single-quote start, double-quote end: '......"
    if (/'[^']*"[;]*\s*$/.test(line)) {
      newLine = line.replace(/'([^']*)"([;]*\s*)$/, '"$1"$2');
      console.log(`  [P1] Line ${i+1}: '....." → "...." (mid-line)`);
      fixed = true;
    }
    // Pattern 2: Double-quote start, single-quote end: "....."'
    else if (/"[^"]*'[;]*\s*$/.test(line)) {
      newLine = line.replace(/"([^"]*)'([;]*\s*)$/, '"$1"$2');
      console.log(`  [P2] Line ${i+1}: "...' → "...." (mid-line)`);
      fixed = true;
    }
    // Pattern 3: Escaped quote corruption: '\\"" → "\\\\"
    else if (/'\\+"[;]*\s*$/.test(line)) {
      newLine = line.replace(/'(\\+)"([;]*\s*)$/, '"$1"$2');
      console.log(`  [P3] Line ${i+1}: '\\\\..". → "\\\\..". (escaped quote)`);
      fixed = true;
    }

    if (orig !== newLine) {
      console.log(`      Before: ${orig.trim()}`);
      console.log(`      After:  ${newLine.trim()}`);
    }

    return newLine;
  });

  if (fixed) {
    fs.writeFileSync(filepath, fixedLines.join('\n'), 'utf-8');
    console.log(`✓ Fixed ${filepath}\n`);
  }
});

console.log('Done!');
