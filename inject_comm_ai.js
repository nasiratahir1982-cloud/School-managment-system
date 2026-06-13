const fs = require('fs');
const file = 'frontend/src/pages/UnifiedDashboard.tsx';
let content = fs.readFileSync(file, 'utf-8');

const anchorHREnd = `              {/* SYSTEM SECURITY MODULES */}`;

const newBlocks = `
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

` + anchorHREnd;

content = content.replace(anchorHREnd, newBlocks);
fs.writeFileSync(file, content);
console.log("Injected Communication & AI modules.");
