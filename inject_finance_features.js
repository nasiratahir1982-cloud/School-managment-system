const fs = require('fs');
const file = 'frontend/src/pages/UnifiedDashboard.tsx';
let content = fs.readFileSync(file, 'utf-8');

const anchorFinance = `{(activeFeature === 'Fee Monitoring' || activeFeature === 'Fee Status' || activeFeature === 'Fee Payments' || activeFeature === 'Fee Collection' || activeFeature === 'Fee Defaulters' || activeFeature === 'Invoicing') && (`;

const newFinanceBlocks = `
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
                            <div className="w-1/3 bg-emerald-500/60 group-hover:bg-emerald-500 transition-all rounded-t-sm" style={{ height: \`\${(m.in / 250) * 100}%\` }} title={\`Inflow: \${m.in}k\`}></div>
                            {/* Outflow Bar */}
                            <div className="w-1/3 bg-rose-500/60 group-hover:bg-rose-500 transition-all rounded-t-sm" style={{ height: \`\${(m.out / 250) * 100}%\` }} title={\`Outflow: \${m.out}k\`}></div>
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
                              <div className={\`h-full \${b.color}\`} style={{ width: \`\${(b.spent/b.allocated)*100}%\` }}></div>
                            </div>
                            <span className="text-[9px] text-muted-foreground flex justify-end">
                              {\`\${Math.round((b.spent/b.allocated)*100)}% Consumed\`}
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

` + anchorFinance;

content = content.replace(anchorFinance, newFinanceBlocks);
fs.writeFileSync(file, content);
