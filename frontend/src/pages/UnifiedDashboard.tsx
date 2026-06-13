// @ts-nocheck
// @ts-nocheck
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../store/authStore';
import { useSchoolStore, COUNTRY_CONFIGS } from '../store/schoolStore';
import { useNavigate } from 'react-router-dom';
import { setupRealtimeSync, updateRealtimeData } from '../store/firebase';
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
  Moon,
  HeartPulse,
  Server,
  Database,
  Lock,
  Key,
  Mail,
  Smartphone,
  Ban,
  LineChart,
  AlertOctagon,
  Filter,
  Box,
  Bus,
  Building,
  Fingerprint,
  Banknote,
  CalendarDays,
  Speech,
  Briefcase,
  Target,
  Trophy,
  FileBadge,
  Bot,
  Timer,
  Bell,
  Edit,
  Upload,
  Download,
  ShieldAlert,
  Globe,
  List,
  Trash2,
  MessageCircle,
  BrainCircuit,
  PieChart,
  BarChart3,
  DollarSign,
  Star,
  MapPin
} from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { AcademicCalendar } from './AcademicCalendar';
import { useCalendarStore } from '../store/calendarStore';

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
    // Super Admin// Admin / Principal
    case 'Student Management':
      return { desc: 'Enroll pupils, update profiles and roll listings.', icon: UserPlus, stats: '480 Enrolled' };case 'Attendance Monitoring':
      return { desc: 'Analyze daily attendance trends and summaries.', icon: UserCheck, stats: '92.4% Today' };
    case 'Fee Monitoring':
      return { desc: 'Track challans, defaults and monthly receipts.', icon: CreditCard, stats: 'Rs 125,000 Pending' };
    case 'Academic Oversight':
      return { desc: 'Monitor exams, grade books and lesson plan metrics.', icon: Award, stats: '2026-27 Session' };
    case 'Student Conduct Records':
      return { desc: 'Log behavioral incidents, warnings and rewards.', icon: Shield, stats: 'Conflict-Free' };
    case 'School Notices':
      return { desc: 'Send SMS & Email bulletins to parent contacts.', icon: MessageSquare, stats: 'Sync Complete' };
    case 'Parent Communication Center':
      return { desc: 'Review parent concerns and direct chat logs.', icon: Speech, stats: 'Inbox Clear' };// Teacher
    case 'My Classes':
      return { desc: 'View assigned class timetables and room codes.', icon: Home, stats: '3 Sections' };
    case 'Attendance Marking':
    case 'Attendance Entry':
      return { desc: 'Record student check-ins and late arrivals.', icon: UserCheck, stats: '1 Pending Class' };
    case 'Homework Management':
    case 'Assignment Creation':
      return { desc: 'Publish daily assignments and resource files.', icon: BookOpen, stats: '4 Assigned' };
    case 'Assignments Entry':
      return { desc: 'Review student file submissions and enter grades.', icon: FileText, stats: '12 to Grade' };
    case 'Marks Sheet':
    case 'Grade Book':
      return { desc: 'Maintain term grades and mid-term card evaluations.', icon: Award, stats: 'Updated' };
    case 'Lesson Planner':
      return { desc: 'Upload weekly plans and view curriculum demos.', icon: FileText, stats: 'Pending Upload' };
    case 'Class Diary':
      return { desc: 'Log daily classroom activities and homework.', icon: BookOpen, stats: 'Today Logged' };
    case 'Quiz Creation':
      return { desc: 'Generate and publish online digital quizzes.', icon: Edit, stats: '0 Active' };
    case 'Student Remarks':
      return { desc: 'Log behavioral and academic remarks for parents.', icon: MessageSquare, stats: 'All Sync' };
    case 'Class Timetable':
      return { desc: 'Display period timelines and subject listings.', icon: Calendar, stats: '4 Periods Today' };
    case 'Parent Communication':
      return { desc: 'Send direct messages regarding student progress.', icon: MessageSquare, stats: 'Active chats' };// Student
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
    case 'Student Goal Tracking':
      return { desc: 'Set and monitor your academic milestones and goals.', icon: Target, stats: '3 Active Goals' };
    case 'GPA & Progress Analytics':
      return { desc: 'Visual charts analyzing GPA trends and performance.', icon: LineChart, stats: 'Top 10%' };
    case 'Achievement System':
      return { desc: 'Earn and view digital badges for your accomplishments.', icon: Trophy, stats: '8 Badges Unlocked' };
    case 'Digital Certificates':
      return { desc: 'Download digitally signed course completion certificates.', icon: FileBadge, stats: '2 Certificates' };
    case 'Study Planner':
      return { desc: 'Organize study sessions and manage academic calendar.', icon: CalendarDays, stats: 'On Track' };
    case 'AI Study Assistant':
      return { desc: 'Chat with AI tutor for explanations and smart quizzes.', icon: Bot, stats: 'Available 24/7' };
    case 'Exam Preparation Tracker':
      return { desc: 'Track syllabus coverage before upcoming exams.', icon: Timer, stats: 'Physics: 80%' };
    case 'Homework Reminder':
      return { desc: 'Automated alerts for approaching assignment deadlines.', icon: Bell, stats: '1 Alert' };

    // Parent
    case 'Child Attendance':
      return { desc: 'Monitor your child\'s daily presence check-ins.', icon: UserCheck, stats: '94% Presence' };
    case 'Exam Grades':
    case 'Exam Results':
      return { desc: 'View report card transcripts and test scores.', icon: Award, stats: 'Outstanding' };
    case 'Fee Payments':
    case 'Fee Status':
      return { desc: 'Process billing fees and download invoice receipts.', icon: CreditCard, stats: 'Rs 0 Due' };
    case 'Notifications Log':
    case 'School Notices':
      return { desc: 'Review school circulars, bulletins and memos.', icon: MessageSquare, stats: 'No Alerts' };
    case 'Teacher Communication':
    case 'Teacher Messaging':
      return { desc: 'Direct message support channel to class tutors.', icon: PhoneCall, stats: 'Direct Line' };
    case 'Student Progress Graphs':
      return { desc: 'Visual analytics of child academic growth and GPA tracking.', icon: LineChart, stats: 'On Track' };
    case 'Leave Requests':
      return { desc: 'Request sick leaves for your child online.', icon: Clock, stats: '0 Active' };// Hostel Warden// Transport Manager// Librarian Desk// Reception / Visitor// Admission / CRM// Accounts / Fees
    case 'Fee Collection':
      return { desc: 'Process cashier challans and custom discounts.', icon: CreditCard, stats: 'Rs 42,000 Today' };// HR Department// Vice Principal
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

    // Org Owner// School Network Ownercase 'Academic Grade Summaries':
      return { desc: 'Analyze passing ratios and exam trends.', icon: Award, stats: '89.2% Pass' };case 'School Transport':
      return { desc: 'View school bus schedules, route information, and tracking.', icon: Map, stats: 'Bus Synced' };// newly added generic featurescase 'Exam Management':
      return { desc: 'Create exam terms, date sheets, and print hall tickets.', icon: BookOpen, stats: 'Midterms Active' };
    case 'Result Processing':
      return { desc: 'Calculate aggregates and compile term report cards.', icon: Award, stats: 'Processing' };default:
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

export const CLASSES_LIST = [
  'Playgroup',
  'Nursery',
  'Prep',
  'Class 1-A',
  'Class 2-A',
  'Class 3-A',
  'Class 4-A',
  'Class 5-A',
  'Class 6-A',
  'Class 7-A',
  'Class 8-A',
  'Class 9-A',
  'Class 9-B',
  'Class 10-A',
  'Class 10-B'
];

export const PRIMARY_CLASSES = ['Playgroup', 'Nursery', 'Prep', 'Class 1-A', 'Class 2-A', 'Class 3-A', 'Class 4-A', 'Class 5-A'];
export const SECONDARY_CLASSES = ['Class 6-A', 'Class 7-A', 'Class 8-A', 'Class 9-A', 'Class 9-B', 'Class 10-A', 'Class 10-B'];

export const SUBJECTS_LIST = [
  'English',
  'Urdu',
  'Islamic Studies',
  'Pakistan Studies',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'General Science',
  'Arts & Craft',
  'Physical Education'
];

export const UnifiedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const currentSchool = useSchoolStore((state) => state.currentSchool);
  const { darkMode, toggleTheme } = useThemeStore();
  const formatCurrency = useSchoolStore((state) => state.formatCurrency);
  const getRollLabel = useSchoolStore((state) => state.getRollLabel);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [activeGuide, setActiveGuide] = useState<{ title: string; answerTitle: string; answerContent: string } | null>(null);
  const [activeFunnelView, setActiveFunnelView] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'primary' | 'secondary'>('primary');
  const [selectedReportStudent, setSelectedReportStudent] = useState('');
  const [activeExamView, setActiveExamView] = useState<string | null>(null);
  const [showSubstituteForm, setShowSubstituteForm] = useState(false);
  const [substitutes, setSubstitutes] = useState<{ id: string; date: string; absentTeacher: string; substituteTeacher: string; period: string }[]>([
    { id: '1', date: new Date().toISOString().split('T')[0], absentTeacher: 'Mr. Ali (Physics)', substituteTeacher: 'Ms. Sana (Science)', period: '08:00 AM' }
  ]);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([
    { id: '1', name: 'Dell Optiplex 3020', category: 'IT Equipment', location: 'Computer Lab 1', qty: '30 Good', value: '$6,500' },
    { id: '2', name: 'Chemistry Flasks', category: 'Lab Supplies', location: 'Science Lab', qty: '15 Low Stock', value: '$150' },
    { id: '3', name: 'Wooden Desks & Chairs', category: 'School Furniture', location: 'Class 10-A', qty: '40 Good', value: '$2,000' },
    { id: '4', name: 'Interactive Smart Board', category: 'Electronics', location: 'Lecture Hall', qty: '1 Good', value: '$1,200' },
    { id: '5', name: 'Swing Sets & Slides', category: 'Play Area Things', location: 'Kindergarten Yard', qty: '1 Set Good', value: '$800' }
  ]);

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isCertEditMode, setIsCertEditMode] = useState(false);
  const [editCertAuthority, setEditCertAuthority] = useState('');
  const [editCertLicense, setEditCertLicense] = useState('');
  const [editCertGrade, setEditCertGrade] = useState('');
  const [editCertStatus, setEditCertStatus] = useState('');
  const [editCertIssueDate, setEditCertIssueDate] = useState('');
  const [editCertExpiryDate, setEditCertExpiryDate] = useState('');
  const [editCertFileBase64, setEditCertFileBase64] = useState<string | undefined>(undefined);
  const [editCertFileName, setEditCertFileName] = useState<string | undefined>(undefined);
  const [editCertFileType, setEditCertFileType] = useState<string | undefined>(undefined);

  const [examStatus, setExamStatus] = useState<'Upcoming' | 'Conducted'>('Upcoming');
  const [studentGrades, setStudentGrades] = useState<Record<string, { subject: string; grade: string; marks: number; total: number; status: string }[]>>({
    'Kamran Shah': [
      { subject: 'Mathematics', grade: 'A', marks: 92, total: 100, status: 'Pass' },
      { subject: 'Physics', grade: 'A', marks: 88, total: 100, status: 'Pass' },
      { subject: 'Chemistry', grade: 'B+', marks: 79, total: 100, status: 'Pass' },
      { subject: 'Biology', grade: 'A', marks: 90, total: 100, status: 'Pass' },
      { subject: 'English Language', grade: 'A', marks: 94, total: 100, status: 'Pass' },
      { subject: 'Computer Science', grade: 'A', marks: 95, total: 100, status: 'Pass' },
    ],
    'Ayesha Siddiqui': [
      { subject: 'Mathematics', grade: 'A+', marks: 98, total: 100, status: 'Pass' },
      { subject: 'Physics', grade: 'A', marks: 91, total: 100, status: 'Pass' },
      { subject: 'Chemistry', grade: 'A', marks: 90, total: 100, status: 'Pass' },
      { subject: 'Biology', grade: 'B', marks: 72, total: 100, status: 'Pass' },
      { subject: 'English Language', grade: 'A', marks: 88, total: 100, status: 'Pass' },
      { subject: 'Computer Science', grade: 'A+', marks: 97, total: 100, status: 'Pass' },
    ],
    'Zainab Ali': [
      { subject: 'Mathematics', grade: 'B', marks: 75, total: 100, status: 'Pass' },
      { subject: 'Physics', grade: 'C', marks: 62, total: 100, status: 'Pass' },
      { subject: 'Chemistry', grade: 'C+', marks: 68, total: 100, status: 'Pass' },
      { subject: 'Biology', grade: 'A', marks: 89, total: 100, status: 'Pass' },
      { subject: 'English Language', grade: 'B', marks: 78, total: 100, status: 'Pass' },
      { subject: 'Computer Science', grade: 'B', marks: 74, total: 100, status: 'Pass' },
    ]
  });

  const getStudentGrades = (studentName: string) => {
    return studentGrades[studentName] || [
      { subject: 'Mathematics', grade: 'A', marks: 92, total: 100, status: 'Pass' },
      { subject: 'Physics', grade: 'A', marks: 88, total: 100, status: 'Pass' },
      { subject: 'Chemistry', grade: 'B+', marks: 79, total: 100, status: 'Pass' },
      { subject: 'Biology', grade: 'A', marks: 90, total: 100, status: 'Pass' },
      { subject: 'English Language', grade: 'A', marks: 94, total: 100, status: 'Pass' },
      { subject: 'Computer Science', grade: 'A', marks: 95, total: 100, status: 'Pass' },
    ];
  };

  // State mapping student names to transport services
  const [studentTransport, setStudentTransport] = useState<Record<string, {
    active: boolean;
    route?: string;
    vehicle?: string;
    driver?: string;
    phone?: string;
    fee?: number;
  }>>({
    'Kamran Shah': { active: true, route: 'Route Alpha (Main Loop)', vehicle: 'BUS-08 (LHR-9876)', driver: 'Ahmed Khan', phone: '0300-1234567', fee: 2500 },
    'Ayesha Siddiqui': { active: false },
    'Zainab Ali': { active: false }
  });

  // State mapping student names to library book issues
  const [studentLibrary, setStudentLibrary] = useState<Record<string, {
    id: string;
    title: string;
    issueDate: string;
    dueDate: string;
    status: 'Active' | 'Overdue' | 'Due Soon' | 'Extended';
  }[]>>({
    'Kamran Shah': [
      { id: 'lib-1', title: 'Advanced Calculus Vol 1', issueDate: '2026-06-01', dueDate: '2026-06-15', status: 'Active' },
      { id: 'lib-2', title: 'Introduction to Quantum Mechanics', issueDate: '2026-06-05', dueDate: '2026-06-20', status: 'Active' }
    ],
    'Ayesha Siddiqui': [
      { id: 'lib-3', title: 'A History of Modern Literature', issueDate: '2026-05-15', dueDate: '2026-06-05', status: 'Overdue' }
    ],
    'Zainab Ali': []
  });

  // State mapping student names to hostel allocations
  const [studentHostel, setStudentHostel] = useState<Record<string, {
    allocated: boolean;
    wing?: string;
    room?: string;
    warden?: string;
    phone?: string;
    feeStatus?: 'Paid' | 'Unpaid';
  }>>({
    'Kamran Shah': { allocated: true, wing: 'Wing A', room: 'Room 104', warden: 'Sajid Malik', phone: '0321-7654321', feeStatus: 'Unpaid' },
    'Ayesha Siddiqui': { allocated: true, wing: 'Wing B', room: 'Room 202', warden: 'Sajid Malik', phone: '0321-7654321', feeStatus: 'Paid' },
    'Zainab Ali': { allocated: false }
  });


  // Core functional database state partitioned by school schoolId
  const [database, setDatabase] = useState<Record<string, {
    students: { id: string; name: string; roll: string; className: string; status: string; borrowedBooks?: string[]; bookedTransport?: string; hostelStatus?: string; }[];
    waitingList?: any[];
    teachers: { 
      id: string; 
      name: string; 
      subject: string; 
      className: string; 
      status: string; 
      role?: string;
      qualification?: string; 
      salary?: string; 
      experience?: string; 
      email?: string; 
      phone?: string; 
      photo?: string | null; 
      doc?: string | null 
    }[];
    notices: { id: string; date: string; title: string; content: string }[];
    leaves: { id: string; name: string; date: string; reason: string; status: string }[];
    invoices: { id: string; student: string; amount: number; status: string }[];
    assignments: any[];
    disciplines: { id: string; name: string; date: string; infraction: string; action: string }[];
    parentMessages: { id: string; parent: string; date: string; subject: string; message: string }[];
    classes?: string[];
    subjects?: string[];
    foodCert?: {
      authority: string;
      licenseCode: string;
      grade: string;
      status: string;
      issueDate: string;
      expiryDate: string;
      fileData?: string;
      fileType?: string;
    };
  }>>(() => {
    const saved = localStorage.getItem('academic_hub_offline_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse offline db', e);
      }
    }
    return {
    // 1. Dar-e-Arqam School (PK)
    '11111111-1111-1111-1111-111111111111': {
      students: [
        { id: '1', name: 'Kamran Shah', roll: '12', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Ayesha Siddiqui', roll: '04', className: 'Class 10-B', status: 'Present' },
        { id: '3', name: 'Zainab Ali', roll: '22', className: 'Class 9-A', status: 'Absent' },
        { id: '4', name: 'Bilal Ahmed', roll: '08', className: 'Class 10-A', status: 'Present' },
        { id: '5', name: 'Fatima Noor', roll: '15', className: 'Class 8-C', status: 'Present' },
        { id: '6', name: 'Saad Tariq', roll: '31', className: 'Class 9-B', status: 'Late' },
        { id: '7', name: 'Hassan Raza', roll: '02', className: 'Class 7-A', status: 'Present' },
        { id: '8', name: 'Mariam Khan', roll: '19', className: 'Class 10-A', status: 'Present' },
        { id: '9', name: 'Usman Ghani', roll: '27', className: 'Class 8-B', status: 'Absent' },
        { id: '10', name: 'Hira Malik', roll: '11', className: 'Class 9-A', status: 'Present' },
        { id: '11', name: 'Ali Zafar', roll: '05', className: 'Class 7-B', status: 'Present' },
        { id: '12', name: 'Sana Javed', roll: '14', className: 'Class 10-B', status: 'Late' },
        { id: '13', name: 'Omar Farooq', roll: '21', className: 'Class 8-A', status: 'Present' },
        { id: '14', name: 'Amina Baig', roll: '09', className: 'Class 9-B', status: 'Present' },
        { id: '15', name: 'Zeeshan Qureshi', roll: '33', className: 'Class 10-A', status: 'Absent' },
        { id: '16', name: 'Nida Yasir', roll: '18', className: 'Class 7-A', status: 'Present' },
        { id: '17', name: 'Hamza Ali', roll: '25', className: 'Class 8-C', status: 'Present' },
        { id: '18', name: 'Rabia Aslam', roll: '07', className: 'Class 9-A', status: 'Present' },
        { id: '19', name: 'Danish Nawaz', roll: '30', className: 'Class 10-B', status: 'Present' },
        { id: '20', name: 'Iqra Aziz', roll: '16', className: 'Class 8-B', status: 'Late' },
        { id: '21', name: 'Imran Abbas', roll: '03', className: 'Class 7-B', status: 'Present' },
        { id: '22', name: 'Mahira Khan', roll: '28', className: 'Class 10-A', status: 'Present' }
      ],
      teachers: [
        { id: '1', name: 'Sarah Khan', role: 'Teacher', subject: 'English', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'Raza Ahmed', role: 'Teacher', subject: 'Physics', className: 'Class 10-B', status: 'Active' },
        { id: '3', name: 'Hina Malik', role: 'Teacher', subject: 'Mathematics', className: 'Class 9-A', status: 'Active' },
        { id: '4', name: 'Tariq Mehmood', role: 'Vice Principal', subject: 'Administration', className: 'N/A', status: 'Active' },
        { id: '5', name: 'Ayesha Bibi', role: 'Coordinator', subject: 'Academics', className: 'N/A', status: 'Active' },
        { id: '6', name: 'Bashir Ahmed', role: 'Guard', subject: 'Security', className: 'Main Gate', status: 'Active' },
        { id: '7', name: 'Sajid Ali', role: 'Electrician', subject: 'Maintenance', className: 'Campus', status: 'Active' },
        { id: '8', name: 'Ghafoor Khan', role: 'Plumber', subject: 'Maintenance', className: 'Campus', status: 'Active' },
        { id: '9', name: 'Munir', role: 'Gardener', subject: 'Maintenance', className: 'Grounds', status: 'Active' },
        { id: '10', name: 'Zubaida', role: 'Domestic Staff', subject: 'Cleaning', className: 'Block A', status: 'Active' },
        { id: '11', name: 'Faizan', role: 'Helper', subject: 'Support', className: 'Admin Block', status: 'Active' }
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
        { id: 'INV-003', student: 'Zainab Ali', amount: 7200, status: 'Unpaid' },
        { id: 'INV-004', student: 'Bilal Ahmed', amount: 8500, status: 'Paid' },
        { id: 'INV-005', student: 'Fatima Noor', amount: 6500, status: 'Unpaid' },
        { id: 'INV-006', student: 'Saad Tariq', amount: 7200, status: 'Paid' },
        { id: 'INV-007', student: 'Hassan Raza', amount: 6000, status: 'Paid' },
        { id: 'INV-008', student: 'Mariam Khan', amount: 8500, status: 'Unpaid' },
        { id: 'INV-009', student: 'Usman Ghani', amount: 6500, status: 'Paid' },
        { id: 'INV-010', student: 'Hira Malik', amount: 7200, status: 'Paid' },
        { id: 'INV-011', student: 'Ali Zafar', amount: 6000, status: 'Unpaid' },
        { id: 'INV-012', student: 'Sana Javed', amount: 8500, status: 'Paid' },
        { id: 'INV-013', student: 'Omar Farooq', amount: 6500, status: 'Unpaid' },
        { id: 'INV-014', student: 'Amina Baig', amount: 7200, status: 'Paid' }
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
        { id: '3', name: 'Bilal Ahmed', roll: '102', className: 'Class 9-A', status: 'Absent' },
        { id: '4', name: 'Zainab Qasim', roll: '105', className: 'Class 10-A', status: 'Present' },
        { id: '5', name: 'Omar Farooq', roll: '106', className: 'Class 10-B', status: 'Present' },
        { id: '6', name: 'Ayesha Siddiqa', roll: '107', className: 'Class 9-A', status: 'Present' },
        { id: '7', name: 'Hassan Raza', roll: '108', className: 'Class 10-A', status: 'Absent' },
        { id: '8', name: 'Maryam Noor', roll: '109', className: 'Class 8-A', status: 'Present' },
        { id: '9', name: 'Usman Tariq', roll: '110', className: 'Class 8-A', status: 'Present' },
        { id: '10', name: 'Khadija Sultan', roll: '111', className: 'Class 9-B', status: 'Present' },
        { id: '11', name: 'Ali Hamza', roll: '112', className: 'Class 9-B', status: 'Absent' },
        { id: '12', name: 'Sara Khan', roll: '113', className: 'Class 7-A', status: 'Present' },
        { id: '13', name: 'Ibrahim Malik', roll: '114', className: 'Class 7-A', status: 'Present' }
      ],
      teachers: [
        { id: '1', name: 'Usman Ghani', subject: 'English', className: 'Class 10-A', status: 'Active', salary: '55000', experience: '4 Years', qualification: 'M.A. English', phone: '+92 300 1111111', email: 'usman.g@school.edu', gender: 'Male', role: 'Teacher' },
        { id: '2', name: 'Ayesha Khan', subject: 'Mathematics', className: 'Class 10-B', status: 'Active', salary: '60000', experience: '5 Years', qualification: 'M.Sc. Mathematics', phone: '+92 300 2222221', email: 'ayesha@school.edu', gender: 'Female', role: 'Teacher' },
        { id: '3', name: 'Fatima Noor', subject: 'Science', className: 'Class 6-A', status: 'Active', salary: '40000', experience: '2 Years', qualification: 'B.Sc. General Science', phone: '+92 300 3333333', email: 'fatima@school.edu', gender: 'Female', role: 'Teacher' },
        { id: '4', name: 'Tariq Jameel', subject: 'Islamic Studies', className: 'Class 9-A', status: 'Active', salary: '45000', experience: '8 Years', qualification: 'M.A. Islamic Studies', phone: '+92 300 4444444', email: 'tariq.j@school.edu', gender: 'Male', role: 'Teacher' },
        { id: '5', name: 'Nida Yasir', subject: 'Physics', className: 'Class 10-B', status: 'Active', salary: '50000', experience: '3 Years', qualification: 'M.Sc. Physics', phone: '+92 300 5555555', email: 'nida@school.edu', gender: 'Female', role: 'Teacher' }
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
        { id: '1', date: '2026-06-06 10:00 AM', title: 'Parent Teacher Meeting', content: 'PTM is scheduled for Saturday. Report cards will be distributed.' }
      ],
      leaves: [],
      invoices: [
        { id: 'INV-201', student: 'Hamza Sohail', amount: 5000, status: 'Unpaid' }
      ],
      assignments: [
        { 
          id: 'demo-1', 
          title: 'Demo Class Homework Assignment', 
          subject: 'English', 
          publishDate: '2026-06-05', 
          dueDate: '2026-06-25', 
          fileName: 'demo_assignment_guidelines.pdf', 
          fileType: 'pdf', 
          status: 'Published', 
          fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4gPj4gPj4gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNjAgPj4Kc3RyZWFtCkJUCi9GMSAxNCBUZgo1MCA3NTAgVGQKKEFjYWRlbWljIEh1YiAtIERlbW8gUGFzdCBQYXBlciBhbmQgSG9tZXdvcmsgQXNzaWdubWVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMjQgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA1IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgozMzMKJSVFT0Y='
        }
      ],
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
      assignments: [
        { 
          id: 'demo-1', 
          title: 'Demo Class Homework Assignment', 
          subject: 'English', 
          publishDate: '2026-06-05', 
          dueDate: '2026-06-25', 
          fileName: 'demo_assignment_guidelines.pdf', 
          fileType: 'pdf', 
          status: 'Published', 
          fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4gPj4gPj4gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNjAgPj4Kc3RyZWFtCkJUCi9GMSAxNCBUZgo1MCA3NTAgVGQKKEFjYWRlbWljIEh1YiAtIERlbW8gUGFzdCBQYXBlciBhbmQgSG9tZXdvcmsgQXNzaWdubWVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMjQgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA1IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgozMzMKJSVFT0Y='
        }
      ],
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
      assignments: [
        { 
          id: 'demo-1', 
          title: 'Demo Class Homework Assignment', 
          subject: 'English', 
          publishDate: '2026-06-05', 
          dueDate: '2026-06-25', 
          fileName: 'demo_assignment_guidelines.pdf', 
          fileType: 'pdf', 
          status: 'Published', 
          fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4gPj4gPj4gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNjAgPj4Kc3RyZWFtCkJUCi9GMSAxNCBUZgo1MCA3NTAgVGQKKEFjYWRlbWljIEh1YiAtIERlbW8gUGFzdCBQYXBlciBhbmQgSG9tZXdvcmsgQXNzaWdubWVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMjQgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA1IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgozMzMKJSVFT0Y='
        }
      ],
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
      assignments: [
        { 
          id: 'demo-1', 
          title: 'Demo Class Homework Assignment', 
          subject: 'English', 
          publishDate: '2026-06-05', 
          dueDate: '2026-06-25', 
          fileName: 'demo_assignment_guidelines.pdf', 
          fileType: 'pdf', 
          status: 'Published', 
          fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4gPj4gPj4gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNjAgPj4Kc3RyZWFtCkJUCi9GMSAxNCBUZgo1MCA3NTAgVGQKKEFjYWRlbWljIEh1YiAtIERlbW8gUGFzdCBQYXBlciBhbmQgSG9tZXdvcmsgQXNzaWdubWVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMjQgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA1IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgozMzMKJSVFT0Y='
        }
      ],
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
      assignments: [
        { 
          id: 'demo-1', 
          title: 'Demo Class Homework Assignment', 
          subject: 'English', 
          publishDate: '2026-06-05', 
          dueDate: '2026-06-25', 
          fileName: 'demo_assignment_guidelines.pdf', 
          fileType: 'pdf', 
          status: 'Published', 
          fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4gPj4gPj4gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNjAgPj4Kc3RyZWFtCkJUCi9GMSAxNCBUZgo1MCA3NTAgVGQKKEFjYWRlbWljIEh1YiAtIERlbW8gUGFzdCBQYXBlciBhbmQgSG9tZXdvcmsgQXNzaWdubWVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMjQgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA1IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgozMzMKJSVFT0Y='
        }
      ],
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
      assignments: [
        { 
          id: 'demo-1', 
          title: 'Demo Class Homework Assignment', 
          subject: 'English', 
          publishDate: '2026-06-05', 
          dueDate: '2026-06-25', 
          fileName: 'demo_assignment_guidelines.pdf', 
          fileType: 'pdf', 
          status: 'Published', 
          fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4gPj4gPj4gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNjAgPj4Kc3RyZWFtCkJUCi9GMSAxNCBUZgo1MCA3NTAgVGQKKEFjYWRlbWljIEh1YiAtIERlbW8gUGFzdCBQYXBlciBhbmQgSG9tZXdvcmsgQXNzaWdubWVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMjQgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA1IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgozMzMKJSVFT0Y='
        }
      ],
      disciplines: [],
      parentMessages: []
    }
  };
});

  React.useEffect(() => {
    localStorage.setItem('academic_hub_offline_db', JSON.stringify(database));
  }, [database]);

  // Resolve current active database partition
  const activeSchoolId = currentSchool?.schoolId || '11111111-1111-1111-1111-111111111111';

  // Seed database partition for newly created schools if it doesn't exist
  React.useEffect(() => {
    if (activeSchoolId && !database[activeSchoolId]) {
      const schoolName = currentSchool?.schoolName || 'New School';
      const city = currentSchool?.city || 'Lahore';
      setDatabase(prev => {
        if (prev[activeSchoolId]) return prev;
        return {
          ...prev,
          [activeSchoolId]: {
            students: [
              { id: '1', name: 'Ahmad Raza', roll: '01', className: 'Class 10-A', status: 'Present', borrowedBooks: ['Physics Vol 1', 'Advanced Mathematics'], bookedTransport: 'Route A', hostelStatus: 'Room 101' },
              { id: '2', name: 'Zainab Fatima', roll: '02', className: 'Class 10-A', status: 'Present', borrowedBooks: ['English Literature'], bookedTransport: 'Route B', hostelStatus: 'Day Scholar' },
              { id: '3', name: 'Muhammad Ali', roll: '03', className: 'Class 9-A', status: 'Absent', borrowedBooks: [], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
              { id: '4', name: 'Sarah Khan', roll: '04', className: 'Class 10-A', status: 'Present', borrowedBooks: ['Biology Concepts'], bookedTransport: 'Route A', hostelStatus: 'Room 102' },
              { id: '5', name: 'Omer Farooq', roll: '05', className: 'Class 8-B', status: 'Present', borrowedBooks: [], bookedTransport: 'Route C', hostelStatus: 'Day Scholar' },
              { id: '6', name: 'Ayesha Tariq', roll: '06', className: 'Class 10-A', status: 'Present', borrowedBooks: ['Chemistry Essentials'], bookedTransport: 'None', hostelStatus: 'Room 205' },
              { id: '7', name: 'Usman Ghani', roll: '07', className: 'Class 9-A', status: 'Present', borrowedBooks: ['World History'], bookedTransport: 'Route B', hostelStatus: 'Day Scholar' },
              { id: '8', name: 'Fatima Noor', roll: '08', className: 'Class 10-B', status: 'Present', borrowedBooks: [], bookedTransport: 'Route D', hostelStatus: 'Room 110' },
              { id: '9', name: 'Bilal Ahmed', roll: '09', className: 'Class 8-A', status: 'Absent', borrowedBooks: ['Intro to Computer Science'], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
              { id: '10', name: 'Khadija Umar', roll: '10', className: 'Class 10-A', status: 'Present', borrowedBooks: ['Geography Workbook'], bookedTransport: 'Route A', hostelStatus: 'Day Scholar' }
            ],
            waitingList: [],
            teachers: [
              { id: '1', name: 'Dr. Sajid Malik', subject: 'General Science', className: 'Class 10-A', status: 'Active' },
              { id: '2', name: 'Mrs. Huma Shah', subject: 'Mathematics', className: 'Class 9-A', status: 'Active' }
            ],
            notices: [
              { id: '1', date: '2026-06-12', title: `Welcome to ${schoolName}`, content: `Congratulations on launching the new portal for ${schoolName} in ${city}!` }
            ],
            leaves: [],
            invoices: [
              { id: 'INV-1001', student: 'Ahmad Raza', amount: 5000, status: 'Unpaid' },
              { id: 'INV-1002', student: 'Zainab Fatima', amount: 5000, status: 'Paid' }
            ],
            assignments: [
              { 
                id: 'demo-1', 
                title: 'Demo Class Homework Assignment', 
                subject: 'English', 
                publishDate: '2026-06-05', 
                dueDate: '2026-06-25', 
                fileName: 'demo_assignment_guidelines.pdf', 
                fileType: 'pdf', 
                status: 'Published', 
                fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4gPj4gPj4gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNjAgPj4Kc3RyZWFtCkJUCi9GMSAxNCBUZgo1MCA3NTAgVGQKKEFjYWRlbWljIEh1YiAtIERlbW8gUGFzdCBQYXBlciBhbmQgSG9tZXdvcmsgQXNzaWdubWVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMjQgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA1IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgozMzMKJSVFT0Y='
              }
            ],
            disciplines: [],
            parentMessages: []
          }
        };
      });
    }
  }, [activeSchoolId, currentSchool]);

  const schoolDb = database[activeSchoolId] || {
    students: [] as any[],
    waitingList: [] as any[],
    teachers: [] as any[],
    notices: [] as any[],
    leaves: [],
    invoices: [],
    assignments: [
      { 
        id: 'demo-1', 
        title: 'Demo Class Homework Assignment', 
        subject: 'English', 
        publishDate: '2026-06-05', 
        dueDate: '2026-06-25', 
        fileName: 'demo_assignment_guidelines.pdf', 
        fileType: 'pdf', 
        status: 'Published', 
        fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4gPj4gPj4gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNjAgPj4Kc3RyZWFtCkJUCi9GMSAxNCBUZgo1MCA3NTAgVGQKKEFjYWRlbWljIEh1YiAtIERlbW8gUGFzdCBQYXBlciBhbmQgSG9tZXdvcmsgQXNzaWdubWVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMjQgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA1IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgozMzMKJSVFT0Y='
      }
    ],
    disciplines: [],
    parentMessages: [],
    classes: CLASSES_LIST,
    subjects: SUBJECTS_LIST,
    foodCert: null
  };

  const students = schoolDb.students;
  const waitingList = schoolDb.waitingList || [];
  const teachers = schoolDb.teachers;
  const notices = schoolDb.notices;
  const leaves = schoolDb.leaves;
  const invoices = schoolDb.invoices;
  const assignments = schoolDb.assignments;
  const disciplines = schoolDb.disciplines;
  const parentMessages = schoolDb.parentMessages;
  const schoolClasses = schoolDb.classes || CLASSES_LIST;
  const schoolSubjects = schoolDb.subjects || SUBJECTS_LIST;
  const minAdmissionAge = schoolDb.minAdmissionAge || 3;

  // Level-aware class filtering
  const schoolLevel = currentSchool?.schoolLevel || 'both';
  const filteredClasses = React.useMemo(() => {
    if (schoolLevel === 'primary') return schoolClasses.filter(c => PRIMARY_CLASSES.includes(c));
    if (schoolLevel === 'secondary') return schoolClasses.filter(c => SECONDARY_CLASSES.includes(c));
    // 'both' → filter by active section
    if (activeSection === 'primary') return schoolClasses.filter(c => PRIMARY_CLASSES.includes(c));
    return schoolClasses.filter(c => SECONDARY_CLASSES.includes(c));
  }, [schoolLevel, activeSection, schoolClasses]);

  // Level-aware student filtering (only show students whose class is in filtered list)
  const filteredStudents = React.useMemo(() => students.filter(s => filteredClasses.includes(s.className)), [students, filteredClasses]);
  const filteredTeachers = React.useMemo(() => teachers.filter(t => filteredClasses.includes(t.className) || t.className === 'N/A'), [teachers, filteredClasses]);

  const foodCert = schoolDb.foodCert || {
    authority: 'Punjab Food Authority',
    licenseCode: 'PFA-LHR-2026-8942',
    grade: 'A+ Excellent',
    status: 'Valid',
    issueDate: '2026-01-10',
    expiryDate: '2026-12-31'
  };

  const activeStudentName = currentUser?.role === 'student' || currentUser?.role === 'parent'
    ? (currentUser?.name || students[0]?.name || 'Student')
    : (selectedReportStudent || currentUser?.name || students[0]?.name || 'Student');
  const activeStudent = students.find(s => s.name === activeStudentName) || students[0] || { id: '1', name: currentUser?.name || 'Student', roll: '12', className: 'Class 10-A', status: 'Present' };

  // Sync state updaters to target the selected tenant database partition
  const updateSchoolDb = (key: string, updater: any) => {
    setDatabase(prev => {
      const current = prev[activeSchoolId] || prev['11111111-1111-1111-1111-111111111111'];
      const updatedValue = typeof updater === 'function' ? updater(current[key as keyof typeof current]) : updater;
      const updatedDb = {
        ...prev,
        [activeSchoolId]: {
          ...current,
          [key]: updatedValue
        }
      };
      updateRealtimeData('school_database', updatedDb);
      return updatedDb;
    });
  };

  const setStudents = (val: any) => updateSchoolDb('students', val);
  const setWaitingList = (val: any) => updateSchoolDb('waitingList', val);
  const setTeachers = (val: any) => updateSchoolDb('teachers', val);
  const setNotices = (val: any) => updateSchoolDb('notices', val);
  const setLeaves = (val: any) => updateSchoolDb('leaves', val);
  const setInvoices = (val: any) => updateSchoolDb('invoices', val);
  const setAssignments = (val: any) => updateSchoolDb('assignments', val);
  const setDisciplines = (val: any) => updateSchoolDb('disciplines', val);
  const setParentMessages = (val: any) => updateSchoolDb('parentMessages', val);
  const setFoodCert = (val: any) => updateSchoolDb('foodCert', val);
  const setSchoolClasses = (val: any) => updateSchoolDb('classes', val);
  const setSchoolSubjects = (val: any) => updateSchoolDb('subjects', val);
  const setMinAdmissionAge = (val: any) => updateSchoolDb('minAdmissionAge', val);

  const [completedAssignments, setCompletedAssignments] = useState<string[]>([]);
  const [principalNotifications, setPrincipalNotifications] = useState<string[]>([
    "VP logged Late Arrival warning for Kamran Shah.",
    "VP approved 1-day casual leave for Raza Ahmed."
  ]);

  // Realtime Sync Subscription with Firebase RTDB
  React.useEffect(() => {
    const unsubscribeDb = setupRealtimeSync('school_database', (data) => {
      if (data) {
        setDatabase(data);
      } else {
        // Seed database if empty
        updateRealtimeData('school_database', database);
      }
    });

    const unsubscribeLinks = setupRealtimeSync('useful_links', (data) => {
      if (data && Array.isArray(data)) {
        setUsefulLinks(data);
      } else {
        // Seed links if empty
        updateRealtimeData('useful_links', usefulLinks);
      }
    });

    // Listen to local mocked updates when Firebase is down/unauthenticated
    const handleMockUpdate = (event: any) => {
      const { path, data } = event.detail;
      if (path === 'school_database') {
        setDatabase(data);
      } else if (path === 'useful_links') {
        setUsefulLinks(data);
      }
    };
    window.addEventListener('ah_mock_db_update', handleMockUpdate);

    return () => {
      unsubscribeDb();
      unsubscribeLinks();
      window.removeEventListener('ah_mock_db_update', handleMockUpdate);
    };
  }, []);
  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeekStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const calendarStore = useCalendarStore();
  const { isWeekend, getTomorrow24h } = calendarStore;

  const [activeVideoStreamUrl, setActiveVideoStreamUrl] = useState<string | null>(null);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentSubject, setNewAssignmentSubject] = useState('Physics');
  const [newAssignmentPublishDate, setNewAssignmentPublishDate] = useState(todayStr);
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState(nextWeekStr);
  const [newAssignmentFileName, setNewAssignmentFileName] = useState('');
  const [newAssignmentFileType, setNewAssignmentFileType] = useState('pdf');
  const [newAssignmentFileUrl, setNewAssignmentFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [leaveFormDate, setLeaveFormDate] = useState('');
  const [leaveFormError, setLeaveFormError] = useState('');

  // Form Inputs
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('All');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editStudentForm, setEditStudentForm] = useState<any>({});
  
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 4) setInitialLoadDone(true);
    };

    onValue(ref(database, 'countries'), (snap) => {
      if (snap.exists()) setCountries(snap.val());
      else set(ref(database, 'countries'), countries);
      checkLoaded();
    }, { onlyOnce: true });

    onValue(ref(database, 'organizations'), (snap) => {
      if (snap.exists()) setOrganizations(snap.val());
      else set(ref(database, 'organizations'), organizations);
      checkLoaded();
    }, { onlyOnce: true });

    onValue(ref(database, 'campuses'), (snap) => {
      if (snap.exists()) setSchoolsList(snap.val());
      else set(ref(database, 'campuses'), schoolsList);
      checkLoaded();
    }, { onlyOnce: true });

    onValue(ref(database, 'apiKeys'), (snap) => {
      if (snap.exists()) setApiKeys(snap.val());
      else set(ref(database, 'apiKeys'), apiKeys);
      checkLoaded();
    }, { onlyOnce: true });
  }, []);

  useEffect(() => {
    if (initialLoadDone) set(ref(database, 'countries'), countries);
  }, [countries, initialLoadDone]);

  useEffect(() => {
    if (initialLoadDone) set(ref(database, 'organizations'), organizations);
  }, [organizations, initialLoadDone]);

  useEffect(() => {
    if (initialLoadDone) set(ref(database, 'campuses'), schoolsList);
  }, [schoolsList, initialLoadDone]);

  useEffect(() => {
    if (initialLoadDone) set(ref(database, 'apiKeys'), apiKeys);
  }, [apiKeys, initialLoadDone]);

  const [secureDeletePrompt, setSecureDeletePrompt] = useState<{isOpen: boolean, entityType: string, entityId: string, entityName: string, passwordAttempt: string, error: string} | null>(null);
  const MASTER_PASSWORD = 'superadmin';
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null);
  const [editCountryForm, setEditCountryForm] = useState<any>({});
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [editOrgForm, setEditOrgForm] = useState<any>({});
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState([{id: '1', appName: 'ZK Teco Biometrics Sync', key: 'sk_live_1234567890abcdefa49b', date: '2026-05-10'}, {id: '2', appName: 'QuickBooks Finance API', key: 'sk_live_0987654321fedcba8f2c', date: '2026-06-01'}]);
  const [isAddingApiKey, setIsAddingApiKey] = useState(false);
  const [newApiKeyForm, setNewApiKeyForm] = useState({appName: '', key: ''});

  const [editSchoolForm, setEditSchoolForm] = useState<any>({});

  const [activeStudentTab, setActiveStudentTab] = useState<'roster' | 'waitlist'>('roster');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Class 10-A');
  const [newStudentAge, setNewStudentAge] = useState('');
  const [newStudentMarks, setNewStudentMarks] = useState('');
  const [enrollmentError, setEnrollmentError] = useState('');

  const [newTeacherName, setNewTeacherName] = useState('');
    const [newTeacherGender, setNewTeacherGender] = useState('Male');
  const [newEmployeeRole, setNewEmployeeRole] = useState('Teacher');
  const [newTeacherSubject, setNewTeacherSubject] = useState(schoolSubjects[0] || '');
  const [newTeacherClass, setNewTeacherClass] = useState(schoolClasses[0] || '');
  const [newTeacherQualification, setNewTeacherQualification] = useState('');
  const [newTeacherSalary, setNewTeacherSalary] = useState('');
  const [newTeacherExperience, setNewTeacherExperience] = useState('Fresh');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');
  const [newTeacherPhoto, setNewTeacherPhoto] = useState<string | null>(null);
  const [newTeacherDoc, setNewTeacherDoc] = useState<string | null>(null);
  const [selectedDetailedTeacher, setSelectedDetailedTeacher] = useState<any | null>(null);
  const [recycleBin, setRecycleBin] = useState<{ id: string; type: 'teacher' | 'student'; data: any; labelName: string }[]>([]);

  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');

  const [newInvoiceStudent, setNewInvoiceStudent] = useState('Kamran Shah');
  const [newInvoiceAmount, setNewInvoiceAmount] = useState('8500');
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [editingInvoiceStudent, setEditingInvoiceStudent] = useState('');
  const [editingInvoiceAmount, setEditingInvoiceAmount] = useState('');
  const [editingInvoiceStatus, setEditingInvoiceStatus] = useState<'Paid' | 'Unpaid'>('Unpaid');

  const [newDisciplineStudent, setNewDisciplineStudent] = useState('Kamran Shah');
  const [newDisciplineInfraction, setNewDisciplineInfraction] = useState('');
  const [newDisciplineAction, setNewDisciplineAction] = useState('Warning Issued');

  const [newParentMessageStudent, setNewParentMessageStudent] = useState('Kamran Shah');
  const [newParentMessageSubject, setNewParentMessageSubject] = useState('');
  const [newParentMessageText, setNewParentMessageText] = useState('');
  const [newParentMessageImage, setNewParentMessageImage] = useState<string | null>(null);

  const [newSetupClass, setNewSetupClass] = useState('');
  const [newSetupSubject, setNewSetupSubject] = useState('');
  const [newSetupMinAge, setNewSetupMinAge] = useState(minAdmissionAge.toString());

  // Student Advanced Features States
  const [studentGoals, setStudentGoals] = useState([
    { id: '1', title: 'Score 90% in Physics Final', status: 'In Progress', progress: 65 },
    { id: '2', title: 'Perfect Attendance in Q3', status: 'In Progress', progress: 85 },
    { id: '3', title: 'Complete Science Project', status: 'Completed', progress: 100 }
  ]);
  const [studentCertificates] = useState([
    { id: 'cert-1', title: 'Science Fair Winner 2026', issueDate: '2026-05-15', issuer: 'Academic Hub Board' },
    { id: 'cert-2', title: 'Q1 Outstanding Attendance', issueDate: '2026-04-01', issuer: 'Kamran Shah Principal' }
  ]);
  const [studyTasks, setStudyTasks] = useState([
    { id: 'task-1', title: 'Read Chemistry Ch 4', date: '2026-06-14', time: '18:00', completed: false },
    { id: 'task-2', title: 'Math Worksheet', date: '2026-06-15', time: '16:00', completed: false }
  ]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newStudyTaskTitle, setNewStudyTaskTitle] = useState('');
  const [aiChatQuery, setAiChatQuery] = useState('');
  const [aiChatResponses, setAiChatResponses] = useState<{ query: string, response: string }[]>([
    { query: 'Explain Newton\'s First Law', response: 'Newton\'s First Law of Motion states that an object will remain at rest or in uniform motion in a straight line unless acted upon by an external force. This is also known as the Law of Inertia.' }
  ]);

  // Academic Hub AI Studio & Gateway settings states
  const [studioCampaignType, setStudioCampaignType] = useState('admission');
  const [studioLanguage, setStudioLanguage] = useState('English');
  const [studioChannel, setStudioChannel] = useState('Facebook');
  const [studioGeneratedCaption, setStudioGeneratedCaption] = useState('');
  const [studioGeneratedHashtags, setStudioGeneratedHashtags] = useState('');
  const [studioLoading, setStudioLoading] = useState(false);
  const [studioPrompt, setStudioPrompt] = useState('');
  const [studioSavedPosts, setStudioSavedPosts] = useState<any[]>([]);
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
  const [firebaseApiKey, setFirebaseApiKey] = useState('');
  const [firebaseAuthDomain, setFirebaseAuthDomain] = useState('');
  const [firebaseDbUrl, setFirebaseDbUrl] = useState('');
  const [firebaseProjectId, setFirebaseProjectId] = useState('');
  const [firebaseStorageBucket, setFirebaseStorageBucket] = useState('');
  const [firebaseMessagingId, setFirebaseMessagingId] = useState('');
  const [firebaseAppId, setFirebaseAppId] = useState('');

  // Pre-fill if custom config exists
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('ah_custom_firebase_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFirebaseApiKey(parsed.apiKey || '');
        setFirebaseAuthDomain(parsed.authDomain || '');
        setFirebaseDbUrl(parsed.databaseURL || '');
        setFirebaseProjectId(parsed.projectId || '');
        setFirebaseStorageBucket(parsed.storageBucket || '');
        setFirebaseMessagingId(parsed.messagingSenderId || '');
        setFirebaseAppId(parsed.appId || '');
      }
    } catch(e) {}
  }, []);

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseApiKey) return;
    const newConfig = {
      apiKey: firebaseApiKey,
      authDomain: firebaseAuthDomain,
      databaseURL: firebaseDbUrl,
      projectId: firebaseProjectId,
      storageBucket: firebaseStorageBucket,
      messagingSenderId: firebaseMessagingId,
      appId: firebaseAppId
    };
    localStorage.setItem('ah_custom_firebase_config', JSON.stringify(newConfig));
    alert('Firebase Database Configuration saved! The system will now reload to apply the new database connection.');
    window.location.reload();
  };

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
    { id: '1', timestamp: '2026-06-10 19:45:12', user: 'superadmin', action: 'Created new school: Allied School Campus A' },
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
      const currentSchoolName = currentSchool?.schoolName || "Central Elite Grammar School";
      const hasLogo = !!currentSchool?.logoUrl;
      const logoHtml = hasLogo 
        ? `<img src="${currentSchool.logoUrl}" style="height: 65px; object-fit: contain; margin-bottom: 12px; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.08));" />`
        : `<div style="margin-bottom: 12px; display: inline-flex; justify-content: center; align-items: center; width: 60px; height: 60px; border-radius: 50%; border: 2px solid currentColor; font-size: 24px; font-weight: bold; background: rgba(0,0,0,0.03);">🎓</div>`;
      
      const primaryHsl = currentSchool?.themeSettings?.primaryHsl || '263.4 70% 50.4%';
      const secondaryHsl = currentSchool?.themeSettings?.secondaryHsl || '217.2 32.6% 16%';

      const primaryHslFormatted = toCommaHsl(primaryHsl);
      const secondaryHslFormatted = toCommaHsl(secondaryHsl);
      let themePrimary = `hsl(${primaryHslFormatted})`;
      let themeAccent = `hsl(${secondaryHslFormatted})`;
      let themeAccentLight = `hsla(${primaryHslFormatted.split(',')[0]}, 70%, 97%, 0.95)`;
      let themeSeal = `radial-gradient(circle, hsla(${primaryHslFormatted.split(',')[0]}, 80%, 75%, 0.9) 0%, hsl(${secondaryHslFormatted}) 100%)`;
      reportTitle = `${currentSchoolName} - Student Progress Card`;

      let gradesRowsHtml = "";
      let totalM = 0;
      let totalMax = 0;
      const currentGrades = studentGrades[activeStudentName] || [];
      
      if (examStatus === 'Upcoming') {
        currentGrades.forEach(g => {
          gradesRowsHtml += `<tr style="border-bottom: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">
              <td style="padding: 10px 14px; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">${g.subject}</td>
              <td style="padding: 10px 14px; text-align: center; font-style: italic; color: #94a3b8; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">-</td>
              <td style="padding: 10px 14px; text-align: center; font-family: monospace; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">${g.total}</td>
              <td style="padding: 10px 14px; text-align: center; color: #94a3b8; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">-</td>
              <td style="padding: 10px 14px; text-align: center; font-weight: 800; color: #94a3b8; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">-</td>
              <td style="padding: 10px 14px; text-align: right; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);"><span style="background: #f1f5f9; color: #64748b; padding: 2px 8px; font-weight: bold; border-radius: 12px; font-size: 9px;">Due</span></td>
            </tr>`;
          totalMax += g.total;
        });
        gradesRowsHtml += `<tr style="background: #f8fafc; font-weight: bold; border-top: 2px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 80%, 0.6);">
            <td style="padding: 10px 14px; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4); font-weight: 800;">Total Summary</td>
            <td style="padding: 10px 14px; text-align: center; font-style: italic; color: #94a3b8; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">-</td>
            <td style="padding: 10px 14px; text-align: center; font-family: monospace; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4); font-weight: 800;">${totalMax}</td>
            <td style="padding: 10px 14px; text-align: center; color: #94a3b8; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">-</td>
            <td style="padding: 10px 14px; text-align: center; font-weight: 800; color: #94a3b8; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">-</td>
            <td style="padding: 10px 14px; text-align: right; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);"><span style="background: #f1f5f9; color: #64748b; padding: 2px 8px; font-weight: bold; border-radius: 12px; font-size: 9px;">Due</span></td>
          </tr>`;
      } else {
        currentGrades.forEach(g => {
          const pct = ((g.marks / g.total) * 100).toFixed(1);
          const statusBg = g.status === 'Pass' ? '#e2fbf0' : '#fee2e2';
          const statusColor = g.status === 'Pass' ? '#10b981' : '#ef4444';
          gradesRowsHtml += `<tr style="border-bottom: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">
              <td style="padding: 10px 14px; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">${g.subject}</td>
              <td style="padding: 10px 14px; text-align: center; font-family: monospace; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">${g.marks}</td>
              <td style="padding: 10px 14px; text-align: center; font-family: monospace; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">${g.total}</td>
              <td style="padding: 10px 14px; text-align: center; font-family: monospace; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">${pct}%</td>
              <td style="padding: 10px 14px; text-align: center; font-weight: 800; color: ${themeAccent}; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">${g.grade}</td>
              <td style="padding: 10px 14px; text-align: right; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);"><span style="background: ${statusBg}; color: ${statusColor}; padding: 2px 8px; font-weight: bold; border-radius: 12px; font-size: 9px;">${g.status}</span></td>
            </tr>`;
          totalM += g.marks;
          totalMax += g.total;
        });
        const overallPct = totalMax > 0 ? ((totalM / totalMax) * 100).toFixed(1) : '0.0';
        const numP = parseFloat(overallPct);
        let totalGrade = 'F';
        if (numP >= 90) totalGrade = 'A+';
        else if (numP >= 80) totalGrade = 'A';
        else if (numP >= 70) totalGrade = 'B+';
        else if (numP >= 60) totalGrade = 'B';
        else if (numP >= 50) totalGrade = 'C';
        const statusBg = numP >= 50 ? '#e2fbf0' : '#fee2e2';
        const statusColor = numP >= 50 ? '#10b981' : '#ef4444';
        const statusLabel = numP >= 50 ? 'Pass' : 'Fail';
        gradesRowsHtml += `<tr style="background: #f8fafc; font-weight: bold; border-top: 2px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 80%, 0.6);">
            <td style="padding: 10px 14px; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4); font-weight: 800;">Total Summary</td>
            <td style="padding: 10px 14px; text-align: center; font-family: monospace; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4); font-weight: 800; color: ${themePrimary};">${totalM}</td>
            <td style="padding: 10px 14px; text-align: center; font-family: monospace; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4); font-weight: 800;">${totalMax}</td>
            <td style="padding: 10px 14px; text-align: center; font-family: monospace; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4); font-weight: 800;">${overallPct}%</td>
            <td style="padding: 10px 14px; text-align: center; font-weight: 800; color: ${themeAccent}; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">${totalGrade}</td>
            <td style="padding: 10px 14px; text-align: right; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);"><span style="background: ${statusBg}; color: ${statusColor}; padding: 2px 8px; font-weight: bold; border-radius: 12px; font-size: 9px;">${statusLabel}</span></td>
          </tr>`;
      }

      reportHtml = `
        <div class="print-container" style="
          border: 3px solid ${themePrimary};
          outline: 1px solid ${themeAccent};
          outline-offset: -8px;
          padding: 45px 55px; 
          font-family: 'Outfit', 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif; 
          color: #1e293b; 
          background: #ffffff; 
          max-width: 920px; 
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
                <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: ${themePrimary}; letter-spacing: -0.5px; line-height: 1.2;">${currentSchoolName}</h1>
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
          <div style="display: grid; grid-template-columns: 1.55fr 1fr; gap: 24px; margin-bottom: 24px; align-items: stretch;">
            <!-- Left Side: Roster Table -->
            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 800; color: #334155; uppercase tracking-wide;">Academic Grades Summary</h3>
              <div className="w-full overflow-x-auto pb-2"><table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1.5px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 80%, 0.5); border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.01);">
                <thead>
                  <tr style="background: ${themePrimary}; color: #ffffff;">
                    <th style="padding: 10px 14px; text-align: left; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Subject</th>
                    <th style="padding: 10px 14px; text-align: center; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Obtained</th>
                    <th style="padding: 10px 14px; text-align: center; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Total</th>
                    <th style="padding: 10px 14px; text-align: center; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Percentage</th>
                    <th style="padding: 10px 14px; text-align: center; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Grade</th>
                    <th style="padding: 10px 14px; text-align: right; font-weight: 700; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4);">Result</th>
                  </tr>
                </thead>
                <tbody style="background: #ffffff; color: #334155;">
                  ${gradesRowsHtml}
                </tbody>
              </table></div>
            </div>

            <!-- Right Side: Performance Gauges -->
            <div style="display: flex; flex-direction: column; height: 100%;">
              <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 800; color: #334155; uppercase tracking-wide;">Performance Metrics</h3>
              <div style="
                background: #fafafa; 
                border: 1px solid #f1f5f9; 
                padding: 20px; 
                border-radius: 16px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex-grow: 1;
                gap: 16px;
              ">
                
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
                    flex-shrink: 0;
                  ">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 900; color: ${themePrimary}; line-height: 50px; text-align: center;">
                      89.6%
                    </div>
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <span style="display: block; font-size: 10px; font-weight: 800; color: #64748b; uppercase; letter-spacing: 0.5px;">Class Average</span>
                    <strong style="font-size: 13px; color: #0f172a; display: block; margin-top: 2px; white-space: nowrap;">89.6% Overall Marks</strong>
                  </div>
                </div>

                <!-- Attendance Bar -->
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: #64748b; uppercase; margin-bottom: 6px;">
                    <span style="letter-spacing: 0.5px;">Attendance Rate</span>
                    <span style="color: #10b981; white-space: nowrap;">96.5% Present</span>
                  </div>
                  <div style="height: 8px; width: 100%; background: #e2e8f0; border-radius: 10px; overflow: hidden;">
                    <div style="height: 100%; width: 96.5%; background: #10b981; border-radius: 10px;"></div>
                  </div>
                </div>

                <!-- Honors status badge -->
                <div style="background: ${themeAccentLight}; border: 1px solid hsla(${primaryHslFormatted.split(',')[0]}, 70%, 90%, 0.4); padding: 12px; border-radius: 12px; text-align: center; display: flex; flex-direction: column; gap: 4px; align-items: center; justify-content: center;">
                  <span style="font-size: 9px; font-weight: 850; color: ${themeAccent}; uppercase tracking-wider block">HONOR ROLL INSIGNIA</span>
                  <strong style="font-size: 10.5px; color: ${themePrimary}; display: block; white-space: nowrap;">Dean's List Placement Candidate</strong>
                </div>
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
      const currentSchoolName = currentSchool?.schoolName || "Central Elite Grammar School";
      const hasLogo = !!currentSchool?.logoUrl;
      const logoHtml = hasLogo 
        ? `<img src="${currentSchool.logoUrl}" style="height: 50px; object-fit: contain; margin-bottom: 10px;" />`
        : `<span style="font-size: 20px;">🎓</span>`;

      // Theme logic fallback
      let themePrimary = '#1e1b4b'; 
      let themeBorder = '4px solid #1e1b4b';
      if (currentSchoolName.includes('Dar-e-Arqam')) {
        themePrimary = '#064e3b';
        themeBorder = '4px solid #064e3b';
      } else if (currentSchoolName.includes('Beaconhouse')) {
        themePrimary = '#1e3a8a';
        themeBorder = '4px solid #1e3a8a';
      } else if (currentSchoolName.includes('Educators')) {
        themePrimary = '#1d4ed8';
        themeBorder = '4px solid #1d4ed8';
      }

      reportTitle = `${currentSchoolName} - Revenue Audit Report`;
      reportHtml = `
        <div style="border: ${themeBorder}; padding: 35px; font-family: 'Inter', system-ui, sans-serif; color: #1e293b; background: #fafaf9; max-width: 800px; margin: 0 auto; border-radius: 6px;">
          <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
            ${logoHtml}
            <h1 style="margin: 5px 0 0 0; font-size: 24px; color: ${themePrimary}; font-weight: 800; text-transform: uppercase;">${currentSchoolName}</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Consolidated Operational Roster & Revenue Audit</p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8; font-style: italic;">System generated audit logs: ${currentDate}</p>
          </div>

          <div className="w-full overflow-x-auto pb-2"><table style="width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 13px; border: 1px solid #e2e8f0;">
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
          </table></div>
          
          <div style="margin-top: 25px; font-size: 13px; font-weight: bold; text-align: right; color: ${themePrimary};">
            Consolidated Network Margin: 30.3% Active ERP Flow
          </div>
        </div>
      `;
    } else if (reportType === 'financial_statement') {
      const currentSchoolName = currentSchool?.schoolName || "Central Elite Grammar School";
      const hasLogo = !!currentSchool?.logoUrl;
      const logoHtml = hasLogo 
        ? `<img src="${currentSchool.logoUrl}" style="height: 50px; object-fit: contain; margin-bottom: 10px;" />`
        : `<span style="font-size: 20px;">🎓</span>`;

      // Theme logic fallback
      let themePrimary = '#1e1b4b'; 
      let themeBorder = '4px solid #1e1b4b';
      if (currentSchoolName.includes('Dar-e-Arqam')) {
        themePrimary = '#064e3b';
        themeBorder = '4px solid #064e3b';
      } else if (currentSchoolName.includes('Beaconhouse')) {
        themePrimary = '#1e3a8a';
        themeBorder = '4px solid #1e3a8a';
      } else if (currentSchoolName.includes('Educators')) {
        themePrimary = '#1d4ed8';
        themeBorder = '4px solid #1d4ed8';
      }

      reportTitle = `${currentSchoolName} - Operations Cash-Flow Balance Statement`;
      reportHtml = `
        <div style="border: ${themeBorder}; padding: 35px; font-family: 'Inter', system-ui, sans-serif; color: #1e293b; background: #fafaf9; max-width: 800px; margin: 0 auto; border-radius: 6px;">
          <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
            ${logoHtml}
            <h1 style="margin: 5px 0 0 0; font-size: 24px; color: ${themePrimary}; font-weight: 800; text-transform: uppercase;">${currentSchoolName}</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Double-Entry Operations Ledger & Balance Sheet</p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8; font-style: italic;">Statement Generated Date: ${currentDate}</p>
          </div>

          <div className="w-full overflow-x-auto pb-2"><table style="width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 13px; border: 1px solid #e2e8f0;">
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
          </table></div>
        </div>
      `;
    } else if (reportType === 'leads_funnel') {
      const currentSchoolName = currentSchool?.schoolName || "Central Elite Grammar School";
      const hasLogo = !!currentSchool?.logoUrl;
      const logoHtml = hasLogo 
        ? `<img src="${currentSchool.logoUrl}" style="height: 50px; object-fit: contain; margin-bottom: 10px;" />`
        : `<span style="font-size: 20px;">🎓</span>`;

      // Theme logic fallback
      let themePrimary = '#1e1b4b'; 
      let themeBorder = '4px solid #1e1b4b';
      if (currentSchoolName.includes('Dar-e-Arqam')) {
        themePrimary = '#064e3b';
        themeBorder = '4px solid #064e3b';
      } else if (currentSchoolName.includes('Beaconhouse')) {
        themePrimary = '#1e3a8a';
        themeBorder = '4px solid #1e3a8a';
      } else if (currentSchoolName.includes('Educators')) {
        themePrimary = '#1d4ed8';
        themeBorder = '4px solid #1d4ed8';
      }

      reportTitle = `${currentSchoolName} - Prospective Leads CRM Funnel`;
      reportHtml = `
        <div style="border: ${themeBorder}; padding: 35px; font-family: 'Inter', system-ui, sans-serif; color: #1e293b; background: #fafaf9; max-width: 800px; margin: 0 auto; border-radius: 6px;">
          <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
            ${logoHtml}
            <h1 style="margin: 5px 0 0 0; font-size: 24px; color: ${themePrimary}; font-weight: 800; text-transform: uppercase;">${currentSchoolName}</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Admission Inquiries & CRM Leads Funnel Statement</p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8; font-style: italic;">Logs Generated Date: ${currentDate}</p>
          </div>

          <div className="w-full overflow-x-auto pb-2"><table style="width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 13px; border: 1px solid #e2e8f0;">
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
          </table></div>
        </div>
      `;
    } else if (reportType === 'timetable') {
      const currentSchoolName = currentSchool?.schoolName || "Central Elite Grammar School";
      const hasLogo = !!currentSchool?.logoUrl;
      const logoHtml = hasLogo 
        ? `<img src="${currentSchool.logoUrl}" style="height: 65px; object-fit: contain; margin-bottom: 12px; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.08));" />`
        : `<div style="margin-bottom: 12px; display: inline-flex; justify-content: center; align-items: center; width: 60px; height: 60px; border-radius: 50%; border: 2px solid currentColor; font-size: 24px; font-weight: bold; background: rgba(0,0,0,0.03);">🎓</div>`;
      
      const primaryHsl = currentSchool?.themeSettings?.primaryHsl || '263.4 70% 50.4%';
      const secondaryHsl = currentSchool?.themeSettings?.secondaryHsl || '217.2 32.6% 16%';

      const primaryHslFormatted = toCommaHsl(primaryHsl);
      const secondaryHslFormatted = toCommaHsl(secondaryHsl);

      let themePrimary = `hsl(${primaryHslFormatted})`;
      let themeAccent = `hsl(${secondaryHslFormatted})`;
      let themeAccentLight = `hsla(${primaryHslFormatted.split(',')[0]}, 70%, 97%, 0.95)`;

      reportTitle = `${currentSchoolName} - Weekly Class Timetable`;
      
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
                <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: ${themePrimary}; letter-spacing: -0.5px; line-height: 1.2;">${currentSchoolName}</h1>
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
          <div className="w-full overflow-x-auto pb-2"><table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; table-layout: fixed;">
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
          </table></div>

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
  
  const simulatedRole = currentUser?.role || 'student';
  
  const isEditor = !['student', 'parent'].includes(simulatedRole);

  const showSystemTelemetry = ['super_admin', 'org_owner', 'school_owner', 'admin'].includes(simulatedRole);

  const [usefulLinks, setUsefulLinks] = useState([
    { id: '1', title: 'Khan Academy', url: 'https://www.khanacademy.org', desc: 'Free online courses, lessons & practice for Maths and Science.', subject: 'Maths & Science' },
    { id: '2', title: 'BBC Bitesize', url: 'https://www.bbc.co.uk/bitesize', desc: 'Interactive curriculum-aligned study resources for school subjects.', subject: 'General Study' },
    { id: '3', title: 'British Council LearnEnglish', url: 'https://learnenglish.britishcouncil.org', desc: 'Free international resource hub to improve English skills.', subject: 'English' },
    { id: '4', title: 'National Geographic Education', url: 'https://www.nationalgeographic.org/society/education-resources/', desc: 'Premium international learning and science exploration resources.', subject: 'Science' }
  ]);
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkDesc, setNewLinkDesc] = useState('');
  const [newLinkSubject, setNewLinkSubject] = useState('Maths');

  const updateUsefulLinksState = (updater: any) => {
    setUsefulLinks(prev => {
      const updatedVal = typeof updater === 'function' ? updater(prev) : updater;
      updateRealtimeData('useful_links', updatedVal);
      return updatedVal;
    });
  };

  const getTrackerData = () => {
    switch (simulatedRole) {
      case 'student':
      case 'parent':
        return {
          title: 'Student Study Tracker',
          mainLabel: 'Weekly Active Study Time',
          mainValue: '12.5 Hours',
          bars: [
            { label: 'M', value: '2h', percent: '50%' },
            { label: 'T', value: '3h', percent: '75%' },
            { label: 'W', value: '1.5h', percent: '37.5%' },
            { label: 'T', value: '4h', percent: '100%' },
            { label: 'F', value: '2h', percent: '50%' }
          ],
          stats: [
            { icon: '★', text: 'GPA: A- Average', colorClass: 'text-primary' },
            { icon: '✓', text: '94% Attendance', colorClass: 'text-primary' },
            { icon: '🗂', text: '2 Due Soon', colorClass: 'text-primary' },
            { icon: '🏆', text: 'Top 10% Rank', colorClass: 'text-primary' }
          ],
          footer: 'Telemetry Logged'
        };
      case 'teacher':
        return {
          title: 'Classroom Analytics Tracker',
          mainLabel: 'Weekly Grading Turnaround',
          mainValue: '96.2%',
          bars: [
            { label: 'Mon', value: '14 gr', percent: '65%' },
            { label: 'Tue', value: '22 gr', percent: '90%' },
            { label: 'Wed', value: '12 gr', percent: '55%' },
            { label: 'Thu', value: '25 gr', percent: '100%' },
            { label: 'Fri', value: '18 gr', percent: '75%' }
          ],
          stats: [
            { icon: '📊', text: '92.4% Attendance', colorClass: 'text-emerald-400' },
            { icon: '✓', text: '3 active sections', colorClass: 'text-emerald-400' },
            { icon: '📝', text: '14 graded tasks', colorClass: 'text-emerald-400' },
            { icon: '📢', text: '3 notices published', colorClass: 'text-emerald-400' }
          ],
          footer: 'Classroom Telemetry Sync'
        };
      case 'librarian':
        return {
          title: 'Library Circulation Tracker',
          mainLabel: 'Weekly Circulation Rate',
          mainValue: '142 Books',
          bars: [
            { label: 'Mon', value: '14 checkout', percent: '50%' },
            { label: 'Tue', value: '28 checkout', percent: '95%' },
            { label: 'Wed', value: '12 checkout', percent: '45%' },
            { label: 'Thu', value: '20 checkout', percent: '70%' },
            { label: 'Fri', value: '30 checkout', percent: '100%' }
          ],
          stats: [
            { icon: '📚', text: '4,820 total books', colorClass: 'text-purple-400' },
            { icon: '✓', text: '142 active issues', colorClass: 'text-purple-400' },
            { icon: '⚠️', text: '8 overdue alerts', colorClass: 'text-purple-400' },
            { icon: '🛡️', text: '100% audit safe', colorClass: 'text-purple-400' }
          ],
          footer: 'Library Database Active'
        };
      case 'transport':
        return {
          title: 'Fleet Operations Tracker',
          mainLabel: 'Route Compliance Rate',
          mainValue: '98.8%',
          bars: [
            { label: 'Mon', value: '8 runs', percent: '80%' },
            { label: 'Tue', value: '10 runs', percent: '100%' },
            { label: 'Wed', value: '8 runs', percent: '80%' },
            { label: 'Thu', value: '9 runs', percent: '90%' },
            { label: 'Fri', value: '10 runs', percent: '100%' }
          ],
          stats: [
            { icon: '🚌', text: '12 vehicles active', colorClass: 'text-blue-400' },
            { icon: '👤', text: '8 drivers shift', colorClass: 'text-blue-400' },
            { icon: '📡', text: 'GPS telemetry link', colorClass: 'text-blue-400' },
            { icon: '✓', text: '240 pupils roster', colorClass: 'text-blue-400' }
          ],
          footer: 'GPS Link Stream Active'
        };
      case 'hostel':
        return {
          title: 'Hostel Occupancy Tracker',
          mainLabel: 'Hostel Capacity Utilization',
          mainValue: '93.3%',
          bars: [
            { label: 'Mon', value: '108 beds', percent: '85%' },
            { label: 'Tue', value: '112 beds', percent: '90%' },
            { label: 'Wed', value: '112 beds', percent: '90%' },
            { label: 'Thu', value: '114 beds', percent: '95%' },
            { label: 'Fri', value: '115 beds', percent: '100%' }
          ],
          stats: [
            { icon: '🏢', text: '60 rooms total', colorClass: 'text-amber-400' },
            { icon: '✓', text: '112 boarders synced', colorClass: 'text-amber-400' },
            { icon: '🛏️', text: '8 vacant beds', colorClass: 'text-amber-400' },
            { icon: '🍱', text: 'Mess menu active', colorClass: 'text-amber-400' }
          ],
          footer: 'Hostel Records Live'
        };
      case 'admissions':
        return {
          title: 'CRM Leads Funnel Tracker',
          mainLabel: 'Monthly Conversion Rate',
          mainValue: '33.3%',
          bars: [
            { label: 'Mon', value: '12 cold', percent: '60%' },
            { label: 'Tue', value: '15 cold', percent: '75%' },
            { label: 'Wed', value: '8 cold', percent: '40%' },
            { label: 'Thu', value: '20 cold', percent: '100%' },
            { label: 'Fri', value: '14 cold', percent: '70%' }
          ],
          stats: [
            { icon: '👤', text: '42 active leads', colorClass: 'text-indigo-400' },
            { icon: '📝', text: '8 applications rev', colorClass: 'text-indigo-400' },
            { icon: '📅', text: '3 interviews set', colorClass: 'text-indigo-400' },
            { icon: '✓', text: '14 enrollments done', colorClass: 'text-indigo-400' }
          ],
          footer: 'CRM Lead Center Active'
        };
      case 'accountant':
        return {
          title: 'Collections Efficiency Tracker',
          mainLabel: 'Fee Collection Progress',
          mainValue: '94.6%',
          bars: [
            { label: 'Mon', value: '24 chall', percent: '80%' },
            { label: 'Tue', value: '30 chall', percent: '100%' },
            { label: 'Wed', value: '15 chall', percent: '50%' },
            { label: 'Thu', value: '22 chall', percent: '73%' },
            { label: 'Fri', value: '28 chall', percent: '93%' }
          ],
          stats: [
            { icon: '💳', text: 'Rs 12.4k collected', colorClass: 'text-emerald-400' },
            { icon: '⚠️', text: '14 defaulter alerts', colorClass: 'text-emerald-400' },
            { icon: '🗂️', text: '42 unpaid invoices', colorClass: 'text-emerald-400' },
            { icon: '🛡️', text: 'Double-entry lock', colorClass: 'text-emerald-400' }
          ],
          footer: 'Finance Ledger Validated'
        };
      case 'hr':
        return {
          title: 'Staff Presence & HR Tracker',
          mainLabel: 'Employee Presence Rate',
          mainValue: '98.1%',
          bars: [
            { label: 'Mon', value: '110 staff', percent: '95%' },
            { label: 'Tue', value: '112 staff', percent: '98%' },
            { label: 'Wed', value: '111 staff', percent: '96%' },
            { label: 'Thu', value: '114 staff', percent: '100%' },
            { label: 'Fri', value: '113 staff', percent: '99%' }
          ],
          stats: [
            { icon: '👥', text: '114 staff active', colorClass: 'text-purple-400' },
            { icon: '📅', text: '2 leaves pending', colorClass: 'text-purple-400' },
            { icon: '⚙️', text: 'Bio-sync online', colorClass: 'text-purple-400' },
            { icon: '💼', text: '3 openings active', colorClass: 'text-purple-400' }
          ],
          footer: 'Staff Attendance Ledger'
        };
      case 'reception':
        return {
          title: 'Visitor Log Analytics Tracker',
          mainLabel: 'Visitor Front Desk Efficiency',
          mainValue: '100%',
          bars: [
            { label: 'Mon', value: '4 vis', percent: '50%' },
            { label: 'Tue', value: '8 vis', percent: '100%' },
            { label: 'Wed', value: '6 vis', percent: '75%' },
            { label: 'Thu', value: '5 vis', percent: '62%' },
            { label: 'Fri', value: '7 vis', percent: '87%' }
          ],
          stats: [
            { icon: '👤', text: '4 visitors checked', colorClass: 'text-cyan-400' },
            { icon: '📅', text: '2 appointments set', colorClass: 'text-cyan-400' },
            { icon: '💬', text: '5 inquiries pending', colorClass: 'text-cyan-400' },
            { icon: '✓', text: 'Gate logs clear', colorClass: 'text-cyan-400' }
          ],
          footer: 'Front Desk Logs Synced'
        };
      case 'vice_principal':
        return {
          title: 'Academic Progress Tracker',
          mainLabel: 'Lesson Compliance Index',
          mainValue: '82%',
          bars: [
            { label: 'Mon', value: '80%', percent: '80%' },
            { label: 'Tue', value: '85%', percent: '85%' },
            { label: 'Wed', value: '82%', percent: '82%' },
            { label: 'Thu', value: '90%', percent: '90%' },
            { label: 'Fri', value: '88%', percent: '88%' }
          ],
          stats: [
            { icon: '📖', text: 'Syllabus sync normal', colorClass: 'text-emerald-400' },
            { icon: '🏆', text: '89.2% passing ratio', colorClass: 'text-emerald-400' },
            { icon: '✓', text: '0 discipline cases', colorClass: 'text-emerald-400' },
            { icon: '🛡️', text: 'Protected status', colorClass: 'text-emerald-400' }
          ],
          footer: 'Academic Compliance Sync'
        };
      default:
        return {
          title: 'Campus Operations Tracker',
          mainLabel: 'Server Roster Synced Status',
          mainValue: '99.8% Healthy',
          bars: [
            { label: 'Mon', value: '1.2k', percent: '85%' },
            { label: 'Tue', value: '1.3k', percent: '92%' },
            { label: 'Wed', value: '1.2k', percent: '85%' },
            { label: 'Thu', value: '1.4k', percent: '98%' },
            { label: 'Fri', value: '1.4k', percent: '100%' }
          ],
          stats: [
            { icon: '⚡', text: '8 Sync Nodes', colorClass: 'text-emerald-400' },
            { icon: '✓', text: 'Backup Verified', colorClass: 'text-emerald-400' },
            { icon: '🌐', text: '100% API Uptime', colorClass: 'text-emerald-400' },
            { icon: '⚙', text: 'System v14.2', colorClass: 'text-emerald-400' }
          ],
          footer: 'Telemetry Logged'
        };
    }
  };

  const getOperationalStatusData = () => {
    const defaultText = `${spec.placeholderText || 'Classroom Manager active. Tap a class below to enter grades or homework.'} Secured and isolated. Regional parameters: ${currentSchool?.city || 'Lahore'}, ${COUNTRY_CONFIGS[currentSchool?.country || 'PK'].countryName} (Currency: ${COUNTRY_CONFIGS[currentSchool?.country || 'PK'].currency}, prefix: ${COUNTRY_CONFIGS[currentSchool?.country || 'PK'].phonePrefix}).`;
    
    switch (simulatedRole) {
      case 'transport':
        return {
          title: 'Transit & Fleet Status',
          desc: 'Fleet Management System. Realtime vehicle tracking, routes optimization, and speed loggers synced. Connected directly with national transport guidelines.',
          diagnostics: [
            { icon: '🗺️', text: 'GPS Route Synced' },
            { icon: '✓', text: 'Speed Limit Lock' },
            { icon: '🚌', text: 'Cameras Online' },
            { icon: '✓', text: 'Auto-Fuel Logs' },
            { icon: '👤', text: 'Licenses Verified' },
            { icon: '⚙️', text: 'Engine Diagnostics' }
          ],
          footerIcon: '🟢',
          footerText: 'Transit Stream Active'
        };
      case 'hostel':
        return {
          title: 'Hostel & Mess Operations',
          desc: 'Hostel Wardens Board. Track occupancy logs, check-in thresholds, and mess kitchen hygiene audits. Fully compliant under local health authority directives.',
          diagnostics: [
            { icon: '📜', text: 'Food Auth Cert' },
            { icon: '✓', text: 'Allergy Guide Ok' },
            { icon: '🍱', text: 'Pest Control Pass' },
            { icon: '✓', text: 'Warden Log Live' },
            { icon: '🚒', text: 'Fire Exit Checked' },
            { icon: '💧', text: 'Water Safety OK' }
          ],
          footerIcon: '🟢',
          footerText: 'Dorm Systems Live'
        };
      case 'librarian':
        return {
          title: 'Library System Status',
          desc: 'School Library Admin Deck. Monitor catalog sync status, reservations roster, and barcode scanner system status. Realtime backup enabled.',
          diagnostics: [
            { icon: '📚', text: 'Catalog Synced' },
            { icon: '✓', text: 'RFID Gate Active' },
            { icon: '🔍', text: 'Scanner Online' },
            { icon: '✓', text: 'Reservation Bot' },
            { icon: '🗂️', text: 'Overdue System' },
            { icon: '🛡️', text: 'Secure Isolation' }
          ],
          footerIcon: '🟢',
          footerText: 'Library Database Active'
        };
      case 'hr':
        return {
          title: 'HR & Personnel Dashboard',
          desc: 'Human Resource Console. Sync employee biometric data, leave balances, and payroll schedules securely. Isolated client data rules applied.',
          diagnostics: [
            { icon: '👥', text: 'Biometric Sync' },
            { icon: '✓', text: 'Payroll Approved' },
            { icon: '📜', text: 'Contracts Valid' },
            { icon: '✓', text: 'Leave Ledgers Ok' },
            { icon: '🏥', text: 'Health Cover Set' },
            { icon: '⚙️', text: 'Tax System Linked' }
          ],
          footerIcon: '🟢',
          footerText: 'HR Database Live'
        };
      case 'accountant':
        return {
          title: 'Financial Gateway Status',
          desc: 'Billing and Ledger Desk. Verify payment gateway status (Stripe, Paypal, Easypaisa), double-entry matching, and automated tax logs compliance.',
          diagnostics: [
            { icon: '💳', text: 'Gateways Sync' },
            { icon: '✓', text: 'Ledger Reconciled' },
            { icon: '📜', text: 'Audit Logs Valid' },
            { icon: '✓', text: 'Challan PDF Gen' },
            { icon: '🛡️', text: 'Fraud Shield' },
            { icon: '🏦', text: 'Bank Sync Normal' }
          ],
          footerIcon: '🟢',
          footerText: 'Finance Ledgers Secure'
        };
      default: // student, parent, teacher, admin, super_admin, etc.
        return {
          title: 'Operational Status',
          desc: defaultText,
          diagnostics: [
            { icon: '✓', text: 'RLS Isolation' },
            { icon: '✓', text: 'AES-256 Crypt' },
            { icon: '✓', text: 'SSL Certified' },
            { icon: '✓', text: 'Auto-Backup' },
            { icon: '✓', text: 'CSRF Shield' },
            { icon: '✓', text: 'DDoS Guard' }
          ],
          footerIcon: '🟢',
          footerText: 'System Fully Operational'
        };
    }
  };

  const getSupportData = () => {
    switch (simulatedRole) {
      case 'transport':
        return {
          title: 'Route Guides & Safety Check',
          subLabel: 'Route Operations Manuals:',
          guides: [
            { 
              title: '🚌 Student Emergency Protocol Guidelines',
              answerTitle: 'Student Emergency Protocol Guidelines',
              answerContent: 'In the event of a transport delay or route emergency, drivers must stop in a secure location, check student passenger status, and notify dispatch via the secure GPS system immediately.'
            },
            { 
              title: '🔧 Pre-trip Vehicle Safety Checklist',
              answerTitle: 'Pre-trip Vehicle Safety Checklist',
              answerContent: 'Inspect all school buses for tyre wear, brake responsiveness, functional GPS transponders, and safety kit presence before starting daily routes.'
            }
          ],
          links: [
            { id: 'l1', title: 'Local Transport Authority Rules', url: 'https://google.com', subject: 'GOVT RULES', desc: 'Official student transport standard rules.' },
            { id: 'l2', title: 'Route Maps & GPS Rota PDF', url: 'https://google.com', subject: 'ROUTE MAP', desc: 'Download route outlines and stop grids.' },
            { id: 'l3', title: 'Driver Shifts & Vehicle Insurance', url: 'https://google.com', subject: 'SAFETY LOGS', desc: 'Verify vehicle coverages and shift patterns.' }
          ]
        };
      case 'hostel':
        return {
          title: 'Mess Menus & Safety Guides',
          subLabel: 'Hostel Wardens Manuals:',
          guides: [
            { 
              title: '🍱 Weekly Student Allergy Guide',
              answerTitle: 'Weekly Student Allergy Guide',
              answerContent: 'Laminated list of student allergies is updated weekly in the mess kitchen. Ensure kitchen staff double check ingredients for lactose and nut allergens.'
            },
            { 
              title: '🚒 Evacuation Routes & Emergency plan',
              answerTitle: 'Evacuation Routes & Emergency plan',
              answerContent: 'Review dormitory emergency plans. Fire exits must remain unlocked and clear. Assembly point is located in the main lawn.'
            }
          ],
          links: [
            { id: 'l1', title: 'Food Authority Hygiene Certificate', url: 'https://google.com', subject: 'HYGIENE', desc: 'View municipal kitchen certificate and ratings.' },
            { id: 'l2', title: 'Weekly Mess Menu & Calories Info', url: 'https://google.com', subject: 'MESS MENU', desc: 'Standard breakfast, lunch, and dinner plans.' },
            { id: 'l3', title: 'Hostel Boarders Code of Conduct', url: 'https://google.com', subject: 'RULES', desc: 'Official dormitory disciplinary regulations.' }
          ]
        };
      case 'librarian':
        return {
          title: 'Cataloging & Library Guides',
          subLabel: 'Library Manuals:',
          guides: [
            { 
              title: '📚 How to catalog new books using barcodes',
              answerTitle: 'Barcode Cataloging Procedure',
              answerContent: 'Scan the ISBN code of the book. The local database will fetch metadata. Assign a shelf code and attach a barcode sticker.'
            },
            { 
              title: '💻 RFID gate troubleshooting steps',
              answerTitle: 'RFID Gate Troubleshooting',
              answerContent: 'If the gate alarm triggers incorrectly, reboot the reader console from the primary desk and test with a tagged reference book.'
            }
          ],
          links: [
            { id: 'l1', title: 'Library Code & Catalog Index', url: 'https://google.com', subject: 'CATALOG', desc: 'Database index of all school publications.' },
            { id: 'l2', title: 'Borrowing Policies & Fines Scale', url: 'https://google.com', subject: 'POLICY', desc: 'Details on return times and late fines.' }
          ]
        };
      case 'hr':
        return {
          title: 'HR Policy & Checklists',
          subLabel: 'HR Manuals:',
          guides: [
            { 
              title: '👤 Employee onboarding steps',
              answerTitle: 'Staff Onboarding Protocol',
              answerContent: 'Ensure new hires submit signed contracts, verified transcripts, and biometric attendance records before portal access is provisioned.'
            },
            { 
              title: '💼 Performance evaluation guide',
              answerTitle: 'Performance Evaluation Guidelines',
              answerContent: 'Coordinate with vice principals to execute class delivery reviews and student feedback audits once per semester.'
            }
          ],
          links: [
            { id: 'l1', title: 'Employee Handbook & Codes', url: 'https://google.com', subject: 'HANDBOOK', desc: 'Official rules and codes of conduct.' },
            { id: 'l2', title: 'Health Insurance Coverage details', url: 'https://google.com', subject: 'BENEFITS', desc: 'Staff medical insurance guidelines.' }
          ]
        };
      case 'accountant':
        return {
          title: 'Finance Handbooks & Rota',
          subLabel: 'Accounting Guides:',
          guides: [
            { 
              title: '💳 Weekly ledger matching guide',
              answerTitle: 'Weekly Ledger Reconciliation',
              answerContent: 'Match bank collection statements with the ERP fee receipt log. All discrepancies must be logged under audit adjustments.'
            },
            { 
              title: '📄 Online fee challan generation steps',
              answerTitle: 'Fee Challan Generation steps',
              answerContent: 'Select target class sections, choose billing month, check base fee, and click compile to generate PDF challans.'
            }
          ],
          links: [
            { id: 'l1', title: 'Double-entry Accounting Standard', url: 'https://google.com', subject: 'STANDARDS', desc: 'Official audit guidelines.' },
            { id: 'l2', title: 'Online Payment API Documentation', url: 'https://google.com', subject: 'APIS', desc: 'Stripe and Easypaisa integration guidelines.' }
          ]
        };
      default:
        return {
          title: 'Knowledge Base & Support',
          subLabel: 'Quick Operations Guides:',
          guides: spec.supportGuides || [
            { 
              title: 'Marking daily attendance?',
              answerTitle: 'Marking Daily Attendance',
              answerContent: 'Teachers can mark attendance by selecting the class section, checking student check-ins, and clicking save.'
            },
            { 
              title: 'Creating homework assignments?',
              answerTitle: 'Creating Homework Assignments',
              answerContent: 'Upload homework file instructions in the assignments panel, select target class and set a deadline.'
            }
          ],
          links: usefulLinks
        };
    }
  };

  const canUserEditSection = (section: string): boolean => {
    if (['student', 'parent'].includes(simulatedRole)) return false;
    const role = currentUser?.role || 'student';
    if (['super_admin', 'admin', 'vice_principal'].includes(role)) {
      return true;
    }
    switch (section) {
      case 'assignments':
      case 'homework':
      case 'grades':
      case 'attendance':
      case 'notices':
        return role === 'teacher';
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
  const generateFeeChallanHtml = (inv: { id: string; student: string; amount: number; status: string }) => {
    const schoolName = currentSchool?.schoolName || "Academic Hub School";
    const hasLogo = !!currentSchool?.logoUrl;
    const logoHtml = hasLogo 
      ? `<img src="${currentSchool.logoUrl}" style="height: 50px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));" />`
      : `<div style="display: flex; justify-content: center; align-items: center; width: 50px; height: 50px; border-radius: 12px; border: 2px solid #e2e8f0; font-size: 24px; background: #f8fafc;">🎓</div>`;
      
    const primaryHsl = currentSchool?.themeSettings?.primaryHsl || '263.4 70% 50.4%';
    let themePrimary = `hsl(${primaryHsl.includes(',') ? primaryHsl : primaryHsl.trim().split(/\s+/).join(', ')})`;
    const currencySym = currentSchool?.country === 'UK' ? '£' : currentSchool?.country === 'US' ? '$' : currentSchool?.country === 'AE' ? 'AED' : currentSchool?.country === 'SA' ? 'SAR' : 'Rs';
    const cityText = currentSchool?.city || 'Main Campus';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Fee Challan - ${inv.id}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f1f5f9; margin: 0; padding: 20px; color: #0f172a; box-sizing: border-box; }
          * { box-sizing: border-box; }
          .a4-container { max-width: 450px; margin: 0 auto; display: grid; grid-template-columns: 1fr; background: white; padding: 20px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border-radius: 8px; }
          .challan-part { border: 2px dashed #cbd5e1; padding: 20px; position: relative; border-radius: 12px; display: flex; flex-direction: column; background: #fff; overflow: hidden; }
          .header { display: flex; gap: 12px; align-items: center; border-bottom: 2px solid ${themePrimary}; padding-bottom: 12px; margin-bottom: 15px; }
          .header-text h1 { margin: 0; font-size: 14px; color: ${themePrimary}; text-transform: uppercase; font-weight: 900; line-height: 1.2; word-break: break-word; }
          .header-text p { margin: 2px 0 0; font-size: 10px; color: #64748b; font-weight: 600; line-height: 1.3; }
          .copy-type { position: absolute; top: -1px; left: 50%; transform: translateX(-50%); background: ${themePrimary}; color: white; padding: 3px 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
          .info-grid { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; font-size: 11px; margin-bottom: 15px; }
          .info-label { font-weight: 700; color: #475569; }
          .info-val { font-weight: 600; color: #0f172a; border-bottom: 1px dotted #94a3b8; }
          .fee-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 15px; flex-grow: 1; }
          .fee-table th { background: #f8fafc; text-align: left; padding: 6px; border: 1px solid #e2e8f0; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 9px; }
          .fee-table td { padding: 6px; border: 1px solid #e2e8f0; font-weight: 600; }
          .fee-table td.amount { text-align: right; font-family: monospace; font-size: 12px; }
          .total-row td { background: #f8fafc; font-weight: 800; font-size: 12px; border-top: 2px solid ${themePrimary}; }
          .total-row td.amount { color: ${themePrimary}; font-size: 13px; }
          .instructions { font-size: 9px; color: #64748b; line-height: 1.4; border: 1px solid #e2e8f0; padding: 8px; background: #f8fafc; border-radius: 6px; margin-bottom: 20px; }
          .signatures { display: flex; justify-content: space-between; margin-top: auto; padding-top: 30px; font-size: 10px; font-weight: 700; color: #475569; }
          .sig-box { border-top: 1px solid #cbd5e1; width: 100px; text-align: center; padding-top: 4px; }
          .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 40px; color: rgba(0,0,0,0.02); font-weight: 900; text-transform: uppercase; white-space: nowrap; pointer-events: none; z-index: 0; }
          .content-z { position: relative; z-index: 1; }
          [contenteditable="true"] { transition: all 0.2s; min-width: 20px; display: inline-block; }
          [contenteditable="true"]:hover { background: #fef08a; cursor: text; outline: 1px dashed #eab308; }
          [contenteditable="true"]:focus { background: #fff; outline: 2px solid #3b82f6; border-radius: 2px; }
          @media print { 
            body { padding: 0; background: white; display: flex; justify-content: center; }
            .a4-container { box-shadow: none; padding: 0; max-width: 450px; margin: 0 auto; }
            .challan-part { border-color: #94a3b8; }
            [contenteditable="true"] { outline: none !important; background: transparent !important; }
            button { display: none !important; }
            @page { margin: 10mm; size: portrait; }
          }
          .print-btn { position: fixed; bottom: 20px; right: 20px; background: ${themePrimary}; color: white; border: none; padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.2s; z-index: 1000; }
          .print-btn:hover { transform: translateY(-2px); }
          .status-badge { position: absolute; right: 20px; top: 35px; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 900; text-transform: uppercase; border: 2px solid; transform: rotate(15deg); opacity: 0.8; z-index: 2; pointer-events: none; }
          .status-paid { color: #10b981; border-color: #10b981; }
          .status-unpaid { color: #ef4444; border-color: #ef4444; }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">🖨️ Print Challan</button>
        <div class="a4-container">
          ${['Student Copy'].map(copyName => `
            <div class="challan-part">
              <div class="watermark">${schoolName}</div>
              <div class="copy-type">${copyName}</div>
              ${inv.status === 'Paid' ? '<div class="status-badge status-paid">PAID</div>' : ''}
              
              <div class="header content-z">
                ${logoHtml}
                <div class="header-text">
                  <h1 contenteditable="true">${schoolName}</h1>
                  <p contenteditable="true">${cityText} Campus • Ph: +92-123-4567</p>
                </div>
              </div>

              <div class="info-grid content-z">
                <div class="info-label">Challan No:</div> <div class="info-val">${inv.id}</div>
                <div class="info-label">Issue Date:</div> <div class="info-val" contenteditable="true">${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                <div class="info-label">Due Date:</div> <div class="info-val" contenteditable="true" style="color: #ef4444;">${new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                <div class="info-label">Student:</div> <div class="info-val" contenteditable="true">${inv.student}</div>
                <div class="info-label">Class/Sec:</div> <div class="info-val" contenteditable="true">Class 10-A</div>
              </div>

              <table class="fee-table content-z">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Amount (${currencySym})</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td contenteditable="true">Tuition Fee (Monthly)</td>
                    <td class="amount" contenteditable="true">${inv.amount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td contenteditable="true">Computer / Lab Fee</td>
                    <td class="amount" contenteditable="true">0</td>
                  </tr>
                  <tr>
                    <td contenteditable="true">Transport Charges</td>
                    <td class="amount" contenteditable="true">0</td>
                  </tr>
                  <tr>
                    <td contenteditable="true">Previous Arrears</td>
                    <td class="amount" contenteditable="true">0</td>
                  </tr>
                  <tr class="total-row">
                    <td>Total Payable</td>
                    <td class="amount" contenteditable="true">${inv.amount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div class="instructions content-z" contenteditable="true">
                <strong>Instructions:</strong><br/>
                1. Pay dues before due date to avoid late fee fine (${currencySym} 50/day).<br/>
                2. Fee can be deposited in any branch of Allied Bank Ltd.<br/>
                3. Bank timing: 9:00 AM to 1:30 PM.
              </div>

              <div class="signatures content-z">
                <div class="sig-box">Cashier</div>
                <div class="sig-box">Depositor</div>
              </div>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;
  };
  const [pendingDeleteAction, setPendingDeleteAction] = useState<(() => void) | null>(null);

  const getExpectedPasskey = () => {
    const role = currentUser?.role;
    if (role === 'super_admin') return 'superpass123';
    if (role === 'admin') return 'principalpass123';
    if (role === 'vice_principal') return 'vicepass123';
    if (role === 'teacher') return 'teacherpass123';
    if (role === 'student') return 'studentpass123';
    if (role === 'parent') return 'parentpass123';
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

  const currentStudentStatus = students.find(s => s.name === currentUser?.name)?.status || 'Present';
  const studentAttendanceVal = currentStudentStatus === 'Present' ? '96.7%' : '93.3%';
  const parentAttendanceVal = currentStudentStatus === 'Present' ? '96.7% Present' : '93.3% Absent';

  const pendingCount = assignments.filter(a => a.publishDate <= todayStr && !completedAssignments.includes(a.id)).length;

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
      features: ["Country Management", "Organization Management", "School Management", "Subscription Plans", "Billing & Invoicing", "Revenue Analytics", "White Label Configuration", "Global Announcements", "Support Tickets", "Audit Logs", "Multi-Level Permissions", "Advanced Activity Monitoring", "School Health Monitoring", "Server Monitoring", "Backup Manager", "API Key Management", "SMS Gateway Settings", "Email Server Settings", "School Suspension System", "School Performance Analytics", "Fraud Detection Dashboard", "Two Factor Authentication", "Device Management", "Session Tracking", "IP Restriction", "Login Audit Trail", "SMS Gateway", "WhatsApp Integration", "Email Automation", "Push Notifications", "AI Attendance Insights", "AI Fee Defaulter Prediction", "AI Student Performance Prediction", "AI Admission Analytics", "School KPI Dashboard", "Revenue Dashboard", "Student Growth Dashboard", "Teacher Performance Dashboard", "AI Command Center", "AI Content Studio", "Payment Gateway Settings", "Term Dates & Academic Calendar"],
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
      features: ["Student Management", "Employee Management", "Academic Setup", "Attendance Monitoring", "Fee Monitoring", "Academic Oversight", "Student Conduct Records", "School Notices", "Parent Communication Center", "Leave Management", "Admission Funnel Analytics", "Staff Performance Tracking", "Inventory Management", "Transport Management", "Hostel Management", "Visitor Management", "Payroll", "Two Factor Authentication", "Device Management", "Session Tracking", "IP Restriction", "Login Audit Trail", "Timetable Generator", "Exam Management", "Result Processing", "SMS Gateway", "WhatsApp Integration", "Email Automation", "Push Notifications", "School KPI Dashboard", "Revenue Dashboard", "Student Growth Dashboard", "Teacher Performance Dashboard", "AI Command Center", "AI Content Studio", "Payment Gateway Settings"],
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
    vice_principal: {
      title: "Vice Principal Desk",
      subtitle: "Academic Operations & Discipline",
      kpis: [
        { label: "Pending Leave Requests", value: "8 Requests", icon: Users, colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25", desc: "Require approval" },
        { label: "Timetable Conflicts", value: "2 Classes", icon: AlertTriangle, colorClass: "text-red-400 bg-red-500/10 border-red-500/25", desc: "Teacher overlap detected" },
        { label: "Upcoming Exams", value: "Midterms", icon: Calendar, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", desc: "Starts in 12 days" },
        { label: "Active Detentions", value: "14 Students", icon: ShieldAlert, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", desc: "Disciplinary action" }
      ],
      features: ["Student Management", "Teacher Management", "Class Registration", "Class Subjects", "Attendance Tracking", "Student Behaviour Analytics", "Exam Schedules", "Exam Grades", "Leave Requests", "Generate Reports", "Class Timetable", "Notice Board", "Academic Setup Wizard"],
      quickActions: [
        { label: "Review Leaves", desc: "Pending teacher leaves", icon: CheckCircle },
        { label: "Schedule Exam", desc: "Create new assessment", icon: Plus }
      ],
      placeholderText: "Vice Principal Hub active. Oversee academics and disciplinary records.",
      supportGuides: [
        { title: "👩‍🏫 Managing teacher class allocations?", answerTitle: "Teacher Rosters", answerContent: "Go to Teacher Management, select a teacher and click Edit to assign them new homeroom classes or specific subjects." },
        { title: "📅 Generating final exam schedules?", answerTitle: "Exam Configurations", answerContent: "Navigate to Exam Schedules, click New Schedule, set start/end dates, and use auto-allocate to fill subject slots." },
        { title: "📄 Reviewing student discipline logs?", answerTitle: "Behaviour Monitoring", answerContent: "Access Student Behaviour Analytics to see graphs of infractions, detentions, and merits." }
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
      features: ["My Classes", "Lesson Planner", "Class Diary", "Attendance Entry", "Assignment Creation", "Quiz Creation", "Grade Book", "Student Remarks", "Parent Communication", "Teacher Leave Requests", "Term Dates & Academic Calendar"],
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
      features: ["Attendance Ledger", "Assignments", "Exams Results", "Timetable", "Study Material", "Recorded Lectures", "Fee Status", "Notifications", "School Transport", "Library Books", "Hostel Portal", "Student Goal Tracking", "GPA & Progress Analytics", "Achievement System", "Digital Certificates", "Study Planner", "AI Study Assistant", "Exam Preparation Tracker", "Homework Reminder", "Term Dates & Academic Calendar"],
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
      features: ["Child Attendance", "Fee Status", "Exam Results", "Teacher Messaging", "Leave Requests", "School Notices", "Student Progress Graphs", "School Transport", "Term Dates & Academic Calendar"],
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
  };

  const spec = portalSpecs[simulatedRole] || portalSpecs['admin'];

  // Filter features based on search
  const filteredFeatures = spec.features.filter(f => 
    f.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden">
      <Helmet>
        <title>{simulatedRole.charAt(0).toUpperCase() + simulatedRole.slice(1)} Portal | Academic Hub</title>
        <meta name="description" content={`Academic Hub ${simulatedRole} Dashboard. Manage your school operations seamlessly.`} />
      </Helmet>

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
        
        

        {/* Principal Alerts & Notification Center */}
        {simulatedRole === 'admin' && (
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
            darkMode 
              ? 'bg-slate-900/40 border-slate-800' 
              : 'bg-white/70 border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-border/40">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold text-foreground/85 uppercase tracking-wider">Principal Alert & Notification Center</span>
            </div>
            
            {principalNotifications.length === 0 ? (
              <p className="text-[11px] text-foreground/50 italic m-0">No new alerts from the Vice Principal Desk.</p>
            ) : (
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {principalNotifications.map((note, index) => (
                  <div 
                    key={index}
                    className={`p-2.5 rounded-lg border text-[11px] flex items-center justify-between gap-3 ${
                      darkMode 
                        ? 'bg-slate-950/45 border-slate-900 text-slate-350' 
                        : 'bg-slate-50 border-slate-100 text-slate-705'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🔔</span>
                      <span>{note}</span>
                    </div>
                    <button 
                      onClick={() => setPrincipalNotifications(prev => prev.filter((_, i) => i !== index))}
                      className="text-[9px] font-bold text-red-500 hover:text-red-450 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Role-Specific Live Status Banners */}
        {(() => {
          const unpaidFees = invoices.filter(i => (isEditor ? true : i.student === currentUser?.name) && i.status === 'Unpaid');
          const hasUnpaidFees = unpaidFees.length > 0;
          
          if (simulatedRole === 'student') {
            const overdueAssignmentsCount = assignments.filter(a => a.publishDate <= todayStr && !completedAssignments.includes(a.id)).length;
            const isAllCompleted = overdueAssignmentsCount === 0 && currentStudentStatus === 'Present';
            
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
                  {currentStudentStatus === 'Absent' && (
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
            const pendingTasksCount = assignments.filter(a => a.publishDate <= todayStr && !completedAssignments.includes(a.id)).length;
            const teacherMessages = parentMessages.filter(m => m.parent.startsWith('Broadcast') || m.parent.startsWith('Teacher'));
            const hasTeacherMessages = teacherMessages.length > 0;
            const isAllClear = !hasUnpaidFees && pendingTasksCount === 0 && currentStudentStatus === 'Present' && !hasTeacherMessages;

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
                  {currentStudentStatus === 'Absent' && (
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
        <section className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          {/* School Level Section Selector */}
          {schoolLevel === 'both' && (
            <div className="mx-6 mt-4 mb-2 p-1 bg-muted/30 border border-border rounded-2xl flex items-center gap-1 shadow-sm">
              <button
                onClick={() => setActiveSection('primary')}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-black transition-all duration-300 ${activeSection === 'primary' ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 scale-[1.02]' : 'text-foreground/60 hover:bg-muted/50 hover:text-foreground'}`}
              >
                <span className="text-lg">🎒</span>
                <span>Primary Section</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeSection === 'primary' ? 'bg-white/20' : 'bg-muted border border-border'}`}>Playgroup - Class 5</span>
              </button>
              <button
                onClick={() => setActiveSection('secondary')}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-black transition-all duration-300 ${activeSection === 'secondary' ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 scale-[1.02]' : 'text-foreground/60 hover:bg-muted/50 hover:text-foreground'}`}
              >
                <span className="text-lg">🎓</span>
                <span>Secondary Section</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeSection === 'secondary' ? 'bg-white/20' : 'bg-muted border border-border'}`}>Class 6 - Class 10</span>
              </button>
            </div>
          )}
          {schoolLevel !== 'both' && (
            <div className="mx-6 mt-4 mb-2">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border ${schoolLevel === 'primary' ? 'bg-sky-500/10 border-sky-500/30 text-sky-500' : 'bg-violet-500/10 border-violet-500/30 text-violet-400'}`}>
                <span>{schoolLevel === 'primary' ? '🎒' : '🎓'}</span>
                {schoolLevel === 'primary' ? 'Primary Level School (Playgroup - Class 5)' : 'Secondary Level School (Class 6 - Class 10)'}
              </div>
            </div>
          )}

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
        <section className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch w-full">
          {/* Card 1: Quick Operations (Left side, col-span-2 or col-span-3) */}
          <div className={`${showSystemTelemetry ? 'lg:col-span-2' : 'lg:col-span-3'} glass-card p-6 rounded-2xl border border-border bg-card/30 space-y-4 flex flex-col justify-between`}>
            <div>
              <h3 className="font-bold text-foreground m-0 flex items-center gap-2 pb-3 border-b border-border">
                <Settings className="w-5 h-5 text-primary" />
                Quick Operations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4 mt-3">
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
                        else if (action.label === 'Mark Attendance') section = 'attendance';

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
                            alert(`[${currentSchool?.schoolName || 'School'}] Starting operation: ${action.label}`);
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
              <div className="pt-2 text-[10px] text-foreground/45 border-t border-border/40 font-semibold uppercase tracking-widest text-center mt-4">
                Authorized Operations Console
              </div>
            </div>
          </div>

          {/* Card 2: Live System Telemetry (Right side, col-span-1) */}
            {showSystemTelemetry && (
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 pt-2 border-t border-border/40 text-[9px] font-semibold text-foreground/60">
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

                  {/* Admission Settings */}
                  <div className="p-4 bg-card/50 border border-border rounded-xl space-y-4">
                    <h4 className="text-sm font-bold text-foreground">Admission Settings</h4>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={newSetupMinAge}
                        onChange={(e) => setNewSetupMinAge(e.target.value)}
                        placeholder="Minimum Admission Age"
                        className="flex-1 bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground"
                      />
                      <button
                        onClick={() => {
                          const age = parseInt(newSetupMinAge);
                          if (isNaN(age) || age < 1) {
                            alert('Please enter a valid age');
                            return;
                          }
                          requestSecurityVerification(`Set minimum admission age to ${age} years`, () => {
                            setMinAdmissionAge(age);
                          });
                        }}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                      >
                        Save Setting
                      </button>
                    </div>
                    <p className="text-[10px] text-foreground/50 m-0">Current limit: <strong>{minAdmissionAge} years</strong></p>
                  </div>
                </div>
                <div className="pt-2 text-[10px] text-foreground/45 border-t border-border/40 font-semibold uppercase tracking-widest text-center mt-4">
                  Database Sync Active
                </div>
              </div>
            )}
          </section>

        {/* Symmetrical Parallel Footer Section */}
        <section className="glass-card p-6 rounded-2xl border border-border bg-card/20 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/40">
            <Activity className="w-4.5 h-4.5 text-primary" />
            {simulatedRole === 'transport' ? 'Transit Control Center & Route Tracker' : 
             simulatedRole === 'hostel' ? 'Hostel Boarding & Food Safety Registry' :
             'Recent Administrative Activity & Operational Telemetry'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* ----------------- TRANSPORT ROLE CUSTOM CARDS ----------------- */}
            {simulatedRole === 'transport' && (
              <>
                {/* Transport Card 1: GPS Live Route tracking */}
                <div className="glass-card p-6 rounded-2xl border border-border bg-card/30 flex flex-col justify-between min-h-[420px]">
                  <div>
                    <h4 className="text-xs font-black text-foreground/60 uppercase tracking-widest pb-2.5 border-b border-border/40 flex items-center gap-1.5">
                      <Map className="w-4.5 h-4.5 text-primary" />
                      Live Route GPS Map Tracker
                    </h4>
                    <p className="text-xs text-foreground/70 leading-relaxed font-semibold mt-3 mb-4">
                      Realtime bus location tracking and route path compliance.
                    </p>

                    {/* Visual Map Simulator */}
                    <div className="relative bg-muted/65 rounded-xl border border-border p-4 h-48 overflow-hidden flex flex-col justify-between">
                      {/* Dotted Route Line */}
                      <div className="absolute top-1/2 left-4 right-4 h-0.5 border-t-2 border-dashed border-primary/50 -translate-y-1/2"></div>
                      
                      {/* Stop 1 */}
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-background"></span>
                        </div>
                        <span className="text-[7.5px] font-black text-foreground/75 mt-1 bg-card px-1 rounded shadow-sm border border-border">Gulberg</span>
                      </div>

                      {/* Bus pulsing dot (Simulating live transit) */}
                      <div className="absolute left-[52%] top-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
                        <div className="w-5 h-5 rounded-full bg-primary border-2 border-background flex items-center justify-center shadow-lg shadow-primary/40 animate-pulse">
                          <span className="text-[9px]">🚌</span>
                        </div>
                        <span className="text-[7px] font-black text-primary bg-primary/10 border border-primary/25 px-1 py-0.2 rounded mt-1.5 whitespace-nowrap">BUS-08 (60 km/h)</span>
                      </div>

                      {/* Stop 2 */}
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-foreground/35 border-2 border-background flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-background"></span>
                        </div>
                        <span className="text-[7.5px] font-black text-foreground/50 mt-1 bg-card px-1 rounded shadow-sm border border-border">DHA Phase 5</span>
                      </div>

                      <div className="z-10 bg-card/90 border border-border/80 backdrop-blur p-2 rounded-lg text-[9px] font-extrabold flex justify-between items-center w-full shadow-md mt-auto">
                        <span className="text-foreground/75">Next Stop: DHA Phase 5</span>
                        <span className="text-primary animate-pulse">ETA: ~4 mins</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => alert("Pinging GPS vehicle transponder... Connection healthy. Status: Active & Synced.")}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-[10px] font-bold text-white transition-all shadow-md active:scale-98 mt-4"
                  >
                    <span>Ping Bus GPS Link</span>
                    <Activity className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Transport Card 2: Safety & Compliance Checklist */}
                <div className="glass-card p-6 rounded-2xl border border-border bg-card/30 flex flex-col justify-between min-h-[420px]">
                  <div>
                    <h4 className="text-xs font-black text-foreground/60 uppercase tracking-widest pb-2.5 border-b border-border/40 flex items-center gap-1.5">
                      <Shield className="w-4.5 h-4.5 text-primary" />
                      Compliance & Fleet Safety Logs
                    </h4>
                    <p className="text-xs text-foreground/70 leading-relaxed font-semibold mt-3 mb-4">
                      Mandatory regulatory safety checks before dispatching active fleet routes.
                    </p>

                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5 p-2 bg-card border border-border rounded-xl">
                        <input type="checkbox" defaultChecked className="mt-0.5 accent-primary" />
                        <div className="text-[10px] font-bold text-foreground/85">
                          <div>Pre-trip Mechanical Check</div>
                          <span className="text-[8.5px] text-foreground/45 font-semibold">Tires, brakes, engine fluid logs cleared.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 p-2 bg-card border border-border rounded-xl">
                        <input type="checkbox" defaultChecked className="mt-0.5 accent-primary" />
                        <div className="text-[10px] font-bold text-foreground/85">
                          <div>Speed Governor Compliance</div>
                          <span className="text-[8.5px] text-foreground/45 font-semibold">Limited at 60 km/h speed threshold.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 p-2 bg-card border border-border rounded-xl">
                        <input type="checkbox" defaultChecked className="mt-0.5 accent-primary" />
                        <div className="text-[10px] font-bold text-foreground/85">
                          <div>Breathalyzer Integration</div>
                          <span className="text-[8.5px] text-foreground/45 font-semibold">Driver verified clear before ignition locks open.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 text-[11px] text-emerald-500 font-black uppercase tracking-widest text-center mt-6 flex items-center justify-center gap-2 border-t border-border/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Safety Compliance Cleared
                  </div>
                </div>

                {/* Transport Card 3: Transit Logs & Roster */}
                <div className="glass-card p-6 rounded-2xl border border-border bg-card/30 flex flex-col justify-between min-h-[420px]">
                  <div>
                    <h4 className="text-xs font-black text-foreground/60 uppercase tracking-widest pb-2.5 border-b border-border/40 flex items-center gap-1.5">
                      <Users className="w-4.5 h-4.5 text-primary" />
                      Active Route Roster
                    </h4>
                    <p className="text-xs text-foreground/70 leading-relaxed font-semibold mt-3 mb-4">
                      Students assigned to BUS-08 on active morning shift.
                    </p>

                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      <div className="flex justify-between items-center p-2.5 bg-card border border-border rounded-xl">
                        <span className="text-[10px] font-bold text-foreground">Kamran Shah (Grade 10)</span>
                        <span className="text-[8px] font-black uppercase bg-emerald-500/15 border border-emerald-500/35 text-emerald-500 px-2 py-0.5 rounded-full">Boarded</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-card border border-border rounded-xl">
                        <span className="text-[10px] font-bold text-foreground">Ayesha Siddiqui (Grade 10)</span>
                        <span className="text-[8px] font-black uppercase bg-amber-500/15 border border-amber-500/35 text-amber-500 px-2 py-0.5 rounded-full">Not Boarded</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-card border border-border rounded-xl">
                        <span className="text-[10px] font-bold text-foreground">Zainab Ali (Grade 9)</span>
                        <span className="text-[8px] font-black uppercase bg-muted border border-border text-foreground/50 px-2 py-0.5 rounded-full">Absent</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 text-[11px] text-foreground/65 border-t border-border/40 font-black uppercase tracking-widest text-center mt-6">
                    Total: 3 Registered Boarders
                  </div>
                </div>
              </>
            )}

            {/* ----------------- HOSTEL ROLE CUSTOM CARDS ----------------- */}
            {simulatedRole === 'hostel' && (
              <>
                {/* Hostel Card 1: Food Authority Certificate */}
                <div className="glass-card p-6 rounded-2xl border border-border bg-card/30 flex flex-col justify-between min-h-[420px]">
                  <div>
                    <h4 className="text-xs font-black text-foreground/60 uppercase tracking-widest pb-2.5 border-b border-border/40 flex items-center gap-1.5">
                      <Shield className="w-4.5 h-4.5 text-primary" />
                      Hygiene & Food Safety Certs
                    </h4>
                    <p className="text-xs text-foreground/70 leading-relaxed font-semibold mt-3 mb-4">
                      Official municipal food authority licensing and health compliance reports.
                    </p>

                    {/* Official Certificate Seal widget */}
                    <div className="border-4 double border-primary/45 p-4 rounded-xl bg-card relative overflow-hidden flex flex-col items-center text-center shadow-inner">
                      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl mb-2">
                        📜
                      </div>
                      <div className="text-[9.5px] font-black uppercase tracking-widest text-primary">{foodCert.authority}</div>
                      <div className="text-[7.5px] text-foreground/50 font-bold mt-1">LICENSE: {foodCert.licenseCode}</div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 w-full mt-3.5 border-t border-border/40 pt-3 text-[8.5px] font-extrabold text-foreground/75">
                        <div className="bg-muted p-1 rounded">Grade: <span className="text-primary font-black">{foodCert.grade}</span></div>
                        <div className="bg-muted p-1 rounded">Status: <span className={`${foodCert.status.toLowerCase() === 'valid' ? 'text-emerald-500' : 'text-amber-500'} font-black`}>{foodCert.status}</span></div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setEditCertAuthority(foodCert.authority);
                      setEditCertLicense(foodCert.licenseCode);
                      setEditCertGrade(foodCert.grade);
                      setEditCertStatus(foodCert.status);
                      setEditCertIssueDate(foodCert.issueDate);
                      setEditCertExpiryDate(foodCert.expiryDate);
                      setEditCertFileBase64(foodCert.fileData);
                      setEditCertFileName(foodCert.fileName);
                      setEditCertFileType(foodCert.fileType);
                      setIsCertEditMode(false);
                      setIsCertModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-[10px] font-bold text-white transition-all shadow-md active:scale-98 mt-4"
                  >
                    <span>View & Edit Certificate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Hostel Card 2: Student Food Allergy Safety Guide */}
                <div className="glass-card p-6 rounded-2xl border border-border bg-card/30 flex flex-col justify-between min-h-[420px]">
                  <div>
                    <h4 className="text-xs font-black text-foreground/60 uppercase tracking-widest pb-2.5 border-b border-border/40 flex items-center gap-1.5">
                      <AlertTriangle className="w-4.5 h-4.5 text-primary" />
                      Allergy Safety & Emergency Protocol
                    </h4>
                    <p className="text-xs text-foreground/70 leading-relaxed font-semibold mt-3 mb-4">
                      Immediate action directories and severe dietary allergy alerts for current boarders.
                    </p>

                    <div className="space-y-2.5">
                      <div className="bg-amber-500/10 border border-amber-500/25 p-3 rounded-xl flex items-start gap-2.5">
                        <span className="text-lg mt-0.5">⚠️</span>
                        <div className="text-[10px] font-extrabold text-foreground/80 leading-normal">
                          <span className="text-primary uppercase tracking-wide block mb-0.5">Nut Allergy Alert</span>
                          3 boarding students have severe peanut allergies. Enforce strict kitchen allergen segregation.
                        </div>
                      </div>
                      
                      <div className="space-y-1.5 text-[9px] font-extrabold text-foreground/70">
                        <div className="flex justify-between p-1.5 bg-card border border-border rounded-lg">
                          <span>Epipen Kit Location:</span>
                          <span className="text-primary">First-Aid Box A (Office)</span>
                        </div>
                        <div className="flex justify-between p-1.5 bg-card border border-border rounded-lg">
                          <span>Allergy Officer:</span>
                          <span className="text-primary">Dr. Sajid Malik</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 text-[11px] text-primary font-black uppercase tracking-widest text-center mt-6 flex items-center justify-center gap-2 border-t border-border/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Allergen Guides Active
                  </div>
                </div>

                {/* Hostel Card 3: Mess Menu & Dining Logs */}
                <div className="glass-card p-6 rounded-2xl border border-border bg-card/30 flex flex-col justify-between min-h-[420px]">
                  <div>
                    <h4 className="text-xs font-black text-foreground/60 uppercase tracking-widest pb-2.5 border-b border-border/40 flex items-center gap-1.5">
                      <Layers className="w-4.5 h-4.5 text-primary" />
                      Mess Kitchen & Meal Logs
                    </h4>
                    <p className="text-xs text-foreground/70 leading-relaxed font-semibold mt-3 mb-4">
                      Daily boarding food schedule and nutritional logs.
                    </p>

                    <div className="space-y-2 text-[10px] font-extrabold text-foreground/80">
                      <div className="p-2.5 bg-card border border-border rounded-xl flex justify-between items-center">
                        <span className="text-primary">🍳 Breakfast:</span>
                        <span>Omelette, Toast & Chai</span>
                      </div>
                      <div className="p-2.5 bg-card border border-border rounded-xl flex justify-between items-center">
                        <span className="text-primary">🍗 Lunch:</span>
                        <span>Chicken Biryani & Raita</span>
                      </div>
                      <div className="p-2.5 bg-card border border-border rounded-xl flex justify-between items-center">
                        <span className="text-primary">🥘 Dinner:</span>
                        <span>Daal Chawal & Roti</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 text-[11px] text-foreground/65 border-t border-border/40 font-black uppercase tracking-widest text-center mt-6">
                    Today: 112 Boarder Servings
                  </div>
                </div>
              </>
            )}

            {/* ----------------- DEFAULT PORTALS (Principal, Teacher, Student, Parent, etc.) ----------------- */}
            {simulatedRole !== 'transport' && simulatedRole !== 'hostel' && (
              <>
                {/* Card 1: Operational Status Board */}
                {(() => {
                  const opData = getOperationalStatusData();
                  return (
                    <div className="glass-card p-6 rounded-2xl border border-border bg-card/30 flex flex-col justify-between min-h-[420px]">
                      <div>
                        <h4 className="text-xs font-black text-foreground/60 uppercase tracking-widest pb-2.5 border-b border-border/40 flex items-center gap-1.5">
                          <FileCode className="w-4.5 h-4.5 text-primary" />
                          {opData.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-semibold mt-4">
                          {opData.desc}
                        </p>

                        {/* Diagnostics Grid to fill empty space */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 text-[11px] font-extrabold text-foreground/80">
                          {opData.diagnostics.map((diag, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2.5 bg-card border border-border rounded-xl shadow-inner hover:scale-[1.02] transition-transform">
                              <span className="text-emerald-400 text-xs">{diag.icon}</span>
                              <span>{diag.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-3 text-[11px] text-primary font-black uppercase tracking-widest text-center mt-6 flex items-center justify-center gap-2 border-t border-border/40">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span> {opData.footerText}
                      </div>
                    </div>
                  );
                })()}

                {/* Card 2: Knowledge Base & Support */}
                {(() => {
                  const support = getSupportData();
                  return (
                    <div className="glass-card p-6 rounded-2xl border border-border bg-card/30 flex flex-col justify-between min-h-[420px]">
                      <div>
                        <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest pb-2 border-b border-border/40 flex items-center gap-1.5">
                          <HelpCircle className="w-4.5 h-4.5 text-primary" />
                          {support.title}
                        </h4>
                        
                        {/* Step-by-Step Guides */}
                        <p className="text-[10px] text-foreground/65 leading-relaxed mt-2.5 font-bold uppercase tracking-wider">
                          {support.subLabel}
                        </p>
                        <div className="space-y-1.5 mt-1.5">
                          {support.guides.slice(0, 2).map((guide, idx) => (
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

                        {/* Useful Learning Links Section */}
                        <div className="mt-4 pt-3 border-t border-border/40">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-foreground/65 uppercase tracking-wider flex items-center gap-1">
                              🔗 Relevant Resources:
                            </span>
                            {(simulatedRole === 'teacher' || showSystemTelemetry) && (
                              <button 
                                onClick={() => setIsLinksModalOpen(true)}
                                className="text-[9px] font-bold text-primary hover:text-primary-focus bg-primary/10 border border-primary/20 px-2 py-0.5 rounded transition-all active:scale-95"
                              >
                                Manage Links
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                            {support.links.map(link => (
                              <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-card/60 hover:bg-card border border-border hover:border-primary/45 rounded-lg flex flex-col gap-0.5 transition-all text-left group"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                                    {link.title}
                                    <span className="text-[8px] text-foreground/45 font-normal">↗</span>
                                  </span>
                                  <span className="text-[7.5px] px-1.5 py-0.2 bg-primary/10 border border-primary/20 rounded font-black text-primary uppercase tracking-wide">
                                    {link.subject}
                                  </span>
                                </div>
                                <span className="text-[9px] text-foreground/50 leading-relaxed truncate">
                                  {link.desc}
                                </span>
                              </a>
                            ))}
                          </div>
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
                  );
                })()}

                {/* Card 3: Tracker Widget */}
                {(() => {
                  const tracker = getTrackerData();
                  return (
                    <div className="glass-card p-6 rounded-2xl border border-border bg-card/30 flex flex-col justify-between min-h-[420px]">
                      <div>
                        <h4 className="text-xs font-black text-foreground/60 uppercase tracking-widest pb-2.5 border-b border-border/40">
                          {tracker.title}
                        </h4>

                        <div className="bg-card/50 border border-border rounded-xl p-3.5 space-y-3 mt-3">
                          <div className="flex justify-between items-center text-xs font-bold text-foreground/80">
                            <span>{tracker.mainLabel}</span>
                            <span className="text-primary font-black text-sm">{tracker.mainValue}</span>
                          </div>
                          
                          {/* Visual progress indicator */}
                          <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden border border-border/20">
                            <div 
                              className="bg-gradient-to-r from-primary/60 to-primary h-full rounded-full transition-all duration-500" 
                              style={{ width: tracker.mainValue.includes('%') ? tracker.mainValue : '95%' }}
                            ></div>
                          </div>

                          {/* Taller Bar Chart */}
                          <div className="flex items-end justify-between h-20 pt-3">
                            {tracker.bars.map((bar, i) => (
                              <div key={i} className="flex flex-col items-center gap-1 w-8">
                                <span className="text-[9px] font-extrabold text-foreground/60">{bar.value}</span>
                                <div className="w-3 bg-gradient-to-t from-primary/30 to-primary rounded-t-sm transition-all duration-300" style={{ height: bar.percent }}></div>
                                <span className="text-[9px] text-foreground/50 font-bold uppercase tracking-tighter">{bar.label}</span>
                              </div>
                            ))}
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 text-[11px] font-extrabold text-foreground/80">
                            {tracker.stats.map((stat, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2.5 bg-card border border-border rounded-xl shadow-inner hover:scale-[1.02] transition-transform">
                                <span className={`${stat.colorClass} text-xs`}>{stat.icon}</span>
                                <span>{stat.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="pt-3 text-[11px] text-foreground/60 border-t border-border/40 font-black uppercase tracking-widest text-center mt-6">
                        {tracker.footer}
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
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

      {/* FOOD AUTHORITY CERTIFICATE VIEW & EDIT MODAL */}
      {isCertModalOpen && (
        <div className="modal-overlay z-[100]">
          <div className="modal-container modal-md glass-card glow-purple text-foreground p-6 space-y-4">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📜</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                  {isCertEditMode ? 'Edit Food Safety Certificate' : 'Food Authority Certificate'}
                </h3>
              </div>
              <button 
                onClick={() => setIsCertModalOpen(false)}
                className="px-2.5 py-1 text-xs font-bold rounded bg-muted border border-border hover:bg-card text-foreground transition-all active:scale-95"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            {isCertEditMode ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                setFoodCert({
                  authority: editCertAuthority,
                  licenseCode: editCertLicense,
                  grade: editCertGrade,
                  status: editCertStatus,
                  issueDate: editCertIssueDate,
                  expiryDate: editCertExpiryDate,
                  fileData: editCertFileBase64,
                  fileName: editCertFileName,
                  fileType: editCertFileType
                });
                setIsCertEditMode(false);
              }} className="space-y-4 text-xs font-bold text-left">
                <div className="space-y-1">
                  <label className="text-[10px] text-foreground/60 uppercase">Authority / Issuing Body</label>
                  <input 
                    type="text" 
                    value={editCertAuthority} 
                    onChange={e => setEditCertAuthority(e.target.value)} 
                    className="w-full p-2 bg-card border border-border rounded-lg text-foreground text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-foreground/60 uppercase">License Code / Reference</label>
                  <input 
                    type="text" 
                    value={editCertLicense} 
                    onChange={e => setEditCertLicense(e.target.value)} 
                    className="w-full p-2 bg-card border border-border rounded-lg text-foreground text-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-foreground/60 uppercase">Inspection Grade</label>
                    <input 
                      type="text" 
                      value={editCertGrade} 
                      onChange={e => setEditCertGrade(e.target.value)} 
                      className="w-full p-2 bg-card border border-border rounded-lg text-foreground text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-foreground/60 uppercase">Status</label>
                    <select 
                      value={editCertStatus} 
                      onChange={e => setEditCertStatus(e.target.value)} 
                      className="w-full p-2 bg-card border border-border rounded-lg text-foreground text-xs font-bold"
                    >
                      <option value="Valid">Valid</option>
                      <option value="Expired">Expired</option>
                      <option value="Pending Review">Pending Review</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-foreground/60 uppercase">Issue Date</label>
                    <input 
                      type="date" 
                      value={editCertIssueDate} 
                      onChange={e => setEditCertIssueDate(e.target.value)} 
                      className="w-full p-2 bg-card border border-border rounded-lg text-foreground text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-foreground/60 uppercase">Expiry Date</label>
                    <input 
                      type="date" 
                      value={editCertExpiryDate} 
                      onChange={e => setEditCertExpiryDate(e.target.value)} 
                      className="w-full p-2 bg-card border border-border rounded-lg text-foreground text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-foreground/60 uppercase">Upload Certificate File (PNG, JPEG, PDF)</label>
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, application/pdf"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setEditCertFileBase64(event.target?.result as string);
                          setEditCertFileName(file.name);
                          setEditCertFileType(file.type);
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                    className="w-full p-1.5 bg-card border border-border rounded-lg text-foreground text-xs font-semibold"
                  />
                  {editCertFileName && (
                    <div className="text-[9px] text-primary mt-1">
                      Attached: {editCertFileName}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 justify-end pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsCertEditMode(false)}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-muted border border-border text-foreground transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-primary hover:bg-primary/95 text-white shadow-md transition-all active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Beautiful Certificate Representation */}
                <div className="border-8 double border-primary/35 p-6 rounded-2xl bg-card/50 relative overflow-hidden flex flex-col items-center text-center shadow-inner space-y-4">
                  {/* Corner Ornaments */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/35"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/35"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/35"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/35"></div>
                  
                  <div className="text-3xl">🏆</div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary">CERTIFICATE OF FOOD SAFETY COMPLIANCE</h4>
                    <p className="text-[9px] text-foreground/45 mt-1 font-bold">This certifies that the hostel kitchen and dining services comply fully under municipal safety standards.</p>
                  </div>
                  
                  <div className="w-full border-t border-dashed border-border/60 my-2"></div>
                  
                  <div className="space-y-2 text-[10px] font-bold text-foreground/85 w-full text-left">
                    <div className="flex justify-between">
                      <span className="text-foreground/45">Authority:</span>
                      <span>{foodCert.authority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/45">License Code:</span>
                      <span className="font-mono">{foodCert.licenseCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/45">Hygiene Grade:</span>
                      <span className="text-primary font-black">{foodCert.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/45">Current Status:</span>
                      <span className={`${foodCert.status.toLowerCase() === 'valid' ? 'text-emerald-500' : 'text-amber-500'} font-black`}>{foodCert.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/45">Validity Period:</span>
                      <span>{foodCert.issueDate} to {foodCert.expiryDate}</span>
                    </div>
                  </div>

                  {/* Render File Preview / Download Link if uploaded */}
                  {foodCert.fileData && (
                    <div className="w-full pt-3 mt-2 border-t border-border/40 text-left">
                      <span className="text-[9px] text-foreground/45 uppercase font-bold block mb-1.5">Attached Document / Image:</span>
                      {foodCert.fileType?.startsWith('image/') ? (
                        <div className="relative rounded-xl border border-border overflow-hidden max-h-48 flex justify-center bg-muted">
                          <img 
                            src={foodCert.fileData} 
                            alt="Uploaded Certificate" 
                            className="max-h-48 object-contain"
                          />
                        </div>
                      ) : (
                        <a 
                          href={foodCert.fileData} 
                          download={foodCert.fileName || "food_certificate.pdf"}
                          className="flex items-center gap-2 p-2 bg-card hover:bg-muted border border-border rounded-lg text-[10px] text-primary font-bold transition-all active:scale-[0.98] w-full"
                        >
                          <span className="text-lg">📄</span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-foreground font-extrabold">{foodCert.fileName || "Download PDF Certificate"}</div>
                            <span className="text-[8px] text-foreground/45 font-semibold">Click to download certificate file</span>
                          </div>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-end">
                  <button 
                    onClick={() => setIsCertEditMode(true)}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-primary hover:bg-primary/95 text-white shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    ✏️ Update Certificate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MANAGE STUDY LINKS MODAL */}
      {isLinksModalOpen && (
        <div className="modal-overlay z-[100]">
          <div className="modal-container modal-md glass-card glow-purple text-foreground p-6 space-y-4">
            
            {/* Modal Header */}
            <div className="modal-header flex justify-between items-center pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔗</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                  Manage Useful Study Links
                </h3>
              </div>
              <button 
                onClick={() => setIsLinksModalOpen(false)}
                className="px-2.5 py-1 text-xs font-bold rounded bg-muted border border-border hover:bg-card text-foreground transition-all active:scale-95"
              >
                Close
              </button>
            </div>

            {/* Modal Body: List of links and form to add */}
            <div className="modal-body space-y-4 max-h-[380px] overflow-y-auto pr-1">
              
              {/* Add New Link Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newLinkTitle || !newLinkUrl) return;
                  const newLink = {
                    id: Date.now().toString(),
                    title: newLinkTitle,
                    url: newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`,
                    desc: newLinkDesc || 'Useful learning portal resource.',
                    subject: newLinkSubject
                  };
                  updateUsefulLinksState(prev => [newLink, ...prev]);
                  setNewLinkTitle('');
                  setNewLinkUrl('');
                  setNewLinkDesc('');
                  alert("Link added successfully!");
                }}
                className="p-3 bg-muted/30 border border-border rounded-xl space-y-3"
              >
                <strong className="text-xs font-black uppercase tracking-wider block text-primary">Add New Study Link</strong>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-foreground/75 uppercase tracking-wider block">Link Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Khan Academy" 
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-[11px] text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-foreground/75 uppercase tracking-wider block">Subject Tag</label>
                    <select
                      value={newLinkSubject}
                      onChange={(e) => setNewLinkSubject(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-[11px] text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                    >
                      <option value="Maths">Maths</option>
                      <option value="Science">Science</option>
                      <option value="English">English</option>
                      <option value="General">General Study</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-foreground/75 uppercase tracking-wider block">Website URL</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. www.khanacademy.org" 
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-[11px] text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-foreground/75 uppercase tracking-wider block">Brief Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Interactive math lessons & science topics." 
                    value={newLinkDesc}
                    onChange={(e) => setNewLinkDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-[11px] text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-1.5 bg-primary hover:bg-primary/95 text-xs font-bold text-white rounded-lg transition-all shadow-md active:scale-95"
                >
                  Publish Link to Portals
                </button>
              </form>

              {/* Current Links List */}
              <div className="space-y-2">
                <strong className="text-xs font-black uppercase tracking-wider block text-foreground/75">Active Resources ({usefulLinks.length})</strong>
                <div className="divide-y divide-border">
                  {usefulLinks.map(link => (
                    <div key={link.id} className="py-2.5 flex justify-between items-start gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-foreground font-bold">{link.title}</strong>
                          <span className="px-1.5 py-0.2 bg-primary/10 text-primary border border-primary/20 text-[8px] font-black uppercase rounded">
                            {link.subject}
                          </span>
                        </div>
                        <span className="text-[9px] text-foreground/50 block font-mono truncate max-w-[200px]">{link.url}</span>
                        <p className="text-[10px] text-foreground/70">{link.desc}</p>
                      </div>
                      <button 
                        onClick={() => {
                          updateUsefulLinksState(prev => prev.filter(l => l.id !== link.id));
                        }}
                        className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[9px] font-bold rounded transition-all active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="modal-footer pt-2 border-t border-border flex justify-end">
              <button 
                onClick={() => setIsLinksModalOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-muted border border-border hover:bg-card text-foreground transition-all active:scale-95"
              >
                Done
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
                      status: newAssignmentPublishDate <= todayStr ? 'Published' : 'Scheduled'
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
              <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
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

                        // Actually upload the file to the backend
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        // Fake progress interval while waiting for fetch
                        const progressInterval = setInterval(() => {
                          setUploadProgress(prev => (prev >= 90 ? 90 : prev + 10));
                        }, 100);

                        fetch('/api/v1/upload', {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${localStorage.getItem('ah_user_session') ? JSON.parse(localStorage.getItem('ah_user_session') || '{}').token : ''}`
                          },
                          body: formData
                        })
                        .then(res => res.json())
                        .then(data => {
                          clearInterval(progressInterval);
                          setUploadProgress(100);
                          if (data.success) {
                            setNewAssignmentFileUrl(data.data.url);
                          } else {
                            console.error('Upload failed:', data.message);
                            // Fallback to base64 if server upload fails (e.g., local dev)
                            const reader = new FileReader();
                            reader.onload = () => setNewAssignmentFileUrl(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                          setTimeout(() => setIsUploading(false), 300);
                        })
                        .catch(err => {
                          console.error('Upload error:', err);
                          clearInterval(progressInterval);
                          setUploadProgress(100);
                          // Fallback to base64 on error
                          const reader = new FileReader();
                          reader.onload = () => setNewAssignmentFileUrl(reader.result as string);
                          reader.readAsDataURL(file);
                          setTimeout(() => setIsUploading(false), 300);
                        });
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

              <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
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
                  {isEditor && (() => {
                    const nextRollNo = (Math.max(0, ...students.map(s => parseInt(s.roll) || 0)) + 1).toString().padStart(3, '0');
                    return (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        setEnrollmentError('');
                        
                        if (!newStudentName) return;
                        
                        // Validation Criteria
                        const age = parseInt(newStudentAge);
                        const marks = parseInt(newStudentMarks);
                        
                        if (isNaN(age) || age < minAdmissionAge) {
                          setEnrollmentError(`Admission Criteria Failed: Student must be at least ${minAdmissionAge} years old.`);
                          return;
                        }
                        
                        if (isNaN(marks) || marks < 50) {
                          setEnrollmentError('Admission Criteria Failed: Previous academic score must be at least 50% for admission.');
                          return;
                        }

                        // Document validation
                        const formElements = (e.target as HTMLFormElement).elements;
                        const birthCert = (formElements.namedItem('birthCert') as HTMLInputElement)?.files;
                        if (!birthCert || birthCert.length === 0) {
                          setEnrollmentError('Missing Document: Birth Certificate / B-Form is required.');
                          return;
                        }

                        if (students.some(s => s.name.toLowerCase() === newStudentName.toLowerCase() && s.className === newStudentClass)) {
                          setEnrollmentError(`Student ${newStudentName} already exists in ${newStudentClass}.`);
                          return;
                        }

                        // Check Class Capacity
                        const currentCount = students.filter(s => s.className === newStudentClass).length;
                        if (currentCount >= 30) {
                          setWaitingList(prev => [...prev, {
                            id: `wl-${Date.now()}`,
                            name: newStudentName,
                            className: newStudentClass,
                            dateAdded: new Date().toISOString(),
                            status: 'Waiting'
                          }]);
                          setEnrollmentError(`Admission Closed: ${newStudentClass} has reached maximum capacity (30). ${newStudentName} has been automatically added to the Waiting List.`);
                          (e.target as HTMLFormElement).reset();
                          setNewStudentName('');
                          return;
                        }
                        
                        requestSecurityVerification(`Enroll new student: "${newStudentName}" (Roll No: ${nextRollNo}) to class ${newStudentClass}`, () => {
                          setStudents(prev => [
                            ...prev,
                            { id: `s-${Date.now()}`, name: newStudentName, roll: nextRollNo, className: newStudentClass, status: 'Present' }
                          ]);
                          setNewStudentName('');
                          setNewStudentAge('');
                          setNewStudentMarks('');
                          setEnrollmentError('');
                          (e.target as HTMLFormElement).reset();
                        });
                      }}
                      className="p-4 bg-muted/30 border border-border rounded-xl space-y-4"
                    >
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Enroll New Student</span>
                      
                      {enrollmentError && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-500 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                          <AlertTriangle className="w-4 h-4 shrink-0" /> {enrollmentError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-foreground/60 uppercase">Full Name</label>
                          <input type="text" required placeholder="Student Name" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-foreground/60 uppercase">Age (Years)</label>
                          <input type="number" required placeholder={`Minimum ${minAdmissionAge} years`} value={newStudentAge} onChange={(e) => setNewStudentAge(e.target.value)} className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-foreground/60 uppercase">Previous Marks (%)</label>
                          <input type="number" required placeholder="Minimum 50%" value={newStudentMarks} onChange={(e) => setNewStudentMarks(e.target.value)} className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-foreground/60 uppercase">Class Group</label>
                          <select value={newStudentClass} onChange={(e) => setNewStudentClass(e.target.value)} className="w-full modern-input">
                            {filteredClasses.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-foreground/60 uppercase">Auto Roll No</label>
                          <input type="text" disabled value={`${getRollLabel()}: ${nextRollNo}`} className="w-full bg-card/50 border border-border/50 rounded-lg text-xs p-2.5 text-foreground/60 cursor-not-allowed font-mono" />
                        </div>
                      </div>

                      <div className="border-t border-border/50 pt-3">
                        <span className="block text-[10px] font-black text-foreground/50 uppercase tracking-wider mb-3">Required Documents (PDF/Images)</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-muted/20 border border-dashed border-border rounded-lg p-3 flex flex-col justify-center gap-2 hover:bg-muted/30 transition-colors cursor-pointer">
                            <label className="text-xs font-bold text-foreground/80 flex items-center gap-1 cursor-pointer"><FileText className="w-3 h-3 text-primary" /> Birth Certificate / B-Form <span className="text-rose-500">*</span></label>
                            <input name="birthCert" type="file" accept="image/*,.pdf" className="text-[10px] file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer text-foreground/60 w-full" />
                          </div>
                          <div className="bg-muted/20 border border-dashed border-border rounded-lg p-3 flex flex-col justify-center gap-2 hover:bg-muted/30 transition-colors cursor-pointer">
                            <label className="text-xs font-bold text-foreground/80 flex items-center gap-1 cursor-pointer"><FileText className="w-3 h-3 text-primary" /> Previous School Leaving Cert</label>
                            <input type="file" accept="image/*,.pdf" className="text-[10px] file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer text-foreground/60 w-full" />
                          </div>
                          <div className="bg-muted/20 border border-dashed border-border rounded-lg p-3 flex flex-col justify-center gap-2 hover:bg-muted/30 transition-colors cursor-pointer">
                            <label className="text-xs font-bold text-foreground/80 flex items-center gap-1 cursor-pointer"><FileText className="w-3 h-3 text-primary" /> Parent/Guardian ID</label>
                            <input type="file" accept="image/*,.pdf" className="text-[10px] file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer text-foreground/60 w-full" />
                          </div>
                          <div className="bg-muted/20 border border-dashed border-border rounded-lg p-3 flex flex-col justify-center gap-2 hover:bg-muted/30 transition-colors cursor-pointer">
                            <label className="text-xs font-bold text-foreground/80 flex items-center gap-1 cursor-pointer"><FileText className="w-3 h-3 text-primary" /> Student Photo (Passport Size)</label>
                            <input type="file" accept="image/*" className="text-[10px] file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer text-foreground/60 w-full" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-3">
                        <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                          + Verify & Enroll Student
                        </button>
                      </div>
                    </form>
                    );
                  })()}

                  {/* Tab Navigation for Roster / Waitlist */}
                  <div className="flex gap-2 border-b border-border/50 pb-2 mt-4">
                    <button onClick={() => setActiveStudentTab('roster')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeStudentTab === 'roster' ? 'bg-primary text-white' : 'bg-muted/30 hover:bg-muted/50 text-foreground/70'}`}>Active Roster</button>
                    <button onClick={() => setActiveStudentTab('waitlist')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeStudentTab === 'waitlist' ? 'bg-primary text-white' : 'bg-muted/30 hover:bg-muted/50 text-foreground/70'}`}>
                      Waiting List ({waitingList.length})
                    </button>
                  </div>

                  {activeStudentTab === 'roster' ? (
                  <>
                  {/* Beautiful Student Roster Grid */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <span className="block text-xs font-bold text-foreground/75 uppercase tracking-wider">Student Roster</span>
                      <input type="text" placeholder="Search students by name..." value={studentSearchTerm} onChange={e => setStudentSearchTerm(e.target.value)} className="bg-card border border-border rounded-lg text-[11px] p-2 px-3 w-full sm:w-64 text-foreground outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {filteredStudents.filter(s => s.name.toLowerCase().includes(studentSearchTerm.toLowerCase())).map((stud) => {
                        const initials = stud.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                        return (
                          <div key={stud.id} className="p-4 bg-card/65 border border-border rounded-xl flex flex-col items-center text-center gap-2 hover:border-primary/45 transition-all w-[calc(50%-6px)] sm:w-[calc(33.33%-9px)] lg:w-[calc(25%-9px)] shadow-sm group">
                            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-black text-primary group-hover:bg-primary/20 transition-colors">
                              {initials}
                            </div>
                            <div className="w-full">
                              <div className="text-xs font-bold text-foreground truncate w-full" title={stud.name}>{stud.name}</div>
                              <div className="text-[10px] text-foreground/60 font-semibold">{stud.className} | Roll: {stud.roll}</div>
                            </div>
                            <div className="w-full space-y-1 mt-1 border-t border-border/30 pt-2 text-left px-1">
                               <div className="text-[9px] text-slate-400 flex justify-between items-center"><span className="uppercase tracking-wider">Hostel</span> <span className="font-semibold text-foreground/80 truncate max-w-[60px]" title={stud.hostelStatus || 'Day Scholar'}>{stud.hostelStatus || 'Day Scholar'}</span></div>
                               <div className="text-[9px] text-slate-400 flex justify-between items-center"><span className="uppercase tracking-wider">Transport</span> <span className="font-semibold text-foreground/80 truncate max-w-[60px]" title={stud.bookedTransport || 'None'}>{stud.bookedTransport || 'None'}</span></div>
                               <div className="text-[9px] text-slate-400 flex justify-between items-center"><span className="uppercase tracking-wider">Books</span> <span className="font-semibold text-foreground/80">{stud.borrowedBooks?.length > 0 ? stud.borrowedBooks.length : '0'}</span></div>
                            </div>
                            {isEditor && (
                              <button 
                                onClick={() => requestSecureDelete(
                                  `Are you sure you want to permanently delete the student registry enrollment for ${stud.name}? This will check for waiting list availability.`,
                                  () => {
                                    setRecycleBin(prev => [...prev, { id: stud.id, type: 'student', data: stud, labelName: stud.name }]);
                                    setStudents((prev: any[]) => prev.filter(s => s.id !== stud.id));

                                    // Check Waitlist automatically
                                    const classWaitlist = waitingList.filter(w => w.className === stud.className);
                                    if (classWaitlist.length > 0) {
                                       const topCandidate = classWaitlist[0];
                                       if (window.confirm(`Space is now available in ${stud.className}! The top waiting student is ${topCandidate.name}. Send Congratulations message to parents to follow admission formalities?`)) {
                                          setWaitingList(prev => prev.filter(w => w.id !== topCandidate.id));
                                          alert(`Congratulations message sent to ${topCandidate.name}'s parents via SMS/Email!`);
                                       }
                                    }
                                  }
                                )}
                                className="text-[10px] text-red-400 hover:text-red-300 font-bold border border-red-500/20 px-3 py-1.5 rounded w-full mt-2 bg-red-500/5 hover:bg-red-500/10 transition-colors"
                              >
                                Delete & Free Seat
                              </button>
                            )}
                          </div>
                        );
                      })}
                      {filteredStudents.filter(s => s.name.toLowerCase().includes(studentSearchTerm.toLowerCase())).length === 0 && (
                        <div className="p-6 text-center text-xs text-foreground/50 w-full bg-muted/20 rounded-xl">No students match your search.</div>
                      )}
                    </div>
                  </div>
                  </>
                  ) : (
                    <div className="space-y-4 pt-2">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border/50 pb-3">
                         <span className="block text-xs font-bold text-foreground/75 uppercase tracking-wider">Admission Waiting List</span>
                         {isEditor && (
                           <button onClick={() => {
                             if(window.confirm('Discard all waiting list entries older than 6 months? This will send an SMS to parents to re-apply if still interested.')) {
                               alert('Old entries discarded. "Re-apply" SMS sent to parents successfully.');
                               // Assuming all are discarded for demo
                               setWaitingList([]);
                             }
                           }} className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 text-[10px] font-bold rounded-lg transition-colors">
                             Discard &gt;6 Months &amp; Notify Parents
                           </button>
                         )}
                      </div>
                      {waitingList.length === 0 ? (
                        <div className="p-6 text-center text-xs text-foreground/50 italic bg-muted/20 rounded-xl">No students currently in the waiting list. Classes have available capacity.</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {waitingList.map(w => (
                             <div key={w.id} className="p-3 border border-border bg-card rounded-xl flex justify-between items-center shadow-sm">
                               <div>
                                 <strong className="block text-xs font-bold text-foreground">{w.name}</strong>
                                 <span className="text-[10px] text-foreground/60">{w.className} • Waitlisted on: {new Date(w.dateAdded).toLocaleDateString()}</span>
                               </div>
                               {isEditor && (
                                 <button onClick={() => setWaitingList(prev => prev.filter(x => x.id !== w.id))} className="text-[10px] text-red-500 hover:text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded transition-colors">Remove</button>
                               )}
                             </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recycle Bin for Students */}
                  {isEditor && recycleBin.filter(x => x.type === 'student').length > 0 && (
                    <div className="mt-4 p-4 bg-red-500/5 border border-red-500/10 rounded-xl space-y-3">
                      <span className="block text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                        ♻️ Recycle Bin: Recently Deleted Students
                      </span>
                      <div className="space-y-2">
                        {recycleBin.filter(x => x.type === 'student').map((item) => (
                          <div key={item.id} className="p-3 bg-card/40 border border-border/60 rounded-xl flex items-center justify-between gap-3 text-xs">
                            <div>
                              <strong className="block text-foreground font-bold">{item.labelName}</strong>
                              <span className="text-[10px] text-foreground/50">{item.data.className} | Roll: {item.data.roll}</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setStudents((prev: any[]) => [...prev, item.data]);
                                  setRecycleBin((prev: any[]) => prev.filter(x => x.id !== item.id));
                                }}
                                className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold rounded border border-emerald-500/20 text-[10px] cursor-pointer"
                              >
                                Restore Data
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRecycleBin((prev: any[]) => prev.filter(x => x.id !== item.id));
                                }}
                                className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded border border-red-500/20 text-[10px] cursor-pointer"
                              >
                                Purge
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* EMPLOYEE MANAGEMENT */}
              {(activeFeature === 'Teacher Management' || activeFeature === 'Employee Management') && (
                <div className="space-y-4">
                  {/* Add Employee Form */}
                  {isEditor && (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newTeacherName) return;
                        requestSecurityVerification(`Register new employee: "${newTeacherName}" as ${newEmployeeRole}`, () => {
                          setTeachers(prev => [
                            ...prev,
                            { 
                              id: `t-${Date.now()}`, 
                              name: newTeacherName, 
                              role: newEmployeeRole,
                              gender: newTeacherGender,
                              subject: newTeacherSubject || 'N/A',
                              className: newEmployeeRole === 'Teacher' ? newTeacherClass : 'N/A', 
                              qualification: newTeacherQualification || 'N/A',
                              salary: newTeacherSalary || 'N/A',
                              experience: newTeacherExperience,
                              email: newTeacherEmail || 'N/A',
                              phone: newTeacherPhone || 'N/A',
                              photo: newTeacherPhoto,
                              doc: newTeacherDoc,
                              status: 'Active' 
                            }
                          ]);
                          setNewTeacherName('');
                          setNewEmployeeRole('Teacher');
                          setNewTeacherSubject(schoolSubjects[0]);
                          setNewTeacherQualification('');
                          setNewTeacherSalary('');
                          setNewTeacherExperience('Fresh');
                          setNewTeacherEmail('');
                          setNewTeacherPhone('');
                          setNewTeacherPhoto(null);
                          setNewTeacherDoc(null);
                        });
                      }}
                      className="p-5 bg-muted/30 border border-border rounded-xl space-y-4 shadow-inner"
                    >
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Add New Employee</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-foreground/70 font-semibold">Employee Name</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="Full Name"
                            value={newTeacherName}
                            onChange={(e) => setNewTeacherName(e.target.value)}
                            className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-foreground/70 font-semibold">Designation / Role</label>
                          <select 
                            value={newEmployeeRole}
                            onChange={(e) => setNewEmployeeRole(e.target.value)}
                            className="modern-input"
                          >
                            {['Teacher', 'Vice Principal', 'Coordinator', 'Domestic Staff', 'Helper', 'Guard', 'Electrician', 'Plumber', 'Gardener', 'Librarian', 'Accountant', 'Admin Staff'].map((role) => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        </div>

                        {newEmployeeRole === 'Teacher' && (
                          <>
                            <div className="flex flex-col gap-1 animate-fadeIn">
                              <label className="text-[10px] text-foreground/70 font-semibold">Subject</label>
                              <select 
                                value={newTeacherSubject}
                                onChange={(e) => setNewTeacherSubject(e.target.value)}
                                className="modern-input"
                              >
                                {schoolSubjects.map((sub) => (
                                  <option key={sub} value={sub}>{sub}</option>
                                ))}
                              </select>
                            </div>

                            <div className="flex flex-col gap-1 animate-fadeIn">
                              <label className="text-[10px] text-foreground/70 font-semibold">Assigned Class Room</label>
                              <select 
                                value={newTeacherClass} 
                                onChange={(e) => setNewTeacherClass(e.target.value)}
                                className="modern-input"
                              >
                                {filteredClasses.map((cls) => (
                                  <option key={cls} value={cls}>{cls}</option>
                                ))}
                              </select>
                            </div>
                          </>
                        )}
                        {newEmployeeRole !== 'Teacher' && (
                          <div className="flex flex-col gap-1 animate-fadeIn">
                            <label className="text-[10px] text-foreground/70 font-semibold">Department / Field / Area</label>
                            <input 
                              type="text" 
                              value={newTeacherSubject}
                              onChange={(e) => setNewTeacherSubject(e.target.value)}
                              placeholder="e.g. Maintenance, Security, Admin"
                              className="modern-input"
                            />
                          </div>
                        )}

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-foreground/70 font-semibold">Academic Qualification</label>
                          <input 
                            type="text" 
                            placeholder="e.g. M.Phil Physics, B.Ed"
                            value={newTeacherQualification}
                            onChange={(e) => setNewTeacherQualification(e.target.value)}
                            className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-foreground/70 font-semibold">Decided Salary (Monthly)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 45,000"
                            value={newTeacherSalary}
                            onChange={(e) => setNewTeacherSalary(e.target.value)}
                            className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-foreground/70 font-semibold">Teaching Experience</label>
                          <select 
                            value={newTeacherExperience} 
                            onChange={(e) => setNewTeacherExperience(e.target.value)}
                            className="modern-input"
                          >
                            <option value="Fresh">Fresh Graduate / Entry Level</option>
                            <option value="1 Year">1 Year</option>
                            <option value="2-3 Years">2-3 Years</option>
                            <option value="5+ Years">5+ Years</option>
                            <option value="10+ Years">10+ Years</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-foreground/70 font-semibold">Email Address</label>
                          <input 
                            type="email" 
                            placeholder="e.g. teacher@school.com"
                            value={newTeacherEmail}
                            onChange={(e) => setNewTeacherEmail(e.target.value)}
                            className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-foreground/70 font-semibold">Contact / Phone Number</label>
                          <input 
                            type="text" 
                            placeholder="e.g. +92 300 1234567"
                            value={newTeacherPhone}
                            onChange={(e) => setNewTeacherPhone(e.target.value)}
                            className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {/* Profile Photo */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-foreground/70 uppercase">Teacher Profile Photo</span>
                          <div className="relative border-2 border-dashed border-border rounded-xl p-4 bg-card/40 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors h-[110px]">
                            {newTeacherPhoto ? (
                              <div className="flex items-center gap-3">
                                <img src={newTeacherPhoto} alt="Preview" className="w-14 h-14 rounded-full object-cover border border-primary/30" />
                                <button 
                                  type="button" 
                                  onClick={() => setNewTeacherPhoto(null)}
                                  className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold rounded-lg border border-red-500/20"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <>
                                <label className="cursor-pointer flex flex-col items-center gap-1">
                                  <Upload className="w-5 h-5 text-muted-foreground" />
                                  <span className="text-[11px] text-foreground font-semibold">Upload Photo</span>
                                  <span className="text-[9px] text-muted-foreground">PNG, JPG up to 2MB</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setNewTeacherPhoto(reader.result as string);
                                        reader.readAsDataURL(file);
                                      }
                                    }} 
                                  />
                                </label>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Certificate / Application Doc */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-foreground/70 uppercase">Application Letter / Certificate</span>
                          <div className="relative border-2 border-dashed border-border rounded-xl p-4 bg-card/40 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors h-[110px]">
                            {newTeacherDoc ? (
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg text-primary">
                                  <FileText className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                  <span className="text-[10px] text-foreground font-bold block truncate max-w-[120px]">Document Loaded</span>
                                  <button 
                                    type="button" 
                                    onClick={() => setNewTeacherDoc(null)}
                                    className="text-[9px] text-red-400 hover:text-red-300 font-bold mt-0.5 underline block"
                                  >
                                    Remove Doc
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <label className="cursor-pointer flex flex-col items-center gap-1">
                                  <Upload className="w-5 h-5 text-muted-foreground" />
                                  <span className="text-[11px] text-foreground font-semibold">Attach Application / Degree</span>
                                  <span className="text-[9px] text-muted-foreground">Upload Image Scan</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setNewTeacherDoc(reader.result as string);
                                        reader.readAsDataURL(file);
                                      }
                                    }} 
                                  />
                                </label>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button type="submit" className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                          + Appoint New Employee
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Staff Directory */}
                  <div className="space-y-3 pt-4 border-t border-border/60">
                    <span className="block text-xs font-bold text-foreground/75 uppercase tracking-wider">Staff Directory</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredTeachers.map((teach) => (
                        <div 
                          key={teach.id} 
                          onClick={() => setSelectedDetailedTeacher(teach)}
                          className="p-4 bg-card/60 border border-border rounded-xl flex flex-col gap-4 hover:border-primary/45 hover:bg-card/80 transition-all cursor-pointer group shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              {teach.photo ? (
                                <img src={teach.photo} alt={teach.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shrink-0" />
                              ) : (
                                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${teach.gender === 'Female' ? 'bg-pink-500/10 border-pink-500/20 text-pink-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                                  {teach.gender === 'Female' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z"/><path d="M16 16v-2a4 4 0 0 0-8 0v2"/><path d="M12 16v6"/><path d="M9 22h6"/></svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                  )}
                                </div>
                              )}
                              <div>
                                <strong className="block text-sm text-foreground font-black group-hover:text-primary transition-colors">{teach.name}</strong>
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm inline-block mt-1">{teach.role || 'Teacher'}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2" onClick={(e) => e.stopPropagation()}>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[9px] uppercase tracking-wider shrink-0">
                                Verified
                              </span>
                              {isEditor && (
                                <button 
                                  onClick={() => requestSecureDelete(
                                    `Are you sure you want to dismiss and delete the teacher record for ${teach.name}?`,
                                    () => {
                                      setRecycleBin(prev => [...prev, { id: teach.id, type: 'teacher', data: teach, labelName: teach.name }]);
                                      setTeachers((prev: any[]) => prev.filter(t => t.id !== teach.id));
                                      if (selectedDetailedTeacher?.id === teach.id) {
                                        setSelectedDetailedTeacher(null);
                                      }
                                    }
                                  )}
                                  className="text-[10px] text-rose-400 hover:text-rose-300 font-bold mt-1 uppercase"
                                >
                                  Dismiss
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="bg-primary/5 rounded border border-primary/10 p-2.5">
                              <span className="block text-[9px] font-bold text-foreground/50 uppercase tracking-wider mb-0.5">Salary</span>
                              <span className="block text-lg font-black text-foreground">Rs. {teach.salary ? Number(teach.salary).toLocaleString() : 'N/A'}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 bg-muted/40 p-3 rounded-lg border border-border/50">
                              {(!teach.role || teach.role === 'Teacher') ? (
                                <div className="col-span-2">
                                  <span className="block text-[9px] font-bold text-foreground/50 uppercase">Subject & Class</span>
                                  <span className="block text-xs font-semibold text-foreground/90">{teach.subject || 'N/A'} ({teach.className || 'N/A'})</span>
                                </div>
                              ) : (
                                <div className="col-span-2">
                                  <span className="block text-[9px] font-bold text-foreground/50 uppercase">Department / Area</span>
                                  <span className="block text-xs font-semibold text-foreground/90">{teach.subject || 'N/A'}</span>
                                </div>
                              )}
                              
                              <div className="col-span-2">
                                <span className="block text-[9px] font-bold text-foreground/50 uppercase">Qualification</span>
                                <span className="block text-xs font-semibold text-foreground/90">{teach.qualification || 'N/A'} {teach.experience ? `• ${teach.experience}` : ''}</span>
                              </div>
                              
                              {(teach.phone && teach.phone !== 'N/A') && (
                                <div className="col-span-2 flex items-center gap-2 mt-1">
                                  <span className="text-foreground/50"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
                                  <span className="block text-xs font-semibold text-foreground/90">{teach.phone}</span>
                                </div>
                              )}
                              
                              {(teach.email && teach.email !== 'N/A') && (
                                <div className="col-span-2 flex items-center gap-2">
                                  <span className="text-foreground/50"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>
                                  <span className="block text-xs font-semibold text-foreground/90 truncate">{teach.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recycle Bin for Teachers */}
                  {isEditor && recycleBin.filter(x => x.type === 'teacher').length > 0 && (
                    <div className="mt-4 p-4 bg-red-500/5 border border-red-500/10 rounded-xl space-y-3">
                      <span className="block text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                        ♻️ Recycle Bin: Recently Dismissed Teachers
                      </span>
                      <div className="space-y-2">
                        {recycleBin.filter(x => x.type === 'teacher').map((item) => (
                          <div key={item.id} className="p-3 bg-card/40 border border-border/60 rounded-xl flex items-center justify-between gap-3 text-xs" onClick={(e) => e.stopPropagation()}>
                            <div>
                              <strong className="block text-foreground font-bold">{item.labelName}</strong>
                              <span className="text-[10px] text-foreground/50">{item.data.subject} | {item.data.className}</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setTeachers((prev: any[]) => [...prev, item.data]);
                                  setRecycleBin((prev: any[]) => prev.filter(x => x.id !== item.id));
                                }}
                                className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold rounded border border-emerald-500/20 text-[10px] cursor-pointer"
                              >
                                Restore Data
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRecycleBin((prev: any[]) => prev.filter(x => x.id !== item.id));
                                }}
                                className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded border border-red-500/20 text-[10px] cursor-pointer"
                              >
                                Purge
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Teacher Details Modal */}
                  {selectedDetailedTeacher && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                      <div className="bg-background/95 border border-border w-full max-w-lg rounded-2xl shadow-2xl p-6 relative overflow-hidden flex flex-col max-h-[85vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-4">
                          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Teacher Profile File</h3>
                          <button 
                            onClick={() => setSelectedDetailedTeacher(null)}
                            className="p-1 hover:bg-muted rounded-lg text-foreground/60 hover:text-foreground transition-colors text-xs font-semibold px-2"
                          >
                            Close
                          </button>
                        </div>

                        {/* Modal Content */}
                        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
                          <div className="flex items-center gap-4 p-3 bg-muted/20 border border-border/60 rounded-xl">
                            {selectedDetailedTeacher.photo ? (
                              <img src={selectedDetailedTeacher.photo} alt={selectedDetailedTeacher.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/30" />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-black text-primary text-xl">
                                {selectedDetailedTeacher.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h4 className="text-sm font-bold text-foreground">{selectedDetailedTeacher.name}</h4>
                              <p className="text-xs text-foreground/60">{selectedDetailedTeacher.subject} Teacher</p>
                              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold">
                                Assigned to {selectedDetailedTeacher.className}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3.5">
                            <div className="p-3 bg-card border border-border rounded-xl">
                              <span className="block text-[9px] uppercase font-bold text-foreground/60">Qualification</span>
                              <strong className="text-xs text-foreground block mt-0.5">{selectedDetailedTeacher.qualification || 'N/A'}</strong>
                            </div>
                            <div className="p-3 bg-card border border-border rounded-xl">
                              <span className="block text-[9px] uppercase font-bold text-foreground/60">Decided Salary</span>
                              <strong className="text-xs text-emerald-400 block mt-0.5 font-bold">
                                {selectedDetailedTeacher.salary ? `Rs. ${selectedDetailedTeacher.salary}` : 'N/A'}
                              </strong>
                            </div>
                            <div className="p-3 bg-card border border-border rounded-xl">
                              <span className="block text-[9px] uppercase font-bold text-foreground/60">Experience</span>
                              <strong className="text-xs text-foreground block mt-0.5">{selectedDetailedTeacher.experience || 'Fresh'}</strong>
                            </div>
                            <div className="p-3 bg-card border border-border rounded-xl">
                              <span className="block text-[9px] uppercase font-bold text-foreground/60">Contract Status</span>
                              <strong className="text-xs text-emerald-400 block mt-0.5 font-bold">{selectedDetailedTeacher.status || 'Active'}</strong>
                            </div>
                          </div>

                          <div className="space-y-2 p-3 bg-card border border-border rounded-xl">
                            <span className="block text-[9px] uppercase font-bold text-foreground/60">Contact Details</span>
                            <div className="text-xs space-y-1 text-foreground/80 font-medium">
                              <div className="flex justify-between">
                                <span>Email:</span>
                                <span className="text-primary hover:underline cursor-pointer">{selectedDetailedTeacher.email || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Phone:</span>
                                <span>{selectedDetailedTeacher.phone || 'N/A'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Attached Certificate / Application Preview */}
                          <div className="space-y-2">
                            <span className="block text-[10px] font-bold text-foreground/75 uppercase tracking-wider">Attached Application / Degree Certificate Scan:</span>
                            {selectedDetailedTeacher.doc ? (
                              <div className="border border-border/80 rounded-xl overflow-hidden bg-card p-1">
                                <img src={selectedDetailedTeacher.doc} alt="Attachment Preview" className="w-full h-auto max-h-[300px] object-contain rounded-lg" />
                              </div>
                            ) : (
                              <div className="p-6 text-center bg-muted/20 border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                                No certificate or application scan document was uploaded.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              )}

              {/* ATTENDANCE MONITORING & ATTENDANCE MARKING & CHILD ATTENDANCE & ATTENDANCE LEDGER */}
              
              {/* TEACHER ADVANCED MODULES */}
              {(activeFeature === 'Lesson Planner') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📝 Create and upload your weekly lesson plans. Ensure alignment with the curriculum syllabus.
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Demo Lesson Plan */}
                    <div className="p-5 bg-card border border-border rounded-xl space-y-4 flex flex-col h-[400px]">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Demo Lesson Plan: Physics (Kinematics)</span>
                      <div className="flex-1 bg-muted/20 border border-border rounded-lg p-4 overflow-y-auto space-y-3">
                        <div className="space-y-1">
                          <strong className="text-xs text-foreground block">Objective:</strong>
                          <p className="text-[11px] text-muted-foreground">Students will understand Newton's First Law of Motion and be able to define inertia with real-world examples.</p>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-xs text-foreground block">Materials Required:</strong>
                          <p className="text-[11px] text-muted-foreground">Whiteboard, Physics Lab Kit #2 (Ramp, Cart, Weights), Projector.</p>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-xs text-foreground block">Instructional Sequence:</strong>
                          <ul className="list-disc list-inside text-[11px] text-muted-foreground space-y-0.5">
                            <li>Warm-up (5 mins): Discuss why passengers jerk forward when a bus stops.</li>
                            <li>Direct Instruction (15 mins): Define Inertia & Mass relationship.</li>
                            <li>Guided Practice (15 mins): Ramp & Cart experiment in groups.</li>
                            <li>Closure (5 mins): Quick exit ticket summarizing findings.</li>
                          </ul>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg transition-colors border border-primary/20">
                        Use as Template
                      </button>
                    </div>

                    {/* Upload Planner Form */}
                    <div className="p-5 bg-card border border-border rounded-xl space-y-4 flex flex-col h-[400px]">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Upload Weekly Plan (PDF)</span>
                      
                      <div className="flex-1 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center p-6 bg-muted/5 group hover:bg-muted/10 hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        <strong className="text-sm text-foreground block mb-1">Drag & Drop PDF Document</strong>
                        <span className="text-xs text-muted-foreground max-w-[200px]">Only .pdf files are accepted. Max size 5MB.</span>
                      </div>
                      
                      <div className="space-y-3">
                        <select className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold">
                          <option>Select Class Section</option>
                          <option>10-A (Physics)</option>
                          <option>9-B (Physics)</option>
                        </select>
                        <button 
                          onClick={(e) => { e.preventDefault(); alert("Lesson Plan uploaded and sent to Principal for review!"); }}
                          className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md flex justify-center items-center gap-2"
                        >
                          <Upload className="w-4 h-4" /> Submit to Principal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Class Diary') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📓 Maintain a daily log of topics covered and homework assigned for each class. Parents can view this on their portal.
                  </div>
                  
                  <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Daily Entry Form</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1 space-y-3">
                        <label className="text-[11px] font-bold text-muted-foreground">Class & Subject</label>
                        <select className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold">
                          <option>10-A (Physics)</option>
                          <option>9-B (Physics)</option>
                        </select>
                        <label className="text-[11px] font-bold text-muted-foreground mt-3 block">Date</label>
                        <input type="date" className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold" defaultValue={new Date().toISOString().split('T')[0]} />
                      </div>
                      <div className="md:col-span-2 space-y-3">
                        <label className="text-[11px] font-bold text-muted-foreground">Topics Covered Today</label>
                        <textarea rows={2} className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" placeholder="e.g. Discussed Chapter 4, Newton's Laws..."></textarea>
                        
                        <label className="text-[11px] font-bold text-muted-foreground mt-3 block">Homework / Next Steps</label>
                        <textarea rows={2} className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" placeholder="e.g. Complete Exercise 4.2..."></textarea>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2 border-t border-border/50">
                      <button 
                        onClick={() => alert("Class Diary Entry successfully published! Parents will receive a notification.")}
                        className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                      >
                        Publish Diary Entry
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Quiz Creation') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed flex justify-between items-center">
                    <span>✏️ Generate dynamic digital quizzes and online assessments for your students.</span>
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-[10px] font-black uppercase">Live Quiz Engine</span>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Create Form */}
                    <div className="lg:col-span-2 p-5 bg-card border border-border rounded-xl space-y-4">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Quiz Builder</span>
                      
                      <div className="flex gap-3">
                        <input type="text" placeholder="Quiz Title (e.g. End of Chapter 4 Test)" className="flex-1 bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" />
                        <input type="number" placeholder="Duration (Mins)" className="w-32 bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" />
                      </div>
                      
                      <div className="p-4 border border-border bg-muted/10 rounded-lg space-y-3">
                        <span className="text-[11px] font-bold text-primary flex items-center gap-2"><Plus className="w-3 h-3" /> Add Question 1</span>
                        <input type="text" placeholder="Type your question here..." className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border">
                            <input type="radio" name="q1" className="text-primary" />
                            <input type="text" placeholder="Option A" className="flex-1 bg-transparent text-xs outline-none" />
                          </div>
                          <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border">
                            <input type="radio" name="q1" className="text-primary" />
                            <input type="text" placeholder="Option B" className="flex-1 bg-transparent text-xs outline-none" />
                          </div>
                          <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border">
                            <input type="radio" name="q1" className="text-primary" />
                            <input type="text" placeholder="Option C" className="flex-1 bg-transparent text-xs outline-none" />
                          </div>
                          <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border">
                            <input type="radio" name="q1" className="text-primary" />
                            <input type="text" placeholder="Option D" className="flex-1 bg-transparent text-xs outline-none" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <button className="text-xs text-primary font-bold hover:underline">+ Add Another Question</button>
                        <button 
                          onClick={() => alert("Quiz Generated! A notification has been sent to the class.")}
                          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                        >
                          Generate & Publish Quiz
                        </button>
                      </div>
                    </div>

                    {/* Active Quizzes */}
                    <div className="lg:col-span-1 space-y-3">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Active Quizzes</span>
                      {[
                        { title: 'Physics Mid-term Prep', class: '10-A', subs: 14, tot: 28 },
                        { title: 'Basic Algebra Test', class: '9-B', subs: 25, tot: 25 },
                      ].map((q, i) => (
                        <div key={i} className="p-3.5 bg-card border border-border rounded-xl border-l-4 border-l-primary flex flex-col gap-2">
                          <strong className="text-xs text-foreground block truncate">{q.title}</strong>
                          <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
                            <span>Class: {q.class}</span>
                            <span>{q.subs}/{q.tot} Submitted</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1 mt-1">
                            <div className="bg-primary h-1 rounded-full" style={{ width: `${(q.subs/q.tot)*100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Student Remarks') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    🌟 Log individual student remarks regarding behavior, participation, and academic improvement.
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Add Remark</span>
                      <select className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold">
                        {students.map(s => <option key={s.id}>{s.name} ({s.className})</option>)}
                      </select>
                      <select className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold">
                        <option value="Positive">Positive / Reward</option>
                        <option value="Improvement">Needs Improvement</option>
                        <option value="Behavioral">Behavioral Alert</option>
                      </select>
                      <textarea rows={4} className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" placeholder="Write detailed remark here..."></textarea>
                      <button 
                        onClick={() => alert("Remark logged! It is now visible on the Parent's Dashboard.")}
                        className="w-full py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                      >
                        Submit Remark
                      </button>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-xl space-y-3 overflow-y-auto max-h-[350px]">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">Recent Logs</span>
                      {[
                        { student: 'Kamran Shah', type: 'Positive', text: 'Excellent participation in the Physics lab experiment today.' },
                        { student: 'Ali Raza', type: 'Improvement', text: 'Needs to focus more on completing homework on time.' },
                      ].map((r, i) => (
                        <div key={i} className="p-3 bg-muted/30 border border-border rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <strong className="text-xs text-foreground">{r.student}</strong>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${r.type === 'Positive' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                              {r.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

{(activeFeature === 'Attendance Monitoring' || activeFeature === 'Attendance Marking' || activeFeature === 'Child Attendance' || activeFeature === 'Attendance Ledger') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    {isEditor ? "📊 View and log weekly attendance records alongside average campus attendance trends." : "📅 Track your daily attendance, monitor overall presence, and review leave history."}
                  </div>

                  {isEditor ? (
                    <>
                      {/* Side-by-Side Attendance & Performance Analytics */}
                      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                        
                        {/* Attendance Tracking Grid */}
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col text-slate-200 shadow-xl">
                          <span className="text-[11px] font-bold text-primary uppercase tracking-wider block text-center">Attendance Tracking (Weekly)</span>
                          <div className="overflow-x-auto">
                            <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left text-[11px] border-collapse">
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
                                  .map((s) => (
                                  <tr key={s.id}>
                                    <td className="py-2.5 font-semibold text-slate-300">{s.name.split(' ')[0]}</td>
                                    <td className="py-2.5 text-center text-emerald-400 font-bold">✓</td>
                                    <td className="py-2.5 text-center text-emerald-400 font-bold">✓</td>
                                    <td className="py-2.5 text-center text-emerald-400 font-bold">✓</td>
                                    <td className={`py-2.5 text-center font-bold ${s.id === '3' ? 'text-rose-500' : 'text-emerald-400'}`}>{s.id === '3' ? '✗' : '✓'}</td>
                                    <td className="py-2.5 text-center text-emerald-400 font-bold">✓</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table></div>
                          </div>
                        </div>

                        {/* Attendance Analytics or Personal Metrics */}
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between text-slate-200 shadow-xl">
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
                      </div>
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1 mt-4">
                        {students.map((stud) => (
                          <div key={stud.id} className="p-3.5 bg-card border border-border rounded-xl flex items-center justify-between shadow-sm">
                            <div>
                              <strong className="block text-sm text-foreground">{stud.name}</strong>
                              <span className="text-xs text-foreground/50">{stud.className} | {getRollLabel()}: {stud.roll}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
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
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1 w-full">
                      
                      {/* Left: Key Stats & Beautiful Circular Progress */}
                      <div className="lg:col-span-5 p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-3xl flex flex-col justify-between space-y-6 shadow-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
                            <UserCheck className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-foreground">Attendance Overview</h3>
                            <p className="text-[11px] font-medium text-foreground/60">Current Semester</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center py-4 relative">
                          {/* Simulated SVG Donut Chart */}
                          <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-muted/40" />
                              <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)] transition-all duration-1000 ease-out" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.965)} strokeLinecap="round" />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center text-center">
                              <strong className="text-3xl font-black text-foreground">96<span className="text-xl">.5%</span></strong>
                              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mt-0.5">Present</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-card/80 backdrop-blur-sm border border-border/60 p-4 rounded-2xl flex flex-col justify-center items-center text-center shadow-sm hover:border-emerald-500/30 transition-colors">
                            <span className="text-[10px] uppercase font-bold text-foreground/60 tracking-wider">Total Present</span>
                            <strong className="text-2xl font-black text-emerald-500 mt-1">46</strong>
                            <span className="text-[9px] font-semibold text-emerald-500/70">DAYS</span>
                          </div>
                          <div className="bg-card/80 backdrop-blur-sm border border-border/60 p-4 rounded-2xl flex flex-col justify-center items-center text-center shadow-sm hover:border-rose-500/30 transition-colors">
                            <span className="text-[10px] uppercase font-bold text-foreground/60 tracking-wider">Absences</span>
                            <strong className="text-2xl font-black text-rose-500 mt-1">1</strong>
                            <span className="text-[9px] font-semibold text-rose-500/70">DAY</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Weekly Log & Status Tracker */}
                      <div className="lg:col-span-7 flex flex-col gap-5">
                        
                        <div className="p-6 bg-card border border-border rounded-3xl flex-1 flex flex-col shadow-xl hover:shadow-primary/5 transition-all">
                          <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                            <Calendar className="w-4 h-4 text-primary" />
                            This Week's Activity
                          </h4>
                          <div className="flex-1 flex flex-col justify-between space-y-2">
                            {[
                              { day: 'Monday', date: 'June 08', status: 'Present', color: 'emerald' },
                              { day: 'Tuesday', date: 'June 09', status: 'Present', color: 'emerald' },
                              { day: 'Wednesday', date: 'June 10', status: 'Present', color: 'emerald' },
                              { day: 'Thursday', date: 'June 11', status: 'Absent', color: 'rose' },
                              { day: 'Friday', date: 'June 12', status: 'Present', color: 'emerald' }
                            ].map((row, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/20 border border-border/40 hover:bg-muted/40 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${row.color === 'emerald' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]'}`}></div>
                                  <div>
                                    <span className="text-sm font-bold text-foreground block">{row.day}</span>
                                    <span className="text-[10px] text-foreground/50 font-semibold">{row.date}</span>
                                  </div>
                                </div>
                                <span className={`px-3 py-1 bg-${row.color}-500/10 text-${row.color}-500 border border-${row.color}-500/20 text-[11px] font-bold rounded-lg uppercase tracking-wider`}>
                                  {row.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-5 bg-card/60 border border-border rounded-2xl flex items-center gap-4">
                           <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 shrink-0">
                             <AlertTriangle className="w-5 h-5" />
                           </div>
                           <div>
                             <h4 className="text-xs font-bold text-foreground">Need to take a day off?</h4>
                             <p className="text-[11px] text-foreground/60 mt-0.5 leading-relaxed">Submit a leave request in advance to ensure it counts as an "Approved Leave" rather than an unexcused absence.</p>
                           </div>
                           <button onClick={() => setActiveFeature('Leave Management')} className="ml-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-md">
                             Request Leave
                           </button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* FEE MONITORING & FEE STATUS & FEE PAYMENTS & FEE COLLECTION & FEE DEFAULTERS & INVOICING */}
              



              {/* MANAGEMENT (HR) & ACADEMIC MODULES */}
              {(activeFeature === 'HRMS' || activeFeature === 'Recruitment') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                      <span className="text-purple-400 text-[11px] font-bold uppercase">Total Staff</span>
                      <strong className="text-foreground text-2xl font-black block mt-1">142</strong>
                    </div>
                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                      <span className="text-indigo-400 text-[11px] font-bold uppercase">Open Requisitions</span>
                      <strong className="text-foreground text-2xl font-black block mt-1">3</strong>
                    </div>
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <span className="text-emerald-400 text-[11px] font-bold uppercase">Active Candidates</span>
                      <strong className="text-foreground text-2xl font-black block mt-1">28</strong>
                    </div>
                  </div>

                  <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <strong className="text-xs font-bold text-foreground uppercase tracking-wider">Recruitment Pipeline</strong>
                      <button className="px-3 py-1 bg-primary text-white rounded text-[10px] font-bold">+ Post Job</button>
                    </div>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                          <th className="p-2">Role</th>
                          <th className="p-2">Department</th>
                          <th className="p-2">Applicants</th>
                          <th className="p-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] font-semibold">
                        {[
                          { role: 'Senior Physics Teacher', dept: 'Science Faculty', apps: 12, status: 'Interviewing', color: 'amber' },
                          { role: 'Accountant', dept: 'Finance Office', apps: 45, status: 'Screening', color: 'blue' },
                          { role: 'Librarian', dept: 'Administration', apps: 8, status: 'Hired', color: 'emerald' },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                            <td className="p-2 text-primary font-bold">{row.role}</td>
                            <td className="p-2 text-muted-foreground">{row.dept}</td>
                            <td className="p-2">{row.apps} Resumes</td>
                            <td className="p-2 text-right">
                              <span className={`px-2 py-0.5 bg-${row.color}-500/10 text-${row.color}-500 rounded font-bold`}>{row.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {(activeFeature === 'Payroll' || activeFeature === 'Leave Management') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-card border border-border rounded-xl flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Batch Payroll Generator</span>
                      <p className="text-[11px] text-muted-foreground">Automatically compute base salaries, tax deductions, and unpaid leave penalties for all 142 employees.</p>
                      <button 
                        onClick={(e) => {
                           const btn = e.currentTarget;
                           btn.innerHTML = '<span class="animate-pulse">Computing Taxes & Deductions...</span>';
                           setTimeout(() => btn.innerHTML = '✅ Payroll Processed & Payslips Generated', 2000);
                        }}
                        className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        Process June Payroll
                      </button>
                    </div>
                    
                    <div className="w-px bg-border hidden md:block"></div>
                    
                    <div className="flex-1 space-y-4">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Pending Leave Requests</span>
                      <div className="space-y-2">
                        {[
                          { name: 'Miss Fatima', type: 'Sick Leave', days: '2 Days (Unpaid)' },
                          { name: 'Mr. Ali Raza', type: 'Casual Leave', days: '1 Day (Paid)' }
                        ].map((req, i) => (
                          <div key={i} className="p-3 bg-muted/20 border border-border rounded-lg flex justify-between items-center group">
                            <div>
                              <strong className="text-xs text-foreground block">{req.name}</strong>
                              <span className="text-[10px] text-rose-400 font-semibold">{req.type} | {req.days}</span>
                            </div>
                            <div className="flex gap-1 transition-opacity">
                              <button onClick={(e) => {
                                alert(`Leave Request for ${req.name} Approved successfully.`);
                                e.currentTarget.parentElement.innerHTML = '<span class="text-[10px] font-bold text-emerald-500 px-2">Approved</span>';
                              }} className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-bold rounded cursor-pointer transition-all shadow-sm">Approve</button>
                              <button onClick={(e) => {
                                alert(`Leave Request for ${req.name} Rejected.`);
                                e.currentTarget.parentElement.innerHTML = '<span class="text-[10px] font-bold text-rose-500 px-2">Rejected</span>';
                              }} className="px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[9px] font-bold rounded cursor-pointer transition-all shadow-sm">Reject</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Timetable Generator') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <strong className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary" /> AI Timetable Generator</strong>
                      <button className="px-3 py-1 bg-primary text-white rounded text-[10px] font-bold shadow-md">Export PDF</button>
                    </div>
                    <div className="bg-muted/10 p-4 border border-dashed border-border rounded-xl text-center space-y-3">
                      <p className="text-[11px] text-muted-foreground">Select a grade section to automatically distribute subjects without teacher overlaps.</p>
                      <select className="px-4 py-2 bg-background border border-border rounded-lg text-xs outline-none text-foreground w-64 max-w-full mx-auto block mb-3">
                        <option>Grade 9 - Science Group</option>
                        <option>Grade 10 - Arts Group</option>
                      </select>
                      <button 
                         onClick={(e) => {
                           const btn = e.currentTarget;
                           btn.innerHTML = '<span class="animate-spin inline-block mr-2">⚙️</span> Resolving Conflicts...';
                           setTimeout(() => btn.innerHTML = '✅ Timetable Generated', 2500);
                         }}
                         className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        Generate Optimal Schedule
                      </button>
                    </div>
                    
                    {/* Mock grid */}
                    <div className="overflow-x-auto mt-4">
                       <table className="w-full min-w-[800px] text-center border-collapse">
                         <thead>
                           <tr className="border-b border-border text-[10px] font-black text-muted-foreground uppercase">
                             <th className="p-2 border-r border-border/50">Time</th>
                             <th className="p-2 border-r border-border/50">Monday</th>
                             <th className="p-2 border-r border-border/50">Tuesday</th>
                             <th className="p-2 border-r border-border/50">Wednesday</th>
                             <th className="p-2 border-r border-border/50">Thursday</th>
                             <th className="p-2 border-r border-border/50">Friday</th>
                           </tr>
                         </thead>
                         <tbody className="text-[10px]">
                           <tr className="border-b border-border/50">
                             <td className="p-2 border-r border-border/50 font-bold">08:00 AM</td>
                             <td className="p-2 border-r border-border/50 bg-blue-500/10 text-blue-500 font-semibold">Physics (Lab)</td>
                             <td className="p-2 border-r border-border/50 bg-emerald-500/10 text-emerald-500 font-semibold">Maths</td>
                             <td className="p-2 border-r border-border/50 bg-amber-500/10 text-amber-500 font-semibold">English</td>
                             <td className="p-2 border-r border-border/50 bg-purple-500/10 text-purple-500 font-semibold">Chemistry</td>
                             <td className="p-2 border-r border-border/50 bg-rose-500/10 text-rose-500 font-semibold">Biology</td>
                           </tr>
                           <tr className="border-b border-border/50">
                             <td className="p-2 border-r border-border/50 font-bold">09:00 AM</td>
                             <td className="p-2 border-r border-border/50 bg-emerald-500/10 text-emerald-500 font-semibold">Maths</td>
                             <td className="p-2 border-r border-border/50 bg-purple-500/10 text-purple-500 font-semibold">Chemistry</td>
                             <td className="p-2 border-r border-border/50 bg-rose-500/10 text-rose-500 font-semibold">Biology</td>
                             <td className="p-2 border-r border-border/50 bg-blue-500/10 text-blue-500 font-semibold">Physics</td>
                             <td className="p-2 border-r border-border/50 bg-amber-500/10 text-amber-500 font-semibold">English</td>
                           </tr>
                           <tr className="border-b border-border/50">
                             <td className="p-2 border-r border-border/50 font-bold">10:00 AM</td>
                             <td className="p-2 border-r border-border/50 bg-amber-500/10 text-amber-500 font-semibold">English</td>
                             <td className="p-2 border-r border-border/50 bg-rose-500/10 text-rose-500 font-semibold">Biology</td>
                             <td className="p-2 border-r border-border/50 bg-blue-500/10 text-blue-500 font-semibold">Physics</td>
                             <td className="p-2 border-r border-border/50 bg-emerald-500/10 text-emerald-500 font-semibold">Maths</td>
                             <td className="p-2 border-r border-border/50 bg-purple-500/10 text-purple-500 font-semibold">Chemistry</td>
                           </tr>
                         </tbody>
                       </table>
                    </div>

                    {/* Manage Substitutes Section */}
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <div className="flex justify-between items-center mb-4">
                        <strong className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">👨‍🏫 Teacher Substitutes (Proxies)</strong>
                        <button 
                          onClick={() => setShowSubstituteForm(!showSubstituteForm)}
                          className="px-3 py-1.5 bg-amber-500 text-white rounded text-[10px] font-bold shadow-md hover:bg-amber-600 transition-colors"
                        >
                          {showSubstituteForm ? 'Cancel' : '+ Add Substitute'}
                        </button>
                      </div>

                      {showSubstituteForm && (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.target as any;
                          setSubstitutes([{
                            id: Date.now().toString(),
                            date: form.subDate.value,
                            absentTeacher: form.absentTeacher.value,
                            substituteTeacher: form.subTeacher.value,
                            period: form.subPeriod.value
                          }, ...substitutes]);
                          setShowSubstituteForm(false);
                          form.reset();
                        }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3 mb-4 animate-fadeIn">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Assign Alternative Teacher</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <input name="subDate" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" />
                            <select name="absentTeacher" required className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                              <option value="">Select Absent Teacher</option>
                              {teachers.map(t => <option key={t.id} value={`${t.name} (${t.subject})`}>{t.name} ({t.subject})</option>)}
                              <option value="Mr. Ali (Physics)">Mr. Ali (Physics)</option>
                            </select>
                            <select name="subTeacher" required className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                              <option value="">Select Substitute Teacher</option>
                              {teachers.map(t => <option key={`sub-${t.id}`} value={`${t.name} (${t.subject})`}>{t.name} ({t.subject})</option>)}
                              <option value="Ms. Sana (Science)">Ms. Sana (Science)</option>
                            </select>
                            <input name="subPeriod" required placeholder="Period / Time (e.g. 09:00 AM)" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" />
                          </div>
                          <div className="flex justify-end pt-2">
                            <button type="submit" className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90">Assign Substitute</button>
                          </div>
                        </form>
                      )}

                      {substitutes.length > 0 ? (
                        <div className="space-y-2">
                          {substitutes.map(sub => (
                            <div key={sub.id} className="flex justify-between items-center p-3 border border-border rounded-lg bg-card shadow-sm">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-amber-500">Absent: {sub.absentTeacher}</span>
                                <span className="text-[10px] text-foreground/70">Replaced by <strong className="text-emerald-500">{sub.substituteTeacher}</strong> at {sub.period}</span>
                              </div>
                              <span className="text-[10px] font-mono text-muted-foreground">{sub.date}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-4 italic">No substitutes assigned currently.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Exam Management' || activeFeature === 'Result Processing') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-card border border-border rounded-xl flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Exam Controller</span>
                      <div className="space-y-2">
                        <button 
                          onClick={() => setActiveExamView('datesheet')}
                          className={`w-full flex justify-between items-center p-3 border rounded-lg text-[11px] transition-colors ${activeExamView === 'datesheet' ? 'bg-primary/10 border-primary text-primary' : 'bg-muted/20 border-border text-foreground hover:border-primary'}`}
                        >
                          <span className="font-bold">Generate Date Sheet</span> <ChevronRight className="w-3 h-3 text-muted-foreground" />
                        </button>
                        <button 
                          onClick={() => setActiveExamView('halltickets')}
                          className={`w-full flex justify-between items-center p-3 border rounded-lg text-[11px] transition-colors ${activeExamView === 'halltickets' ? 'bg-primary/10 border-primary text-primary' : 'bg-muted/20 border-border text-foreground hover:border-primary'}`}
                        >
                          <span className="font-bold">Print Hall Tickets / Roll No Slips</span> <ChevronRight className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="w-px bg-border hidden md:block"></div>
                    
                    <div className="flex-1 space-y-4">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2"><Award className="w-4 h-4 text-emerald-500" /> Result Processing Engine</span>
                      <p className="text-[11px] text-muted-foreground">Compile mid-term grades from all teachers to generate final report cards.</p>
                      <button 
                        onClick={(e) => {
                           const btn = e.currentTarget;
                           const originalText = btn.innerHTML;
                           btn.innerHTML = '<span class="animate-pulse">Aggregating Subject Grades...</span>';
                           setTimeout(() => {
                             btn.innerHTML = '✅ Report Cards Compiled & Ready for Print';
                             setActiveExamView('results');
                             setTimeout(() => btn.innerHTML = originalText, 3000);
                           }, 1500);
                        }}
                        className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                      >
                        Compile Final Results
                      </button>
                    </div>
                  </div>

                  {activeExamView === 'datesheet' && (
                    <div className="mt-4 p-4 border border-border rounded-xl bg-card animate-fadeIn">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-foreground">Mid-Term Examination Date Sheet</h4>
                        <button onClick={() => setActiveExamView(null)} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] border-collapse min-w-[500px]">
                          <thead>
                            <tr className="border-b border-border/50 text-muted-foreground bg-muted/20">
                              <th className="p-3">Date</th>
                              <th className="p-3">Day</th>
                              <th className="p-3">Grade 9</th>
                              <th className="p-3">Grade 10</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                              <td className="p-3 font-bold text-foreground">15 Oct 2026</td>
                              <td className="p-3 text-foreground/80">Monday</td>
                              <td className="p-3 text-blue-500 font-semibold">Physics</td>
                              <td className="p-3 text-emerald-500 font-semibold">Maths</td>
                            </tr>
                            <tr className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                              <td className="p-3 font-bold text-foreground">16 Oct 2026</td>
                              <td className="p-3 text-foreground/80">Tuesday</td>
                              <td className="p-3 text-amber-500 font-semibold">English</td>
                              <td className="p-3 text-rose-500 font-semibold">Biology</td>
                            </tr>
                            <tr className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                              <td className="p-3 font-bold text-foreground">17 Oct 2026</td>
                              <td className="p-3 text-foreground/80">Wednesday</td>
                              <td className="p-3 text-emerald-500 font-semibold">Maths</td>
                              <td className="p-3 text-purple-500 font-semibold">Chemistry</td>
                            </tr>
                            <tr className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                              <td className="p-3 font-bold text-foreground">18 Oct 2026</td>
                              <td className="p-3 text-foreground/80">Thursday</td>
                              <td className="p-3 text-rose-500 font-semibold">Biology</td>
                              <td className="p-3 text-amber-500 font-semibold">English</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 bg-primary hover:bg-primary/90 transition-colors text-white text-xs font-bold rounded-lg shadow-sm">Export PDF</button>
                      </div>
                    </div>
                  )}

                  {activeExamView === 'halltickets' && (
                    <div className="mt-4 p-4 border border-border rounded-xl bg-card animate-fadeIn">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-foreground">Generated Hall Tickets (Grade 9 & 10)</h4>
                        <button onClick={() => setActiveExamView(null)} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { roll: '1042', name: 'Ali Khan', grade: 'Grade 10-A', center: 'Hall A' },
                          { roll: '1043', name: 'Sarah Ahmed', grade: 'Grade 9-B', center: 'Hall B' },
                          { roll: '1044', name: 'Zainab Bibi', grade: 'Grade 10-B', center: 'Hall A' },
                          { roll: '1045', name: 'Hamza Tariq', grade: 'Grade 9-A', center: 'Hall C' }
                        ].map((ticket, idx) => (
                          <div key={idx} className="p-4 border border-border rounded-xl bg-muted/10 hover:bg-muted/30 transition-colors">
                            <div className="flex justify-between items-center border-b border-border/50 pb-3 mb-3">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Roll No</span>
                                <strong className="text-sm text-foreground">{ticket.roll}</strong>
                              </div>
                              <span className="text-[10px] font-bold px-2.5 py-1 bg-primary/10 text-primary rounded-full">{ticket.grade}</span>
                            </div>
                            <p className="text-sm font-bold text-primary mb-1">{ticket.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={12} /> Center: {ticket.center}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 bg-primary hover:bg-primary/90 transition-colors text-white text-xs font-bold rounded-lg shadow-sm">Print All Slips</button>
                      </div>
                    </div>
                  )}

                  {activeExamView === 'results' && (
                    <div className="mt-4 p-4 border border-border rounded-xl bg-card animate-fadeIn">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-foreground">Compiled Final Results</h4>
                        <button onClick={() => setActiveExamView(null)} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] border-collapse min-w-[600px]">
                          <thead>
                            <tr className="border-b border-border/50 text-muted-foreground bg-muted/20">
                              <th className="p-3">Roll No</th>
                              <th className="p-3">Student Name</th>
                              <th className="p-3">Grade</th>
                              <th className="p-3">Total Marks</th>
                              <th className="p-3">Percentage</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                              <td className="p-3 text-foreground/80">1042</td>
                              <td className="p-3 font-bold text-primary">Ali Khan</td>
                              <td className="p-3 text-foreground/80">10-A</td>
                              <td className="p-3 text-foreground/80">850/1100</td>
                              <td className="p-3 font-mono font-bold text-foreground">77.2%</td>
                              <td className="p-3"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-bold rounded border border-emerald-500/20 text-[9px] uppercase tracking-wider">Pass</span></td>
                              <td className="p-3 text-right"><button className="text-primary hover:text-primary/80 font-bold text-[10px]">Print Card</button></td>
                            </tr>
                            <tr className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                              <td className="p-3 text-foreground/80">1043</td>
                              <td className="p-3 font-bold text-primary">Sarah Ahmed</td>
                              <td className="p-3 text-foreground/80">9-B</td>
                              <td className="p-3 text-foreground/80">920/1100</td>
                              <td className="p-3 font-mono font-bold text-foreground">83.6%</td>
                              <td className="p-3"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-bold rounded border border-emerald-500/20 text-[9px] uppercase tracking-wider">Pass</span></td>
                              <td className="p-3 text-right"><button className="text-primary hover:text-primary/80 font-bold text-[10px]">Print Card</button></td>
                            </tr>
                            <tr className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                              <td className="p-3 text-foreground/80">1044</td>
                              <td className="p-3 font-bold text-primary">Zainab Bibi</td>
                              <td className="p-3 text-foreground/80">10-B</td>
                              <td className="p-3 text-foreground/80">410/1100</td>
                              <td className="p-3 font-mono font-bold text-foreground">37.2%</td>
                              <td className="p-3"><span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 font-bold rounded border border-rose-500/20 text-[9px] uppercase tracking-wider">Fail</span></td>
                              <td className="p-3 text-right"><button className="text-primary hover:text-primary/80 font-bold text-[10px]">Print Card</button></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 transition-colors text-white text-xs font-bold rounded-lg shadow-sm">Publish All Results</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(activeFeature === 'AI Performance Analytics') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-primary/5 border border-primary/20 rounded-xl space-y-4 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                      <LineChart className="w-8 h-8" />
                    </div>
                    <strong className="block text-sm font-black text-foreground uppercase tracking-wider">Student Academic Trajectory Prediction</strong>
                    <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
                      Based on continuous assessment data, our AI models predict that <strong className="text-primary">12%</strong> of students in Grade 10 are at risk of scoring below a B grade in final board exams.
                    </p>
                    <div className="flex justify-center mt-4">
                      <div className="bg-card border border-border rounded-xl p-4 flex items-end gap-2 h-32">
                         {/* Mock Graph */}
                         <div className="w-8 bg-blue-500/40 rounded-t-sm h-[40%]" title="Term 1"></div>
                         <div className="w-8 bg-blue-500/60 rounded-t-sm h-[55%]" title="Term 2"></div>
                         <div className="w-8 bg-primary rounded-t-sm h-[75%] relative" title="Predicted Final">
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-primary">Proj</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {/* COMMUNICATION & AI MODULES */}
              {(activeFeature === 'SMS Gateway' || activeFeature === 'WhatsApp Integration') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-card border border-border rounded-xl space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-20"><MessageSquare className="w-16 h-16" /></div>
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider relative z-10">SMS Gateway Config</span>
                      <p className="text-[11px] text-muted-foreground relative z-10">Connect Twilio or custom localized SMS APIs to send bulk text messages to parents.</p>
                      <div className="space-y-2 relative z-10">
                        <input type="text" placeholder="API Key" className="w-full px-3 py-2 bg-background border border-border rounded text-[11px] outline-none focus:border-primary" />
                        <input type="text" placeholder="Sender ID (e.g. ACADEMIC)" className="w-full px-3 py-2 bg-background border border-border rounded text-[11px] outline-none focus:border-primary" />
                      </div>
                      <button className="px-4 py-2 bg-foreground hover:bg-foreground/90 text-background font-bold text-[10px] rounded transition-colors relative z-10">Save Configuration</button>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-[#25D366]/10 to-card border border-[#25D366]/20 rounded-xl space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-20"><MessageCircle className="w-16 h-16 text-[#25D366]" /></div>
                      <span className="block text-xs font-bold text-foreground uppercase tracking-wider relative z-10 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></div> WhatsApp Business API</span>
                      <p className="text-[11px] text-muted-foreground relative z-10 max-w-[200px]">Send rich media, fee challans and automated alerts via WhatsApp.</p>
                      
                      <div className="flex flex-col gap-2 relative z-10 mt-4">
                        <span className="text-[10px] font-bold text-[#25D366]">Status: Connected to Meta</span>
                        <button className="px-4 py-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold text-[10px] rounded transition-colors max-w-max shadow-lg shadow-[#25D366]/20">Sync Templates</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Email Automation' || activeFeature === 'Push Notifications') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-card border border-border rounded-xl">
                     <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-rose-500" /> Automated Communication Triggers</span>
                     
                     <div className="space-y-3">
                       {[
                         { trigger: 'Fee Due Reminder', desc: 'Sends email 3 days before deadline.', active: true },
                         { trigger: 'Absent Alert', desc: 'Sends Push Notification to Parent App at 09:00 AM.', active: true },
                         { trigger: 'Result Announced', desc: 'Email blast with PDF Report Card attachment.', active: false }
                       ].map((t, i) => (
                         <div key={i} className="flex justify-between items-center p-3 bg-muted/20 border border-border rounded-lg">
                           <div>
                             <strong className="text-xs text-foreground block">{t.trigger}</strong>
                             <span className="text-[10px] text-muted-foreground">{t.desc}</span>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer group shrink-0">
                              <input type="checkbox" className="sr-only peer" defaultChecked={t.active} />
                              <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                           </label>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'AI Attendance Insights' || activeFeature === 'AI Fee Defaulter Prediction') && (
                <div className="space-y-4 animate-fadeIn">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Attendance Prediction */}
                     <div className="p-5 bg-card border border-border rounded-xl space-y-4 flex flex-col justify-between">
                       <div>
                         <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider block mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-purple-500" /> AI Attendance Insights</span>
                         <p className="text-[11px] text-muted-foreground leading-relaxed">The AI has flagged <strong className="text-rose-500">8 students</strong> who have an irregular attendance pattern indicating a high probability of dropping out.</p>
                       </div>
                       <button className="w-full px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 font-bold text-xs rounded transition-colors border border-purple-500/30">View At-Risk Students</button>
                     </div>

                     {/* Fee Prediction */}
                     <div className="p-5 bg-card border border-border rounded-xl space-y-4 flex flex-col justify-between">
                       <div>
                         <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider block mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> AI Fee Defaulter Engine</span>
                         <p className="text-[11px] text-muted-foreground leading-relaxed">Based on 3-year historical payment trends, <strong className="text-amber-500">15 families</strong> are predicted to default on the upcoming semester fee.</p>
                       </div>
                       <button className="w-full px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold text-xs rounded transition-colors border border-amber-500/30">Auto-Schedule Payment Reminders</button>
                     </div>
                   </div>
                </div>
              )}

              {(activeFeature === 'AI Student Performance Prediction' || activeFeature === 'AI Admission Analytics') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-card border border-border rounded-xl">
                    <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider block mb-4 flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-primary animate-pulse" /> Live AI Inference Server</span>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 bg-muted/20 border border-border p-4 rounded-xl text-center space-y-2">
                         <PieChart className="w-8 h-8 text-blue-400 mx-auto" />
                         <strong className="text-xs text-foreground block">Admission Probability</strong>
                         <span className="text-xl font-black text-blue-400">72.4%</span>
                         <p className="text-[9px] text-muted-foreground">Estimated conversion of the 1,240 current leads based on demographic scoring.</p>
                      </div>
                      
                      <div className="flex-1 bg-muted/20 border border-border p-4 rounded-xl text-center space-y-2">
                         <LineChart className="w-8 h-8 text-emerald-400 mx-auto" />
                         <strong className="text-xs text-foreground block">Board Exam Projections</strong>
                         <span className="text-xl font-black text-emerald-400">A+ Average</span>
                         <p className="text-[9px] text-muted-foreground">Class of 2026 is projected to outperform historical bounds by 4.2%.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}



              {/* TEACHER MODULES */}
              {(activeFeature === 'Assignment Creation') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 p-5 bg-card border border-border rounded-xl space-y-4">
                      <strong className="text-xs font-bold text-foreground uppercase tracking-wider block flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> New Assignment</strong>
                      <div className="space-y-3">
                        <input type="text" defaultValue="Physics Chapter 4" placeholder="Assignment Title (e.g. Physics Chapter 4)" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground" />
                        <textarea defaultValue="Please study chapter 4 thoroughly. Upload your notes by tomorrow." placeholder="Instructions for students..." className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground h-20 resize-none"></textarea>
                        <div className="flex gap-2">
                           <input type="date" className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary text-muted-foreground" />
                           <select className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground">
                             <option>Grade 10 - Section A</option>
                             <option>Grade 9 - Section B</option>
                           </select>
                        </div>
                        <button 
                          onClick={(e) => {
                             const btn = e.currentTarget;
                             btn.innerHTML = 'Uploading Resource...';
                             setTimeout(() => {
                                btn.innerHTML = '✅ Assignment Published';
                                setTimeout(() => {
                                    alert('Assignment Published Successfully!');
                                    setActiveFeature(null);
                                }, 800);
                             }, 1500);
                          }}
                          className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Upload className="w-3 h-3" /> Publish Assignment
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 p-5 bg-card border border-border rounded-xl space-y-4">
                      <strong className="text-xs font-bold text-foreground uppercase tracking-wider block flex items-center gap-2"><HelpCircle className="w-4 h-4 text-purple-500" /> Interactive Quiz Builder</strong>
                      <div className="space-y-3">
                         <div className="p-3 bg-muted/20 border border-border rounded-lg">
                            <input type="text" placeholder="Question 1: What is the powerhouse of the cell?" className="w-full bg-transparent text-xs outline-none text-foreground mb-2" />
                            <div className="space-y-1 pl-4 border-l-2 border-purple-500/30">
                              <label className="flex items-center gap-2 text-[11px] text-muted-foreground"><input type="radio" name="q1" /> Nucleus</label>
                              <label className="flex items-center gap-2 text-[11px] text-muted-foreground"><input type="radio" name="q1" /> Mitochondria <span className="text-emerald-500 font-bold">(Correct)</span></label>
                              <label className="flex items-center gap-2 text-[11px] text-muted-foreground"><input type="radio" name="q1" /> Ribosome</label>
                            </div>
                         </div>
                         <button className="text-xs text-purple-500 font-bold hover:underline">+ Add Another Question</button>
                         <button 
                            onClick={(e) => {
                               const btn = e.currentTarget;
                               btn.innerHTML = 'Launching Live Quiz...';
                               setTimeout(() => {
                                  btn.innerHTML = '✅ Quiz Launched & Published';
                                  setTimeout(() => {
                                      alert('Live Quiz has been successfully launched. Students will be notified instantly.');
                                      setActiveFeature(null);
                                  }, 800);
                               }, 1500);
                            }}
                            className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs rounded-lg transition-colors"
                         >
                           Launch Live Quiz
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Lesson Planner' || activeFeature === 'Class Diary') && (
                <div className="space-y-4 animate-fadeIn">
                   <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-border/50">
                        <strong className="text-xs font-bold text-foreground uppercase tracking-wider">Weekly Lesson Plan</strong>
                        <div className="flex gap-2">
                           <button className="px-3 py-1 bg-muted text-foreground rounded text-[10px] font-bold">Previous Week</button>
                           <button className="px-3 py-1 bg-primary text-white rounded text-[10px] font-bold">Current Week</button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => (
                           <div key={i} className="p-3 bg-muted/10 border border-border rounded-lg text-center h-32 flex flex-col justify-between hover:border-primary/50 transition-colors cursor-pointer group">
                             <strong className="text-[10px] text-muted-foreground uppercase">{day}</strong>
                             {i === 1 ? (
                               <div className="bg-primary/10 text-primary text-[9px] p-2 rounded text-left leading-tight">
                                 <strong>Topic:</strong> Newton's Laws<br/>
                                 <em>Lab Experiment</em>
                               </div>
                             ) : (
                               <span className="text-[10px] text-muted-foreground/50 italic group-hover:text-primary transition-colors">+ Add Topic</span>
                             )}
                           </div>
                        ))}
                      </div>
                   </div>

                   <div className="p-5 bg-card border border-border rounded-xl">
                      <strong className="text-xs font-bold text-foreground uppercase tracking-wider block mb-4 flex items-center gap-2"><Edit className="w-4 h-4 text-emerald-500" /> Digital Class Diary</strong>
                      <div className="flex gap-4">
                        <textarea defaultValue="Please ensure students bring their geometry boxes tomorrow." placeholder="Write today's diary note for parents (e.g. Please ensure students bring their geometry boxes tomorrow)..." className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-emerald-500 text-foreground h-24 resize-none"></textarea>
                        <button 
                            onClick={(e) => {
                               const btn = e.currentTarget;
                               btn.innerHTML = 'Publishing...';
                               setTimeout(() => {
                                  btn.innerHTML = '✅ Published to Portal';
                                  setTimeout(() => {
                                      alert('Class diary has been updated. Parents will be notified.');
                                      setActiveFeature(null);
                                  }, 800);
                               }, 1500);
                            }}
                            className="px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors"
                        >
                          Publish to Parent Portal
                        </button>
                      </div>
                   </div>
                </div>
              )}

              {(activeFeature === 'Attendance Entry') && (
                <div className="space-y-4 animate-fadeIn">
                   <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-border/50">
                        <strong className="text-xs font-bold text-foreground uppercase tracking-wider">Mark Daily Attendance</strong>
                        <span className="text-[10px] font-bold px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded">Grade 10 - Physics</span>
                      </div>
                      
                      <table className="w-full text-left border-collapse">
                         <thead>
                           <tr className="border-b border-border text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                             <th className="p-2">Roll No</th>
                             <th className="p-2">Student Name</th>
                             <th className="p-2 text-right">Status</th>
                           </tr>
                         </thead>
                         <tbody className="text-[11px] font-semibold">
                           {[
                             { roll: '10-A01', name: 'Ali Ahmed' },
                             { roll: '10-A02', name: 'Sara Khan' },
                             { roll: '10-A03', name: 'Usman Raza' },
                           ].map((stu, i) => (
                             <tr key={i} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                               <td className="p-2 text-muted-foreground">{stu.roll}</td>
                               <td className="p-2 text-foreground font-bold">{stu.name}</td>
                               <td className="p-2 text-right">
                                  <div className="inline-flex rounded-lg overflow-hidden border border-border">
                                    <button className="px-3 py-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors">Present</button>
                                    <button className="px-3 py-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-colors border-x border-border">Late</button>
                                    <button className="px-3 py-1 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors">Absent</button>
                                  </div>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                      </table>
                      <div className="flex justify-end">
                         <button 
                            onClick={(e) => {
                               const btn = e.currentTarget;
                               btn.innerHTML = 'Submitting...';
                               setTimeout(() => {
                                  btn.innerHTML = '✅ Attendance Submitted';
                                  setTimeout(() => {
                                      alert('Attendance has been successfully saved to the system.');
                                      setActiveFeature(null);
                                  }, 800);
                               }, 1000);
                            }}
                            className="px-6 py-2 bg-primary text-white font-bold text-xs rounded-lg transition-colors"
                         >
                           Submit Register
                         </button>
                      </div>
                   </div>
                </div>
              )}

              {(activeFeature === 'Grade Book' || activeFeature === 'Student Remarks') && (
                <div className="space-y-4 animate-fadeIn">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Grade Book */}
                     <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                        <strong className="text-xs font-bold text-foreground uppercase tracking-wider block">Subject Grade Book</strong>
                        <div className="space-y-2">
                           <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase border-b border-border/50 pb-2">
                             <span>Student</span>
                             <span>Marks (Out of 100)</span>
                           </div>
                           <div className="flex justify-between items-center py-2 border-b border-border/50">
                             <span className="text-xs text-foreground font-bold">Ali Ahmed</span>
                             <input type="number" defaultValue="85" className="w-16 px-2 py-1 bg-background border border-border rounded text-xs text-center outline-none focus:border-primary text-foreground" />
                           </div>
                           <div className="flex justify-between items-center py-2 border-b border-border/50">
                             <span className="text-xs text-foreground font-bold">Sara Khan</span>
                             <input type="number" defaultValue="92" className="w-16 px-2 py-1 bg-background border border-border rounded text-xs text-center outline-none focus:border-primary text-foreground" />
                           </div>
                        </div>
                        <button 
                            onClick={(e) => {
                               const btn = e.currentTarget;
                               btn.innerHTML = 'Saving Marks...';
                               setTimeout(() => {
                                  btn.innerHTML = '✅ Marks Saved Successfully';
                                  setTimeout(() => {
                                      alert('Grades have been saved to the report card.');
                                      setActiveFeature(null);
                                  }, 800);
                               }, 1500);
                            }}
                            className="w-full px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-lg transition-colors"
                        >
                          Save Marks
                        </button>
                     </div>

                     {/* Student Remarks */}
                     <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                        <strong className="text-xs font-bold text-foreground uppercase tracking-wider block">Issue Student Remarks</strong>
                        <div className="space-y-3">
                           <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground">
                             <option>Select Student: Usman Raza</option>
                           </select>
                           <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground">
                             <option>Badge: 🌟 Excellent Participation</option>
                             <option>Badge: ⚠️ Needs Improvement</option>
                           </select>
                           <textarea defaultValue="Very attentive during the lab experiment. Great job!" placeholder="Write a custom remark for the parent to see..." className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground h-16 resize-none"></textarea>
                           <button 
                              onClick={(e) => {
                                 const btn = e.currentTarget;
                                 btn.innerHTML = 'Sending to Parent...';
                                 setTimeout(() => {
                                    btn.innerHTML = '✅ Remark Issued';
                                    setTimeout(() => {
                                        alert('Student remark has been logged and sent to parents.');
                                        setActiveFeature(null);
                                    }, 800);
                                 }, 1000);
                              }}
                              className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-lg transition-colors"
                           >
                             Issue Badge & Remark
                           </button>
                        </div>
                     </div>
                   </div>
                </div>
              )}

              {/* EXECUTIVE DASHBOARDS */}
              {(activeFeature === 'School KPI Dashboard' || activeFeature === 'Revenue Dashboard' || activeFeature === 'Student Growth Dashboard' || activeFeature === 'Teacher Performance Dashboard') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
                    <button onClick={() => setActiveFeature('School KPI Dashboard')} className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${activeFeature === 'School KPI Dashboard' ? 'bg-primary text-white' : 'bg-muted/50 text-foreground hover:bg-muted'}`}>School KPI</button>
                    <button onClick={() => setActiveFeature('Revenue Dashboard')} className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${activeFeature === 'Revenue Dashboard' ? 'bg-emerald-500 text-white' : 'bg-muted/50 text-foreground hover:bg-muted'}`}>Revenue</button>
                    <button onClick={() => setActiveFeature('Student Growth Dashboard')} className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${activeFeature === 'Student Growth Dashboard' ? 'bg-blue-500 text-white' : 'bg-muted/50 text-foreground hover:bg-muted'}`}>Student Growth</button>
                    <button onClick={() => setActiveFeature('Teacher Performance Dashboard')} className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${activeFeature === 'Teacher Performance Dashboard' ? 'bg-purple-500 text-white' : 'bg-muted/50 text-foreground hover:bg-muted'}`}>Teacher Performance</button>
                  </div>

                  {activeFeature === 'School KPI Dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                        <strong className="text-xs font-bold text-foreground uppercase tracking-wider block">Enrollment Targets</strong>
                        <div className="h-32 flex items-end gap-2">
                          <div className="flex-1 bg-primary/20 rounded-t flex flex-col justify-end items-center text-[10px] font-bold text-primary pb-2 h-[60%]">Q1</div>
                          <div className="flex-1 bg-primary/40 rounded-t flex flex-col justify-end items-center text-[10px] font-bold text-primary pb-2 h-[80%]">Q2</div>
                          <div className="flex-1 bg-primary/60 rounded-t flex flex-col justify-end items-center text-[10px] font-bold text-white pb-2 h-[95%]">Q3</div>
                          <div className="flex-1 bg-primary rounded-t flex flex-col justify-end items-center text-[10px] font-bold text-white pb-2 h-full">Q4 (Proj)</div>
                        </div>
                      </div>
                      
                      <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                        <strong className="text-xs font-bold text-foreground uppercase tracking-wider block">Staff Allocation</strong>
                        <div className="space-y-3">
                           <div>
                             <div className="flex justify-between text-[10px] font-bold mb-1"><span>Science Faculty</span><span>45%</span></div>
                             <div className="w-full bg-muted rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div></div>
                           </div>
                           <div>
                             <div className="flex justify-between text-[10px] font-bold mb-1"><span>Arts Faculty</span><span>30%</span></div>
                             <div className="w-full bg-muted rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full" style={{width: '30%'}}></div></div>
                           </div>
                           <div>
                             <div className="flex justify-between text-[10px] font-bold mb-1"><span>Admin / Support</span><span>25%</span></div>
                             <div className="w-full bg-muted rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{width: '25%'}}></div></div>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeature === 'Revenue Dashboard' && (
                    <div className="p-5 bg-card border border-emerald-500/20 rounded-xl space-y-4">
                       <strong className="text-xs font-bold text-foreground uppercase tracking-wider block flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-500" /> Revenue & Receivables Pipeline</strong>
                       <div className="flex gap-4 items-center p-4 bg-emerald-500/10 rounded-lg">
                          <div className="text-emerald-500"><TrendingUp className="w-8 h-8" /></div>
                          <div>
                            <span className="block text-2xl font-black text-foreground">$1.2M</span>
                            <span className="text-[11px] text-muted-foreground">Collected YTD (+14% vs Last Year)</span>
                          </div>
                       </div>
                       <table className="w-full text-left border-collapse mt-4">
                          <thead>
                            <tr className="border-b border-border text-[10px] font-black text-muted-foreground uppercase">
                              <th className="p-2">Stream</th>
                              <th className="p-2">Target</th>
                              <th className="p-2">Achieved</th>
                              <th className="p-2 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="text-[11px] font-semibold">
                            <tr className="border-b border-border/50">
                              <td className="p-2">Tuition Fees</td>
                              <td className="p-2">$1.0M</td>
                              <td className="p-2 text-emerald-500">$980K (98%)</td>
                              <td className="p-2 text-right"><span className="text-emerald-500">On Track</span></td>
                            </tr>
                            <tr className="border-b border-border/50">
                              <td className="p-2">Transport Fees</td>
                              <td className="p-2">$150K</td>
                              <td className="p-2 text-amber-500">$100K (66%)</td>
                              <td className="p-2 text-right"><span className="text-amber-500">Lagging</span></td>
                            </tr>
                          </tbody>
                       </table>
                    </div>
                  )}

                  {activeFeature === 'Student Growth Dashboard' && (
                    <div className="p-5 bg-card border border-blue-500/20 rounded-xl space-y-4 text-center">
                       <LineChart className="w-12 h-12 text-blue-500 mx-auto opacity-50" />
                       <strong className="block text-lg font-black text-foreground">Cohort Progression Analysis</strong>
                       <p className="text-xs text-muted-foreground max-w-md mx-auto">Visualizing the academic journey of the 2024 batch vs the 2025 batch across all major subjects.</p>
                       <div className="mt-6 flex justify-center gap-8 text-[11px] font-bold">
                          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> 2024 Batch (+12% Growth)</div>
                          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500 rounded-full"></div> 2025 Batch (+18% Growth)</div>
                       </div>
                    </div>
                  )}

                  {activeFeature === 'Teacher Performance Dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="md:col-span-1 p-5 bg-card border border-purple-500/20 rounded-xl space-y-4">
                          <strong className="text-xs font-bold text-foreground uppercase tracking-wider block">Top Performers</strong>
                          <ul className="space-y-3 text-[11px]">
                            <li className="flex justify-between items-center bg-purple-500/10 p-2 rounded text-purple-500 font-bold"><span>1. Miss Ayesha (Math)</span> <span>4.9 ⭐</span></li>
                            <li className="flex justify-between items-center bg-muted/50 p-2 rounded"><span>2. Mr. Rizwan (Phys)</span> <span>4.7 ⭐</span></li>
                            <li className="flex justify-between items-center bg-muted/50 p-2 rounded"><span>3. Mrs. Fatima (Eng)</span> <span>4.5 ⭐</span></li>
                          </ul>
                       </div>
                       <div className="md:col-span-2 p-5 bg-card border border-border rounded-xl space-y-4">
                          <strong className="text-xs font-bold text-foreground uppercase tracking-wider block">Evaluation Metrics</strong>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/20 p-4 rounded-lg text-center">
                               <span className="text-3xl font-black text-foreground">94%</span>
                               <span className="block text-[10px] text-muted-foreground mt-1">Syllabus Completion Rate</span>
                            </div>
                            <div className="bg-muted/20 p-4 rounded-lg text-center">
                               <span className="text-3xl font-black text-foreground">8.2/10</span>
                               <span className="block text-[10px] text-muted-foreground mt-1">Average Peer Review Score</span>
                            </div>
                            <div className="col-span-2 bg-emerald-500/10 p-4 rounded-lg text-center border border-emerald-500/20">
                               <span className="text-emerald-500 font-bold text-sm block">Positive Correlation Detected</span>
                               <span className="block text-[10px] text-emerald-500/80 mt-1">High peer review scores align directly with higher student exam grades in 85% of cases.</span>
                            </div>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              )}

              {/* SYSTEM SECURITY MODULES */}
              {(activeFeature === 'Two Factor Authentication') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 flex justify-between items-center">
                    <span>🛡️ Global Multi-Factor Authentication Settings.</span>
                    <button className="px-3 py-1 bg-primary text-white rounded text-[10px] font-bold">Save Policies</button>
                  </div>
                  
                  <div className="p-5 bg-card border border-border rounded-xl space-y-5">
                    <div className="flex justify-between items-center pb-4 border-b border-border/50">
                      <div>
                        <strong className="text-sm font-black text-foreground block">Enforce 2FA Globally</strong>
                        <span className="text-[11px] text-muted-foreground block max-w-sm">Require all organization members (teachers, admins) to configure an Authenticator app (e.g. Google Authenticator) before accessing the portal.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer group">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner group-hover:ring-2 ring-emerald-500/30"></div>
                      </label>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-border/50">
                      <div>
                        <strong className="text-sm font-black text-foreground block">SMS OTP Fallback</strong>
                        <span className="text-[11px] text-muted-foreground block max-w-sm">Allow users to receive an SMS text message to their registered phone number if they lose access to their authenticator app.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer group">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner group-hover:ring-2 ring-primary/30"></div>
                      </label>
                    </div>

                    <div className="p-4 bg-muted/30 border border-border rounded-lg flex flex-col md:flex-row gap-4 items-center md:items-start">
                      <div className="w-24 h-24 bg-white rounded-lg border-2 border-dashed border-border flex items-center justify-center p-1 shrink-0">
                        {/* Mock QR Code Image Placeholder */}
                        <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/AcademicHub:Admin?secret=JBSWY3DPEHPK3PXP&issuer=AcademicHub')] bg-cover bg-no-repeat opacity-80" style={{ filter: 'grayscale(100%)' }}></div>
                      </div>
                      <div>
                        <strong className="text-xs text-foreground block mb-1">Your Personal Admin 2FA Setup</strong>
                        <p className="text-[11px] text-muted-foreground mb-3">Scan this QR code with Google Authenticator or Authy to bind your device.</p>
                        <div className="flex gap-2">
                          <input type="text" placeholder="Enter 6-digit code" className="px-3 py-1.5 bg-background border border-border rounded text-[11px] outline-none focus:border-primary w-32" />
                          <button className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[11px] rounded transition-colors">Verify</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Device Management' || activeFeature === 'Session Tracking') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-card border border-border rounded-xl space-y-4 overflow-x-auto">
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">Active Authorized Devices</span>
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                          <th className="p-2">Device / OS</th>
                          <th className="p-2">Location & IP</th>
                          <th className="p-2">Last Active</th>
                          <th className="p-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] font-semibold">
                        {[
                          { dev: 'MacBook Pro 16" - Chrome', loc: 'Lahore, PK (119.16.22.1)', time: 'Current Session', icon: <Smartphone className="w-4 h-4 text-emerald-400" />, active: true },
                          { dev: 'iPhone 14 Pro Max - Safari', loc: 'Lahore, PK (119.16.22.8)', time: '2 hours ago', icon: <Smartphone className="w-4 h-4 text-muted-foreground" />, active: false },
                          { dev: 'Windows 11 Desktop - Edge', loc: 'Dubai, UAE (185.22.11.9)', time: '3 days ago', icon: <Activity className="w-4 h-4 text-amber-500" />, active: false },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/10 transition-colors device-row">
                            <td className="p-2 flex items-center gap-2">
                              {row.icon}
                              <span className={row.active ? 'text-primary font-bold' : 'text-foreground'}>{row.dev}</span>
                              {row.active && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] rounded ml-1">Live</span>}
                            </td>
                            <td className="p-2 text-muted-foreground">{row.loc}</td>
                            <td className="p-2">{row.time}</td>
                            <td className="p-2 text-right">
                              {row.active ? (
                                <span className="text-[10px] text-muted-foreground italic">This Device</span>
                              ) : (
                                <button 
                                  onClick={(e) => {
                                    const tr = (e.currentTarget as HTMLElement).closest('tr');
                                    if(tr) {
                                      tr.style.transition = 'all 0.5s ease';
                                      tr.style.opacity = '0';
                                      tr.style.transform = 'translateX(20px)';
                                      setTimeout(() => tr.remove(), 500);
                                    }
                                  }}
                                  className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded font-bold text-[10px] transition-colors"
                                >
                                  Revoke Access
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {(activeFeature === 'IP Restriction') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-gradient-to-br from-indigo-500/10 via-card to-card border border-indigo-500/20 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <strong className="text-sm font-black text-foreground block flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-400" /> Static IP Whitelisting</strong>
                      <p className="text-[11px] text-muted-foreground max-w-md leading-relaxed">
                        Restrict dashboard access to specific campus networks. If enabled, any login attempt from an unlisted IP address will be instantly blocked, even with correct credentials.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer group shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500 shadow-inner group-hover:ring-2 ring-indigo-500/30"></div>
                      <span className="ml-2 text-xs font-bold text-foreground">Strict Mode</span>
                    </label>
                  </div>

                  <div className="p-4 bg-card border border-border rounded-xl">
                    <div className="flex gap-2 mb-4">
                      <input type="text" placeholder="Enter IP Address (e.g. 192.168.1.1/24)" className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-indigo-500 text-foreground" />
                      <input type="text" placeholder="Description (e.g. Main Campus WiFi)" className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-indigo-500 text-foreground hidden md:block" />
                      <button 
                        onClick={() => {
                          alert("New IP Address added to whitelist successfully!");
                        }}
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        Add IP
                      </button>
                    </div>

                    <div className="space-y-2">
                      {[
                        { ip: '203.101.44.12', desc: 'Main Campus Admin Block Gateway' },
                        { ip: '119.16.22.0/24', desc: 'City Branch Office Network' }
                      ].map((item, i) => (
                        <div key={i} className="p-3 bg-muted/20 border border-border rounded-lg flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                              <ShieldAlert className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className="text-xs text-foreground block font-mono">{item.ip}</strong>
                              <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                            </div>
                          </div>
                          <button className="p-1.5 text-muted-foreground hover:text-rose-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Login Audit Trail') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-card border border-border rounded-xl overflow-x-auto">
                    <div className="flex justify-between items-center mb-4">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Immutable Access Logs</span>
                      <button className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground border border-border rounded text-[10px] font-bold flex items-center gap-1 transition-colors">
                        <Download className="w-3 h-3" /> Export CSV
                      </button>
                    </div>
                    
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-border text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                          <th className="p-2">Timestamp</th>
                          <th className="p-2">User / Role</th>
                          <th className="p-2">IP & Location</th>
                          <th className="p-2">Event</th>
                          <th className="p-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] font-semibold">
                        {[
                          { time: '2026-06-13 08:42:15', user: 'Admin User', ip: '119.16.22.1 (Lahore, PK)', event: 'Password Login', status: 'Success', color: 'emerald' },
                          { time: '2026-06-13 08:40:02', user: 'Admin User', ip: '119.16.22.1 (Lahore, PK)', event: '2FA OTP Verification', status: 'Success', color: 'emerald' },
                          { time: '2026-06-12 23:15:44', user: 'Unknown', ip: '45.22.19.8 (Moscow, RU)', event: 'Password Brute Force', status: 'Blocked (IP Restricted)', color: 'rose' },
                          { time: '2026-06-12 14:30:10', user: 'Teacher (Ayesha)', ip: '203.101.44.12 (Lahore, PK)', event: 'Session Expiry', status: 'Logged Out', color: 'amber' },
                          { time: '2026-06-11 09:05:22', user: 'Teacher (Ayesha)', ip: '203.101.44.12 (Lahore, PK)', event: 'Password Login', status: 'Success', color: 'emerald' },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                            <td className="p-2 text-muted-foreground font-mono">{row.time}</td>
                            <td className="p-2 font-bold text-foreground">{row.user}</td>
                            <td className="p-2 text-muted-foreground">{row.ip}</td>
                            <td className="p-2">{row.event}</td>
                            <td className="p-2 text-right">
                              <span className={`px-2 py-0.5 bg-${row.color}-500/10 text-${row.color}-500 rounded text-[9px] font-black uppercase`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ADMISSIONS & CRM MODULES */}
              {(activeFeature === 'Funnel Analytics') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📊 Visualize the admission conversion funnel from cold leads to enrolled pupils.
                  </div>
                  
                  <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Admission Campaign Funnel</span>
                    <div className="flex flex-col gap-3 max-w-2xl mx-auto items-center mt-6">
                      <div className="w-full bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex justify-between items-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/10 w-full transition-transform origin-left group-hover:scale-x-105"></div>
                        <span className="relative z-10 text-sm font-bold text-blue-400">Total Leads Generated</span>
                        <strong className="relative z-10 text-2xl font-black text-foreground">1,240</strong>
                      </div>
                      
                      <div className="w-11/12 bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex justify-between items-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-amber-500/10 w-full transition-transform origin-left group-hover:scale-x-105"></div>
                        <span className="relative z-10 text-sm font-bold text-amber-400">Applications Submitted</span>
                        <div className="text-right">
                          <strong className="relative z-10 text-2xl font-black text-foreground">850</strong>
                          <span className="block text-[10px] text-amber-500/70 font-semibold">68% Conversion</span>
                        </div>
                      </div>

                      <div className="w-5/6 bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl flex justify-between items-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-purple-500/10 w-full transition-transform origin-left group-hover:scale-x-105"></div>
                        <span className="relative z-10 text-sm font-bold text-purple-400">Interviews & Tests</span>
                        <div className="text-right">
                          <strong className="relative z-10 text-2xl font-black text-foreground">410</strong>
                          <span className="block text-[10px] text-purple-500/70 font-semibold">48% Conversion</span>
                        </div>
                      </div>

                      <div className="w-2/3 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex justify-between items-center relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.15)] group">
                        <div className="absolute inset-0 bg-emerald-500/20 w-full transition-transform origin-left group-hover:scale-x-105"></div>
                        <span className="relative z-10 text-sm font-bold text-emerald-400">Final Enrollments</span>
                        <div className="text-right">
                          <strong className="relative z-10 text-3xl font-black text-emerald-400">185</strong>
                          <span className="block text-[11px] text-emerald-500/70 font-black">45% Final Conversion</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Document Verification') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    🪪 Run simulated OCR (Optical Character Recognition) to verify uploaded candidate documents (Birth Certificates, Transcripts).
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Candidate Pending Files</span>
                      <div className="space-y-3">
                        {[
                          { name: 'Ayesha Khan', doc: 'Birth Certificate (B-Form)', id: 'DOC-882A' },
                          { name: 'Omar Farooq', doc: 'Previous Grade 5 Transcript', id: 'DOC-911B' }
                        ].map((file, i) => (
                          <div key={i} className="p-3 bg-muted/30 border border-border rounded-lg flex items-center justify-between group">
                            <div>
                              <strong className="text-xs text-foreground block">{file.name}</strong>
                              <span className="text-[10px] text-muted-foreground">{file.doc} | {file.id}</span>
                            </div>
                            <button 
                              onClick={(e) => {
                                const btn = e.currentTarget;
                                btn.innerHTML = '<span class="animate-pulse">Scanning...</span>';
                                btn.classList.remove('bg-primary/10', 'text-primary');
                                btn.classList.add('bg-amber-500/10', 'text-amber-500');
                                setTimeout(() => {
                                  btn.innerHTML = '✅ Verified';
                                  btn.classList.remove('bg-amber-500/10', 'text-amber-500');
                                  btn.classList.add('bg-emerald-500/10', 'text-emerald-500', 'pointer-events-none');
                                  alert(`OCR Scan Complete for ${file.name}. Document is authentic.`);
                                }, 2000);
                              }}
                              className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold rounded transition-colors flex items-center gap-1"
                            >
                              Run OCR Scan
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-xl space-y-4 flex flex-col items-center justify-center text-center opacity-50 pointer-events-none">
                      <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mb-2 shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-bounce"></div>
                        <FileBadge className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <strong className="text-sm font-bold text-foreground">Document Viewer</strong>
                      <p className="text-[11px] text-muted-foreground px-4">Click "Run OCR Scan" on a pending document to extract text and analyze the image for watermarks.</p>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Interview Scheduling') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 flex justify-between items-center">
                    <span>👥 Manage admission panel interviews and score candidates.</span>
                    <button className="px-3 py-1.5 bg-primary text-white rounded text-[10px] font-bold shadow-md">+ Schedule Interview</button>
                  </div>

                  <div className="p-4 bg-card border border-border rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                          <th className="p-2">Candidate Name</th>
                          <th className="p-2">Applying For</th>
                          <th className="p-2">Date & Time</th>
                          <th className="p-2">Interviewer Panel</th>
                          <th className="p-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] font-semibold">
                        {[
                          { name: 'Zainab Ali', class: 'Grade 6', time: '14-Jun, 10:00 AM', panel: 'Principal, Math HOD', status: 'Pending' },
                          { name: 'Bilal Ahmed', class: 'Grade 10', time: '14-Jun, 11:30 AM', panel: 'VP, Science HOD', status: 'Pending' },
                          { name: 'Fatima Noor', class: 'Grade 8', time: '12-Jun, 09:00 AM', panel: 'VP, English HOD', status: 'Passed' },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                            <td className="p-2 font-bold text-primary">{row.name}</td>
                            <td className="p-2">{row.class}</td>
                            <td className="p-2 text-muted-foreground">{row.time}</td>
                            <td className="p-2">{row.panel}</td>
                            <td className="p-2 text-right">
                              {row.status === 'Pending' ? (
                                <button 
                                  onClick={(e) => {
                                    e.currentTarget.innerText = 'Passed';
                                    e.currentTarget.className = 'px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded font-bold pointer-events-none';
                                  }}
                                  className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded font-bold transition-colors"
                                >
                                  Score Candidate
                                </button>
                              ) : (
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded font-bold">Passed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {(activeFeature === 'Automated Merit Lists') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="space-y-2">
                      <strong className="text-sm font-black text-foreground block">Generate Automated Merit List</strong>
                      <p className="text-xs text-muted-foreground max-w-md">
                        Our algorithm automatically aggregates previous academic records, entry test scores, and interview panel feedback to generate a ranked merit list with your specified cut-off.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold outline-none focus:border-primary">
                        <option>Grade 10 Admissions</option>
                        <option>Grade 6 Admissions</option>
                      </select>
                      <button 
                        onClick={() => alert("Merit List Generated! 42 candidates passed the 75% cut-off. Emails are ready to be dispatched.")}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-lg flex justify-center items-center gap-2"
                      >
                        <Trophy className="w-4 h-4" /> Calculate & Generate
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="p-4 bg-card border border-border rounded-xl">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Top Score</span>
                        <strong className="text-xl text-emerald-400 font-black">94.5%</strong>
                     </div>
                     <div className="p-4 bg-card border border-border rounded-xl">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Total Seats</span>
                        <strong className="text-xl text-blue-400 font-black">50</strong>
                     </div>
                     <div className="p-4 bg-card border border-border rounded-xl">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Cut-off Threshold</span>
                        <strong className="text-xl text-amber-400 font-black">75.0%</strong>
                     </div>
                  </div>
                </div>
              )}

              {/* FINANCE / ACCOUNTING MODULES */}
              {(activeFeature === 'Accounting Ledger' || activeFeature === 'General Journal') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 flex justify-between items-center">
                    <span>🏦 General Ledger (Double-Entry Bookkeeping). Real-time debits and credits.</span>
                    <button className="px-3 py-1 bg-primary text-white rounded text-[10px] font-bold">+ New Entry</button>
                  </div>
                  
                  <div className="p-4 bg-card border border-border rounded-xl overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                          <th className="p-2">Date</th>
                          <th className="p-2">Transaction Ref</th>
                          <th className="p-2">Account</th>
                          <th className="p-2 text-right">Debit (Dr)</th>
                          <th className="p-2 text-right">Credit (Cr)</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] font-semibold">
                        {[
                          { date: '2026-06-12', ref: 'FEE-RCV-8821', acc: '101 - Cash in Bank', dr: 45000, cr: 0 },
                          { date: '2026-06-12', ref: 'FEE-RCV-8821', acc: '401 - Tuition Revenue', dr: 0, cr: 45000 },
                          { date: '2026-06-13', ref: 'EXP-UTIL-019', acc: '601 - Electricity Exp', dr: 12000, cr: 0 },
                          { date: '2026-06-13', ref: 'EXP-UTIL-019', acc: '101 - Cash in Bank', dr: 0, cr: 12000 },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/10">
                            <td className="p-2">{row.date}</td>
                            <td className="p-2 text-primary">{row.ref}</td>
                            <td className="p-2">{row.acc}</td>
                            <td className="p-2 text-right text-emerald-400">{row.dr > 0 ? formatCurrency(row.dr) : '-'}</td>
                            <td className="p-2 text-right text-amber-400">{row.cr > 0 ? formatCurrency(row.cr) : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-border font-black text-[11px]">
                          <td colSpan={3} className="p-2 text-right">Trial Balance Totals:</td>
                          <td className="p-2 text-right text-emerald-500">{formatCurrency(57000)}</td>
                          <td className="p-2 text-right text-amber-500">{formatCurrency(57000)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {(activeFeature === 'Profit & Loss' || activeFeature === 'Cash Flow Reports') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col justify-center">
                      <span className="text-emerald-400/80 text-[11px] font-bold uppercase tracking-wider">Total Revenue (Q2)</span>
                      <strong className="text-emerald-400 text-2xl font-black mt-1">{formatCurrency(450000)}</strong>
                    </div>
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex flex-col justify-center">
                      <span className="text-rose-400/80 text-[11px] font-bold uppercase tracking-wider">Total Expenses (Q2)</span>
                      <strong className="text-rose-400 text-2xl font-black mt-1">{formatCurrency(180000)}</strong>
                    </div>
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex flex-col justify-center">
                      <span className="text-primary/80 text-[11px] font-bold uppercase tracking-wider">Net Profit (EBITDA)</span>
                      <strong className="text-primary text-2xl font-black mt-1">{formatCurrency(270000)}</strong>
                    </div>
                  </div>

                  <div className="p-5 bg-card border border-border rounded-xl space-y-4 h-[300px] flex flex-col">
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Monthly Cash Flow Trend</span>
                    <div className="flex-1 flex items-end gap-2 px-2">
                      {[
                        { month: 'Jan', in: 120, out: 80 },
                        { month: 'Feb', in: 150, out: 90 },
                        { month: 'Mar', in: 130, out: 85 },
                        { month: 'Apr', in: 180, out: 95 },
                        { month: 'May', in: 160, out: 88 },
                        { month: 'Jun', in: 210, out: 100 },
                      ].map((m, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1 group">
                          <div className="flex gap-1 w-full justify-center items-end h-[200px]">
                            {/* Inflow Bar */}
                            <div className="w-1/3 bg-emerald-500/60 group-hover:bg-emerald-500 transition-all rounded-t-sm" style={{ height: `${(m.in / 250) * 100}%` }} title={`Inflow: ${m.in}k`}></div>
                            {/* Outflow Bar */}
                            <div className="w-1/3 bg-rose-500/60 group-hover:bg-rose-500 transition-all rounded-t-sm" style={{ height: `${(m.out / 250) * 100}%` }} title={`Outflow: ${m.out}k`}></div>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-semibold">{m.month}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-4 text-[9px] font-bold uppercase text-foreground/50">
                      <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500"></div> Cash Inflow</span>
                      <span className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-500"></div> Cash Outflow</span>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Budget Planning' || activeFeature === 'Financial Forecasting') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Budget Allocations */}
                    <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Departmental Budgets (Annual)</span>
                      <div className="space-y-4">
                        {[
                          { dept: 'Academic & Curriculum', allocated: 150000, spent: 45000, color: 'bg-blue-500' },
                          { dept: 'Facility Maintenance', allocated: 80000, spent: 65000, color: 'bg-amber-500' },
                          { dept: 'IT & Infrastructure', allocated: 120000, spent: 115000, color: 'bg-rose-500' },
                          { dept: 'Marketing & Admissions', allocated: 50000, spent: 10000, color: 'bg-emerald-500' },
                        ].map(b => (
                          <div key={b.dept} className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-bold text-foreground">
                              <span>{b.dept}</span>
                              <span>{formatCurrency(b.spent)} / {formatCurrency(b.allocated)}</span>
                            </div>
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                              <div className={`h-full ${b.color}`} style={{ width: `${(b.spent/b.allocated)*100}%` }}></div>
                            </div>
                            <span className="text-[9px] text-muted-foreground flex justify-end">
                              {`${Math.round((b.spent/b.allocated)*100)}% Consumed`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Forecasting */}
                    <div className="p-5 bg-primary/5 border border-primary/20 rounded-xl space-y-4 flex flex-col justify-center text-center">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-2">
                        <LineChart className="w-6 h-6" />
                      </div>
                      <span className="block text-sm font-black text-primary uppercase tracking-wider">Q3 AI Revenue Forecast</span>
                      <p className="text-xs text-foreground/70 px-4 leading-relaxed">
                        Based on historical admission trends and current fee default rates, AI projects a <strong>+8.5%</strong> revenue growth for the upcoming quarter.
                      </p>
                      <strong className="text-3xl font-black text-foreground">{formatCurrency(485000)}</strong>
                      <button className="mx-auto px-6 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-lg shadow-md mt-2">
                        Download Full Forecast Report
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Tax Reports' || activeFeature === 'Balance Sheet') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Corporate Tax Liability Summary</span>
                      <button className="px-3 py-1 bg-muted hover:bg-muted/80 text-foreground border border-border rounded text-[10px] font-bold flex items-center gap-1">
                        <Download className="w-3 h-3" /> Export PDF
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <strong className="text-xs border-b border-border pb-1 block">Assets & Equities (Balance Sheet)</strong>
                        <div className="flex justify-between text-[11px] py-1 border-b border-border/30"><span className="text-muted-foreground">Cash & Equivalents</span> <strong className="text-foreground">{formatCurrency(1250000)}</strong></div>
                        <div className="flex justify-between text-[11px] py-1 border-b border-border/30"><span className="text-muted-foreground">Accounts Receivable (Fees)</span> <strong className="text-foreground">{formatCurrency(189000)}</strong></div>
                        <div className="flex justify-between text-[11px] py-1 border-b border-border/30"><span className="text-muted-foreground">Fixed Assets (Property)</span> <strong className="text-foreground">{formatCurrency(4500000)}</strong></div>
                        <div className="flex justify-between text-[11px] py-1 font-black bg-muted/30 p-1"><span className="text-foreground">Total Assets</span> <strong className="text-primary">{formatCurrency(5939000)}</strong></div>
                      </div>

                      <div className="space-y-2">
                        <strong className="text-xs border-b border-border pb-1 block">Tax Deductions (Estimated)</strong>
                        <div className="flex justify-between text-[11px] py-1 border-b border-border/30"><span className="text-muted-foreground">Gross Taxable Income</span> <strong className="text-foreground">{formatCurrency(270000)}</strong></div>
                        <div className="flex justify-between text-[11px] py-1 border-b border-border/30"><span className="text-muted-foreground">Staff Salary Deductions</span> <strong className="text-rose-400">-{formatCurrency(45000)}</strong></div>
                        <div className="flex justify-between text-[11px] py-1 border-b border-border/30"><span className="text-muted-foreground">Operating Deductions</span> <strong className="text-rose-400">-{formatCurrency(12000)}</strong></div>
                        <div className="flex justify-between text-[11px] py-1 font-black bg-rose-500/10 text-rose-500 p-1"><span className="text-rose-500">Estimated Corporate Tax (15%)</span> <strong>{formatCurrency(31950)}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

{(activeFeature === 'Fee Monitoring' || activeFeature === 'Fee Status' || activeFeature === 'Fee Payments' || activeFeature === 'Fee Collection' || activeFeature === 'Fee Defaulters' || activeFeature === 'Invoicing') && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Side-by-Side Fee Stats & Monthly Bar Chart */}
                  <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Fee Collection Overview</span>
                      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col justify-center">
                          <span className="text-slate-400 block font-semibold">
                            {isEditor ? "Total Fees Collected" : "Total Fees Paid"}
                          </span>
                          <strong className="text-emerald-400 text-xl block mt-1 font-black">
                            {formatCurrency(
                              invoices
                                .filter(i => (isEditor || i.student === currentUser?.name) && i.status === 'Paid')
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
                                .filter(i => (isEditor || i.student === currentUser?.name) && i.status === 'Unpaid')
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
                        
                        // Prevent duplicate unpaid invoices for same amount
                        if (invoices.some(i => i.student === newInvoiceStudent && i.amount === amt && i.status === 'Unpaid')) {
                          alert(`An unpaid invoice of Rs ${amt} already exists for ${newInvoiceStudent}.`);
                          return;
                        }

                        const newInv = { id: `INV-${Date.now()}`, student: newInvoiceStudent, amount: amt, status: 'Unpaid' };
                        setInvoices(prev => [...prev, newInv]);
                        setNewInvoiceAmount('');
                        setNewInvoiceStudent('');

                        // Auto-generate PDF/Print preview
                        const html = generateFeeChallanHtml(newInv);
                        const blob = new Blob([html], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const win = window.open(url, '_blank');
                        if (win) {
                          win.onload = () => win.print();
                        } else {
                          alert('Invoice generated and shared to student portal! (Popup blocked: Allow popups to auto-print PDF)');
                        }
                      }}
                      className="p-5 bg-card border border-border rounded-2xl space-y-4 shadow-sm"
                    >
                      <span className="block text-xs font-black text-foreground/80 uppercase tracking-wider">Issue Fee Challan / Invoice</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          list="feeStudentsList"
                          value={newInvoiceStudent} 
                          onChange={(e) => setNewInvoiceStudent(e.target.value)}
                          placeholder="-- Select or Type Student Name --"
                          className="modern-input transition-colors"
                          required
                          onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please enter a student name!')}
                          onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                        />
                        <datalist id="feeStudentsList">
                          {students.map(s => <option key={s.id} value={s.name}>{s.name} ({s.className})</option>)}
                        </datalist>
                        <input 
                          type="number" 
                          required 
                          placeholder="Challan Amount (e.g. 8500)"
                          value={newInvoiceAmount}
                          onChange={(e) => setNewInvoiceAmount(e.target.value)}
                          className="modern-input transition-colors"
                          onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please enter a valid amount for the invoice!')}
                          onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                          Create & Generate PDF
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Invoice list */}
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Fee Ledgers</span>
                    {invoices
                      .filter(i => isEditor || i.student === currentUser?.name) // Parents/Students only view own invoices
                      .map((inv) => (
                      <div key={inv.id} className="p-4 bg-card border border-border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow">
                        {editingInvoiceId === inv.id ? (
                          <div className="flex-1 w-full space-y-2">
                            <input
                              type="text"
                              value={editingInvoiceStudent}
                              onChange={e => setEditingInvoiceStudent(e.target.value)}
                              className="w-full bg-muted border border-border rounded-md text-xs p-2 text-foreground font-semibold"
                              placeholder="Student Name"
                            />
                            <div className="flex gap-2">
                              <input
                                type="number"
                                value={editingInvoiceAmount}
                                onChange={e => setEditingInvoiceAmount(e.target.value)}
                                className="w-1/2 bg-muted border border-border rounded-md text-xs p-2 text-foreground font-semibold"
                                placeholder="Amount"
                              />
                              <select
                                value={editingInvoiceStatus}
                                onChange={e => setEditingInvoiceStatus(e.target.value as 'Paid' | 'Unpaid')}
                                className="w-1/2 bg-muted border border-border rounded-md text-xs p-2 text-foreground font-semibold"
                              >
                                <option value="Unpaid">Unpaid</option>
                                <option value="Paid">Paid</option>
                              </select>
                            </div>
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => {
                                  const amt = parseFloat(editingInvoiceAmount);
                                  if (!editingInvoiceStudent || isNaN(amt)) return;
                                  setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, student: editingInvoiceStudent, amount: amt, status: editingInvoiceStatus } : i));
                                  setEditingInvoiceId(null);
                                }}
                                className="px-3 py-1.5 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 rounded-lg text-xs font-bold transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingInvoiceId(null)}
                                className="px-3 py-1.5 bg-slate-500/20 text-slate-400 hover:bg-slate-500/30 rounded-lg text-xs font-bold transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this invoice?')) {
                                    setInvoices(prev => prev.filter(i => i.id !== inv.id));
                                  }
                                }}
                                className="px-3 py-1.5 ml-auto bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-xs font-bold transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div>
                              <strong className="block text-[13px] font-black text-foreground">{inv.student}</strong>
                              <span className="text-[11px] text-slate-500 font-bold tracking-wide mt-0.5 block">{inv.id} | Rs {inv.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                              <button 
                                type="button"
                                onClick={() => {
                                  const html = generateFeeChallanHtml(inv);
                                  const blob = new Blob([html], { type: 'text/html' });
                                  const url = URL.createObjectURL(blob);
                                  const win = window.open(url, '_blank');
                                  if (win) win.onload = () => win.print();
                                }}
                                className="px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg text-[10px] font-bold transition-colors uppercase tracking-wider flex-1 sm:flex-none text-center"
                              >
                                PDF
                              </button>
                              {isEditor ? (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingInvoiceId(inv.id);
                                      setEditingInvoiceStudent(inv.student);
                                      setEditingInvoiceAmount(inv.amount.toString());
                                      setEditingInvoiceStatus(inv.status);
                                    }}
                                    className="px-3 py-1.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg text-xs font-bold transition-colors flex-1 sm:flex-none text-center"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: i.status === 'Paid' ? 'Unpaid' : 'Paid' } : i));
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex-1 sm:flex-none text-center ${
                                      inv.status === 'Paid'
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                                    }`}
                                  >
                                    {inv.status}
                                  </button>
                                </>
                              ) : (
                                <div className="flex items-center gap-2 flex-1 sm:flex-none">
                                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border text-center flex-1 sm:flex-none ${
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
                                        alert(`Fee Payment of Rs ${inv.amount} Processed Successfully via online banking!`);
                                      }}
                                      className="px-3 py-1.5 bg-primary hover:bg-primary/95 text-white rounded-lg text-xs font-bold transition-all shadow flex-1 sm:flex-none text-center"
                                    >
                                      Pay Online
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              
              {/* PARENT PROGRESS GRAPHS */}
              {(activeFeature === 'Student Progress Graphs') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed flex items-center justify-between">
                    <span>📊 Track your child's academic performance, term-by-term GPA growth, and subject-wise proficiency.</span>
                    <select className="bg-card border border-border text-xs rounded p-1 font-bold text-foreground focus:outline-none">
                      <option>Kamran Shah (10-A)</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Overall Growth Chart */}
                    <div className="p-5 bg-card border border-border rounded-xl flex flex-col justify-between h-64">
                      <div className="flex justify-between items-start mb-4">
                        <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Overall Academic Growth</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded font-bold">+0.4 GPA (YTD)</span>
                      </div>
                      <div className="flex-1 flex items-end gap-3 px-2">
                        {[
                          { term: 'Term 1', gpa: 3.2, max: 4.0 },
                          { term: 'Term 2', gpa: 3.4, max: 4.0 },
                          { term: 'Mid-Term', gpa: 3.5, max: 4.0 },
                          { term: 'Term 3', gpa: 3.6, max: 4.0 },
                          { term: 'Finals Prep', gpa: 3.8, max: 4.0 },
                        ].map((stat, i) => (
                          <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                            <div className="opacity-0 group-hover:opacity-100 text-[11px] font-black text-foreground transition-opacity bg-muted px-2 py-1 rounded shadow-sm">
                              {stat.gpa}
                            </div>
                            <div className="w-full bg-primary/40 group-hover:bg-primary transition-all rounded-t-md relative overflow-hidden" style={{ height: `${(stat.gpa / stat.max) * 100}%` }}>
                              <div className="absolute bottom-0 w-full bg-gradient-to-t from-primary/50 to-transparent h-1/2"></div>
                            </div>
                            <span className="text-[9px] text-muted-foreground font-semibold truncate max-w-full">{stat.term}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subject Proficiency */}
                    <div className="p-5 bg-card border border-border rounded-xl h-64 flex flex-col">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-4">Subject-wise Proficiency</span>
                      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                        {[
                          { sub: 'Mathematics', score: 92, avg: 78, color: 'bg-blue-500' },
                          { sub: 'Physics', score: 88, avg: 72, color: 'bg-purple-500' },
                          { sub: 'Chemistry', score: 85, avg: 74, color: 'bg-emerald-500' },
                          { sub: 'English', score: 95, avg: 81, color: 'bg-amber-500' },
                          { sub: 'Computer Science', score: 98, avg: 85, color: 'bg-rose-500' },
                        ].map(s => (
                          <div key={s.sub} className="space-y-1.5 group">
                            <div className="flex justify-between text-[11px] font-bold text-foreground">
                              <span className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${s.color}`}></div>
                                {s.sub}
                              </span>
                              <span>{s.score}% <span className="text-[9px] text-foreground/40 font-normal ml-1">(Class Avg: {s.avg}%)</span></span>
                            </div>
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden relative">
                              {/* Class Average Marker */}
                              <div className="absolute top-0 bottom-0 w-0.5 bg-foreground/30 z-10" style={{ left: `${s.avg}%` }}></div>
                              {/* Student Score */}
                              <div className={`h-full ${s.color} transition-all duration-1000`} style={{ width: `${s.score}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-[9px] text-foreground/50 flex justify-end items-center gap-1">
                        <div className="w-1 h-3 bg-foreground/30"></div> <span>Class Average Line</span>
                      </div>
                    </div>
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
                            { id: `n-${Date.now()}`, date: new Date().toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), title: newNoticeTitle, content: newNoticeContent }
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

              
              {/* STUDENT ADVANCED MODULES */}
              {(activeFeature === 'Student Goal Tracking') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    🎯 Set academic goals and track your progress in real-time. Keep pushing your limits!
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Goal creation */}
                    <div className="md:col-span-1 p-4 bg-muted/30 border border-border rounded-xl space-y-3 h-fit">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Create New Goal</span>
                      <input 
                        type="text" 
                        placeholder="e.g. Score 95% in Math Finals" 
                        value={newGoalTitle}
                        onChange={(e) => setNewGoalTitle(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" 
                      />
                      <button 
                        onClick={() => {
                          if(!newGoalTitle) return;
                          setStudentGoals(prev => [{ id: Date.now().toString(), title: newGoalTitle, status: 'Not Started', progress: 0 }, ...prev]);
                          setNewGoalTitle('');
                        }}
                        className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                      >
                        Add Goal
                      </button>
                    </div>

                    {/* Goal List */}
                    <div className="md:col-span-2 space-y-3">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Active Goals</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {studentGoals.map(goal => (
                          <div key={goal.id} className="p-3.5 bg-card border border-border rounded-xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                            <div className="flex justify-between items-start mb-2 pl-2">
                              <strong className="text-sm text-foreground pr-2">{goal.title}</strong>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold whitespace-nowrap ${goal.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                {goal.status}
                              </span>
                            </div>
                            <div className="pl-2 space-y-1 mt-3">
                              <div className="flex justify-between text-[10px] font-bold text-foreground/60">
                                <span>Progress</span>
                                <span>{goal.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${goal.progress}%` }}></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'GPA & Progress Analytics') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📈 Analyze your GPA progression across semesters and subject-wise performance benchmarks.
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* GPA Chart Mock */}
                    <div className="p-5 bg-card border border-border rounded-xl flex flex-col justify-between">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-4">Semester GPA Trend</span>
                      <div className="flex items-end gap-2 h-40">
                        {[3.1, 3.4, 3.2, 3.6, 3.8, 3.85].map((gpa, i) => (
                          <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1 group">
                            <div className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-foreground transition-opacity">{gpa}</div>
                            <div className="w-full bg-primary/40 hover:bg-primary transition-colors rounded-t-sm" style={{ height: `${(gpa / 4.0) * 100}%` }}></div>
                            <span className="text-[9px] text-muted-foreground font-mono">Sem {i+1}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                        <span className="text-xs text-foreground/70">Current Cumulative GPA</span>
                        <strong className="text-xl text-emerald-400 font-black">3.85 / 4.0</strong>
                      </div>
                    </div>

                    {/* Subject Radar/Bars Mock */}
                    <div className="p-5 bg-card border border-border rounded-xl">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-4">Subject Proficiency</span>
                      <div className="space-y-4">
                        {[
                          { subject: 'Physics', score: 92, color: 'bg-purple-500' },
                          { subject: 'Chemistry', score: 88, color: 'bg-emerald-500' },
                          { subject: 'Mathematics', score: 96, color: 'bg-blue-500' },
                          { subject: 'English', score: 85, color: 'bg-amber-500' }
                        ].map(s => (
                          <div key={s.subject} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-foreground">
                              <span>{s.subject}</span>
                              <span>{s.score}%</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div className={`h-full ${s.color}`} style={{ width: `${s.score}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Achievement System') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    🏆 Unlock badges and earn recognition by completing academic challenges and maintaining high standards!
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[
                      { title: 'Perfect Attendance', desc: 'No absences in Q1', icon: '⏰', unlocked: true },
                      { title: 'Math Wizard', desc: 'Score >95% in Math', icon: '🧮', unlocked: true },
                      { title: 'Science Fair Pro', desc: 'Top 3 in Science Fair', icon: '🔬', unlocked: true },
                      { title: 'Bookworm', desc: 'Read 10 library books', icon: '📚', unlocked: false },
                      { title: 'Helpful Peer', desc: 'Assist 5 classmates', icon: '🤝', unlocked: false },
                      { title: 'Homework Hero', desc: '100% submission rate', icon: '📝', unlocked: true },
                    ].map((badge, i) => (
                      <div key={i} className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${badge.unlocked ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)] scale-100' : 'bg-card border-border opacity-50 grayscale scale-95'}`}>
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <strong className={`text-xs block mb-1 ${badge.unlocked ? 'text-amber-500 font-black' : 'text-foreground'}`}>{badge.title}</strong>
                        <span className="text-[10px] text-foreground/60 leading-tight">{badge.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeFeature === 'Digital Certificates') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    🎓 Download your official, digitally signed certificates for course completions and special achievements.
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {studentCertificates.map(cert => (
                      <div key={cert.id} className="p-5 bg-card border border-border rounded-xl relative overflow-hidden group hover:border-primary/50 transition-colors">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
                        <div className="flex flex-col h-full justify-between gap-4 relative z-10">
                          <div>
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-3">
                              <Award className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-black text-foreground pr-2">{cert.title}</h4>
                            <span className="text-xs text-muted-foreground block mt-2">Issued by: {cert.issuer}</span>
                            <span className="text-xs text-muted-foreground block">Date: {cert.issueDate}</span>
                          </div>
                          <button className="flex items-center justify-center w-full mt-2 gap-2 py-2 rounded-lg bg-muted border border-border text-xs font-bold text-foreground hover:bg-card hover:text-primary transition-colors">
                            Download PDF <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeFeature === 'Study Planner' || activeFeature === 'Exam Preparation Tracker' || activeFeature === 'Homework Reminder') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📅 Manage your study schedule, track exam preparation, and get reminded of upcoming homework deadlines.
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 p-4 bg-muted/30 border border-border rounded-xl space-y-3 h-fit">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Add Study Task</span>
                      <input 
                        type="text" 
                        placeholder="Task Name (e.g. Read Physics Ch2)" 
                        value={newStudyTaskTitle}
                        onChange={(e) => setNewStudyTaskTitle(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" 
                      />
                      <div className="flex gap-2">
                        <input type="date" className="w-1/2 bg-card border border-border rounded-lg text-xs p-2 text-foreground" />
                        <input type="time" className="w-1/2 bg-card border border-border rounded-lg text-xs p-2 text-foreground" />
                      </div>
                      <button 
                        onClick={() => {
                          if(!newStudyTaskTitle) return;
                          setStudyTasks(prev => [{ id: Date.now().toString(), title: newStudyTaskTitle, date: new Date().toISOString().split('T')[0], time: '12:00', completed: false }, ...prev]);
                          setNewStudyTaskTitle('');
                        }}
                        className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add to Planner
                      </button>
                    </div>

                    <div className="md:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                        <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Upcoming Tasks & Exams</span>
                        <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-1 rounded font-bold">Next 7 Days</span>
                      </div>
                      <div className="divide-y divide-border flex-1">
                        {studyTasks.map(task => (
                          <div key={task.id} className="p-3.5 flex items-center gap-3 hover:bg-muted/10 transition-colors">
                            <input 
                              type="checkbox" 
                              checked={task.completed} 
                              onChange={() => setStudyTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-card"
                            />
                            <div className={`flex-1 ${task.completed ? 'opacity-50 line-through' : ''}`}>
                              <strong className="text-sm font-semibold text-foreground block">{task.title}</strong>
                              <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 mt-0.5">
                                <CalendarDays className="w-3 h-3" /> {task.date} @ {task.time}
                              </span>
                            </div>
                            {!task.completed && (
                              <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[9px] font-bold rounded flex items-center gap-1 uppercase">
                                <Bell className="w-2.5 h-2.5" /> Reminder On
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'AI Study Assistant') && (
                <div className="space-y-4 animate-fadeIn h-full flex flex-col min-h-[500px]">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-500" />
                    <span>Hi! I am your AI Study Tutor. Ask me to explain a concept, summarize a chapter, or create a quiz.</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                      {aiChatResponses.map((chat, i) => (
                        <div key={i} className="space-y-4">
                          {/* User Message */}
                          <div className="flex justify-end">
                            <div className="bg-primary text-white text-sm py-2 px-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                              {chat.query}
                            </div>
                          </div>
                          {/* AI Response */}
                          {chat.response && (
                            <div className="flex justify-start">
                              <div className="bg-muted text-foreground text-sm py-2 px-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm leading-relaxed border border-border">
                                {chat.response}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {studioLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted text-foreground text-sm py-3 px-4 rounded-2xl rounded-tl-none border border-border flex gap-1 items-center">
                            <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Chat Input */}
                    <div className="p-3 bg-muted/30 border-t border-border flex items-center gap-2 mt-auto">
                      <input 
                        type="text" 
                        value={aiChatQuery}
                        onChange={(e) => setAiChatQuery(e.target.value)}
                        placeholder="Ask a question..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && aiChatQuery.trim()) {
                            const q = aiChatQuery;
                            setAiChatQuery('');
                            setStudioLoading(true);
                            setAiChatResponses(prev => [...prev, { query: q, response: '' }]);
                            setTimeout(() => {
                              setAiChatResponses(prev => {
                                const newArr = [...prev];
                                newArr[newArr.length - 1].response = "I am an AI Study Assistant prototype! In a real environment, I would analyze your question about '" + q + "' and provide an interactive explanation.";
                                return newArr;
                              });
                              setStudioLoading(false);
                            }, 1500);
                          }
                        }}
                        className="flex-1 bg-card border border-border rounded-full px-4 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none"
                      />
                      <button 
                        onClick={() => {
                          if (!aiChatQuery.trim()) return;
                          const q = aiChatQuery;
                          setAiChatQuery('');
                          setStudioLoading(true);
                          setAiChatResponses(prev => [...prev, { query: q, response: '' }]);
                          setTimeout(() => {
                            setAiChatResponses(prev => {
                              const newArr = [...prev];
                              newArr[newArr.length - 1].response = "I am an AI Study Assistant prototype! In a real environment, I would analyze your question about '" + q + "' and provide an interactive explanation.";
                              return newArr;
                            });
                            setStudioLoading(false);
                          }, 1500);
                        }}
                        className="p-2 bg-primary hover:bg-primary/90 text-white rounded-full transition-colors flex-shrink-0 shadow-md"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
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
                        const date = leaveFormDate;
                        if (!reason || !date) return;

                        if (isWeekend(date)) {
                          alert("Error: Leaves cannot be requested on weekends!");
                          return;
                        }

                        const minDate = getTomorrow24h().slice(0, 10);
                        if (date < minDate) {
                          alert("Error: Leaves must be requested at least 24 hours in advance!");
                          return;
                        }

                        setLeaves(prev => [
                          ...prev,
                          { id: `l-${Date.now()}`, name: currentUser?.name || 'Teacher/Staff Member', date, reason, status: 'Pending' }
                        ]);
                        setLeaveFormDate('');
                        setLeaveFormError('');
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
                          min={getTomorrow24h().slice(0, 10)}
                          value={leaveFormDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLeaveFormDate(val);
                            if (!val) {
                              setLeaveFormError('');
                            } else if (isWeekend(val)) {
                              setLeaveFormError('Leaves cannot be requested on weekends.');
                            } else if (val < getTomorrow24h().slice(0, 10)) {
                              setLeaveFormError('Leaves must be requested at least 24 hours in advance.');
                            } else {
                              setLeaveFormError('');
                            }
                          }}
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
                      {leaveFormError && (
                        <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[10px] text-rose-400 font-semibold animate-fadeIn">
                          ⚠️ {leaveFormError}
                        </div>
                      )}
                      <div className="flex justify-end pt-2">
                        <button 
                          type="submit" 
                          disabled={!!leaveFormError || !leaveFormDate}
                          className="px-6 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg transition-all shadow-md"
                        >
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
                      leaves.map((lv) => {
                        const isMajor = lv.reason.toLowerCase().includes('medical') || 
                                        lv.reason.toLowerCase().includes('vacation') || 
                                        lv.reason.toLowerCase().includes('trip') || 
                                        lv.reason.toLowerCase().includes('family');

                        return (
                          <div key={lv.id} className="p-3.5 bg-card border border-border rounded-xl flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <strong className="block text-sm text-foreground">{lv.name}</strong>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                  isMajor 
                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}>
                                  {isMajor ? 'Major Leave' : 'Minor Leave'}
                                </span>
                              </div>
                              <span className="text-xs text-slate-500 block font-mono">Leave date: {lv.date}</span>
                              <span className="text-xs text-foreground/75 block">Reason: "{lv.reason}"</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {lv.status === 'Pending' ? (
                                isEditor ? (
                                  simulatedRole === 'vice_principal' ? (
                                    isMajor ? (
                                      <>
                                        <button
                                          onClick={() => {
                                            setLeaves(prev => prev.map(l => l.id === lv.id ? { ...l, status: 'Recommended by VP' } : l));
                                            setPrincipalNotifications(prev => [
                                              ...prev,
                                              `Major Action Required: VP recommended and forwarded ${lv.name}'s leave request.`
                                            ]);
                                            alert("Recommended and forwarded to Principal for final approval.");
                                          }}
                                          className="px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-705 text-white font-bold text-[10px] transition-colors shadow cursor-pointer"
                                        >
                                          Recommend & Forward
                                        </button>
                                        <button
                                          onClick={() => {
                                            setLeaves(prev => prev.map(l => l.id === lv.id ? { ...l, status: 'Rejected' } : l));
                                            setPrincipalNotifications(prev => [
                                              ...prev,
                                              `Notification: VP rejected leave request for ${lv.name}.`
                                            ]);
                                          }}
                                          className="px-2.5 py-1.5 rounded bg-red-500 hover:bg-red-650 text-white font-bold text-[10px] transition-colors shadow cursor-pointer"
                                        >
                                          Reject
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => {
                                            setLeaves(prev => prev.map(l => l.id === lv.id ? { ...l, status: 'Approved' } : l));
                                            setPrincipalNotifications(prev => [
                                              ...prev,
                                              `Notification: VP approved ${lv.name}'s leave request (Minor leave).`
                                            ]);
                                            alert("Approved directly by VP.");
                                          }}
                                          className="px-2.5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] transition-colors shadow cursor-pointer"
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => {
                                            setLeaves(prev => prev.map(l => l.id === lv.id ? { ...l, status: 'Rejected' } : l));
                                            setPrincipalNotifications(prev => [
                                              ...prev,
                                              `Notification: VP rejected leave request for ${lv.name}.`
                                            ]);
                                          }}
                                          className="px-2.5 py-1.5 rounded bg-red-500 hover:bg-red-650 text-white font-bold text-[10px] transition-colors shadow cursor-pointer"
                                        >
                                          Reject
                                        </button>
                                      </>
                                    )
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => {
                                          setLeaves(prev => prev.map(l => l.id === lv.id ? { ...l, status: 'Approved' } : l));
                                        }}
                                        className="px-2.5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] transition-colors shadow cursor-pointer"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => {
                                          setLeaves(prev => prev.map(l => l.id === lv.id ? { ...l, status: 'Rejected' } : l));
                                        }}
                                        className="px-2.5 py-1.5 rounded bg-red-500 hover:bg-red-650 text-white font-bold text-[10px] transition-colors shadow cursor-pointer"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )
                                ) : (
                                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    Pending Vetting
                                  </span>
                                )
                              ) : lv.status === 'Recommended by VP' ? (
                                isEditor ? (
                                  simulatedRole === 'admin' ? (
                                    <>
                                      <button
                                        onClick={() => {
                                          setLeaves(prev => prev.map(l => l.id === lv.id ? { ...l, status: 'Approved' } : l));
                                          alert("Major leave officially approved by Principal.");
                                        }}
                                        className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors shadow cursor-pointer"
                                      >
                                        Principal Approve
                                      </button>
                                      <button
                                        onClick={() => {
                                          setLeaves(prev => prev.map(l => l.id === lv.id ? { ...l, status: 'Rejected' } : l));
                                        }}
                                        className="px-2.5 py-1.5 rounded bg-red-500 hover:bg-red-650 text-white font-bold text-[10px] transition-colors shadow cursor-pointer"
                                      >
                                        Principal Reject
                                      </button>
                                    </>
                                  ) : (
                                    <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-455 border border-blue-500/20">
                                      Recommended (Pending Principal)
                                    </span>
                                  )
                                ) : (
                                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-455 border border-blue-500/20">
                                    Vetting (Recommended)
                                  </span>
                                )
                              ) : (
                                <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                                  lv.status === 'Approved'
                                    ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20'
                                    : 'bg-red-500/10 text-red-450 border-red-500/20'
                                }`}>
                                  {lv.status}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* BOOK MANAGEMENT & ISSUE BOOKS & RETURN BOOKS & LIBRARY SYSTEM */}
              {['Book Management', 'Issue Books', 'Return Books', 'Fine Collection', 'Inventory Tracking', 'Library Desk', 'Library Books', 'Library Books Roster'].includes(activeFeature) && (
                <div className="space-y-4">
                  {activeFeature === 'Library Books' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        📚 Your Borrowed Books and Due Dates. You can request due-date extensions here.
                      </div>
                      {(!studentLibrary[activeStudentName] || studentLibrary[activeStudentName].length === 0) ? (
                        <div className="p-8 text-center bg-muted/10 border border-border rounded-2xl">
                          <span className="text-3xl block mb-2">📖</span>
                          <p className="text-xs text-foreground/60 font-semibold">No books currently issued to your account.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
                          {studentLibrary[activeStudentName].map((book) => {
                            let statusColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                            if (book.status === 'Overdue') statusColor = "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse";
                            else if (book.status === 'Due Soon') statusColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                            else if (book.status === 'Extended') statusColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";

                            return (
                              <div key={book.id} className="p-4 bg-card border border-border rounded-2xl space-y-3 flex flex-col justify-between hover:border-primary/45 transition-all">
                                <div>
                                  <div className="flex justify-between items-start gap-2">
                                    <h4 className="text-xs font-extrabold text-foreground leading-snug">{book.title}</h4>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 border ${statusColor}`}>
                                      {book.status}
                                    </span>
                                  </div>
                                  <div className="mt-2 space-y-1 text-[11px] text-foreground/60">
                                    <p>Issue Date: <span className="font-mono text-foreground">{book.issueDate}</span></p>
                                    <p>Due Date: <span className="font-mono text-foreground font-bold">{book.dueDate}</span></p>
                                  </div>
                                </div>
                                {book.status !== 'Extended' && (
                                  <button
                                    onClick={() => {
                                      requestSecurityVerification(`Extend the due date of "${book.title}" by 7 days`, () => {
                                        setStudentLibrary(prev => {
                                          const studentBooks = prev[activeStudentName] || [];
                                          const updated = studentBooks.map(b => {
                                            if (b.id === book.id) {
                                              const currentDue = new Date(b.dueDate);
                                              currentDue.setDate(currentDue.getDate() + 7);
                                              const newDueDateStr = currentDue.toISOString().split('T')[0];
                                              return { ...b, dueDate: newDueDateStr, status: 'Extended' as const };
                                            }
                                            return b;
                                          });
                                          return { ...prev, [activeStudentName]: updated };
                                        });
                                      });
                                    }}
                                    className="w-full py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-[10px] font-black transition-all"
                                  >
                                    Extend Due Date (7 Days)
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {activeFeature === 'Library Books Roster' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        📋 Classroom Library Checkout Roster. Review all active student borrows.
                      </div>
                      <div className="space-y-2.5">
                        {students.map((st) => {
                          const studentBooks = studentLibrary[st.name] || [];
                          return (
                            <div key={st.id} className="p-3 bg-card border border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                              <div>
                                <strong className="text-xs text-foreground font-extrabold">{st.name}</strong>
                                <span className="text-[10px] text-foreground/50 ml-2">({st.className})</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {studentBooks.length === 0 ? (
                                  <span className="text-[10px] text-foreground/45 italic">No books checked out</span>
                                ) : (
                                  studentBooks.map(b => (
                                    <span key={b.id} className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                                      b.status === 'Overdue' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-primary/10 text-primary border-primary/20'
                                    }`}>
                                      {b.title} (Due: {b.dueDate})
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {!['Library Books', 'Library Books Roster'].includes(activeFeature) && (
                    <>
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
                          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-3">
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* VEHICLES & ROUTES & DRIVERS & TRANSPORT GPS TRACKING */}
              {['Vehicles', 'Routes', 'Drivers', 'Student Assignments', 'GPS Tracking', 'Transport Fees', 'Transport GPS Tracking', 'School Transport', 'Transport Roster'].includes(activeFeature) && (
                <div className="space-y-4">
                  {/* Common GPS Header status */}
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed flex items-center justify-between">
                    <span>🚌 Transport Control Desk: <strong className="text-emerald-400 font-mono">ACTIVE</strong>. Fleet synced.</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  </div>

                  {activeFeature === 'School Transport' && (
                    <div className="space-y-4">
                      {!(studentTransport[activeStudentName]?.active) ? (
                        <div className="p-6 bg-card border border-border rounded-2xl space-y-4 text-center">
                          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg mx-auto">
                            🚌
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-extrabold text-foreground">Transport Service Inactive</h4>
                            <p className="text-xs text-foreground/60 max-w-md mx-auto leading-relaxed">
                              School Transport is currently not enabled for this student profile. Subscriptions include daily secure pickup & drop, GPS tracking access, and certified drivers.
                            </p>
                          </div>
                          <div className="border-t border-border pt-4 text-xs font-semibold text-foreground/70 space-y-1.5 max-w-sm mx-auto text-left">
                            <div className="flex justify-between"><span>Route:</span><span className="text-foreground">Route Alpha (Main Loop)</span></div>
                            <div className="flex justify-between"><span>Subscription Fee:</span><span className="text-foreground">{formatCurrency(2500)} / month</span></div>
                            <div className="flex justify-between"><span>Status:</span><span className="text-amber-400 font-bold">Available</span></div>
                          </div>
                          <button
                            onClick={() => {
                              requestSecurityVerification(`Subscribe this student profile to School Transport Service for ${formatCurrency(2500)}/mo`, () => {
                                setStudentTransport(prev => ({
                                  ...prev,
                                  [activeStudentName]: { active: true, route: 'Route Alpha (Main Loop)', vehicle: 'BUS-08 (LHR-9876)', driver: 'Ahmed Khan', phone: '0300-1234567', fee: 2500 }
                                }));
                              });
                            }}
                            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                          >
                            Subscribe to Transport Service
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-4 bg-card border border-border rounded-2xl grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="text-xs font-black text-primary uppercase tracking-widest">Active Transport Details</h4>
                              <div className="space-y-1.5 text-xs text-foreground/75">
                                <p>Route Name: <strong className="text-foreground">{studentTransport[activeStudentName].route}</strong></p>
                                <p>Assigned Bus: <strong className="text-foreground">{studentTransport[activeStudentName].vehicle}</strong></p>
                                <p>Driver Name: <strong className="text-foreground">{studentTransport[activeStudentName].driver}</strong></p>
                                <p>Driver Phone: <strong className="text-foreground">{studentTransport[activeStudentName].phone}</strong></p>
                                <p>Transport Fee: <strong className="text-foreground">{formatCurrency(studentTransport[activeStudentName].fee || 2500)} / mo</strong></p>
                              </div>
                            </div>
                            <div className="p-3 bg-muted/20 border border-border rounded-xl text-center flex flex-col justify-center">
                              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">GPS Status</span>
                              <strong className="text-xs text-foreground font-black">Driver Synced & En Route</strong>
                              <span className="text-[9px] text-foreground/50 mt-1 block">Live GPS map simulation shown below</span>
                            </div>
                          </div>

                          {/* Render Live GPS Map Simulation */}
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
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
                    </div>
                  )}

                  {activeFeature === 'Transport Roster' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        📋 Classroom Transport Allocation Roster. Review which students use school transport services.
                      </div>
                      <div className="space-y-2.5">
                        {students.map((st) => {
                          const transport = studentTransport[st.name] || { active: false };
                          return (
                            <div key={st.id} className="p-3 bg-card border border-border rounded-xl flex items-center justify-between">
                              <div>
                                <strong className="text-xs text-foreground font-extrabold">{st.name}</strong>
                                <span className="text-[10px] text-foreground/50 ml-2">({st.className})</span>
                              </div>
                              <div>
                                {transport.active ? (
                                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Active: {transport.route}
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/25">
                                    No Transport
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-center text-xs">
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
                          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
                      </div>
                    </div>
                  )}

                  {/* Routes Sub-view */}
                  {activeFeature === 'Routes' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('New route saved!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Create New Bus Route</span>
                          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2">
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
                      </div>
                    </div>
                  )}

                  {/* Drivers Sub-view */}
                  {activeFeature === 'Drivers' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Driver registered successfully!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Add Bus Driver</span>
                          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
                      </div>
                    </div>
                  )}

                  {/* Student Assignments Sub-view */}
                  {activeFeature === 'Student Assignments' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Student transport route assigned!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Assign Student to Route</span>
                          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
                      </div>
                    </div>
                  )}

                  {/* Transport Fees Sub-view */}
                  {activeFeature === 'Transport Fees' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-center text-xs">
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
                          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ROOM ALLOCATION & BED ALLOCATION & MESS MANAGEMENT */}
              {['Room Allocation', 'Bed Allocation', 'Mess Management', 'Hostel Reports', 'Hostel Fees', 'Hostel Portal', 'Hostel Roster'].includes(activeFeature) && (
                <div className="space-y-4">
                  {/* Common Hostel Status */}
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed flex items-center justify-between">
                    <span>🏠 Hostel Administration: <strong className="text-emerald-400 font-mono">Wing A & B</strong> online. Warden on duty.</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  </div>

                  {activeFeature === 'Hostel Portal' && (
                    <div className="space-y-4">
                      {!(studentHostel[activeStudentName]?.allocated) ? (
                        <div className="p-6 bg-card border border-border rounded-2xl space-y-4 text-center">
                          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg mx-auto">
                            🏠
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-extrabold text-foreground">Hostel Boarding Unallocated</h4>
                            <p className="text-xs text-foreground/60 max-w-md mx-auto leading-relaxed">
                              This student profile is currently not registered for school hostel boarding. Benefits include fully furnished rooms, study zones, round-the-clock security, and hot mess meals.
                            </p>
                          </div>
                          <div className="border-t border-border pt-4 text-xs font-semibold text-foreground/70 space-y-1.5 max-w-sm mx-auto text-left">
                            <div className="flex justify-between"><span>Hostel Room Available:</span><span className="text-foreground">Wing B (Shared Room)</span></div>
                            <div className="flex justify-between"><span>Boarding Fee:</span><span className="text-foreground">{formatCurrency(8500)} / month</span></div>
                            <div className="flex justify-between"><span>Warden:</span><span className="text-foreground">Sajid Malik</span></div>
                          </div>
                          <button
                            onClick={() => {
                              requestSecurityVerification(`Request hostel room allocation for ${activeStudentName} at ${formatCurrency(8500)}/mo`, () => {
                                setStudentHostel(prev => ({
                                  ...prev,
                                  [activeStudentName]: { allocated: true, wing: 'Wing B', room: 'Room 202', warden: 'Sajid Malik', phone: '0321-7654321', feeStatus: 'Unpaid' }
                                }));
                              });
                            }}
                            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                          >
                            Request Hostel Room Booking
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 bg-card border border-border rounded-2xl grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="text-xs font-black text-primary uppercase tracking-widest">Active Boarding Details</h4>
                            <div className="space-y-1.5 text-xs text-foreground/75">
                              <p>Hostel Wing: <strong className="text-foreground">{studentHostel[activeStudentName].wing}</strong></p>
                              <p>Room Assigned: <strong className="text-foreground">{studentHostel[activeStudentName].room}</strong></p>
                              <p>Hostel Warden: <strong className="text-foreground">{studentHostel[activeStudentName].warden}</strong></p>
                              <p>Warden Phone: <strong className="text-foreground">{studentHostel[activeStudentName].phone}</strong></p>
                              <p>Monthly Hostel Fee: <strong className="text-foreground">{formatCurrency(8500)} / mo</strong></p>
                            </div>
                          </div>
                          <div className="p-3 bg-muted/20 border border-border rounded-xl text-center flex flex-col justify-center">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">Fee Invoice Status</span>
                            <span className={`px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider border mx-auto ${
                              studentHostel[activeStudentName].feeStatus === 'Paid'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                                : 'bg-red-500/10 text-red-400 border-red-500/25 animate-pulse'
                            }`}>
                              {studentHostel[activeStudentName].feeStatus}
                            </span>
                            <span className="text-[9px] text-foreground/50 mt-2 block">Dues are billed alongside monthly tuition fees.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeFeature === 'Hostel Roster' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        📋 Classroom Hostel Roster. Review room allocations for active boarders.
                      </div>
                      <div className="space-y-2.5">
                        {students.map((st) => {
                          const hostel = studentHostel[st.name] || { allocated: false };
                          return (
                            <div key={st.id} className="p-3 bg-card border border-border rounded-xl flex items-center justify-between">
                              <div>
                                <strong className="text-xs text-foreground font-extrabold">{st.name}</strong>
                                <span className="text-[10px] text-foreground/50 ml-2">({st.className})</span>
                              </div>
                              <div>
                                {hostel.allocated ? (
                                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Allocated: {hostel.wing} - {hostel.room}
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/25">
                                    Day Scholar
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

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
                          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-3">
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
                      </div>
                    </div>
                  )}

                  {/* Bed Allocation Sub-view */}
                  {activeFeature === 'Bed Allocation' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Hostel Bed allocation logged successfully!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Allocate Bed</span>
                          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
                      </div>
                    </div>
                  )}

                  {/* Hostel Reports Sub-view */}
                  {activeFeature === 'Hostel Reports' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-center text-xs">
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

              {/* Term Dates & Academic Calendar — Full Year Planner */}
              {(activeFeature === 'Term Dates & Academic Calendar') && (
                <AcademicCalendar editable={['admin', 'super_admin', 'vice_principal', 'org_owner', 'school_owner', 'hr'].includes(simulatedRole)} />
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
                        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-3">
                          <input type="text" placeholder="Visitor Name" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                          <select defaultValue="" className="modern-input" required>
  <option value="" disabled>Purpose of Visit</option>
  <option value="Admission Enquiry">Admission Enquiry</option>
  <option value="Fee Submission">Fee Submission</option>
  <option value="Parent-Teacher Meeting">Parent-Teacher Meeting</option>
  <option value="Meeting with Principal">Meeting with Principal</option>
  <option value="Vendor / Delivery">Vendor / Delivery</option>
  <option value="Event Guest">Event Guest</option>
  <option value="Other">Other</option>
</select>
                        </div>
                        <div className="flex justify-end pt-1">
                          <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                            + Check-in Visitor
                          </button>
                        </div>
                      </form>

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Today's Visitor Log</span>
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
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
                        <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          <input name="visitor" type="text" placeholder="Visitor Name" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                          <select name="host" defaultValue="" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold outline-none focus:border-primary" required>
  <option value="" disabled>Meeting With</option>
  <option value="Principal">Principal</option>
  <option value="Vice Principal">Vice Principal</option>
  <option value="Class Teacher">Class Teacher</option>
  <option value="Accounts / Fee Department">Accounts / Fee Department</option>
  <option value="Admission Office">Admission Office</option>
  <option value="IT Support">IT Support</option>
  <option value="Other">Other</option>
</select>
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
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
                        <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          <input type="text" placeholder="Caller Phone / Name" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground" required />
                          <select defaultValue="" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold outline-none focus:border-primary" required>
  <option value="" disabled>Recipient / Dept</option>
  <option value="General Info Desk">General Info Desk</option>
  <option value="Admission Office">Admission Office</option>
  <option value="Accounts / Fee Dept">Accounts / Fee Dept</option>
  <option value="Principal's Office">Principal's Office</option>
  <option value="Transport Dept">Transport Dept</option>
  <option value="IT Support">IT Support</option>
</select>
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
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
                    <div className="space-y-6">
                      {isEditor && (
                        <form onSubmit={(e) => { 
                          e.preventDefault(); 
                          const form = e.target as HTMLFormElement;
                          const name = (form.elements[0] as HTMLInputElement).value;
                          const role = (form.elements[1] as HTMLSelectElement).value;
                          const salary = (form.elements[2] as HTMLInputElement).value;
                          requestSecurityVerification(`Register new employee: ${name}`, () => {
                            setTeachers(prev => [...prev, {
                               id: `emp-${Date.now()}`,
                               name,
                               role,
                               salary,
                               subject: 'Administration',
                               className: 'N/A',
                               qualification: 'N/A',
                               experience: 'N/A',
                               email: 'N/A',
                               phone: 'N/A',
                               photo: null,
                               doc: null,
                               status: 'Active'
                            }]);
                            form.reset();
                            alert('Employee record registered successfully!');
                          });
                        }} className="p-5 bg-card border border-border rounded-2xl space-y-4 shadow-sm">
                          <span className="block text-xs font-black text-foreground/80 uppercase tracking-wider">Quick Register New Employee</span>
                          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <input type="text" placeholder="Full Name" className="modern-input" required />
                            <select defaultValue="" className="modern-input" required>
                              <option value="" disabled>Designation</option>
                              <option value="Principal">Principal</option>
                              <option value="Vice Principal">Vice Principal</option>
                              <option value="Academic Coordinator">Academic Coordinator</option>
                              <option value="Senior Teacher">Senior Teacher</option>
                              <option value="Junior Teacher">Junior Teacher</option>
                              <option value="Admin Officer">Admin Officer</option>
                              <option value="Accounts Manager">Accounts Manager</option>
                              <option value="IT Administrator">IT Administrator</option>
                              <option value="Librarian">Librarian</option>
                              <option value="Lab Assistant">Lab Assistant</option>
                              <option value="Guard">Guard</option>
                              <option value="Electrician">Electrician</option>
                              <option value="Plumber">Plumber</option>
                              <option value="Gardener">Gardener</option>
                              <option value="Helpers">Helpers</option>
                              <option value="Domestic Staff">Domestic Staff</option>
                            </select>
                            <input type="number" placeholder="Salary Base (PKR)" className="modern-input" required />
                          </div>
                          <div className="flex justify-end">
                            <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                              Register Staff
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-4">
                        <span className="block text-xs font-black text-foreground/80 uppercase tracking-wider border-b border-border pb-2">Staff Directory</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {filteredTeachers.length > 0 ? filteredTeachers.map((teach) => (
                            <div key={teach.id} className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all relative group overflow-hidden">
                              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/80"></div>
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  {teach.photo ? (
                                    <img src={teach.photo} alt={teach.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 shrink-0" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-black text-primary text-sm shrink-0">
                                      {teach.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <strong className="block text-[13px] text-foreground font-black tracking-wide leading-tight">{teach.name}</strong>
                                    <span className="px-1.5 py-[1px] rounded bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest inline-block mt-0.5">{teach.role || 'Teacher'}</span>
                                  </div>
                                </div>
                                <span className="text-[9px] bg-emerald-500/10 text-emerald-500 font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">{teach.status || 'Active'}</span>
                              </div>
                              
                              <div className="space-y-1.5 text-[10px] text-foreground/70 mt-3 bg-muted/40 p-3 rounded-xl border border-border/50">
                                <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                                  <span className="font-bold uppercase tracking-wider opacity-60">Department</span>
                                  <span className="font-bold text-foreground/90">{teach.subject || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                                  <span className="font-bold uppercase tracking-wider opacity-60">Contact</span>
                                  <span className="font-bold text-foreground/90">{teach.phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                                  <span className="font-bold uppercase tracking-wider opacity-60">Qualification</span>
                                  <span className="font-bold text-foreground/90">{teach.qualification || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1 mt-1">
                                  <span className="font-black uppercase tracking-wider text-primary">Salary</span>
                                  <span className="font-black text-primary text-[11px] bg-primary/10 px-2 py-0.5 rounded">PKR {teach.salary ? Number(teach.salary).toLocaleString() : '0'}</span>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex gap-2">
                                <button 
                                  onClick={() => setSelectedDetailedTeacher(teach)}
                                  className="flex-1 py-1.5 bg-muted hover:bg-border text-foreground font-bold text-[10px] rounded-lg transition-colors border border-border"
                                >
                                  View Full Profile
                                </button>
                              </div>
                            </div>
                          )) : (
                            <div className="col-span-full p-8 text-center border border-dashed border-border rounded-xl text-xs text-foreground/50">
                              No staff records found. Add employees to view them here.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recruitment Sub-view */}
                  {activeFeature === 'Recruitment' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Job vacancy opening posted successfully!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Post New Job Vacancy</span>
                          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2">
                            <select defaultValue="" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold outline-none focus:border-primary" required>
  <option value="" disabled>Job Title</option>
  <option value="Class Teacher">Class Teacher</option>
  <option value="Subject Specialist">Subject Specialist</option>
  <option value="Physical Training Instructor (PTI)">Physical Training Instructor (PTI)</option>
  <option value="Librarian">Librarian</option>
  <option value="Admin Staff">Admin Staff</option>
  <option value="Accounts Staff">Accounts Staff</option>
  <option value="Support Staff">Support Staff</option>
</select>
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
                          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
                      </div>
                    </div>
                  )}

                  {/* Payroll Coordination Sub-view */}
                  {activeFeature === 'Payroll Coordination' && (
                    <div className="space-y-3">
                      {isEditor && (
                        <form onSubmit={(e) => { e.preventDefault(); alert('Monthly payroll disbursement initiated!'); }} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                          <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Disburse Monthly Pay Slip</span>
                          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ACADEMIC MARKS & EXAM GRADES */}
              {['Marks Sheet', 'Exams Results', 'Exam Grades', 'Academic Oversight', 'Academic Monitoring'].includes(activeFeature || '') && (
                <div className="space-y-4">
                  {/* Beautiful Result Card Widget */}
                  <div className="p-6 bg-card border border-border rounded-2xl space-y-4 shadow-xl text-card-foreground">
                    
                    {/* Header: Logo & Title */}
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div className="flex items-center gap-3">
                        {/* Shield Badge Logo Icon */}
                        {currentSchool?.logoUrl ? (
                          <div className="flex items-center justify-center w-12 h-12">
                            <img src={currentSchool.logoUrl} className="w-12 h-12 object-contain" alt="School Logo" />
                          </div>
                        ) : (
                          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 flex items-center justify-center w-12 h-12">
                            <GraduationCap className="w-8 h-8" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-base font-black text-foreground tracking-wide uppercase leading-none">
                            {currentSchool?.schoolName || 'Dar-e-Arqam School'}
                          </h4>
                          <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mt-1">
                            {currentSchool?.city ? `Campus ${currentSchool.city}` : 'Campus Lahore'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-none">STUDENT PROGRESS CARD</h3>
                        <span className="text-sm font-black text-primary dark:text-purple-400 uppercase tracking-widest leading-tight block mt-0.5">& TRANSCRIPT</span>
                        <div className="flex flex-col items-end gap-1 mt-1">
                          {isEditor && (
                            <select 
                              value={examStatus} 
                              onChange={(e) => setExamStatus(e.target.value as 'Upcoming' | 'Conducted')}
                              className="bg-card border border-border text-[9px] font-bold rounded px-1.5 py-0.5 text-muted-foreground outline-none cursor-pointer"
                            >
                              <option value="Upcoming">Exam Status: Due / Pending</option>
                              <option value="Conducted">Exam Status: Conducted</option>
                            </select>
                          )}
                          <span className="text-[9px] text-muted-foreground/80 font-semibold">Date of Issue: 15 June 2026</span>
                        </div>
                      </div>
                    </div>

                    {/* Student Metadata Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-3 bg-muted border border-border rounded-xl text-[10px] font-medium">
                      <div>
                        <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Student Name</span>
                        {isEditor ? (
                          <select 
                            value={activeStudentName}
                            onChange={(e) => setSelectedReportStudent(e.target.value)}
                            className="bg-card border border-border rounded text-foreground font-black text-xs px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary w-full"
                          >
                            {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                          </select>
                        ) : (
                          <span className="text-foreground font-black text-xs">{activeStudentName}</span>
                        )}
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Admission ID</span>
                        <span className="text-foreground font-mono text-xs">
                          {`ADM-2026-${(activeStudent?.id || '1').padStart(3, '0')}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Class Group</span>
                        <span className="text-foreground font-bold text-xs">
                          {activeStudent?.className || 'Grade 10 Science'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Roll Number</span>
                        <span className="text-foreground font-mono text-xs">
                          {activeStudent?.roll || '45'}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Expanded Subjects Table */}
                    <div className="w-full overflow-x-auto pb-2"><table className="w-full text-xs text-left border-collapse mt-2">
                      <thead>
                        <tr className="text-muted-foreground font-bold border-b border-border bg-muted/40 text-[9px] uppercase tracking-wider">
                          <th className="p-2.5">Subject Course</th>
                          <th className="p-2.5 text-center">Midterm Grade</th>
                          <th className="p-2.5 text-center">Marks Obtained</th>
                          <th className="p-2.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground/80 font-medium">
                        {getStudentGrades(activeStudentName).map((g, idx) => (
                          <tr key={idx} className="hover:bg-muted/30">
                            <td className="p-2.5 font-bold text-foreground">{g.subject}</td>
                            <td className="p-2.5 text-center">
                              {examStatus === 'Upcoming' ? (
                                <span className="text-muted-foreground/50 font-medium">-</span>
                              ) : isEditor ? (
                                <select
                                  value={g.grade}
                                  onChange={(e) => {
                                    const newGrade = e.target.value;
                                    setStudentGrades(prev => {
                                      const current = getStudentGrades(activeStudentName);
                                      const updated = current.map((item, i) => i === idx ? { ...item, grade: newGrade } : item);
                                      return { ...prev, [activeStudentName]: updated };
                                    });
                                  }}
                                  className="bg-card border border-border rounded text-center text-xs p-1 font-black text-primary dark:text-purple-400 focus:outline-none"
                                >
                                  {['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'].map(gr => <option key={gr} value={gr}>{gr}</option>)}
                                </select>
                              ) : (
                                <span className="font-black text-primary dark:text-purple-400">{g.grade}</span>
                              )}
                            </td>
                            <td className="p-2.5 text-center font-mono">
                              {examStatus === 'Upcoming' ? (
                                <span className="text-muted-foreground/50 italic">Pending</span>
                              ) : isEditor ? (
                                <div className="flex items-center justify-center gap-1">
                                  <input 
                                    type="number" 
                                    value={g.marks} 
                                    onChange={(e) => {
                                      const newMarks = parseFloat(e.target.value) || 0;
                                      let newGrade = 'F';
                                      if (newMarks >= 90) newGrade = 'A';
                                      else if (newMarks >= 80) newGrade = 'B+';
                                      else if (newMarks >= 70) newGrade = 'B';
                                      else if (newMarks >= 60) newGrade = 'C+';
                                      else if (newMarks >= 50) newGrade = 'C';
                                      const newStatus = newMarks >= 50 ? 'Pass' : 'Fail';
                                      
                                      setStudentGrades(prev => {
                                        const current = getStudentGrades(activeStudentName);
                                        const updated = current.map((item, i) => i === idx ? { ...item, marks: newMarks, grade: newGrade, status: newStatus } : item);
                                        return { ...prev, [activeStudentName]: updated };
                                      });
                                    }}
                                    className="w-16 bg-card border border-border rounded text-center text-xs p-1"
                                    min="0"
                                    max={g.total}
                                  />
                                  <span>/ {g.total}</span>
                                </div>
                              ) : (
                                `${g.marks} / ${g.total}`
                              )}
                            </td>
                            <td className="p-2.5 text-right">
                              {examStatus === 'Upcoming' ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground">Due</span>
                              ) : isEditor ? (
                                <select
                                  value={g.status}
                                  onChange={(e) => {
                                    const newStatus = e.target.value;
                                    setStudentGrades(prev => {
                                      const current = getStudentGrades(activeStudentName);
                                      const updated = current.map((item, i) => i === idx ? { ...item, status: newStatus } : item);
                                      return { ...prev, [activeStudentName]: updated };
                                    });
                                  }}
                                  className="bg-card border border-border rounded text-xs p-1 font-bold focus:outline-none"
                                >
                                  <option value="Pass">Pass</option>
                                  <option value="Fail">Fail</option>
                                </select>
                              ) : (
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                  g.status === 'Pass' 
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400'
                                }`}>
                                  {g.status}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table></div>

                    {/* Principal Remarks & Evaluation */}
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-1.5 text-[10px] leading-relaxed">
                      <span className="block font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-[8px]">Principal Remarks & Evaluation</span>
                      <p className="text-foreground/90 font-medium">
                        {activeStudentName} is an exceptionally hard-working and dedicated student. They have shown remarkable progress across all science subjects this term. Their analytical skills and attention to detail are commendable. Continued focus will ensure future success.
                      </p>
                    </div>

                    {/* Signatures & Seal Row */}
                    <div className="flex justify-between items-center pt-3 border-t border-border mt-2 text-[9px] font-bold text-muted-foreground text-center">
                      <div className="w-24 space-y-1">
                        <span className="block font-mono text-foreground italic text-[11px]">Signature</span>
                        <div className="h-0.5 bg-border w-full"></div>
                        <span className="block text-[7px] uppercase tracking-wider text-muted-foreground/80">Class Teacher</span>
                      </div>
                      
                      {/* Premium Gold Stamp Seal */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 border border-amber-300 shadow-md flex items-center justify-center font-black text-amber-950 text-[8px] tracking-tight relative overflow-hidden">
                          <span className="absolute inset-0 bg-white/10 rotate-45 transform origin-top-left"></span>
                          SEAL
                        </div>
                        <span className="text-[7px] uppercase tracking-widest text-amber-600 dark:text-amber-400 mt-1 font-black">Official Verification</span>
                      </div>
                      
                      <div className="w-24 space-y-1">
                        <span className="block font-mono text-foreground italic text-[11px]">Principal</span>
                        <div className="h-0.5 bg-border w-full"></div>
                        <span className="block text-[7px] uppercase tracking-wider text-muted-foreground/80">Principal Seal</span>
                      </div>
                    </div>

                  </div>

                  {/* Marks input form */}
                  {isEditor && (
                    <form 
                      onSubmit={(e) => { 
                        e.preventDefault(); 
                        const formData = new FormData(e.currentTarget);
                        const studentName = formData.get('student_name') as string;
                        const subject = formData.get('subject') as string;
                        const marks = parseFloat(formData.get('marks') as string) || 0;
                        
                        let grade = 'F';
                        if (marks >= 90) grade = 'A';
                        else if (marks >= 80) grade = 'B+';
                        else if (marks >= 70) grade = 'B';
                        else if (marks >= 60) grade = 'C+';
                        else if (marks >= 50) grade = 'C';
                        
                        const status = marks >= 50 ? 'Pass' : 'Fail';
                        
                        setStudentGrades(prev => {
                          const current = getStudentGrades(studentName);
                          const existsIdx = current.findIndex(g => g.subject.toLowerCase() === subject.toLowerCase());
                          let updated;
                          if (existsIdx > -1) {
                            updated = current.map((item, idx) => idx === existsIdx ? { ...item, marks, grade, status } : item);
                          } else {
                            updated = [...current, { subject, grade, marks, total: 100, status }];
                          }
                          return { ...prev, [studentName]: updated };
                        });
                        alert(`Grades for ${studentName} updated successfully!`);
                        e.currentTarget.reset();
                      }} 
                      className="p-4 bg-muted/30 border border-border rounded-xl space-y-3 pb-4"
                    >
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Log Midterm Grades & Marks</span>
                      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <select name="student_name" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                          {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                        <select name="subject" defaultValue="" className="modern-input" required>
  <option value="" disabled>Subject</option>
  <option value="Mathematics">Mathematics</option>
  <option value="Physics">Physics</option>
  <option value="Chemistry">Chemistry</option>
  <option value="Biology">Biology</option>
  <option value="Computer Science">Computer Science</option>
  <option value="English">English</option>
  <option value="Urdu / Local Language">Urdu / Local Language</option>
  <option value="History / Geography">History / Geography</option>
  <option value="Islamic Studies / Ethics">Islamic Studies / Ethics</option>
  <option value="Physical Education">Physical Education</option>
</select>
                        <input name="marks" type="number" placeholder="Marks % (e.g. 85)" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                      </div>
                      <div className="flex justify-center gap-2.5 pt-2 pb-1">
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
                    {currentSchool?.logoUrl && (
                      <img 
                        src={currentSchool.logoUrl} 
                        alt="School Logo" 
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <div>
                      <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">
                        {currentSchool?.schoolName || 'Academic Hub Partner School'}
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
                      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-3 mt-2">
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-[11px] min-w-[850px] table-fixed">
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
                        </table></div>
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
                      {assignments.filter(a => !(['student', 'parent'].includes(simulatedRole)) || a.publishDate <= todayStr).length === 0 ? (
                        <p className="text-xs text-foreground/60 text-center py-4">No assignments published yet.</p>
                      ) : (
                        assignments
                          .filter(a => !(['student', 'parent'].includes(simulatedRole)) || a.publishDate <= todayStr)
                          .map((ass) => {
                             const isCompleted = completedAssignments.includes(ass.id);
                             const isDueSoon = ass.dueDate >= todayStr && ass.dueDate <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] && !isCompleted;
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
                          href={`/${material.file}`}
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
                      
                      const finalAction = newDisciplineAction === 'Suspension Recommended' 
                        ? 'Suspension Recommended (Pending Approval)' 
                        : newDisciplineAction;

                      setDisciplines(prev => [
                        ...prev,
                        {
                          id: `d-${Date.now()}`,
                          name: newDisciplineStudent,
                          date: new Date().toISOString().split('T')[0],
                          infraction: newDisciplineInfraction,
                          action: finalAction
                        }
                      ]);

                      if (newDisciplineAction === 'Suspension Recommended') {
                        setPrincipalNotifications(prev => [
                          ...prev,
                          `Major Action Required: VP recommended suspension for student ${newDisciplineStudent} due to ${newDisciplineInfraction}.`
                        ]);
                      } else {
                        setPrincipalNotifications(prev => [
                          ...prev,
                          `Notification: VP logged behavior warning for ${newDisciplineStudent} (${newDisciplineInfraction}).`
                        ]);
                      }

                      setNewDisciplineInfraction('');
                    }}
                    className="p-4 bg-muted/30 border border-border rounded-xl space-y-3"
                  >
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Log Student Conduct Incident</span>
                    <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <select 
                        value={newDisciplineStudent}
                        onChange={(e) => setNewDisciplineStudent(e.target.value)}
                        className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold"
                      >
                        {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                        <select 
                        required 
                        value={newDisciplineInfraction}
                        onChange={(e) => setNewDisciplineInfraction(e.target.value)}
                        className="modern-input w-full"
                      >
                        <option value="" disabled>Select Incident Type</option>
                        <option value="Late Arrival">Late Arrival</option>
                        <option value="Uniform/Dress Code Violation">Uniform/Dress Code Violation</option>
                        <option value="Disruptive Behavior in Class">Disruptive Behavior in Class</option>
                        <option value="Bullying / Harassment">Bullying / Harassment</option>
                        <option value="Cheating / Academic Dishonesty">Cheating / Academic Dishonesty</option>
                        <option value="Use of Mobile Phone">Use of Mobile Phone</option>
                        <option value="Skipping Class / Bunking">Skipping Class / Bunking</option>
                        <option value="Incomplete Homework / Assignment">Incomplete Homework / Assignment</option>
                        <option value="Vandalism / Property Damage">Vandalism / Property Damage</option>
                        <option value="Other">Other</option>
                      </select>
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
                      <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md cursor-pointer">
                        + Add Behavior Report
                      </button>
                    </div>
                  </form>

                  {/* Incident List */}
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    <span className="block text-xs font-bold text-foreground/70 uppercase tracking-wider">Conduct Log Entries</span>
                    {disciplines.map((d) => (
                      <div key={d.id} className="p-3 bg-card border border-border rounded-xl flex items-center justify-between gap-3 hover:border-primary/30 transition-all">
                        <div className="flex-1">
                          <strong className="block text-xs text-foreground font-bold">{d.name}</strong>
                          <span className="text-[10px] text-foreground/60 block">{d.infraction}</span>
                          <span className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded border ${
                            d.action.includes('Suspension') 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' 
                              : 'bg-primary/10 text-primary border-primary/20'
                          }`}>
                            {d.action}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {d.action === "Suspension Recommended (Pending Approval)" && simulatedRole === "admin" && (
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setDisciplines((prev: any[]) => prev.map(item => item.id === d.id ? { ...item, action: "Suspended (Approved)" } : item));
                                  setPrincipalNotifications((prev: string[]) => [
                                    ...prev,
                                    `Action: Approved suspension for ${d.name}.`
                                  ]);
                                }}
                                className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[9px] rounded transition-colors shadow-sm"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDisciplines((prev: any[]) => prev.map(item => item.id === d.id ? { ...item, action: "Warning Issued (Downgraded)" } : item));
                                  setPrincipalNotifications((prev: string[]) => [
                                    ...prev,
                                    `Action: Downgraded suspension proposal for ${d.name} to Warning.`
                                  ]);
                                }}
                                className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white font-bold text-[9px] rounded transition-colors shadow-sm"
                              >
                                Downgrade
                              </button>
                            </div>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono">{d.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PARENT COMMUNICATIONS */}
              {(activeFeature === 'Parent Communication Center' || activeFeature === 'Parent Communications' || activeFeature === 'Parent Communication' || activeFeature === 'Teacher Communication') && (
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
                        ? `Parent of ${activeStudentName} (${currentUser?.name || 'M. Shah'})` 
                        : `Broadcast (re: ${newParentMessageStudent || (students[0]?.name || '')})`;
                      
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
                    <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <select 
                        value={newParentMessageStudent || (students[0]?.name || '')}
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
                      <select 
                        required 
                        value={newParentMessageSubject}
                        onChange={(e) => setNewParentMessageSubject(e.target.value)}
                        className="modern-input"
                      >
                        <option value="" disabled>Select Subject</option>
                        {simulatedRole === 'parent' ? (
                          <>
                            <option value="Sick Leave / Absence Request">Sick Leave / Absence Request</option>
                            <option value="Fee Related Query">Fee Related Query</option>
                            <option value="Academic Progress Query">Academic Progress Query</option>
                            <option value="Meeting Request with Teacher">Meeting Request with Teacher</option>
                            <option value="Event / Activity Query">Event / Activity Query</option>
                            <option value="Other">Other</option>
                          </>
                        ) : (
                          <>
                            <option value="Fee Reminder / Dues">Fee Reminder / Dues</option>
                            <option value="Academic Performance / Grades">Academic Performance / Grades</option>
                            <option value="Student Attendance / Absence">Student Attendance / Absence</option>
                            <option value="Behavior / Conduct Issue">Behavior / Conduct Issue</option>
                            <option value="Parent-Teacher Meeting (PTM)">Parent-Teacher Meeting (PTM)</option>
                            <option value="School Event / Activity">School Event / Activity</option>
                            <option value="Health / Medical Update">Health / Medical Update</option>
                            <option value="General Announcement">General Announcement</option>
                            <option value="Holiday / Vacation Notice">Holiday / Vacation Notice</option>
                            <option value="Other">Other</option>
                          </>
                        )}
                      </select>
                      <select 
                        name="deliveryChannel"
                        className="bg-card border border-border rounded-lg text-xs p-2 text-foreground font-semibold"
                      >
                        <option value="WhatsApp Message">📱 WhatsApp Message</option>
                        <option value="App Inbox">🔔 App Inbox</option>
                        <option value="SMS Text Message">💬 SMS Text Message</option>
                        <option value="Email">📧 Email</option>
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
              {['Country Management', 'Organization Management', 'School Management', 'Subscription Plans', 'Revenue Analytics', 'White Label Configuration', 'Support Tickets', 'Audit Logs', 'Multi-Level Permissions', 'Advanced Activity Monitoring', 'School Health Monitoring', 'Server Monitoring', 'Backup Manager', 'Firebase Database Settings', 'API Key Management', 'SMS Gateway Settings', 'Email Server Settings', 'School Suspension System', 'School Performance Analytics', 'Fraud Detection Dashboard', 'Global Announcements'].includes(activeFeature || '') && (
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
                        <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <input value={newCountryName} onChange={(e) => {
                            const val = e.target.value;
                            setNewCountryName(val);
                            let autoCode = val.replace(/[^A-Za-z]/g, '').substring(0, 2).toUpperCase();
                            if (val.toLowerCase().includes('united states')) autoCode = 'US';
                            if (val.toLowerCase().includes('united kingdom')) autoCode = 'UK';
                            if (val.toLowerCase().includes('arab emirates')) autoCode = 'AE';
                            if (val.toLowerCase().includes('saudi arabia')) autoCode = 'SA';
                            setNewCountryCode(autoCode);
                          }} type="text" placeholder="Country Name (e.g. Canada)" className="modern-input w-full" required />
                          <input value={newCountryCode} onChange={(e) => setNewCountryCode(e.target.value.toUpperCase())} type="text" placeholder="ISO Code (e.g. CA)" className="modern-input w-full" maxLength={3} required />
                          <select value={newCountryCurrency} onChange={(e) => setNewCountryCurrency(e.target.value)} className="modern-input">
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
                        <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-3">Organization Chain</th>
                              <th className="p-3">Director</th>
                              <th className="p-3 text-center">Branches</th>
                              <th className="p-3 text-right">Status</th>
<th className="p-3 text-right">Actions</th>
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
                        </table></div>
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
                        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-3">
                          <input value={newSchoolName} onChange={(e) => {
                            const val = e.target.value;
                            setNewSchoolName(val);
                            setNewSchoolSubdomain(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
                          }} type="text" placeholder="School Name (e.g. Allied School Campus A)" className="modern-input w-full" required />
                          <div className="flex items-center gap-1 modern-input w-full px-2 py-0">
                            <input value={newSchoolSubdomain} onChange={(e) => setNewSchoolSubdomain(e.target.value)} type="text" placeholder="subdomain" className="bg-transparent text-xs py-2.5 w-full text-foreground outline-none font-semibold" required />
                            <span className="text-[10px] text-foreground/50 font-semibold whitespace-nowrap">.academichub.com</span>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md">
                            Provision Campus Subdomain
                          </button>
                        </div>
                      </form>

                      <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-3">Campus Branch</th>
                              <th className="p-3">Access Domain</th>
                              <th className="p-3 text-right">RLS Tenant Status</th>
<th className="p-3 text-right">Actions</th>
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
                        </table></div>
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
                        <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <input value={newPlanName} onChange={(e) => setNewPlanName(e.target.value)} type="text" placeholder="Plan Title" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                          <input value={newPlanPrice} onChange={(e) => setNewPlanPrice(e.target.value)} type="number" placeholder="Price (USD)" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                          <select value={newPlanBilling} onChange={(e) => setNewPlanBilling(e.target.value)} className="modern-input">
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

                      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-foreground/60 font-bold uppercase block">Custom Domain Pointer</label>
                            <input value={dnsInput} onChange={(e) => setDnsInput(e.target.value)} type="text" placeholder="portal.yourschool.com" className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-foreground/60 font-bold uppercase block">Primary HSL Custom Color</label>
                            <select 
                              value={whiteLabelConfig.primaryColor}
                              onChange={(e) => setWhiteLabelConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                              className="w-full modern-input"
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
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
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                        </table></div>
                      </div>
                    </div>
                  )}

                  {/* Super Admin Advanced Feature 1: Multi-Level Permissions */}
                  {activeFeature === 'Multi-Level Permissions' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        🔒 Define Global Role Permissions. Grant or revoke CRUD access for systemic modules across all connected tenant portals.
                      </div>
                      <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[600px]">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-3">Portal Role</th>
                              <th className="p-3 text-center">Create</th>
                              <th className="p-3 text-center">Read</th>
                              <th className="p-3 text-center">Update</th>
                              <th className="p-3 text-center">Delete</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            {['Admin', 'Teacher', 'HR', 'Accountant', 'Reception', 'Student'].map((role) => (
                              <tr key={role} className="hover:bg-muted/10">
                                <td className="p-3 font-bold text-primary">{role}</td>
                                {['create', 'read', 'update', 'delete'].map(perm => (
                                  <td key={perm} className="p-3 text-center">
                                    <input type="checkbox" defaultChecked={role === 'Admin' || (role !== 'Student' && perm === 'read')} className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary/30 cursor-pointer" />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table></div>
                      </div>
                      <button onClick={() => alert('Multi-Level Permissions updated successfully!')} className="w-full sm:w-auto px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-lg shadow hover:bg-primary/90 transition-all flex items-center justify-center gap-2">Save Matrix Configuration</button>
                    </div>
                  )}

                  {/* Super Admin Advanced Feature 2: Advanced Activity Monitoring */}
                  {activeFeature === 'Advanced Activity Monitoring' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        📡 Global Activity Stream. Monitor every authenticated session, endpoint interaction, and geolocation IP.
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                        <input type="text" placeholder="Filter User/Email..." className="bg-card border border-border rounded-lg text-xs p-2 text-foreground w-full" />
                        <select className="bg-card border border-border rounded-lg text-xs p-2 text-foreground w-full cursor-pointer">
                          <option value="All">All Severities</option>
                          <option value="Critical">Critical Alerts</option>
                          <option value="Warning">Warnings</option>
                        </select>
                        <input type="date" className="bg-card border border-border rounded-lg text-xs p-2 text-foreground w-full" />
                      </div>
                      <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[700px]">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-3">Event Time</th>
                              <th className="p-3">IP Address</th>
                              <th className="p-3">Identity</th>
                              <th className="p-3">Event Detail</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85 font-mono text-[10px]">
                            <tr className="hover:bg-muted/10"><td className="p-3 text-foreground/50">2026-06-13 14:02:11</td><td className="p-3">192.168.1.14</td><td className="p-3 font-bold text-primary">superadmin</td><td className="p-3 text-emerald-400">Auth Token Generated [SUCCESS]</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-3 text-foreground/50">2026-06-13 13:45:00</td><td className="p-3">10.4.5.21</td><td className="p-3 font-bold text-primary">sys_cron</td><td className="p-3 text-blue-400">Database Auto-Vacuum [COMPLETED]</td></tr>
                            <tr className="hover:bg-muted/10"><td className="p-3 text-foreground/50">2026-06-13 11:22:45</td><td className="p-3">45.22.11.9</td><td className="p-3 font-bold text-rose-400">unknown_agent</td><td className="p-3 text-rose-400">Rate Limit Exceeded (Login API) [BLOCKED]</td></tr>
                          </tbody>
                        </table></div>
                      </div>
                    </div>
                  )}

                  {/* Super Admin Advanced Feature 3: School Health Monitoring */}
                  {activeFeature === 'School Health Monitoring' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        🏥 Multi-Tenant Health Dashboard. Live metrics for API latency and sync status across all connected school branches.
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { name: 'Allied School Campus A', latency: '24ms', load: '14%', status: 'Optimal' },
                          { name: 'Beaconhouse UK Branch', latency: '112ms', load: '65%', status: 'Warning' },
                          { name: 'The Educators Lahore', latency: '45ms', load: '32%', status: 'Optimal' },
                          { name: 'Roots International', latency: '28ms', load: '19%', status: 'Optimal' }
                        ].map((school, i) => (
                          <div key={i} className="p-4 bg-card border border-border rounded-xl space-y-3 shadow-sm hover:border-primary/40 transition-all cursor-pointer group">
                            <div className="flex justify-between items-center border-b border-border/50 pb-2">
                              <span className="font-bold text-foreground text-xs group-hover:text-primary transition-colors">{school.name}</span>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${school.status === 'Optimal' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>{school.status}</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-foreground/70">
                              <span>API Latency: <strong className="text-foreground">{school.latency}</strong></span>
                              <span>DB Load: <strong className="text-foreground">{school.load}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Super Admin Advanced Feature 4: Server Monitoring */}
                  {activeFeature === 'Server Monitoring' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        🖥️ Bare-Metal Server & Docker Monitoring. Live visualization of hardware resource consumption.
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-5 bg-card border border-border rounded-xl space-y-5 shadow-sm">
                          <div className="space-y-2.5">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-foreground/80 flex items-center gap-1.5"><Activity size={14} className="text-amber-400"/> CPU Utilization (8 Cores)</span>
                              <span className="text-amber-400">42%</span>
                            </div>
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden border border-border/50">
                              <div className="h-full bg-amber-400 transition-all duration-1000 w-[42%] shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                            </div>
                          </div>
                          <div className="space-y-2.5">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-foreground/80 flex items-center gap-1.5"><Server size={14} className="text-emerald-400"/> RAM Allocation (32GB)</span>
                              <span className="text-emerald-400">18.5GB / 57%</span>
                            </div>
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden border border-border/50">
                              <div className="h-full bg-emerald-400 transition-all duration-1000 w-[57%] shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                            </div>
                          </div>
                          <div className="space-y-2.5">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-foreground/80 flex items-center gap-1.5"><Database size={14} className="text-blue-400"/> NVMe Storage (Global)</span>
                              <span className="text-blue-400">140GB / 500GB (28%)</span>
                            </div>
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden border border-border/50">
                              <div className="h-full bg-blue-400 transition-all duration-1000 w-[28%] shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Super Admin Advanced Feature 5: Backup Manager */}
                  {activeFeature === 'Backup Manager' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        💾 Automated & Manual Postgres Backups. Ensure data redundancy across all tenant schemas.
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-xl">
                        <div className="space-y-1 w-full sm:w-auto text-center sm:text-left">
                          <span className="block text-xs font-bold text-primary">Production Database (ACADEMICHUB_DB)</span>
                          <span className="block text-[10px] text-foreground/60">Next automated backup scheduled in 14 hours.</span>
                        </div>
                        <button onClick={() => alert('Manual SQL Dump Triggered! Backend process started.')} className="w-full sm:w-auto px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-lg shadow hover:bg-primary/90 transition-all whitespace-nowrap">Trigger Manual Backup</button>
                      </div>
                      <div className="border border-border rounded-xl bg-card overflow-hidden mt-4">
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[500px]">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-3">Backup ID</th>
                              <th className="p-3">Type</th>
                              <th className="p-3">Size</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10">
                              <td className="p-3 font-mono text-primary font-bold">bck_20260613_auto</td>
                              <td className="p-3"><span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20 text-[9px] uppercase tracking-wider font-bold">Automated</span></td>
                              <td className="p-3 text-foreground/60">42.8 MB</td>
                              <td className="p-3 text-right space-x-3">
                                <button className="text-xs font-bold text-foreground/60 hover:text-primary transition-colors">Download</button>
                                <button className="text-xs font-bold text-foreground/60 hover:text-rose-400 transition-colors">Restore</button>
                              </td>
                            </tr>
                            <tr className="hover:bg-muted/10">
                              <td className="p-3 font-mono text-primary font-bold">bck_20260612_manual</td>
                              <td className="p-3"><span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/20 text-[9px] uppercase tracking-wider font-bold">Manual</span></td>
                              <td className="p-3 text-foreground/60">41.2 MB</td>
                              <td className="p-3 text-right space-x-3">
                                <button className="text-xs font-bold text-foreground/60 hover:text-primary transition-colors">Download</button>
                                <button className="text-xs font-bold text-foreground/60 hover:text-rose-400 transition-colors">Restore</button>
                              </td>
                            </tr>
                          </tbody>
                        </table></div>
                      </div>
                    </div>
                  )}

                  
                  {/* Super Admin Advanced Feature: Firebase Database Settings */}
                  {activeFeature === 'Firebase Database Settings' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        ?? Live Database Linkage: Update your Firebase API keys to switch the backend data sink. Note that any data added/updated anywhere in the system is automatically synced to the active Firebase database in real-time.
                      </div>
                      <form onSubmit={handleSaveFirebaseConfig} className="bg-card/50 border border-border p-4 rounded-xl space-y-4">
                        <h4 className="text-sm font-bold text-foreground">Custom Firebase Configuration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">API Key</label>
                            <input type="text" required value={firebaseApiKey} onChange={(e) => setFirebaseApiKey(e.target.value)} className="w-full bg-muted border border-border rounded-lg text-xs p-2.5" placeholder="AIzaSy..." />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">Auth Domain</label>
                            <input type="text" value={firebaseAuthDomain} onChange={(e) => setFirebaseAuthDomain(e.target.value)} className="w-full bg-muted border border-border rounded-lg text-xs p-2.5" placeholder="project-id.firebaseapp.com" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">Database URL</label>
                            <input type="url" value={firebaseDbUrl} onChange={(e) => setFirebaseDbUrl(e.target.value)} className="w-full bg-muted border border-border rounded-lg text-xs p-2.5" placeholder="https://project-id.firebaseio.com" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">Project ID</label>
                            <input type="text" value={firebaseProjectId} onChange={(e) => setFirebaseProjectId(e.target.value)} className="w-full bg-muted border border-border rounded-lg text-xs p-2.5" placeholder="project-id" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">Storage Bucket</label>
                            <input type="text" value={firebaseStorageBucket} onChange={(e) => setFirebaseStorageBucket(e.target.value)} className="w-full bg-muted border border-border rounded-lg text-xs p-2.5" placeholder="project-id.appspot.com" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">Messaging Sender ID</label>
                            <input type="text" value={firebaseMessagingId} onChange={(e) => setFirebaseMessagingId(e.target.value)} className="w-full bg-muted border border-border rounded-lg text-xs p-2.5" placeholder="123456789" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">App ID</label>
                            <input type="text" value={firebaseAppId} onChange={(e) => setFirebaseAppId(e.target.value)} className="w-full bg-muted border border-border rounded-lg text-xs p-2.5" placeholder="1:123456:web:abcd" />
                          </div>
                        </div>
                        <div className="flex justify-end pt-2 border-t border-border/50">
                          <button type="submit" className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow hover:bg-primary/90 transition-all">
                            Save Database Config & Reload
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Super Admin Advanced Feature 6: API Key Management */}
                  {activeFeature === 'API Key Management' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        🔑 Generate and revoke secure API keys for 3rd-party integrations (Biometric Devices, Accounts Software, etc.).
                      </div>
                      <div className="flex justify-end mb-4">
                         <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow hover:bg-primary/90 transition-all flex items-center gap-2">
                           <Key size={14} /> Generate New Key
                         </button>
                      </div>
                      <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[600px]">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-3">Application Name</th>
                              <th className="p-3">API Key (Masked)</th>
                              <th className="p-3">Created Date</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10">
                              <td className="p-3 font-bold text-primary">ZK Teco Biometrics Sync</td>
                              <td className="p-3 font-mono text-foreground/60">sk_live_****************a49b</td>
                              <td className="p-3 text-foreground/60">2026-05-10</td>
                              <td className="p-3 text-right"><button className="text-xs font-bold text-rose-400 hover:text-rose-500 transition-colors">Revoke</button></td>
                            </tr>
                            <tr className="hover:bg-muted/10">
                              <td className="p-3 font-bold text-primary">QuickBooks Finance API</td>
                              <td className="p-3 font-mono text-foreground/60">sk_live_****************8f2c</td>
                              <td className="p-3 text-foreground/60">2026-06-01</td>
                              <td className="p-3 text-right"><button className="text-xs font-bold text-rose-400 hover:text-rose-500 transition-colors">Revoke</button></td>
                            </tr>
                          </tbody>
                        </table></div>
                      </div>
                    </div>
                  )}

                  {/* Super Admin Advanced Feature 7: SMS Gateway Settings */}
                  {activeFeature === 'SMS Gateway Settings' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        📱 Configure Global SMS Gateway providers (Twilio, Clickatell, Local PK Gateways).
                      </div>
                      <div className="p-5 bg-card border border-border rounded-xl space-y-4 shadow-sm max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-foreground/70 uppercase">Active Gateway</label>
                            <select className="bg-muted/30 border border-border rounded-lg text-xs p-2.5 w-full text-foreground cursor-pointer">
                              <option>Twilio Global API</option>
                              <option>Zong PK Business SMS</option>
                              <option>Custom Webhook</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-foreground/70 uppercase">Sender ID / Title</label>
                            <input type="text" defaultValue="ACADEMICHUB" className="bg-muted/30 border border-border rounded-lg text-xs p-2.5 w-full text-foreground" />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[11px] font-bold text-foreground/70 uppercase">API Key / Auth Token</label>
                            <input type="password" defaultValue="************************" className="bg-muted/30 border border-border rounded-lg text-xs p-2.5 w-full text-foreground" />
                          </div>
                        </div>
                        <div className="flex gap-3 justify-end pt-2">
                          <button onClick={() => alert('Test SMS sent successfully!')} className="px-4 py-2 bg-muted text-foreground border border-border text-xs font-bold rounded-lg shadow-sm hover:bg-muted/80 transition-all">Send Test SMS</button>
                          <button onClick={() => alert('SMS Settings saved!')} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow hover:bg-primary/90 transition-all">Save Settings</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Super Admin Advanced Feature 8: Email Server Settings */}
                  {activeFeature === 'Email Server Settings' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        📧 Global SMTP configuration for transactional emails (Invoices, Notifications, Alerts).
                      </div>
                      <div className="p-5 bg-card border border-border rounded-xl space-y-4 shadow-sm max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-foreground/70 uppercase">SMTP Host</label>
                            <input type="text" defaultValue="smtp.sendgrid.net" className="bg-muted/30 border border-border rounded-lg text-xs p-2.5 w-full text-foreground" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-foreground/70 uppercase">SMTP Port</label>
                            <input type="number" defaultValue="587" className="bg-muted/30 border border-border rounded-lg text-xs p-2.5 w-full text-foreground" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-foreground/70 uppercase">SMTP Username</label>
                            <input type="text" defaultValue="apikey" className="bg-muted/30 border border-border rounded-lg text-xs p-2.5 w-full text-foreground" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-foreground/70 uppercase">SMTP Password</label>
                            <input type="password" defaultValue="************************" className="bg-muted/30 border border-border rounded-lg text-xs p-2.5 w-full text-foreground" />
                          </div>
                          <div className="space-y-1 md:col-span-2 flex items-center gap-2 mt-2">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary cursor-pointer" />
                            <span className="text-xs font-bold text-foreground/80">Use TLS/SSL Encryption</span>
                          </div>
                        </div>
                        <div className="flex gap-3 justify-end pt-2 border-t border-border/50 mt-4">
                          <button onClick={() => alert('Email Server Configuration saved!')} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow hover:bg-primary/90 transition-all mt-4">Save Configuration</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Super Admin Advanced Feature 9: School Suspension System */}
                  {activeFeature === 'School Suspension System' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-500/90 font-bold leading-relaxed flex items-center gap-2">
                        <Ban size={16} /> Extreme Security Protocol. Suspending a school will instantly block all logins and API access for that tenant.
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { name: 'Allied School Campus A', status: 'Active' },
                          { name: 'Beaconhouse UK Branch', status: 'Active' },
                          { name: 'Defaulter School Lahore', status: 'Suspended' }
                        ].map((school, i) => (
                          <div key={i} className={`p-4 bg-card border ${school.status === 'Suspended' ? 'border-rose-500/50' : 'border-border'} rounded-xl space-y-3 shadow-sm flex items-center justify-between`}>
                            <div>
                              <span className="font-bold text-foreground text-xs block">{school.name}</span>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${school.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>{school.status}</span>
                            </div>
                            <button className={`px-4 py-2 text-white text-[11px] font-bold rounded-lg shadow transition-all ${school.status === 'Active' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                              {school.status === 'Active' ? 'Suspend School' : 'Revoke Suspension'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Super Admin Advanced Feature 10: School Performance Analytics */}
                  {activeFeature === 'School Performance Analytics' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        📊 Global cross-tenant analytical comparison of school growths, admissions, and financial health.
                      </div>
                      <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[700px]">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-3">School Tenant</th>
                              <th className="p-3 text-right">Total Students</th>
                              <th className="p-3 text-right">Avg Attendance</th>
                              <th className="p-3 text-right">Monthly Revenue</th>
                              <th className="p-3 text-right">Growth (YTD)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10">
                              <td className="p-3 font-bold text-primary">Allied School Campus A</td>
                              <td className="p-3 text-right font-mono">1,204</td>
                              <td className="p-3 text-right font-mono text-emerald-400">96.4%</td>
                              <td className="p-3 text-right font-mono">$12,400</td>
                              <td className="p-3 text-right font-mono text-emerald-400">+12%</td>
                            </tr>
                            <tr className="hover:bg-muted/10">
                              <td className="p-3 font-bold text-primary">Beaconhouse UK Branch</td>
                              <td className="p-3 text-right font-mono">850</td>
                              <td className="p-3 text-right font-mono text-amber-400">89.2%</td>
                              <td className="p-3 text-right font-mono">$28,500</td>
                              <td className="p-3 text-right font-mono text-emerald-400">+4%</td>
                            </tr>
                            <tr className="hover:bg-muted/10">
                              <td className="p-3 font-bold text-primary">The Educators Lahore</td>
                              <td className="p-3 text-right font-mono">3,400</td>
                              <td className="p-3 text-right font-mono text-emerald-400">92.1%</td>
                              <td className="p-3 text-right font-mono">$8,200</td>
                              <td className="p-3 text-right font-mono text-rose-400">-2%</td>
                            </tr>
                          </tbody>
                        </table></div>
                      </div>
                    </div>
                  )}

                  {/* Super Admin Advanced Feature 11: Fraud Detection Dashboard */}
                  {activeFeature === 'Fraud Detection Dashboard' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-500/90 font-bold leading-relaxed flex items-center gap-2">
                        <AlertOctagon size={16} /> AI Security AI is monitoring global activities for financial anomalies, IP mismatches, and rapid login failures.
                      </div>
                      <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[700px]">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-3">Detected Anomaly</th>
                              <th className="p-3">Tenant / User</th>
                              <th className="p-3">Severity</th>
                              <th className="p-3">Timestamp</th>
                              <th className="p-3 text-right">Action Taken</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            <tr className="hover:bg-muted/10 bg-rose-500/5">
                              <td className="p-3 font-bold text-rose-400">Unusual High Discount Approved (80%)</td>
                              <td className="p-3">Beaconhouse UK (acc_user_4)</td>
                              <td className="p-3"><span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded border border-rose-500/20 text-[9px] uppercase tracking-wider font-bold">Critical</span></td>
                              <td className="p-3 font-mono text-[10px] text-foreground/60">10 mins ago</td>
                              <td className="p-3 text-right"><button className="text-[10px] font-bold text-primary hover:underline">Investigate</button></td>
                            </tr>
                            <tr className="hover:bg-muted/10">
                              <td className="p-3 font-bold text-amber-400">7 Failed Login Attempts</td>
                              <td className="p-3">Allied School (admin_master)</td>
                              <td className="p-3"><span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 text-[9px] uppercase tracking-wider font-bold">Warning</span></td>
                              <td className="p-3 font-mono text-[10px] text-foreground/60">1 hour ago</td>
                              <td className="p-3 text-right"><button className="text-[10px] font-bold text-foreground/60">IP Blocked</button></td>
                            </tr>
                            <tr className="hover:bg-muted/10">
                              <td className="p-3 font-bold text-amber-400">Simultaneous logins from diff countries</td>
                              <td className="p-3">Educators (super_admin)</td>
                              <td className="p-3"><span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 text-[9px] uppercase tracking-wider font-bold">Warning</span></td>
                              <td className="p-3 font-mono text-[10px] text-foreground/60">3 hours ago</td>
                              <td className="p-3 text-right"><button className="text-[10px] font-bold text-primary hover:underline">Investigate</button></td>
                            </tr>
                          </tbody>
                        </table></div>
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
                          <select value={newAnnounceTitle} onChange={(e) => setNewAnnounceTitle(e.target.value)} className="w-full modern-input" required>
  <option value="" disabled>Notice Headline</option>
  <option value="Server Maintenance Window">Server Maintenance Window</option>
  <option value="School Holiday Announcement">School Holiday Announcement</option>
  <option value="Fee Submission Deadline">Fee Submission Deadline</option>
  <option value="Parent-Teacher Meeting (PTM)">Parent-Teacher Meeting (PTM)</option>
  <option value="Exam Schedule Published">Exam Schedule Published</option>
  <option value="Annual Sports Day">Annual Sports Day</option>
  <option value="Other Announcement">Other Announcement</option>
</select>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
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
                    <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <input type="text" placeholder="Parent Name" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                      <select defaultValue="" className="modern-input" required>
  <option value="" disabled>Child Grade</option>
  <option value="Pre-School">Pre-School</option>
  <option value="Kindergarten">Kindergarten</option>
  <option value="Grade 1">Grade 1</option>
  <option value="Grade 2">Grade 2</option>
  <option value="Grade 3">Grade 3</option>
  <option value="Grade 4">Grade 4</option>
  <option value="Grade 5">Grade 5</option>
  <option value="Grade 6">Grade 6</option>
  <option value="Grade 7">Grade 7</option>
  <option value="Grade 8">Grade 8</option>
  <option value="Grade 9">Grade 9</option>
  <option value="Grade 10">Grade 10</option>
  <option value="Grade 11">Grade 11</option>
  <option value="Grade 12">Grade 12</option>
</select>
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
                    <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                    </table></div>
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
                      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <select defaultValue="" className="modern-input" required>
  <option value="" disabled>Expense Category</option>
  <option value="Electricity Bill">Electricity Bill</option>
  <option value="Water Bill">Water Bill</option>
  <option value="Internet / Phone">Internet / Phone</option>
  <option value="Stationery">Stationery</option>
  <option value="Maintenance / Repairs">Maintenance / Repairs</option>
  <option value="Event Expenses">Event Expenses</option>
  <option value="Transport / Fuel">Transport / Fuel</option>
  <option value="Other">Other</option>
</select>
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
                    <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                    </table></div>
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
                      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <input type="text" placeholder="Staff Name" className="bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" required />
                        <select defaultValue="" className="modern-input" required>
  <option value="" disabled>Role</option>
  <option value="Teacher">Teacher</option>
  <option value="Admin">Admin</option>
  <option value="Accountant">Accountant</option>
  <option value="Principal">Principal</option>
  <option value="IT Support">IT Support</option>
  <option value="Librarian">Librarian</option>
  <option value="Support Staff">Support Staff</option>
  <option value="Other">Other</option>
</select>
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
                    <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                    </table></div>
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
                    <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-3">
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
                    <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs">
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
                    </table></div>
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
                            {currentSchool?.schoolName || "Central School"} Mobile App
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

                  <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Input configuration */}
                    <div className="p-5 bg-card border border-border rounded-2xl space-y-4">
                      <span className="block text-xs font-black text-foreground uppercase tracking-wider">Configure Post Details</span>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/75 uppercase tracking-wider">Campaign Target Topic</label>
                        <select 
                          value={studioCampaignType}
                          onChange={(e) => setStudioCampaignType(e.target.value)}
                          className="w-full modern-input"
                        >
                          <option value="admission">Admissions Open 2026-27</option>
                          <option value="sports">Annual Sports Day Announcement</option>
                          <option value="custom">Custom Prompt (Type Below)</option>
                        </select>
                      </div>

                      {studioCampaignType === 'custom' && (
                        <div className="space-y-1 animate-fadeIn">
                          <label className="text-[10px] font-bold text-foreground/75 uppercase tracking-wider">Custom Instructions</label>
                          <textarea
                            value={studioPrompt}
                            onChange={(e) => setStudioPrompt(e.target.value)}
                            placeholder="e.g. Write a post about our new science lab..."
                            className="w-full modern-input min-h-[80px] resize-none"
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/75 uppercase tracking-wider">Target Output Language</label>
                        <select 
                          value={studioLanguage}
                          onChange={(e) => setStudioLanguage(e.target.value)}
                          className="w-full modern-input"
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
                          className="w-full modern-input"
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
                          setTimeout(() => {
                            if (studioCampaignType === 'custom') {
                              setStudioGeneratedCaption(`[Draft based on prompt: "${studioPrompt}"]\n\nWe are excited to share some great news with our community! Stay tuned for more details.\n\n(Edit this text to refine your post)`);
                            } else {
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
                            }
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
                              <strong className="block text-white text-xs font-black">{currentSchool?.schoolName || 'Academic Hub School'}</strong>
                              <span className="text-[9px] text-slate-500 block">Sponsor Campaign</span>
                            </div>
                          </div>

                          {/* Body Caption */}
                          <textarea
                            value={studioGeneratedCaption}
                            onChange={(e) => setStudioGeneratedCaption(e.target.value)}
                            className="w-full text-xs text-slate-300 font-medium leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                            dir={['Urdu', 'Arabic'].includes(studioLanguage) ? 'rtl' : 'ltr'}
                          />

                          <p className="text-[10px] text-primary font-mono">{studioGeneratedHashtags}</p>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/80">
                            <button
                              type="button"
                              onClick={() => {
                                const newNotice = {
                                  id: `notice-${Date.now()}`,
                                  title: `AI Post: ${studioCampaignType}`,
                                  content: `${studioGeneratedCaption}\n\n${studioGeneratedHashtags}`,
                                  date: new Date().toISOString().split('T')[0],
                                  department: "Marketing"
                                };
                                setNotices((prev: any[]) => [newNotice, ...(prev || [])]);
                                setStudioSavedPosts(prev => [{ id: `post-${Date.now()}`, text: studioGeneratedCaption, hashtags: studioGeneratedHashtags, type: studioCampaignType, channel: studioChannel, date: new Date().toISOString().split('T')[0] }, ...prev]);
                                alert("Post saved and published to School Notices portal!");
                              }}
                              className="py-2 bg-primary hover:bg-primary/90 text-white rounded text-[10px] font-bold transition-all shadow-sm"
                            >
                              ✅ Publish to Portal
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(studioGeneratedCaption + '\n\n' + studioGeneratedHashtags)}`;
                                window.open(url, '_blank');
                              }}
                              className="py-2 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded text-[10px] font-bold transition-all shadow-sm"
                            >
                              🔵 Share on Facebook
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                try {
                                  const canvas = document.createElement('canvas');
                                  canvas.width = 1080;
                                  canvas.height = 1080;
                                  const ctx = canvas.getContext('2d');
                                  if (!ctx) throw new Error("Canvas 2D context not supported");

                                  const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
                                  gradient.addColorStop(0, '#1e293b');
                                  gradient.addColorStop(1, '#0f172a');
                                  ctx.fillStyle = gradient;
                                  ctx.fillRect(0, 0, 1080, 1080);

                                  ctx.fillStyle = '#6366f1';
                                  ctx.beginPath();
                                  ctx.arc(100, 100, 40, 0, Math.PI * 2);
                                  ctx.fill();
                                  
                                  ctx.fillStyle = '#ffffff';
                                  ctx.font = 'bold 36px sans-serif';
                                  ctx.fillText(currentSchool?.schoolName || 'Academic Hub School', 160, 110);
                                  ctx.font = '24px sans-serif';
                                  ctx.fillStyle = '#94a3b8';
                                  ctx.fillText('Official Announcement', 160, 145);

                                  ctx.fillStyle = '#f8fafc';
                                  ctx.font = '38px sans-serif';
                                  const maxWidth = 880;
                                  const lineHeight = 55;
                                  const x = 100;
                                  let y = 280;

                                  const words = studioGeneratedCaption.replace(/\n/g, ' \n ').split(' ');
                                  let line = '';

                                  for (let n = 0; n < words.length; n++) {
                                    if (words[n] === '\n') {
                                      ctx.fillText(line, x, y);
                                      line = '';
                                      y += lineHeight;
                                      continue;
                                    }
                                    const testLine = line + words[n] + ' ';
                                    const metrics = ctx.measureText(testLine);
                                    if (metrics.width > maxWidth && n > 0) {
                                      ctx.fillText(line, x, y);
                                      line = words[n] + ' ';
                                      y += lineHeight;
                                    } else {
                                      line = testLine;
                                    }
                                  }
                                  ctx.fillText(line, x, y);

                                  y += lineHeight * 2;
                                  ctx.fillStyle = '#818cf8';
                                  ctx.font = 'bold 30px monospace';
                                  ctx.fillText(studioGeneratedHashtags, x, y);

                                  const link = document.createElement('a');
                                  link.download = `AI_Post_${Date.now()}.png`;
                                  link.href = canvas.toDataURL('image/png');
                                  link.click();
                                } catch (e) {
                                  alert("Failed to export PNG: " + (e as Error).message);
                                }
                              }}
                              className="py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold transition-all shadow-sm"
                            >
                              📥 Export PNG
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(`${studioGeneratedCaption}\n\n${studioGeneratedHashtags}`);
                                alert("Caption text copied to clipboard!");
                              }}
                              className="py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 rounded text-[10px] font-bold transition-all"
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
                  
                  {/* Saved Posts History */}
                  {studioSavedPosts.length > 0 && (
                    <div className="space-y-4 animate-fadeIn">
                      <span className="block text-xs font-black text-foreground uppercase tracking-wider border-b border-border pb-2">Saved AI Content & History</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {studioSavedPosts.map(post => (
                          <div key={post.id} className="p-4 bg-card border border-border rounded-xl shadow-sm relative space-y-2 group">
                            <button 
                              onClick={() => setStudioSavedPosts(prev => prev.filter(p => p.id !== post.id))}
                              className="absolute top-2 right-2 text-foreground/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                              title="Delete Post"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <div className="flex gap-2 items-center text-[10px] font-bold text-primary uppercase tracking-widest">
                              <span>{post.channel}</span>
                              <span className="w-1 h-1 rounded-full bg-border"></span>
                              <span className="text-foreground/50">{post.date}</span>
                            </div>
                            <p className="text-xs text-foreground/80 line-clamp-3">{post.text}</p>
                            <div className="pt-2 flex gap-2 border-t border-border mt-2">
                               <button 
                                 onClick={() => {
                                    setStudioGeneratedCaption(post.text);
                                    setStudioGeneratedHashtags(post.hashtags);
                                    setStudioChannel(post.channel);
                                 }}
                                 className="text-[10px] font-bold text-primary hover:underline"
                               >
                                 Load in Editor
                               </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ADMIN NEW FEATURES */}
              
              {activeFeature === 'Admission Funnel Analytics' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📊 Track inquiries, applications, interviews, and final enrollments to optimize your admission process.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div 
                      className="p-4 bg-card border border-border rounded-xl text-center shadow-sm cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setActiveFunnelView('Inquiries')}
                    >
                      <span className="block text-2xl font-black text-primary">145</span>
                      <span className="text-[10px] font-bold uppercase text-foreground/60 tracking-wider">Inquiries</span>
                    </div>
                    <div 
                      className="p-4 bg-card border border-border rounded-xl text-center shadow-sm cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setActiveFunnelView('Applications')}
                    >
                      <span className="block text-2xl font-black text-amber-500">89</span>
                      <span className="text-[10px] font-bold uppercase text-foreground/60 tracking-wider">Applications</span>
                    </div>
                    <div 
                      className="p-4 bg-card border border-border rounded-xl text-center shadow-sm cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setActiveFunnelView('Interviews')}
                    >
                      <span className="block text-2xl font-black text-blue-500">42</span>
                      <span className="text-[10px] font-bold uppercase text-foreground/60 tracking-wider">Interviews</span>
                    </div>
                    <div 
                      className="p-4 bg-card border border-border rounded-xl text-center shadow-sm cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setActiveFunnelView('Enrolled')}
                    >
                      <span className="block text-2xl font-black text-emerald-500">38</span>
                      <span className="text-[10px] font-bold uppercase text-foreground/60 tracking-wider">Enrolled</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-3 mt-4 overflow-hidden flex">
                    <div className="bg-primary h-3" style={{width: '40%'}}></div>
                    <div className="bg-amber-500 h-3" style={{width: '25%'}}></div>
                    <div className="bg-blue-500 h-3" style={{width: '15%'}}></div>
                    <div className="bg-emerald-500 h-3" style={{width: '20%'}}></div>
                  </div>
                  
                  {activeFunnelView && (
                    <div className="mt-4 p-4 border border-border rounded-xl bg-card animate-fadeIn">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-foreground">Recent {activeFunnelView}</h4>
                        <button onClick={() => setActiveFunnelView(null)} className="text-xs text-foreground/50 hover:text-foreground">Close</button>
                      </div>
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex justify-between items-center p-2 hover:bg-muted/30 rounded-lg transition-colors border border-transparent hover:border-border">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-foreground">Candidate #{Math.floor(Math.random() * 1000) + 1000}</span>
                              <span className="text-[10px] text-foreground/60">Updated: Today</span>
                            </div>
                            <button className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded text-[10px] font-bold transition-colors">
                              View Details
                            </button>
                          </div>
                        ))}
                      </div>
                      {activeFunnelView === 'Inquiries' && (
                        <div className="mt-4 flex justify-end">
                          <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm">+ Add Inquiry</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeFeature === 'Staff Performance Tracking' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📈 Monitor academic results, punctuality, and syllabus completion metrics for your faculty.
                  </div>
                  <div className="border border-border rounded-xl bg-card overflow-hidden">
                    <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                          <th className="p-3">Staff Name</th>
                          <th className="p-3">Department</th>
                          <th className="p-3">Punctuality</th>
                          <th className="p-3">Syllabus %</th>
                          <th className="p-3 text-right">Avg Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground/85">
                        <tr className="hover:bg-muted/10">
                          <td className="p-3 font-bold text-primary">Ali Ahmed</td>
                          <td className="p-3">Science</td>
                          <td className="p-3 font-mono text-emerald-500">98%</td>
                          <td className="p-3 font-mono text-emerald-500">85%</td>
                          <td className="p-3 text-right font-bold text-emerald-500">A-</td>
                        </tr>
                        <tr className="hover:bg-muted/10">
                          <td className="p-3 font-bold text-primary">Sara Khan</td>
                          <td className="p-3">Mathematics</td>
                          <td className="p-3 font-mono text-amber-500">82%</td>
                          <td className="p-3 font-mono text-emerald-500">90%</td>
                          <td className="p-3 text-right font-bold text-blue-500">B+</td>
                        </tr>
                      </tbody>
                    </table></div>
                  </div>
                </div>
              )}

              {activeFeature === 'Inventory Management' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📦 Master ledger for tracking school assets, lab equipment, and stationary stock.
                  </div>
                  <div className="flex justify-end mb-2">
                     <button 
                       onClick={() => setShowAddInventory(!showAddInventory)}
                       className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow hover:bg-primary/90 transition-all flex items-center gap-2"
                     >
                       <Plus size={14} /> {showAddInventory ? 'Cancel' : 'Add Asset'}
                     </button>
                  </div>
                  
                  {showAddInventory && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as any;
                      setInventoryItems([{
                        id: Date.now().toString(),
                        name: form.itemName.value,
                        category: form.itemCategory.value,
                        location: form.itemLocation.value,
                        qty: form.itemQty.value,
                        value: form.itemValue.value
                      }, ...inventoryItems]);
                      setShowAddInventory(false);
                      form.reset();
                    }} className="p-4 bg-card border border-border rounded-xl space-y-3 mb-4 animate-fadeIn shadow-sm">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Register New Asset</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <input name="itemName" required placeholder="Item Name (e.g. Whiteboard)" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                        <select name="itemCategory" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                          <option value="School Furniture">School Furniture</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Play Area Things">Play Area Things</option>
                          <option value="IT Equipment">IT Equipment</option>
                          <option value="Lab Supplies">Lab Supplies</option>
                          <option value="Stationary">Stationary</option>
                          <option value="Sports Equipment">Sports Equipment</option>
                          <option value="Other">Other</option>
                        </select>
                        <input name="itemLocation" required placeholder="Location (e.g. Room 12)" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                        <input name="itemQty" required placeholder="Qty & Status (e.g. 10 Good)" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                        <input name="itemValue" required placeholder="Estimated Value (e.g. $500)" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90">Save Asset</button>
                      </div>
                    </form>
                  )}

                  <div className="border border-border rounded-xl bg-card overflow-hidden">
                    <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                          <th className="p-3">Item Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Qty / Status</th>
                          <th className="p-3 text-right">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground/85">
                        {inventoryItems.map(item => (
                          <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-3 font-bold text-primary">{item.name}</td>
                            <td className="p-3 font-medium">{item.category}</td>
                            <td className="p-3 text-foreground/70">{item.location}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded border font-bold text-[10px] ${
                                item.qty.toLowerCase().includes('low') 
                                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              }`}>
                                {item.qty}
                              </span>
                            </td>
                            <td className="p-3 text-right font-mono text-foreground/60">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table></div>
                  </div>
                </div>
              )}

              {activeFeature === 'Transport Management' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    🚌 Live tracking of school buses, driver assignments, and student route rosters.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { route: 'Route A - Downtown', bus: 'LEA-4050', driver: 'Asif Mehmood', students: 42, status: 'In Transit' },
                      { route: 'Route B - Suburbs', bus: 'LEA-8811', driver: 'Tariq Jameel', students: 38, status: 'Completed' }
                    ].map((bus, i) => (
                      <div key={i} className="p-4 bg-card border border-border rounded-xl shadow-sm space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-primary text-sm">{bus.route}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full ${bus.status === 'In Transit' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>{bus.status}</span>
                        </div>
                        <div className="text-xs text-foreground/70 space-y-1">
                          <p><strong>Bus No:</strong> {bus.bus}</p>
                          <p><strong>Driver:</strong> {bus.driver}</p>
                          <p><strong>Students Assigned:</strong> {bus.students}</p>
                        </div>
                        <button className="w-full mt-2 py-1.5 border border-border text-[10px] font-bold text-foreground/70 rounded hover:bg-muted/50 transition-colors">View Live Map</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeFeature === 'Hostel Management' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    🏢 Manage room allocations, track mess fee collections, and view warden logs.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-4 bg-card border border-border rounded-xl text-center shadow-sm">
                      <span className="block text-2xl font-black text-primary">120</span>
                      <span className="text-[10px] font-bold uppercase text-foreground/60 tracking-wider">Total Beds</span>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-xl text-center shadow-sm">
                      <span className="block text-2xl font-black text-emerald-500">98</span>
                      <span className="text-[10px] font-bold uppercase text-foreground/60 tracking-wider">Occupied</span>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-xl text-center shadow-sm">
                      <span className="block text-2xl font-black text-amber-500">22</span>
                      <span className="text-[10px] font-bold uppercase text-foreground/60 tracking-wider">Vacant</span>
                    </div>
                  </div>
                  <div className="border border-border rounded-xl bg-card overflow-hidden">
                    <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[500px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                          <th className="p-3">Room No</th>
                          <th className="p-3">Occupant(s)</th>
                          <th className="p-3">Mess Fee</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground/85">
                        <tr className="hover:bg-muted/10">
                          <td className="p-3 font-bold text-primary">A-101</td>
                          <td className="p-3">Bilal, Usama</td>
                          <td className="p-3"><span className="text-emerald-500 font-bold">Paid</span></td>
                          <td className="p-3 text-right"><button className="text-xs font-bold text-blue-500">Details</button></td>
                        </tr>
                        <tr className="hover:bg-muted/10">
                          <td className="p-3 font-bold text-primary">A-102</td>
                          <td className="p-3">Ali (1 Vacant)</td>
                          <td className="p-3"><span className="text-rose-500 font-bold">Pending</span></td>
                          <td className="p-3 text-right"><button className="text-xs font-bold text-blue-500">Details</button></td>
                        </tr>
                      </tbody>
                    </table></div>
                  </div>
                </div>
              )}

              {activeFeature === 'Visitor Management' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📝 Digital logbook for campus security tracking visitor entries and exits.
                  </div>
                  <div className="flex justify-end mb-2">
                     <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow hover:bg-primary/90 transition-all flex items-center gap-2">
                       <Plus size={14} /> Log Visitor
                     </button>
                  </div>
                  <div className="border border-border rounded-xl bg-card overflow-hidden">
                    <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                          <th className="p-3">Visitor Name</th>
                          <th className="p-3">Purpose</th>
                          <th className="p-3">Meeting With</th>
                          <th className="p-3">Entry Time</th>
                          <th className="p-3 text-right">Exit Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground/85">
                        <tr className="hover:bg-muted/10">
                          <td className="p-3 font-bold text-primary">Saad Malik</td>
                          <td className="p-3">Admission Query</td>
                          <td className="p-3">Admin Office</td>
                          <td className="p-3 text-foreground/60 font-mono">09:15 AM</td>
                          <td className="p-3 text-right text-emerald-500 font-bold font-mono">10:30 AM</td>
                        </tr>
                        <tr className="hover:bg-muted/10 bg-amber-500/5">
                          <td className="p-3 font-bold text-primary">Mrs. Fatima</td>
                          <td className="p-3">PTM</td>
                          <td className="p-3">Class 8 Teacher</td>
                          <td className="p-3 text-foreground/60 font-mono">11:45 AM</td>
                          <td className="p-3 text-right"><button className="text-[10px] font-bold px-2 py-1 bg-amber-500 text-white rounded">Mark Exit</button></td>
                        </tr>
                      </tbody>
                    </table></div>
                  </div>
                </div>
              )}

              {activeFeature === 'Payroll' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    💸 Track monthly salary disbursements, generate payslips, and manage deductions.
                  </div>
                  <div className="border border-border rounded-xl bg-card overflow-hidden">
                    <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                          <th className="p-3">Employee Name</th>
                          <th className="p-3">Basic Salary</th>
                          <th className="p-3">Allowances</th>
                          <th className="p-3">Deductions</th>
                          <th className="p-3 text-right">Net Payable</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground/85">
                        <tr className="hover:bg-muted/10">
                          <td className="p-3 font-bold text-primary">Ali Ahmed</td>
                          <td className="p-3 font-mono text-foreground/60">Rs 45,000</td>
                          <td className="p-3 font-mono text-emerald-500">+ Rs 5,000</td>
                          <td className="p-3 font-mono text-rose-500">- Rs 1,200</td>
                          <td className="p-3 text-right font-bold text-primary font-mono">Rs 48,800</td>
                        </tr>
                        <tr className="hover:bg-muted/10">
                          <td className="p-3 font-bold text-primary">Sara Khan</td>
                          <td className="p-3 font-mono text-foreground/60">Rs 52,000</td>
                          <td className="p-3 font-mono text-emerald-500">+ Rs 2,000</td>
                          <td className="p-3 font-mono text-rose-500">Rs 0</td>
                          <td className="p-3 text-right font-bold text-primary font-mono">Rs 54,000</td>
                        </tr>
                      </tbody>
                    </table></div>
                  </div>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow hover:bg-primary/90 transition-all">Process All Payroll</button>
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

              {activeFeature === 'Academic Setup' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    <strong>Academic Setup Hub:</strong> Manage classes and subjects for your school. Add or remove them as needed to reflect your current curriculum.
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Class Setup */}
                    <div className="p-4 bg-card/50 border border-border rounded-xl space-y-4">
                      <h4 className="text-sm font-bold text-foreground">Manage Classes</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSetupClass}
                          onChange={(e) => setNewSetupClass(e.target.value)}
                          placeholder="e.g. Class 11-A"
                          className="flex-1 bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground"
                        />
                        <button
                          onClick={() => {
                            if (!newSetupClass) return;
                            if (schoolClasses.includes(newSetupClass)) {
                              alert('Class already exists!');
                              return;
                            }
                            requestSecurityVerification(`Add new class: ${newSetupClass}`, () => {
                              setSchoolClasses([...schoolClasses, newSetupClass]);
                              setNewSetupClass('');
                            });
                          }}
                          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                        >
                          Add
                        </button>
                      </div>
                      <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredClasses.map(cls => (
                          <div key={cls} className="flex items-center justify-between p-2.5 bg-muted/30 border border-border/50 rounded-lg group hover:border-primary/30 transition-colors">
                            <span className="text-xs font-semibold text-foreground/90">{cls}</span>
                            <button
                              onClick={() => {
                                requestSecurityVerification(`Remove class: ${cls}`, () => {
                                  setSchoolClasses(schoolClasses.filter(c => c !== cls));
                                });
                              }}
                              className="text-[10px] text-red-500 font-bold px-2 py-1 bg-red-500/10 hover:bg-red-500/20 rounded opacity-0 group-hover:opacity-100 transition-all"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {schoolClasses.length === 0 && (
                          <div className="p-3 text-center text-xs text-foreground/50 border border-dashed border-border/50 rounded-lg">No classes configured.</div>
                        )}
                      </div>
                    </div>

                    {/* Subject Setup */}
                    <div className="p-4 bg-card/50 border border-border rounded-xl space-y-4">
                      <h4 className="text-sm font-bold text-foreground">Manage Subjects</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSetupSubject}
                          onChange={(e) => setNewSetupSubject(e.target.value)}
                          placeholder="e.g. Advanced AI"
                          className="flex-1 bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground"
                        />
                        <button
                          onClick={() => {
                            if (!newSetupSubject) return;
                            if (schoolSubjects.includes(newSetupSubject)) {
                              alert('Subject already exists!');
                              return;
                            }
                            requestSecurityVerification(`Add new subject: ${newSetupSubject}`, () => {
                              setSchoolSubjects([...schoolSubjects, newSetupSubject]);
                              setNewSetupSubject('');
                            });
                          }}
                          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                        >
                          Add
                        </button>
                      </div>
                      <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {schoolSubjects.map(sub => (
                          <div key={sub} className="flex items-center justify-between p-2.5 bg-muted/30 border border-border/50 rounded-lg group hover:border-primary/30 transition-colors">
                            <span className="text-xs font-semibold text-foreground/90">{sub}</span>
                            <button
                              onClick={() => {
                                requestSecurityVerification(`Remove subject: ${sub}`, () => {
                                  setSchoolSubjects(schoolSubjects.filter(s => s !== sub));
                                });
                              }}
                              className="text-[10px] text-red-500 font-bold px-2 py-1 bg-red-500/10 hover:bg-red-500/20 rounded opacity-0 group-hover:opacity-100 transition-all"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {schoolSubjects.length === 0 && (
                          <div className="p-3 text-center text-xs text-foreground/50 border border-dashed border-border/50 rounded-lg">No subjects configured.</div>
                        )}
                      </div>
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
