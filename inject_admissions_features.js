const fs = require('fs');
const file = 'frontend/src/pages/UnifiedDashboard.tsx';
let content = fs.readFileSync(file, 'utf-8');

const anchorFinance = `              {/* FINANCE / ACCOUNTING MODULES */}`;

const newAdmissionsBlocks = `
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
                                  alert(\`OCR Scan Complete for \${file.name}. Document is authentic.\`);
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

` + anchorFinance;

content = content.replace(anchorFinance, newAdmissionsBlocks);
fs.writeFileSync(file, content);
