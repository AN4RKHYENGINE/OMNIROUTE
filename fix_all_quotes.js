const fs = require('fs');
const path = require('path');
const glob = require('glob');

glob.sync('open-sse/**/*.ts', { recursive: true }).forEach(filepath => {
  let content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n');
  let fixed = false;

  const fixedLines = lines.map((line, i) => {
    let newLine = line;

    // Pattern 1: Single-quote start, double-quote end: 'text"  →  "text"
    if (/'[^'"]*"[\s;,]*$/.test(newLine)) {
      newLine = newLine.replace(/^(\s*)'/, '$1"').replace(/"([\s;,]*)$/, '"$1');
      console.log(`  [P1] Line ${i+1}: Fixed quote pair`);
      fixed = true;
    }

    // Pattern 2: Double-quote start, single-quote end: "text'  →  "text"
    if (/"[^'"]*'[\s;,]*$/.test(newLine)) {
      newLine = newLine.replace(/'([\s;,]*)$/, '"$1');
      console.log(`  [P2] Line ${i+1}: Fixed trailing single quote`);
      fixed = true;
    }

    // Pattern 3: Escaped quote corruption: '\\"  →  '"
    if (/'\\\\"$/.test(newLine)) {
      newLine = newLine.replace(/'\\\\"$/, '"');
      console.log(`  [P3] Line ${i+1}: Fixed escaped quote`);
      fixed = true;
    }

    // Pattern 4: Incomplete string: {"input":""  →  {"input":""
    if ((/['"]$/.test(newLine)) && !newLine.match(/^\s*(\/\/|\/\*)/)) {
      const trimmed = newLine.trimEnd();
      if (trimmed.endsWith(';')) {
        // Line ends with ; after quote - might be incomplete
        if (!newLine.match(/['"][,\s;]*$/)) {
          newLine = newLine.replace(/;$/, '";');
          console.log(`  [P4] Line ${i+1}: Fixed incomplete string`);
          fixed = true;
        }
      }
    }

    return newLine;
  });

  if (fixed) {
    fs.writeFileSync(filepath, fixedLines.join('\n'), 'utf-8');
    console.log(`✓ Fixed ${filepath}\n`);
  }
});

console.log('Done!');
