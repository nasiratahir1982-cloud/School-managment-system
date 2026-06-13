const fs = require('fs');
const file = 'frontend/src/pages/UnifiedDashboard.tsx';
let content = fs.readFileSync(file, 'utf-8');

// 1. Update hr features
content = content.replace(
  'features: ["Employee Records", "Attendance Tracking", "Payroll Support", "Leave Approvals", "Performance Reviews", "Staff Recruitment"],',
  'features: ["Employee Records", "HRMS", "Attendance Tracking", "Payroll", "Leave Management", "Performance Reviews", "Recruitment"],'
);

// 2. Update teacher features
content = content.replace(
  'features: ["My Classes", "Attendance Register", "Grade Book", "Lesson Plans", "Assignments", "Student Remarks", "Class Diary", "Quiz Creation", "Parent Communication"],',
  'features: ["My Classes", "Attendance Register", "Timetable Generator", "Grade Book", "Exam Management", "Result Processing", "Lesson Plans", "Assignments", "Student Remarks", "Class Diary", "Quiz Creation", "Parent Communication", "AI Performance Analytics"],'
);

// 3. Update admin features
content = content.replace(
  'features: ["Student Management", "Employee Management", "Attendance Monitoring", "Fee Monitoring", "Academic Oversight", "Student Conduct Records", "School Notices", "Parent Communication Center", "Leave Management", "Admission Funnel Analytics", "Staff Performance Tracking", "Inventory Management", "Transport Management", "Hostel Management", "Visitor Management", "Payroll", "Two Factor Authentication", "Device Management", "Session Tracking", "IP Restriction", "Login Audit Trail", "AI Command Center", "AI Content Studio", "Payment Gateway Settings"],',
  'features: ["Student Management", "Employee Management", "Attendance Monitoring", "Fee Monitoring", "Academic Oversight", "Student Conduct Records", "School Notices", "Parent Communication Center", "Leave Management", "Admission Funnel Analytics", "Staff Performance Tracking", "Inventory Management", "Transport Management", "Hostel Management", "Visitor Management", "Payroll", "Two Factor Authentication", "Device Management", "Session Tracking", "IP Restriction", "Login Audit Trail", "Timetable Generator", "Exam Management", "Result Processing", "SMS Gateway", "WhatsApp Integration", "Email Automation", "Push Notifications", "School KPI Dashboard", "Revenue Dashboard", "Student Growth Dashboard", "Teacher Performance Dashboard", "AI Command Center", "AI Content Studio", "Payment Gateway Settings"],'
);

// 4. Update super_admin features
content = content.replace(
  'features: ["Country Management", "Organization Management", "School Management", "Subscription Plans", "Billing & Invoicing", "Revenue Analytics", "White Label Configuration", "Global Announcements", "Support Tickets", "Audit Logs", "Multi-Level Permissions", "Advanced Activity Monitoring", "School Health Monitoring", "Server Monitoring", "Backup Manager", "API Key Management", "SMS Gateway Settings", "Email Server Settings", "School Suspension System", "School Performance Analytics", "Fraud Detection Dashboard", "Two Factor Authentication", "Device Management", "Session Tracking", "IP Restriction", "Login Audit Trail", "AI Command Center", "AI Content Studio", "Payment Gateway Settings"],',
  'features: ["Country Management", "Organization Management", "School Management", "Subscription Plans", "Billing & Invoicing", "Revenue Analytics", "White Label Configuration", "Global Announcements", "Support Tickets", "Audit Logs", "Multi-Level Permissions", "Advanced Activity Monitoring", "School Health Monitoring", "Server Monitoring", "Backup Manager", "API Key Management", "SMS Gateway Settings", "Email Server Settings", "School Suspension System", "School Performance Analytics", "Fraud Detection Dashboard", "Two Factor Authentication", "Device Management", "Session Tracking", "IP Restriction", "Login Audit Trail", "SMS Gateway", "WhatsApp Integration", "Email Automation", "Push Notifications", "AI Attendance Insights", "AI Fee Defaulter Prediction", "AI Student Performance Prediction", "AI Admission Analytics", "School KPI Dashboard", "Revenue Dashboard", "Student Growth Dashboard", "Teacher Performance Dashboard", "AI Command Center", "AI Content Studio", "Payment Gateway Settings"],'
);

// 5. Add case statements for new features
const casesToInject = `
    // newly added generic features
    case 'HRMS':
      return { desc: 'Human Resource Management System central core.', icon: Users, stats: 'Active' };
    case 'Payroll':
      return { desc: 'Automated staff salary disbursement and tax calculations.', icon: Banknote, stats: 'Generated' };
    case 'Leave Management':
      return { desc: 'Track employee and student leave quotas and calendars.', icon: Calendar, stats: '5 Pending' };
    case 'Recruitment':
      return { desc: 'Applicant tracking and hiring pipelines.', icon: UserPlus, stats: '3 Openings' };
    case 'Timetable Generator':
      return { desc: 'Auto-generate collision-free class schedules.', icon: CalendarDays, stats: 'Drafted' };
    case 'Exam Management':
      return { desc: 'Create exam terms, date sheets, and print hall tickets.', icon: BookOpen, stats: 'Midterms Active' };
    case 'Result Processing':
      return { desc: 'Calculate aggregates and compile term report cards.', icon: Award, stats: 'Processing' };
    case 'SMS Gateway':
      return { desc: 'Configure Twilio or custom SMS providers.', icon: MessageSquare, stats: 'Connected' };
    case 'WhatsApp Integration':
      return { desc: 'Send automated WhatsApp alerts via Meta API.', icon: MessageCircle, stats: 'Live Sync' };
    case 'Email Automation':
      return { desc: 'Trigger automated email workflows via SendGrid/AWS.', icon: Mail, stats: 'Active' };
    case 'Push Notifications':
      return { desc: 'Mobile and Web Push alerts for parents/students.', icon: Bell, stats: '14k Sent' };
    case 'AI Attendance Insights':
      return { desc: 'Predictive analytics on dropout rates based on attendance.', icon: TrendingUp, stats: 'Updated' };
    case 'AI Fee Defaulter Prediction':
      return { desc: 'Machine learning model predicting late fee payers.', icon: AlertTriangle, stats: 'High Accuracy' };
    case 'AI Student Performance Prediction':
      return { desc: 'Forecast student final grades based on current trajectory.', icon: BrainCircuit, stats: 'Active Model' };
    case 'AI Admission Analytics':
      return { desc: 'Predicting enrollment conversion rates and trends.', icon: PieChart, stats: 'Live' };
    case 'AI Performance Analytics':
      return { desc: 'Visual graphs predicting student trajectories.', icon: LineChart, stats: 'Synced' };
    case 'School KPI Dashboard':
      return { desc: 'Master executive overview of top-level performance.', icon: BarChart3, stats: 'C-Level View' };
    case 'Revenue Dashboard':
      return { desc: 'Deep dive into financial health and projections.', icon: DollarSign, stats: 'Stable' };
    case 'Student Growth Dashboard':
      return { desc: 'Macro view of student academic and physical growth.', icon: LineChart, stats: 'Upward' };
    case 'Teacher Performance Dashboard':
      return { desc: 'Evaluation charts for faculty peer reviews and grades.', icon: Star, stats: 'Evaluated' };
`;

// Find default statement to inject before it
content = content.replace(
  "    default:",
  casesToInject + "    default:"
);

const newIcons = ['Banknote', 'CalendarDays', 'BookOpen', 'MessageCircle', 'Mail', 'BrainCircuit', 'PieChart', 'LineChart', 'BarChart3', 'DollarSign', 'Star'];

let importMatch = content.match(/import \\{([\\s\\S]*?)\\} from 'lucide-react'/);
if (importMatch) {
  let existingImports = importMatch[1];
  for (let icon of newIcons) {
    if (!existingImports.includes(icon)) {
      existingImports += ",\\n  " + icon;
    }
  }
  content = content.replace(/import \\{[\\s\\S]*?\\} from 'lucide-react'/, "import {" + existingImports + "} from 'lucide-react'");
}


fs.writeFileSync(file, content);
console.log("Successfully updated features arrays and cases.");
