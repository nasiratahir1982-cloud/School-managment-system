import re

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to remove everything from 'const [initialLoadDone' to '}, [apiKeys, initialLoadDone]);'
    # It ends before 'const [principalNotifications'
    
    # Let's use regex with re.DOTALL to find and remove it
    pattern = r"const \[initialLoadDone, setInitialLoadDone\] = useState\(false\);\s*useEffect\(\(\) => \{[\s\S]*?\}, \[apiKeys, initialLoadDone\]\);"
    
    new_content = re.sub(pattern, "", content)
    
    if new_content != content:
        with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully removed the crashing old Firebase effects.")
    else:
        print("Could not find the target pattern to remove.")

if __name__ == '__main__':
    main()
