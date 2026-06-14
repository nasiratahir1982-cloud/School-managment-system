import re

def process_file(filepath):
    print(f'Processing {filepath}')
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    # Replace col-span-2 with col-span-1 w-full
    content = content.replace('col-span-2', 'col-span-1 w-full')

    # Ensure space-y-3 is w-full
    content = content.replace('<div className="space-y-3">', '<div className="space-y-3 w-full">')

    # Some cards might have space-y-4 or similar, let's just make sure inner grid has w-full
    # We also added "w-full" to space-y-3 above, let's also add it to the grids if they lack it
    # No, adding to grid is fine if we just changed col-span-2

    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated!')
    else:
        print('No changes made.')

process_file('frontend/src/pages/UnifiedDashboard.tsx')
process_file('frontend/src/pages/super-admin/SuperAdminDashboard.tsx')
