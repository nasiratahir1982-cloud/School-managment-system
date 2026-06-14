import re
def process_file(filepath):
    print(f'Processing {filepath}')
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content

    # Replace the wrapper for Staff/Teachers
    # We find '<div className="grid grid-cols-1 md:grid-cols-2 gap-4">'
    content = content.replace('<div className="grid grid-cols-1 md:grid-cols-2 gap-4">', '<div className="flex flex-wrap justify-center gap-4">')

    # Now we need to add width to the teacher/staff cards
    # The teacher/staff cards have:
    # className="p-4 bg-card/60 border border-border rounded-xl flex flex-col gap-4 hover:border-primary/45 hover:bg-card/80 transition-all cursor-pointer group shadow-sm"
    old_card_class = 'className="p-4 bg-card/60 border border-border rounded-xl flex flex-col gap-4 hover:border-primary/45 hover:bg-card/80 transition-all cursor-pointer group shadow-sm"'
    new_card_class = 'className="p-4 bg-card/60 border border-border rounded-xl flex flex-col gap-4 hover:border-primary/45 hover:bg-card/80 transition-all cursor-pointer group shadow-sm w-full md:w-[calc(50%-8px)] lg:w-[calc(33.33%-11px)] max-w-sm"'
    content = content.replace(old_card_class, new_card_class)

    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated!')
    else:
        print('No changes made.')

process_file('frontend/src/pages/UnifiedDashboard.tsx')
process_file('frontend/src/pages/super-admin/SuperAdminDashboard.tsx')
