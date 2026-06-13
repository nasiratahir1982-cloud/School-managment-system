const fs = require('fs');
const file = 'frontend/src/pages/UnifiedDashboard.tsx';
let content = fs.readFileSync(file, 'utf-8');

// 1. Replace the Pay Online button with Easypaisa/Stripe mock
const oldPayButtonStr = `
                                  onClick={() => {
                                    setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'Paid' } : i));
                                    alert(\`Fee Payment of \${formatCurrency(inv.amount)} Processed Successfully via online banking!\`);
                                  }}
                                  className="px-3 py-1.5 bg-primary hover:bg-primary/95 text-white rounded-lg text-xs font-bold transition-all shadow"
                                >
                                  Pay Online
                                </button>
`;

const newPayButtonStr = `
                                  onClick={() => {
                                    const method = window.prompt("Select Payment Method:\\n1. Easypaisa\\n2. Stripe (Credit/Debit Card)\\n\\nEnter 1 or 2:");
                                    if (method === '1' || method === '2') {
                                      setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'Paid' } : i));
                                      const mName = method === '1' ? 'Easypaisa Mobile Wallet' : 'Stripe Secure Gateway';
                                      alert(\`✅ Payment of \${formatCurrency(inv.amount)} Processed Successfully via \${mName}!\`);
                                    } else if (method) {
                                      alert("Invalid selection. Payment cancelled.");
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1"
                                >
                                  <CreditCard className="w-3.5 h-3.5" /> Pay Now
                                </button>
`;

content = content.replace(oldPayButtonStr, newPayButtonStr);

// 2. Inject the Student Progress Graphs block
const anchorNotices = `{(activeFeature === 'School Notices' || activeFeature === 'Notifications' || activeFeature === 'Notifications Log' || activeFeature === 'Global Announcements') && (`;

const newGraphsBlock = `
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
                            <div className="w-full bg-primary/40 group-hover:bg-primary transition-all rounded-t-md relative overflow-hidden" style={{ height: \`\${(stat.gpa / stat.max) * 100}%\` }}>
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
                                <div className={\`w-2 h-2 rounded-full \${s.color}\`}></div>
                                {s.sub}
                              </span>
                              <span>{s.score}% <span className="text-[9px] text-foreground/40 font-normal ml-1">(Class Avg: {s.avg}%)</span></span>
                            </div>
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden relative">
                              {/* Class Average Marker */}
                              <div className="absolute top-0 bottom-0 w-0.5 bg-foreground/30 z-10" style={{ left: \`\${s.avg}%\` }}></div>
                              {/* Student Score */}
                              <div className={\`h-full \${s.color} transition-all duration-1000\`} style={{ width: \`\${s.score}%\` }}></div>
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

`;

content = content.replace(anchorNotices, newGraphsBlock + anchorNotices);
fs.writeFileSync(file, content);
