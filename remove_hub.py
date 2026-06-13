import re

def clean_hub(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # The block starts with `{(() => {\n          const isOperations =`
    # and ends with `        })()}`
    # We will use regex to find and remove it.
    
    pattern = r'\{\(\) => \{\s*const isOperations = \[\'admissions\'[\s\S]*?\}\)\(\)\}'
    
    # Let's test if it finds it
    matches = re.findall(pattern, text)
    print(f"Found {len(matches)} matches")
    
    if len(matches) > 0:
        new_text = re.sub(pattern, '', text)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_text)
        print("Removed hub block.")

if __name__ == '__main__':
    clean_hub('frontend/src/pages/UnifiedDashboard.tsx')
