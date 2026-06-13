const fs = require('fs');
const file = 'frontend/src/pages/UnifiedDashboard.tsx';
let content = fs.readFileSync(file, 'utf-8');

const anchorCommEnd = `              {/* SYSTEM SECURITY MODULES */}`;

const newBlocks = `
              {/* EXECUTIVE DASHBOARDS */}
              {(activeFeature === 'School KPI Dashboard' || activeFeature === 'Revenue Dashboard' || activeFeature === 'Student Growth Dashboard' || activeFeature === 'Teacher Performance Dashboard') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
                    <button className={\`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors \${activeFeature === 'School KPI Dashboard' ? 'bg-primary text-white' : 'bg-muted/50 text-foreground hover:bg-muted'}\`}>School KPI</button>
                    <button className={\`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors \${activeFeature === 'Revenue Dashboard' ? 'bg-emerald-500 text-white' : 'bg-muted/50 text-foreground hover:bg-muted'}\`}>Revenue</button>
                    <button className={\`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors \${activeFeature === 'Student Growth Dashboard' ? 'bg-blue-500 text-white' : 'bg-muted/50 text-foreground hover:bg-muted'}\`}>Student Growth</button>
                    <button className={\`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors \${activeFeature === 'Teacher Performance Dashboard' ? 'bg-purple-500 text-white' : 'bg-muted/50 text-foreground hover:bg-muted'}\`}>Teacher Performance</button>
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

` + anchorCommEnd;

content = content.replace(anchorCommEnd, newBlocks);
fs.writeFileSync(file, content);
console.log("Injected Executive Dashboards modules.");
