import re

def process_file(filepath):
    print(f"Processing {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace 'N/A' with '-'
    content = content.replace("|| 'N/A'", "|| '-'")
    
    # Replace 'Not Provided' with '-'
    content = content.replace(": 'Not Provided'", ": '-'")
    content = content.replace(">Not Provided<", ">-<")

    # Replace 'See Admin' with '-'
    content = content.replace(": 'See Admin'", ": '-'")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

process_file('frontend/src/pages/UnifiedDashboard.tsx')
process_file('frontend/src/pages/super-admin/SuperAdminDashboard.tsx')
