import re
import sys

# Files to fix
files = [
    "open-sse/services/sessionPool/session.ts",
    "open-sse/services/tokenExtractionConfig.ts",
    "open-sse/translator/deepseekWebTools.ts"
]

# Smart quote mappings
replacements = {
    '"': '"',  # " (curly left double quote)
    '"': '"',  # " (curly right double quote)
    ''': "'",  # ' (curly left single quote)
    ''': "'",  # ' (curly right single quote)
    '`': "`",  # ` (grave accent variant if needed)
}

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        for smart, straight in replacements.items():
            content = content.replace(smart, straight)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Fixed {filepath}")
        else:
            print(f"- No changes needed in {filepath}")
    except FileNotFoundError:
        print(f"✗ File not found: {filepath}")
    except Exception as e:
        print(f"✗ Error processing {filepath}: {e}")
