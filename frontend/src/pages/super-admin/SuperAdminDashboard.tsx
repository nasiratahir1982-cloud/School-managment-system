import React, { useState } from 'react';
import { useSchoolStore, COUNTRY_CONFIGS } from '../../store/schoolStore';
import type { SupportedCountry, SchoolInfo } from '../../store/schoolStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Layers, 
  Cpu, 
  Database, 
  LogOut, 
  Plus, 
  Activity, 
  CheckCircle,
  Settings,
  ChevronRight,
  ChevronLeft,
  Globe,
  Briefcase,
  User,
  Sliders,
  Sparkles,
  Info,
  Sun,
  Moon
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const loginUser = useAuthStore((state) => state.login);
  const currentUser = useAuthStore((state) => state.user);
  const { darkMode, toggleTheme } = useThemeStore();
  
  const schoolsList = useSchoolStore((state) => state.schools);
  const addSchoolToStore = useSchoolStore((state) => state.addSchool);
  const resolveSchool = useSchoolStore((state) => state.resolveSchool);

  interface ActivityLog {
    id: string;
    time: string;
    type: 'success' | 'info' | 'setup';
    message: string;
  }

  const [activities, setActivities] = useState<ActivityLog[]>([
    {
      id: '1',
      time: 'Just now',
      type: 'info',
      message: 'System databases secured & regional compliance checks active.'
    },
    {
      id: '2',
      time: '15 mins ago',
      type: 'setup',
      message: 'Roots International Toronto portal initialized with Canada compliance configuration.'
    },
    {
      id: '3',
      time: '1 hour ago',
      type: 'success',
      message: 'Completed system backup and cleared cache memory pools.'
    }
  ]);

  // Wizard States
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [activeDetailModal, setActiveDetailModal] = useState<'schools' | 'database' | 'queues' | 'cpu' | null>(null);
  const [selectedSchoolDetail, setSelectedSchoolDetail] = useState<string | null>(null);
  const [optimizingComponent, setOptimizingComponent] = useState<string | null>(null);

  // Telemetry Graph States
  const [selectedMetric, setSelectedMetric] = useState<'cpu' | 'memory' | 'traffic'>('cpu');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; label: string } | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<{ x: number; y: number; val: number; label: string } | null>(null);

  const metricData = {
    cpu: {
      points: [1.2, 1.8, 1.5, 2.4, 1.9, 3.1, 1.84],
      labels: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      color: '#c084fc', // Purple (light)
      gradientId: 'cpu-grad',
      unit: '%',
      title: 'Core CPU Load'
    },
    memory: {
      points: [38.2, 39.5, 41.8, 43.1, 42.9, 44.5, 41.2],
      labels: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      color: '#34d399', // Emerald
      gradientId: 'mem-grad',
      unit: ' MB',
      title: 'Database Memory Pool'
    },
    traffic: {
      points: [45, 68, 52, 91, 110, 85, 95],
      labels: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      color: '#60a5fa', // Blue
      gradientId: 'traffic-grad',
      unit: ' rps',
      title: 'API Request Rate'
    }
  };

  const handleLaunchSchoolPortal = async (school: SchoolInfo) => {
    try {
      await resolveSchool(school.domain);
      loginUser({
        userId: `usr-${Date.now()}`,
        name: `Principal (${school.schoolName})`,
        email: `admin@${school.domain}.academichub.com`,
        role: 'admin',
        token: 'mock-jwt-token-value-2026'
      });
      setActiveDetailModal(null);
      setSelectedSchoolDetail(null);
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  // Form Field States
  const [country, setCountry] = useState<SupportedCountry>('PK');
  const [organization, setOrganization] = useState('Academic Hub Group');
  const [schoolName, setSchoolName] = useState('');
  const [domain, setDomain] = useState('');
  const [city, setCity] = useState('');
  const [branchName, setBranchName] = useState('Main Branch');
  const [campusName, setCampusName] = useState('Johar Town Campus');
  const [sessionLabel, setSessionLabel] = useState('2026-2027');
  const [primaryHsl, setPrimaryHsl] = useState('263.4 70% 50.4%');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('Password123!');
  const [isProvisioning, setIsProvisioning] = useState(false);

  const handleLaunch = () => {
    // Robust input validation and fallbacks
    const finalSchoolName = schoolName.trim() || 'Custom School';
    const finalDomain = (domain.trim() || schoolName.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') || 'custom-school').toLowerCase().replace(/\s+/g, '-');
    const finalCity = city.trim() || 'Lahore';
    const finalAdminName = adminName.trim() || 'Principal Officer';
    const finalAdminEmail = adminEmail.trim() || `admin@${finalDomain}.academichub.com`;

    setIsProvisioning(true);
    const newId = `t-${Date.now()}`;

    setTimeout(async () => {
      const newSchool: SchoolInfo = {
        schoolId: newId,
        schoolName: finalSchoolName,
        domain: finalDomain,
        logoUrl: null,
        country: country,
        city: finalCity,
        campusCount: 1,
        currentAcademicSession: sessionLabel,
        themeSettings: {
          primaryHsl: primaryHsl,
          secondaryHsl: '217.2 32.6% 16%'
        },
        modules: {
          transport: true,
          hostel: true,
          inventory: true,
          library: true,
          lms: true,
          payroll: true,
        }
      };

      addSchoolToStore(newSchool);
      setActivities(prev => [
        {
          id: `act-${Date.now()}-1`,
          time: 'Just now',
          type: 'success',
          message: `🎉 School Portal for ${finalSchoolName} (${finalCity}) registered and live successfully!`
        },
        {
          id: `act-${Date.now()}-2`,
          time: 'Just now',
          type: 'setup',
          message: `👤 Admin account configured for ${finalAdminName} (${finalAdminEmail}).`
        },
        {
          id: `act-${Date.now()}-3`,
          time: 'Just now',
          type: 'info',
          message: `🎨 Applied brand color scheme to ${finalDomain}.academichub.com.`
        },
        ...prev
      ]);

      try {
        await resolveSchool(newSchool.domain);
        loginUser({
          userId: `usr-${Date.now()}`,
          name: `${finalAdminName} (${finalSchoolName})`,
          email: finalAdminEmail,
          role: 'admin',
          token: 'mock-jwt-token-value-2026'
        });
      } catch (e) {
        console.error('Failed to resolve school domain or login admin user:', e);
      }

      // Reset Wizard
      setSchoolName('');
      setDomain('');
      setCity('');
      setAdminName('');
      setAdminEmail('');
      setWizardStep(1);
      setWizardOpen(false);
      setIsProvisioning(false);

      // Navigate to /dashboard
      navigate('/dashboard');
    }, 2000);
  };

  const triggerBackup = () => {
    setActivities(prev => [
      {
        id: `backup-${Date.now()}`,
        time: 'Just now',
        type: 'success',
        message: '💾 Manual Database Backup: Successfully backed up Postgres RLS schemas to system archive.'
      },
      ...prev
    ]);
    alert('System Backup Complete! Log has been recorded in the activity feed.');
  };

  const triggerSecurityAudit = () => {
    setActivities(prev => [
      {
        id: `audit-${Date.now()}`,
        time: 'Just now',
        type: 'info',
        message: '🛡️ Security Audit: Row-Level Security (RLS) policies verified for all school portals.'
      },
      ...prev
    ]);
    alert('Security check passed: 100% data isolation verified.');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get auto settings based on currently selected country in wizard
  const countryConfig = COUNTRY_CONFIGS[country];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      
      {/* Super Header Banner */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-indigo-500/10 flex items-center justify-center border border-purple-500/40 shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Building2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-foreground m-0 uppercase bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Academic Hub Master
              </h1>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Account: <strong className="text-foreground">{currentUser?.name}</strong> (Super Admin)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-purple-900/40 border border-purple-800/80 hover:bg-purple-800 hover:text-white px-4 py-2 rounded-lg text-sm font-bold text-purple-300 transition-all shadow-md shadow-purple-950/20"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              Simulate School Portals
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border text-xs text-foreground/80 hover:text-foreground hover:border-foreground/30 transition-all font-semibold shadow-sm"
              title="Toggle Light/Dark Mode"
            >
              {darkMode ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-card border border-border hover:bg-muted hover:text-foreground text-foreground px-4 py-2 rounded-lg text-sm transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        {/* Telemetry metrics row */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div 
            onClick={() => setActiveDetailModal('schools')}
            className="glass-card accent-purple p-6 rounded-xl flex flex-col justify-between h-32 cursor-pointer hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Institutes</span>
              <Building2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{schoolsList.length}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Multi-campus isolation active</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveDetailModal('database')}
            className="glass-card accent-emerald p-6 rounded-xl flex flex-col justify-between h-32 cursor-pointer hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Database Space</span>
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">41.2 MB</h3>
              <p className="text-[10px] text-emerald-400 mt-1">Shared relational clusters</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveDetailModal('queues')}
            className="glass-card accent-amber p-6 rounded-xl flex flex-col justify-between h-32 cursor-pointer hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Job Queues Status</span>
              <Layers className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">0 Queue Jobs</h3>
              <p className="text-[10px] text-slate-500 mt-1">RabbitMQ cluster healthy</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveDetailModal('cpu')}
            className="glass-card accent-blue p-6 rounded-xl flex flex-col justify-between h-32 cursor-pointer hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">CPU Average</span>
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">1.84%</h3>
              <p className="text-[10px] text-emerald-400 mt-1">Load balancer: healthy</p>
            </div>
          </div>
        </section>

        {/* Action Header bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            SaaS Institute Provisioning Ledger
          </h2>
          <button
            onClick={() => setWizardOpen(true)}
            className="flex items-center gap-2 bg-purple-650 hover:bg-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-550/20"
          >
            <Plus className="w-4.5 h-4.5" />
            Launch School Setup Wizard
          </button>
        </div>

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Active Tenant List Column */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="glass-card rounded-xl overflow-hidden border border-slate-800 h-full flex flex-col justify-between">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Domain Prefix</th>
                    <th className="px-6 py-4">School Subdomain</th>
                    <th className="px-6 py-4">Country & Region</th>
                    <th className="px-6 py-4">Theme Configuration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                  {schoolsList.map((school) => (
                    <tr 
                      key={school.schoolId} 
                      onClick={() => handleLaunchSchoolPortal(school)}
                      className="hover:bg-slate-900/35 transition-colors cursor-pointer group"
                      title={`Launch & Administer ${school.schoolName} Portal`}
                    >
                      <td className="px-6 py-4 font-mono text-xs text-slate-400 group-hover:text-purple-400 transition-colors">{school.domain}</td>
                      <td className="px-6 py-4 font-bold text-white group-hover:text-purple-300 transition-colors">{school.schoolName}</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <span>{COUNTRY_CONFIGS[school.country]?.flag}</span>
                        <span className="font-semibold text-slate-200">{COUNTRY_CONFIGS[school.country]?.countryName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5">
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white/20" 
                              style={{ backgroundColor: `hsl(${school.themeSettings.primaryHsl.split(' ')[0]} 70% 50%)` }}
                            ></span>
                            <span className="text-xs text-slate-400 font-mono">HSL: {school.themeSettings.primaryHsl}</span>
                          </span>
                          <span className="text-[10px] text-purple-400 font-black opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0 flex items-center gap-0.5 whitespace-nowrap">
                            Manage School <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Operations Sidebar Info */}
          <div className="flex flex-col">
            <div className="glass-card p-6 rounded-xl border border-slate-800 space-y-4 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white m-0 flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Settings className="w-5 h-5 text-purple-400" />
                  System Master Controls
                </h3>
                <p className="text-xs text-slate-400 mt-3">
                  Perform administrative master tasks across the entire SaaS infrastructure with one click:
                </p>
                
                <div className="space-y-2.5 mt-4">
                  <button
                    onClick={() => setWizardOpen(true)}
                    className="w-full flex items-center justify-between p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-xl text-left text-xs font-semibold text-slate-200 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2">
                      <span>🚀</span>
                      <div>
                        <span className="block font-bold text-white">Create New School</span>
                        <span className="text-[10px] text-slate-500">Launch provisioning wizard</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={triggerBackup}
                    className="w-full flex items-center justify-between p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left text-xs font-semibold text-slate-200 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2">
                      <span>💾</span>
                      <div>
                        <span className="block font-bold text-white">Run DB Backup</span>
                        <span className="text-[10px] text-slate-500">Instant SQL snapshot</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={triggerSecurityAudit}
                    className="w-full flex items-center justify-between p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl text-left text-xs font-semibold text-slate-200 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2">
                      <span>🛡️</span>
                      <div>
                        <span className="block font-bold text-white">Check Security Status</span>
                        <span className="text-[10px] text-slate-500">Verify RLS constraints</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Live Telemetry Graph Widget */}
              <div className="mt-4 border border-slate-800 bg-slate-950/40 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {metricData[selectedMetric].title}
                  </span>
                  
                  {/* Selector tabs */}
                  <div className="flex gap-1 bg-slate-900 p-0.5 rounded-md border border-slate-800/80">
                    {(['cpu', 'memory', 'traffic'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setSelectedMetric(m);
                          setActiveTooltip(null);
                        }}
                        className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded transition-all ${
                          selectedMetric === m 
                            ? 'bg-purple-900/60 text-purple-300 border border-purple-800/80' 
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Graph */}
                <div className="relative pt-2">
                  <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 80">
                    <defs>
                      <linearGradient id="purple-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="mem-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="traffic-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    <line x1="10" y1="10" x2="290" y2="10" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3" />
                    <line x1="10" y1="40" x2="290" y2="40" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3" />
                    <line x1="10" y1="70" x2="290" y2="70" stroke="#1e293b" strokeWidth="0.5" />

                    {(() => {
                      const activeMetric = metricData[selectedMetric];
                      const maxVal = Math.max(...activeMetric.points) * 1.15;
                      const minVal = Math.min(...activeMetric.points) * 0.85;
                      const range = maxVal - minVal || 1;

                      const svgPoints = activeMetric.points.map((p, i) => {
                        const x = 15 + (i * 270) / (activeMetric.points.length - 1);
                        const y = 70 - ((p - minVal) / range) * 55;
                        return { x, y, val: p, label: activeMetric.labels[i] };
                      });

                      const linePath = svgPoints.reduce((acc, p, i) => {
                        return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                      }, '');

                      const areaPath = `${linePath} L ${svgPoints[svgPoints.length - 1].x} 70 L ${svgPoints[0].x} 70 Z`;
                      const activeColor = activeMetric.color;
                      const gradId = selectedMetric === 'cpu' ? 'purple-grad' : selectedMetric === 'memory' ? 'mem-grad' : 'traffic-grad';

                      return (
                        <>
                          {/* Gradient Fill under the line */}
                          <path d={areaPath} fill={`url(#${gradId})`} className="transition-all duration-500 ease-in-out" />

                          {/* Line Path */}
                          <path 
                            d={linePath} 
                            fill="none" 
                            stroke={activeColor} 
                            strokeWidth="2" 
                            strokeLinecap="round"
                            className="transition-all duration-500 ease-in-out"
                          />

                          {/* Interactive click dots */}
                          {svgPoints.map((pt, idx) => (
                            <g key={idx}>
                              <circle 
                                cx={pt.x} 
                                cy={pt.y} 
                                r="4" 
                                fill="#0f172a" 
                                stroke={activeColor} 
                                strokeWidth="2"
                                className="cursor-pointer transition-transform hover:scale-150 duration-200"
                                onClick={() => setActiveTooltip(pt)}
                                onMouseEnter={() => setHoveredPoint(pt)}
                                onMouseLeave={() => setHoveredPoint(null)}
                              />
                              {/* Pulse Effect for last live node */}
                              {idx === svgPoints.length - 1 && (
                                <circle 
                                  cx={pt.x} 
                                  cy={pt.y} 
                                  r="8" 
                                  fill="none" 
                                  stroke={activeColor} 
                                  strokeWidth="1.5"
                                  className="animate-ping opacity-60"
                                  style={{ pointerEvents: 'none' }}
                                />
                              )}
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>

                  {/* Tooltip Overlay */}
                  {(activeTooltip || hoveredPoint) && (
                    (() => {
                      const displayPt = activeTooltip || hoveredPoint;
                      if (!displayPt) return null;
                      return (
                        <div 
                          className="absolute bg-slate-900/95 border border-slate-700/80 px-2 py-1.5 rounded text-[9px] text-white shadow-xl z-20 transition-all pointer-events-auto flex flex-col gap-0.5 whitespace-nowrap"
                          style={{ 
                            left: `${Math.min(200, Math.max(10, displayPt.x - 45))}px`,
                            top: `${Math.max(-25, displayPt.y - 45)}px`
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-400 font-medium">{displayPt.label}</span>
                            {activeTooltip && (
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTooltip(null);
                                }}
                                className="text-slate-500 hover:text-slate-300 font-bold"
                              >
                                ×
                              </button>
                            )}
                          </div>
                          <span className="font-bold text-white">
                            {displayPt.val}
                            <span className="text-purple-400 font-medium">{metricData[selectedMetric].unit}</span>
                          </span>
                        </div>
                      );
                    })()
                  )}
                </div>

                <div className="flex items-center justify-between text-[8px] text-slate-500 font-mono">
                  <span>12:00 PM</span>
                  <span>Click nodes for tooltips</span>
                  <span>06:00 PM</span>
                </div>
              </div>

              <div className="p-3 bg-purple-950/20 border border-purple-800/20 rounded-lg text-[10px] text-purple-300 flex items-start gap-2 mt-4">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Interactive controls are connected directly to the central logging database.</span>
              </div>
            </div>
          </div>

        </section>

        {/* Recent Actions & Activity Feed */}
        <section className="glass-card p-6 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-purple-400" />
            Recent Network Activity & Alerts
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {activities.map((act) => (
              <div 
                key={act.id} 
                className="p-4 rounded-xl bg-slate-900/40 border border-slate-850/50 flex flex-col justify-between gap-4 text-xs hover:border-purple-500/35 transition-all hover:bg-slate-900/60 duration-300 w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] min-w-[280px] max-w-[380px]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-base select-none shrink-0">
                    {act.type === 'success' && '🟢'}
                    {act.type === 'setup' && '⚙️'}
                    {act.type === 'info' && '🔵'}
                  </span>
                  <p className="text-slate-200 font-medium leading-relaxed">{act.message}</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5 mt-auto">
                  <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">{act.type}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* POPUP WIZARD MODAL */}
      {wizardOpen && (
        <div className="modal-overlay">
          <div className="modal-container modal-2xl glass-card glow-purple">
            
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5.5 h-5.5 text-purple-400" />
                  School Setup Wizard
                </h3>
                <p className="text-xs text-slate-400 mt-1">Configure your school portal step-by-step</p>
              </div>
              <button 
                onClick={() => { setWizardOpen(false); setWizardStep(1); }}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body space-y-6">

            {/* Wizard Steps indicator */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/50 pb-4">
              <div className={wizardStep === 1 ? 'text-purple-400' : ''}>1. Country</div>
              <div className={wizardStep === 2 ? 'text-purple-400' : ''}>2. Organization</div>
              <div className={wizardStep === 3 ? 'text-purple-400' : ''}>3. Details</div>
              <div className={wizardStep === 4 ? 'text-purple-400' : ''}>4. Structure</div>
              <div className={wizardStep === 5 ? 'text-purple-400' : ''}>5. Branding</div>
              <div className={wizardStep === 6 ? 'text-purple-400' : ''}>6. Admin</div>
              <div className={wizardStep === 7 ? 'text-purple-400' : ''}>7. Launch</div>
            </div>

            {/* STEP 1: Country Setup */}
            {wizardStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <label className="block text-sm font-bold text-white flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-purple-400" /> Select Country
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(Object.keys(COUNTRY_CONFIGS) as SupportedCountry[]).map((code) => {
                    const cfg = COUNTRY_CONFIGS[code];
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setCountry(code)}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          country === code 
                            ? 'bg-purple-950/20 border-purple-500 text-white shadow-md' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-2xl mb-1">{cfg.flag}</span>
                        <span className="text-xs font-bold">{cfg.countryName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Organization Setup */}
            {wizardStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <label className="block text-sm font-bold text-white flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-400" /> Organization Configuration
                </label>
                <div>
                  <label className="block text-xs text-slate-450 mb-1.5 font-semibold">Select Parent Organization Umbrella</label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: School Details */}
            {wizardStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <label className="block text-sm font-bold text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-purple-400" /> School Details
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-450 mb-1.5 font-semibold">School Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Allied School System"
                      onChange={(e) => {
                        const val = e.target.value;
                        setSchoolName(val);
                        const suggested = val
                          .toLowerCase()
                          .trim()
                          .replace(/[^a-z0-9\s-]/g, '')
                          .replace(/\s+/g, '-')
                          .replace(/-+/g, '-');
                        setDomain(suggested);
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-450 mb-1.5 font-semibold">Requested Domain</label>
                    <div className="flex rounded-lg border border-slate-850 overflow-hidden bg-slate-950">
                      <input
                        type="text"
                        required
                        placeholder="allied-school"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 bg-transparent text-white text-sm focus:outline-none"
                      />
                      <span className="bg-slate-900 px-3 py-2.5 text-xs text-slate-500 flex items-center">
                        .academichub.com
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-450 mb-1.5 font-semibold">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lahore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Branches & Campuses & Session */}
            {wizardStep === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <label className="block text-sm font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" /> Structure Configuration
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-450 mb-1.5 font-semibold">Branch Name</label>
                    <input
                      type="text"
                      required
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-450 mb-1.5 font-semibold">Campus Name</label>
                    <input
                      type="text"
                      required
                      value={campusName}
                      onChange={(e) => setCampusName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-450 mb-1.5 font-semibold">Current Academic Session</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 2026-2027"
                    value={sessionLabel}
                    onChange={(e) => setSessionLabel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: Logo & Branding */}
            {wizardStep === 5 && (
              <div className="space-y-4 animate-fadeIn">
                <label className="block text-sm font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-purple-400" /> Logo & Theme Settings
                </label>
                <div>
                  <label className="block text-xs text-slate-450 mb-1.5 font-semibold">Brand Colors (Primary HSL)</label>
                  <select
                    value={primaryHsl}
                    onChange={(e) => setPrimaryHsl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none"
                  >
                    <option value="263.4 70% 50.4%">Premium Purple (Default)</option>
                    <option value="142.1 76.2% 36.3%">Emerald Green</option>
                    <option value="217.2 91.2% 59.8%">Blue Ocean</option>
                    <option value="43 96% 50%">Royal Gold / Amber</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 6: Admin Account */}
            {wizardStep === 6 && (
              <div className="space-y-4 animate-fadeIn">
                <label className="block text-sm font-bold text-white flex items-center gap-1.5">
                  <User className="w-4 h-4 text-purple-400" /> Admin Account details
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-450 mb-1.5 font-semibold">Admin Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Principal Name"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-450 mb-1.5 font-semibold">Admin Email</label>
                      <input
                        type="email"
                        required
                        placeholder="principal@school.com"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-450 mb-1.5 font-semibold">Password</label>
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Review & Launch */}
            {wizardStep === 7 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs text-purple-300">
                  <span className="font-bold block text-sm mb-2 text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Automatic Settings Configured Natively:
                  </span>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Currency: <strong>{countryConfig.currency} ({countryConfig.currencySymbol})</strong></li>
                    <li>Date Format: <strong>{countryConfig.dateFormat}</strong></li>
                    <li>Timezone: <strong>{countryConfig.timezone}</strong></li>
                    <li>Phone Format: <strong>{countryConfig.phonePrefix} (Mandatory)</strong></li>
                    <li>Terminology: <strong>{countryConfig.rollNumberLabel}</strong> style ledger</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">School Details</span>
                    <strong className="text-white block mt-0.5">{schoolName || 'Unnamed School'}</strong>
                    <span className="text-purple-400 font-mono text-[10px] mt-0.5 block">{domain}.academichub.com</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">Branch & Campus</span>
                    <strong className="text-white block mt-0.5">{branchName} ({campusName})</strong>
                    <span className="text-slate-400 text-[10px] mt-0.5 block">Session: {sessionLabel}</span>
                  </div>
                </div>
              </div>
            )}

            </div>{/* End modal-body */}

            {/* Modal Footer - Navigation buttons */}
            <div className="modal-footer justify-between">
              {wizardStep > 1 ? (
                <button
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white py-2 px-4 border border-slate-850 hover:bg-slate-900 rounded-lg transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}

              {wizardStep < 7 ? (
                <button
                  onClick={() => setWizardStep(prev => prev + 1)}
                  className="flex items-center gap-1.5 text-xs bg-purple-650 hover:bg-purple-600 text-white py-2 px-5 rounded-lg font-bold transition-all"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleLaunch}
                  disabled={isProvisioning}
                  className="flex items-center gap-1.5 text-xs bg-purple-650 hover:bg-purple-600 text-white py-2.5 px-6 rounded-lg font-bold transition-all shadow-md shadow-purple-900/25"
                >
                  {isProvisioning ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" /> Provisioning Database...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" /> Launch School Portal
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* METRICS DETAIL MODALS */}
      {activeDetailModal && (
        <div className="modal-overlay">
          <div className="modal-container modal-lg glass-card glow-purple">
            
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {activeDetailModal === 'schools' && (
                    <>
                      <Building2 className="w-5 h-5 text-purple-400" />
                      <span>Registered Schools Directory</span>
                    </>
                  )}
                  {activeDetailModal === 'database' && (
                    <>
                      <Database className="w-5 h-5 text-emerald-400" />
                      <span>Database Storage & Health</span>
                    </>
                  )}
                  {activeDetailModal === 'queues' && (
                    <>
                      <Layers className="w-5 h-5 text-amber-400" />
                      <span>Background Processing Tasks</span>
                    </>
                  )}
                  {activeDetailModal === 'cpu' && (
                    <>
                      <Cpu className="w-5 h-5 text-blue-400" />
                      <span>System Speed & Server Load</span>
                    </>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Live operational details of your education platform</p>
              </div>
              <button 
                onClick={() => setActiveDetailModal(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body space-y-4 text-sm">
              {activeDetailModal === 'schools' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Total Registered Institutes</span>
                      <span className="text-white font-bold">{schoolsList.length}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>School Data Isolation</span>
                      <span className="text-emerald-400 font-semibold">Secured & Active</span>
                    </div>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {schoolsList.map((t) => {
                      const isExpanded = selectedSchoolDetail === t.schoolId;
                      return (
                        <div 
                          key={t.schoolId} 
                          className={`p-3 bg-slate-900/40 hover:bg-slate-900/80 rounded-xl border transition-all duration-350 ${
                            isExpanded ? 'border-purple-500 bg-slate-900/90 shadow-md' : 'border-slate-800/60'
                          }`}
                        >
                          <div 
                            onClick={() => setSelectedSchoolDetail(isExpanded ? null : t.schoolId)}
                            className="flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              {t.logoUrl ? (
                                <img src={t.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
                              ) : (
                                <span className="text-xl">🏫</span>
                              )}
                              <div>
                                <span className="block font-bold text-white text-xs">{t.schoolName}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{t.domain}.academichub.com</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/25">Online</span>
                              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-2.5 animate-fadeIn">
                              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-450">
                                <div>📍 Location: <strong className="text-white">{t.city}, {t.country}</strong></div>
                                <div>🏫 Campuses: <strong className="text-white">{t.campusCount}</strong></div>
                                <div>📅 Session: <strong className="text-white">{t.currentAcademicSession}</strong></div>
                                <div>🎨 Theme color: <strong className="text-white">HSL {t.themeSettings.primaryHsl.split(' ')[0]}</strong></div>
                              </div>
                              <div className="p-2.5 bg-slate-950 rounded border border-slate-850">
                                <span className="text-[10px] text-slate-500 block mb-1.5 uppercase font-bold">Activated school features:</span>
                                <div className="flex flex-wrap gap-1.5 text-[9px] font-bold">
                                  {Object.entries(t.modules || { transport: true, library: true }).map(([mod, enabled]) => (
                                    <span 
                                      key={mod} 
                                      className={`px-2 py-0.5 rounded uppercase border ${
                                        enabled 
                                          ? 'bg-purple-950/20 text-purple-400 border-purple-800/30' 
                                          : 'bg-slate-900 text-slate-650 border-slate-800'
                                      }`}
                                    >
                                      {mod}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={() => handleLaunchSchoolPortal(t)}
                                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple-650 hover:bg-purple-600 text-white font-bold text-xs transition-all shadow-md shadow-purple-900/25 active:scale-98"
                              >
                                🚀 Enter School Dashboard (Principal view)
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeDetailModal === 'database' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Total Database Size</span>
                      <span className="text-white font-bold">41.2 MB</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Database Engine Version</span>
                      <span className="text-white">Postgres 16.2</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Cache Hit Ratio</span>
                      <span className="text-emerald-400 font-bold">99.85%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Database Space by Features:</span>
                    <div className="space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between p-2 bg-slate-900/50 rounded border border-slate-850/35">
                        <span>public.users (User Credentials)</span>
                        <span className="text-white font-semibold">12.4 MB</span>
                      </div>
                      <div className="flex justify-between p-2 bg-slate-900/50 rounded border border-slate-850/35">
                        <span>public.students (Profiles & Ledgers)</span>
                        <span className="text-white font-semibold">15.1 MB</span>
                      </div>
                      <div className="flex justify-between p-2 bg-slate-900/50 rounded border border-slate-850/35">
                        <span>public.institutes_config (Schools Metadata)</span>
                        <span className="text-white font-semibold">2.3 MB</span>
                      </div>
                      <div className="flex justify-between p-2 bg-slate-900/50 rounded border border-slate-850/35">
                        <span>public.transactions (Fees & Salaries)</span>
                        <span className="text-white font-semibold">11.4 MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDetailModal === 'queues' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Message Engine</span>
                      <span className="text-white font-bold">RabbitMQ Active</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Task Traffic Flow</span>
                      <span className="text-emerald-400 font-bold">Active & Balanced</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Active Tasks categories (Click to run):</span>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setActivities(prev => [
                            {
                              id: `task-email-${Date.now()}`,
                              time: 'Just now',
                              type: 'success',
                              message: '✉️ Bulk Email Dispatch: Successfully sent weekly reports to 2,480 parents.'
                            },
                            ...prev
                          ]);
                          alert('Email dispatch triggered! 2,480 parent emails delivered successfully.');
                        }}
                        className="w-full flex justify-between items-center p-3 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl transition-all text-xs font-semibold"
                      >
                        <div className="text-left">
                          <span className="block text-slate-200">Email Broadcast Tasks</span>
                          <span className="text-[10px] text-slate-500">Run system announcement emails</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] border border-amber-500/25">Trigger</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivities(prev => [
                            {
                              id: `task-sms-${Date.now()}`,
                              time: 'Just now',
                              type: 'success',
                              message: '📱 SMS Alerts: Successfully sent daily attendance status to 1,842 phones.'
                            },
                            ...prev
                          ]);
                          alert('SMS dispatcher completed! 1,842 notifications sent.');
                        }}
                        className="w-full flex justify-between items-center p-3 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl transition-all text-xs font-semibold"
                      >
                        <div className="text-left">
                          <span className="block text-slate-200">SMS Alert Dispatcher</span>
                          <span className="text-[10px] text-slate-500">Dispatch attendance alerts</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] border border-amber-500/25">Trigger</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivities(prev => [
                            {
                              id: `task-invoice-${Date.now()}`,
                              time: 'Just now',
                              type: 'success',
                              message: '💳 Invoice Engine: Generated fee challans for 8,500 students.'
                            },
                            ...prev
                          ]);
                          alert('Invoice engine executed! 8,500 billing challans generated.');
                        }}
                        className="w-full flex justify-between items-center p-3 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl transition-all text-xs font-semibold"
                      >
                        <div className="text-left">
                          <span className="block text-slate-200">Invoice Generation Engine</span>
                          <span className="text-[10px] text-slate-500">Auto-create monthly invoices</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] border border-amber-500/25">Trigger</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeDetailModal === 'cpu' && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Total CPU Utilization</span>
                      <span className="text-white font-bold">1.84%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Load Balancer Health</span>
                      <span className="text-emerald-400 font-bold">100% Operational</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider font-semibold">Server Component Performance (Click to Optimize):</span>
                    
                    <div className="space-y-2.5">
                      {[
                        { key: 'nginx', name: 'Nginx Reverse Proxy (Traffic Router)', desc: 'Traffic Control - Routes visitor requests instantly to prevent server crashes.', cpu: 15, ram: 45, maxRam: 256 },
                        { key: 'backend', name: 'API Server (Express Backend)', desc: 'Main Brain - Processes school admissions, grading, and data synchronization.', cpu: 45, ram: 120, maxRam: 512 },
                        { key: 'db', name: 'Database Server (Postgres DB)', desc: 'Vault - Secures all student files, grades, and financial records.', cpu: 32, ram: 280, maxRam: 1024 },
                        { key: 'redis', name: 'Cache Server (Redis Cache)', desc: 'Speed Booster - Keeps frequently used data in fast memory for instant loading.', cpu: 8, ram: 18, maxRam: 128 },
                        { key: 'rabbitmq', name: 'Task Queue Broker (RabbitMQ)', desc: 'Assistant - Runs background email alerts, SMS log queues, and report builds.', cpu: 10, ram: 95, maxRam: 512 },
                      ].map((comp) => {
                        const isOptimizing = optimizingComponent === comp.key;
                        const ramPct = (comp.ram / comp.maxRam) * 100;
                        return (
                          <div 
                            key={comp.key} 
                            onClick={async () => {
                              if (isOptimizing) return;
                              setOptimizingComponent(comp.key);
                              await new Promise(r => setTimeout(r, 1000));
                              setActivities(prev => [
                                {
                                  id: `opt-${Date.now()}`,
                                  time: 'Just now',
                                  type: 'success',
                                  message: `🧹 Cleaned up temporary caches for server component: ${comp.name}.`
                                },
                                ...prev
                              ]);
                              setOptimizingComponent(null);
                              alert(`Optimized successfully! Cleared inactive processes for ${comp.name}.`);
                            }}
                            className="p-3 bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 hover:border-blue-500/50 rounded-xl cursor-pointer transition-all active:scale-[0.99] space-y-2 text-xs"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="block font-bold text-white leading-normal">{comp.name}</span>
                                <span className="text-[10px] text-slate-400 mt-0.5 block">{comp.desc}</span>
                              </div>
                              <span className="text-[10px] text-blue-450 hover:text-blue-400 font-bold shrink-0">
                                {isOptimizing ? 'Optimizing...' : 'Optimize ⚙️'}
                              </span>
                            </div>

                            {/* Resource indicators */}
                            <div className="space-y-1.5 pt-1.5 border-t border-slate-850">
                              {/* CPU Progress Bar */}
                              <div>
                                <div className="flex justify-between text-[9px] text-slate-500 font-bold font-mono">
                                  <span>CPU LOAD</span>
                                  <span>{(comp.cpu / 10).toFixed(2)}%</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${comp.cpu}%` }}></div>
                                </div>
                              </div>

                              {/* RAM Progress Bar */}
                              <div>
                                <div className="flex justify-between text-[9px] text-slate-500 font-bold font-mono">
                                  <span>MEM ALLOCATION</span>
                                  <span>{comp.ram} MB / {comp.maxRam} MB ({ramPct.toFixed(0)}%)</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${ramPct}%` }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>{/* End modal-body */}

          </div>
        </div>
      )}

    </div>
  );
};
