import re

def process_file(filepath):
    print(f"Processing {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Student card inner fields
    s_search = 'className="text-[9px] text-slate-400 flex justify-between items-center"'
    s_replace = 'className="text-[9px] text-slate-400 flex flex-col items-center justify-center text-center gap-0.5"'
    content = content.replace(s_search, s_replace)

    # 2. Teacher/Staff card salary section
    t1_search = 'className="bg-primary/5 rounded border border-primary/10 p-2.5"'
    t1_replace = 'className="bg-primary/5 rounded border border-primary/10 p-2.5 text-center flex flex-col items-center justify-center"'
    content = content.replace(t1_search, t1_replace)

    # 3. Teacher/Staff card details grid
    t2_search = 'className="grid grid-cols-2 gap-y-2 gap-x-4 bg-muted/40 p-3 rounded-lg border border-border/50"'
    t2_replace = 'className="grid grid-cols-1 gap-y-3 bg-muted/40 p-3 rounded-lg border border-border/50 text-center place-items-center"'
    content = content.replace(t2_search, t2_replace)
    
    # 3.1 Teacher/Staff card details grid (without the grid cols in some places if modified)
    t3_search = 'className="grid grid-cols-1 gap-y-2 gap-x-4 bg-muted/40 p-3 rounded-lg border border-border/50"'
    content = content.replace(t3_search, t2_replace)

    # 4. Top section of teacher/staff cards
    # We need to find: 
    # <div className="flex justify-between items-start">
    #   <div className="flex items-center gap-3">
    # and replace with:
    # <div className="flex flex-col items-center text-center justify-center relative">
    #   <div className="flex flex-col items-center justify-center gap-3">
    
    # Let's target the exact blocks that are part of profile cards.
    # We know the card container has hover:border-primary/45 and shadow-sm
    
    pattern = r'(<div [^>]*?className="[^"]*?hover:border-primary/45[^"]*?"[^>]*?>\s*)<div className="flex justify-between items-start">\s*<div className="flex items-center gap-3">'
    replacement = r'\1<div className="flex flex-col items-center text-center justify-center relative gap-3 w-full">\n                            <div className="flex flex-col items-center justify-center gap-3 w-full">'
    content = re.sub(pattern, replacement, content)

    # 5. The Dismiss/Verified buttons container
    pattern_btn = r'<div className="flex flex-col items-end gap-2" onClick=\{\(e\) => e\.stopPropagation\(\)\}>'
    replacement_btn = r'<div className="flex items-center justify-center gap-2 mt-2 w-full" onClick={(e) => e.stopPropagation()}>'
    content = re.sub(pattern_btn, replacement_btn, content)

    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated!")
    else:
        print("No changes made.")

process_file('frontend/src/pages/UnifiedDashboard.tsx')
process_file('frontend/src/pages/super-admin/SuperAdminDashboard.tsx')
