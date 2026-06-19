import re

def extract_alerts():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    alerts = []
    for i, line in enumerate(lines):
        if 'alert(' in line:
            alerts.append(f"Line {i+1}: {line.strip()}")
            
    with open('alerts.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(alerts))
        
if __name__ == '__main__':
    extract_alerts()
