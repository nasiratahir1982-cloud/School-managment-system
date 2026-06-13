import re

def remove_portal_specs(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    roles_to_remove = [
        'org_owner', 'school_owner', 'vice_principal', 'admissions', 'reception', 
        'accountant', 'hr', 'librarian', 'transport', 'hostel'
    ]

    for role in roles_to_remove:
        pattern = r'\n    ' + role + r':\s*\{'
        match = re.search(pattern, text)
        if match:
            start_idx = match.start()
            # find matching brace
            brace_idx = text.find('{', start_idx)
            open_count = 1
            end_idx = -1
            for i in range(brace_idx + 1, len(text)):
                if text[i] == '{':
                    open_count += 1
                elif text[i] == '}':
                    open_count -= 1
                
                if open_count == 0:
                    end_idx = i + 1
                    break
            
            if end_idx != -1:
                # Also remove the trailing comma if present
                if end_idx < len(text) and text[end_idx] == ',':
                    end_idx += 1
                text = text[:start_idx] + text[end_idx:]

    # Fix any double commas that might have occurred or trailing comma before closing brace of portalSpecs
    # Actually just saving it is fine.
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

if __name__ == '__main__':
    remove_portal_specs('frontend/src/pages/UnifiedDashboard.tsx')
