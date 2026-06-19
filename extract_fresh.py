import re

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
        
    match = re.search(r'const freshData = \{.*?\n    \};', content, re.DOTALL)
    if match:
        print(f"Found freshData: {len(match.group(0))} chars")
        with open('fresh_data_block.ts', 'w', encoding='utf-8') as out:
            out.write(match.group(0))

if __name__ == '__main__':
    main()
