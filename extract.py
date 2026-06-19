import re

with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

tickets = re.search(r'<div key=\{ticket\.id\} className=\"p-4 bg-card border border-border rounded-lg space-y-3 shadow-sm\">.*?</button>', content, re.DOTALL)
if tickets: print('--- TICKETS ---\n', tickets.group(0)[:800])

notices = re.search(r'<div key=\{notice\.id\} className=\"p-3 bg-card border border-border rounded-lg space-y-2\">.*?</button>', content, re.DOTALL)
if notices: print('\n--- NOTICES ---\n', notices.group(0)[:800])
