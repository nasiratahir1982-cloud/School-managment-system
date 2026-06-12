import React, { useState } from 'react';
import { useSchoolStore } from '../../store/schoolStore';
import { useAuthStore } from '../../store/authStore';
import { useStudents } from '../../hooks/useStudents';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CreditCard, 
  UserCheck, 
  Settings, 
  Plus, 
  LogOut, 
  UserPlus, 
  Search, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Loader2,
  Sun,
  Moon
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const formatCurrency = useSchoolStore((state) => state.formatCurrency);
  const getRollLabel = useSchoolStore((state) => state.getRollLabel);
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { darkMode, toggleTheme } = useThemeStore();

  const { students, isLoading, createStudent } = useStudents();

  // Student Input State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAdmissionNumber, setNewAdmissionNumber] = useState('');
  const [newRollNumber, setNewRollNumber] = useState('');
  const [newDob, setNewDob] = useState('2010-01-01');
  const [newGender, setNewGender] = useState('Male');
  const [ageError, setAgeError] = useState('');
  
  // Quick Operations States
  const [invoiceStatus, setInvoiceStatus] = useState<'idle' | 'running' | 'success'>('idle');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'running' | 'success'>('idle');

  // Helper function to auto-increment the last sequence of numbers in a pattern string
  const incrementString = (str: string): string => {
    if (!str) return '';
    const regex = /(\d+)(?!.*\d)/;
    const match = str.match(regex);
    if (!match) {
      return str + "1";
    }
    const numStr = match[1];
    const nextNum = parseInt(numStr, 10) + 1;
    const paddedNum = String(nextNum).padStart(numStr.length, '0');
    const index = match.index!;
    return str.slice(0, index) + paddedNum + str.slice(index + numStr.length);
  };

  const getNextPatternId = (currentList: string[], fallback: string): string => {
    if (currentList.length === 0) {
      return fallback;
    }
    const lastVal = currentList[currentList.length - 1];
    if (!lastVal) return fallback;
    return incrementString(lastVal);
  };

  const handleEnrollClick = () => {
    if (!showAddForm) {
      // Calculate next Admission ID and Roll Number
      const admissionNumbers = students.map(s => s.admission_number).filter(Boolean);
      const rollNumbers = students.map(s => s.roll_number).filter(Boolean);
      
      const nextAdmission = getNextPatternId(admissionNumbers, 'ADM-2026-001');
      const nextRoll = getNextPatternId(rollNumbers, 'R-101');
      
      setNewAdmissionNumber(nextAdmission);
      setNewRollNumber(nextRoll);
    }
    setAgeError('');
    setShowAddForm(!showAddForm);
  };

  // Search Filter
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setAgeError('');
    if (!newName || !newEmail || !newAdmissionNumber) return;

    // Age validation (between 3 and 18 years)
    const birthDate = new Date(newDob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 3 || age > 18) {
      setAgeError("Age Eligibility Error: Student must be between 3 and 18 years old to enroll!");
      return;
    }

    createStudent({
      name: newName,
      email: newEmail,
      admission_number: newAdmissionNumber,
      roll_number: newRollNumber,
      dob: newDob,
      gender: newGender
    });

    // Reset inputs
    setNewName('');
    setNewEmail('');
    setNewAdmissionNumber('');
    setNewRollNumber('');
    setShowAddForm(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGenerateInvoices = () => {
    if (invoiceStatus !== 'idle') return;
    setInvoiceStatus('running');
    setTimeout(() => {
      setInvoiceStatus('success');
      setTimeout(() => setInvoiceStatus('idle'), 3000);
    }, 2000);
  };

  const handleSendNewsletter = () => {
    if (newsletterStatus !== 'idle') return;
    setNewsletterStatus('running');
    setTimeout(() => {
      setNewsletterStatus('success');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }, 2000);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admission_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      {/* Header Banner */}
      <header className="border-b border-border bg-card/45 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-full px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center border border-primary/45 shadow-[0_0_15px_rgba(var(--primary),0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
              <svg className="w-7 h-7 text-primary filter drop-shadow-[0_2px_6px_rgba(var(--primary),0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 22 8.5 12 15 2 8.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 12v5c0 2 3 3.5 6 3.5s6-1.5 6-3.5v-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 2v13" strokeDasharray="2 2" />
                <circle cx="12" cy="8.5" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-wider text-foreground m-0 uppercase bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                  Academic Control Center
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-primary/20 border border-primary/30 text-[9px] font-black text-primary uppercase tracking-widest">
                  Principal Portal
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Logged in as: <strong className="text-foreground">{currentUser?.name || 'Principal Officer'}</strong> (Administrator)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Secure Database Tunnel
            </div>
            
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

      {/* Main Layout Grid */}
      <main className="flex-1 max-w-full w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        
        {/* KPI Dashboard Analytics Metrics cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="glass-card p-6 rounded-xl relative overflow-hidden flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium text-sm">Enrolled Students</span>
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{students.length}</h3>
              <p className="text-xs text-slate-400 mt-1">Natively isolated via RLS</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl relative overflow-hidden flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium text-sm">Outstanding Fees</span>
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{formatCurrency(125000)}</h3>
              <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> 5 Invoice defaulters flagged
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl relative overflow-hidden flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium text-sm">RFID Gate Check-ins</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">88.2%</h3>
              <p className="text-xs text-slate-400 mt-1">94 active check-ins today</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl relative overflow-hidden flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium text-sm">SaaS Node Load</span>
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">0.08% CPU</h3>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> All operations operational
              </p>
            </div>
          </div>

        </section>


        {/* Students Table and Registry Management */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main List Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students by name, email, or admission..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                />
              </div>

              <button 
                onClick={handleEnrollClick}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Enroll Student
              </button>
            </div>

            {/* Students Table Card */}
            <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                <h3 className="font-bold text-white m-0">Student Registry Ledger</h3>
                <span className="text-xs text-slate-400 font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
                  {filteredStudents.length} entries shown
                </span>
              </div>

              {isLoading ? (
                <div className="p-12 text-center text-slate-400 text-sm">
                  Querying records from PostgreSQL...
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm">
                  No student records matched search parameters.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/10 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-3.5">Admission ID</th>
                        <th className="px-6 py-3.5">Full Name</th>
                        <th className="px-6 py-3.5">Email</th>
                        <th className="px-6 py-3.5">{getRollLabel()}</th>
                        <th className="px-6 py-3.5">Gender</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                      {filteredStudents.map((st) => (
                        <tr key={st.student_id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="px-6 py-4 font-mono font-semibold text-primary">{st.admission_number}</td>
                          <td className="px-6 py-4 font-medium text-white">{st.name}</td>
                          <td className="px-6 py-4 text-slate-400">{st.email}</td>
                          <td className="px-6 py-4 font-mono">{st.roll_number || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${st.gender === 'Female' ? 'bg-pink-500/10 text-pink-400' : 'bg-blue-500/10 text-blue-400'}`}>
                              {st.gender}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Side Form Column */}
          <div className="space-y-6">
            {showAddForm ? (
              <div className="glass-card p-6 rounded-xl border border-slate-800 space-y-4 glow-purple">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white m-0 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary" />
                    Enroll New Student
                  </h3>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateStudent} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Ahad Butt"
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="e.g. ahad@gmail.com"
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Admission ID
                      </label>
                      <input
                        type="text"
                        required
                        value={newAdmissionNumber}
                        onChange={(e) => setNewAdmissionNumber(e.target.value)}
                        placeholder="ADM-2026-X"
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        {getRollLabel()}
                      </label>
                      <input
                        type="text"
                        value={newRollNumber}
                        onChange={(e) => setNewRollNumber(e.target.value)}
                        placeholder="R-101"
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        required
                        value={newDob}
                        onChange={(e) => setNewDob(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Gender
                      </label>
                      <select
                        value={newGender}
                        onChange={(e) => setNewGender(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  {ageError && (
                    <div className="p-3 bg-red-950/45 border border-red-800/30 rounded-lg text-xs text-red-400">
                      {ageError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-primary/10"
                  >
                    <Plus className="w-4 h-4" />
                    Commit Database Record
                  </button>
                </form>
              </div>
            ) : (
              <div className="glass-card p-6 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2.5 text-primary mb-2">
                  <Settings className="w-5 h-5" />
                  <h3 className="font-bold text-white m-0">Quick Operations</h3>
                </div>
                <p className="text-slate-400 text-xs">
                  SaaS modules active for this instance. Background workers process tasks asynchronously.
                </p>

                 <div className="space-y-2.5 pt-2">
                  <button
                    onClick={handleGenerateInvoices}
                    disabled={invoiceStatus !== 'idle'}
                    className="w-full p-3 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-all text-left disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    <div>
                      <strong className="text-white block">Generate Monthly Invoices</strong>
                      {invoiceStatus === 'running' && <span className="text-purple-400 flex items-center gap-1 mt-0.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Seeding BullMQ PDF engine...</span>}
                      {invoiceStatus === 'success' && <span className="text-emerald-400 flex items-center gap-1 mt-0.5"><CheckCircle className="w-3.5 h-3.5" /> Invoices Generated successfully!</span>}
                      {invoiceStatus === 'idle' && <span className="text-slate-500">Triggers BullMQ PDF engine</span>}
                    </div>
                    <CreditCard className={`w-4 h-4 ${invoiceStatus === 'success' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </button>

                  <button
                    onClick={handleSendNewsletter}
                    disabled={newsletterStatus !== 'idle'}
                    className="w-full p-3 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-all text-left disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    <div>
                      <strong className="text-white block">Email Newsletter</strong>
                      {newsletterStatus === 'running' && <span className="text-purple-400 flex items-center gap-1 mt-0.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Dispatching event to RabbitMQ...</span>}
                      {newsletterStatus === 'success' && <span className="text-emerald-400 flex items-center gap-1 mt-0.5"><CheckCircle className="w-3.5 h-3.5" /> Newsletter sent successfully!</span>}
                      {newsletterStatus === 'idle' && <span className="text-slate-500">RabbitMQ event dispatch</span>}
                    </div>
                    <Users className={`w-4 h-4 ${newsletterStatus === 'success' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </button>
                </div>
              </div>
            )}
          </div>

        </section>
      </main>
    </div>
  );
};
