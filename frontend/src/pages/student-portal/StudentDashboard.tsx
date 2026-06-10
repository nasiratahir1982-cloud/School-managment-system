import React, { useState } from 'react';
import { useTenantStore } from '../../store/tenantStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  CreditCard, 
  LogOut, 
  DollarSign, 
  AlertCircle, 
  CheckCircle,
  FileText,
  Smartphone,
  Sun,
  Moon
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface FeeChallan {
  invoice_id: string;
  challan_number: string;
  amount: number;
  due_date: string;
  status: 'unpaid' | 'paid' | 'overdue';
}

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentTenant = useTenantStore((state) => state.currentTenant);
  const formatCurrency = useTenantStore((state) => state.formatCurrency);
  const getPhonePrefix = useTenantStore((state) => state.getPhonePrefix);
  const getRollLabel = useTenantStore((state) => state.getRollLabel);
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { darkMode, toggleTheme } = useThemeStore();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FeeChallan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // High fidelity mock database for student portal
  const [invoices, setInvoices] = useState<FeeChallan[]>([
    { invoice_id: 'i1', challan_number: 'CH-2026-9081', amount: 8500, due_date: '2026-06-15', status: 'unpaid' },
    { invoice_id: 'i2', challan_number: 'CH-2026-8022', amount: 8500, due_date: '2026-05-15', status: 'paid' },
    { invoice_id: 'i3', challan_number: 'CH-2026-7019', amount: 7200, due_date: '2026-04-15', status: 'paid' }
  ]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const triggerMockPayment = (gateway: string) => {
    if (!selectedInvoice) return;
    console.log('Initiating transaction processing via gateway:', gateway);
    setPaymentLoading(true);

    // Simulate standard transaction processing via RabbitMQ / DB update
    setTimeout(() => {
      setInvoices(prev => prev.map(inv => 
        inv.invoice_id === selectedInvoice.invoice_id 
          ? { ...inv, status: 'paid' as const } 
          : inv
      ));
      setPaymentLoading(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        setSelectedInvoice(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      
      {/* Student Top Bar */}
      <header className="border-b border-border bg-card/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-full px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/40 shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-foreground m-0 uppercase bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                {currentUser?.name || 'Student'}
              </h1>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Tenant: <strong className="text-foreground">{currentTenant?.schoolName || 'AcaHub'}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
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

      {/* Main Student Portal Layout */}
      <main className="flex-1 max-w-full w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        
        {/* Profile Card & Details */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 glass-card p-6 rounded-xl flex flex-col sm:flex-row gap-6 items-center">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60" 
              alt="Student avatar" 
              className="w-24 h-24 rounded-full object-cover border-2 border-primary/50 shadow-lg"
            />
            <div className="space-y-2 text-center sm:text-left">
              <span className="px-2.5 py-1 rounded bg-primary/20 text-primary border border-primary/40 text-xs font-semibold">
                Class 10 - Section A
              </span>
              <h2 className="text-2xl font-bold text-white mb-1">{currentUser?.name}</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-slate-400 text-xs">
                <div>{getRollLabel()}: <strong className="text-white">AH-1002</strong></div>
                <div>Admission ID: <strong className="text-white font-mono">ADM-2026-001</strong></div>
                <div>Emergency Phone: <strong className="text-white">{getPhonePrefix()} 300 1234567</strong></div>
                <div>Blood Group: <strong className="text-white">O+</strong></div>
              </div>
            </div>
          </div>

          {/* Attendance KPI Widget */}
          <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-medium text-sm">Attendance Summary</span>
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-3xl font-extrabold text-white">96.5%</h3>
                <span className="text-xs text-slate-400 block mt-1">110 school days attended</span>
              </div>
              <span className="text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Excellent
              </span>
            </div>
          </div>

        </section>

        {/* Ledger & Payments Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Challan list */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Fee Challan Records
            </h2>

            <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/20 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Challan Number</th>
                      <th className="px-6 py-4">Billing Amount</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Payment Status</th>
                      <th className="px-6 py-4 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                    {invoices.map((inv) => (
                      <tr key={inv.invoice_id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-white">{inv.challan_number}</td>
                        <td className="px-6 py-4 font-medium text-primary">{formatCurrency(inv.amount)}</td>
                        <td className="px-6 py-4 text-slate-400">{inv.due_date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            inv.status === 'paid' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : inv.status === 'overdue'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {inv.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {inv.status === 'unpaid' ? (
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setShowPaymentModal(true);
                              }}
                              className="bg-primary hover:bg-primary/95 text-white px-3 py-1.5 rounded text-xs font-bold transition-all shadow shadow-primary/20"
                            >
                              Pay Online
                            </button>
                          ) : (
                            <button className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white px-3 py-1.5 rounded text-xs ml-auto transition-colors">
                              <FileText className="w-3.5 h-3.5" />
                              Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side Info Panel */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white m-0 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                Notification Board
              </h3>
              <p className="text-slate-400 text-xs">
                Important updates from school management.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs">
                  <div className="flex justify-between items-center text-slate-400 mb-1">
                    <span>Principal Office</span>
                    <span>June 05</span>
                  </div>
                  <p className="text-slate-200 font-medium">
                    Summer vacation announcement: School will remain closed from June 15 to August 14.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs">
                  <div className="flex justify-between items-center text-slate-400 mb-1">
                    <span>Academics Head</span>
                    <span>June 01</span>
                  </div>
                  <p className="text-slate-200 font-medium">
                    Class 10 final exams schedule has been uploaded to the course materials section.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>
      </main>

      {/* Payment Gateway Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="modal-overlay bg-slate-950/80">
          <div className="modal-container modal-md glass-card glow-purple">
            
            {/* Modal Header */}
            <div className="modal-header">
              <div className="text-center w-full">
                <CreditCard className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">Academic Hub Checkout</h3>
                <p className="text-slate-400 text-xs">
                  Challan ID: <strong className="text-white font-mono">{selectedInvoice.challan_number}</strong>
                </p>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="absolute right-4 top-4 text-slate-500 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body space-y-5">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Payable:</span>
                <strong className="text-white text-base">{formatCurrency(selectedInvoice.amount)}</strong>
              </div>

              {paymentSuccess ? (
                <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-lg text-center text-sm font-semibold flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Transaction completed successfully!
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Select Payment Gateway
                  </span>

                  <button
                    onClick={() => triggerMockPayment('easypaisa')}
                    disabled={paymentLoading}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-lg text-white font-semibold transition-all disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <Smartphone className="w-5 h-5 text-emerald-400" />
                      EasyPaisa
                    </span>
                    <span className="text-xs text-slate-500 font-normal">Instant Mobile Checkout</span>
                  </button>

                  <button
                    onClick={() => triggerMockPayment('jazzcash')}
                    disabled={paymentLoading}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-lg text-white font-semibold transition-all disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <Smartphone className="w-5 h-5 text-red-500" />
                      JazzCash
                    </span>
                    <span className="text-xs text-slate-500 font-normal">Instant Wallet Checkout</span>
                  </button>

                  <button
                    onClick={() => triggerMockPayment('stripe')}
                    disabled={paymentLoading}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-lg text-white font-semibold transition-all disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <CreditCard className="w-5 h-5 text-indigo-400" />
                      Visa / Mastercard
                    </span>
                    <span className="text-xs text-slate-500 font-normal">Stripe Gateway</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer justify-center">
              <span className="text-slate-500 text-[10px] text-center">
                Secure double-entry ledger update with instant RabbitMQ invoice notification dispatch.
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
