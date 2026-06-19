import re

def fix_syntax_error():
    path = 'frontend/src/pages/UnifiedDashboard.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The buggy string that I created earlier
    buggy = "if(window.confirm('Delete this asset?')) const currentInventory = schoolDb.inventory || [];\n                                  setInventory(currentInventory.filter((i: any) => i.id !== item.id));"
    
    fixed = "if(window.confirm('Delete this asset?')) {\n                                    const currentInventory = schoolDb.inventory || [];\n                                    setInventory(currentInventory.filter((i: any) => i.id !== item.id));\n                                  }"

    content = content.replace(buggy, fixed)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Syntax error successfully fixed.")

if __name__ == '__main__':
    fix_syntax_error()
