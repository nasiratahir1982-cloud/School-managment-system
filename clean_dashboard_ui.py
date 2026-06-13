import re

def clean_dashboard(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # 1. Replace the useState for simulatedRole with a simple const
    pattern_usestate = r'const \[simulatedRole,\s*setSimulatedRole\]\s*=\s*useState<UserRole>\([\s\S]*?\);'
    text = re.sub(pattern_usestate, "const simulatedRole = currentUser?.role || 'student';", text)

    # 2. Remove the top right dropdown for switching roles (lines around 2909 to 2942)
    # The div starts with `<div className={\`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all shrink-0`
    # and ends after the `})()}`
    # Since it's inside `currentUser?.role && ['super_admin', 'admin', 'org_owner', 'school_owner'].includes(currentUser.role) && (`
    # We will just remove that whole block.
    pattern_dropdown = r'\{currentUser\?\.role && \[\'super_admin\', \'admin\', \'org_owner\', \'school_owner\'\]\.includes\(currentUser\.role\) && \(\s*<div className=\{`flex items-center[\s\S]*?\}\s*</div>\s*\)\}'
    text = re.sub(pattern_dropdown, '', text)

    # 3. Remove the Department/Sub-role Navigation Tabs block (lines around 2999 to 3097)
    pattern_hub_tabs = r'\{\(\) => \{\s*const isOperations = \[\'admissions\'[\s\S]*?\}\)\(\)\}'
    text = re.sub(pattern_hub_tabs, '', text)
    
    # Also remove `{/* Department/Sub-role Navigation Tabs for Consolidated Portals */}`
    text = text.replace('{/* Department/Sub-role Navigation Tabs for Consolidated Portals */}', '')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

if __name__ == '__main__':
    clean_dashboard('frontend/src/pages/UnifiedDashboard.tsx')
