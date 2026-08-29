import re
import glob
import os

pattern = re.compile(r'"([^"]*)[\'"]$', re.MULTILINE)

for filepath in glob.glob("open-sse/**/*.ts", recursive=True):
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    fixed = False
    for i, line in enumerate(lines):
        # Match lines that end with " followed by ' (and optional ;)
        if re.search(r'"[^"]*\'[\s;,]*$', line):
            # Replace trailing ' with "
            lines[i] = re.sub(r"'([\s;,]*)$", r'"\1', line)
            fixed = True
            print(f"  Line {i+1}: {line.rstrip()} → {lines[i].rstrip()}")
    
    if fixed:
        with open(filepath, "w", encoding="utf-8") as f:
            f.writelines(lines)
        print(f"✓ Fixed {filepath}\n")

print("Done!")
