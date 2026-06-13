const fs = require('fs');
const file = 'frontend/src/pages/UnifiedDashboard.tsx';
let content = fs.readFileSync(file, 'utf-8');

const anchorSecurityEnd = `              {/* SYSTEM SECURITY MODULES */}`;

const newBlocks = `
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
                              <span className={\`px-2 py-0.5 bg-\${row.color}-500/10 text-\${row.color}-500 rounded font-bold\`}>{row.status}</span>
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
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-bold rounded">Approve</button>
                              <button className="px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[9px] font-bold rounded">Reject</button>
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
                       <table className="w-full min-w-[600px] text-center border-collapse">
                         <thead>
                           <tr className="border-b border-border text-[10px] font-black text-muted-foreground uppercase">
                             <th className="p-2 border-r border-border/50">Time</th>
                             <th className="p-2 border-r border-border/50">Monday</th>
                             <th className="p-2 border-r border-border/50">Tuesday</th>
                             <th className="p-2 border-r border-border/50">Wednesday</th>
                           </tr>
                         </thead>
                         <tbody className="text-[10px]">
                           <tr className="border-b border-border/50">
                             <td className="p-2 border-r border-border/50 font-bold">08:00 AM</td>
                             <td className="p-2 border-r border-border/50 bg-blue-500/10 text-blue-500 font-semibold">Physics (Lab)</td>
                             <td className="p-2 border-r border-border/50 bg-emerald-500/10 text-emerald-500 font-semibold">Maths</td>
                             <td className="p-2 border-r border-border/50 bg-amber-500/10 text-amber-500 font-semibold">English</td>
                           </tr>
                           <tr className="border-b border-border/50">
                             <td className="p-2 border-r border-border/50 font-bold">09:00 AM</td>
                             <td className="p-2 border-r border-border/50 bg-emerald-500/10 text-emerald-500 font-semibold">Maths</td>
                             <td className="p-2 border-r border-border/50 bg-purple-500/10 text-purple-500 font-semibold">Chemistry</td>
                             <td className="p-2 border-r border-border/50 bg-rose-500/10 text-rose-500 font-semibold">Biology</td>
                           </tr>
                         </tbody>
                       </table>
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
                        <button className="w-full flex justify-between items-center p-3 bg-muted/20 border border-border rounded-lg text-[11px] text-foreground hover:border-primary transition-colors">
                          <span className="font-bold">Generate Date Sheet</span> <ChevronRight className="w-3 h-3 text-muted-foreground" />
                        </button>
                        <button className="w-full flex justify-between items-center p-3 bg-muted/20 border border-border rounded-lg text-[11px] text-foreground hover:border-primary transition-colors">
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
                           btn.innerHTML = '<span class="animate-pulse">Aggregating Subject Grades...</span>';
                           setTimeout(() => btn.innerHTML = '✅ Report Cards Compiled & Ready for Print', 2000);
                        }}
                        className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                      >
                        Compile Final Results
                      </button>
                    </div>
                  </div>
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

` + anchorSecurityEnd;

content = content.replace(anchorSecurityEnd, newBlocks);
fs.writeFileSync(file, content);
console.log("Injected HR & Academic modules.");
