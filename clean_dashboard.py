import re
import sys

def remove_blocks(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # Features to remove
    features_to_remove = [
        'Country Management', 'Organization Management', 'School Management', 'Subscription Plans', 
        'Billing & Invoicing', 'Revenue Analytics', 'White Label Configuration', 'Global Announcements', 
        'Support Tickets', 'Audit Logs', 'Multi-Level Permissions', 'Advanced Activity Monitoring', 
        'Two Factor Authentication', 'Device Management', 'Session Tracking', 'IP Restriction', 
        'Login Audit Trail', 'School Health Monitoring', 'Server Monitoring', 'Backup Manager', 
        'API Key Management', 'SMS Gateway Settings', 'Email Server Settings', 'School Suspension System', 
        'School Performance Analytics', 'Fraud Detection Dashboard', 'Employee Management', 
        'Admission Funnel Analytics', 'Staff Performance Tracking', 'Inventory Management', 
        'Transport Management', 'Hostel Management', 'Visitor Management', 'Payroll', 'Hostel Fees', 
        'Mess Management', 'Hostel Reports', 'Vehicles', 'Routes', 'Drivers', 'Student Assignments', 
        'GPS Tracking', 'Transport Fees', 'Book Management', 'Issue Books', 'Return Books', 
        'Fine Collection', 'Inventory Tracking', 'Front Desk Operations', 'Appointment Scheduling', 
        'Inquiry Handling', 'Call Logs', 'Admission Guidance', 'Lead Management', 'Inquiry Tracking', 
        'Admission Applications', 'Document Verification', 'Interview Scheduling', 'Test Scheduling', 
        'Automated Merit Lists', 'Funnel Analytics', 'Enrollment Tracking', 'Invoicing', 'Accounting Ledger', 
        'General Journal', 'Balance Sheet', 'Profit & Loss', 'Cash Flow Reports', 'Budget Planning', 
        'Financial Forecasting', 'Tax Reports', 'Employee Records', 'Recruitment', 'Leave Management', 
        'Performance Reviews', 'Payroll Coordination', 'Organization Overview', 'School Performance Matrix', 
        'Branch Performance Ledger', 'Campus Performance Analytics', 'Group Revenue Reports', 
        'Expansion Planning Wizard', 'Branding Customizer Engine', 'Organization Core Users', 
        'School Overview Analytics', 'Revenue Tracker Details', 'Expense Audit Logs', 'Profitability Statements', 
        'Staff Lifecycle Directory', 'Student Growth Reports', 'Subscription Preferences', 
        'School Logo & Branding Customizer', 'AI Command Center', 'AI Content Studio', 'Payment Gateway Settings', 
        'HRMS', 'Timetable Generator', 'SMS Gateway', 'WhatsApp Integration', 'Email Automation', 
        'Push Notifications', 'AI Attendance Insights', 'AI Fee Defaulter Prediction', 'AI Student Performance Prediction', 
        'AI Admission Analytics', 'AI Performance Analytics', 'School KPI Dashboard', 'Revenue Dashboard', 
        'Student Growth Dashboard', 'Teacher Performance Dashboard', 'Room Allocation', 'Bed Allocation', 
        'Library Books', 'Hostel Portal', 'Transport Roster', 'Library Books Roster', 'Hostel Roster', 
        'Transport GPS Tracking', 'Teacher Leave Requests'
    ]

    print(f"Original length: {len(text)}")

    for feat in features_to_remove:
        # Match {activeFeature === 'feat' && ( or {activeFeature === "feat" && (
        # We need to find the exact starting index of `{`
        pattern = r'\{\s*activeFeature\s*===\s*[\'"]' + re.escape(feat) + r'[\'"]\s*&&\s*\('
        
        while True:
            match = re.search(pattern, text)
            if not match:
                break
            
            start_idx = match.start()
            open_count = 0
            in_block = False
            end_idx = -1
            
            for i in range(start_idx, len(text)):
                if text[i] == '{':
                    open_count += 1
                    in_block = True
                elif text[i] == '}':
                    open_count -= 1
                
                if in_block and open_count == 0:
                    end_idx = i + 1
                    break
            
            if end_idx != -1:
                text = text[:start_idx] + text[end_idx:]
            else:
                break

    # Now remove the roles from portalSpecs
    specs_match = re.search(r'(org_owner:\s*\{.*?\}\s*,?\s*school_owner:\s*\{.*?\}\s*,?\s*vice_principal:\s*\{.*?\}\s*,?\s*admissions:\s*\{.*?\}\s*,?\s*reception:\s*\{.*?\}\s*,?\s*accountant:\s*\{.*?\}\s*,?\s*hr:\s*\{.*?\}\s*,?\s*librarian:\s*\{.*?\}\s*,?\s*transport:\s*\{.*?\}\s*,?\s*hostel:\s*\{.*?\}\s*)', text, re.DOTALL)
    if specs_match:
        text = text.replace(specs_match.group(1), '')

    print(f"New length: {len(text)}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

if __name__ == '__main__':
    remove_blocks(sys.argv[1])
