import re

def clean_cases(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

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

    for feat in features_to_remove:
        # Match case '...': return { ... };
        pattern = r'\s*case\s*[\'\"]' + re.escape(feat) + r'[\'\"]:.*?return\s*\{.*?\};\s*'
        text = re.sub(pattern, '', text, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

if __name__ == '__main__':
    clean_cases('frontend/src/pages/UnifiedDashboard.tsx')
