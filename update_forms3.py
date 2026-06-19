import re

def update_file():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = [
        # DNS
        (
            r"alert\('Custom DNS target configurations saved! DNS is currently propagation-testing\.'\);",
            r"""alert('Custom DNS target configurations saved! DNS is currently propagation-testing.');
            const dnsInput = document.getElementById('customDnsInput') as HTMLInputElement;
            if (dnsInput) dnsInput.value = '';"""
        ),
        # PERMISSIONS
        (
            r"alert\('Multi-Level Permissions updated successfully!'\)",
            r"""(() => {
                alert('Multi-Level Permissions updated successfully!');
            })()"""
        ),
        # EMAIL
        (
            r"alert\('Email Server Configuration saved!'\)",
            r"""(() => {
                alert('Email Server Configuration saved!');
                const smtpForm = document.getElementById('smtpForm') as HTMLFormElement;
                if (smtpForm) smtpForm.reset();
            })()"""
        ),
        # SMS
        (
            r"alert\('SMS Settings saved!'\)",
            r"""(() => {
                alert('SMS Settings saved!');
                const smsForm = document.getElementById('smsForm') as HTMLFormElement;
                if (smsForm) smsForm.reset();
            })()"""
        )
    ]

    for old, new_r in replacements:
        content = re.sub(old, new_r, content)

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Dashboard forms updated - phase 3.")

if __name__ == '__main__':
    update_file()
