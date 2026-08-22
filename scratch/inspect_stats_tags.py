import re

with open("src/App.jsx", "r", encoding="utf-8") as f:
    code = f.read()

lines = code.split('\n')
stats_section = lines[695:868]

tag_pattern = re.compile(r'<(/?[a-zA-Z0-9_-]+)(\s+[^>]*?)?>')

tags = []
for i, line in enumerate(stats_section):
    line_num = i + 696
    line = re.sub(r'//.*', '', line)
    line = re.sub(r'\{\/\*.*?\*\/\s*\}', '', line)
    
    for match in tag_pattern.finditer(line):
        tag_name = match.group(1)
        is_self_closing = match.group(0).endswith('/>') or tag_name in ['img', 'br', 'hr', 'input'] or (tag_name[0].isupper() and tag_name in ['Bar', 'Doughnut'])
        
        if is_self_closing:
            continue
            
        if tag_name.startswith('/'):
            clean_name = tag_name[1:]
            if not tags:
                print(f"[{line_num}] Extra closing tag </{clean_name}>")
            else:
                last_tag, last_line = tags.pop()
                print(f"[{line_num}] Pop </{clean_name}> (matches <{last_tag}> from line {last_line}). Remaining stack size: {len(tags)}")
        else:
            tags.append((tag_name, line_num))
            print(f"[{line_num}] Push <{tag_name}>. Stack size: {len(tags)}")

print(f"\nFinal unclosed tags stack:")
for t in tags:
    print(f"Tag <{t[0]}> opened at line {t[1]}")
