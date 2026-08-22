import re

with open("src/App.jsx", "r", encoding="utf-8") as f:
    code = f.read()

# Simple regex to find open and close tags
# We only care about standard tags like <div>, <aside>, <main>, <header>, <section>, etc.
# Ignore self-closing tags like <MapComponent ... /> and <Doughnut ... />
tag_pattern = re.compile(r'<(/?[a-zA-Z0-9_-]+)(\s+[^>]*?)?>')

tags = []
for i, line in enumerate(code.split('\n')):
    line_num = i + 1
    # Strip comments
    line = re.sub(r'//.*', '', line)
    line = re.sub(r'\{\/\*.*?\*\/\s*\}', '', line)
    
    for match in tag_pattern.finditer(line):
        tag_name = match.group(1)
        # Check if self-closing (ends with />)
        is_self_closing = match.group(0).endswith('/>') or tag_name in ['img', 'br', 'hr', 'input']
        
        if is_self_closing:
            continue
            
        if tag_name.startswith('/'):
            # Close tag
            clean_name = tag_name[1:]
            if not tags:
                print(f"Extra closing tag </{clean_name}> at line {line_num}")
            else:
                last_tag, last_line = tags.pop()
                if last_tag != clean_name:
                    print(f"Mismatched tag: expected </{last_tag}> (opened at line {last_line}), found </{clean_name}> at line {line_num}")
        else:
            # Open tag
            # If it's a component that is self-closing, ignore
            if tag_name[0].isupper() and (tag_name in ['MapComponent', 'Recommendations', 'Consultancy', 'TehsilComparison', 'FeasibilityReportModal', 'Doughnut', 'Bar']):
                continue
            tags.append((tag_name, line_num))

if tags:
    print(f"Unclosed open tags left: {len(tags)}")
    for t in tags:
        print(f"Tag <{t[0]}> opened at line {t[1]}")
else:
    print("Tags are balanced!")
