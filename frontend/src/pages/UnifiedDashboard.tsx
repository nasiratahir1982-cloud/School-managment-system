import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../store/authStore';
import { useTenantStore, COUNTRY_CONFIGS } from '../store/tenantStore';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Layers, 
  LogOut, 
  Plus, 
  Activity, 
  CheckCircle,
  FileCode,
  Settings,
  Users,
  CreditCard,
  UserCheck,
  Calendar,
  AlertTriangle,
  GraduationCap,
  BookOpen,
  Map,
  Home,
  MessageSquare,
  FileText,
  HelpCircle,
  PhoneCall,
  Search,
  ChevronRight,
  TrendingUp,
  Award,
  Shield,
  Clock,
  Compass,
  ArrowRight,
  UserPlus,
  Sun,
  Moon
} from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface PortalSpec {
  title: string;
  subtitle: string;
  kpis: { label: string; value: string; icon: any; colorClass: string; desc: string }[];
  features: string[];
  quickActions: { label: string; desc: string; icon: any }[];
  placeholderText: string;
  supportGuides: { title: string; answerTitle: string; answerContent: string }[];
}

// ----------------------------------------------------
// PORTAL FEATURE NAVIGATION DETAILS MAPPING
// ----------------------------------------------------
const getFeatureDetails = (featureName: string) => {
  switch (featureName) {
    // Super Admin
    case 'Country Management':
      return { desc: 'Configure regional directories and active currencies.', icon: Map, stats: '5 Countries Active' };
    case 'Organization Management':
      return { desc: 'Manage school chains and franchise headquarters.', icon: Building2, stats: '12 Chains' };
    case 'School Management':
      return { desc: 'Register new school subdomains and tenant databases.', icon: GraduationCap, stats: '24 Campuses' };
    case 'Subscription Plans':
      return { desc: 'Establish licensing models and pricing plans.', icon: CreditCard, stats: '3 Plans Configured' };
    case 'Billing & Invoicing':
      return { desc: 'Review automated fee transactions & stripe invoices.', icon: FileText, stats: 'Audit Safe' };
    case 'Revenue Analytics':
      return { desc: 'Global earnings ledger and financial forecast chart.', icon: TrendingUp, stats: '+18.4% Growth' };
    case 'White Label Configuration':
      return { desc: 'Manage domain names, default mail and colors.', icon: Settings, stats: 'Active DNS' };
    case 'Global Announcements':
      return { desc: 'Broadcast banners to all campus dashboards.', icon: MessageSquare, stats: '2 Active Alerts' };
    case 'Support Tickets':
      return { desc: 'Resolve queries submitted by campus administrators.', icon: HelpCircle, stats: '0 Pending' };
    case 'Audit Logs':
      return { desc: 'Track database queries and administrative actions.', icon: Shield, stats: 'Protected' };

    // Admin / Principal
    case 'Student Management':
      return { desc: 'Enroll pupils, update profiles and roll listings.', icon: UserPlus, stats: '480 Enrolled' };
    case 'Teacher Management':
      return { desc: 'Register faculty contracts, departments & skills.', icon: Users, stats: '36 Active Staff' };
    case 'Attendance Monitoring':
      return { desc: 'Analyze daily attendance trends and summaries.', icon: UserCheck, stats: '92.4% Today' };
    case 'Fee Monitoring':
      return { desc: 'Track challans, defaults and monthly receipts.', icon: CreditCard, stats: 'Rs 125,000 Pending' };
    case 'Academic Oversight':
      return { desc: 'Monitor exams, grade books and lesson plan metrics.', icon: Award, stats: '2026-27 Session' };
    case 'Student Conduct Records':
      return { desc: 'Log behavioral incidents, warnings and rewards.', icon: Shield, stats: 'Conflict-Free' };
    case 'School Notices':
      return { desc: 'Send SMS & Email bulletins to parent contacts.', icon: MessageSquare, stats: 'Sync Complete' };
    case 'Parent Communications':
      return { desc: 'Review parent concerns and direct chat logs.', icon: PhoneCall, stats: 'Inbox Clear' };
    case 'Leave Approvals':
      return { desc: 'Review faculty leave requests and substitutions.', icon: CheckCircle, stats: '2 Pending' };

    // Teacher
    case 'My Classes':
      return { desc: 'View assigned class timetables and room codes.', icon: Home, stats: '3 Sections' };
    case 'Attendance Marking':
      return { desc: 'Record student check-ins and late arrivals.', icon: UserCheck, stats: '1 Pending Class' };
    case 'Homework Management':
      return { desc: 'Publish daily assignments and resource files.', icon: BookOpen, stats: '4 Assigned' };
    case 'Assignments Entry':
      return { desc: 'Review student file submissions and enter grades.', icon: FileText, stats: '12 to Grade' };
    case 'Marks Sheet':
      return { desc: 'Maintain term grades and mid-term card evaluations.', icon: Award, stats: 'Updated' };
    case 'Class Timetable':
      return { desc: 'Display period timelines and subject listings.', icon: Calendar, stats: '4 Periods Today' };
    case 'Parent Communication':
      return { desc: 'Send direct messages regarding student progress.', icon: MessageSquare, stats: 'Active chats' };
    case 'Teacher Leave Requests':
      return { desc: 'Submit leave request forms to principal workspace.', icon: Clock, stats: 'Approved' };

    // Student
    case 'Attendance Ledger':
      return { desc: 'Track monthly presence, absences & leaves.', icon: UserCheck, stats: '94% Presence' };
    case 'Assignments':
      return { desc: 'View homework, download guides and upload files.', icon: BookOpen, stats: '2 Due Soon' };
    case 'Exams Results':
      return { desc: 'Download midterm grades and school transcripts.', icon: Award, stats: 'A Average' };
    case 'Timetable':
      return { desc: 'Personalized Grade 10 period scheduler grid.', icon: Calendar, stats: 'Conflict-Free' };
    case 'Study Material':
      return { desc: 'Download class notes, guides and reading material.', icon: Compass, stats: '12 Resources' };
    case 'Recorded Lectures':
      return { desc: 'Watch lecture playback video streams.', icon: Activity, stats: 'Online' };
    case 'Fee Status':
      return { desc: 'Review invoice challans and receipt balance.', icon: CreditCard, stats: 'All Paid' };
    case 'Notifications':
      return { desc: 'Stay updated with school alerts and notices.', icon: MessageSquare, stats: '1 New Message' };

    // Parent
    case 'Child Attendance':
      return { desc: 'Monitor your child\'s daily presence check-ins.', icon: UserCheck, stats: '94% Presence' };
    case 'Exam Grades':
      return { desc: 'View report card transcripts and test scores.', icon: Award, stats: 'Outstanding' };
    case 'Fee Payments':
      return { desc: 'Process billing fees and download invoice receipts.', icon: CreditCard, stats: 'Rs 0 Due' };
    case 'Notifications Log':
      return { desc: 'Review school circulars, bulletins and memos.', icon: MessageSquare, stats: 'No Alerts' };
    case 'Teacher Communication':
      return { desc: 'Direct message support channel to class tutors.', icon: PhoneCall, stats: 'Direct Line' };
    case 'Leave Requests':
      return { desc: 'Request sick leaves for your child online.', icon: Clock, stats: '0 Active' };
    case 'Transport GPS Tracking':
      return { desc: 'Track school bus live location and ETA on map.', icon: Map, stats: 'En Route' };

    // Hostel Warden
    case 'Room Allocation':
      return { desc: 'Configure boarding rooms, capacities and wings.', icon: Home, stats: '14 Rooms Active' };
    case 'Bed Allocation':
      return { desc: 'Assign student bed codes and monitor room charts.', icon: Layers, stats: '42 Beds Occupied' };
    case 'Hostel Fees':
      return { desc: 'Monitor boarder dues, monthly mess bills & records.', icon: CreditCard, stats: '0 Defaulters' };
    case 'Mess Management':
      return { desc: 'Coordinate daily meal menus, stocks and timings.', icon: Activity, stats: 'Breakfast Active' };
    case 'Hostel Reports':
      return { desc: 'Compile Warden reports, check-in history & audits.', icon: FileText, stats: 'Weekly Safe' };

    // Transport Manager
    case 'Vehicles':
      return { desc: 'Maintain school bus registry and service logs.', icon: Home, stats: '8 Active Buses' };
    case 'Routes':
      return { desc: 'Manage pickup/drop stops, schedules and zones.', icon: Map, stats: '6 Set Routes' };
    case 'Drivers':
      return { desc: 'Directory of driver licenses, contact and shifts.', icon: Users, stats: '8 Drivers' };
    case 'Student Assignments':
      return { desc: 'Assign students to specific route buses.', icon: UserPlus, stats: '124 Registered' };
    case 'GPS Tracking':
      return { desc: 'View live bus locations and road speed feeds.', icon: Activity, stats: 'All Online' };
    case 'Transport Fees':
      return { desc: 'Monitor transport pricing plans and payments.', icon: CreditCard, stats: 'No Arrears' };

    // Librarian Desk
    case 'Book Management':
      return { desc: 'Register catalog volumes, genres and locations.', icon: BookOpen, stats: '12,450 Books' };
    case 'Issue Books':
      return { desc: 'Process checkout requests for students & staff.', icon: UserCheck, stats: '14 Today' };
    case 'Return Books':
      return { desc: 'Scan returned volumes and log return status.', icon: CheckCircle, stats: '8 Pending' };
    case 'Fine Collection':
      return { desc: 'Assess and collect fines for overdue books.', icon: CreditCard, stats: 'Rs 120 Pending' };
    case 'Inventory Tracking':
      return { desc: 'Conduct inventory checkups and stock checks.', icon: Layers, stats: '100% Audit Safe' };

    // Reception / Visitor
    case 'Visitor Management':
      return { desc: 'Record gate logs, visitor details and badges.', icon: Users, stats: '4 Active Today' };
    case 'Front Desk Operations':
      return { desc: 'Manage phone queries, packages and mails.', icon: PhoneCall, stats: 'Active Line' };
    case 'Appointment Scheduling':
      return { desc: 'Coordinate parent meetings with school staff.', icon: Calendar, stats: '2 Scheduled' };
    case 'Inquiry Handling':
      return { desc: 'Address walk-in inquiries and collect feedback.', icon: MessageSquare, stats: 'Resolved' };
    case 'Call Logs':
      return { desc: 'Document internal/external telephone records.', icon: Clock, stats: '14 Calls Today' };
    case 'Admission Guidance':
      return { desc: 'Share curriculum guides and program manuals.', icon: Compass, stats: '12 Distributed' };

    // Admission / CRM
    case 'Lead Management':
      return { desc: 'Track admission prospects and user profiles.', icon: UserPlus, stats: '42 Cold Leads' };
    case 'Inquiry Tracking':
      return { desc: 'Manage intake questions from contact form.', icon: MessageSquare, stats: '5 Active' };
    case 'Admission Applications':
      return { desc: 'Review online applicant profiles and documents.', icon: FileText, stats: '8 Pending Review' };
    case 'Interview Scheduling':
      return { desc: 'Schedule applicant interview rounds and dates.', icon: Calendar, stats: '3 Scheduled' };
    case 'Test Scheduling':
      return { desc: 'Coordinate entry evaluation tests and rooms.', icon: Award, stats: 'Next: Saturday' };
    case 'Follow-ups':
      return { desc: 'Automated contact workflows and follow-up emails.', icon: Clock, stats: '12 Queue' };
    case 'Enrollment Tracking':
      return { desc: 'Track registration payouts and enrollment codes.', icon: CheckCircle, stats: '14 Confirmed' };

    // Accounts / Fees
    case 'Fee Collection':
      return { desc: 'Process cashier challans and custom discounts.', icon: CreditCard, stats: 'Rs 42,000 Today' };
    case 'Fee Defaulters':
      return { desc: 'Generate defaulter notifications and fine logs.', icon: AlertTriangle, stats: '5 Defaulters' };
    case 'Expense Tracking':
      return { desc: 'Record campus operating expenses and audits.', icon: TrendingUp, stats: 'Audit Safe' };
    case 'Financial Reports':
      return { desc: 'Review balance statements and profit ledger.', icon: FileText, stats: 'Q2 Ready' };
    case 'Payroll Support':
      return { desc: 'Disburse staff salaries and calculate benefits.', icon: Users, stats: 'Synced' };
    case 'Invoicing':
      return { desc: 'Batch-generate monthly fee billing receipts.', icon: Layers, stats: 'Active Queue' };

    // HR Department
    case 'Employee Records':
      return { desc: 'Directory of staff files, profiles and history.', icon: Users, stats: '42 Staff Active' };
    case 'Recruitment':
      return { desc: 'Post new job ads and filter teacher resumes.', icon: UserPlus, stats: '2 Open Roles' };
    case 'Leave Management':
      return { desc: 'Track annual leave balances and teacher leaves.', icon: Clock, stats: 'Active Ledger' };
    case 'Performance Reviews':
      return { desc: 'Log classroom evaluations and feedback reports.', icon: Award, stats: 'Completed' };
    case 'Payroll Coordination':
      return { desc: 'Send attendance salary data to accounts desk.', icon: CreditCard, stats: 'Synced' };

    // Vice Principal
    case 'Academic Monitoring':
      return { desc: 'Inspect lesson plan records and syllabus guides.', icon: GraduationCap, stats: '82% Average' };
    case 'Teacher Performance':
      return { desc: 'Track classroom delivery scores and logs.', icon: TrendingUp, stats: 'Excellent' };
    case 'Timetable Oversight':
      return { desc: 'AI-optimize schedules and room bookings.', icon: Calendar, stats: 'Conflict-Free' };
    case 'Discipline Management':
      return { desc: 'Oversight of student infractions & actions.', icon: Shield, stats: '0 Incidents' };
    case 'Parent Concerns':
      return { desc: 'Resolve escalated parent requests and emails.', icon: MessageSquare, stats: 'Resolved' };

    // Org Owner
    case 'Organization Overview':
      return { desc: 'Aggregated analytics of all school campuses.', icon: Building2, stats: '12 Campuses' };
    case 'School Performance Matrix':
      return { desc: 'Compare campus growth, grades and rosters.', icon: TrendingUp, stats: 'Top: Lahore' };
    case 'Branch Performance Ledger':
      return { desc: 'Track branch operational costs and revenues.', icon: CreditCard, stats: 'Balanced' };
    case 'Campus Performance Analytics':
      return { desc: 'Assess teacher retention and student growth.', icon: Activity, stats: 'Steady' };
    case 'Group Revenue Reports':
      return { desc: 'Generate overall profit & balance statement.', icon: FileText, stats: 'Q2 Signed' };
    case 'Expansion Planning Wizard':
      return { desc: 'Run franchise projections and cost modeling.', icon: Compass, stats: 'Ready' };
    case 'Branding Customizer Engine':
      return { desc: 'Push network logo, theme & domains.', icon: Settings, stats: 'Active' };
    case 'Organization Core Users':
      return { desc: 'Manage franchise system admins and roles.', icon: Users, stats: '4 Members' };

    // School Network Owner
    case 'School Overview Analytics':
      return { desc: 'Review active attendance and fee tracking.', icon: Building2, stats: 'All Safe' };
    case 'Revenue Tracker Details':
      return { desc: 'Audit student fee collections and dues.', icon: CreditCard, stats: 'Live feed' };
    case 'Expense Audit Logs':
      return { desc: 'Inspect vendor invoices and salary vouchers.', icon: FileText, stats: 'Audit Done' };
    case 'Profitability Statements':
      return { desc: 'Download margin analysis and ledger audits.', icon: TrendingUp, stats: '30.3% Margin' };
    case 'Staff Lifecycle Directory':
      return { desc: 'Review teacher contracts and terminations.', icon: Users, stats: '36 Active' };
    case 'Student Growth Reports':
      return { desc: 'Track campus enrollment rates and trends.', icon: Activity, stats: '+12.4% Annual' };
    case 'Academic Grade Summaries':
      return { desc: 'Analyze passing ratios and exam trends.', icon: Award, stats: '89.2% Pass' };
    case 'Subscription Preferences':
      return { desc: 'Update software plan billing configurations.', icon: Settings, stats: 'Enterprise' };
    case 'School Logo & Branding Customizer':
      return { desc: 'Configure school banners, logos & theme.', icon: Compass, stats: 'Synced' };
    case 'AI Command Center':
      return { desc: 'AI-powered Academic, Financial, and Attendance intelligence analyzer.', icon: Activity, stats: '4 Analysts Online' };
    case 'AI Content Studio':
      return { desc: 'Generate high-converting campaigns and greetings in 8 languages.', icon: MessageSquare, stats: 'Active Studio' };
    case 'Payment Gateway Settings':
      return { desc: 'Manage localized fee checkout processors and Stripe credentials.', icon: CreditCard, stats: 'Stripe Enabled' };

    default:
      return { desc: 'Access operational modules and dashboard logs.', icon: BookOpen, stats: 'Operational' };
  }
};

// ----------------------------------------------------
// TIMETABLE STATIC DATA & CUSTOM THEME COLOR MAPPINGS
// ----------------------------------------------------
const getSubjectColor = (subject: string) => {
  switch (subject) {
    case 'Mathematics':
      return {
        bg: 'bg-purple-50/90 dark:bg-[#1a132e]/80',
        text: 'text-purple-700 dark:text-purple-300 font-extrabold',
        border: 'border-purple-400 dark:border-purple-500/80 shadow-[0_2px_8px_-2px_rgba(168,85,247,0.25)]'
      };
    case 'Physics':
      return {
        bg: 'bg-blue-50/90 dark:bg-[#10192e]/80',
        text: 'text-blue-700 dark:text-blue-300 font-extrabold',
        border: 'border-blue-400 dark:border-blue-500/80 shadow-[0_2px_8px_-2px_rgba(59,130,246,0.25)]'
      };
    case 'Chemistry':
      return {
        bg: 'bg-amber-50/90 dark:bg-[#201810]/80',
        text: 'text-amber-700 dark:text-amber-300 font-extrabold',
        border: 'border-amber-400 dark:border-amber-500/80 shadow-[0_2px_8px_-2px_rgba(245,158,11,0.25)]'
      };
    case 'Biology':
      return {
        bg: 'bg-emerald-50/90 dark:bg-[#0e2017]/80',
        text: 'text-emerald-700 dark:text-emerald-300 font-extrabold',
        border: 'border-emerald-400 dark:border-emerald-500/80 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.25)]'
      };
    case 'English Language':
      return {
        bg: 'bg-sky-50/90 dark:bg-[#0f1d2e]/80',
        text: 'text-sky-700 dark:text-sky-300 font-extrabold',
        border: 'border-sky-400 dark:border-sky-500/80 shadow-[0_2px_8px_-2px_rgba(14,165,233,0.25)]'
      };
    case 'Computer Science':
      return {
        bg: 'bg-pink-50/90 dark:bg-[#201019]/80',
        text: 'text-pink-700 dark:text-pink-300 font-extrabold',
        border: 'border-pink-400 dark:border-pink-500/80 shadow-[0_2px_8px_-2px_rgba(236,72,153,0.25)]'
      };
    default:
      return {
        bg: 'bg-slate-50/90 dark:bg-slate-900/80',
        text: 'text-slate-700 dark:text-slate-300 font-extrabold',
        border: 'border-slate-300 dark:border-slate-700 shadow-sm'
      };
  }
};

interface PeriodInfo {
  id: number;
  subject: string;
  teacher: string;
  time: string;
  room: string;
}

const WEEKLY_SCHEDULE_DATA: Record<string, PeriodInfo[]> = {
  Monday: [
    { id: 1, subject: 'Mathematics', teacher: 'Mrs. Hina M.', time: '08:30 - 09:15', room: 'Room 201' },
    { id: 2, subject: 'Physics', teacher: 'Mr. Raza A.', time: '09:15 - 10:00', room: 'Lab 1' },
    { id: 3, subject: 'English Language', teacher: 'Mrs. Sarah K.', time: '10:00 - 10:45', room: 'Room 102' },
    { id: 4, subject: 'Computer Science', teacher: 'Dr. Zahid H.', time: '11:15 - 12:00', room: 'CS Lab 2' },
    { id: 5, subject: 'Chemistry', teacher: 'Mrs. Asma B.', time: '12:00 - 12:45', room: 'Lab 3' },
    { id: 6, subject: 'Biology', teacher: 'Dr. Qasim S.', time: '12:45 - 01:30', room: 'Bio Lab' }
  ],
  Tuesday: [
    { id: 1, subject: 'Computer Science', teacher: 'Dr. Zahid H.', time: '08:30 - 09:15', room: 'CS Lab 2' },
    { id: 2, subject: 'Mathematics', teacher: 'Mrs. Hina M.', time: '09:15 - 10:00', room: 'Room 201' },
    { id: 3, subject: 'Chemistry', teacher: 'Mrs. Asma B.', time: '10:00 - 10:45', room: 'Lab 3' },
    { id: 4, subject: 'Biology', teacher: 'Dr. Qasim S.', time: '11:15 - 12:00', room: 'Bio Lab' },
    { id: 5, subject: 'Physics', teacher: 'Mr. Raza A.', time: '12:00 - 12:45', room: 'Lab 1' },
    { id: 6, subject: 'English Language', teacher: 'Mrs. Sarah K.', time: '12:45 - 01:30', room: 'Room 102' }
  ],
  Wednesday: [
    { id: 1, subject: 'Chemistry', teacher: 'Mrs. Asma B.', time: '08:30 - 09:15', room: 'Lab 3' },
    { id: 2, subject: 'Biology', teacher: 'Dr. Qasim S.', time: '09:15 - 10:00', room: 'Bio Lab' },
    { id: 3, subject: 'Mathematics', teacher: 'Mrs. Hina M.', time: '10:00 - 10:45', room: 'Room 201' },
    { id: 4, subject: 'Physics', teacher: 'Mr. Raza A.', time: '11:15 - 12:00', room: 'Lab 1' },
    { id: 5, subject: 'Computer Science', teacher: 'Dr. Zahid H.', time: '12:00 - 12:45', room: 'CS Lab 2' },
    { id: 6, subject: 'English Language', teacher: 'Mrs. Sarah K.', time: '12:45 - 01:30', room: 'Room 102' }
  ],
  Thursday: [
    { id: 1, subject: 'Physics', teacher: 'Mr. Raza A.', time: '08:30 - 09:15', room: 'Lab 1' },
    { id: 2, subject: 'English Language', teacher: 'Mrs. Sarah K.', time: '09:15 - 10:00', room: 'Room 102' },
    { id: 3, subject: 'Biology', teacher: 'Dr. Qasim S.', time: '10:00 - 10:45', room: 'Bio Lab' },
    { id: 4, subject: 'Chemistry', teacher: 'Mrs. Asma B.', time: '11:15 - 12:00', room: 'Lab 3' },
    { id: 5, subject: 'Mathematics', teacher: 'Mrs. Hina M.', time: '12:00 - 12:45', room: 'Room 201' },
    { id: 6, subject: 'Computer Science', teacher: 'Dr. Zahid H.', time: '12:45 - 01:30', room: 'CS Lab 2' }
  ],
  Friday: [
    { id: 1, subject: 'English Language', teacher: 'Mrs. Sarah K.', time: '08:30 - 09:15', room: 'Room 102' },
    { id: 2, subject: 'Chemistry', teacher: 'Mrs. Asma B.', time: '09:15 - 10:00', room: 'Lab 3' },
    { id: 3, subject: 'Mathematics', teacher: 'Mrs. Hina M.', time: '10:00 - 10:45', room: 'Room 201' },
    { id: 4, subject: 'Biology', teacher: 'Dr. Qasim S.', time: '11:15 - 12:00', room: 'Bio Lab' },
    { id: 5, subject: 'Physics', teacher: 'Mr. Raza A.', time: '12:00 - 12:45', room: 'Lab 1' },
    { id: 6, subject: 'Computer Science', teacher: 'Dr. Zahid H.', time: '12:45 - 01:30', room: 'CS Lab 2' }
  ]
};

export const UnifiedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const currentTenant = useTenantStore((state) => state.currentTenant);
  const { darkMode, toggleTheme } = useThemeStore();
  const formatCurrency = useTenantStore((state) => state.formatCurrency);
  const getRollLabel = useTenantStore((state) => state.getRollLabel);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [activeGuide, setActiveGuide] = useState<{ title: string; answerTitle: string; answerContent: string } | null>(null);

  // Core functional database state partitioned by school tenantId
  const [database, setDatabase] = useState<Record<string, {
    students: { id: string; name: string; roll: string; className: string; status: string }[];
    teachers: { id: string; name: string; subject: string; className: string; status: string }[];
    notices: { id: string; date: string; title: string; content: string }[];
    leaves: { id: string; name: string; date: string; reason: string; status: string }[];
    invoices: { id: string; student: string; amount: number; status: string }[];
    assignments: any[];
    disciplines: { id: string; name: string; date: string; infraction: string; action: string }[];
    parentMessages: { id: string; parent: string; date: string; subject: string; message: string }[];
  }>>(() => ({
    // 1. Dar-e-Arqam School (PK)
    '11111111-1111-1111-1111-111111111111': {
      students: [
        { id: '1', name: 'Kamran Shah', roll: '12', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Ayesha Siddiqui', roll: '04', className: 'Class 10-B', status: 'Present' },
        { id: '3', name: 'Zainab Ali', roll: '22', className: 'Class 9-A', status: 'Absent' }
      ],
      teachers: [
        { id: '1', name: 'Sarah Khan', subject: 'English', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'Raza Ahmed', subject: 'Physics', className: 'Class 10-B', status: 'Active' },
        { id: '3', name: 'Hina Malik', subject: 'Mathematics', className: 'Class 9-A', status: 'Active' }
      ],
      notices: [
        { id: '1', date: '2026-06-08', title: 'Summer Vacation Announcement', content: 'School will remain closed from June 15 to August 15 for summer holidays.' },
        { id: '2', date: '2026-06-05', title: 'Midterm Exam Schedule Uploaded', content: 'Exam starts on June 25. Please download date-sheets from portals.' }
      ],
      leaves: [
        { id: '1', name: 'Sarah Khan', date: '2026-06-10', reason: 'Medical Checkup', status: 'Pending' },
        { id: '2', name: 'Raza Ahmed', date: '2026-06-14', reason: 'Family Event', status: 'Pending' }
      ],
      invoices: [
        { id: 'INV-001', student: 'Kamran Shah', amount: 8500, status: 'Unpaid' },
        { id: 'INV-002', student: 'Ayesha Siddiqui', amount: 8500, status: 'Paid' },
        { id: 'INV-003', student: 'Zainab Ali', amount: 7200, status: 'Unpaid' }
      ],
      assignments: [
        { 
          id: '1', 
          title: 'Chapter 2: Electrostatics Homework', 
          subject: 'Physics', 
          publishDate: '2026-06-05', 
          dueDate: '2026-06-09', 
          fileName: 'physics_assignment_2.pdf', 
          fileType: 'pdf', 
          status: 'Published', 
          fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4gPj4gPj4gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNjAgPj4Kc3RyZWFtCkJUCi9GMSAxNCBUZgo1MCA3NTAgVGQKKEFjYWRlbWljIEh1YiAtIERlbW8gUGFzdCBQYXBlciBhbmQgSG9tZXdvcmsgQXNzaWdubWVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMjQgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA1IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgozMzMKJSVFT0Y='
        },
        { 
          id: '2', 
          title: 'Midterm Shakespeare Critical Essay', 
          subject: 'English', 
          publishDate: '2026-06-07', 
          dueDate: '2026-06-16', 
          fileName: 'hamlet_rubric_outline.docx', 
          fileType: 'word', 
          status: 'Published', 
          fileUrl: 'data:application/msword;base64,e1xydGYxXGFuc2kgRGVtbyBIb21ld29yayBEb2N1bWVudCBpbiBNUyBXb3JkIGZvcm1hdC59' 
        }
      ],
      disciplines: [
        { id: '1', name: 'Zainab Ali', date: '2026-06-08', infraction: 'Classroom Disruption', action: 'Warning Issued' },
        { id: '2', name: 'Kamran Shah', date: '2026-06-02', infraction: 'Late Arrival', action: 'Parent Notified' }
      ],
      parentMessages: [
        { id: '1', parent: 'M. Shah (Kamran\'s Father)', date: '2026-06-08', subject: 'Query about summer camp', message: 'Will school transport be available during the summer classes?' }
      ]
    },
    // 2. Beaconhouse Campus Lahore (PK)
    '22222222-2222-2222-2222-222222222222': {
      students: [
        { id: '1', name: 'Muhammad Ali', roll: '101', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Fatima Zahra', roll: '104', className: 'Class 10-B', status: 'Present' },
        { id: '3', name: 'Bilal Ahmed', roll: '102', className: 'Class 9-A', status: 'Absent' }
      ],
      teachers: [
        { id: '1', name: 'Usman Ghani', subject: 'English', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'Nida Yasir', subject: 'Physics', className: 'Class 10-B', status: 'Active' },
        { id: '3', name: 'Tariq Jameel', subject: 'Mathematics', className: 'Class 9-A', status: 'Active' }
      ],
      notices: [
        { id: '1', date: '2026-06-08', title: 'Beaconhouse Sports Day 2026', content: 'Annual sports activities begin next Friday at Lahore Main Stadium.' }
      ],
      leaves: [
        { id: '1', name: 'Usman Ghani', date: '2026-06-12', reason: 'Sick Leave', status: 'Pending' }
      ],
      invoices: [
        { id: 'INV-101', student: 'Muhammad Ali', amount: 12000, status: 'Unpaid' },
        { id: 'INV-102', student: 'Fatima Zahra', amount: 12000, status: 'Paid' }
      ],
      assignments: [
        { 
          id: '1', 
          title: 'Calculus Assignment 1', 
          subject: 'Mathematics', 
          publishDate: '2026-06-06', 
          dueDate: '2026-06-12', 
          fileName: 'calculus_drill_1.pdf', 
          fileType: 'pdf', 
          status: 'Published', 
          fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4gPj4gPj4gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNjAgPj4Kc3RyZWFtCkJUCi9GMSAxNCBUZgo1MCA3NTAgVGQKKEFjYWRlbWljIEh1YiAtIERlbW8gUGFzdCBQYXBlciBhbmQgSG9tZXdvcmsgQXNzaWdubWVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMjQgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA1IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgozMzMKJSVFT0Y='
        }
      ],
      disciplines: [
        { id: '1', name: 'Bilal Ahmed', date: '2026-06-07', infraction: 'Missing Homework', action: 'Warning Issued' }
      ],
      parentMessages: []
    },
    // 3. The Educators (PK)
    '33333333-3333-3333-3333-333333333333': {
      students: [
        { id: '1', name: 'Hamza Sohail', roll: '55', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Sana Javed', roll: '21', className: 'Class 10-B', status: 'Present' }
      ],
      teachers: [
        { id: '1', name: 'Maryam Bibi', subject: 'Urdu', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'Khalid Butt', subject: 'Science', className: 'Class 9-A', status: 'Active' }
      ],
      notices: [
        { id: '1', date: '2026-06-06', title: 'Parent Teacher Meeting', content: 'PTM is scheduled for Saturday. Report cards will be distributed.' }
      ],
      leaves: [],
      invoices: [
        { id: 'INV-201', student: 'Hamza Sohail', amount: 5000, status: 'Unpaid' }
      ],
      assignments: [],
      disciplines: [],
      parentMessages: []
    },
    // 4. Beaconhouse London (UK)
    '44444444-4444-4444-4444-444444444444': {
      students: [
        { id: '1', name: 'George Harrison', roll: '201', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Oliver Smith', roll: '202', className: 'Class 10-B', status: 'Present' }
      ],
      teachers: [
        { id: '1', name: 'John Watson', subject: 'Chemistry', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'Clara Oswald', subject: 'History', className: 'Class 10-B', status: 'Active' }
      ],
      notices: [
        { id: '1', date: '2026-06-08', title: 'GCSE Exam Prep Timetable', content: 'Check the board for extra coaching classes before the final mocks.' }
      ],
      leaves: [],
      invoices: [
        { id: 'INV-301', student: 'George Harrison', amount: 1200, status: 'Unpaid' }
      ],
      assignments: [],
      disciplines: [],
      parentMessages: []
    },
    // 5. Beaconhouse Dubai (AE)
    '55555555-5555-5555-5555-555555555555': {
      students: [
        { id: '1', name: 'Omar Al-Mansoori', roll: '301', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Yasmin Qureshi', roll: '302', className: 'Class 10-B', status: 'Present' }
      ],
      teachers: [
        { id: '1', name: 'Fatima Al-Hashimi', subject: 'Arabic', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'David Miller', subject: 'English', className: 'Class 10-B', status: 'Active' }
      ],
      notices: [
        { id: '1', date: '2026-06-07', title: 'Ramadan Timing Update', content: 'School hours will be adjusted as per government declarations.' }
      ],
      leaves: [],
      invoices: [
        { id: 'INV-401', student: 'Omar Al-Mansoori', amount: 2500, status: 'Unpaid' }
      ],
      assignments: [],
      disciplines: [],
      parentMessages: []
    },
    // 6. International Grammar School (SA)
    '66666666-6666-6666-6666-666666666666': {
      students: [
        { id: '1', name: 'Yasser Qahtani', roll: '401', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Layla Bukhari', roll: '402', className: 'Class 10-B', status: 'Present' }
      ],
      teachers: [
        { id: '1', name: 'Sheikh Abdul', subject: 'Islamic Studies', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'Reem', subject: 'Maths', className: 'Class 10-B', status: 'Active' }
      ],
      notices: [],
      leaves: [],
      invoices: [
        { id: 'INV-501', student: 'Yasser Qahtani', amount: 3000, status: 'Unpaid' }
      ],
      assignments: [],
      disciplines: [],
      parentMessages: []
    },
    // 7. Roots International (CA)
    '77777777-7777-7777-7777-777777777777': {
      students: [
        { id: '1', name: 'Jack Miller', roll: '501', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Emily Vance', roll: '502', className: 'Class 10-B', status: 'Present' }
      ],
      teachers: [
        { id: '1', name: 'Robert Downey', subject: 'Social Studies', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'Sarah Jenkins', subject: 'Biology', className: 'Class 10-B', status: 'Active' }
      ],
      notices: [],
      leaves: [],
      invoices: [
        { id: 'INV-601', student: 'Jack Miller', amount: 1500, status: 'Unpaid' }
      ],
      assignments: [],
      disciplines: [],
      parentMessages: []
    },
    // 8. Allied School Campus A (US)
    '00000000-0000-0000-0000-000000000000': {
      students: [
        { id: '1', name: 'John Doe', roll: '601', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Jane Doe', roll: '602', className: 'Class 10-B', status: 'Present' }
      ],
      teachers: [
        { id: '1', name: 'Alan Turing', subject: 'Computer Science', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'Ada Lovelace', subject: 'Mathematics', className: 'Class 10-B', status: 'Active' }
      ],
      notices: [],
      leaves: [],
      invoices: [
        { id: 'INV-701', student: 'John Doe', amount: 1800, status: 'Unpaid' }
      ],
      assignments: [],
      disciplines: [],
      parentMessages: []
    }
  }));

  // Resolve current active database partition
  const activeTenantId = currentTenant?.tenantId || '11111111-1111-1111-1111-111111111111';
  const tenantDb = database[activeTenantId] || database['11111111-1111-1111-1111-111111111111'];

  const students = tenantDb.students;
  const teachers = tenantDb.teachers;
  const notices = tenantDb.notices;
  const leaves = tenantDb.leaves;
  const invoices = tenantDb.invoices;
  const assignments = tenantDb.assignments;
  const disciplines = tenantDb.disciplines;
  const parentMessages = tenantDb.parentMessages;

  // Sync state updaters to target the selected tenant database partition
  const updateTenantDb = (key: string, updater: any) => {
    setDatabase(prev => {
      const current = prev[activeTenantId] || prev['11111111-1111-1111-1111-111111111111'];
      const updatedValue = typeof updater === 'function' ? updater(current[key as keyof typeof current]) : updater;
      return {
        ...prev,
        [activeTenantId]: {
          ...current,
          [key]: updatedValue
        }
      };
    });
  };

  const setStudents = (val: any) => updateTenantDb('students', val);
  const setTeachers = (val: any) => updateTenantDb('teachers', val);
  const setNotices = (val: any) => updateTenantDb('notices', val);
  const setLeaves = (val: any) => updateTenantDb('leaves', val);
  const setInvoices = (val: any) => updateTenantDb('invoices', val);
  const setAssignments = (val: any) => updateTenantDb('assignments', val);
  const setDisciplines = (val: any) => updateTenantDb('disciplines', val);
  const setParentMessages = (val: any) => updateTenantDb('parentMessages', val);

  const [completedAssignments, setCompletedAssignments] = useState<string[]>([]);
  const [activeVideoStreamUrl, setActiveVideoStreamUrl] = useState<string | null>(null);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentSubject, setNewAssignmentSubject] = useState('Physics');
  const [newAssignmentPublishDate, setNewAssignmentPublishDate] = useState('2026-06-08');
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('2026-06-15');
  const [newAssignmentFileName, setNewAssignmentFileName] = useState('');
  const [newAssignmentFileType, setNewAssignmentFileType] = useState('pdf');
  const [newAssignmentFileUrl, setNewAssignmentFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form Inputs
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Class 10-A');

  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  const [newTeacherClass, setNewTeacherClass] = useState('Class 10-A');

  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');

  const [newInvoiceStudent, setNewInvoiceStudent] = useState('Kamran Shah');
  const [newInvoiceAmount, setNewInvoiceAmount] = useState('8500');

  const [newDisciplineStudent, setNewDisciplineStudent] = useState('Kamran Shah');
  const [newDisciplineInfraction, setNewDisciplineInfraction] = useState('');
  const [newDisciplineAction, setNewDisciplineAction] = useState('Warning Issued');

  const [newParentMessageStudent, setNewParentMessageStudent] = useState('Kamran Shah');
  const [newParentMessageSubject, setNewParentMessageSubject] = useState('');
  const [newParentMessageText, setNewParentMessageText] = useState('');
  const [newParentMessageImage, setNewParentMessageImage] = useState<string | null>(null);

  // Academic Hub AI Studio & Gateway settings states
  const [studioCampaignType, setStudioCampaignType] = useState('admission');
  const [studioLanguage, setStudioLanguage] = useState('English');
  const [studioChannel, setStudioChannel] = useState('Facebook');
  const [studioGeneratedCaption, setStudioGeneratedCaption] = useState('');
  const [studioGeneratedHashtags, setStudioGeneratedHashtags] = useState('');
  const [studioLoading, setStudioLoading] = useState(false);
  const [gatewaysList, setGatewaysList] = useState([
    { name: "Stripe", active: true, localOnly: false },
    { name: "PayPal", active: true, localOnly: false },
    { name: "Easypaisa", active: true, localOnly: true },
    { name: "JazzCash", active: false, localOnly: true }
  ]);
  const [gatewayApiKeys, setGatewayApiKeys] = useState<Record<string, string>>({
    Stripe: "sk_test_51P...",
    PayPal: "client_id_live...",
    Easypaisa: "merchant_id_990..."
  });

  // SaaS Admin Custom states
  const [countries, setCountries] = useState([
    { id: '1', code: 'PK', name: 'Pakistan', currency: 'PKR', status: 'Active' },
    { id: '2', code: 'UK', name: 'United Kingdom', currency: 'GBP', status: 'Active' },
    { id: '3', code: 'AE', name: 'United Arab Emirates', currency: 'AED', status: 'Active' },
    { id: '4', code: 'SA', name: 'Saudi Arabia', currency: 'SAR', status: 'Active' },
    { id: '5', code: 'CA', name: 'Canada', currency: 'CAD', status: 'Active' }
  ]);
  const [newCountryCode, setNewCountryCode] = useState('');
  const [newCountryName, setNewCountryName] = useState('');
  const [newCountryCurrency, setNewCountryCurrency] = useState('USD');

  const [organizations, setOrganizations] = useState([
    { id: '1', name: 'Beaconhouse Group', owner: 'M. Ali', branches: 12, status: 'Active' },
    { id: '2', name: 'Dar-e-Arqam Network', owner: 'Kamran S.', branches: 8, status: 'Active' },
    { id: '3', name: 'The Educators', owner: 'Sana J.', branches: 6, status: 'Active' }
  ]);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgOwner, setNewOrgOwner] = useState('');
  const [newOrgBranches, setNewOrgBranches] = useState('1');

  const [schoolsList, setSchoolsList] = useState([
    { id: '1', name: 'Beaconhouse Campus Lahore', subdomain: 'beaconhouse-lahore', status: 'Active' },
    { id: '2', name: 'Dar-e-Arqam School Rawalpindi', subdomain: 'darearqam-rwp', status: 'Active' },
    { id: '3', name: 'Roots International Toronto', subdomain: 'roots-toronto', status: 'Active' }
  ]);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolSubdomain, setNewSchoolSubdomain] = useState('');

  const [subscriptionPlans, setSubscriptionPlans] = useState([
    { id: '1', name: 'Basic Academy Plan', price: 99, billing: 'Monthly', subscribers: 14 },
    { id: '2', name: 'Premium School Plan', price: 249, billing: 'Monthly', subscribers: 28 },
    { id: '3', name: 'Enterprise SaaS Plan', price: 599, billing: 'Monthly', subscribers: 12 }
  ]);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState('');
  const [newPlanBilling, setNewPlanBilling] = useState('Monthly');

  const [whiteLabelConfig, setWhiteLabelConfig] = useState({
    customDomain: 'portal.academichub.com',
    dnsStatus: 'Verified',
    primaryColor: '#6d28d9',
    secondaryColor: '#1e1b4b'
  });
  const [dnsInput, setDnsInput] = useState('portal.academichub.com');

  const [supportTickets, setSupportTickets] = useState([
    { id: 'TKT-901', sender: 'Principal Usman', subject: 'Easypaisa integration error', priority: 'High', status: 'Open' },
    { id: 'TKT-902', sender: 'Teacher Clara', subject: 'Gradebook CSV import failed', priority: 'Medium', status: 'Open' },
    { id: 'TKT-903', sender: 'Parent Oliver', subject: 'GPS Bus Tracker lag', priority: 'Low', status: 'Resolved' }
  ]);
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const [auditLogs] = useState([
    { id: '1', timestamp: '2026-06-10 19:45:12', user: 'superadmin', action: 'Created new tenant school: Allied School Campus A' },
    { id: '2', timestamp: '2026-06-10 18:22:04', user: 'admin', action: 'Approved leave request for Sarah Khan' },
    { id: '3', timestamp: '2026-06-10 17:15:58', user: 'accountant', action: 'Recorded cash fee collection for invoice INV-001' },
    { id: '4', timestamp: '2026-06-10 16:08:42', user: 'librarian', action: 'Issued book "Advanced Physics" to Kamran Shah' }
  ]);

  const [globalAnnouncements, setGlobalAnnouncements] = useState([
    { id: '1', date: '2026-06-10', title: 'System Maintenance Window', content: 'Database server upgrades scheduled for June 12, 02:00 AM UTC.' },
    { id: '2', date: '2026-06-08', title: 'New Payment Gateway Released', content: 'JazzCash auto-checkout is now active for Pakistan branches.' }
  ]);
  const [newAnnounceTitle, setNewAnnounceTitle] = useState('');
  const [newAnnounceContent, setNewAnnounceContent] = useState('');

  // Simple logout function
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleKpiClick = (label: string) => {
    const mapping: Record<string, string> = {
      // Principal / School Admin
      "Students Present Today": "Attendance Monitoring",
      "Teachers Present Today": "Teacher Management",
      "Collected Today": "Fee Monitoring",
      "Outstanding Fees": "Fee Monitoring",
      // Super Admin
      "Total Countries": "Country Management",
      "Organizations": "Organization Management",
      "Total Schools": "School Management",
      "Active Revenue": "Revenue Analytics",
      // Teacher
      "Today's Classes": "My Classes",
      "Attendance Pending": "Attendance Monitoring",
      "Assignments Due": "Assignments",
      "Upcoming Exams": "Academic Oversight",
      // Student
      "My Attendance": "Attendance Ledger",
      "Cumulative GPA": "Exams Results",
      // Parent
      "Child Attendance": "Child Attendance",
      "Fee Challan Status": "Fee Payments",
      "Next Exam": "Exam Grades",
      "Homework Due": "Homework Board",

      // Hostel Warden
      "Total Rooms": "Room Allocation",
      "Occupied Beds": "Bed Allocation",
      "Available Beds": "Bed Allocation",
      "Pending Hostel Fees": "Hostel Fees",

      // Transport Manager
      "Active Vehicles": "Vehicles",
      "Total Routes": "Routes",
      "Assigned Students": "Student Assignments",
      "GPS Server Link": "GPS Tracking",

      // Librarian Desk
      "Total Books": "Book Management",
      "Issued Books": "Issue Books",
      "Overdue Books": "Return Books",
      "Fines Collected": "Fine Collection",

      // HR Department
      "Total Employees": "Employee Records",
      "Leave Requests": "Leave Management",
      "Staff Attendance": "Employee Records",
      "Recruitment Active": "Recruitment",

      // Accounts and Fees Department
      "Fee Collection Today": "Fee Collection",
      "Defaulters Flagged": "Fee Defaulters",
      "Outstanding Invoices": "Invoicing",
      "Expenses this Month": "Expense Tracking",

      // Reception and Visitor Desk
      "Visitors Logged Today": "Visitor Management",
      "Appointments Today": "Appointment Scheduling",
      "Pending Inquiries": "Inquiry Handling",
      "Gate Logs Status": "Visitor Management",

      // Admission and CRM
      "Active Inquiries": "Inquiry Tracking",
      "Applications Vetting": "Admission Applications",
      "Interviews Scheduled": "Interview Scheduling",
      "Enrolled this Session": "Enrollment Tracking",

      // Vice Principal
      "Academic Sync Status": "Academic Monitoring",
      "Teacher Progress Logs": "Teacher Performance",
      "Active Discipline Files": "Discipline Management",
      "Timetable Status": "Timetable Oversight",

      // School Network Owner (School Owner)
      "Total Students": "Student Growth Reports",
      "Active Teachers": "Staff Lifecycle Directory",
      "Monthly Revenue": "Revenue Tracker Details",
      "Net Profit Margin": "Profitability Statements",

      // Organization Owner
      "Total Schools (Org)": "Organization Overview", // Adjusting if label was simple "Total Schools"
      "Active Branches": "Branch Performance Ledger",
      "Total Campuses": "Campus Performance Analytics",
      "Consolidated Revenue": "Group Revenue Reports"
    };
    
    // Fallback normalization in case label has small variances (e.g. Org Owner Total Schools vs Super Admin)
    let matchedLabel = label;
    if (label === 'Total Schools' && simulatedRole === 'org_owner') {
      matchedLabel = 'Total Schools (Org)';
    }

    const target = mapping[matchedLabel] || mapping[label];
    if (target) {
      setActiveFeature(target);
    } else {
      setActiveFeature(label);
    }
  };

  const handlePrintPdf = (reportType: string) => {
    const toCommaHsl = (hslStr: string) => {
      if (!hslStr) return '';
      if (hslStr.includes(',')) return hslStr;
      return hslStr.trim().split(/\s+/).join(', ');
    };

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to generate and print reports.");
      return;
    }

    let reportTitle = "";
    let reportHtml = "";
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    if (reportType === 'progress_card') {
      const currentTenantName = currentTenant?.schoolName || "Central Elite Grammar School";
      const hasLogo = !!currentTenant?.logoUrl;
      const logoHtml = hasLogo 
        ? `<img src="${currentTenant.logoUrl}" style="height: 65px; object-fit: contain; margin-bottom: 12px; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.08));" />`
        : `<div style="margin-bottom: 12px; display: inline-flex; justify-content: center; align-items: center; width: 60px; height: 60px; border-radius: 50%; border: 2px solid currentColor; font-size: 24px; font-weight: bold; background: rgba(0,0,0,0.03);">🎓</div>`;
      
      const primaryHsl = currentTenant?.themeSettings?.primaryHsl || '263.4 70% 50.4%';
      const secondaryHsl = currentTenant?.themeSettings?.secondaryHsl || '217.2 32.6% 16%';

      const primaryHslFormatted = toCommaHsl(primaryHsl);
      const secondaryHslFormatted = toCommaHsl(secondaryHsl);

      let themePrimary = `hsl(${primaryHslFormatted})`;
      let themeAccent = `hsl(${secondaryHslFormatted})`;
      let themeAccentLight = `hsla(${primaryHslFormatted.split(',')[0]}, 70%, 97%, 0.95)`;
      let themeSeal = `radial-gradient(circle, hsla(${primaryHslFormatted.split(',')[0]}, 80%, 75%, 0.9) 0%, hsl(${secondaryHslFormatted}) 100%)`;
      reportTitle = `${currentTenantName} - Student Progress Card`;
      reportHtml = `
        <div class="print-container" style="
          border: 3px solid ${themePrimary};
          outline: 1px solid ${themeAccent};
          outline-offset: -8px;
          padding: 45px 55px; 
          font-family: 'Outfit', 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif; 
          color: #1e293b; 
          background: #ffffff; 
          max-width: 850px; 
          margin: 0 auto; 
          box-sizing: border-box;
          position: relative;
        ">
          <!-- Corner Ornaments for Premium Certificate Style -->
          <div style="position: absolute; top: 14px; left: 14px; width: 20px; height: 20px; border-top: 3px solid ${themePrimary}; border-left: 3px solid ${themePrimary}; z-index: 10;"></div>
          <div style="position: absolute; top: 14px; right: 14px; width: 20px; height: 20px; border-top: 3px solid ${themePrimary}; border-right: 3px solid ${themePrimary}; z-index: 10;"></div>
          <div style="position: absolute; bottom: 14px; left: 14px; width: 20px; height: 20px; border-bottom: 3px solid ${themePrimary}; border-left: 3px solid ${themePrimary}; z-index: 10;"></div>
          <div style="position: absolute; bottom: 14px; right: 14px; width: 20px; height: 20px; border-bottom: 3px solid ${themePrimary}; border-right: 3px solid ${themePrimary}; z-index: 10;"></div>
          <!-- Premium Minimal Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px dashed #e2e8f0; padding-bottom: 24px; margin-bottom: 24px;">
            <div style="display: flex; gap: 16px; align-items: center;">
              <!-- School Logo -->
              <div style="width: 70px; height: 70px; display: flex; justify-content: center; align-items: center; border-radius: 16px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                ${logoHtml.replace('height: 65px', 'height: 58px')}
              </div>
              <div>
                <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: ${themePrimary}; letter-spacing: -0.5px; line-height: 1.2;">${currentTenantName}</h1>
                <p style="margin: 3px 0 0 0; font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Official Student Report Card</p>
                <p style="margin: 2px 0 0 0; font-size: 10px; color: #94a3b8; font-style: italic;">Academic Session: 2025 - 2026</p>
              </div>
            </div>
            
            <div style="text-align: right;">
              <span style="display: inline-block; padding: 6px 12px; border-radius: 20px; background: ${themeAccentLight}; color: ${themeAccent}; font-size: 10px; font-weight: 800; uppercase tracking-widest; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.5);">
                MIDTERM REPORT
              </span>
              <p style="margin: 6px 0 0 0; font-size: 10px; color: #64748b; font-weight: 500;">Issued: ${currentDate}</p>
            </div>
          </div>

          <!-- Student Meta Profile Grid -->
          <div style="
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 12px; 
            background: #f8fafc; 
            padding: 16px 20px; 
            border-radius: 16px; 
            border: 1px solid #cbd5e1;
            margin-bottom: 24px;
          ">
            <div>
              <span style="display: block; font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Student Name</span>
              <strong style="font-size: 13px; color: #0f172a;">Kamran Shah</strong>
            </div>
            <div>
              <span style="display: block; font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Admission ID</span>
              <strong style="font-size: 13px; color: #0f172a; font-family: monospace;">ADM-2026-001</strong>
            </div>
            <div>
              <span style="display: block; font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Class / Section</span>
              <strong style="font-size: 13px; color: #0f172a;">Class 10 - Sec A</strong>
            </div>
            <div>
              <span style="display: block; font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">${getRollLabel()}</span>
              <strong style="font-size: 13px; color: #0f172a; font-family: monospace;">AH-1002</strong>
            </div>
          </div>

          <!-- Academic Scores & Progress Bar Chart -->
          <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; margin-bottom: 24px; align-items: start;">
            <!-- Left Side: Roster Table -->
            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 800; color: #334155; uppercase tracking-wide;">Academic Grades Summary</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; border: 1.5px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 80%, 0.5); border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.01);">
                <thead>
                  <tr style="background: ${themePrimary}; color: #ffffff;">
                    <th style="padding: 10px 14px; text-align: left; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Subject</th>
                    <th style="padding: 10px 14px; text-align: center; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Marks</th>
                    <th style="padding: 10px 14px; text-align: center; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Grade</th>
                    <th style="padding: 10px 14px; text-align: right; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Result</th>
                  </tr>
                </thead>
                <tbody style="background: #ffffff; color: #334155;">
                  <tr style="border-bottom: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">
                    <td style="padding: 10px 14px; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Mathematics</td>
                    <td style="padding: 10px 14px; text-align: center; font-family: monospace; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">92%</td>
                    <td style="padding: 10px 14px; text-align: center; font-weight: 800; color: ${themeAccent}; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">A+</td>
                    <td style="padding: 10px 14px; text-align: right; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);"><span style="background: #e2fbf0; color: #10b981; padding: 2px 8px; font-weight: bold; border-radius: 12px; font-size: 9px;">Pass</span></td>
                  </tr>
                  <tr style="border-bottom: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">
                    <td style="padding: 10px 14px; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Physics</td>
                    <td style="padding: 10px 14px; text-align: center; font-family: monospace; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">88%</td>
                    <td style="padding: 10px 14px; text-align: center; font-weight: 800; color: ${themeAccent}; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">A</td>
                    <td style="padding: 10px 14px; text-align: right; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);"><span style="background: #e2fbf0; color: #10b981; padding: 2px 8px; font-weight: bold; border-radius: 12px; font-size: 9px;">Pass</span></td>
                  </tr>
                  <tr style="border-bottom: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">
                    <td style="padding: 10px 14px; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Chemistry</td>
                    <td style="padding: 10px 14px; text-align: center; font-family: monospace; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">79%</td>
                    <td style="padding: 10px 14px; text-align: center; font-weight: 800; color: ${themeAccent}; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">B+</td>
                    <td style="padding: 10px 14px; text-align: right; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);"><span style="background: #e2fbf0; color: #10b981; padding: 2px 8px; font-weight: bold; border-radius: 12px; font-size: 9px;">Pass</span></td>
                  </tr>
                  <tr style="border-bottom: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">
                    <td style="padding: 10px 14px; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Biology</td>
                    <td style="padding: 10px 14px; text-align: center; font-family: monospace; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">90%</td>
                    <td style="padding: 10px 14px; text-align: center; font-weight: 800; color: ${themeAccent}; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">A</td>
                    <td style="padding: 10px 14px; text-align: right; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);"><span style="background: #e2fbf0; color: #10b981; padding: 2px 8px; font-weight: bold; border-radius: 12px; font-size: 9px;">Pass</span></td>
                  </tr>
                  <tr style="border-bottom: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">
                    <td style="padding: 10px 14px; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">English Language</td>
                    <td style="padding: 10px 14px; text-align: center; font-family: monospace; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">94%</td>
                    <td style="padding: 10px 14px; text-align: center; font-weight: 800; color: ${themeAccent}; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">A</td>
                    <td style="padding: 10px 14px; text-align: right; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);"><span style="background: #e2fbf0; color: #10b981; padding: 2px 8px; font-weight: bold; border-radius: 12px; font-size: 9px;">Pass</span></td>
                  </tr>
                  <tr style="border-bottom: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">
                    <td style="padding: 10px 14px; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Computer Science</td>
                    <td style="padding: 10px 14px; text-align: center; font-family: monospace; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">95%</td>
                    <td style="padding: 10px 14px; text-align: center; font-weight: 800; color: ${themeAccent}; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">A+</td>
                    <td style="padding: 10px 14px; text-align: right; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);"><span style="background: #e2fbf0; color: #10b981; padding: 2px 8px; font-weight: bold; border-radius: 12px; font-size: 9px;">Pass</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Right Side: Performance Gauges -->
            <div style="
              background: #fafafa; 
              border: 1px solid #f1f5f9; 
              padding: 20px; 
              border-radius: 16px;
              display: flex;
              flex-direction: column;
              gap: 16px;
            ">
              <h3 style="margin: 0; font-size: 12px; font-weight: 800; color: #334155; uppercase tracking-wide;">Performance Metrics</h3>
              
              <!-- Circular GPA Gauge -->
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="
                  width: 64px; 
                  height: 64px; 
                  border-radius: 50%; 
                  background: conic-gradient(${themePrimary} 88%, #e2e8f0 0); 
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                ">
                  <div style="width: 50px; height: 50px; border-radius: 50%; background: #ffffff; display: flex; items-center; justify-content: center; font-size: 13px; font-weight: 900; color: ${themePrimary}; line-height: 50px; text-align: center;">
                    89.6%
                  </div>
                </div>
                <div>
                  <span style="display: block; font-size: 10px; font-weight: 700; color: #64748b; uppercase;">Class Average</span>
                  <strong style="font-size: 13px; color: #0f172a;">89.6% Overall Marks</strong>
                </div>
              </div>

              <!-- Attendance Bar -->
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: #64748b; uppercase; margin-bottom: 6px;">
                  <span>Attendance Rate</span>
                  <span style="color: #10b981;">96.5% Present</span>
                </div>
                <div style="height: 8px; width: 100%; bg: #e2e8f0; background: #e2e8f0; border-radius: 10px; overflow: hidden;">
                  <div style="height: 100%; width: 96.5%; background: #10b981; border-radius: 10px;"></div>
                </div>
              </div>

              <!-- Honors status badge -->
              <div style="background: ${themeAccentLight}; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4); padding: 12px; border-radius: 12px; text-align: center;">
                <span style="font-size: 9px; font-weight: 800; color: ${themeAccent}; uppercase tracking-wider block mb-1">HONOR ROLL INSIGNIA</span>
                <strong style="font-size: 11px; color: ${themePrimary}; block">Dean's List Placement Candidate</strong>
              </div>
            </div>
          </div>

          <!-- Principal remarks -->
          <div style="
            background: ${themeAccentLight}; 
            border-left: 4px solid ${themeAccent}; 
            padding: 16px 20px; 
            border-radius: 0 12px 12px 0; 
            font-size: 11.5px; 
            line-height: 1.6; 
            color: #334155;
            margin-bottom: 30px;
          ">
            <strong style="display: block; font-size: 11px; font-weight: 800; color: ${themePrimary}; text-transform: uppercase; tracking-wider mb-4;">Principal Remarks & Evaluation:</strong>
            Kamran has shown exceptional academic performance and analytical skills in mathematical topics and physical science modules. Attendance is stellar at 96.5%. He maintains high focus, is proactive in homework, and is strongly recommended for honor roll programs in the upcoming semester.
          </div>

          <!-- Signature Row -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 0 10px;">
            <div style="text-align: center; width: 180px;">
              <div style="border-bottom: 1px solid #cbd5e1; height: 32px; width: 100%; margin-bottom: 6px;"></div>
              <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Class Teacher</span>
            </div>
            
            <!-- Central Gold Stamp Seal -->
            <div style="position: relative; width: 80px; height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: ${themeSeal}; border-radius: 50%; box-shadow: 0 4px 12px hsla(${primaryHslFormatted.split(',')[0]}, 70%, 30%, 0.15); border: 2px dashed #ffffff; color: #fff; font-family: 'Cinzel', serif; font-size: 8px; font-weight: bold; text-align: center; text-transform: uppercase; line-height: 1.2;">
              <span>Official</span>
              <span style="font-size: 11px; margin: 1px 0;">★</span>
              <span>Certified</span>
            </div>

            <div style="text-align: center; width: 180px;">
              <div style="border-bottom: 1px solid #cbd5e1; height: 32px; width: 100%; margin-bottom: 6px;"></div>
              <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Principal Sign</span>
            </div>
          </div>
        </div>
      `;
    } else if (reportType === 'revenue_audit') {
      const currentTenantName = currentTenant?.schoolName || "Central Elite Grammar School";
      const hasLogo = !!currentTenant?.logoUrl;
      const logoHtml = hasLogo 
        ? `<img src="${currentTenant.logoUrl}" style="height: 50px; object-fit: contain; margin-bottom: 10px;" />`
        : `<span style="font-size: 20px;">🎓</span>`;

      // Theme logic fallback
      let themePrimary = '#1e1b4b'; 
      let themeBorder = '4px solid #1e1b4b';
      if (currentTenantName.includes('Dar-e-Arqam')) {
        themePrimary = '#064e3b';
        themeBorder = '4px solid #064e3b';
      } else if (currentTenantName.includes('Beaconhouse')) {
        themePrimary = '#1e3a8a';
        themeBorder = '4px solid #1e3a8a';
      } else if (currentTenantName.includes('Educators')) {
        themePrimary = '#1d4ed8';
        themeBorder = '4px solid #1d4ed8';
      }

      reportTitle = `${currentTenantName} - Revenue Audit Report`;
      reportHtml = `
        <div style="border: ${themeBorder}; padding: 35px; font-family: 'Inter', system-ui, sans-serif; color: #1e293b; background: #fafaf9; max-width: 800px; margin: 0 auto; border-radius: 6px;">
          <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
            ${logoHtml}
            <h1 style="margin: 5px 0 0 0; font-size: 24px; color: ${themePrimary}; font-weight: 800; text-transform: uppercase;">${currentTenantName}</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Consolidated Operational Roster & Revenue Audit</p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8; font-style: italic;">System generated audit logs: ${currentDate}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 13px; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background-color: ${themePrimary}; color: #ffffff;">
                <th style="padding: 12px; text-align: left; font-weight: 600;">Campus Subdomain</th>
                <th style="padding: 12px; text-align: center; font-weight: 600;">Total Active Pupils</th>
                <th style="padding: 12px; text-align: center; font-weight: 600;">Staff Active</th>
                <th style="padding: 12px; text-align: right; font-weight: 600;">Operational Margin</th>
              </tr>
            </thead>
            <tbody style="background: #ffffff;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px; font-weight: 600; color: #334155;">Beaconhouse Campus</td><td style="padding: 12px; text-align: center;">480</td><td style="padding: 12px; text-align: center;">36</td><td style="padding: 12px; text-align: right; color: #10b981; font-weight: bold;">32.4%</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px; font-weight: 600; color: #334155;">The Educators Main</td><td style="padding: 12px; text-align: center;">340</td><td style="padding: 12px; text-align: center;">28</td><td style="padding: 12px; text-align: right; color: #10b981; font-weight: bold;">28.1%</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px; font-weight: 600; color: #334155;">Dar-e-Arqam School</td><td style="padding: 12px; text-align: center;">420</td><td style="padding: 12px; text-align: center;">34</td><td style="padding: 12px; text-align: right; color: #10b981; font-weight: bold;">30.5%</td></tr>
            </tbody>
          </table>
          
          <div style="margin-top: 25px; font-size: 13px; font-weight: bold; text-align: right; color: ${themePrimary};">
            Consolidated Network Margin: 30.3% Active ERP Flow
          </div>
        </div>
      `;
    } else if (reportType === 'financial_statement') {
      const currentTenantName = currentTenant?.schoolName || "Central Elite Grammar School";
      const hasLogo = !!currentTenant?.logoUrl;
      const logoHtml = hasLogo 
        ? `<img src="${currentTenant.logoUrl}" style="height: 50px; object-fit: contain; margin-bottom: 10px;" />`
        : `<span style="font-size: 20px;">🎓</span>`;

      // Theme logic fallback
      let themePrimary = '#1e1b4b'; 
      let themeBorder = '4px solid #1e1b4b';
      if (currentTenantName.includes('Dar-e-Arqam')) {
        themePrimary = '#064e3b';
        themeBorder = '4px solid #064e3b';
      } else if (currentTenantName.includes('Beaconhouse')) {
        themePrimary = '#1e3a8a';
        themeBorder = '4px solid #1e3a8a';
      } else if (currentTenantName.includes('Educators')) {
        themePrimary = '#1d4ed8';
        themeBorder = '4px solid #1d4ed8';
      }

      reportTitle = `${currentTenantName} - Operations Cash-Flow Balance Statement`;
      reportHtml = `
        <div style="border: ${themeBorder}; padding: 35px; font-family: 'Inter', system-ui, sans-serif; color: #1e293b; background: #fafaf9; max-width: 800px; margin: 0 auto; border-radius: 6px;">
          <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
            ${logoHtml}
            <h1 style="margin: 5px 0 0 0; font-size: 24px; color: ${themePrimary}; font-weight: 800; text-transform: uppercase;">${currentTenantName}</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Double-Entry Operations Ledger & Balance Sheet</p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8; font-style: italic;">Statement Generated Date: ${currentDate}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 13px; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background-color: ${themePrimary}; color: #ffffff;">
                <th style="padding: 12px; text-align: left; font-weight: 600;">Transaction ID</th>
                <th style="padding: 12px; text-align: left; font-weight: 600;">Category Roster</th>
                <th style="padding: 12px; text-align: right; font-weight: 600;">Amount Ledger</th>
                <th style="padding: 12px; text-align: center; font-weight: 600;">Status</th>
              </tr>
            </thead>
            <tbody style="background: #ffffff;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px; font-family: monospace;">TX-2026-908</td><td style="padding: 12px; color: #334155; font-weight: 600;">Internet DSL Fiber Line</td><td style="padding: 12px; text-align: right; color: #ef4444; font-weight: bold;">-${formatCurrency(4800)}</td><td style="padding: 12px; text-align: center; color: #10b981; font-weight: bold;">Cleared</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px; font-family: monospace;">TX-2026-907</td><td style="padding: 12px; color: #334155; font-weight: 600;">Monthly Building Rent</td><td style="padding: 12px; text-align: right; color: #ef4444; font-weight: bold;">-${formatCurrency(35000)}</td><td style="padding: 12px; text-align: center; color: #10b981; font-weight: bold;">Cleared</td></tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (reportType === 'leads_funnel') {
      const currentTenantName = currentTenant?.schoolName || "Central Elite Grammar School";
      const hasLogo = !!currentTenant?.logoUrl;
      const logoHtml = hasLogo 
        ? `<img src="${currentTenant.logoUrl}" style="height: 50px; object-fit: contain; margin-bottom: 10px;" />`
        : `<span style="font-size: 20px;">🎓</span>`;

      // Theme logic fallback
      let themePrimary = '#1e1b4b'; 
      let themeBorder = '4px solid #1e1b4b';
      if (currentTenantName.includes('Dar-e-Arqam')) {
        themePrimary = '#064e3b';
        themeBorder = '4px solid #064e3b';
      } else if (currentTenantName.includes('Beaconhouse')) {
        themePrimary = '#1e3a8a';
        themeBorder = '4px solid #1e3a8a';
      } else if (currentTenantName.includes('Educators')) {
        themePrimary = '#1d4ed8';
        themeBorder = '4px solid #1d4ed8';
      }

      reportTitle = `${currentTenantName} - Prospective Leads CRM Funnel`;
      reportHtml = `
        <div style="border: ${themeBorder}; padding: 35px; font-family: 'Inter', system-ui, sans-serif; color: #1e293b; background: #fafaf9; max-width: 800px; margin: 0 auto; border-radius: 6px;">
          <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
            ${logoHtml}
            <h1 style="margin: 5px 0 0 0; font-size: 24px; color: ${themePrimary}; font-weight: 800; text-transform: uppercase;">${currentTenantName}</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Admission Inquiries & CRM Leads Funnel Statement</p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8; font-style: italic;">Logs Generated Date: ${currentDate}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 13px; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background-color: ${themePrimary}; color: #ffffff;">
                <th style="padding: 12px; text-align: left; font-weight: 600;">Applicant Candidate</th>
                <th style="padding: 12px; text-align: center; font-weight: 600;">Grade Scope</th>
                <th style="padding: 12px; text-align: center; font-weight: 600;">Lead Status</th>
              </tr>
            </thead>
            <tbody style="background: #ffffff;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px; font-weight: 600; color: #334155;">Haris Khan</td><td style="padding: 12px; text-align: center;">Class 9</td><td style="padding: 12px; text-align: center; color: #8b5cf6; font-weight: bold;">Interview Pending</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px; font-weight: 600; color: #334155;">Mona Siddiqui</td><td style="padding: 12px; text-align: center;">Class 10</td><td style="padding: 12px; text-align: center; color: #10b981; font-weight: bold;">Enrolled</td></tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (reportType === 'timetable') {
      const currentTenantName = currentTenant?.schoolName || "Central Elite Grammar School";
      const hasLogo = !!currentTenant?.logoUrl;
      const logoHtml = hasLogo 
        ? `<img src="${currentTenant.logoUrl}" style="height: 65px; object-fit: contain; margin-bottom: 12px; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.08));" />`
        : `<div style="margin-bottom: 12px; display: inline-flex; justify-content: center; align-items: center; width: 60px; height: 60px; border-radius: 50%; border: 2px solid currentColor; font-size: 24px; font-weight: bold; background: rgba(0,0,0,0.03);">🎓</div>`;
      
      const primaryHsl = currentTenant?.themeSettings?.primaryHsl || '263.4 70% 50.4%';
      const secondaryHsl = currentTenant?.themeSettings?.secondaryHsl || '217.2 32.6% 16%';

      const primaryHslFormatted = toCommaHsl(primaryHsl);
      const secondaryHslFormatted = toCommaHsl(secondaryHsl);

      let themePrimary = `hsl(${primaryHslFormatted})`;
      let themeAccent = `hsl(${secondaryHslFormatted})`;
      let themeAccentLight = `hsla(${primaryHslFormatted.split(',')[0]}, 70%, 97%, 0.95)`;

      reportTitle = `${currentTenantName} - Weekly Class Timetable`;
      
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      
      let rowsHtml = '';
      for (let pIdx = 0; pIdx < 6; pIdx++) {
        const periodNum = pIdx + 1;
        const timeRange = 
          periodNum === 1 ? '08:30 - 09:15' :
          periodNum === 2 ? '09:15 - 10:00' :
          periodNum === 3 ? '10:00 - 10:45' :
          periodNum === 4 ? '11:15 - 12:00' :
          periodNum === 5 ? '12:00 - 12:45' : '12:45 - 01:30';
          
        let rowColsHtml = `
          <td style="
            padding: 10px; 
            border: 1px solid #cbd5e1; 
            font-weight: 800; 
            background: #f8fafc;
            color: #0f172a;
            text-align: left;
            width: 12%;
          ">
            <div style="font-size: 12px; font-weight: 900; color: ${themePrimary};">Period ${periodNum}</div>
            <div style="font-size: 9px; font-family: monospace; color: #64748b; margin-top: 2px;">${timeRange}</div>
          </td>
        `;
        
        days.forEach(day => {
          const daySchedule = WEEKLY_SCHEDULE_DATA[day] || [];
          const classItem = daySchedule.find(p => p.id === periodNum) || { subject: 'Free Study', teacher: '-', room: '-' };
          
          let cardBg = '#f8fafc';
          let cardText = '#475569';
          let cardBorder = '#cbd5e1';
          
          if (classItem.subject === 'Mathematics') {
            cardBg = '#faf5ff'; cardText = '#7e22ce'; cardBorder = '#c084fc';
          } else if (classItem.subject === 'Physics') {
            cardBg = '#eff6ff'; cardText = '#1d4ed8'; cardBorder = '#60a5fa';
          } else if (classItem.subject === 'Chemistry') {
            cardBg = '#fffbeb'; cardText = '#b45309'; cardBorder = '#fbbf24';
          } else if (classItem.subject === 'Biology') {
            cardBg = '#ecfdf5'; cardText = '#047857'; cardBorder = '#34d399';
          } else if (classItem.subject === 'English Language') {
            cardBg = '#f0f9ff'; cardText = '#0369a1'; cardBorder = '#38bdf8';
          } else if (classItem.subject === 'Computer Science') {
            cardBg = '#fdf2f8'; cardText = '#be185d'; cardBorder = '#f472b6';
          }
          
          rowColsHtml += `
            <td style="
              padding: 6px; 
              border: 1px solid #cbd5e1; 
              text-align: center; 
              vertical-align: middle;
              background: #ffffff;
            ">
              <div style="
                background: ${cardBg}; 
                border: 2px solid ${cardBorder}; 
                border-radius: 8px; 
                padding: 8px; 
                height: 80px; 
                display: flex; 
                flex-direction: column; 
                justify-content: space-between; 
                box-sizing: border-box;
              ">
                <div style="font-weight: 900; font-size: 11px; color: ${cardText}; text-transform: uppercase; margin-bottom: 2px; line-height: 1.1;">
                  ${classItem.subject}
                </div>
                <div style="border-top: 1px dashed rgba(0,0,0,0.06); padding-top: 2px;">
                  <span style="display: block; font-size: 9px; font-weight: 800; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${classItem.teacher}
                  </span>
                  <span style="display: block; font-size: 8px; font-weight: 700; color: #64748b; margin-top: 1px;">
                    Rm: ${classItem.room}
                  </span>
                </div>
              </div>
            </td>
          `;
        });
        
        rowsHtml += `<tr style="page-break-inside: avoid;">${rowColsHtml}</tr>`;
      }

      reportHtml = `
        <div class="print-container" style="
          border: 3px solid ${themePrimary};
          outline: 1px solid ${themeAccent};
          outline-offset: -8px;
          padding: 24px; 
          font-family: 'Outfit', 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif; 
          color: #1e293b; 
          background: #ffffff; 
          width: 100%; 
          box-sizing: border-box;
          position: relative;
          text-align: center;
        ">
          <!-- Corner Ornaments -->
          <div style="position: absolute; top: 12px; left: 12px; width: 16px; height: 16px; border-top: 3px solid ${themePrimary}; border-left: 3px solid ${themePrimary};"></div>
          <div style="position: absolute; top: 12px; right: 12px; width: 16px; height: 16px; border-top: 3px solid ${themePrimary}; border-right: 3px solid ${themePrimary};"></div>
          <div style="position: absolute; bottom: 12px; left: 12px; width: 16px; height: 16px; border-bottom: 3px solid ${themePrimary}; border-left: 3px solid ${themePrimary};"></div>
          <div style="position: absolute; bottom: 12px; right: 12px; width: 16px; height: 16px; border-bottom: 3px solid ${themePrimary}; border-right: 3px solid ${themePrimary};"></div>

          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 12px; margin-bottom: 16px;">
            <div style="display: flex; gap: 12px; align-items: center; text-align: left;">
              <div style="width: 55px; height: 55px; display: flex; justify-content: center; align-items: center; border-radius: 10px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 4px;">
                ${logoHtml.replace('height: 65px', 'height: 48px')}
              </div>
              <div>
                <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: ${themePrimary}; letter-spacing: -0.5px; line-height: 1.2;">${currentTenantName}</h1>
                <p style="margin: 2px 0 0 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Official Class Schedule &amp; Period Matrix</p>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="display: inline-block; padding: 4px 8px; border-radius: 20px; background: ${themeAccentLight}; color: ${themeAccent}; font-size: 9px; font-weight: 800; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.5);">
                WEEKLY MATRIX
              </span>
              <p style="margin: 4px 0 0 0; font-size: 8px; color: #64748b; font-weight: 600;">Academic Year: 2025 - 2026</p>
            </div>
          </div>

          <!-- Timetable Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; table-layout: fixed;">
            <thead>
              <tr style="background: ${themePrimary}; color: #ffffff;">
                <th style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 800; font-size: 11px; width: 12%; text-align: left;">Period</th>
                <th style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 800; font-size: 11px; width: 17.6%; text-align: center;">Monday</th>
                <th style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 800; font-size: 11px; width: 17.6%; text-align: center;">Tuesday</th>
                <th style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 800; font-size: 11px; width: 17.6%; text-align: center;">Wednesday</th>
                <th style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 800; font-size: 11px; width: 17.6%; text-align: center;">Thursday</th>
                <th style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 800; font-size: 11px; width: 17.6%; text-align: center;">Friday</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <!-- Footer/Legend -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 9px; color: #64748b; font-weight: 600;">
            <div>* This schedule is subject to institutional reviews and official calendar alterations.</div>
            <div style="font-family: monospace;">Generated: ${currentDate}</div>
          </div>
        </div>
      `;
    }

    const paperOrientation = (reportType === 'timetable') ? 'landscape' : 'portrait';
    const containerMaxWidth = (reportType === 'timetable') ? '1100px' : '800px';

    printWindow.document.write(`
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            html, body {
              height: 100%;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #f1f5f9;
              font-family: sans-serif;
            }
            @media print {
              @page {
                size: ${paperOrientation};
                margin: 4mm 6mm !important;
              }
              html, body {
                height: 100% !important;
                background-color: #ffffff !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              body {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
              }
              .print-container {
                box-shadow: none !important;
                margin: 0 !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
            }
          </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 500);">
          <div style="width: 100%; max-width: ${containerMaxWidth}; margin: auto;">
            ${reportHtml}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  
  const [simulatedRole, setSimulatedRole] = useState<UserRole>(
    currentUser?.role === 'super_admin' ? 'admin' : (currentUser?.role || 'admin')
  );
  
  const isEditor = !['student', 'parent'].includes(simulatedRole);

  const canUserEditSection = (section: string): boolean => {
    if (['student', 'parent'].includes(simulatedRole)) return false;
    const role = currentUser?.role || 'student';
    if (['super_admin', 'admin', 'vice_principal', 'org_owner', 'school_owner'].includes(role)) {
      return true;
    }
    switch (section) {
      case 'assignments':
      case 'homework':
      case 'grades':
      case 'attendance':
      case 'notices':
        return role === 'teacher';
      case 'library':
        return role === 'librarian';
      case 'hostel':
        return role === 'hostel';
      case 'transport':
        return role === 'transport';
      case 'finance':
      case 'accounts':
        return role === 'accountant';
      case 'hr':
        return role === 'hr';
      case 'reception':
        return role === 'reception';
      case 'admissions':
        return role === 'admissions';
      default:
        return false;
    }
  };

  const [securityPendingAction, setSecurityPendingAction] = useState<(() => void) | null>(null);
  const [securityPendingActionWithData, setSecurityPendingActionWithData] = useState<((data: any) => void) | null>(null);
  const [securityModalType, setSecurityModalType] = useState<'default' | 'rename' | 'attach' | 'submit'>('default');
  const [securityRenameValue, setSecurityRenameValue] = useState('');
  const [securityAttachUrl, setSecurityAttachUrl] = useState('');
  const [securityAttachName, setSecurityAttachName] = useState('');
  const [securitySubmitFile, setSecuritySubmitFile] = useState('');
  const [securityConfirmMessage, setSecurityConfirmMessage] = useState('');
  const [securityPasswordInput, setSecurityPasswordInput] = useState('');
  const [securityModalError, setSecurityModalError] = useState('');

  const requestSecurityVerification = (
    message: string, 
    action: any,
    type: 'default' | 'rename' | 'attach' | 'submit' = 'default',
    initialValues?: { title?: string; url?: string; name?: string }
  ) => {
    setSecurityConfirmMessage(message);
    setSecurityModalType(type);
    setSecurityPasswordInput('');
    setSecurityModalError('');
    
    if (type === 'rename') {
      setSecurityRenameValue(initialValues?.title || '');
      setSecurityPendingActionWithData(() => action);
      setSecurityPendingAction(null);
    } else if (type === 'attach') {
      setSecurityAttachUrl(initialValues?.url || '');
      setSecurityAttachName(initialValues?.name || '');
      setSecurityPendingActionWithData(() => action);
      setSecurityPendingAction(null);
    } else if (type === 'submit') {
      setSecuritySubmitFile(initialValues?.name || '');
      setSecurityPendingActionWithData(() => action);
      setSecurityPendingAction(null);
    } else {
      setSecurityPendingAction(() => action);
      setSecurityPendingActionWithData(null);
    }
  };

  // Timetable State management
  const [activeTimetableDay, setActiveTimetableDay] = useState<string>('Monday');
  const [timetableTab, setTimetableTab] = useState<'daily' | 'weekly'>('weekly');

  // Hostel Maintenance Logs State
  const [maintenanceLogs, setMaintenanceLogs] = useState([
    { id: '1', title: 'Wing A - Water heater leak issue', status: 'Pending Fix' },
    { id: '2', title: 'Wing B - AC filter replacement', status: 'Resolved' }
  ]);

  // Hostel Invoices State
  const [hostelInvoices, setHostelInvoices] = useState([
    { id: '1', name: 'Kamran Shah', room: 'Wing A - Room 104', amount: 8500, status: 'Unpaid', dueDate: '2026-06-15' },
    { id: '2', name: 'Ayesha Siddiqui', room: 'Wing A - Room 104', amount: 8500, status: 'Paid', dueDate: '2026-06-05' },
    { id: '3', name: 'Muhammad Ali', room: 'Wing B - Room 202', amount: 8500, status: 'Unpaid', dueDate: '2026-06-15' }
  ]);

  // Appointment Schedules State
  const [appointments, setAppointments] = useState([
    { id: '1', visitor: 'Mr. & Mrs. Akbar', host: 'Vice Principal', dateTime: 'June 10, 11:30 AM', status: 'Confirmed' },
    { id: '2', visitor: 'Bilal Ahmed', host: 'Admissions Desk', dateTime: 'June 10, 12:15 PM', status: 'Confirmed' },
    { id: '3', visitor: 'Zainab Fatima', host: 'Accounts Manager', dateTime: 'June 10, 01:00 PM', status: 'Pending' },
    { id: '4', visitor: 'Dr. & Mrs. Tariq', host: 'Principal', dateTime: 'June 10, 02:00 PM', status: 'Confirmed' },
    { id: '5', visitor: 'Sarah Malik', host: 'Class Teacher 10-A', dateTime: 'June 10, 02:45 PM', status: 'Rescheduled' },
    { id: '6', visitor: 'Muhammad Ali', host: 'Hostel Warden', dateTime: 'June 10, 03:30 PM', status: 'Confirmed' }
  ]);

  // Secure deletion states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deletePasswordError, setDeletePasswordError] = useState('');
  const [pendingDeleteAction, setPendingDeleteAction] = useState<(() => void) | null>(null);

  const getExpectedPasskey = () => {
    const role = currentUser?.role;
    if (role === 'super_admin') return 'superpass123';
    if (role === 'admin') return 'principalpass123';
    if (role === 'teacher') return 'teacherpass123';
    if (role === 'student') return 'studentpass123';
    if (role === 'parent') return 'parentpass123';
    if (role === 'org_owner') return 'orgpass123';
    if (role === 'school_owner') return 'networkpass123';
    if (role === 'vice_principal') return 'vicepass123';
    if (role === 'admissions') return 'admissionpass123';
    if (role === 'reception') return 'receptionpass123';
    if (role === 'accountant') return 'financepass123';
    if (role === 'hr') return 'hrpass123';
    if (role === 'librarian') return 'librarypass123';
    if (role === 'transport') return 'drivepass123';
    if (role === 'hostel') return 'hostelpass123';
    return 'principalpass123';
  };

  const requestSecureDelete = (message: string, onAgree: () => void) => {
    setDeleteConfirmMessage(message);
    setPendingDeleteAction(() => onAgree);
    setDeletePassword('');
    setDeletePasswordError('');
    setDeleteConfirmOpen(true);
  };

  const handleExecuteDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (deletePassword === getExpectedPasskey()) {
      if (pendingDeleteAction) pendingDeleteAction();
      setDeleteConfirmOpen(false);
      setPendingDeleteAction(null);
      setDeletePassword('');
      setDeletePasswordError('');
    } else {
      setDeletePasswordError('Incorrect security credentials! Password must match current login password.');
    }
  };

  const kamranStatus = students.find(s => s.name === 'Kamran Shah')?.status || 'Present';
  const studentAttendanceVal = kamranStatus === 'Present' ? '96.7%' : '93.3%';
  const parentAttendanceVal = kamranStatus === 'Present' ? '96.7% Present' : '93.3% Absent';

  const pendingCount = assignments.filter(a => a.publishDate <= '2026-06-08' && !completedAssignments.includes(a.id)).length;

  // Map each role to their unique KPIs, features list, and context
  const portalSpecs: Record<UserRole, PortalSpec> = {
    super_admin: {
      title: "Academic Hub Master Control",
      subtitle: "Global School Administration Center",
      kpis: [
        { label: "Total Countries", value: "6 Active", icon: GlobeIcon, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "PK, UK, AE, SA, US, CA" },
        { label: "Organizations", value: "14 Groups", icon: Building2, colorClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25", desc: "School groups overview" },
        { label: "Total Schools", value: "184 Schools", icon: Layers, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Secure data channels active" },
        { label: "Active Revenue", value: "$48,920/mo", icon: TrendingUp, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", desc: "Monthly collection records" }
      ],
      features: ["Country Management", "Organization Management", "School Management", "Subscription Plans", "Billing & Invoicing", "Revenue Analytics", "White Label Configuration", "Global Announcements", "Support Tickets", "Audit Logs", "AI Command Center", "AI Content Studio", "Payment Gateway Settings"],
      quickActions: [
        { label: "Add New School", desc: "Create school profile", icon: Plus },
        { label: "Broadcast Alert", desc: "Dispatch global notification", icon: MessageSquare }
      ],
      placeholderText: "Super Admin Platform Monitoring & School List active.",
      supportGuides: [
        { title: "🏢 How to register a new school?", answerTitle: "New School Registration", answerContent: "Navigate to 'Add New School' quick action, input subdomain (e.g., schoolname.academichub.com), select license type, and click Deploy. Private data security is active automatically." },
        { title: "💳 Customizing Stripe payment webhooks?", answerTitle: "Stripe Webhooks Guide", answerContent: "Ensure Stripe API keys are configured in subscription settings. Webhook secret is generated dynamically. Secure with verification key." },
        { title: "🌍 Registering a new operation country?", answerTitle: "Adding Country Registry", answerContent: "Go to Country Management, input ISO-3 country code, name, default currency, and phone prefix. System applies localized tax models." },
        { title: "🛡️ Restoring a school backup statement?", answerTitle: "System Backup History", answerContent: "Navigate to Audit Logs, select date range, click Recover next to school database. Process requires security credentials verification." }
      ]
    },
    admin: { // Principal / Admin
      title: "Academic Control Center",
      subtitle: "Principal Operations & Management Workspace",
      kpis: [
        { label: "Students Present Today", value: "92.4%", icon: UserCheck, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Student check-ins active" },
        { label: "Teachers Present Today", value: "98.1%", icon: GraduationCap, colorClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25", desc: "Staff Attendance Synced" },
        { label: "Collected Today", value: formatCurrency(8400), icon: CreditCard, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Real-time payment logs" },
        { label: "Outstanding Fees", value: formatCurrency(125000), icon: AlertTriangle, colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25", desc: "5 unpaid students" }
      ],
      features: ["Student Management", "Teacher Management", "Attendance Monitoring", "Fee Monitoring", "Academic Oversight", "Student Conduct Records", "School Notices", "Parent Communications", "Leave Approvals", "AI Command Center", "AI Content Studio", "Payment Gateway Settings"],
      quickActions: [
        { label: "Enroll Student", desc: "Record new admission registry", icon: UserPlus },
        { label: "Publish Notice", desc: "Send SMS/Email notification", icon: MessageSquare }
      ],
      placeholderText: "Principal Management console. Review student registries and manage teachers.",
      supportGuides: [
        { title: "📖 How to register a student?", answerTitle: "Student Admission & Enrollment", answerContent: "Go to Student Management, fill out the student registration registry form with Student Name, Roll Registry, and Class Group, then submit." },
        { title: "🎫 Reviewing faculty leave requests?", answerTitle: "Faculty Leave Approvals", answerContent: "Navigate to Leave Approvals feature, view pending requests from teachers, and approve or reject them dynamically." },
        { title: "💳 Dispatching school fee challans?", answerTitle: "Fee Invoice Distribution", answerContent: "Open Fee Monitoring, click 'Generate Challans' to batch-generate bills for the active semester month." },
        { title: "⚖️ Tracking student conduct files?", answerTitle: "How to log student incidents", answerContent: "Navigate to Student Conduct Records, click 'Register Infraction', select student and enter action taken (e.g. Warning, Suspended)." }
      ]
    },
    teacher: {
      title: "Teacher Workspace Portal",
      subtitle: "Manage Classroom Attendance, Grades & Homework",
      kpis: [
        { label: "Today's Classes", value: "4 Periods", icon: Calendar, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Timetable schedule loaded" },
        { label: "Attendance Pending", value: "1 Class", icon: UserCheck, colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25", desc: "Mark Attendance now" },
        { label: "Assignments Due", value: "14 Submissions", icon: FileText, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Class 10 English essays" },
        { label: "Upcoming Exams", value: "3 Days left", icon: Award, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Midterm grading active" }
      ],
      features: ["My Classes", "Attendance Marking", "Homework Management", "Assignments Entry", "Marks Sheet", "Parent Communication", "Teacher Leave Requests"],
      quickActions: [
        { label: "Mark Attendance", desc: "Take attendance for 10-A", icon: UserCheck },
        { label: "Create Assignment", desc: "Upload assignment details", icon: Plus }
      ],
      placeholderText: "Classroom Manager active. Tap a class below to enter grades or homework.",
      supportGuides: [
        { title: "📝 Marking daily attendance?", answerTitle: "Attendance Roster Management", answerContent: "Go to 'Attendance Marking', select Class Section, check off students who are absent, and hit 'Save Attendance'." },
        { title: "📚 Creating homework assignments?", answerTitle: "Homework & Assignments Creation", answerContent: "Go to 'Homework Management' or click 'Create Assignment', set due date, select subject, and upload materials instructions." },
        { title: "🏆 Posting midterm exam grades?", answerTitle: "Grade Book Entry", answerContent: "Navigate to Marks Sheet, select student name, type subject details and marks percentage, and click 'Post Grades Record'." },
        { title: "💬 Initiating parent-teacher chat?", answerTitle: "Parent Communication Hub", answerContent: "Go to 'Parent Communication', select student and compose message. Parents are notified instantly on their portal dashboards." }
      ]
    },
    student: {
      title: "Student Portal Dashboard",
      subtitle: "Access Lectures, Assignments & Results",
      kpis: [
        { label: "My Attendance", value: studentAttendanceVal, icon: UserCheck, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Excellent attendance record" },
        { label: "Cumulative GPA", value: "3.84 / 4.0", icon: Award, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", desc: "Class Rank: #3" },
        { label: "Assignments Due", value: pendingCount === 0 ? "All Clear!" : `${pendingCount} Pending`, icon: FileText, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Physics and Chemistry tasks" },
        { label: "Upcoming Exams", value: "Physics - June 12", icon: Calendar, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Syllabus updated" }
      ],
      features: ["Attendance Ledger", "Assignments", "Exams Results", "Timetable", "Study Material", "Recorded Lectures", "Fee Status", "Notifications"],
      quickActions: [
        { label: "View Assignments", desc: "Download homework instructions", icon: FileText },
        { label: "Recorded Lectures", desc: "Play previous class video streams", icon: BookOpen }
      ],
      placeholderText: "Welcome back to your workspace! View classes, lectures, and upload homework.",
      supportGuides: [
        { title: "📂 Uploading pending assignments?", answerTitle: "Assignment Submission", answerContent: "Go to 'Assignments', click 'Submit Assignment' under active task, browse your file and click upload to class record." },
        { title: "🎥 Streaming recorded lectures?", answerTitle: "Playback Classroom Streams", answerContent: "Go to 'Recorded Lectures' and click play on any subject topic to review the digital whiteboard recordings." },
        { title: "📅 Viewing exam timetables?", answerTitle: "Exams Timetable Directory", answerContent: "Open 'Timetable' or 'Exams Results' to download midterm schedules and test dates." },
        { title: "📊 Understanding GPA scores?", answerTitle: "GPA and Class Rank Analysis", answerContent: "Your dashboard telemetry displays cumulative GPA, calculated from class exams, homework grades, and session attendance." }
      ]
    },
    parent: {
      title: "Parent Portal Center",
      subtitle: "Monitor Child Academics, Transport & Invoices",
      kpis: [
        { label: "Child Attendance", value: parentAttendanceVal, icon: UserCheck, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Kamran Shah (Class 10-A)" },
        { label: "Fee Challan Status", value: "Unpaid - Overdue", icon: CreditCard, colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25", desc: formatCurrency(8500) + " due" },
        { label: "Next Exam", value: "June 12", icon: Calendar, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Physics prep active" },
        { label: "Homework Due", value: pendingCount === 0 ? "All Completed" : `${pendingCount} Tasks pending`, icon: FileText, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "View assignments" }
      ],
      features: ["Child Attendance", "Assignments", "Exam Grades", "Fee Payments", "Notifications Log", "Teacher Communication", "Leave Requests", "Transport GPS Tracking"],
      quickActions: [
        { label: "Pay Fees Online", desc: "Instantly clear fee challan", icon: CreditCard },
        { label: "Contact Class Teacher", desc: "Send message to teacher", icon: MessageSquare }
      ],
      placeholderText: "Parent Dashboard. Select child from top dropdown to sync records.",
      supportGuides: [
        { title: "💳 Paying monthly tuition online?", answerTitle: "Tuition Fee Payments", answerContent: "Navigate to 'Fee Status' or 'Pay Fees Online' action, input debit/credit credentials to instantly clear overdue invoices." },
        { title: "🚌 Tracking school bus GPS locations?", answerTitle: "Transport Fleet Telemetry", answerContent: "Go to 'Transport GPS Tracking' to see live maps showing bus routes, driving status, and ETA of school buses." },
        { title: "✉️ Submitting child leave applications?", answerTitle: "Child Sick/Casual Leave Applications", answerContent: "Go to 'Leave Requests', fill in departure dates and reason, and click submit for class principal vetting." },
        { title: "📈 Reviewing exam progress report?", answerTitle: "Academic Performance Cards", answerContent: "Go to 'Exam Grades' or click 'Print Student Progress Card Report' to download the latest certified academic transcripts." }
      ]
    },
    org_owner: {
      title: "Organization Owner Control Console",
      subtitle: "Multi-School & Multi-Country Consolidated View",
      kpis: [
        { label: "Total Schools", value: "4 Networks", icon: Building2, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Consolidated group overview" },
        { label: "Active Branches", value: "12 Regional", icon: Compass, colorClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25", desc: "City level locations" },
        { label: "Total Campuses", value: "34 Locations", icon: Layers, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Active class structures" },
        { label: "Consolidated Revenue", value: formatCurrency(450000), icon: TrendingUp, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", desc: "Consolidated monthly ledger" }
      ],
      features: ["Organization Overview", "School Performance Matrix", "Branch Performance Ledger", "Campus Performance Analytics", "Group Revenue Reports", "Expansion Planning Wizard", "Branding Customizer Engine", "Organization Core Users", "AI Command Center", "Payment Gateway Settings"],
      quickActions: [
        { label: "Compare Campuses", desc: "Load attendance & revenue graphs", icon: Activity },
        { label: "Manage Sub-Admins", desc: "Authorize branch managers", icon: Users }
      ],
      placeholderText: "Consolidated Organization ledger. Manage multiple franchises under one brand.",
      supportGuides: [
        { title: "📊 How to audit branch networks?", answerTitle: "Consolidated Branch Performance Audit", answerContent: "Open School Performance Matrix. You can compare pupil count, net profit margins, and teacher counts across all networks." },
        { title: "🏢 Expanding with new campus branch?", answerTitle: "Launch Regional Franchises", answerContent: "Navigate to Expansion Planning Wizard, register new location coords, and select franchisor license model." },
        { title: "🎨 Overriding white-label themes?", answerTitle: "White-Label Brand Customizer", answerContent: "Go to Branding Customizer Engine to apply custom colors, custom logo, and login screen image presets." },
        { title: "💵 Consolidated revenue analysis?", answerTitle: "Double-Entry Balance Audit", answerContent: "Go to Group Revenue Reports to view monthly cash flow, payroll support expenses, and revenue split ratios." }
      ]
    },
    school_owner: {
      title: "School Owner Executive Portal",
      subtitle: "Manage School Network Performance & Profitability",
      kpis: [
        { label: "Total Students", value: "1,240 Enrolled", icon: Users, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Unified student ledger" },
        { label: "Active Teachers", value: "84 Staff", icon: GraduationCap, colorClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25", desc: "Payroll coordination active" },
        { label: "Monthly Revenue", value: formatCurrency(185000), icon: CreditCard, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Collected fee challans" },
        { label: "Net Profit Margin", value: "32.4%", icon: TrendingUp, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", desc: "Net operational margin" }
      ],
      features: ["School Overview Analytics", "Revenue Tracker Details", "Expense Audit Logs", "Profitability Statements", "Staff Lifecycle Directory", "Student Growth Reports", "Academic Grade Summaries", "Subscription Preferences", "School Logo & Branding Customizer", "AI Command Center", "Payment Gateway Settings"],
      quickActions: [
        { label: "View Profit Reports", desc: "Launch audit sheets", icon: FileText },
        { label: "Branding Overrides", desc: "Configure theme colors & logos", icon: Settings }
      ],
      placeholderText: "Executive Network Summary. Double-entry operational ledger overview.",
      supportGuides: [
        { title: "📈 Verifying net profit margins?", answerTitle: "Net Margin & Profitability Reports", answerContent: "Open Profitability Statements to audit incoming tuition fees and offset utility, payroll, and lease expenditures." },
        { title: "📝 Modifying employee payroll?", answerTitle: "Faculty Payroll Management", answerContent: "Go to Staff Lifecycle Directory, select active employee profile, and configure base compensation package." },
        { title: "🎨 Setting school logo & fonts?", answerTitle: "Branding Customizer", answerContent: "Use the Branding Customizer to upload school logo image and set theme color overrides." },
        { title: "📋 Upgrading ERP subscription plan?", answerTitle: "Enterprise Subscription Preference", answerContent: "Go to Subscription Preferences, view currently active plan tier, and upgrade/downgrade dynamically." }
      ]
    },
    vice_principal: {
      title: "Vice Principal Oversight Hub",
      subtitle: "Academic Monitoring, Timetables & Discipline Tracking",
      kpis: [
        { label: "Academic Sync Status", value: "94.2%", icon: Award, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Class syllabus tracking" },
        { label: "Teacher Progress Logs", value: "100% Synced", icon: GraduationCap, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Period completion tracking" },
        { label: "Active Discipline Files", value: "2 Cases", icon: AlertTriangle, colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25", desc: "Needs evaluation" },
        { label: "Timetable Status", value: "Conflict-Free", icon: Calendar, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", desc: "AI optimization verified" }
      ],
      features: ["Academic Monitoring", "Teacher Performance", "Attendance Monitoring", "Timetable Oversight", "Discipline Management", "Parent Concerns", "AI Command Center"],
      quickActions: [
        { label: "Audit Syllabus Progress", desc: "Verify course completion index", icon: FileText },
        { label: "Timetable Optimizer", desc: "Resolve class schedule conflicts", icon: Calendar }
      ],
      placeholderText: "Vice Principal oversight console. Monitor classrooms and syllabus indexes.",
      supportGuides: [
        { title: "📅 Optimizing class timetables?", answerTitle: "Timetable Conflict Resolution", answerContent: "Navigate to Timetable Oversight, run Timetable Optimizer wizard to resolve period schedules and room allocation conflicts." },
        { title: "📚 Tracking syllabus completion?", answerTitle: "Syllabus Progress Verification", answerContent: "Open Academic Monitoring, view progress indexes, and confirm completed chapters per course." },
        { title: "⚖️ Review student suspension files?", answerTitle: "Student Disciplinary Vetting", answerContent: "Go to Discipline Management, select active files, review principal warnings, and update infraction statuses." },
        { title: "💬 Coordinating parent concerns?", answerTitle: "Parent Feedback Integration", answerContent: "Open Parent Concerns and direct pending feedback inquiries to relevant classroom teachers." }
      ]
    },
    admissions: {
      title: "Admissions & Marketing Funnel",
      subtitle: "Lead Management, Inquiries & Enrollment Tracking",
      kpis: [
        { label: "Active Inquiries", value: "142 Leads", icon: PhoneCall, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "This week marketing" },
        { label: "Applications Vetting", value: "28 Files", icon: FileText, colorClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25", desc: "Pending assessment" },
        { label: "Interviews Scheduled", value: "12 Today", icon: Calendar, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Panel testing active" },
        { label: "Enrolled this Session", value: "84 Pupils", icon: UserPlus, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", desc: "Seeded into campuses" }
      ],
      features: ["Lead Management", "Inquiry Tracking", "Admission Applications", "Interview Scheduling", "Test Scheduling", "Follow-ups", "Enrollment Tracking"],
      quickActions: [
        { label: "Add Inquiry Lead", desc: "Record prospective student lead", icon: PhoneCall },
        { label: "Schedule Vetting Test", desc: "Reserve panel seat for test", icon: Calendar }
      ],
      placeholderText: "Education CRM pipeline active. Follow up with prospective parent inquiries.",
      supportGuides: [
        { title: "📞 Logging visitor inquiry phone call?", answerTitle: "Prospective inquiry registry", answerContent: "Click quick action 'Add Inquiry Lead' or go to Inquiry Tracking, enter parent and child details, and set interest status." },
        { title: "📅 Scheduling admission entry tests?", answerTitle: "Admission Test Bookings", answerContent: "Go to Test Scheduling, select open test date registry, and reserve seat for prospective candidate." },
        { title: "📊 Exporting marketing funnel CSV?", answerTitle: "CRM Funnel Leads Analysis", answerContent: "Go to Lead Management, click 'Export Leads Funnel analytics Statement' to generate the conversions report." },
        { title: "✅ Completing candidate enrollment?", answerTitle: "Enrolling CRM Leads", answerContent: "Verify vetting test results in Enrollment Tracking and click 'Provision Student Card' to seed profile to principal portal." }
      ]
    },
    reception: {
      title: "Reception & Visitor Registry",
      subtitle: "Visitor Management, Inquiry handling & Call Logs",
      kpis: [
        { label: "Visitors Logged Today", value: "18 Entries", icon: UserCheck, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "RFID check-ins" },
        { label: "Appointments Today", value: `${appointments.length} Schedules`, icon: Calendar, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Sync with Principal office" },
        { label: "Pending Inquiries", value: "3 Tasks", icon: PhoneCall, colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25", desc: "Need follow-up call" },
        { label: "Gate Logs Status", value: "Secured", icon: Shield, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", desc: "Synced with gate RFID" }
      ],
      features: ["Visitor Management", "Front Desk Operations", "Appointment Scheduling", "Inquiry Handling", "Call Logs", "Admission Guidance"],
      quickActions: [
        { label: "Check-in Visitor", desc: "Log visitor details & purpose", icon: Plus },
        { label: "Log Phone Call", desc: "Record phone inquiry summary", icon: PhoneCall }
      ],
      placeholderText: "Front-desk console. Print visitor passes or route calls to administrative departments.",
      supportGuides: [
        { title: "🎫 Printing temporary visitor pass?", answerTitle: "Visitor Passes Printing", answerContent: "Go to Visitor Management, click 'Check-in Visitor', enter visitor credentials, and click Print Temporary Pass." },
        { title: "📞 Logging visitor gate call records?", answerTitle: "Gate Registry Logs", answerContent: "Click quick action 'Log Phone Call' or go to Call Logs to register active calls to administrative departments." },
        { title: "📅 Setting principal office bookings?", answerTitle: "Office Booking Rosters", answerContent: "Go to Appointment Scheduling to view principal calendar availability and block booking slots." },
        { title: "🎒 Guidance rules for admissions?", answerTitle: "Visitor Admission Guide", answerContent: "Open Admission Guidance tab to read latest course lists, class group availability, and fee templates." }
      ]
    },
    accountant: {
      title: "Finance & Accounts Ledger",
      subtitle: "Manage Fee Collections, Defaulters & Payroll support",
      kpis: [
        { label: "Fee Collection Today", value: formatCurrency(12400), icon: CreditCard, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", desc: "Cash & online gateway checkins" },
        { label: "Defaulters Flagged", value: "14 Defaulters", icon: AlertTriangle, colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25", desc: formatCurrency(189000) + " outstanding" },
        { label: "Outstanding Invoices", value: "42 Challans", icon: Layers, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Unpaid billing invoices" },
        { label: "Expenses This Month", value: formatCurrency(45000), icon: TrendingUp, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Utility, salaries & maintenance" }
      ],
      features: ["Fee Collection", "Fee Defaulters", "Expense Tracking", "Financial Reports", "Payroll Support", "Invoicing", "Payment Gateway Settings"],
      quickActions: [
        { label: "Generate Challans", desc: "Create monthly fee invoices", icon: Plus },
        { label: "Record Cash Payment", desc: "Manual fee collection entry", icon: CreditCard }
      ],
      placeholderText: "Double-entry Accounting Ledger. Verify student fee challan logs.",
      supportGuides: [
        { title: "💵 Recording student cash fees?", answerTitle: "Direct Fee Cash Entry", answerContent: "Navigate to 'Record Cash Payment' quick action, input student registry ID, class group, and amount to update challan status." },
        { title: "⚠️ Flagging fee default records?", answerTitle: "Fee Defaulter Logs", answerContent: "Open Fee Defaulters, view unpaid invoices, and dispatch automated SMS payment alerts to parent registers." },
        { title: "📋 Auditing expenditures ledger?", answerTitle: "Operations cash-flow auditing", answerContent: "Go to Expense Tracking, input expense categories and click 'Log Expenditure' to write to ledger records." },
        { title: "📊 Exporting monthly accounts PDF?", answerTitle: "Accounts Balance Reports", answerContent: "Navigate to Financial Reports and click 'Simulate PDF Balance Statement Reports' to view monthly profit and loss sheet." }
      ]
    },
    hr: {
      title: "HR & Recruitment Portal",
      subtitle: "Manage Staff Directory, Payroll Coordination & Leaves",
      kpis: [
        { label: "Total Employees", value: "114 Active Staff", icon: Users, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Faculty & administration" },
        { label: "Leave Requests", value: "2 Pending", icon: Clock, colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25", desc: "Needs review" },
        { label: "Staff Attendance", value: "98.1% today", icon: UserCheck, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Staff Bio-sync functional" },
        { label: "Recruitment Active", value: "3 Job Openings", icon: UserPlus, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Vetting candidates" }
      ],
      features: ["Employee Records", "Recruitment", "Leave Management", "Performance Reviews", "Payroll Coordination"],
      quickActions: [
        { label: "Add Employee", desc: "Onboard new teacher or staff", icon: UserPlus },
        { label: "Approve Leaves", desc: "Review teacher leave requests", icon: CheckCircle }
      ],
      placeholderText: "HR Portal active. Monitor teacher logs and recruitment candidates.",
      supportGuides: [
        { title: "👤 Registering new employee logs?", answerTitle: "Staff Profile Setup", answerContent: "Click quick action 'Add Employee', input name, subject specialty, and salary level to provision login credentials." },
        { title: "📅 Reviewing vacation leaf records?", answerTitle: "Vacation leaves processing", answerContent: "Go to 'Approve Leaves' or Leave Management to view pending faculty leaf request forms and toggle approval." },
        { title: "📈 Employee performance auditing?", answerTitle: "Faculty Performance Vetting", answerContent: "Open Performance Reviews, input supervisor notes, and set annual score index metrics." },
        { title: "💵 Checking monthly wage payrolls?", answerTitle: "Staff Payroll Processing", answerContent: "Go to Payroll Coordination to verify active staff attendance logs and compile payroll disbursements." }
      ]
    },
    librarian: {
      title: "Library Management System",
      subtitle: "Manage Book Cataloging, Circulation & Fine Collections",
      kpis: [
        { label: "Total Books", value: "4,820 Volumes", icon: BookOpen, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Cataloged records active" },
        { label: "Issued Books", value: "142 Books", icon: Clock, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Active circulation" },
        { label: "Overdue Books", value: "8 Checked", icon: AlertTriangle, colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25", desc: "Fines accumulating" },
        { label: "Fines Collected", value: formatCurrency(420), icon: CreditCard, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", desc: "This semester fines" }
      ],
      features: ["Book Management", "Issue Books", "Return Books", "Fine Collection", "Inventory Tracking"],
      quickActions: [
        { label: "Issue Book", desc: "Record student book checkout", icon: Plus },
        { label: "Catalog Book", desc: "Add new volume to directory", icon: BookOpen }
      ],
      placeholderText: "Library circulation manager active. Scan student candidate card to checkout.",
      supportGuides: [
        { title: "📖 Issuing book to student?", answerTitle: "Book Checkout Registry", answerContent: "Click quick action 'Issue Book' or go to Issue Books, type book serial volume ID and student ID to write record." },
        { title: "📚 Cataloging a new volume book?", answerTitle: "Add Library Volume Catalog", answerContent: "Click quick action 'Catalog Book', select book category, author, and shelf ID." },
        { title: "⚠️ Resolving book fine collections?", answerTitle: "Overdue Book Fines", answerContent: "Go to Fine Collection, audit overdue book listings, and record student paid fine statements." },
        { title: "🔍 Auditing library inventory?", answerTitle: "Book Catalog Registry", answerContent: "Go to Inventory Tracking to review total volumes cataloged, issued status, and book damage records." }
      ]
    },
    transport: {
      title: "Transport Operations Hub",
      subtitle: "Manage Vehicles, Route Mapping & Drivers",
      kpis: [
        { label: "Active Vehicles", value: "12 Buses", icon: Map, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Vehicle maintenance normal" },
        { label: "Total Routes", value: "8 Custom Loops", icon: Compass, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "City routes optimized" },
        { label: "Assigned Students", value: "240 Pupils", icon: Users, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Assigned pick & drops" },
        { label: "GPS Server Link", value: "Online", icon: UserCheck, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", desc: "Real-time telemetry active" }
      ],
      features: ["Vehicles", "Routes", "Drivers", "Student Assignments", "GPS Tracking", "Transport Fees"],
      quickActions: [
        { label: "Assign Student Route", desc: "Assign kid to bus route", icon: UserPlus },
        { label: "Driver logs", desc: "Review daily trip records", icon: Clock }
      ],
      placeholderText: "Transport Management Center. Track live location links for parents.",
      supportGuides: [
        { title: "🚌 Registering a new bus route?", answerTitle: "Route Mapping Loops", answerContent: "Go to Routes, register new neighborhood loop coordinates, and assign active bus driver." },
        { title: "👤 Assigning students to bus?", answerTitle: "Student Bus Assignments", answerContent: "Click quick action 'Assign Student Route', select student ID and active loop number to set route profile." },
        { title: "🛡️ Tracking live GPS telemetry?", answerTitle: "Fleet Telemetry Feeds", answerContent: "Go to GPS Tracking, click 'Sync Telemetry' to connect fleet GPS receivers with active dashboard maps." },
        { title: "🛠️ Setting maintenance logs?", answerTitle: "Vehicle Maintenance Schedules", answerContent: "Go to Vehicles, view bus operational status, and schedule monthly mechanical checkups." }
      ]
    },
    hostel: {
      title: "Hostel Operations Console",
      subtitle: "Manage Room Allocations, Mess Schedules & Hostel Fees",
      kpis: [
        { label: "Total Rooms", value: "60 Dorms", icon: Home, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Boys & girls blocks" },
        { label: "Occupied Beds", value: "112 Beds", icon: Users, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Total boarders" },
        { label: "Available Beds", value: "8 Vacant", icon: Layers, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", desc: "Ready for allocation" },
        { label: "Pending Hostel Fees", value: formatCurrency(34000), icon: AlertTriangle, colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25", desc: "Hostel bill invoices" }
      ],
      features: ["Room Allocation", "Bed Allocation", "Hostel Fees", "Mess Management", "Hostel Reports"],
      quickActions: [
        { label: "Allocate Dorm Room", desc: "Onboard boarding student", icon: Plus },
        { label: "Mess Schedule", desc: "Update daily food menu", icon: Calendar }
      ],
      placeholderText: "Hostel Boarding registry active. Check dorm occupancy statistics.",
      supportGuides: [
        { title: "🏢 Assigning boarding rooms?", answerTitle: "Dorm Rooms Allocation", answerContent: "Click quick action 'Allocate Dorm Room' or go to Room Allocation, select bed registry ID, and register student." },
        { title: "🍱 Mess schedule configuration?", answerTitle: "Hostel Mess Calendars", answerContent: "Click quick action 'Mess Schedule', select Mess Schedule to configure mess meals." },
        { title: "💵 Auditing unpaid hostel bills?", answerTitle: "Hostel Fees Statements", answerContent: "Go to Hostel Fees, view unpaid invoices, and print mess expense statements." },
        { title: "📋 Daily night checkin rosters?", answerTitle: "Night Attendance Logs", answerContent: "Go to Hostel Reports to record student evening checkin records and register departures." }
      ]
    }
  };

  const spec = portalSpecs[simulatedRole] || portalSpecs['admin'];

  // Filter features based on search
  const filteredFeatures = spec.features.filter(f => 
    f.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden">
      {/* Floating dynamic backdrop orbs */}
      <div className="bg-glow-circle-1" />
      <div className="bg-glow-circle-2" />
      <div className="bg-glow-circle-3" />
      
      {/* Header Banner */}
      <header className="border-b border-border bg-card/40 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left Side: Title & Info */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center border border-primary/45 shadow-inner relative overflow-hidden group shrink-0">
                <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xs sm:text-sm lg:text-base font-extrabold tracking-wide text-foreground m-0 uppercase leading-none whitespace-nowrap">
                    {spec.title}
                  </h1>
                  <span className="px-2 py-0.5 rounded bg-primary/20 border border-primary/30 text-[8px] font-black text-primary uppercase tracking-wider shrink-0 whitespace-nowrap">
                    {simulatedRole.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-[9px] text-foreground/60 block leading-none">
                  Logged in as: <strong className="text-foreground">{currentUser?.name || 'Administrator'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Actions (Dropdown & Buttons) */}
          <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto border-t border-border/20 pt-2.5 md:pt-0 md:border-t-0">
            {currentUser?.role && ['super_admin', 'admin', 'org_owner', 'school_owner'].includes(currentUser.role) && (
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all shrink-0 ${
                darkMode 
                  ? 'bg-purple-950/25 border-purple-500/20' 
                  : 'bg-purple-50/50 border-purple-200/60'
              }`}>
                <span className={`text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  darkMode ? 'text-purple-300' : 'text-purple-700'
                }`}>Portal:</span>
                <select
                  value={simulatedRole}
                  onChange={(e) => setSimulatedRole(e.target.value as UserRole)}
                  className={`text-[10px] rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold transition-all shrink-0 ${
                    darkMode 
                      ? 'bg-slate-950 border-slate-800 text-white' 
                      : 'bg-white border-purple-200 text-purple-900'
                  }`}
                >
                  <option value="admin">Principal / School Admin</option>
                  <option value="teacher">Teacher Portal</option>
                  <option value="student">Student Portal</option>
                  <option value="parent">Parent Portal</option>
                  <option value="org_owner">Organization Owner</option>
                  <option value="school_owner">School Network Owner</option>
                  <option value="vice_principal">Vice Principal</option>
                  <option value="admissions">Admission and CRM</option>
                  <option value="reception">Reception and Visitor Desk</option>
                  <option value="accountant">Accounts & Fees Department</option>
                  <option value="hr">HR Department</option>
                  <option value="librarian">Librarian Desk</option>
                  <option value="transport">Transport Manager</option>
                  <option value="hostel">Hotel Warden</option>
                  <option value="super_admin">Super Admin Master Control</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-1.5 justify-end">
              {currentUser?.role === 'super_admin' && (
                <button 
                  onClick={() => navigate('/super-admin')}
                  className="inline-flex items-center justify-center gap-1 bg-purple-700 hover:bg-purple-800 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-sm whitespace-nowrap shrink-0"
                  title="Control Panel"
                >
                  <span>← <span className="hidden sm:inline">Control Panel</span></span>
                </button>
              )}
              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-border text-[10px] text-foreground/80 hover:text-foreground hover:border-foreground/30 transition-all font-semibold shadow-sm whitespace-nowrap shrink-0"
                title="Toggle Light/Dark Mode"
              >
                {darkMode ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="hidden md:inline whitespace-nowrap">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span className="hidden md:inline whitespace-nowrap">Dark</span>
                  </>
                )}
              </button>
              <button 
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-1 bg-card border border-border hover:bg-muted hover:text-foreground px-2.5 py-1.5 rounded-lg text-[10px] transition-all whitespace-nowrap shrink-0 font-semibold"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Sign Out</span>
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="flex-1 max-w-full w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        {/* Role-Specific Live Status Banners */}
        {(() => {
          const unpaidFees = invoices.filter(i => (isEditor ? true : i.student === 'Kamran Shah') && i.status === 'Unpaid');
          const hasUnpaidFees = unpaidFees.length > 0;
          
          if (simulatedRole === 'student') {
            const overdueAssignmentsCount = assignments.filter(a => a.publishDate <= '2026-06-08' && !completedAssignments.includes(a.id)).length;
            const isAllCompleted = overdueAssignmentsCount === 0 && kamranStatus === 'Present';
            
            if (isAllCompleted) {
              return (
                <div className={`p-4 rounded-xl flex items-center justify-center gap-2.5 text-xs shadow border transition-all animate-fadeIn ${
                  darkMode 
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <span className="text-sm">🎉</span>
                  <span className="text-center font-medium">
                    <strong className={`font-extrabold px-2 py-0.5 rounded mr-1 transition-all ${
                      darkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100/80 text-emerald-950'
                    }`}>Excellent Status:</strong> You are all caught up! Attendance is recorded, and all published assignments have been successfully submitted. Keep up the brilliant work!
                  </span>
                </div>
              );
            } else {
              return (
                <div className="flex flex-col gap-3">
                  {kamranStatus === 'Absent' && (
                    <div className={`p-4 rounded-xl flex items-center justify-center gap-2.5 text-xs shadow border transition-all animate-pulse ${
                      darkMode 
                        ? 'bg-red-500/10 border-red-500/25 text-red-300' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <span className="text-sm">⚠️</span>
                      <span className="text-center font-medium">
                        <strong className={`font-extrabold px-2 py-0.5 rounded mr-1 transition-all ${
                          darkMode ? 'bg-red-500/20 text-red-200' : 'bg-red-100/80 text-red-950'
                        }`}>Attendance Notification:</strong> You have been marked <strong className={`font-bold ${darkMode ? 'text-red-200' : 'text-red-950'}`}>Absent</strong> for today's roster check. Please contact the class coordinator if this is an error.
                      </span>
                    </div>
                  )}
                  {overdueAssignmentsCount > 0 && (
                    <div className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs shadow border transition-all animate-shake ${
                      darkMode 
                        ? 'bg-red-500/10 border-red-500/25 text-red-300' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <div className="flex items-center gap-2 justify-center flex-1">
                        <span className="text-sm">⏰</span>
                        <span className="text-center font-medium">
                          <strong className={`font-extrabold px-2 py-0.5 rounded mr-1 transition-all ${
                            darkMode ? 'bg-red-500/20 text-red-200' : 'bg-red-100/80 text-red-950'
                          }`}>Pending Assignments:</strong> You have <strong className={`font-bold ${darkMode ? 'text-red-200' : 'text-red-950'}`}>{overdueAssignmentsCount} coursework tasks</strong> awaiting submission. Please complete and upload them.
                        </span>
                      </div>
                      <button onClick={() => setActiveFeature('Assignments')} className="px-3.5 py-1 bg-red-650 hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow text-[10px] whitespace-nowrap">Solve Now</button>
                    </div>
                  )}
                </div>
              );
            }
          }

          if (simulatedRole === 'parent') {
            const pendingTasksCount = assignments.filter(a => a.publishDate <= '2026-06-08' && !completedAssignments.includes(a.id)).length;
            const teacherMessages = parentMessages.filter(m => m.parent.startsWith('Broadcast') || m.parent.startsWith('Teacher'));
            const hasTeacherMessages = teacherMessages.length > 0;
            const isAllClear = !hasUnpaidFees && pendingTasksCount === 0 && kamranStatus === 'Present' && !hasTeacherMessages;

            if (isAllClear) {
              return (
                <div className={`p-4 rounded-xl flex items-center justify-center gap-2.5 text-xs shadow border transition-all animate-fadeIn ${
                  darkMode 
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <span className="text-sm">🌟</span>
                  <span className="text-center font-medium">
                    <strong className={`font-extrabold px-2 py-0.5 rounded mr-1 transition-all ${
                      darkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100/80 text-emerald-950'
                    }`}>All Tasks Complete:</strong> Your child Kamran Shah's profile is fully updated. Tuition fees are completely cleared and there are no pending assignments. Excellent!
                  </span>
                </div>
              );
            } else {
              return (
                <div className="flex flex-col gap-3">
                  {hasTeacherMessages && (
                    <div className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs shadow border transition-all ${
                      darkMode 
                        ? 'bg-purple-500/15 border-purple-500/30 text-purple-300' 
                        : 'bg-purple-50 border-purple-200 text-purple-800'
                    }`}>
                      <div className="flex items-center gap-2 justify-center flex-1">
                        <span className="text-sm">💬</span>
                        <span className="text-center font-medium">
                          <strong className={`font-extrabold px-2 py-0.5 rounded mr-1 transition-all ${
                            darkMode ? 'bg-purple-500/20 text-purple-200' : 'bg-purple-100/80 text-purple-950'
                          }`}>New Message from Tutors:</strong> "{teacherMessages[0].subject}" &bull; {teacherMessages[0].message.substring(0, 60)}...
                        </span>
                      </div>
                      <button onClick={() => setActiveFeature('Teacher Communication')} className="px-3.5 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold transition-all shadow text-[10px] whitespace-nowrap">Open / View Message</button>
                    </div>
                  )}
                  {kamranStatus === 'Absent' && (
                    <div className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs shadow border transition-all animate-bounce ${
                      darkMode 
                        ? 'bg-red-500/10 border-red-500/25 text-red-300' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <div className="flex items-center gap-2 justify-center flex-1">
                        <span className="text-sm">⚠️</span>
                        <span className="text-center font-medium">
                          <strong className={`font-extrabold px-2 py-0.5 rounded mr-1 transition-all ${
                            darkMode ? 'bg-red-500/20 text-red-200' : 'bg-red-100/80 text-red-950'
                          }`}>Attendance Alert:</strong> Your child Kamran Shah has been marked <strong className={`font-bold ${darkMode ? 'text-red-200' : 'text-red-950'}`}>Absent</strong> for today's session.
                        </span>
                      </div>
                      <button onClick={() => alert("Leave verification request logged. The school coordinator will check.")} className="px-3.5 py-1 bg-red-650 hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow text-[10px] whitespace-nowrap">Verify Leave</button>
                    </div>
                  )}
                  {hasUnpaidFees && (
                    <div className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs shadow border transition-all ${
                      darkMode 
                        ? 'bg-red-500/10 border-red-500/25 text-red-300' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <div className="flex items-center gap-2 justify-center flex-1">
                        <span className="text-sm">💳</span>
                        <span className="text-center font-medium">
                          <strong className={`font-extrabold px-2 py-0.5 rounded mr-1 transition-all ${
                            darkMode ? 'bg-red-500/20 text-red-200' : 'bg-red-100/80 text-red-950'
                          }`}>Outstanding Invoices:</strong> You have an unpaid tuition invoice of <strong className={`font-bold ${darkMode ? 'text-red-200' : 'text-red-950'}`}>{formatCurrency(unpaidFees[0].amount)}</strong> overdue. Please process payment.
                        </span>
                      </div>
                      <button onClick={() => setActiveFeature('Fee Payments')} className="px-3.5 py-1 bg-red-650 hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow text-[10px] whitespace-nowrap">Pay Fees</button>
                    </div>
                  )}
                  {pendingTasksCount > 0 && (
                    <div className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs shadow border transition-all ${
                      darkMode 
                        ? 'bg-red-500/10 border-red-500/25 text-red-300' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <div className="flex items-center gap-2 justify-center flex-1">
                        <span className="text-sm">📝</span>
                        <span className="text-center font-medium">
                          <strong className={`font-extrabold px-2 py-0.5 rounded mr-1 transition-all ${
                            darkMode ? 'bg-red-500/20 text-red-200' : 'bg-red-100/80 text-red-950'
                          }`}>Pending Homework:</strong> There are <strong className={`font-bold ${darkMode ? 'text-red-200' : 'text-red-950'}`}>{pendingTasksCount} assignments</strong> due for Kamran. Assure submissions are finished soon.
                        </span>
                      </div>
                      <button onClick={() => setActiveFeature('Homework Board')} className="px-3.5 py-1 bg-red-650 hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow text-[10px] whitespace-nowrap">Review Homework</button>
                    </div>
                  )}
                </div>
              );
            }
          }

          // Admins & Teachers status view
          return (
            <div className={`p-4 rounded-xl flex items-center justify-center gap-2.5 text-xs shadow border transition-all ${
              darkMode 
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <span className="text-sm">🛡️</span>
              <span className="text-center font-medium">
                <strong className={`font-extrabold px-2 py-0.5 rounded mr-1 transition-all ${
                  darkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100/80 text-emerald-950'
                }`}>Operational Status:</strong> School operations and class modules running normally. Dynamic isolation database active.
              </span>
            </div>
          );
        })()}
        
        {/* Dynamic KPIs Block */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {spec.kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div 
                key={index} 
                onClick={() => handleKpiClick(kpi.label)}
                className={`glass-card ${
                  kpi.colorClass.includes('purple') ? 'accent-purple' :
                  kpi.colorClass.includes('indigo') ? 'accent-indigo' :
                  kpi.colorClass.includes('blue') ? 'accent-blue' :
                  kpi.colorClass.includes('emerald') || kpi.colorClass.includes('green') ? 'accent-emerald' :
                  kpi.colorClass.includes('amber') || kpi.colorClass.includes('yellow') ? 'accent-amber' :
                  kpi.colorClass.includes('rose') || kpi.colorClass.includes('red') ? 'accent-rose' :
                  kpi.colorClass.includes('cyan') ? 'accent-cyan' : ''
                } p-6 rounded-xl relative overflow-hidden flex flex-col justify-between h-32 border border-border bg-card/45 shadow-sm cursor-pointer hover:border-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-foreground/75 font-semibold text-xs uppercase tracking-wider">{kpi.label}</span>
                  <div className={`p-2 rounded-lg border ${kpi.colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">{kpi.value}</h3>
                  <p className="text-[10px] text-foreground/60 mt-1">{kpi.desc}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Features Navigation Section (Full Width) */}
        <section className="glass-card rounded-2xl overflow-hidden border border-border bg-card/30 flex flex-col w-full">
          <div className="px-6 py-4 border-b border-border bg-muted/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-bold text-foreground m-0 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Active Portal Modules
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-foreground/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1 bg-card border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>
              <span className="text-xs text-foreground/70 font-semibold px-2.5 py-1 rounded-full bg-card border border-border shrink-0">
                {filteredFeatures.length} active
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap justify-center gap-4">
              {filteredFeatures.map((feature, i) => {
                const details = getFeatureDetails(feature);
                const FeatureIcon = details.icon;
                return (
                  <div 
                    key={i}
                    onClick={() => setActiveFeature(feature)}
                    className="p-5 bg-card/70 hover:bg-muted/65 rounded-2xl border border-border flex flex-col items-center justify-between gap-4 group cursor-pointer transition-all hover:scale-[1.015] active:scale-[0.985] hover:border-primary/45 duration-300 w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] hover:shadow-md hover:shadow-primary/5 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 transition-transform duration-300 group-hover:scale-110 mb-1">
                        <FeatureIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-sm font-black text-foreground block group-hover:text-primary transition-colors">{feature}</span>
                        <p className="text-[11px] text-foreground/50 leading-relaxed font-semibold mt-1.5 line-clamp-2">{details.desc}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2.5 pt-3 border-t border-border/40 mt-1 w-full">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 border border-primary/20 px-2.5 py-0.5 rounded-md">
                        {details.stats}
                      </span>
                      <button className="w-full py-2 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-lg transition-all font-bold text-xs flex items-center justify-center gap-1 shadow-sm">
                        Manage {feature} <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Middle Section: Quick Operations & Live System Telemetry */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch w-full">
          {/* Card 1: Quick Operations (Left side, col-span-2) */}
          <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-border bg-card/30 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-foreground m-0 flex items-center gap-2 pb-3 border-b border-border">
                <Settings className="w-5 h-5 text-primary" />
                Quick Operations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {spec.quickActions.map((action, idx) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        let section = 'general';
                        if (action.label === 'Create Assignment') section = 'assignments';
                        else if (action.label === 'Publish Notice') section = 'notices';
                        else if (action.label === 'Generate Challans' || action.label === 'Record Cash Payment') section = 'finance';
                        else if (action.label === 'Add Employee' || action.label === 'Approve Leaves') section = 'hr';
                        else if (action.label === 'Issue Book' || action.label === 'Catalog Book') section = 'library';
                        else if (action.label === 'Assign Student Route' || action.label === 'Driver logs') section = 'transport';
                        else if (action.label === 'Allocate Dorm Room' || action.label === 'Mess Schedule') section = 'hostel';
                        else if (action.label === 'Add Inquiry Lead') section = 'admissions';

                        const readOnlyActions = ['View Assignments', 'Contact Class Teacher', 'Recorded Lectures'];
                        if (!readOnlyActions.includes(action.label) && !canUserEditSection(section)) {
                          alert(`Access Denied! Your logged in role (${currentUser?.role}) does not have editing rights for the "${section}" module.`);
                          return;
                        }

                        const executeAction = () => {
                          if (action.label === 'Enroll Student') {
                            setActiveFeature('Student Management');
                          } else if (action.label === 'Publish Notice') {
                            setActiveFeature('School Notices');
                          } else if (action.label === 'Create Assignment') {
                            setAssignmentModalOpen(true);
                          } else if (action.label === 'View Assignments') {
                            setActiveFeature('Assignments');
                          } else if (action.label === 'Mark Attendance') {
                            setActiveFeature('Attendance Marking');
                          } else if (action.label === 'Pay Fees Online') {
                            setActiveFeature('Fee Payments');
                          } else if (action.label === 'Contact Class Teacher') {
                            setActiveFeature('Teacher Communication');
                          } else if (action.label === 'Recorded Lectures') {
                            setActiveFeature('Recorded Lectures');
                          } else {
                            alert(`[${currentTenant?.schoolName || 'School'}] Starting operation: ${action.label}`);
                          }
                        };

                        if (!readOnlyActions.includes(action.label)) {
                          requestSecurityVerification(`Initiate quick action: "${action.label}"`, executeAction);
                        } else {
                          executeAction();
                        }
                      }}
                      className="w-full p-8 bg-card/85 hover:bg-muted/65 border border-border hover:border-primary/45 rounded-2xl flex flex-col justify-between items-start gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] duration-300 relative min-h-48 group shadow-lg shadow-black/10"
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-xl text-primary group-hover:scale-110 transition-transform duration-300 relative">
                          <ActionIcon className="w-6 h-6" />
                          {action.label === 'View Assignments' && pendingCount > 0 && (
                            <span className="absolute -top-2.5 -right-2.5 min-w-[22px] h-5.5 px-1.5 rounded-full bg-gradient-to-r from-rose-500 to-red-650 text-[10px] font-black text-white flex items-center justify-center border-2 border-card shadow-lg animate-pulse tracking-wide">
                              {pendingCount}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] font-black text-primary/75 uppercase tracking-widest bg-primary/5 border border-primary/20 px-2.5 py-0.5 rounded-md">
                          Action
                        </span>
                      </div>
                      <div className="space-y-1.5 mt-2">
                        <strong className="text-sm font-black text-foreground block group-hover:text-primary transition-colors">{action.label}</strong>
                        <span className="text-[11px] text-foreground/50 leading-relaxed font-semibold block">{action.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="pt-2 text-[10px] text-foreground/45 border-t border-border/40 font-semibold uppercase tracking-widest text-center mt-4">
              Authorized Operations Console
            </div>
          </div>

          {/* Card 2: Live System Telemetry (Right side, col-span-1) */}
          <div className="glass-card p-6 rounded-2xl border border-border bg-card/30 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">
                  Live System Telemetry
                </span>
                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Operational
                </span>
              </div>

              <div className="bg-card/50 border border-border rounded-xl p-3.5 space-y-3 relative overflow-hidden mt-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-semibold text-foreground/60 block">API Request Latency</span>
                    <strong className="text-sm font-black text-foreground">14ms average</strong>
                  </div>
                  <span className="text-[9px] font-bold text-primary/80">99.98% uptime</span>
                </div>

                {/* SVG Area Sparkline */}
                <div className="h-16 w-full mt-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 240 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="50%" stopColor="#c084fc" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                      <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#c084fc" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 50 Q 30 35 60 42 T 120 25 T 180 38 T 240 20 L 240 60 L 0 60 Z"
                      fill="url(#telemetryGrad)"
                    />
                    <path
                      d="M 0 50 Q 30 35 60 42 T 120 25 T 180 38 T 240 20"
                      fill="none"
                      stroke="url(#lineGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="240" cy="20" r="4.5" fill="#22d3ee" className="animate-pulse shadow-glow" />
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-border/40 text-[9px] font-semibold text-foreground/60">
                  <div className="text-center bg-muted/40 p-1 rounded">
                    <span className="block text-foreground/45 text-[8px] uppercase">CPU Load</span>
                    <strong className="text-foreground text-[10px]">12%</strong>
                  </div>
                  <div className="text-center bg-muted/40 p-1 rounded">
                    <span className="block text-foreground/45 text-[8px] uppercase">DB Queue</span>
                    <strong className="text-foreground text-[10px]">0.02ms</strong>
                  </div>
                  <div className="text-center bg-muted/40 p-1 rounded">
                    <span className="block text-foreground/45 text-[8px] uppercase">Cache Hit</span>
                    <strong className="text-foreground text-[10px]">99.4%</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-2 text-[10px] text-foreground/45 border-t border-border/40 font-semibold uppercase tracking-widest text-center mt-4">
              Database Sync Active
            </div>
          </div>
        </section>

        {/* Symmetrical Parallel Footer Section */}
        <section className="glass-card p-6 rounded-2xl border border-border bg-card/20 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/40">
            <Activity className="w-4.5 h-4.5 text-primary" />
            Recent Administrative Activity & Operational Telemetry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Card 1: Operational Status Board */}
            <div className="glass-card p-5 rounded-2xl border border-border bg-card/30 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest pb-2 border-b border-border/40 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-primary" />
                  Operational Status
                </h4>
                <p className="text-xs text-foreground/75 leading-relaxed font-semibold mt-3">
                  {spec.placeholderText} Secured and isolated. Regional parameters: <strong>{currentTenant?.city || 'Lahore'}, {COUNTRY_CONFIGS[currentTenant?.country || 'PK'].countryName}</strong> (Currency: <strong>{COUNTRY_CONFIGS[currentTenant?.country || 'PK'].currency}</strong>, prefix: <strong>{COUNTRY_CONFIGS[currentTenant?.country || 'PK'].phonePrefix}</strong>).
                </p>

                {/* Diagnostics Grid to fill empty space */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-bold text-foreground/70">
                  <div className="flex items-center gap-1.5 p-2 bg-card border border-border rounded-lg">
                    <span className="text-emerald-400">✓</span>
                    <span>RLS Isolation Active</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-card border border-border rounded-lg">
                    <span className="text-emerald-400">✓</span>
                    <span>AES-256 DB Crypt</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-card border border-border rounded-lg">
                    <span className="text-emerald-400">✓</span>
                    <span>SSL Certificate Valid</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-card border border-border rounded-lg">
                    <span className="text-emerald-400">✓</span>
                    <span>Auto-Backup Enabled</span>
                  </div>
                </div>
              </div>
              <div className="pt-2.5 text-[10px] text-primary/80 border-t border-border/40 font-bold uppercase tracking-wider text-center mt-4 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> System Active
              </div>
            </div>

            {/* Card 2: Knowledge Base & Support */}
            <div className="glass-card p-5 rounded-2xl border border-border bg-card/30 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest pb-2 border-b border-border/40 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  Knowledge Base & Support
                </h4>
                <p className="text-xs text-foreground/65 leading-relaxed mt-3 font-semibold">
                  Need help with operations? Click the quick guides below to view step-by-step instructions.
                </p>
                <div className="space-y-2 mt-3">
                  {(spec.supportGuides || []).slice(0, 2).map((guide, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveGuide(guide)}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-card border border-border hover:border-primary/45 hover:bg-muted text-[10px] text-foreground/80 hover:text-foreground font-bold text-left transition-all active:scale-[0.98]"
                    >
                      <span>{guide.title}</span>
                      <ChevronRight className="w-3 h-3 text-foreground/40" />
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => alert("Redirecting to the global documentation portal...")}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary hover:bg-primary/95 text-[10px] font-bold text-white transition-all shadow-md active:scale-98 mt-4"
              >
                <span>Browse Guides</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Card 3: Tracker Widget */}
            <div className="glass-card p-5 rounded-2xl border border-border bg-card/30 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest pb-2 border-b border-border/40">
                  {['student', 'parent'].includes(simulatedRole) ? 'Student Study Tracker' : 'Campus Operations Tracker'}
                </h4>

                {['student', 'parent'].includes(simulatedRole) ? (
                  <div className="bg-card/50 border border-border rounded-xl p-3 space-y-2 mt-3">
                    <div className="flex justify-between items-center text-[10px] font-semibold text-foreground/75">
                      <span>Weekly Active Study Time</span>
                      <span className="text-primary font-black">12.5 Hours</span>
                    </div>
                    {/* Tiny Bar Chart */}
                    <div className="flex items-end justify-between h-16 pt-2">
                      {[
                        { day: 'M', hours: '2h', hPercent: '50%' },
                        { day: 'T', hours: '3h', hPercent: '75%' },
                        { day: 'W', hours: '1.5h', hPercent: '37.5%' },
                        { day: 'T', hours: '4h', hPercent: '100%' },
                        { day: 'F', hours: '2h', hPercent: '50%' }
                      ].map((bar, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 w-6">
                          <span className="text-[8px] font-bold text-foreground/50">{bar.hours}</span>
                          <div className="w-2.5 bg-gradient-to-t from-primary/30 to-primary rounded-t-sm" style={{ height: bar.hPercent }}></div>
                          <span className="text-[8px] text-foreground/40 font-semibold">{bar.day}</span>
                        </div>
                      ))}
                    </div>
                    {/* Stats Grid to fill empty space */}
                    <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-bold text-foreground/70">
                      <div className="flex items-center gap-1.5 p-2 bg-card border border-border rounded-lg">
                        <span className="text-primary">★</span>
                        <span>GPA: A- Average</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 bg-card border border-border rounded-lg">
                        <span className="text-primary">✓</span>
                        <span>94% Attendance</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 bg-card border border-border rounded-lg">
                        <span className="text-primary">🗂</span>
                        <span>2 Due Soon</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 bg-card border border-border rounded-lg">
                        <span className="text-primary">🏆</span>
                        <span>Top 10% Rank</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-card/50 border border-border rounded-xl p-3 space-y-2 mt-3">
                    <div className="flex justify-between items-center text-[10px] font-semibold text-foreground/75">
                      <span>Server Roster Synced Status</span>
                      <span className="text-emerald-400 font-black">99.8% Healthy</span>
                    </div>
                    {/* Tiny Bar Chart */}
                    <div className="flex items-end justify-between h-16 pt-2">
                      {[
                        { day: 'Mon', count: '1.2k', hPercent: '85%' },
                        { day: 'Tue', count: '1.3k', hPercent: '92%' },
                        { day: 'Wed', count: '1.2k', hPercent: '85%' },
                        { day: 'Thu', count: '1.4k', hPercent: '98%' },
                        { day: 'Fri', count: '1.4k', hPercent: '100%' }
                      ].map((bar, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 w-7">
                          <span className="text-[8px] font-bold text-foreground/50">{bar.count}</span>
                          <div className="w-2.5 bg-gradient-to-t from-primary/30 to-primary rounded-t-sm" style={{ height: bar.hPercent }}></div>
                          <span className="text-[8px] text-foreground/45 font-semibold">{bar.day}</span>
                        </div>
                      ))}
                    </div>
                    {/* Stats Grid to fill empty space */}
                    <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-bold text-foreground/70">
                      <div className="flex items-center gap-1.5 p-2 bg-card border border-border rounded-lg">
                        <span className="text-emerald-400">⚡</span>
                        <span>8 Sync Nodes</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 bg-card border border-border rounded-lg">
                        <span className="text-emerald-400">✓</span>
                        <span>Backup Verified</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 bg-card border border-border rounded-lg">
                        <span className="text-emerald-400">🌐</span>
                        <span>100% API Uptime</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 bg-card border border-border rounded-lg">
                        <span className="text-emerald-400">⚙</span>
                        <span>System v14.2</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-2 text-[10px] text-foreground/45 border-t border-border/40 font-semibold uppercase tracking-widest text-center mt-4">
                Telemetry Logged
              </div>
            </div>
          </div>

        </section>
      </main>

      {/* KNOWLEDGE BASE GUIDE MODAL */}
      {activeGuide && (
        <div className="modal-overlay">
          <div className="modal-container modal-md glass-card glow-purple text-foreground">
            
            {/* Modal Header */}
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <span className="text-xl">💡</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                  Portal Support Guide
                </h3>
              </div>
              <button 
                onClick={() => setActiveGuide(null)}
                className="px-2.5 py-1 text-xs font-bold rounded bg-muted border border-border hover:bg-card text-foreground transition-all active:scale-95"
              >
                Close
              </button>
            </div>

            {/* Modal Content */}
            <div className="modal-body space-y-5">
              <h4 className="text-sm font-bold text-primary">
                {activeGuide.answerTitle}
              </h4>
              <p className="text-xs text-foreground/75 leading-relaxed bg-muted/40 p-4 rounded-xl border border-border">
                {activeGuide.answerContent}
              </p>
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => setActiveGuide(null)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-primary hover:bg-primary/95 text-white shadow-md transition-all active:scale-95"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BEAUTIFUL SECURITY VERIFICATION MODAL */}
      {(securityPendingAction !== null || securityPendingActionWithData !== null) && (
        <div className="security-modal-overlay z-[100]">
          <div className="modal-container max-w-sm glass-card glow-purple border border-purple-500/30 p-6 space-y-4 text-center text-foreground">
            <div className="mx-auto w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-lg">
              🔒
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Security Verification Required</h3>
              <p className="text-[11px] text-foreground/60 leading-relaxed">
                To protect school database integrity, please authorize this operation by entering the verification password.
              </p>
            </div>
            {securityConfirmMessage && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-left text-xs space-y-1">
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">Action to Confirm:</span>
                <p className="font-extrabold text-foreground leading-snug">{securityConfirmMessage}</p>
              </div>
            )}

            {/* Dynamic Inputs based on Action Type */}
            {securityModalType === 'rename' && (
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">Edit Assignment Title</label>
                <input
                  type="text"
                  value={securityRenameValue}
                  onChange={(e) => setSecurityRenameValue(e.target.value)}
                  placeholder="Enter assignment title"
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
                />
              </div>
            )}

            {securityModalType === 'attach' && (
              <div className="space-y-3">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">File URL</label>
                  <input
                    type="text"
                    value={securityAttachUrl}
                    onChange={(e) => setSecurityAttachUrl(e.target.value)}
                    placeholder="Enter file URL (data URI or web link)"
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">File Name</label>
                  <input
                    type="text"
                    value={securityAttachName}
                    onChange={(e) => setSecurityAttachName(e.target.value)}
                    placeholder="e.g. outline.pdf"
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
                  />
                </div>
              </div>
            )}

            {securityModalType === 'submit' && (
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">Submit File Name</label>
                <input
                  type="text"
                  value={securitySubmitFile}
                  onChange={(e) => setSecuritySubmitFile(e.target.value)}
                  placeholder="e.g. my_work.pdf"
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
                />
              </div>
            )}

            <div className="space-y-2 text-left border-t border-slate-800/85 pt-3">
              <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">Verification Password</label>
              <input
                type="password"
                placeholder="Enter verification password"
                value={securityPasswordInput}
                onChange={(e) => setSecurityPasswordInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
              />
              {securityModalError && (
                <p className="text-[10px] text-red-400 font-semibold text-center mt-1">{securityModalError}</p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => {
                  setSecurityPendingAction(null);
                  setSecurityPendingActionWithData(null);
                }}
                className="flex-1 py-2 bg-muted hover:bg-muted/80 border border-border text-foreground text-xs font-bold rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (securityModalType === 'rename' && !securityRenameValue.trim()) {
                    setSecurityModalError('Please enter a valid assignment title.');
                    return;
                  }
                  if (securityModalType === 'attach' && (!securityAttachUrl.trim() || !securityAttachName.trim())) {
                    setSecurityModalError('Please fill in both file URL and name.');
                    return;
                  }
                  if (securityModalType === 'submit' && !securitySubmitFile.trim()) {
                    setSecurityModalError('Please enter a valid file name to submit.');
                    return;
                  }

                  if (securityPasswordInput === getExpectedPasskey()) {
                    if (securityPendingAction) {
                      securityPendingAction();
                    } else if (securityPendingActionWithData) {
                      if (securityModalType === 'rename') {
                        securityPendingActionWithData(securityRenameValue);
                      } else if (securityModalType === 'attach') {
                        securityPendingActionWithData({ url: securityAttachUrl, name: securityAttachName });
                      } else if (securityModalType === 'submit') {
                        securityPendingActionWithData(securitySubmitFile);
                      }
                    }
                    setSecurityPendingAction(null);
                    setSecurityPendingActionWithData(null);
                  } else {
                    setSecurityModalError('Invalid security passkey. Access Denied!');
                  }
                }}
                className="flex-1 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg transition-all shadow-md"
              >
                Verify & Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ASSIGNMENT MODAL (TEACHER/ADMIN) */}
      {assignmentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container modal-lg glass-card glow-purple text-foreground">
            
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span>📝</span>
                  <span>Create & Publish Assignment</span>
                </h3>
                <p className="text-xs text-foreground/60 mt-1">Design coursework to dispatch to students and parents</p>
              </div>
              <button 
                onClick={() => {
                  setAssignmentModalOpen(false);
                  setNewAssignmentTitle('');
                  setNewAssignmentFileName('');
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-muted border border-border hover:bg-card text-foreground transition-all"
              >
                Cancel
              </button>
            </div>

            {/* Modal Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!canUserEditSection('assignments')) {
                  alert("Access Denied! You do not have permission to publish assignments.");
                  return;
                }
                if (!newAssignmentTitle) return;
                const newId = String(assignments.length + 1);
                const finalFileName = newAssignmentFileName || `assignment_${newId}.${newAssignmentFileType}`;
                requestSecurityVerification(`Publish and dispatch assignment "${newAssignmentTitle}" for ${newAssignmentSubject}`, () => {
                  setAssignments(prev => [
                    ...prev,
                    {
                      id: newId,
                      title: newAssignmentTitle,
                      subject: newAssignmentSubject,
                      publishDate: newAssignmentPublishDate,
                      dueDate: newAssignmentDueDate,
                      fileName: finalFileName,
                      fileType: newAssignmentFileType,
                      fileUrl: newAssignmentFileUrl,
                      status: newAssignmentPublishDate <= '2026-06-08' ? 'Published' : 'Scheduled'
                    }
                  ]);
                  setAssignmentModalOpen(false);
                  setNewAssignmentTitle('');
                  setNewAssignmentFileName('');
                  setNewAssignmentFileUrl('');
                  alert(`Assignment "${newAssignmentTitle}" successfully dispatched/scheduled!`);
                });
              }}
              className="contents"
            >
              <div className="modal-body space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-foreground/75">Select Subject Course</label>
                  <select 
                    value={newAssignmentSubject}
                    onChange={(e) => setNewAssignmentSubject(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg p-2.5 text-foreground font-semibold"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground/75">Assignment File Format</label>
                  <select 
                    value={newAssignmentFileType}
                    onChange={(e) => {
                      setNewAssignmentFileType(e.target.value);
                      if (newAssignmentFileName) {
                        const base = newAssignmentFileName.substring(0, newAssignmentFileName.lastIndexOf('.'));
                        setNewAssignmentFileName(base + '.' + e.target.value);
                      }
                    }}
                    className="w-full bg-card border border-border rounded-lg p-2.5 text-foreground font-semibold"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="word">Word Document (.docx)</option>
                    <option value="powerpoint">PowerPoint Slides (.pptx)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground/75">Assignment Title / Topic</label>
                <input 
                  type="text" 
                  placeholder="e.g. Chapter 3: Trigonometry Practice sheet"
                  value={newAssignmentTitle}
                  onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg p-2.5 text-foreground"
                  required
                />
              </div>

              {/* REAL File Uploader */}
              <div className="space-y-2">
                <label className="font-bold text-foreground/75">Upload Assignment File Attachment</label>
                <div className="border border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center bg-muted/20 gap-3">
                  <input 
                    type="file"
                    id="real-file-upload-input"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setIsUploading(true);
                        setUploadProgress(0);
                        setNewAssignmentFileName(file.name);
                        const ext = file.name.split('.').pop()?.toLowerCase();
                        if (ext === 'pdf') {
                          setNewAssignmentFileType('pdf');
                        } else if (['doc', 'docx'].includes(ext || '')) {
                          setNewAssignmentFileType('word');
                        } else if (['ppt', 'pptx'].includes(ext || '')) {
                          setNewAssignmentFileType('powerpoint');
                        }

                        const reader = new FileReader();
                        reader.onprogress = (event) => {
                          if (event.lengthComputable) {
                            const percent = Math.round((event.loaded / event.total) * 100);
                            setUploadProgress(percent);
                          }
                        };
                        reader.onload = () => {
                          setNewAssignmentFileUrl(reader.result as string);
                          setUploadProgress(100);
                          setTimeout(() => {
                            setIsUploading(false);
                          }, 300);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {isUploading ? (
                    <div className="w-full space-y-2 text-center py-2">
                      <span className="text-[10px] font-bold text-foreground/75">Uploading local file... {uploadProgress}%</span>
                      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-75" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </div>
                  ) : newAssignmentFileName ? (
                    <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 p-2.5 rounded-lg w-full justify-between">
                      <span className="font-semibold text-primary truncate max-w-[280px]">
                        ✅ {newAssignmentFileName}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => {
                          setNewAssignmentFileName('');
                          setNewAssignmentFileUrl('');
                        }}
                        className="text-foreground/50 hover:text-red-400 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-[10px] text-foreground/60 text-center">Attach your docx, pptx, or pdf study material</p>
                      <button
                        type="button"
                        onClick={() => {
                          document.getElementById('real-file-upload-input')?.click();
                        }}
                        className="bg-card hover:bg-muted border border-border px-3.5 py-1.5 rounded-lg font-bold transition-all shadow-sm active:scale-95 text-[10px]"
                      >
                        📂 Choose File from Computer
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-foreground/75">Publication Date (Send Date)</label>
                  <input 
                    type="date" 
                    value={newAssignmentPublishDate}
                    onChange={(e) => setNewAssignmentPublishDate(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg p-2.5 text-foreground"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground/75">Due Submission Date</label>
                  <input 
                    type="date" 
                    value={newAssignmentDueDate}
                    onChange={(e) => setNewAssignmentDueDate(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg p-2.5 text-foreground"
                    required
                  />
                </div>
              </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg transition-all shadow-md active:scale-[0.98] text-xs"
                >
                  🚀 Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERACTIVE MODULE MODALS */}
      {activeFeature && (
        <div className="modal-overlay">
          <div className="modal-container modal-xl glass-card glow-purple text-foreground">
            
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span>🛠️</span>
                  <span>{activeFeature}</span>
                </h3>
                <p className="text-xs text-foreground/60 mt-1">View and manage information easily</p>
              </div>
              <button 
                onClick={() => setActiveFeature(null)}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-muted border border-border hover:bg-card text-foreground transition-all"
              >
                Close
              </button>
            </div>

            {/* Modal Interactive Content */}
            <div className="modal-body space-y-4 text-sm">
              
              {/* STUDENT MANAGEMENT */}
              {activeFeature === 'Student Management' && (
                <div className="space-y-4">
                  {/* Add Student Form */}
                  {isEditor && (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newStudentName || !newStudentRoll) return;
                        requestSecurityVerification(`Enroll new student: "${newStudentName}" (Roll No: ${newStudentRoll}) to class ${newStudentClass}`, () => {
                          setStudents(prev => [
                            ...prev,
                            { id: `s-${Date.now()}`, name: newStudentName, roll: newStudentRoll, className: newStudentClass, status: 'Present' }
                          ]);
                          setNewStudentName('');
                          setNewStudentRoll('');
                        });
                      }}
                      className="p-4 bg-muted/30 border border-border rounded-xl space-y-3"
                    >
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Enroll New Student</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input 
                          type="text" 
                          required 
                          placeholder="Student Name"
                          value={newStudentName}
                          onChange={(e) => setNewStudentName(e.target.value)}
                          className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                        />
                        <input 
                          type="text" 
                          required 
                          placeholder={getRollLabel()}
                          value={newStudentRoll}
                          onChange={(e) => setNewStudentRoll(e.target.value)}
                          className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                        />
                        <select 
                          value={newStudentClass} 
                          onChange={(e) => setNewStudentClass(e.target.value)}
                          className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold"
                        >
                          <option value="Class 10-A">Class 10-A</option>
                          <option value="Class 10-B">Class 10-B</option>
                          <option value="Class 9-A">Class 9-A</option>
                        </select>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                          + Add Student
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Beautiful Student Roster Grid */}
                  <div className="space-y-3 pt-2 border-t border-border/60">
                    <span className="block text-xs font-bold text-foreground/75 uppercase tracking-wider">Student Roster</span>
                    <div className="flex flex-wrap justify-center gap-3">
                      {students.map((stud) => {
                        const initials = stud.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                        return (
                          <div key={stud.id} className="p-3 bg-card/65 border border-border rounded-xl flex flex-col items-center justify-center text-center gap-1.5 hover:border-primary/45 transition-all w-[calc(50%-6px)] sm:w-[calc(25%-9px)]">
                            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-black text-primary">
                              {initials}
                            </div>
                            <div className="text-[11px] font-bold text-foreground truncate w-full">{stud.name}</div>
                            <div className="text-[9px] text-foreground/60">{stud.className}</div>
                            {isEditor && (
                              <button 
                                onClick={() => requestSecureDelete(
                                  `Are you sure you want to permanently delete the student registry enrollment for ${stud.name}?`,
                                  () => setStudents(prev => prev.filter(s => s.id !== stud.id))
                                )}
                                className="text-[10px] text-red-400 hover:text-red-300 font-medium mt-1"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TEACHER MANAGEMENT */}
              {activeFeature === 'Teacher Management' && (
                <div className="space-y-4">
                  {/* Add Teacher Form */}
                  {isEditor && (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newTeacherName || !newTeacherSubject) return;
                        requestSecurityVerification(`Register new teacher: "${newTeacherName}" for subject ${newTeacherSubject}`, () => {
                          setTeachers(prev => [
                            ...prev,
                            { id: `t-${Date.now()}`, name: newTeacherName, subject: newTeacherSubject, className: newTeacherClass, status: 'Active' }
                          ]);
                          setNewTeacherName('');
                          setNewTeacherSubject('');
                        });
                      }}
                      className="p-4 bg-muted/30 border border-border rounded-xl space-y-3"
                    >
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Add New Teacher</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input 
                          type="text" 
                          required 
                          placeholder="Teacher Name"
                          value={newTeacherName}
                          onChange={(e) => setNewTeacherName(e.target.value)}
                          className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                        />
                        <input 
                          type="text" 
                          required 
                          placeholder="Subject (e.g. Science)"
                          value={newTeacherSubject}
                          onChange={(e) => setNewTeacherSubject(e.target.value)}
                          className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                        />
                        <select 
                          value={newTeacherClass} 
                          onChange={(e) => setNewTeacherClass(e.target.value)}
                          className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold"
                        >
                          <option value="Class 10-A">Class 10-A</option>
                          <option value="Class 10-B">Class 10-B</option>
                          <option value="Class 9-A">Class 9-A</option>
                        </select>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                          + Add Teacher
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Teaching Staff Roster */}
                  <div className="space-y-3 pt-2 border-t border-border/60">

                    <span className="block text-xs font-bold text-foreground/75 uppercase tracking-wider">Teaching Staff Roster</span>
                    <div className="flex flex-wrap justify-center gap-3">
                      {teachers.map((teach) => (
                        <div key={teach.id} className="p-4 bg-card/60 border border-border rounded-xl flex items-center justify-between gap-3 hover:border-primary/45 transition-all w-full md:w-[calc(50%-6px)]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-xs shrink-0">
                              {teach.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <strong className="block text-xs text-foreground font-bold">{teach.name}</strong>
                              <span className="text-[10px] text-foreground/60 block">{teach.subject} | {teach.className}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[9px] uppercase tracking-wider shrink-0">
                              Verified
                            </span>
                            {isEditor && (
                              <button 
                                onClick={() => requestSecureDelete(
                                  `Are you sure you want to dismiss and delete the teacher record for ${teach.name}?`,
                                  () => setTeachers(prev => prev.filter(t => t.id !== teach.id))
                                )}
                                className="text-[10px] text-red-400 hover:text-red-300 font-medium"
                              >
                                Dismiss
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              )}

              {/* ATTENDANCE MONITORING & ATTENDANCE MARKING & CHILD ATTENDANCE & ATTENDANCE LEDGER */}
              {(activeFeature === 'Attendance Monitoring' || activeFeature === 'Attendance Marking' || activeFeature === 'Child Attendance' || activeFeature === 'Attendance Ledger') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📊 View and log weekly attendance records {isEditor ? "alongside average campus attendance trends" : "and monitor child presence stats"}.
                  </div>

                  {/* Side-by-Side Attendance & Performance Analytics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                    
                    {/* Attendance Tracking Grid */}
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col text-slate-200">
                      <span className="text-[11px] font-bold text-primary uppercase tracking-wider block text-center">Attendance Tracking (Weekly)</span>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] border-collapse">
                          <thead>
                            <tr className="text-slate-500 font-bold border-b border-slate-800/80">
                              <th className="pb-1.5">Student</th>
                              <th className="pb-1.5 text-center">M</th>
                              <th className="pb-1.5 text-center">T</th>
                              <th className="pb-1.5 text-center">W</th>
                              <th className="pb-1.5 text-center">T</th>
                              <th className="pb-1.5 text-center">F</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50">
                            {students
                              .filter(s => isEditor || s.name === 'Kamran Shah')
                              .map((s) => (
                              <tr key={s.id}>
                                <td className="py-2.5 font-semibold text-slate-300">{s.name.split(' ')[0]}</td>
                                <td className="py-2.5 text-center text-emerald-400 font-bold">✓</td>
                                <td className="py-2.5 text-center text-emerald-400 font-bold">✓</td>
                                <td className="py-2.5 text-center text-emerald-400 font-bold">✓</td>
                                <td className="py-2.5 text-center text-rose-500 font-bold">{s.id === '3' ? '✗' : '✓'}</td>
                                <td className="py-2.5 text-center text-emerald-400 font-bold">✓</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Attendance Analytics or Personal Metrics */}
                    {isEditor ? (
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between text-slate-200">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider block text-center">Campus Attendance Trends</span>
                        <div className="flex items-end justify-between h-36 pt-4 px-2">
                          {[
                            { label: '10-A', val: 94 },
                            { label: '10-B', val: 98 },
                            { label: '9-A', val: 90 },
                            { label: '9-B', val: 95 },
                            { label: '8-A', val: 92 }
                          ].map((bar, i) => {
                            const isHighlyRewarded = bar.val >= 95;
                            return (
                              <div key={i} className="flex flex-col items-center justify-end h-full w-12 group relative">
                                {/* Hover tooltip */}
                                <div className="absolute -top-6 bg-slate-950 text-[9px] text-white px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-all font-bold pointer-events-none z-10 whitespace-nowrap">
                                  {bar.val}% Attendance
                                </div>
                                <span className={`text-[9px] font-extrabold mb-1 transition-all ${
                                  isHighlyRewarded ? 'text-emerald-400 font-black scale-105' : 'text-purple-400'
                                }`}>{bar.val}%</span>
                                {/* Background slot */}
                                <div className="w-5 bg-slate-800/60 rounded-t-md h-20 relative overflow-hidden flex items-end border border-slate-700/30">
                                  {/* Colored Bar */}
                                  <div 
                                    className={`w-full rounded-t-sm transition-all duration-700 bg-gradient-to-t ${
                                      isHighlyRewarded 
                                        ? 'from-emerald-600 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]' 
                                        : 'from-purple-600/90 to-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                                    }`}
                                    style={{ height: `${bar.val}%` }}
                                  ></div>
                                </div>
                                <span className="text-[9px] text-slate-400 font-bold mt-1.5">{bar.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between text-slate-200">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider block text-center">Attendance Ledger Overview</span>
                        <div className="space-y-3 py-2 text-xs">
                          <div className="flex justify-between border-b border-slate-800 pb-1.5">
                            <span className="text-slate-400">Total Present Days</span>
                            <span className="font-bold text-emerald-400">46 Days (96.5%)</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-800 pb-1.5">
                            <span className="text-slate-400">Approved Leaves</span>
                            <span className="font-bold text-blue-400">2 Days</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-800 pb-1.5">
                            <span className="text-slate-400">Unexcused Absences</span>
                            <span className="font-bold text-rose-500">1 Day</span>
                          </div>
                          <div className="text-[10px] text-slate-500 italic text-center pt-1">
                            Your attendance is within the standard requirements. Keep it up!
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {students
                      .filter(s => isEditor || s.name === 'Kamran Shah') // Only show own attendance details to student/parent
                      .map((stud) => (
                      <div key={stud.id} className="p-3.5 bg-card border border-border rounded-xl flex items-center justify-between">
                        <div>
                          <strong className="block text-sm text-foreground">{stud.name}</strong>
                          <span className="text-xs text-foreground/50">{stud.className} | {getRollLabel()}: {stud.roll}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isEditor ? (
                            <>
                              <button
                                onClick={() => {
                                  requestSecurityVerification(`Mark student "${stud.name}" as Present`, () => {
                                    setStudents(prev => prev.map(s => s.id === stud.id ? { ...s, status: 'Present' } : s));
                                  });
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  stud.status === 'Present'
                                    ? 'bg-emerald-500 text-white shadow'
                                    : 'bg-muted border border-border text-foreground/60 hover:text-foreground'
                                }`}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => {
                                  requestSecurityVerification(`Mark student "${stud.name}" as Absent`, () => {
                                    setStudents(prev => prev.map(s => s.id === stud.id ? { ...s, status: 'Absent' } : s));
                                  });
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  stud.status === 'Absent'
                                    ? 'bg-red-500 text-white shadow'
                                    : 'bg-muted border border-border text-foreground/60 hover:text-foreground'
                                }`}
                              >
                                Absent
                              </button>
                            </>
                          ) : (
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                              stud.status === 'Present'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                              {stud.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FEE MONITORING & FEE STATUS & FEE PAYMENTS & FEE COLLECTION & FEE DEFAULTERS & INVOICING */}
              {(activeFeature === 'Fee Monitoring' || activeFeature === 'Fee Status' || activeFeature === 'Fee Payments' || activeFeature === 'Fee Collection' || activeFeature === 'Fee Defaulters' || activeFeature === 'Invoicing') && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Side-by-Side Fee Stats & Monthly Bar Chart */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Fee Collection Overview</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col justify-center">
                          <span className="text-slate-400 block font-semibold">
                            {isEditor ? "Total Fees Collected" : "Total Fees Paid"}
                          </span>
                          <strong className="text-emerald-400 text-xl block mt-1 font-black">
                            {formatCurrency(
                              invoices
                                .filter(i => (isEditor || i.student === 'Kamran Shah') && i.status === 'Paid')
                                .reduce((sum, inv) => sum + inv.amount, 0)
                            )}
                          </strong>
                        </div>
                        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col justify-center">
                          <span className="text-slate-400 block font-semibold">
                            {isEditor ? "Outstanding Ledger" : "Outstanding Fees"}
                          </span>
                          <strong className="text-amber-400 text-xl block mt-1 font-black">
                            {formatCurrency(
                              invoices
                                .filter(i => (isEditor || i.student === 'Kamran Shah') && i.status === 'Unpaid')
                                .reduce((sum, inv) => sum + inv.amount, 0)
                            )}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Fee Collection Bar Chart */}
                    {isEditor && (
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between text-slate-200">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider block text-center">Fee Collection (Monthly Trends)</span>
                        <div className="flex items-end justify-between h-28 pt-2 px-1">
                          {[
                            { month: 'Jan', val: '45K', height: '65%' },
                            { month: 'Feb', val: '52K', height: '75%' },
                            { month: 'Mar', val: '48K', height: '70%' },
                            { month: 'Apr', val: '61K', height: '90%' },
                            { month: 'May', val: '55K', height: '80%' }
                          ].map((bar, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 w-8">
                              <span className="text-[9px] font-bold text-slate-400">{bar.val}</span>
                              <div className="w-4 bg-gradient-to-t from-primary/40 to-primary rounded-t-sm" style={{ height: bar.height }}></div>
                              <span className="text-[9px] text-slate-500 font-semibold">{bar.month}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add Invoice Form */}
                  {isEditor && (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const amt = parseFloat(newInvoiceAmount);
                        if (!newInvoiceStudent || isNaN(amt)) return;
                        setInvoices(prev => [
                          ...prev,
                          { id: `INV-${Date.now()}`, student: newInvoiceStudent, amount: amt, status: 'Unpaid' }
                        ]);
                        setNewInvoiceAmount('8500');
                      }}
                      className="p-4 bg-muted/30 border border-border rounded-xl space-y-3"
                    >
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Issue Fee Challan</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select 
                          value={newInvoiceStudent} 
                          onChange={(e) => setNewInvoiceStudent(e.target.value)}
                          className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold"
                        >
                          {students.map(s => <option key={s.id} value={s.name}>{s.name} ({s.className})</option>)}
                        </select>
                        <input 
                          type="number" 
                          required 
                          placeholder="Challan Amount"
                          value={newInvoiceAmount}
                          onChange={(e) => setNewInvoiceAmount(e.target.value)}
                          className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                          + Create Invoice
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Invoice list */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Fee Ledgers</span>
                    {invoices
                      .filter(i => isEditor || i.student === 'Kamran Shah') // Parents/Students only view own invoices
                      .map((inv) => (
                      <div key={inv.id} className="p-3 bg-card border border-border rounded-xl flex items-center justify-between">
                        <div>
                          <strong className="block text-sm text-foreground">{inv.student}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">{inv.id} | {formatCurrency(inv.amount)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isEditor ? (
                            <button
                              onClick={() => {
                                setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: i.status === 'Paid' ? 'Unpaid' : 'Paid' } : i));
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                inv.status === 'Paid'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                              }`}
                            >
                              {inv.status}
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                                inv.status === 'Paid'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-red-500/10 text-red-400 border-red-500/20'
                              }`}>
                                {inv.status}
                              </span>
                              {!isEditor && inv.status === 'Unpaid' && (
                                <button
                                  onClick={() => {
                                    setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'Paid' } : i));
                                    alert(`Fee Payment of ${formatCurrency(inv.amount)} Processed Successfully via online banking!`);
                                  }}
                                  className="px-3 py-1.5 bg-primary hover:bg-primary/95 text-white rounded-lg text-xs font-bold transition-all shadow"
                                >
                                  Pay Online
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeFeature === 'School Notices' || activeFeature === 'Notifications' || activeFeature === 'Notifications Log' || activeFeature === 'Global Announcements') && (
                <div className="space-y-4">
                  {/* Create Notice Form */}
                  {isEditor && (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newNoticeTitle || !newNoticeContent) return;
                        requestSecurityVerification(`Publish notice board broadcast alert: "${newNoticeTitle}"`, () => {
                          setNotices(prev => [
                            ...prev,
                            { id: `n-${Date.now()}`, date: new Date().toISOString().split('T')[0], title: newNoticeTitle, content: newNoticeContent }
                          ]);
                          setNewNoticeTitle('');
                          setNewNoticeContent('');
                        });
                      }}
                      className="p-4 bg-muted/30 border border-border rounded-xl space-y-3"
                    >
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Publish New Notice Board Alert</span>
                      <input 
                        type="text" 
                        required 
                        placeholder="Announcement Title"
                        value={newNoticeTitle}
                        onChange={(e) => setNewNoticeTitle(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                      />
                      <textarea 
                        required 
                        rows={3}
                        placeholder="Announcement details..."
                        value={newNoticeContent}
                        onChange={(e) => setNewNoticeContent(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                      />
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                          📢 Send Notice
                        </button>
                      </div>
                    </form>
                  )}                  <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                    <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Active Broadcasts</span>
                    {notices.map((not) => (
                      <div key={not.id} className="p-3 bg-card border border-border rounded-xl space-y-1">
                        <div className="flex justify-between items-start">
                          <strong className="text-sm text-foreground block font-bold">{not.title}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">{not.date}</span>
                        </div>
                        <p className="text-xs text-foreground/70 leading-relaxed font-medium">{not.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LEAVE APPROVALS & LEAVE MANAGEMENT & TEACHER LEAVE REQUESTS */}
              {(activeFeature === 'Leave Approvals' || activeFeature === 'Leave Management' || activeFeature === 'Teacher Leave Requests') && (
                <div className="space-y-4">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📜 Review or submit leave applications.
                  </div>
                  {/* Submit Leave Application Form (Accessible by parent/teacher/admin, hidden for student) */}
                  {(simulatedRole === 'parent' || isEditor) && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const reason = (form.elements.namedItem('leaveReason') as HTMLInputElement).value;
                        const date = (form.elements.namedItem('leaveDate') as HTMLInputElement).value;
                        if (!reason || !date) return;
                        setLeaves(prev => [
                          ...prev,
                          { id: `l-${Date.now()}`, name: currentUser?.name || 'Teacher/Staff Member', date, reason, status: 'Pending' }
                        ]);
                        form.reset();
                        alert("Leave application successfully registered!");
                      }}
                      className="p-4 bg-muted/30 border border-border rounded-xl space-y-3"
                    >
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Submit Leave Application</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          type="date" 
                          name="leaveDate" 
                          required 
                          className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold"
                        />
                        <input 
                          type="text" 
                          name="leaveReason" 
                          required 
                          placeholder="Reason (e.g. Health Checkup)" 
                          className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                          + Submit Leave
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Pending and historical records</span>
                    {leaves.length === 0 ? (
                      <p className="text-center text-xs text-foreground/50 py-4">No leave applications registered.</p>
                    ) : (
                      leaves.map((lv) => (
                        <div key={lv.id} className="p-3.5 bg-card border border-border rounded-xl flex items-center justify-between">
                          <div className="space-y-1">
                            <strong className="block text-sm text-foreground">{lv.name}</strong>
                            <span className="text-xs text-slate-500 block font-mono">Leave date: {lv.date}</span>
                            <span className="text-xs text-foreground/75 block">Reason: "{lv.reason}"</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {lv.status === 'Pending' ? (
                              isEditor ? (
                                <>
                                  <button
                                    onClick={() => {
                                      setLeaves(prev => prev.map(l => l.id === lv.id ? { ...l, status: 'Approved' } : l));
                                    }}
                                    className="px-2.5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => {
                                      setLeaves(prev => prev.map(l => l.id === lv.id ? { ...l, status: 'Rejected' } : l));
                                    }}
                                    className="px-2.5 py-1.5 rounded bg-red-500 hover:bg-red-650 text-white font-bold text-xs transition-colors shadow"
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  Pending Vetting
                                </span>
                              )
                            ) : (
                              <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                                lv.status === 'Approved'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-red-500/10 text-red-400 border-red-500/20'
                              }`}>
                                {lv.status}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* BOOK MANAGEMENT & ISSUE BOOKS & RETURN BOOKS & LIBRARY SYSTEM */}
              {['Book Management', 'Issue Books', 'Return Books', 'Fine Collection', 'Inventory Tracking', 'Library Desk'].includes(activeFeature) && (
                <div className="space-y-4">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📚 Monitor checkout status and library inventory.
                  </div>
                  {/* Issue Book Form */}
                  {isEditor && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        alert('Book issued successfully to selected student!');
                      }}
                      className="p-4 bg-muted/30 border border-border rounded-xl space-y-3"
                    >
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Issue Library Volume</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                          <option>Advanced Calculus Vol 1</option>
                          <option>Introduction to Quantum Mechanics</option>
                          <option>A History of Modern Literature</option>
                        </select>
                        <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                          {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                          + Issue Book
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Circulating Books Inventory</span>
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                          <th className="p-2">Book Title</th>
                          <th className="p-2">Issued To</th>
                          <th className="p-2 text-right">Due Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground/85">
                        <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Advanced Calculus Vol 1</td><td className="p-2">Kamran Shah</td><td className="p-2 text-right text-slate-500">2026-06-15</td></tr>
                        <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Introduction to Quantum Mechanics</td><td className="p-2">Ayesha Siddiqui</td><td className="p-2 text-right text-slate-500">2026-06-12</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VEHICLES & ROUTES & DRIVERS & TRANSPORT GPS TRACKING */}
              {['Vehicles', 'Routes', 'Drivers', 'Student Assignments', 'GPS Tracking', 'Transport Fees', 'Transport GPS Tracking'].includes(activeFeature) && (
                <div className="space-y-4">
                  {/* Common GPS Header status */}
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed flex items-center justify-between">
                    <span>🚌 Transport Control Desk: <strong className="text-emerald-400 font-mono">ACTIVE</strong>. Fleet synced.</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  </div>

                  {/* GPS Tracking Sub-view */}
                  {(activeFeature === 'GPS Tracking' || activeFeature === 'Transport GPS Tracking') && (
                    <div className="space-y-4">
                      {/* Live GPS Map Simulation Visualization */}
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-inner">
                        <div className="flex justify-between items-center text-xs text-slate-300 border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-slate-800 text-yellow-400 font-bold">BUS-08</span>
                            <span className="font-bold text-white">Route Alpha (Main Loop)</span>
                          </div>
                          <span className="text-emerald-400 font-bold font-mono">Speed: 42 km/h</span>
                        </div>

                        {/* Styled Map Timeline Path */}
                        <div className="relative py-6 px-2">
                          {/* Horizontal progress path track line */}
                          <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-slate-800 -translate-y-1/2 rounded"></div>
                          <div className="absolute top-1/2 left-0 w-3/5 h-1.5 bg-gradient-to-r from-primary to-emerald-400 -translate-y-1/2 rounded"></div>

                          <div className="relative flex justify-between items-center">
                            {/* Stop 1 */}
                            <div className="flex flex-col items-center">
                              <div className="w-4 h-4 rounded-full bg-primary border-4 border-slate-900 z-10"></div>
                              <span className="text-[10px] text-slate-400 font-bold mt-1.5">Campus</span>
                            </div>

                            {/* Stop 2 */}
                            <div className="flex flex-col items-center">
                              <div className="w-4 h-4 rounded-full bg-primary border-4 border-slate-900 z-10"></div>
                              <span className="text-[10px] text-slate-400 font-bold mt-1.5">Johar Town</span>
                            </div>

                            {/* Active Bus Icon Marker */}
                            <div className="flex flex-col items-center -mt-2">
                              <div className="px-2 py-1 bg-emerald-400 text-slate-950 rounded text-[9px] font-black z-20 shadow-md animate-bounce">
                                🚌 BUS
                              </div>
                              <div className="w-4 h-4 rounded-full bg-emerald-400 border-4 border-slate-900 z-10 mt-1 shadow shadow-emerald-400/50"></div>
                            </div>

                            {/* Stop 3 */}
                            <div className="flex flex-col items-center">
                              <div className="w-4 h-4 rounded-full bg-slate-800 border-4 border-slate-900 z-10"></div>
                              <span className="text-[10px] text-slate-500 font-semibold mt-1.5">Model Town</span>
                            </div>

                            {/* Stop 4 */}
                            <div className="flex flex-col items-center">
                              <div className="w-4 h-4 rounded-full bg-slate-800 border-4 border-slate-900 z-10"></div>
                              <span className="text-[10px] text-slate-500 font-semibold mt-1.5">DHA Gate</span>
                            </div>
                          </div>
                        </div>

                        {/* Real-time Telemetry Stats */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                          <div>
                            <span className="block text-[9px] text-slate-500 font-bold uppercase">Stops Remaining</span>
                            <strong className="text-white text-sm font-black">2 Stops Left</strong>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-500 font-bold uppercase">Estimated Distance</span>
                            <strong className="text-white text-sm font-black">4.8 km</strong>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-500 font-bold uppercase">ETA Duration</span>
                            <strong className="text-emerald-400 text-sm font-black animate-pulse">~ 12 mins</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vehicles Sub-view */}
                  {activeFeature === 'Vehicles' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2.5 bg-muted/30 border border-border rounded-xl">
                          <span className="block text-[9px] text-foreground/60 font-bold uppercase">Total Fleet</span>
                          <strong className="text-foreground text-sm font-black">8 Buses</strong>
                        </div>
                        <div className="p-2.5 bg-muted/30 border border-border rounded-xl">
                          <span className="block text-[9px] text-emerald-400/80 font-bold uppercase">Active</span>
                          <strong className="text-emerald-400 text-sm font-black">7 Online</strong>
                        </div>
                        <div className="p-2.5 bg-muted/30 border border-border rounded-xl">
                          <span className="block text-[9px] text-amber-400/80 font-bold uppercase">Service</span>
                          <strong className="text-amber-400 text-sm font-black">1 Workshop</strong>
                        </div>
                      </div>

                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('New vehicle added to fleet!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Register New Fleet Vehicle</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input type="text" placeholder="Vehicle Reg No (e.g. BUS-09)" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                            <input type="text" placeholder="Model (e.g. Toyota Coaster)" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                            <input type="number" placeholder="Seating Capacity" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                          </div>
                          <div className="flex justify-end">
                            <button type="submit" className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all">
                              + Add Vehicle
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Fleet Directory</span>
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-2">Reg ID</th>
                              <th className="p-2">Vehicle Model</th>
                              <th className="p-2">Capacity</th>
                              <th className="p-2 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10"><td className="p-2 font-mono font-bold">BUS-08</td><td className="p-2">Toyota Coaster</td><td className="p-2">32 Seats</td><td className="p-2 text-right text-emerald-400 font-semibold">Active</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-mono font-bold">BUS-04</td><td className="p-2">Hino Premium Wing</td><td className="p-2">50 Seats</td><td className="p-2 text-right text-emerald-400 font-semibold">Active</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-mono font-bold">BUS-02</td><td className="p-2">Suzuki Carry Bolan</td><td className="p-2">12 Seats</td><td className="p-2 text-right text-amber-400 font-semibold">In Maintenance</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Routes Sub-view */}
                  {activeFeature === 'Routes' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('New route saved!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Create New Bus Route</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input type="text" placeholder="Route Title (e.g. Route Gamma)" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                            <input type="text" placeholder="Stops Path (comma-separated)" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                          </div>
                          <div className="flex justify-end">
                            <button type="submit" className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all">
                              + Create Route
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Active Transport Loops</span>
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-2">Bus Loop Route</th>
                              <th className="p-2">Stops Path</th>
                              <th className="p-2 text-right">Total Stops</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold text-primary">Route Alpha</td><td className="p-2 text-foreground/70">Campus → Johar Town → Model Town → DHA Gate</td><td className="p-2 text-right font-mono font-bold">12 Stops</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold text-primary">Route Beta</td><td className="p-2 text-foreground/70">Campus → Faisal Town → Barkat Market → Metro Link</td><td className="p-2 text-right font-mono font-bold">8 Stops</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Drivers Sub-view */}
                  {activeFeature === 'Drivers' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Driver registered successfully!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Add Bus Driver</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input type="text" placeholder="Driver Name (e.g. Aslam Khan)" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                            <input type="text" placeholder="License Class (e.g. HTV)" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                            <input type="text" placeholder="Phone Number" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                          </div>
                          <div className="flex justify-end">
                            <button type="submit" className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all">
                              + Add Driver
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Driver Directory Roster</span>
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-2">Driver Name</th>
                              <th className="p-2">Contact No</th>
                              <th className="p-2">License Type</th>
                              <th className="p-2 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Aslam Khan</td><td className="p-2 font-mono text-foreground/75">+92-300-1234567</td><td className="p-2 text-yellow-500 font-bold">HTV Heavy</td><td className="p-2 text-right text-emerald-400 font-semibold">On Duty (BUS-08)</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Nadeem Iqbal</td><td className="p-2 font-mono text-foreground/75">+92-312-9876543</td><td className="p-2 text-yellow-500 font-bold">HTV Heavy</td><td className="p-2 text-right text-emerald-400 font-semibold">On Duty (BUS-04)</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Zahid Rasheed</td><td className="p-2 font-mono text-foreground/75">+92-345-4455667</td><td className="p-2 text-yellow-500 font-bold">LTV Light</td><td className="p-2 text-right text-foreground/50">Off Duty</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Student Assignments Sub-view */}
                  {activeFeature === 'Student Assignments' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Student transport route assigned!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Assign Student to Route</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                              {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                            <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                              <option>Route Alpha (Main Loop)</option>
                              <option>Route Beta (Metro Hub Connection)</option>
                            </select>
                            <input type="text" placeholder="Preferred Stop" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                          </div>
                          <div className="flex justify-end">
                            <button type="submit" className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all">
                              + Assign Student
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Assigned Students</span>
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-2">Student Name</th>
                              <th className="p-2">Assigned Route</th>
                              <th className="p-2">Pickup Stop</th>
                              <th className="p-2 text-right">Fee Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Kamran Shah</td><td className="p-2">Route Alpha (BUS-08)</td><td className="p-2">Johar Town Stop</td><td className="p-2 text-right text-emerald-400 font-bold">Paid</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Ayesha Siddiqui</td><td className="p-2">Route Beta (BUS-04)</td><td className="p-2">Barkat Market</td><td className="p-2 text-right text-red-400 font-bold">Pending</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Transport Fees Sub-view */}
                  {activeFeature === 'Transport Fees' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                          <span className="block text-[9px] uppercase font-bold">Monthly Collection</span>
                          <strong className="text-sm font-black">Rs. 185,000</strong>
                        </div>
                        <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                          <span className="block text-[9px] uppercase font-bold">Unpaid Arrears</span>
                          <strong className="text-sm font-black">Rs. 45,000</strong>
                        </div>
                      </div>

                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Fee payment recorded!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Record Transport Fee Payment</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                              {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                            <input type="number" placeholder="Paid Amount (PKR)" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                            <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                              <option>June 2026</option>
                              <option>May 2026</option>
                            </select>
                          </div>
                          <div className="flex justify-end">
                            <button type="submit" className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all">
                              Record Payment
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Recent Transport Fee Ledger</span>
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-2">Student</th>
                              <th className="p-2">Assigned Loop</th>
                              <th className="p-2">Monthly Fee</th>
                              <th className="p-2 text-right">Fee Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Kamran Shah</td><td className="p-2">Route Alpha</td><td className="p-2 font-mono">Rs. 5,000</td><td className="p-2 text-right text-emerald-400 font-bold">Paid (June)</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Ayesha Siddiqui</td><td className="p-2">Route Beta</td><td className="p-2 font-mono">Rs. 4,500</td><td className="p-2 text-right text-amber-500 font-bold">Pending (June)</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Imran Khan</td><td className="p-2">Route Alpha</td><td className="p-2 font-mono">Rs. 5,000</td><td className="p-2 text-right text-emerald-400 font-bold">Paid (June)</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ROOM ALLOCATION & BED ALLOCATION & MESS MANAGEMENT */}
              {['Room Allocation', 'Bed Allocation', 'Mess Management', 'Hostel Reports', 'Hostel Fees'].includes(activeFeature) && (
                <div className="space-y-4">
                  {/* Common Hostel Status */}
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed flex items-center justify-between">
                    <span>🏠 Hostel Administration: <strong className="text-emerald-400 font-mono">Wing A & B</strong> online. Warden on duty.</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  </div>

                  {/* Mess Management Sub-view */}
                  {activeFeature === 'Mess Management' && (
                    <div className="space-y-3">
                      <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-2 text-xs">
                        <span className="block font-bold text-foreground/80 uppercase tracking-wider mb-2">Today's Mess Menu</span>
                        <div className="flex justify-between"><span>Breakfast (07:00 - 08:30)</span><span className="font-semibold text-foreground/80">Oatmeal & Boiled Eggs</span></div>
                        <div className="flex justify-between"><span>Lunch (13:00 - 14:30)</span><span className="font-semibold text-foreground/80">Chicken Pulao</span></div>
                        <div className="flex justify-between"><span>Dinner (19:30 - 21:00)</span><span className="font-semibold text-foreground/80">Daal Chawal & Salad</span></div>
                      </div>

                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Mess menu updated successfully!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Update Today's Mess Menu</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input type="text" placeholder="Breakfast Menu" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                            <input type="text" placeholder="Lunch Menu" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                            <input type="text" placeholder="Dinner Menu" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                          </div>
                          <div className="flex justify-end">
                            <button type="submit" className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all">
                              Update Menu
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Room Allocation Sub-view */}
                  {activeFeature === 'Room Allocation' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Dorm room assigned successfully!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Assign Dorm Room</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                              <option disabled className="text-foreground/40 bg-muted/30">Dorm Wing A - Room 104 (Full - Unavailable)</option>
                              <option value="Wing B - Room 202">Dorm Wing B - Room 202 (2 Vacant)</option>
                            </select>
                            <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                              {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                          </div>
                          <div className="flex justify-end pt-2">
                            <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                              + Assign Room
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Dorm Rooms Occupancy Directory</span>
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-2">Room / Wing</th>
                              <th className="p-2">Type</th>
                              <th className="p-2">Capacity</th>
                              <th className="p-2 text-right">Occupied Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Wing A - Room 104</td><td className="p-2">Double Bed</td><td className="p-2 font-mono">2 / 2 Beds</td><td className="p-2 text-right text-red-400 font-bold">Full</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Wing B - Room 202</td><td className="p-2">Triple Bed</td><td className="p-2 font-mono">1 / 3 Beds</td><td className="p-2 text-right text-emerald-400 font-bold">2 Vacant</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Bed Allocation Sub-view */}
                  {activeFeature === 'Bed Allocation' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Hostel Bed allocation logged successfully!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Allocate Bed</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                              <option>Wing A - Bed 104-A</option>
                              <option>Wing A - Bed 104-B</option>
                              <option>Wing B - Bed 202-A</option>
                            </select>
                            <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                              {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                            <input 
                              type="date" 
                              min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} 
                              defaultValue={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                              className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" 
                              required 
                            />
                          </div>
                          <div className="flex justify-end pt-2">
                            <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                              + Assign Bed
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Dorm Bed Allocations</span>
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-2">Dorm Bed</th>
                              <th className="p-2">Student</th>
                              <th className="p-2 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Wing A - Bed 104-A</td><td className="p-2">Kamran Shah</td><td className="p-2 text-right text-emerald-400 font-bold">Allocated</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Wing A - Bed 104-B</td><td className="p-2">Ayesha Siddiqui</td><td className="p-2 text-right text-emerald-400 font-bold">Allocated</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Hostel Reports Sub-view */}
                  {activeFeature === 'Hostel Reports' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="p-3 bg-muted/30 border border-border rounded-xl">
                          <span className="block text-[10px] text-foreground/60 font-bold uppercase">Total Dorm Occupancy</span>
                          <strong className="text-foreground text-sm font-black">78%</strong>
                        </div>
                        <div className="p-3 bg-muted/30 border border-border rounded-xl">
                          <span className="block text-[10px] text-foreground/60 font-bold uppercase">Available Beds</span>
                          <strong className="text-foreground text-sm font-black">12 Vacant</strong>
                        </div>
                      </div>

                      <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-2 text-xs">
                        <span className="block font-bold text-foreground/85 uppercase">Maintenance Logs & Reports</span>
                        {maintenanceLogs.map((log) => (
                          <div key={log.id} className="p-2 bg-card border border-border rounded-lg flex justify-between items-center gap-2">
                            <span>{log.title}</span>
                            {isEditor ? (
                              <select
                                value={log.status}
                                onChange={(e) => {
                                  const nextStatus = e.target.value;
                                  requestSecurityVerification(`Update maintenance log "${log.title}" status to "${nextStatus}"`, () => {
                                    setMaintenanceLogs(prev => prev.map(item => item.id === log.id ? { ...item, status: nextStatus } : item));
                                  });
                                }}
                                className={`text-[11px] font-black rounded-lg border px-2 py-1 bg-card transition-all text-center focus:outline-none focus:ring-1 focus:ring-primary ${
                                  log.status === 'Resolved' ? 'text-emerald-400 border-emerald-500/30' :
                                  log.status === 'In Progress' ? 'text-blue-400 border-blue-500/30' :
                                  'text-amber-400 border-amber-500/30'
                                }`}
                              >
                                <option className="text-amber-400 font-bold bg-card" value="Pending Fix">Pending Fix</option>
                                <option className="text-blue-400 font-bold bg-card" value="In Progress">In Progress</option>
                                <option className="text-emerald-400 font-bold bg-card" value="Resolved">Resolved</option>
                              </select>
                            ) : (
                              <span className={`font-bold ${
                                log.status === 'Resolved' ? 'text-emerald-400' :
                                log.status === 'In Progress' ? 'text-blue-400' :
                                'text-amber-400'
                              }`}>
                                {log.status}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hostel Fees Sub-view */}
                  {activeFeature === 'Hostel Fees' && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-border">
                          <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Hostel Invoices & Fees Ledger</span>
                          <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded">
                            {hostelInvoices.filter(i => i.status === 'Unpaid').length} Pending Invoices
                          </span>
                        </div>

                        {/* Invoices List */}
                        <div className="space-y-2.5">
                          {hostelInvoices.map((inv) => (
                            <div key={inv.id} className="p-3 bg-card border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                              <div>
                                <div className="flex items-center gap-2">
                                  <strong className="text-foreground">{inv.name}</strong>
                                  <span className="text-[9px] text-foreground/50 bg-muted/40 px-1.5 py-0.5 rounded border border-border/40 font-semibold">{inv.room}</span>
                                </div>
                                <div className="text-[10px] text-foreground/60 mt-1">
                                  Amount: <strong className="text-foreground">{formatCurrency(inv.amount)}</strong> &bull; Due: {inv.dueDate}
                                </div>
                              </div>

                              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  inv.status === 'Paid' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-rose-500/15 text-rose-400 border border-rose-500/25 animate-pulse'
                                }`}>
                                  {inv.status}
                                </span>

                                {inv.status === 'Unpaid' && (
                                  <div className="flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        requestSecurityVerification(`Collect outstanding hostel fees of ${formatCurrency(inv.amount)} from student "${inv.name}"`, () => {
                                          setHostelInvoices(prev => prev.map(item => item.id === inv.id ? { ...item, status: 'Paid' } : item));
                                          alert(`Fee collection of ${formatCurrency(inv.amount)} for ${inv.name} logged successfully!`);
                                        });
                                      }}
                                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[10px] font-bold shadow-sm transition-all"
                                    >
                                      Collect Fee
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        alert(`Defaulter notification alert sent to ${inv.name}'s parent contact regarding outstanding payment.`);
                                      }}
                                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold shadow-sm transition-all"
                                    >
                                      Alert Parent
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RECEPTION & VISITOR LOGS & APPOINTMENT SCHEDULING */}
              {(activeFeature === 'Visitor Management' || activeFeature === 'Front Desk Operations' || activeFeature === 'Appointment Scheduling' || activeFeature === 'Call Logs') && (
                <div className="space-y-4">
                  {/* Common Reception Desk Header */}
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed flex items-center justify-between">
                    <span>📞 Reception Desk Portal: <strong className="text-emerald-400 font-mono">ONLINE</strong>. Logs synced.</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  </div>

                  {/* Visitor Management Sub-view */}
                  {(activeFeature === 'Visitor Management' || activeFeature === 'Front Desk Operations') && (
                    <div className="space-y-3">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          alert('Visitor entry logged successfully!');
                        }}
                        className="p-4 bg-muted/30 border border-border rounded-xl space-y-3"
                      >
                        <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Log New Visitor Entry</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input type="text" placeholder="Visitor Name" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                          <input type="text" placeholder="Purpose of Visit (e.g. Admission Enquiry)" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                        </div>
                        <div className="flex justify-end pt-1">
                          <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                            + Check-in Visitor
                          </button>
                        </div>
                      </form>

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Today's Visitor Log</span>
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-2">Visitor</th>
                              <th className="p-2">Purpose</th>
                              <th className="p-2">Check-in</th>
                              <th className="p-2 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Haris Mehmood</td><td className="p-2">Parent Meeting</td><td className="p-2 font-mono">10:15 AM</td><td className="p-2 text-right text-emerald-400 font-bold">Checked In</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Zainab Bibi</td><td className="p-2">Fee Collection Desk</td><td className="p-2 font-mono">09:45 AM</td><td className="p-2 text-right text-foreground/50">Checked Out</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Appointment Scheduling Sub-view */}
                  {activeFeature === 'Appointment Scheduling' && (
                    <div className="space-y-3">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const fd = new FormData(e.currentTarget);
                          const visitor = fd.get('visitor') as string;
                          const host = fd.get('host') as string;
                          const rawDate = fd.get('dateTime') as string;
                          if (!visitor || !host || !rawDate) return;
                          
                          const formattedDate = new Date(rawDate).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          });

                          setAppointments(prev => [
                            ...prev,
                            { id: `APT-${Date.now()}`, visitor, host, dateTime: formattedDate, status: 'Confirmed' }
                          ]);
                          e.currentTarget.reset();
                        }}
                        className="p-4 bg-muted/30 border border-border rounded-xl space-y-3"
                      >
                        <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Schedule Meeting Appointment</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input name="visitor" type="text" placeholder="Visitor Name" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                          <input name="host" type="text" placeholder="Meeting With (e.g. Principal)" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                          <input name="dateTime" type="datetime-local" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                        </div>
                        <div className="flex justify-end pt-1">
                          <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                            + Book Slot
                          </button>
                        </div>
                      </form>

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Upcoming Scheduled Meetings</span>
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-2">Visitor</th>
                              <th className="p-2">Meeting With</th>
                              <th className="p-2">Date & Time</th>
                              <th className="p-2 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            {appointments.map((apt) => (
                              <tr key={apt.id} className="hover:bg-muted/10">
                                <td className="p-2 font-bold">{apt.visitor}</td>
                                <td className="p-2">{apt.host}</td>
                                <td className="p-2 font-mono">{apt.dateTime}</td>
                                <td className="p-2 text-right">
                                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                    apt.status === 'Confirmed' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' :
                                    apt.status === 'Pending' ? 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20' :
                                    'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                                  }`}>
                                    {apt.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Call Logs Sub-view */}
                  {activeFeature === 'Call Logs' && (
                    <div className="space-y-3">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          alert('Call registry logged successfully!');
                        }}
                        className="p-4 bg-muted/30 border border-border rounded-xl space-y-3"
                      >
                        <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Register Call Registry Log</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input type="text" placeholder="Caller Phone / Name" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                          <input type="text" placeholder="Recipient / Dept" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                          <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                            <option>Incoming Call</option>
                            <option>Outgoing Call</option>
                          </select>
                        </div>
                        <div className="flex justify-end pt-1">
                          <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                            + Log Call
                          </button>
                        </div>
                      </form>

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Today's Call Logs</span>
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-2">Caller / Number</th>
                              <th className="p-2">Department</th>
                              <th className="p-2">Time</th>
                              <th className="p-2 text-right">Type</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">+92-321-4455881</td><td className="p-2">Admissions Office</td><td className="p-2 font-mono">02:40 PM</td><td className="p-2 text-right text-emerald-400 font-bold">Incoming</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Principal Office</td><td className="p-2">Education Board Punjab</td><td className="p-2 font-mono">11:15 AM</td><td className="p-2 text-right text-blue-400 font-bold">Outgoing</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RECRUITMENT & STAFF MANAGEMENT & EMPLOYEE RECORDS */}
              {(activeFeature === 'Employee Records' || activeFeature === 'Recruitment' || activeFeature === 'Performance Reviews' || activeFeature === 'Payroll Coordination') && (
                <div className="space-y-4">
                  {/* Common HR Header */}
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed flex items-center justify-between">
                    <span>👤 HR Staff Lifecycles Dashboard. Active rosters verified.</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">Portal: Online</span>
                  </div>

                  {/* Employee Records Sub-view */}
                  {activeFeature === 'Employee Records' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Employee record registered!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Register New Employee</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input type="text" placeholder="Full Name" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                            <input type="text" placeholder="Designation (e.g. Maths Teacher)" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                            <input type="number" placeholder="Salary Base" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                          </div>
                          <div className="flex justify-end">
                            <button type="submit" className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all">
                              Register Staff
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Staff Directory</span>
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-2">Name</th>
                              <th className="p-2">Designation</th>
                              <th className="p-2 text-right">Date Joined</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Raza Ahmed</td><td className="p-2 text-foreground/85">Physics Lecturer</td><td className="p-2 text-right text-slate-500 font-mono">2021-08-15</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Sarah Khan</td><td className="p-2 text-foreground/85">English Instructor</td><td className="p-2 text-right text-slate-500 font-mono">2023-02-10</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Recruitment Sub-view */}
                  {activeFeature === 'Recruitment' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Job vacancy opening posted successfully!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Post New Job Vacancy</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input type="text" placeholder="Job Title (e.g. Chemistry Lecturer)" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                            <input type="text" placeholder="Requirements Summary" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                          </div>
                          <div className="flex justify-end">
                            <button type="submit" className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all">
                              Post Vacancy
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-foreground/75 uppercase">Active Job Postings</span>
                        <div className="p-3 bg-card border border-border rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <strong className="block text-foreground">Senior Chemistry Lecturer</strong>
                            <span className="text-slate-500">Experience required: 5+ years</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">4 Applicants</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Performance Reviews Sub-view */}
                  {activeFeature === 'Performance Reviews' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Performance score logged!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Log Teacher Performance Score</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                              <option>Raza Ahmed (Physics)</option>
                              <option>Sarah Khan (English)</option>
                            </select>
                            <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                              <option>Grade A (Excellent)</option>
                              <option>Grade B (Satisfactory)</option>
                              <option>Grade C (Needs Improvement)</option>
                            </select>
                            <input type="text" placeholder="Evaluation Remarks" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                          </div>
                          <div className="flex justify-end">
                            <button type="submit" className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all">
                              Record Review
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Evaluation Audit Trail</span>
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-2">Employee</th>
                              <th className="p-2">Score</th>
                              <th className="p-2 text-right">Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Raza Ahmed</td><td className="p-2 text-emerald-400 font-bold">Excellent (94%)</td><td className="p-2 text-right text-slate-400">Great student engagement</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Sarah Khan</td><td className="p-2 text-emerald-400 font-bold">Satisfactory (82%)</td><td className="p-2 text-right text-slate-400">Timetable targets matched</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Payroll Coordination Sub-view */}
                  {activeFeature === 'Payroll Coordination' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Monthly payroll disbursement initiated!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Disburse Monthly Pay Slip</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                              <option>Raza Ahmed</option>
                              <option>Sarah Khan</option>
                            </select>
                            <input type="number" placeholder="Net Disbursed Amount" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                            <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                              <option>June 2026</option>
                              <option>May 2026</option>
                            </select>
                          </div>
                          <div className="flex justify-end">
                            <button type="submit" className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all">
                              Process Salary
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Recent Payroll Ledger Logs</span>
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-2">Employee</th>
                              <th className="p-2">Salary Month</th>
                              <th className="p-2">Net Pay</th>
                              <th className="p-2 text-right">Payment Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Raza Ahmed</td><td className="p-2 font-mono">June 2026</td><td className="p-2 font-mono">Rs. 85,000</td><td className="p-2 text-right text-emerald-400 font-bold">Disbursed</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Sarah Khan</td><td className="p-2 font-mono">June 2026</td><td className="p-2 font-mono">Rs. 72,000</td><td className="p-2 text-right text-emerald-400 font-bold">Disbursed</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ACADEMIC MARKS & EXAM GRADES */}
              {['Marks Sheet', 'Exams Results', 'Exam Grades', 'Academic Oversight', 'Academic Monitoring'].includes(activeFeature || '') && (
                <div className="space-y-4">
                  {/* Beautiful Result Card Widget */}
                  <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl text-slate-200">
                    
                    {/* Header: Logo & Title */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        {/* Shield Badge Logo Icon */}
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center justify-center">
                          <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-white tracking-wide uppercase leading-none">
                            {currentTenant?.schoolName || 'Beaconhouse'}
                          </h4>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mt-1">Campus Lahore</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">STUDENT PROGRESS CARD</h3>
                        <span className="text-sm font-black text-primary uppercase tracking-widest leading-tight block mt-0.5">& TRANSCRIPT</span>
                        <span className="text-[9px] text-slate-500 block mt-1 font-semibold">Date of Issue: 15 June 2026</span>
                      </div>
                    </div>

                    {/* Student Metadata Box */}
                    <div className="grid grid-cols-4 gap-4 p-3 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl text-[10px] font-medium">
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider mb-0.5">Student Name</span>
                        <span className="text-white font-black text-xs">Ahmed Khan</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider mb-0.5">Admission ID</span>
                        <span className="text-white font-mono text-xs">12345</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider mb-0.5">Class Group</span>
                        <span className="text-white font-bold text-xs">Grade 10 Science</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider mb-0.5">Roll Number</span>
                        <span className="text-white font-mono text-xs">45</span>
                      </div>
                    </div>

                    {/* Detailed Expanded Subjects Table */}
                    <table className="w-full text-xs text-left border-collapse mt-2">
                      <thead>
                        <tr className="text-slate-500 font-bold border-b border-slate-800 bg-slate-950/20 text-[9px] uppercase tracking-wider">
                          <th className="p-2.5">Subject Course</th>
                          <th className="p-2.5 text-center">Midterm Grade</th>
                          <th className="p-2.5 text-center">Marks Obtained</th>
                          <th className="p-2.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850/60 text-slate-300 font-medium">
                        <tr className="hover:bg-slate-950/30"><td className="p-2.5 font-bold text-slate-200">Mathematics</td><td className="p-2.5 text-center font-black text-primary">A</td><td className="p-2.5 text-center font-mono">92 / 100</td><td className="p-2.5 text-right"><span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider">Pass</span></td></tr>
                        <tr className="hover:bg-slate-950/30"><td className="p-2.5 font-bold text-slate-200">Physics</td><td className="p-2.5 text-center font-black text-primary">A</td><td className="p-2.5 text-center font-mono">88 / 100</td><td className="p-2.5 text-right"><span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider">Pass</span></td></tr>
                        <tr className="hover:bg-slate-950/30"><td className="p-2.5 font-bold text-slate-200">Chemistry</td><td className="p-2.5 text-center font-black text-primary">B+</td><td className="p-2.5 text-center font-mono">79 / 100</td><td className="p-2.5 text-right"><span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider">Pass</span></td></tr>
                        <tr className="hover:bg-slate-950/30"><td className="p-2.5 font-bold text-slate-200">Biology</td><td className="p-2.5 text-center font-black text-primary">A</td><td className="p-2.5 text-center font-mono">90 / 100</td><td className="p-2.5 text-right"><span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider">Pass</span></td></tr>
                        <tr className="hover:bg-slate-950/30"><td className="p-2.5 font-bold text-slate-200">English Language</td><td className="p-2.5 text-center font-black text-primary">A</td><td className="p-2.5 text-center font-mono">94 / 100</td><td className="p-2.5 text-right"><span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider">Pass</span></td></tr>
                        <tr className="hover:bg-slate-950/30"><td className="p-2.5 font-bold text-slate-200">Computer Science</td><td className="p-2.5 text-center font-black text-primary">A</td><td className="p-2.5 text-center font-mono">95 / 100</td><td className="p-2.5 text-right"><span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider">Pass</span></td></tr>
                      </tbody>
                    </table>

                    {/* Principal Remarks & Evaluation */}
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-1.5 text-[10px] leading-relaxed">
                      <span className="block font-black text-emerald-400 uppercase tracking-widest text-[8px]">Principal Remarks & Evaluation</span>
                      <p className="text-slate-300 font-medium">
                        Ahmed is an exceptionally hard-working and dedicated student. He has shown remarkable progress across all science subjects this term. His analytical skills and attention to detail are commendable. Continued focus will ensure future success.
                      </p>
                    </div>

                    {/* Signatures & Seal Row */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-800/80 mt-2 text-[9px] font-bold text-slate-500 text-center">
                      <div className="w-24 space-y-1">
                        <span className="block font-mono text-slate-200 italic text-[11px]">Signature</span>
                        <div className="h-0.5 bg-slate-800 w-full"></div>
                        <span className="block text-[7px] uppercase tracking-wider text-slate-500">Class Teacher</span>
                      </div>
                      
                      {/* Premium Gold Stamp Seal */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 border border-amber-300 shadow-md flex items-center justify-center font-black text-amber-950 text-[8px] tracking-tight relative overflow-hidden">
                          <span className="absolute inset-0 bg-white/10 rotate-45 transform origin-top-left"></span>
                          SEAL
                        </div>
                        <span className="text-[7px] uppercase tracking-widest text-amber-500 mt-1 font-black">Official Verification</span>
                      </div>
                      
                      <div className="w-24 space-y-1">
                        <span className="block font-mono text-slate-200 italic text-[11px]">Principal</span>
                        <div className="h-0.5 bg-slate-800 w-full"></div>
                        <span className="block text-[7px] uppercase tracking-wider text-slate-500">Principal Seal</span>
                      </div>
                    </div>

                  </div>

                  {/* Marks input form */}
                  {isEditor && (
                    <form onSubmit={(e) => { e.preventDefault(); alert('Grades posted successfully!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3 pb-4">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Log Midterm Grades & Marks</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                          {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                        <input type="text" placeholder="Subject (e.g. Physics)" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                        <input type="number" placeholder="Marks % (e.g. 85)" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                      </div>
                      <div className="flex justify-center gap-2.5 pt-2 pb-1">
                        <button 
                          type="button" 
                          onClick={() => handlePrintPdf('progress_card')}
                          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center gap-1.5"
                        >
                          🖨️ Print Report
                        </button>
                        <button type="submit" className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                          + Save Grades
                        </button>
                      </div>
                    </form>
                  )}

                  <button onClick={() => handlePrintPdf('progress_card')} className="w-full py-2.5 bg-muted hover:bg-muted/80 border border-border text-foreground text-xs font-bold rounded-lg transition-all shadow-md">
                    📥 Print Student Progress Card Report (PDF)
                  </button>
                </div>
              )}

              {/* CLASSROOM TIMETABLES */}
              {['Timetable', 'Timetable Oversight', 'Class Timetable', 'My Classes'].includes(activeFeature || '') && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Print-only branding block containing School Logo & Name */}
                  <div className="hidden print:flex items-center justify-center gap-4 border-b-2 border-slate-200/80 pb-4 mb-4">
                    {currentTenant?.logoUrl && (
                      <img 
                        src={currentTenant.logoUrl} 
                        alt="School Logo" 
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <div>
                      <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">
                        {currentTenant?.schoolName || 'Academic Hub Partner School'}
                      </h2>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                        Class Timetable &amp; Roster Layout
                      </p>
                    </div>
                  </div>

                  {/* Timetable Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/20 border border-border p-4 rounded-2xl print-header-compact no-print">
                    <div>
                      <h3 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary animate-pulse" />
                        {['student', 'parent'].includes(simulatedRole) ? 'Personalized Class Timetable' : 'Interactive Timetable Scheduler'}
                      </h3>
                      <p className="text-[11px] text-foreground/60 mt-1">
                        {['student', 'parent'].includes(simulatedRole) 
                          ? 'Showing Grade 10 Science personalized weekly period layout.' 
                          : 'Manage and display conflict-free weekly schedules across class sections.'}
                      </p>
                    </div>
                    
                    {/* Mode Toggle */}
                    <div className="flex items-center gap-1.5 bg-muted/60 p-1 border border-border rounded-lg text-xs self-start md:self-auto no-print">
                      <button 
                        type="button"
                        onClick={() => setTimetableTab('daily')} 
                        className={`px-3 py-1.5 font-bold rounded-md transition-all ${timetableTab === 'daily' ? 'bg-primary text-white shadow-sm' : 'text-foreground/75 hover:bg-muted'}`}
                      >
                        Daily Agenda
                      </button>
                      <button 
                        type="button"
                        onClick={() => setTimetableTab('weekly')} 
                        className={`px-3 py-1.5 font-bold rounded-md transition-all ${timetableTab === 'weekly' ? 'bg-primary text-white shadow-sm' : 'text-foreground/75 hover:bg-muted'}`}
                      >
                        Weekly Matrix
                      </button>
                    </div>
                  </div>

                  {/* Daily Agenda View */}
                  {timetableTab === 'daily' && (
                    <div className="space-y-3">
                      {/* Day Tabs selector */}
                      <div className="flex items-center gap-1 overflow-x-auto pb-1.5 border-b border-border">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => setActiveTimetableDay(day)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                              activeTimetableDay === day 
                                ? 'bg-primary/15 text-primary border border-primary/30 shadow-sm' 
                                : 'text-foreground/60 border border-transparent hover:bg-muted/30'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>

                      {/* Daily Schedule List */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {(WEEKLY_SCHEDULE_DATA[activeTimetableDay] || []).map((period, index) => {
                          const subjectColor = getSubjectColor(period.subject);
                          return (
                            <div 
                              key={index} 
                              className="p-4 bg-muted/10 border border-border/80 rounded-2xl flex items-center justify-between hover:shadow-md transition-all duration-300 hover:border-primary/25 relative overflow-hidden"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${subjectColor.bg} ${subjectColor.text} border ${subjectColor.border}`}>
                                  {period.subject[0]}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-xs text-foreground">{period.subject}</span>
                                    <span className="text-[9px] font-bold text-foreground/50 bg-muted/40 px-1.5 py-0.5 rounded border border-border/40">
                                      Period {period.id}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-foreground/60 block mt-0.5">{period.teacher}</span>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <span className="font-mono text-[10px] font-bold text-foreground/80 block">{period.time}</span>
                                <span className="text-[9px] font-semibold text-foreground/50 block mt-0.5">Room: {period.room}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Weekly Matrix View */}
                  {timetableTab === 'weekly' && (
                    <div className="border border-border rounded-2xl overflow-hidden bg-muted/10 shadow-sm">
                      <div className="overflow-x-auto pb-2">
                        <table className="w-full text-left border-collapse text-[11px] min-w-[850px] table-fixed">
                          <thead>
                            <tr className="border-b border-border bg-muted/30 font-extrabold text-foreground/75 uppercase tracking-wider">
                              <th className="p-3.5 border-r border-border/60 w-[12%] text-left sticky left-0 z-20 bg-slate-900 dark:bg-[#0b0f19] shadow-[2px_0_5px_rgba(0,0,0,0.2)]">Period & Time</th>
                              <th className="p-3.5 border-r border-border/60 text-center w-[17.6%]">Monday</th>
                              <th className="p-3.5 border-r border-border/60 text-center w-[17.6%]">Tuesday</th>
                              <th className="p-3.5 border-r border-border/60 text-center w-[17.6%]">Wednesday</th>
                              <th className="p-3.5 border-r border-border/60 text-center w-[17.6%]">Thursday</th>
                              <th className="p-3.5 text-center w-[17.6%]">Friday</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60 text-foreground/85">
                            {Array.from({ length: 6 }).map((_, pIdx) => {
                              const periodNum = pIdx + 1;
                              const timeRange = 
                                periodNum === 1 ? '08:30 - 09:15' :
                                periodNum === 2 ? '09:15 - 10:00' :
                                periodNum === 3 ? '10:00 - 10:45' :
                                periodNum === 4 ? '11:15 - 12:00' :
                                periodNum === 5 ? '12:00 - 12:45' : '12:45 - 01:30';
                              
                              return (
                                <tr key={pIdx} className="hover:bg-muted/5">
                                  <td className="p-3 border-r border-border/60 font-bold sticky left-0 z-10 bg-slate-900 dark:bg-[#0b0f19] shadow-[2px_0_5px_rgba(0,0,0,0.2)] text-left pl-4">
                                    <div className="text-foreground font-black text-xs">Period {periodNum}</div>
                                    <div className="text-[9px] font-mono text-foreground/50 mt-0.5">{timeRange}</div>
                                  </td>
                                  
                                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, dIdx) => {
                                    const daySchedule = WEEKLY_SCHEDULE_DATA[day] || [];
                                    const classItem = daySchedule.find(p => p.id === periodNum) || { subject: 'Free Study', teacher: '-', room: '-' };
                                    const subjectColor = getSubjectColor(classItem.subject);
                                    return (
                                      <td key={dIdx} className="p-2.5 border-r border-border/60 text-center align-middle">
                                        <div className={`p-2 rounded-xl border-2 ${subjectColor.bg} ${subjectColor.border} text-center flex flex-col justify-between items-center h-[90px] w-full max-w-[115px] mx-auto hover:scale-[1.03] hover:shadow-md transition-all duration-300 cursor-pointer shadow-sm`}>
                                          <div className="w-full flex-1 flex items-center justify-center">
                                            <span className={`block font-black text-[11px] leading-tight tracking-tight uppercase ${subjectColor.text} break-words line-clamp-2`}>
                                              {classItem.subject}
                                            </span>
                                          </div>
                                          <div className="w-full mt-1 border-t border-slate-200/80 dark:border-slate-700/80 pt-1">
                                            <span className="block text-[9px] font-extrabold text-slate-800 dark:text-slate-200 truncate">
                                              {classItem.teacher}
                                            </span>
                                            <span className="block text-[8px] font-bold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                              Rm: {classItem.room}
                                            </span>
                                          </div>
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Download / Roster Actions */}
                  <div className="flex justify-end gap-2.5 pt-2">
                    <button 
                      type="button"
                      onClick={() => handlePrintPdf('timetable')} 
                      className="px-5 py-2.5 bg-card hover:bg-muted border border-border text-foreground font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      📥 Export Timetable (PDF)
                    </button>
                    {isEditor && (
                      <button 
                        type="button"
                        onClick={() => alert("Redirecting to AI Timetable Optimization engine...")} 
                        className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                      >
                        ⚡ Optimize Roster (AI)
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ASSIGNMENTS & HOMEWORK VIEW */}
              {['Homework tasks', 'Assignments', 'Homework Board', 'Homework Management', 'Assignments Entry'].includes(activeFeature || '') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📝 View active homework/assignments, download resources, and upload your coursework.
                  </div>

                  <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Active Assignments & Homework</span>
                    
                    {/* Dynamic Assignments List */}
                    <div className="space-y-3">
                      {assignments.filter(a => !(['student', 'parent'].includes(simulatedRole)) || a.publishDate <= '2026-06-08').length === 0 ? (
                        <p className="text-xs text-foreground/60 text-center py-4">No assignments published yet.</p>
                      ) : (
                        assignments
                          .filter(a => !(['student', 'parent'].includes(simulatedRole)) || a.publishDate <= '2026-06-08')
                          .map((ass) => {
                             const isCompleted = completedAssignments.includes(ass.id);
                             const isDueSoon = ass.dueDate === '2026-06-09' && !isCompleted;
                             let fileIcon = "📄";
                             if (ass.fileType === 'pdf') fileIcon = "📕";
                             if (ass.fileType === 'word') fileIcon = "📘";
                             if (ass.fileType === 'powerpoint') fileIcon = "📙";

                             return (
                               <div key={ass.id} className={`p-3 bg-card border rounded-xl flex flex-col gap-2 relative transition-all duration-300 ${
                                 isCompleted ? 'border-emerald-500/40 bg-emerald-500/5 opacity-85' :
                                 isDueSoon ? 'border-red-500/50 bg-red-500/5 shadow-md shadow-red-500/5' :
                                 'border-border'
                               }`}>
                                 <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                     <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                       ass.subject === 'Physics' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                       ass.subject === 'Chemistry' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                       ass.subject === 'Mathematics' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                       ass.subject === 'English' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                       'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                                     }`}>
                                       {ass.subject}
                                     </span>
                                     {isCompleted && (
                                       <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold uppercase tracking-wider">
                                         ✓ Submitted
                                       </span>
                                     )}
                                   </div>
                                   <span className="text-[10px] text-foreground/65 font-medium">
                                     Due: {ass.dueDate}
                                   </span>
                                 </div>

                                 <div className="text-xs font-bold text-foreground">
                                   {ass.title}
                                 </div>

                                 <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg border border-border text-[10px]">
                                   <div className="flex items-center gap-2 flex-wrap">
                                      <a 
                                        href={ass.fileUrl || `data:text/plain;charset=utf-8,Content%20for%20${encodeURIComponent(ass.title)}`} 
                                        download={ass.fileName || 'assignment-notes.pdf'}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-primary hover:underline font-bold flex items-center gap-1"
                                      >
                                        <span>{fileIcon}</span> View / Download
                                      </a>
                                      {canUserEditSection('assignments') && (
                                        <div className="flex items-center gap-2 border-l border-border/80 pl-2.5 ml-1">
                                          <button 
                                            onClick={() => {
                                              requestSecurityVerification(
                                                `Rename assignment from "${ass.title}"`,
                                                (newVal: string) => {
                                                  setAssignments(prev => prev.map(a => a.id === ass.id ? { ...a, title: newVal } : a));
                                                },
                                                'rename',
                                                { title: ass.title }
                                              );
                                            }}
                                            className="text-amber-500 hover:text-amber-600 hover:underline font-bold"
                                            title="Edit Title"
                                          >
                                            Edit Title
                                          </button>
                                          {ass.fileName ? (
                                            <button 
                                              onClick={() => {
                                                requestSecurityVerification(`Delete/detach file attachment "${ass.fileName}" from assignment "${ass.title}"`, () => {
                                                  setAssignments(prev => prev.map(a => a.id === ass.id ? { ...a, fileName: '', fileUrl: '' } : a));
                                                });
                                              }}
                                              className="text-red-400 hover:text-red-500 hover:underline font-bold"
                                              title="Delete File Attachment"
                                            >
                                              Delete File
                                            </button>
                                          ) : (
                                            <button 
                                              onClick={() => {
                                                requestSecurityVerification(
                                                  `Attach file to assignment "${ass.title}"`,
                                                  (data: { url: string; name: string }) => {
                                                    setAssignments(prev => prev.map(a => a.id === ass.id ? { ...a, fileName: data.name, fileUrl: data.url, fileType: data.name.endsWith('.pdf') ? 'pdf' : 'word' } : a));
                                                  },
                                                  'attach'
                                                );
                                              }}
                                              className="text-emerald-500 hover:text-emerald-600 hover:underline font-bold"
                                              title="Attach File"
                                            >
                                              Attach File
                                            </button>
                                          )}
                                          <button 
                                            onClick={() => {
                                              requestSecurityVerification(`Completely delete the assignment "${ass.title}" from the active database registry`, () => {
                                                setAssignments(prev => prev.filter(a => a.id !== ass.id));
                                              });
                                            }}
                                            className="text-red-600 hover:text-red-700 hover:underline font-extrabold"
                                            title="Delete Assignment"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                   <div className="flex gap-2">
                                     {simulatedRole === 'student' && !isCompleted && (
                                       <button 
                                         onClick={() => {
                                           requestSecurityVerification(
                                             `Submit completed work for "${ass.title}"`,
                                             (file: string) => {
                                               setCompletedAssignments(prev => [...prev, ass.id]);
                                               alert(`Successfully submitted ${file} for assignment: "${ass.title}"!`);
                                             },
                                             'submit'
                                           );
                                         }}
                                         className="text-emerald-400 hover:underline font-bold"
                                        >
                                          Submit
                                       </button>
                                     )}
                                   </div>
                                 </div>
                                 <div className="text-[9px] text-foreground/50">
                                   <span>Published: {ass.publishDate}</span>
                                 </div>
                               </div>
                             );
                          })
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STUDY MATERIAL VIEW */}
              {['Study Material', 'Syllabus Progress', 'Syllabus Index', 'Study courses'].includes(activeFeature || '') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📚 Course syllabus guidelines, lesson plans, study materials, and reference books.
                  </div>

                  {/* Syllabus completion graph bar */}
                  <div className="p-4 bg-muted/25 border border-border rounded-xl space-y-2 text-xs">
                    <span className="block font-bold text-foreground/80 uppercase tracking-wider">Syllabus Completion Index</span>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between font-semibold mb-1"><span>Class 10 Physics</span><span>82% Complete</span></div>
                        <div className="h-2 w-full bg-border rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{ width: '82%' }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between font-semibold mb-1"><span>Class 10 Chemistry</span><span>74% Complete</span></div>
                        <div className="h-2 w-full bg-border rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: '74%' }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between font-semibold mb-1"><span>Class 10 Mathematics</span><span>89% Complete</span></div>
                        <div className="h-2 w-full bg-border rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: '89%' }}></div></div>
                      </div>
                    </div>
                  </div>

                  {/* Lesson Plans & Course Material */}
                  <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Lesson Plans & Course Materials</span>
                    
                    {[
                      { title: "Class 10 Physics - Electrostatics Guide", file: "electrostatics_guide.pdf", size: "2.4 MB" },
                      { title: "Class 10 Chemistry - Organic Compounds Syllabus", file: "organic_compounds_syllabus.pdf", size: "1.8 MB" },
                      { title: "Class 10 Mathematics - Calculus Basics Note", file: "calculus_basics.pdf", size: "3.1 MB" }
                    ].map((material, idx) => (
                      <div key={idx} className="p-3 bg-card border border-border rounded-lg flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📕</span>
                          <div>
                            <span className="font-bold block text-foreground">{material.title}</span>
                            <span className="text-[10px] text-foreground/60">Size: {material.size}</span>
                          </div>
                        </div>
                        <a 
                          href={`data:text/plain;charset=utf-8,Study%20material%20content%20for%20${encodeURIComponent(material.title)}`}
                          download={material.file}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline font-bold text-[10px]"
                        >
                          View / Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RECORDED LECTURES VIEW */}
              {['Recorded Lectures'].includes(activeFeature || '') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    🎥 Play and review previous recorded classroom sessions and lecture video streams.
                  </div>

                  {activeVideoStreamUrl && (
                    <div className="p-4 bg-muted/25 border border-border rounded-xl space-y-3">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Active Stream Player</span>
                      <div className="aspect-video w-full rounded-lg overflow-hidden border border-border bg-black relative">
                        <video 
                          src={activeVideoStreamUrl} 
                          controls 
                          autoPlay 
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button 
                          onClick={() => setActiveVideoStreamUrl(null)} 
                          className="px-3 py-1 bg-red-500 hover:bg-red-650 text-white rounded-lg font-bold text-[10px]"
                        >
                          Close Player
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Recorded Class Playlist</span>
                    
                    {[
                      { title: "Chapter 4: Electrostatics Lecture Video", info: "Duration: 45 mins • Physics Class 10-A", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
                      { title: "Chapter 2: Chemical Bonds Fundamentals", info: "Duration: 50 mins • Chemistry Class 10-A", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
                      { title: "Chapter 1: Limits & Differentiation Intro", info: "Duration: 40 mins • Mathematics Class 10-A", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" }
                    ].map((lecture, idx) => (
                      <div key={idx} className="p-3 bg-card border border-border rounded-lg flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🎥</span>
                          <div>
                            <span className="font-bold block text-foreground">{lecture.title}</span>
                            <span className="text-[10px] text-foreground/60">{lecture.info}</span>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setActiveVideoStreamUrl(lecture.url)} 
                          className="text-primary font-bold hover:underline text-[10px]"
                        >
                          Watch Stream
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STUDENT CONDUCT RECORDS */}
              {(activeFeature === 'Student Conduct Records' || activeFeature === 'Discipline Tracking' || activeFeature === 'Discipline Management') && (
                <div className="space-y-4">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    ⚖️ Log student behavior reports, warnings, or notifications sent to parents.
                  </div>
                  {/* Log New Infraction */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newDisciplineInfraction) return;
                      setDisciplines(prev => [
                        ...prev,
                        {
                          id: `d-${Date.now()}`,
                          name: newDisciplineStudent,
                          date: new Date().toISOString().split('T')[0],
                          infraction: newDisciplineInfraction,
                          action: newDisciplineAction
                        }
                      ]);
                      setNewDisciplineInfraction('');
                    }}
                    className="p-4 bg-muted/30 border border-border rounded-xl space-y-3"
                  >
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Log Student Conduct Incident</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <select 
                        value={newDisciplineStudent}
                        onChange={(e) => setNewDisciplineStudent(e.target.value)}
                        className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold"
                      >
                        {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                      <input 
                        type="text" 
                        required 
                        placeholder="Incident Details (e.g. Late Arrival)"
                        value={newDisciplineInfraction}
                        onChange={(e) => setNewDisciplineInfraction(e.target.value)}
                        className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                      />
                      <select
                        value={newDisciplineAction}
                        onChange={(e) => setNewDisciplineAction(e.target.value)}
                        className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold"
                      >
                        <option value="Warning Issued">Warning Issued</option>
                        <option value="Parent Notified">Parent Notified</option>
                        <option value="Suspension Recommended">Suspension Recommended</option>
                      </select>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                        + Add Behavior Report
                      </button>
                    </div>
                  </form>

                  {/* Incident List */}
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Conduct Log Entries</span>
                    {disciplines.map((d) => (
                      <div key={d.id} className="p-3 bg-card border border-border rounded-xl flex items-center justify-between">
                        <div>
                          <strong className="block text-sm text-foreground">{d.name}</strong>
                          <span className="text-xs text-foreground/60">{d.infraction} | Action: {d.action}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{d.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PARENT COMMUNICATIONS */}
              {(activeFeature === 'Parent Communications' || activeFeature === 'Parent Communication' || activeFeature === 'Teacher Communication') && (
                <div className="space-y-4">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed flex items-center justify-between">
                    <span>💬 Read incoming parent queries, respond to requests, or broadcast notifications.</span>
                  </div>

                  {/* Send Announcement Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newParentMessageSubject || !newParentMessageText) return;
                      
                      const form = e.target as HTMLFormElement;
                      const deliveryChannel = (form.elements.namedItem('deliveryChannel') as HTMLSelectElement).value;
                      const parentLabel = simulatedRole === 'parent' 
                        ? `Parent of Kamran Shah (${currentUser?.name || 'M. Shah'})` 
                        : `Broadcast (re: ${newParentMessageStudent})`;
                      
                      const finalStatus = simulatedRole === 'parent'
                        ? 'Sent to Tutors'
                        : 'Dispatched Successfully';

                      setParentMessages(prev => [
                        {
                          id: `pm-${Date.now()}`,
                          parent: parentLabel,
                          date: new Date().toISOString().split('T')[0],
                          subject: newParentMessageSubject,
                          message: newParentMessageText,
                          image: newParentMessageImage,
                          channel: deliveryChannel,
                          status: finalStatus
                        },
                        ...prev
                      ]);

                      alert(simulatedRole === 'parent'
                        ? `Message successfully sent to school tutors via ${deliveryChannel}!`
                        : `Broadcast message successfully sent to parent directory via ${deliveryChannel}!`
                      );

                      setNewParentMessageSubject('');
                      setNewParentMessageText('');
                      setNewParentMessageImage(null);
                    }}
                    className="p-4 bg-muted/30 border border-border rounded-xl space-y-3"
                  >
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">
                      {simulatedRole === 'parent' ? 'Send message to Tutors / School' : 'Send message to parents'}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <select 
                        value={newParentMessageStudent}
                        onChange={(e) => setNewParentMessageStudent(e.target.value)}
                        className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold"
                      >
                        {simulatedRole === 'parent' ? (
                          <>
                            <option value="Class Tutors">Class Tutors (Mrs. Hina, Mr. Raza)</option>
                            <option value="School Administration">School Administration Desk</option>
                          </>
                        ) : (
                          students.map(s => <option key={s.id} value={s.name}>Parent of {s.name}</option>)
                        )}
                      </select>
                      <input 
                        type="text" 
                        required 
                        placeholder="Subject"
                        value={newParentMessageSubject}
                        onChange={(e) => setNewParentMessageSubject(e.target.value)}
                        className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                      />
                      <select 
                        name="deliveryChannel"
                        className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold"
                      >
                        <option value="App Inbox">App Inbox</option>
                        <option value="SMS Text Message">SMS Text Message</option>
                        <option value="Email">Email</option>
                      </select>
                    </div>
                    <textarea 
                      required 
                      rows={2}
                      placeholder="Message content..."
                      value={newParentMessageText}
                      onChange={(e) => setNewParentMessageText(e.target.value)}
                      className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                    />
                    
                    {/* Dynamic Image / Circular Attachment Input */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-bold text-foreground/75">Attach Image / School Circular (Optional)</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="parent-msg-image-upload" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                setNewParentMessageImage(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <button 
                          type="button" 
                          onClick={() => document.getElementById('parent-msg-image-upload')?.click()}
                          className="bg-card hover:bg-muted border border-border px-3 py-1.5 rounded-lg text-[10px] font-bold text-foreground/80 transition-all shadow-sm"
                        >
                          📷 {newParentMessageImage ? 'Change Image' : 'Choose Image File'}
                        </button>
                        {newParentMessageImage && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-emerald-400 font-bold">✓ Image Selected</span>
                            <button 
                              type="button" 
                              onClick={() => setNewParentMessageImage(null)}
                              className="text-foreground/50 hover:text-red-400 text-xs font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                      {newParentMessageImage && (
                        <div className="mt-1.5 max-w-[120px] rounded-lg overflow-hidden border border-border shadow-sm">
                          <img src={newParentMessageImage} alt="Attachment Preview" className="h-16 w-auto object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                        ✉️ Send Message
                      </button>
                    </div>
                  </form>

                  {/* Messages Feed */}
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Communications History</span>
                    {parentMessages.map((m: any) => (
                      <div key={m.id} className="p-3 bg-card border border-border rounded-xl space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-xs text-foreground block font-bold">{m.parent}</strong>
                            <span className="text-[10px] text-primary font-semibold font-mono">{m.subject}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{m.date}</span>
                        </div>
                        <p className="text-xs text-foreground/70 leading-relaxed font-medium">{m.message}</p>
                        {m.image && (
                          <div className="mt-2 rounded-lg overflow-hidden border border-border max-w-[180px] shadow-sm">
                            <img src={m.image} alt="Message Circular Attachment" className="w-full h-auto object-contain" />
                          </div>
                        )}
                        
                        {/* Status delivery pipeline indicator */}
                        <div className="flex items-center justify-between text-[9px] font-bold border-t border-border/45 pt-1.5 mt-1 text-foreground/60">
                          <span className="flex items-center gap-1">
                            <span>Channel:</span>
                            <span className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground/80 font-mono">
                              {m.channel || 'Direct Incoming Query'}
                            </span>
                          </span>
                          <span className="flex items-center gap-1 text-emerald-400">
                            <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                            <span>{m.status || 'Active Enquiry'}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* SaaS Admin, Organization & Brand Settings */}
              {['Country Management', 'Organization Management', 'School Management', 'Subscription Plans', 'Revenue Analytics', 'White Label Configuration', 'Support Tickets', 'Audit Logs', 'Global Announcements'].includes(activeFeature || '') && (
                <div className="space-y-6">
                  {/* 1. Country Management */}
                  {activeFeature === 'Country Management' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        🌍 Localize your enterprise network by registering new operational countries, setting currency rules, and adjusting regional tax contexts.
                      </div>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!newCountryCode || !newCountryName) return;
                        setCountries(prev => [...prev, { id: Date.now().toString(), code: newCountryCode.toUpperCase(), name: newCountryName, currency: newCountryCurrency, status: 'Active' }]);
                        setNewCountryCode('');
                        setNewCountryName('');
                        alert(`Country ${newCountryName} successfully registered!`);
                      }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3.5">
                        <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Register New Country</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input value={newCountryName} onChange={(e) => setNewCountryName(e.target.value)} type="text" placeholder="Country Name (e.g. Canada)" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                          <input value={newCountryCode} onChange={(e) => setNewCountryCode(e.target.value)} type="text" placeholder="ISO Code (e.g. CA)" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" maxLength={3} required />
                          <select value={newCountryCurrency} onChange={(e) => setNewCountryCurrency(e.target.value)} className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold">
                            <option value="USD">USD ($)</option>
                            <option value="PKR">PKR (Rs)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="AED">AED (Dh)</option>
                            <option value="CAD">CAD ($)</option>
                          </select>
                        </div>
                        <div className="flex justify-center">
                          <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                            Add Country Registry
                          </button>
                        </div>
                      </form>

                      <div className="border border-border rounded-xl overflow-hidden bg-muted/10 p-3">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">Registered Countries</span>
                        <div className="flex flex-wrap justify-center gap-3">
                          {countries.map(c => (
                            <div key={c.id} className="p-3 bg-card border border-border rounded-lg flex items-center justify-between text-xs w-full sm:w-[calc(50%-6px)] lg:w-[calc(33.33%-8px)]">
                              <div>
                                <span className="font-bold block text-foreground">{c.name} ({c.code})</span>
                                <span className="text-[10px] text-foreground/60">Currency: {c.currency}</span>
                              </div>
                              <button 
                                onClick={() => {
                                  setCountries(prev => prev.map(item => item.id === c.id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item));
                                }}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold ${c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                              >
                                {c.status}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Organization Management */}
                  {activeFeature === 'Organization Management' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        🏢 Configure school chains, educational franchises, and corporate headquarters. Each organization holds isolated campuses under its billing wing.
                      </div>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!newOrgName || !newOrgOwner) return;
                        setOrganizations(prev => [...prev, { id: Date.now().toString(), name: newOrgName, owner: newOrgOwner, branches: parseInt(newOrgBranches) || 1, status: 'Active' }]);
                        setNewOrgName('');
                        setNewOrgOwner('');
                        setNewOrgBranches('1');
                        alert(`Organization ${newOrgName} has been registered!`);
                      }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3.5">
                        <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Add School Chain / Organization</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)} type="text" placeholder="Organization Name" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                          <input value={newOrgOwner} onChange={(e) => setNewOrgOwner(e.target.value)} type="text" placeholder="Owner / Director" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                          <input value={newOrgBranches} onChange={(e) => setNewOrgBranches(e.target.value)} type="number" min={1} placeholder="Active Branches count" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                        </div>
                        <div className="flex justify-center">
                          <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                            Add Organization
                          </button>
                        </div>
                      </form>

                      <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-3">Organization Chain</th>
                              <th className="p-3">Director</th>
                              <th className="p-3 text-center">Branches</th>
                              <th className="p-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            {organizations.map(org => (
                              <tr key={org.id} className="hover:bg-muted/10">
                                <td className="p-3 font-bold">{org.name}</td>
                                <td className="p-3">{org.owner}</td>
                                <td className="p-3 text-center font-bold text-primary">{org.branches}</td>
                                <td className="p-3 text-right">
                                  <button 
                                    onClick={() => {
                                      setOrganizations(prev => prev.map(item => item.id === org.id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item));
                                    }}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${org.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                                  >
                                    {org.status}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 3. School Management */}
                  {activeFeature === 'School Management' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        🏫 Provision and launch new school campuses. Register distinct subdomains to partition database rows natively via RLS context.
                      </div>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!newSchoolName || !newSchoolSubdomain) return;
                        setSchoolsList(prev => [...prev, { id: Date.now().toString(), name: newSchoolName, subdomain: newSchoolSubdomain.toLowerCase(), status: 'Active' }]);
                        setNewSchoolName('');
                        setNewSchoolSubdomain('');
                        alert(`School Campus ${newSchoolName} successfully created!`);
                      }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3.5">
                        <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Provision New School Campus</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input value={newSchoolName} onChange={(e) => setNewSchoolName(e.target.value)} type="text" placeholder="School Name (e.g. Allied School Campus A)" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                          <div className="flex items-center gap-1 bg-card border border-border rounded-lg px-2">
                            <input value={newSchoolSubdomain} onChange={(e) => setNewSchoolSubdomain(e.target.value)} type="text" placeholder="subdomain" className="bg-transparent text-xs py-2 w-full text-foreground outline-none" required />
                            <span className="text-[10px] text-foreground/50 font-semibold">.academichub.com</span>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                            Provision Campus Subdomain
                          </button>
                        </div>
                      </form>

                      <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-3">Campus Branch</th>
                              <th className="p-3">Access Domain</th>
                              <th className="p-3 text-right">RLS Tenant Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            {schoolsList.map(sch => (
                              <tr key={sch.id} className="hover:bg-muted/10">
                                <td className="p-3 font-bold">{sch.name}</td>
                                <td className="p-3 text-primary font-semibold">{sch.subdomain}.academichub.com</td>
                                <td className="p-3 text-right">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Isolated RLS
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 4. Subscription Plans */}
                  {activeFeature === 'Subscription Plans' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        💳 Manage licensing models and recurring software subscriptions for different school chains.
                      </div>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!newPlanName || !newPlanPrice) return;
                        setSubscriptionPlans(prev => [...prev, { id: Date.now().toString(), name: newPlanName, price: parseFloat(newPlanPrice) || 0, billing: newPlanBilling, subscribers: 0 }]);
                        setNewPlanName('');
                        setNewPlanPrice('');
                        alert(`Subscription plan ${newPlanName} has been configured!`);
                      }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3.5">
                        <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Configure SaaS Pricing Plan</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input value={newPlanName} onChange={(e) => setNewPlanName(e.target.value)} type="text" placeholder="Plan Title" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                          <input value={newPlanPrice} onChange={(e) => setNewPlanPrice(e.target.value)} type="number" placeholder="Price (USD)" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                          <select value={newPlanBilling} onChange={(e) => setNewPlanBilling(e.target.value)} className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold">
                            <option value="Monthly">Monthly Billing</option>
                            <option value="Annually">Annually Billing</option>
                          </select>
                        </div>
                        <div className="flex justify-center">
                          <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                            Save Pricing Tier
                          </button>
                        </div>
                      </form>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {subscriptionPlans.map(plan => (
                          <div key={plan.id} className="p-4 bg-card border border-border rounded-2xl flex flex-col justify-between items-center text-center space-y-3 shadow-md hover:border-primary/50 transition-all duration-300">
                            <span className="font-black text-foreground text-sm uppercase tracking-wide">{plan.name}</span>
                            <div>
                              <span className="text-3xl font-extrabold text-foreground">${plan.price}</span>
                              <span className="text-[10px] text-foreground/50 block">/ {plan.billing}</span>
                            </div>
                            <div className="w-full text-xs text-foreground/70 border-t border-border/60 pt-2 space-y-1">
                              <span className="block">✓ Tenant Isolated Database</span>
                              <span className="block">✓ Row-level security (RLS)</span>
                              <span className="block font-bold text-primary">{plan.subscribers} Active Schools</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. Revenue Analytics */}
                  {activeFeature === 'Revenue Analytics' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        📈 Consolidated Group financial indicators, net profitability margins, and software subscriber growth metrics.
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1 shadow-lg">
                          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Consolidated Inflow</span>
                          <span className="text-2xl font-black text-white">$12,450 / mo</span>
                          <span className="text-[10px] text-emerald-400 block font-semibold">+18.4% growth</span>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1 shadow-lg">
                          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Group Cashflow Outflow</span>
                          <span className="text-2xl font-black text-white">$8,520 / mo</span>
                          <span className="text-[10px] text-slate-500 block">Server & API nodes cost</span>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1 shadow-lg">
                          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Net Profit Margin</span>
                          <span className="text-2xl font-black text-emerald-400">31.5%</span>
                          <span className="text-[10px] text-slate-400 block">Audit Status: Safe</span>
                        </div>
                      </div>

                      {/* Mock Chart Area */}
                      <div className="p-5 bg-card border border-border rounded-2xl space-y-3">
                        <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider text-center">Monthly Software Subscriptions Revenue (USD)</span>
                        <div className="flex items-end justify-between h-32 pt-6 px-4">
                          {[
                            { label: 'Jan', val: '$8K', height: '65%' },
                            { label: 'Feb', val: '$9K', height: '70%' },
                            { label: 'Mar', val: '$10K', height: '78%' },
                            { label: 'Apr', val: '$11K', height: '85%' },
                            { label: 'May', val: '$12K', height: '95%' }
                          ].map((bar, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 w-12">
                              <span className="text-[9px] font-bold text-foreground/50">{bar.val}</span>
                              <div className="w-6 bg-gradient-to-t from-primary/30 to-primary rounded-t-lg shadow" style={{ height: bar.height }}></div>
                              <span className="text-[9px] text-foreground/60 font-semibold">{bar.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <button onClick={() => handlePrintPdf('revenue_audit')} className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                          📥 Download Consolidated Revenue Audit Statement (PDF)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 6. White Label Configuration */}
                  {activeFeature === 'White Label Configuration' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        🔧 Establish custom domain pointers, configure default branding colors, and verify DNS records.
                      </div>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        setWhiteLabelConfig(prev => ({ ...prev, customDomain: dnsInput }));
                        alert('Custom DNS target configurations saved! DNS is currently propagation-testing.');
                      }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-4">
                        <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">White-Label DNS Pointer & Theme settings</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-foreground/60 font-bold uppercase block">Custom Domain Pointer</label>
                            <input value={dnsInput} onChange={(e) => setDnsInput(e.target.value)} type="text" placeholder="portal.yourschool.com" className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-foreground/60 font-bold uppercase block">Primary HSL Custom Color</label>
                            <select 
                              value={whiteLabelConfig.primaryColor}
                              onChange={(e) => setWhiteLabelConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                              className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold"
                            >
                              <option value="#6d28d9">Modern Purple (#6d28d9)</option>
                              <option value="#10b981">Emerald Green (#10b981)</option>
                              <option value="#3b82f6">Ocean Blue (#3b82f6)</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                            Verify DNS & Save Branding
                          </button>
                        </div>
                      </form>

                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-slate-200">
                        <span className="block text-xs font-black text-primary uppercase tracking-widest text-center">DNS Status Logs</span>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between border-b border-slate-800 pb-2">
                            <span>CNAME Target</span>
                            <span className="font-mono text-slate-400">cname.academichub.com</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-800 pb-2">
                            <span>Propagation Status</span>
                            <span className="font-bold text-emerald-400">{whiteLabelConfig.dnsStatus}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Active Domain</span>
                            <span className="font-mono text-primary font-bold">{whiteLabelConfig.customDomain}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 7. Support Tickets */}
                  {activeFeature === 'Support Tickets' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        💬 Review and address technical support query tickets opened by school administrators.
                      </div>

                      {replyTicketId && (
                        <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Reply to Ticket {replyTicketId}</span>
                          <textarea 
                            value={replyText} 
                            onChange={(e) => setReplyText(e.target.value)} 
                            placeholder="Type resolution notes here..." 
                            className="w-full h-20 bg-card border border-border rounded-lg text-xs p-2 text-foreground outline-none focus:ring-1 focus:ring-primary"
                          />
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setReplyTicketId(null)} 
                              className="px-4 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-bold text-xs border border-border"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => {
                                if (!replyText) return;
                                setSupportTickets(prev => prev.map(t => t.id === replyTicketId ? { ...t, status: 'Resolved' } : t));
                                setReplyTicketId(null);
                                setReplyText('');
                                alert('Reply submitted and ticket marked as Resolved!');
                              }} 
                              className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-xs shadow-md"
                            >
                              Send Reply Resolution
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-3">Ticket ID</th>
                              <th className="p-3">Sender</th>
                              <th className="p-3">Subject</th>
                              <th className="p-3 text-center">Priority</th>
                              <th className="p-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            {supportTickets.map(ticket => (
                              <tr key={ticket.id} className="hover:bg-muted/10">
                                <td className="p-3 font-mono font-bold text-primary">{ticket.id}</td>
                                <td className="p-3">{ticket.sender}</td>
                                <td className="p-3 font-semibold">{ticket.subject}</td>
                                <td className="p-3 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                    ticket.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                    ticket.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                  }`}>
                                    {ticket.priority}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  {ticket.status === 'Open' ? (
                                    <button 
                                      onClick={() => setReplyTicketId(ticket.id)}
                                      className="px-3 py-1 bg-primary text-white font-bold text-[10px] rounded hover:bg-primary/90"
                                    >
                                      Reply Resolution
                                    </button>
                                  ) : (
                                    <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                                      Resolved
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 8. Audit Logs */}
                  {activeFeature === 'Audit Logs' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        🛡️ Real-time system log stream recording structural RLS schema activities and administrative operations.
                      </div>
                      
                      <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-3">Timestamp (UTC)</th>
                              <th className="p-3">Operator</th>
                              <th className="p-3">Administrative Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            {auditLogs.map(log => (
                              <tr key={log.id} className="hover:bg-muted/10 font-mono text-[11px]">
                                <td className="p-3 text-foreground/50">{log.timestamp}</td>
                                <td className="p-3 font-bold text-primary">{log.user}</td>
                                <td className="p-3 text-foreground/80">{log.action}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 9. Global Announcements */}
                  {activeFeature === 'Global Announcements' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        📣 Broadcast global alert banners, notices, and system alerts to all active campus instances.
                      </div>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!newAnnounceTitle || !newAnnounceContent) return;
                        setGlobalAnnouncements(prev => [
                          { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], title: newAnnounceTitle, content: newAnnounceContent },
                          ...prev
                        ]);
                        setNewAnnounceTitle('');
                        setNewAnnounceContent('');
                        alert('Global notice announcement broadcasted successfully!');
                      }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3.5">
                        <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Create Global Broadcast Alert</span>
                        <div className="space-y-3">
                          <input value={newAnnounceTitle} onChange={(e) => setNewAnnounceTitle(e.target.value)} type="text" placeholder="Notice Headline (e.g. Server Maintenance Window)" className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                          <textarea value={newAnnounceContent} onChange={(e) => setNewAnnounceContent(e.target.value)} placeholder="Notice description content details..." className="w-full h-20 bg-card border border-border rounded-lg text-xs p-2.5 text-foreground outline-none" required />
                        </div>
                        <div className="flex justify-center">
                          <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                            Broadcast Notice Bulletins
                          </button>
                        </div>
                      </form>

                      <div className="space-y-3">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Active Broadcast Archives</span>
                        {globalAnnouncements.map(ann => (
                          <div key={ann.id} className="p-4 bg-card border border-border rounded-xl space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-extrabold text-foreground">{ann.title}</span>
                              <span className="text-[10px] text-foreground/50">{ann.date}</span>
                            </div>
                            <p className="text-xs text-foreground/60 leading-relaxed">{ann.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Admissions & Lead CRM */}
              {['Lead Management', 'Inquiry Tracking', 'Admission Applications', 'Interview Scheduling', 'Test Scheduling', 'Follow-ups', 'Enrollment Tracking', 'Admission Guidance', 'Inquiry Handling', 'School Overview Analytics'].includes(activeFeature) && (
                <div className="space-y-4">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📞 School Admissions, conversion statistics, and at-a-glance dashboard metrics.
                  </div>

                  {/* Your School at a Glance Widget */}
                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl text-slate-200">
                    <span className="block text-xs font-black text-primary uppercase tracking-widest text-center">Your School at a Glance</span>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-xl">🎓</span>
                        <strong className="block text-lg text-white font-bold">150</strong>
                        <span className="text-[9px] text-slate-500 uppercase font-semibold">Students</span>
                      </div>
                      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-xl">👩‍🏫</span>
                        <strong className="block text-lg text-white font-bold">11</strong>
                        <span className="text-[9px] text-slate-500 uppercase font-semibold">Teachers</span>
                      </div>
                      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 flex flex-col items-center justify-center">
                        <div className="w-9 h-9 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center text-[10px] font-black text-white">
                          94%
                        </div>
                        <span className="text-[9px] text-slate-500 uppercase font-semibold">Attendance</span>
                      </div>
                      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-xl">💰</span>
                        <strong className="block text-base text-white font-mono font-bold">PKR 1M</strong>
                        <span className="text-[9px] text-slate-500 uppercase font-semibold">Fees Collected</span>
                      </div>
                    </div>

                    {/* Attendance by Class vertical bar chart */}
                    <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Attendance by Class</span>
                      <div className="flex items-end justify-between h-28 pt-4 px-4">
                        {[
                          { label: 'Class 1', pct: '96%', height: '96%' },
                          { label: 'Class 2', pct: '91%', height: '91%' },
                          { label: 'Class 3', pct: '88%', height: '88%' },
                          { label: 'Class 4', pct: '94%', height: '94%' },
                          { label: 'Class 5', pct: '97%', height: '97%' }
                        ].map((classBar, i) => (
                          <div key={i} className="flex flex-col items-center gap-1.5 w-10">
                            <span className="text-[9px] font-bold text-slate-400">{classBar.pct}</span>
                            <div className="w-4 bg-gradient-to-t from-primary/30 to-primary rounded-t-sm" style={{ height: classBar.height }}></div>
                            <span className="text-[9px] text-slate-500 font-semibold">{classBar.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); alert('Prospective lead added successfully!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Add New Admission Inquiry</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input type="text" placeholder="Parent Name" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                      <input type="text" placeholder="Child Grade (e.g. Grade 8)" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                      <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                        <option>Status: New Lead</option>
                        <option>Status: Test Scheduled</option>
                        <option>Status: Interview Pending</option>
                      </select>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                        + Add Inquiry
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Inquiries List</span>
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                          <th className="p-2">Applicant</th>
                          <th className="p-2">Grade</th>
                          <th className="p-2">Status</th>
                          <th className="p-2 text-right">Roster Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground/85">
                        <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Haris Khan</td><td className="p-2">Class 9</td><td className="p-2"><span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">Interview Pending</span></td><td className="p-2 text-right text-slate-500">2026-06-08</td></tr>
                        <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Mona Siddiqui</td><td className="p-2">Class 10</td><td className="p-2"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">Enrolled</span></td><td className="p-2 text-right text-slate-500">2026-06-05</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <button onClick={() => handlePrintPdf('leads_funnel')} className="w-full py-2 bg-muted hover:bg-muted/80 border border-border text-foreground text-xs font-bold rounded-lg transition-all shadow-md">
                    📥 Download CRM Leads Report (PDF)
                  </button>
                </div>
              )}

              {/* Finance, Expense & Accountant */}
              {['Expense Tracking', 'Financial Reports', 'Payroll Support'].includes(activeFeature) && (
                <div className="space-y-4">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    💳 Monitor fee collections and school expenditures.
                  </div>

                  {isEditor && (
                    <form onSubmit={(e) => { e.preventDefault(); alert('Expense payout logged!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Add School Expense</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input type="text" placeholder="Expense Category (e.g. Electricity, Water)" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                        <input type="number" placeholder="Expenditure Amount" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                        <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                          <option>Cash</option>
                          <option>Card Payment</option>
                          <option>Bank Transfer</option>
                        </select>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                          + Save Expense
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Expense Logs</span>
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                          <th className="p-2">Transaction ID</th>
                          <th className="p-2">Category</th>
                          <th className="p-2 text-right">Amount</th>
                          <th className="p-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground/85">
                        <tr className="hover:bg-muted/10"><td className="p-2 font-mono">TX-2026-908</td><td className="p-2">Internet DSL Fiber Line</td><td className="p-2 text-right font-semibold text-rose-400">- {formatCurrency(4800)}</td><td className="p-2 text-center"><span className="text-emerald-400 font-bold">Cleared</span></td></tr>
                        <tr className="hover:bg-muted/10"><td className="p-2 font-mono">TX-2026-907</td><td className="p-2">Monthly Building Rent</td><td className="p-2 text-right font-semibold text-rose-400">- {formatCurrency(35000)}</td><td className="p-2 text-center"><span className="text-emerald-400 font-bold">Cleared</span></td></tr>
                      </tbody>
                    </table>
                  </div>

                  <button onClick={() => handlePrintPdf('financial_statement')} className="w-full py-2 bg-muted hover:bg-muted/80 border border-border text-foreground text-xs font-bold rounded-lg transition-all shadow-md">
                    📥 Download Balance Statement (PDF)
                  </button>
                </div>
              )}

              {/* HR & Recruitment */}
              {['Employee Records', 'Recruitment', 'Performance Reviews', 'Payroll Coordination', 'Staff Lifecycle Directory'].includes(activeFeature) && (
                <div className="space-y-4">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    👤 HR Staff Lifecycle directory and payroll coordinator.
                  </div>                  {isEditor && (
                    <form onSubmit={(e) => { e.preventDefault(); alert('Staff profile created successfully!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Add New Staff</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input type="text" placeholder="Staff Name" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                        <input type="text" placeholder="Role (e.g. Teacher)" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                        <input type="number" placeholder="Monthly Salary" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                          + Add New Staff
                        </button>
                      </div>
                    </form>
                  )}
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Payroll Coordination Logs</span>
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                          <th className="p-2">Employee</th>
                          <th className="p-2">Role</th>
                          <th className="p-2 text-right">Payroll Base</th>
                          <th className="p-2 text-center">Bio-Check</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground/85">
                        <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Sarah Khan</td><td className="p-2">Senior Lecturer</td><td className="p-2 text-right">{formatCurrency(45000)}</td><td className="p-2 text-center text-emerald-400">98% Synced</td></tr>
                        <tr className="hover:bg-muted/10"><td className="p-2 font-bold">Raza Ahmed</td><td className="p-2">Physics Head</td><td className="p-2 text-right">{formatCurrency(48000)}</td><td className="p-2 text-center text-emerald-400">97% Synced</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* AI Education Copilot */}
              {['Student Risk Prediction', 'Dropout Prediction', 'Attendance Forecasting', 'Fee Recovery Prediction', 'Academic Forecasting', 'AI Report Generation', 'AI Timetable Suggestions', 'AI Financial Insights', 'AI Search Assistant', 'Natural Language Reporting'].includes(activeFeature || '') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/35 rounded-xl text-xs text-foreground/90 leading-relaxed relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
                    <span className="font-bold text-purple-400 block mb-1">🤖 AI Education Copilot Active</span>
                    Utilizing local predictive parameters to forecast student lifecycle risk, payment default risks, and academic trajectory.
                  </div>

                  {/* AI Prediction Tool Simulator */}
                  <div className="p-4 bg-card border border-border rounded-xl space-y-4">
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">AI Predictive Modeling Simulator</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/20 border border-border rounded-lg space-y-2">
                        <span className="text-[11px] font-bold text-foreground/70 block">Dropout Risk Prediction</span>
                        <div className="flex items-center justify-between text-xs">
                          <span>Kamran Shah</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">1.2% Risk (Safe)</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Zainab Ali</span>
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">24.5% Risk (Monitor)</span>
                        </div>
                      </div>

                      <div className="p-3 bg-muted/20 border border-border rounded-lg space-y-2">
                        <span className="text-[11px] font-bold text-foreground/70 block">Fee Recovery Forecast</span>
                        <div className="flex items-center justify-between text-xs">
                          <span>Estimated Outstanding:</span>
                          <strong className="text-amber-400 font-mono">{formatCurrency(189000)}</strong>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>AI Recovery Probability:</span>
                          <strong className="text-emerald-400">92.4% within 15 days</strong>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => alert("AI Report generated successfully and added to school records!")}
                      className="w-full py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg transition-all shadow-md"
                    >
                      ✨ Generate AI School Performance Report (PDF)
                    </button>
                  </div>
                </div>
              )}

              {/* Education CRM Campaigns */}
              {['WhatsApp Campaigns', 'Email Campaigns', 'Marketing Analytics'].includes(activeFeature || '') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📢 School Marketing. Coordinate announcements & trace enrollment conversions.
                  </div>

                  <form 
                    onSubmit={(e) => { 
                      e.preventDefault(); 
                      alert('Marketing Broadcast successfully dispatched to parent contact lists!'); 
                    }} 
                    className="p-4 bg-muted/30 border border-border rounded-xl space-y-3"
                  >
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Launch Marketing Campaign</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold font-sans">
                        <option>WhatsApp Campaign (Direct Chat)</option>
                        <option>Email Campaign (HTML Newsletter)</option>
                      </select>
                      <input type="text" placeholder="Campaign Headline" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                    </div>
                    <div className="flex justify-end pt-2">
                      <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                        🚀 Send Campaign
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Support & Help Desk */}
              {['Ticket Management', 'Complaint Tracking', 'Escalation Workflow', 'Issue Resolution', 'Knowledge Base'].includes(activeFeature || '') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    🛠️ Help Desk Tickets & Resolution Hub. Track parent complaints and escalation status.
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Active Support Tickets</span>
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                          <th className="p-2">Ticket ID</th>
                          <th className="p-2">Issue Details</th>
                          <th className="p-2">Priority</th>
                          <th className="p-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground/85">
                        <tr className="hover:bg-muted/10">
                          <td className="p-2 font-mono text-purple-400">TCK-4819</td>
                          <td className="p-2">Stripe Payment transaction failed on invoice</td>
                          <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">High</span></td>
                          <td className="p-2 text-right">
                            <button onClick={() => alert("Ticket TCK-4819 resolved successfully!")} className="px-2 py-0.5 bg-primary text-white rounded text-[10px] font-bold">Resolve</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/10">
                          <td className="p-2 font-mono text-purple-400">TCK-4820</td>
                          <td className="p-2">Parent Portal credential login issue</td>
                          <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">Medium</span></td>
                          <td className="p-2 text-right">
                            <button onClick={() => alert("Ticket TCK-4820 resolved successfully!")} className="px-2 py-0.5 bg-primary text-white rounded text-[10px] font-bold">Resolve</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Mobile Applications Simulator */}
              {['Mobile Applications', 'Push Notifications', 'Offline Mode'].includes(activeFeature || '') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📱 Simulated view of Dedicated School Mobile Applications (Parent, Teacher, Student & Principal views).
                  </div>

                  <div className="flex justify-center py-4">
                    <div className="w-64 h-[420px] rounded-3xl border-[6px] border-slate-700 bg-slate-900 p-4 relative overflow-hidden flex flex-col shadow-2xl glow-purple">
                      {/* Notch */}
                      <div className="w-24 h-4 bg-slate-700 rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                      </div>

                      <div className="flex-1 flex flex-col justify-between pt-4">
                        <div className="space-y-3 text-center">
                          <div className="inline-flex p-2 bg-primary/20 border border-primary/30 rounded-xl text-primary text-xs font-bold uppercase tracking-wider mt-2">
                            {currentTenant?.schoolName || "Central School"} Mobile App
                          </div>
                          <p className="text-[10px] text-foreground/70">Secure Offline Sync Enabled</p>
                        </div>

                        <div className="space-y-2">
                          <button 
                            onClick={() => alert("Simulated Push Notification successfully sent to parent smartphone!")} 
                            className="w-full py-2 bg-primary text-white rounded text-[10px] font-bold transition-all hover:scale-95 active:scale-95"
                          >
                            🔔 Trigger Push Notification
                          </button>
                          <div className="p-2 bg-card border border-border rounded-lg text-[9px] text-center text-foreground/60">
                            Offline Mode: <strong className="text-emerald-400 font-sans font-bold">Active</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI COMMAND CENTER */}
              {activeFeature === 'AI Command Center' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/35 rounded-xl text-xs text-foreground/90 leading-relaxed flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-purple-400 block mb-0.5">🧠 AI Command Center Dashboard</span>
                      <p className="font-medium text-foreground/75">Enterprise-grade multi-agent analytical models executing real-time forecasts.</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-[9px] font-black uppercase tracking-wider border border-purple-500/30">Active</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Academic Analyst */}
                    <div className="p-5 bg-card/60 border border-border rounded-2xl space-y-3 flex flex-col justify-between hover:border-primary/45 transition-all">
                      <div className="space-y-1">
                        <strong className="text-xs text-foreground uppercase tracking-wider block font-black">🎓 AI Academic Analyst</strong>
                        <p className="text-[11px] text-foreground/60 leading-relaxed">Predicting at-risk coursework scores and analyzing student performance profiles.</p>
                      </div>
                      <div className="p-3 bg-muted/30 border border-border rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-center text-[10px] text-red-400 font-bold bg-red-500/10 p-1.5 rounded border border-red-500/25">
                          <span>⚠️ At-Risk Student Flagged: Zainab Ali</span>
                          <span>High dropout risk</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Top Performer:</span>
                          <strong className="text-emerald-400 font-extrabold">Kamran Shah (Rank 1)</strong>
                        </div>
                      </div>
                    </div>

                    {/* Financial Analyst */}
                    <div className="p-5 bg-card/60 border border-border rounded-2xl space-y-3 flex flex-col justify-between hover:border-primary/45 transition-all">
                      <div className="space-y-1">
                        <strong className="text-xs text-foreground uppercase tracking-wider block font-black">💰 AI Financial Analyst</strong>
                        <p className="text-[11px] text-foreground/60 leading-relaxed">Analyzing revenue parameters, operational cash flows, and cost margins.</p>
                      </div>
                      <div className="p-3 bg-muted/30 border border-border rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Revenue Forecast (Q3):</span>
                          <strong className="text-emerald-400 font-black">+12.4% projected growth</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Recomm. Savings:</span>
                          <span className="text-primary font-bold">LED Campus arrays conversion</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendance Intel */}
                    <div className="p-5 bg-card/60 border border-border rounded-2xl space-y-3 flex flex-col justify-between hover:border-primary/45 transition-all">
                      <div className="space-y-1">
                        <strong className="text-xs text-foreground uppercase tracking-wider block font-black">📊 AI Attendance Intelligence</strong>
                        <p className="text-[11px] text-foreground/60 leading-relaxed">Monitoring daily attendance patterns and predicting staff absenteeism flags.</p>
                      </div>
                      <div className="p-3 bg-muted/30 border border-border rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Attendance Average:</span>
                          <strong className="text-white font-mono">94.2% (Steady)</strong>
                        </div>
                        <div className="flex justify-between text-yellow-400">
                          <span>Alert: Thursdays class 9-A drops below 90%</span>
                        </div>
                      </div>
                    </div>

                    {/* Executive Assistant */}
                    <div className="p-5 bg-card/60 border border-border rounded-2xl space-y-3 flex flex-col justify-between hover:border-primary/45 transition-all">
                      <div className="space-y-1">
                        <strong className="text-xs text-foreground uppercase tracking-wider block font-black">🤖 AI Executive Assistant</strong>
                        <p className="text-[11px] text-foreground/60 leading-relaxed">Compiling daily summaries, automated recommendations, and security audits.</p>
                      </div>
                      <div className="p-3 bg-muted/30 border border-border rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>System Security:</span>
                          <strong className="text-emerald-400 font-bold">GDPR Isolated Safe</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Daily summary:</span>
                          <span className="truncate max-w-[160px] text-slate-400">2 faculty leaves require approval</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI CONTENT STUDIO */}
              {activeFeature === 'AI Content Studio' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    ✨ Generate custom admission campaigns, event greetings, and graduation announcements in 8 localized languages.
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Input configuration */}
                    <div className="p-5 bg-card border border-border rounded-2xl space-y-4">
                      <span className="block text-xs font-black text-foreground uppercase tracking-wider">Configure Post Details</span>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/75 uppercase tracking-wider">Campaign Target Topic</label>
                        <select 
                          value={studioCampaignType}
                          onChange={(e) => setStudioCampaignType(e.target.value)}
                          className="w-full bg-muted border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold"
                        >
                          <option value="admission">Admissions Open 2026-27</option>
                          <option value="sports">Annual Sports Day Announcement</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/75 uppercase tracking-wider">Target Output Language</label>
                        <select 
                          value={studioLanguage}
                          onChange={(e) => setStudioLanguage(e.target.value)}
                          className="w-full bg-muted border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold"
                        >
                          <option value="English">English</option>
                          <option value="Urdu">Urdu (اردو)</option>
                          <option value="Arabic">Arabic (العربية)</option>
                          <option value="French">French (Français)</option>
                          <option value="Spanish">Spanish (Español)</option>
                          <option value="German">German (Deutsch)</option>
                          <option value="Turkish">Turkish (Türkçe)</option>
                          <option value="Chinese">Chinese (中文)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/75 uppercase tracking-wider">Social Media Format</label>
                        <select 
                          value={studioChannel}
                          onChange={(e) => setStudioChannel(e.target.value)}
                          className="w-full bg-muted border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold"
                        >
                          <option value="Facebook">Facebook Post</option>
                          <option value="Instagram">Instagram Format</option>
                          <option value="LinkedIn">LinkedIn Professional</option>
                          <option value="X">X (Twitter)</option>
                          <option value="WhatsApp Status">WhatsApp Status</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          setStudioLoading(true);
                          // Simulated fetch delay
                          setTimeout(() => {
                            const captions: Record<string, Record<string, string>> = {
                              admission: {
                                Urdu: "داخلے جاری ہیں! تعلیمی سال 2026-27 کے لیے اپنے بچے کا مستقبل محفوظ بنائیں۔",
                                English: "Admissions Open! Secure your child's future for the academic session 2026-27 today.",
                                Arabic: "القبول مفتوح الآن! امنح طفلك فرصة الحصول على تعلیم متميز لعام 2026-2027.",
                                Spanish: "¡Admisiones Abiertas! Asegure el futuro académico de su hijo para la sesión 2026-27.",
                                French: "Inscriptions ouvertes ! Sécurisez l'avenir de votre enfant pour la session académique 2026-27.",
                                German: "Anmeldungen geöffnet! Sichern Sie noch heute die Zukunft Ihres Kindes für das Schuljahr 2026-27.",
                                Turkish: "Kayıtlar Başladı! Çocuğunuzun geleceğini 2026-27 akademik yılı için şimdiden güvenceye alın.",
                                Chinese: "入学招生中！即刻为您的孩子锁定2026-27学年的璀璨未来。"
                              },
                              sports: {
                                Urdu: "کھیلوں کا سالانہ دن آ رہا ہے! آئیں اور اپنے ننھے چیمپئنز کی حوصلہ افزائی کریں۔",
                                English: "Annual Sports Day is just around the corner! Let's cheer for our young champions.",
                                Arabic: "يوم الرياضة السنوي على الأبواب! انضموا إلينا لتشجيع أبطالنا الصغار.",
                                Spanish: "¡El Día del Deporte se acerca! Venga a animar a nuestros pequeños campeones.",
                                French: "Journée sportive annuelle approche ! Venez encourager nos jeunes champions.",
                                German: "Der jährliche Sporttag steht vor der Tür! Feuern Sie unsere kleinen Champions an.",
                                Turkish: "Yıllık Spor Günü yaklaşıyor! Genç şampiyonlarımızı hep birlikte destekleyelim.",
                                Chinese: "年度校运会即将来临！让我们共同为年轻的冠军们加油喝彩。"
                              }
                            };
                            const selected = captions[studioCampaignType] || captions.admission;
                            setStudioGeneratedCaption(selected[studioLanguage] || selected.English);
                            setStudioGeneratedHashtags(`#AcademicHub #Education #${studioChannel}`);
                            setStudioLoading(false);
                          }, 500);
                        }}
                        className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-black rounded-lg transition-all shadow-md"
                        disabled={studioLoading}
                      >
                        {studioLoading ? 'Generating Post...' : '✨ Generate Social Media Post'}
                      </button>
                    </div>

                    {/* Preview Area */}
                    <div className="space-y-4">
                      <span className="block text-xs font-bold text-foreground/75 uppercase tracking-wider">Auto-Branded Post Preview</span>
                      
                      {studioGeneratedCaption ? (
                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-slate-200 shadow-xl relative overflow-hidden">
                          {/* Channel Badge */}
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase border-b border-slate-800 pb-3">
                            <span>Preview Mode: {studioChannel}</span>
                            <span className="px-2 py-0.5 rounded bg-primary/20 text-primary uppercase font-black tracking-widest">{studioLanguage}</span>
                          </div>

                          {/* Brand header */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-sm text-primary shrink-0">
                              🎓
                            </div>
                            <div>
                              <strong className="block text-white text-xs font-black">{currentTenant?.schoolName || 'Academic Hub School'}</strong>
                              <span className="text-[9px] text-slate-500 block">Sponsor Campaign</span>
                            </div>
                          </div>

                          {/* Body Caption */}
                          <p className="text-xs text-slate-300 font-medium leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60" dir={['Urdu', 'Arabic'].includes(studioLanguage) ? 'rtl' : 'ltr'}>
                            {studioGeneratedCaption}
                          </p>

                          <p className="text-[10px] text-primary font-mono">{studioGeneratedHashtags}</p>

                          <div className="flex gap-2.5 pt-2 border-t border-slate-800/80">
                            <button
                              type="button"
                              onClick={() => {
                                alert("Simulated PNG image rendering template has been compiled with auto-branding logo. PNG file exported successfully!");
                              }}
                              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold transition-all shadow-sm"
                            >
                              📥 Export auto-branded PNG Image
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(`${studioGeneratedCaption}\n\n${studioGeneratedHashtags}`);
                                alert("Caption text copied to clipboard!");
                              }}
                              className="px-3.5 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 rounded text-[10px] font-bold transition-all"
                            >
                              Copy Text
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-dashed border-border rounded-2xl p-12 text-center text-xs text-foreground/50 bg-muted/10">
                          Configure post variables and click Generate to preview auto-branded social media campaign.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT GATEWAY SETTINGS */}
              {activeFeature === 'Payment Gateway Settings' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    💳 Manage country-specific payment systems, toggle online channels, and configure API credential parameters.
                  </div>

                  <div className="p-5 bg-card border border-border rounded-2xl space-y-4">
                    <span className="block text-xs font-black text-foreground uppercase tracking-wider">Gateway Configuration Panel</span>

                    <div className="divide-y divide-border">
                      {gatewaysList.map((gw, idx) => (
                        <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-foreground text-sm font-bold">{gw.name} Integration</strong>
                              {gw.localOnly && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold">Local Gateway</span>
                              )}
                            </div>
                            <span className="text-[10px] text-foreground/50 block mt-0.5">
                              {gw.name === 'Stripe' ? 'Supports Apple Pay, Google Pay, and global credit/debit checkouts.' :
                               gw.name === 'PayPal' ? 'Direct secure express account payments.' :
                               gw.name === 'Easypaisa' ? 'Local mobile wallet and direct bank payouts (Pakistan).' :
                               'Local mobile wallet invoice payments (Pakistan).'}
                            </span>
                          </div>

                          <div className="flex items-center gap-3.5 self-end sm:self-auto">
                            {/* API credentials mock entry */}
                            {gw.active && (
                              <div className="flex items-center gap-1.5 bg-muted p-1 border border-border rounded-lg text-[10px] font-mono">
                                <span>Key:</span>
                                <input
                                  type="password"
                                  value={gatewayApiKeys[gw.name] || '**********'}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setGatewayApiKeys(prev => ({ ...prev, [gw.name]: val }));
                                  }}
                                  className="bg-transparent border-none focus:outline-none text-[10px] w-24 text-foreground font-mono"
                                />
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                requestSecurityVerification(`Toggle payment gateway ${gw.name} status`, () => {
                                  setGatewaysList(prev => prev.map((item, i) => i === idx ? { ...item, active: !item.active } : item));
                                  alert(`Gateway ${gw.name} status changed successfully!`);
                                });
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                gw.active
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                  : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                              }`}
                            >
                              {gw.active ? 'Active' : 'Disabled'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-3 border-t border-border">
                      <button
                        type="button"
                        onClick={() => {
                          requestSecurityVerification("Save updated payment gateway configurations for the active tenant", () => {
                            alert("Payment configurations synced successfully across branch gateways!");
                          });
                        }}
                        className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                      >
                        Save Configurations
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* SECURE DELETION PASSWORD VERIFICATION OVERLAY MODAL */}
      {deleteConfirmOpen && (
        <div className="security-modal-overlay">
          <form 
            onSubmit={handleExecuteDelete}
            className="modal-container modal-md border-red-500/35 shadow-2xl shadow-red-950/20 animate-fadeIn"
          >
            <div className="modal-header">
              <div className="flex items-center gap-3 text-red-400">
                <span className="text-xl">⚠️</span>
                <div>
                  <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">Confirm Destructive Action</h4>
                  <p className="text-[10px] text-foreground/60 mt-0.5">Authorized security authentication required</p>
                </div>
              </div>
            </div>

            <div className="modal-body space-y-5">
            <p className="text-xs text-foreground/80 leading-relaxed font-medium">
              {deleteConfirmMessage}
            </p>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-foreground/70 uppercase tracking-widest">
                Security Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter password to approve deletion"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg text-xs p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-red-400"
              />
            </div>

            {deletePasswordError && (
              <p className="text-[10px] text-red-400 leading-normal font-bold bg-red-950/20 border border-red-500/20 rounded p-2">
                {deletePasswordError}
              </p>
            )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setPendingDeleteAction(null);
                  setDeletePassword('');
                  setDeletePasswordError('');
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-muted border border-border hover:bg-card text-foreground transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-500 hover:bg-red-650 text-white shadow-md transition-all"
              >
                Verify & Delete
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Sub-component dummy globe icon to avoid extra dependencies
function GlobeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
