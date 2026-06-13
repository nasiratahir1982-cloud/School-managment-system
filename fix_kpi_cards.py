import re

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Create regex pattern for the kpis array in super_admin
    pattern = r'(subtitle:\s*"Global School Administration Center",\s*kpis:\s*\[\s*)\{ label: "Total Countries".*?\]'
    
    new_kpis = """{ label: "Total Countries", value: `${countries.filter(c => c.status === 'Active').length} Active`, icon: GlobeIcon, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: countries.filter(c => c.status === 'Active').map(c => c.code).join(', ') || "None" },
          { label: "Organizations", value: `${organizations.filter(o => o.status === 'Active').length} Groups`, icon: Building2, colorClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25", desc: "School groups overview" },
          { label: "Total Schools", value: `${schoolsList.filter(s => s.status !== 'Suspended' && s.status !== 'Inactive').length} Schools`, icon: Layers, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Secure data channels active" },
          { label: "Active Revenue", value: "$48,920/mo", icon: TrendingUp, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", desc: "Monthly collection records" }
        ]"""
    
    def replacer(match):
        return match.group(1) + new_kpis
        
    new_content = re.sub(pattern, replacer, content, flags=re.DOTALL)

    if new_content != content:
        with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully updated KPI cards to dynamic values with regex!")
    else:
        print("Error: Regex could not find the old KPI block.")

if __name__ == '__main__':
    main()
