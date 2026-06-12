import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../store/authStore';
import { useSchoolStore, COUNTRY_CONFIGS } from '../store/schoolStore';
import type { SupportedCountry } from '../store/schoolStore';
import { useThemeStore } from '../store/themeStore';
import { 
  GraduationCap, 
  Mail, 
  Eye, 
  EyeOff, 
  Sun,
  Moon,
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  MapPin,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

const t = {
  title: "Academic Hub",
  subtitle: "Global Education Management Platform",
  tagline: "Manage Academics, Administration & Finance",
  welcome: "Welcome to Academic Hub",
  welcomeDesc: "Select your country to get started",
  selectCountry: "Select Country",
  selectSchool: "Select School",
  schoolPreview: "School Verification",
  credentialsTitle: "Secure Authentication",
  credentialsDesc: "Enter your credentials to access your dashboard",
  emailLabel: "Email Address",
  emailPlaceholder: "e.g. principal@beaconhouse.com",
  passwordLabel: "Password",
  passwordPlaceholder: "••••••••",
  rememberMe: "Remember me",
  forgotPassword: "Forgot password?",
  signIn: "Sign In",
  signingIn: "Signing in...",
  help: "Help Documentation",
  support: "Contact Support",
  version: "Version",
  autoRoleNotice: "Role Auto-Detection: The system detects your role based on credentials.",
  nextStep: "Continue",
  backStep: "Back",
  campuses: "Campuses",
  academicSession: "Academic Session",
  location: "Location",
  verifiedSchool: "Verified School Portal",
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);
  const schoolsList = useSchoolStore((state) => state.schools);
  const resolveSchool = useSchoolStore((state) => state.resolveSchool);
  const currentSchool = useSchoolStore((state) => state.currentSchool);

  // Progressive Wizard Step: 1 = Welcome, 2 = Country, 3 = School, 4 = Preview, 5 = Auth/Sign In
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<SupportedCountry | ''>('');
  const [subdomain, setSubdomain] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Super Admin Portal login state
  const [superAdminMode, setSuperAdminMode] = useState(false);
  const [superEmail, setSuperEmail] = useState('');
  const [superPassword, setSuperPassword] = useState('');
  const [superError, setSuperError] = useState('');

  // Theme state
  const { darkMode, toggleTheme } = useThemeStore();

  const handleSuperAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuperError('');
    const emailLower = superEmail.trim().toLowerCase();
    if ((emailLower === 'superadmin@academichub.com' || emailLower === 'superadmin@academic-hub.com') && superPassword === 'superpass123') {
      loginUser({
        userId: 'usr-superadmin',
        name: 'Super Admin',
        email: emailLower,
        role: 'super_admin',
        token: 'mock-jwt-token-value-2026'
      });
      navigate('/super-admin');
    } else {
      setSuperError('Unauthorized access! Invalid administrator ID or passkey.');
    }
  };

  // Filter schools dynamically based on selected country
  const filteredSchools = schoolsList.filter(t => t.country === selectedCountry);

  // Automatically update settings when subdomain is selected
  useEffect(() => {
    if (subdomain) {
      resolveSchool(subdomain).catch(console.error);
    }
  }, [subdomain, resolveSchool]);

  const handleCountrySelect = (code: SupportedCountry) => {
    setSelectedCountry(code);
    setSubdomain(''); // Reset school selection
    setStep(3);
  };

  const handleSchoolSelect = (domain: string) => {
    setSubdomain(domain);
    setStep(5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const emailLower = email.toLowerCase().trim();
      let detectedRole: UserRole = 'admin';
      let displayName = 'Principal Officer';
      let expectedPassword = 'principalpass123';

      if (emailLower.includes('superadmin') || emailLower.includes('super')) {
        detectedRole = 'super_admin';
        displayName = 'Super Admin';
        expectedPassword = 'superpass123';
      } else if (emailLower.includes('student') || emailLower.includes('pupil')) {
        detectedRole = 'student';
        displayName = 'Kamran Shah (Student)';
        expectedPassword = 'studentpass123';
      } else if (emailLower.includes('teacher')) {
        detectedRole = 'teacher';
        displayName = 'Ayesha Khan (Teacher)';
        expectedPassword = 'teacherpass123';
      } else if (emailLower.includes('parent')) {
        detectedRole = 'parent';
        displayName = 'Parent Account';
        expectedPassword = 'parentpass123';
      } else if (emailLower.includes('org')) {
        detectedRole = 'org_owner';
        displayName = 'Organization Owner';
        expectedPassword = 'orgpass123';
      } else if (emailLower.includes('owner')) {
        detectedRole = 'school_owner';
        displayName = 'School Network Owner';
        expectedPassword = 'networkpass123';
      } else if (emailLower.includes('vice')) {
        detectedRole = 'vice_principal';
        displayName = 'Vice Principal';
        expectedPassword = 'vicepass123';
      } else if (emailLower.includes('admission')) {
        detectedRole = 'admissions';
        displayName = 'Admissions Director';
        expectedPassword = 'admissionpass123';
      } else if (emailLower.includes('reception')) {
        detectedRole = 'reception';
        displayName = 'Front Desk Executive';
        expectedPassword = 'receptionpass123';
      } else if (emailLower.includes('accountant') || emailLower.includes('finance')) {
        detectedRole = 'accountant';
        displayName = 'Chief Accountant';
        expectedPassword = 'financepass123';
      } else if (emailLower.includes('hr')) {
        detectedRole = 'hr';
        displayName = 'HR Manager';
        expectedPassword = 'hrpass123';
      } else if (emailLower.includes('librarian')) {
        detectedRole = 'librarian';
        displayName = 'Librarian';
        expectedPassword = 'librarypass123';
      } else if (emailLower.includes('transport')) {
        detectedRole = 'transport';
        displayName = 'Transport Manager';
        expectedPassword = 'drivepass123';
      } else if (emailLower.includes('hostel')) {
        detectedRole = 'hostel';
        displayName = 'Hostel Warden';
        expectedPassword = 'hostelpass123';
      } else if (emailLower.includes('principal') || emailLower.includes('admin')) {
        detectedRole = 'admin';
        displayName = 'Principal Officer';
        expectedPassword = 'principalpass123';
      }

      // Validate Password
      if (password !== expectedPassword) {
        setLoginError(`Invalid credentials! Password for ${detectedRole.toUpperCase().replace('_', ' ')} must be: ${expectedPassword}`);
        setLoading(false);
        return;
      }

      // Cross-school prevention: Ensure domain in email matches selected school subdomain
      if (detectedRole !== 'super_admin') {
        const schoolDomain = currentSchool?.domain; // e.g. "beaconhouse" or "lgs"
        const emailParts = emailLower.split('@');
        const emailDomain = emailParts[1]?.split('.')[0]; // e.g. "beaconhouse"
        
        // Allow academic-hub.com or academichub.com as a master test domain for all portals
        if (emailDomain !== 'academic-hub' && emailDomain !== 'academichub') {
          if (schoolDomain && emailDomain && emailDomain !== schoolDomain) {
            setLoginError(`Cross-school restriction! This account belongs to another school's system and cannot log into ${currentSchool?.schoolName || 'this school'}.`);
            setLoading(false);
            return;
          }
        }
      }

      // Log in session
      loginUser({
        userId: `usr-${Date.now()}`,
        name: displayName,
        email: email || 'admin@academichub.com',
        role: detectedRole,
        token: 'mock-jwt-token-value-2026'
      });

      // Redirect depending on auto-detected role
      if (detectedRole === 'super_admin') {
        navigate('/super-admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between py-4 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background text-foreground transition-colors duration-500">
      
      {/* Background glowing blobs (Visible in dark mode, subtle in light mode) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-10 animate-pulse"></div>

      {/* Theme & Administration Switcher Container */}
      <div className="w-full max-w-md flex justify-between items-center z-10">
        {!superAdminMode ? (
          <button
            onClick={() => setSuperAdminMode(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-950/20 border border-purple-500/35 hover:border-purple-500 text-xs font-black text-purple-400 hover:text-purple-300 hover:bg-purple-950/45 transition-all shadow-md"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>System Administration</span>
          </button>
        ) : (
          <div />
        )}
        
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-xs text-foreground/80 hover:text-foreground hover:border-foreground/30 transition-all font-medium shadow-sm"
        >
          {darkMode ? (
            <>
              <Sun className="h-3.5 w-3.5 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-3.5 w-3.5 text-indigo-400" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      <div className="relative max-w-md w-full glass-card p-5 sm:p-6 rounded-2xl glow-purple z-10 my-auto border border-border bg-card/60 backdrop-blur-2xl">
        
        {superAdminMode ? (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center space-y-3">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-purple-900/30 border border-purple-500/40 flex items-center justify-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/10 animate-pulse"></div>
                <Layers className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">SaaS Portal Controller</h3>
                <p className="text-xs text-foreground/75 mt-1">Super-Administrator Enterprise Verification</p>
              </div>
            </div>

            {superError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 animate-fadeIn">
                {superError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSuperAdminSubmit}>
              <div className="space-y-3">
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                    Super Admin ID (Email)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-foreground/40">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={superEmail}
                      onChange={(e) => setSuperEmail(e.target.value)}
                      placeholder="superadmin@academichub.com"
                      className="block w-full pl-4 pr-10 py-2.5 bg-card border border-border rounded-xl text-foreground text-sm placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Master Passkey
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-foreground/45 hover:text-foreground/80 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={superPassword}
                      onChange={(e) => setSuperPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-4 pr-10 py-2.5 bg-card border border-border rounded-xl text-foreground text-sm placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 text-sm font-bold rounded-xl text-white bg-purple-650 hover:bg-purple-600 focus:outline-none transition-all shadow-lg shadow-purple-900/20 active:scale-95"
                >
                  Authenticate & Launch
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setSuperAdminMode(false);
                    setSuperEmail('');
                    setSuperPassword('');
                    setSuperError('');
                  }}
                  className="w-full flex justify-center py-2 px-4 text-xs font-semibold rounded-xl text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-900 transition-all active:scale-95"
                >
                  Return to School Portals
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Progress Tracker Dots */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <div 
                  key={s} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step 
                      ? 'w-8 bg-primary' 
                      : s < step 
                        ? 'w-2 bg-primary/40' 
                        : 'w-2 bg-muted'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* STEP 1: Brand Intro Screen */}
        {!superAdminMode && step === 1 && (
          <div className="text-center space-y-6 animate-fadeIn">
            <div className="mx-auto h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-foreground tracking-tight">
                {t.title}
              </h2>
              <p className="mt-2 text-sm text-foreground/80 font-semibold">
                {t.subtitle}
              </p>
              <p className="mt-1 text-xs text-foreground/60">
                {t.tagline}
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="group w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 active:scale-98"
            >
              <span>{t.welcome}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}

        {/* STEP 2: Country Selection */}
        {!superAdminMode && step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground">{t.selectCountry}</h3>
              <p className="text-xs text-foreground/70 mt-0.5">{t.welcomeDesc}</p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {(Object.keys(COUNTRY_CONFIGS) as SupportedCountry[]).map((code) => {
                const config = COUNTRY_CONFIGS[code];
                return (
                  <button
                    key={code}
                    onClick={() => handleCountrySelect(code)}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:bg-muted/40 text-foreground transition-all group active:scale-95 shadow-sm"
                  >
                    <span className="text-2xl mb-1 filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
                      {config.flag}
                    </span>
                    <span className="text-xs font-bold text-center leading-tight">{config.countryName}</span>
                    <span className="text-[9px] text-foreground/50 mt-0.5">{config.currency}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-foreground/65 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{t.backStep}</span>
            </button>
          </div>
        )}

        {/* STEP 3: School Selection */}
        {!superAdminMode && step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center">
              <div className="inline-flex items-center gap-1 text-[10px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                <span>{COUNTRY_CONFIGS[selectedCountry as SupportedCountry]?.flag}</span>
                <span>{COUNTRY_CONFIGS[selectedCountry as SupportedCountry]?.countryName}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mt-2">{t.selectSchool}</h3>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredSchools.length === 0 ? (
                <div className="p-6 text-center text-foreground/65 text-xs">
                  No registered schools found in this country.
                </div>
              ) : (
                filteredSchools.map((school) => (
                  <button
                    key={school.domain}
                    onClick={() => handleSchoolSelect(school.domain)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-muted/30 text-left transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 flex items-center justify-center flex-shrink-0">
                        {school.logoUrl ? (
                          <img src={school.logoUrl} alt="Logo" className="h-full w-full object-contain" />
                        ) : (
                          <GraduationCap className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-foreground truncate">{school.schoolName}</span>
                        <span className="text-[10px] text-foreground/70 flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5 text-foreground/50" />
                          {school.city}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-foreground/50 flex-shrink-0" />
                  </button>
                ))
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-foreground/65 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Change Country</span>
            </button>
          </div>
        )}

        {/* STEP 4: School Information Preview */}
        {!superAdminMode && step === 4 && currentSchool && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground">{t.schoolPreview}</h3>
              <p className="text-xs text-foreground/75 mt-0.5">{t.verifiedSchool}</p>
            </div>

            {/* Premium Info Card */}
            <div className="p-4 rounded-xl bg-card border border-border space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 bg-primary/10 rounded-bl-xl border-l border-b border-border text-[9px] font-bold text-primary uppercase tracking-wider">
                Active
              </div>

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex items-center justify-center flex-shrink-0">
                  {currentSchool.logoUrl ? (
                    <img src={currentSchool.logoUrl} alt="School Logo" className="h-full w-full object-contain" />
                  ) : (
                    <GraduationCap className="h-7 w-7 text-primary" />
                  )}
                </div>
                <div>
                  <h4 className="text-base font-black text-foreground">{currentSchool.schoolName}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-foreground/70">
                    <MapPin className="h-2.5 w-2.5 text-foreground/55" />
                    <span>{currentSchool.city}, {COUNTRY_CONFIGS[currentSchool.country].countryName}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border text-[11px]">
                <div className="p-2.5 bg-muted/40 rounded-lg border border-border">
                  <span className="text-foreground/50 block text-[9px] uppercase font-bold tracking-wider mb-0.5">
                    {t.campuses}
                  </span>
                  <span className="text-foreground font-bold flex items-center gap-1">
                    <Layers className="h-3 w-3 text-primary" />
                    {currentSchool.campusCount} Campuses
                  </span>
                </div>
                <div className="p-2.5 bg-muted/40 rounded-lg border border-border">
                  <span className="text-foreground/50 block text-[9px] uppercase font-bold tracking-wider mb-0.5">
                    {t.academicSession}
                  </span>
                  <span className="text-foreground font-bold flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-primary" />
                    {currentSchool.currentAcademicSession}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(5)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/95 transition-all shadow-lg hover:shadow-primary/25 active:scale-98"
            >
              <span>{t.credentialsTitle}</span>
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setStep(3)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-foreground/65 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Select Different School</span>
            </button>
          </div>
        )}

        {/* STEP 5: Authentication Credentials Form */}
        {!superAdminMode && step === 5 && (
          <div className="space-y-3.5 animate-fadeIn">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground">{t.credentialsTitle}</h3>
              <p className="text-xs text-foreground/75 mt-0.5">{t.credentialsDesc}</p>
            </div>

            {/* Beautiful compact school info sub-card */}
            {currentSchool && (
              <div className="p-2.5 bg-muted/40 border border-border rounded-xl flex items-center gap-3 shadow-inner">
                <div className="h-10 w-10 flex items-center justify-center flex-shrink-0">
                  {currentSchool.logoUrl ? (
                    <img src={currentSchool.logoUrl} alt="Logo" className="h-full w-full object-contain" />
                  ) : (
                    <GraduationCap className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-foreground truncate">{currentSchool.schoolName}</span>
                  <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-foreground/60 mt-0.5 font-medium">
                    <span>📍 {currentSchool.city}</span>
                    <span>•</span>
                    <span>🏫 {currentSchool.campusCount} Campuses</span>
                    <span>•</span>
                    <span>📅 {currentSchool.currentAcademicSession}</span>
                  </div>
                </div>
              </div>
            )}

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-650 dark:text-red-400 animate-fadeIn">
                {loginError}
              </div>
            )}

            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div className="space-y-2.5">
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/70 mb-1">
                    {t.emailLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-foreground/40">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="block w-full pl-4 pr-10 py-2 bg-card border border-border rounded-xl text-foreground text-sm placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/70 mb-1">
                    {t.passwordLabel}
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-foreground/45 hover:text-foreground/80 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="block w-full pl-4 pr-10 py-2 bg-card border border-border rounded-xl text-foreground text-sm placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-medium">
                <label className="flex items-center gap-2 text-foreground/70 cursor-pointer select-none">
                  <input
                     type="checkbox"
                     checked={rememberMe}
                     onChange={(e) => setRememberMe(e.target.checked)}
                     className="rounded border-border bg-card text-primary focus:ring-0 focus:ring-offset-0 h-4 w-4"
                  />
                  <span>{t.rememberMe}</span>
                </label>
                <a href="#forgot" className="text-primary hover:text-primary/80 transition-colors">
                  {t.forgotPassword}
                </a>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg hover:shadow-primary/25 active:scale-95 disabled:opacity-50"
                >
                  {loading ? t.signingIn : t.signIn}
                </button>
              </div>
            </form>

            <div className="p-2 bg-primary/5 border border-primary/10 rounded-xl text-[10px] text-foreground/85 flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{t.autoRoleNotice}</span>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full flex items-center justify-center gap-1.5 py-0.5 text-xs font-semibold text-foreground/65 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{t.backStep}</span>
            </button>
          </div>
        )}

      </div>

      <div className="w-full max-w-md text-center text-foreground/50 text-[11px] font-medium mt-4 space-x-4 z-10">
        <a href="#help" className="hover:text-foreground/75 transition-colors mx-2">{t.help}</a>
        <span className="text-border">|</span>
        <a href="#support" className="hover:text-foreground/75 transition-colors mx-2">{t.support}</a>
        <span className="text-border">|</span>
        <span className="mx-2">{t.version}: 3.0.0 (Global Enterprise)</span>
      </div>
    </div>
  );
};
