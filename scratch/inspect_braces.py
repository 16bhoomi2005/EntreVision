import re

with open("src/App.jsx", "r", encoding="utf-8") as f:
    code = f.read()

# Remove strings and comments
code_no_strings = re.sub(r'"[^"\\]*(?:\\.[^"\\]*)*"', '""', code)
code_no_strings = re.sub(r"'[^'\\]*(?:\\.[^'\\]*)*'", "''", code_no_strings)
code_no_strings = re.sub(r'`[^`\\]*(?:\\.[^`\\]*)*`', '``', code_no_strings)
code_no_comments = re.sub(r'//.*', '', code_no_strings)
code_no_comments = re.sub(r'/\*.*?\*/', '', code_no_comments, flags=re.DOTALL)

lines = code_no_comments.split('\n')

stack = []
for i, line in enumerate(lines):
    line_num = i + 1
    for char_idx, char in enumerate(line):
        if char == '(':
            stack.append((line_num, char_idx, '('))
        elif char == ')':
            if not stack:
                print(f"Extra closing parenthesis ')' at line {line_num}, col {char_idx}")
            else:
                stack.pop()

if stack:
    print(f"Unclosed open parentheses left: {len(stack)}")
    for item in stack[-10:]:
        print(f"Unclosed open parenthesis at line {item[0]}, col {item[1]}")
else:
    print("Parentheses are balanced!")
