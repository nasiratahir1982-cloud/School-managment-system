import re

def process_file(filepath):
    print(f"Processing {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    pattern = r'<div className="flex justify-between items-start">\s*<div className="flex items-center gap-3">'
    replacement = r'<div className="flex flex-col items-center text-center justify-center relative gap-3 w-full">\n                            <div className="flex flex-col items-center justify-center gap-3 w-full">'
    content = re.sub(pattern, replacement, content)

    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated!")
    else:
        print("No changes made.")

process_file('frontend/src/pages/UnifiedDashboard.tsx')
process_file('frontend/src/pages/super-admin/SuperAdminDashboard.tsx')
