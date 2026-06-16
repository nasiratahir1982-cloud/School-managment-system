import re

def patch_hardcoded_currency():
    path = 'frontend/src/pages/UnifiedDashboard.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = [
        # Line 3510 (approx): Active Revenue metric
        (r'value:\s*"\$48,920/mo"', r'value: `${formatCurrency(48920)}/mo`'),
        
        # Line 13446: Subscription plans pricing
        (r'<span className="text-3xl font-extrabold text-foreground">\$\{plan\.price\}</span>', r'<span className="text-3xl font-extrabold text-foreground">{formatCurrency(plan.price)}</span>'),
        (r'\$12,450 / mo', r'{formatCurrency(12450)} / mo'),
        (r'\$8,520 / mo', r'{formatCurrency(8520)} / mo'),
        
        # Line 14102-14116: Audit Logs table
        (r'>\$12,400<', r'>{formatCurrency(12400)}<'),
        (r'>\$28,500<', r'>{formatCurrency(28500)}<'),
        (r'>\$8,200<', r'>{formatCurrency(8200)}<'),
        
        # Inventory value placeholder
        (r'\(e\.g\.\s*\$500\)', r'(e.g. {formatCurrency(500)})'),
        (r'placeholder="Estimated Value \(e\.g\. \$500\)"', r'placeholder={`Estimated Value (e.g. ${formatCurrency(500)})`}'),
        
        # Mini Chart labels in Subscription Plans
        (r"val:\s*'\$8K'", r"val: `${useSchoolStore.getState().currencySymbol}8K`"),
        (r"val:\s*'\$9K'", r"val: `${useSchoolStore.getState().currencySymbol}9K`"),
        (r"val:\s*'\$10K'", r"val: `${useSchoolStore.getState().currencySymbol}10K`"),
        (r"val:\s*'\$11K'", r"val: `${useSchoolStore.getState().currencySymbol}11K`"),
        (r"val:\s*'\$12K'", r"val: `${useSchoolStore.getState().currencySymbol}12K`"),
    ]

    for old, new in replacements:
        content = re.sub(old, new, content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Hardcoded currencies patched successfully.")

if __name__ == '__main__':
    patch_hardcoded_currency()
