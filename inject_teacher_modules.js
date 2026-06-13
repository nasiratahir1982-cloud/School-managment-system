const fs = require('fs');
const file = 'frontend/src/pages/UnifiedDashboard.tsx';
let content = fs.readFileSync(file, 'utf-8');

const anchorTeacherEnd = `              {/* EXECUTIVE DASHBOARDS */}`;

const newBlocks = `
              {/* TEACHER MODULES */}
              {(activeFeature === 'Assignment Creation' || activeFeature === 'Quiz Creation') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 p-5 bg-card border border-border rounded-xl space-y-4">
                      <strong className="text-xs font-bold text-foreground uppercase tracking-wider block flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> New Assignment</strong>
                      <div className="space-y-3">
                        <input type="text" placeholder="Assignment Title (e.g. Physics Chapter 4)" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground" />
                        <textarea placeholder="Instructions for students..." className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground h-20 resize-none"></textarea>
                        <div className="flex gap-2">
                           <input type="date" className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary text-muted-foreground" />
                           <select className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground">
                             <option>Grade 10 - Section A</option>
                             <option>Grade 9 - Section B</option>
                           </select>
                        </div>
                        <button 
                          onClick={(e) => {
                             const btn = e.currentTarget;
                             btn.innerHTML = 'Uploading Resource...';
                             setTimeout(() => btn.innerHTML = '✅ Assignment Published', 1500);
                          }}
                          className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Upload className="w-3 h-3" /> Publish Assignment
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 p-5 bg-card border border-border rounded-xl space-y-4">
                      <strong className="text-xs font-bold text-foreground uppercase tracking-wider block flex items-center gap-2"><HelpCircle className="w-4 h-4 text-purple-500" /> Interactive Quiz Builder</strong>
                      <div className="space-y-3">
                         <div className="p-3 bg-muted/20 border border-border rounded-lg">
                            <input type="text" placeholder="Question 1: What is the powerhouse of the cell?" className="w-full bg-transparent text-xs outline-none text-foreground mb-2" />
                            <div className="space-y-1 pl-4 border-l-2 border-purple-500/30">
                              <label className="flex items-center gap-2 text-[11px] text-muted-foreground"><input type="radio" name="q1" /> Nucleus</label>
                              <label className="flex items-center gap-2 text-[11px] text-muted-foreground"><input type="radio" name="q1" /> Mitochondria <span className="text-emerald-500 font-bold">(Correct)</span></label>
                              <label className="flex items-center gap-2 text-[11px] text-muted-foreground"><input type="radio" name="q1" /> Ribosome</label>
                            </div>
                         </div>
                         <button className="text-xs text-purple-500 font-bold hover:underline">+ Add Another Question</button>
                         <button className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs rounded-lg transition-colors">
                           Launch Live Quiz
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Lesson Planner' || activeFeature === 'Class Diary') && (
                <div className="space-y-4 animate-fadeIn">
                   <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-border/50">
                        <strong className="text-xs font-bold text-foreground uppercase tracking-wider">Weekly Lesson Plan</strong>
                        <div className="flex gap-2">
                           <button className="px-3 py-1 bg-muted text-foreground rounded text-[10px] font-bold">Previous Week</button>
                           <button className="px-3 py-1 bg-primary text-white rounded text-[10px] font-bold">Current Week</button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => (
                           <div key={i} className="p-3 bg-muted/10 border border-border rounded-lg text-center h-32 flex flex-col justify-between hover:border-primary/50 transition-colors cursor-pointer group">
                             <strong className="text-[10px] text-muted-foreground uppercase">{day}</strong>
                             {i === 1 ? (
                               <div className="bg-primary/10 text-primary text-[9px] p-2 rounded text-left leading-tight">
                                 <strong>Topic:</strong> Newton's Laws<br/>
                                 <em>Lab Experiment</em>
                               </div>
                             ) : (
                               <span className="text-[10px] text-muted-foreground/50 italic group-hover:text-primary transition-colors">+ Add Topic</span>
                             )}
                           </div>
                        ))}
                      </div>
                   </div>

                   <div className="p-5 bg-card border border-border rounded-xl">
                      <strong className="text-xs font-bold text-foreground uppercase tracking-wider block mb-4 flex items-center gap-2"><Edit className="w-4 h-4 text-emerald-500" /> Digital Class Diary</strong>
                      <div className="flex gap-4">
                        <textarea placeholder="Write today's diary note for parents (e.g. Please ensure students bring their geometry boxes tomorrow)..." className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-emerald-500 text-foreground h-24 resize-none"></textarea>
                        <button className="px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors">Publish to Parent Portal</button>
                      </div>
                   </div>
                </div>
              )}

              {(activeFeature === 'Attendance Entry') && (
                <div className="space-y-4 animate-fadeIn">
                   <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-border/50">
                        <strong className="text-xs font-bold text-foreground uppercase tracking-wider">Mark Daily Attendance</strong>
                        <span className="text-[10px] font-bold px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded">Grade 10 - Physics</span>
                      </div>
                      
                      <table className="w-full text-left border-collapse">
                         <thead>
                           <tr className="border-b border-border text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                             <th className="p-2">Roll No</th>
                             <th className="p-2">Student Name</th>
                             <th className="p-2 text-right">Status</th>
                           </tr>
                         </thead>
                         <tbody className="text-[11px] font-semibold">
                           {[
                             { roll: '10-A01', name: 'Ali Ahmed' },
                             { roll: '10-A02', name: 'Sara Khan' },
                             { roll: '10-A03', name: 'Usman Raza' },
                           ].map((stu, i) => (
                             <tr key={i} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                               <td className="p-2 text-muted-foreground">{stu.roll}</td>
                               <td className="p-2 text-foreground font-bold">{stu.name}</td>
                               <td className="p-2 text-right">
                                  <div className="inline-flex rounded-lg overflow-hidden border border-border">
                                    <button className="px-3 py-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors">Present</button>
                                    <button className="px-3 py-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-colors border-x border-border">Late</button>
                                    <button className="px-3 py-1 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors">Absent</button>
                                  </div>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                      </table>
                      <div className="flex justify-end">
                         <button 
                            onClick={(e) => {
                               const btn = e.currentTarget;
                               btn.innerHTML = 'Submitting...';
                               setTimeout(() => btn.innerHTML = '✅ Attendance Submitted', 1000);
                            }}
                            className="px-6 py-2 bg-primary text-white font-bold text-xs rounded-lg transition-colors"
                         >
                           Submit Register
                         </button>
                      </div>
                   </div>
                </div>
              )}

              {(activeFeature === 'Grade Book' || activeFeature === 'Student Remarks') && (
                <div className="space-y-4 animate-fadeIn">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Grade Book */}
                     <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                        <strong className="text-xs font-bold text-foreground uppercase tracking-wider block">Subject Grade Book</strong>
                        <div className="space-y-2">
                           <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase border-b border-border/50 pb-2">
                             <span>Student</span>
                             <span>Marks (Out of 100)</span>
                           </div>
                           <div className="flex justify-between items-center py-2 border-b border-border/50">
                             <span className="text-xs text-foreground font-bold">Ali Ahmed</span>
                             <input type="number" defaultValue="85" className="w-16 px-2 py-1 bg-background border border-border rounded text-xs text-center outline-none focus:border-primary text-foreground" />
                           </div>
                           <div className="flex justify-between items-center py-2 border-b border-border/50">
                             <span className="text-xs text-foreground font-bold">Sara Khan</span>
                             <input type="number" defaultValue="92" className="w-16 px-2 py-1 bg-background border border-border rounded text-xs text-center outline-none focus:border-primary text-foreground" />
                           </div>
                        </div>
                        <button className="w-full px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-lg transition-colors">Save Marks</button>
                     </div>

                     {/* Student Remarks */}
                     <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                        <strong className="text-xs font-bold text-foreground uppercase tracking-wider block">Issue Student Remarks</strong>
                        <div className="space-y-3">
                           <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground">
                             <option>Select Student: Usman Raza</option>
                           </select>
                           <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground">
                             <option>Badge: 🌟 Excellent Participation</option>
                             <option>Badge: ⚠️ Needs Improvement</option>
                           </select>
                           <textarea placeholder="Write a custom remark for the parent to see..." className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground h-16 resize-none"></textarea>
                           <button 
                              onClick={(e) => {
                                 const btn = e.currentTarget;
                                 btn.innerHTML = 'Sending to Parent...';
                                 setTimeout(() => btn.innerHTML = '✅ Remark Issued', 1000);
                              }}
                              className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-lg transition-colors"
                           >
                             Issue Badge & Remark
                           </button>
                        </div>
                     </div>
                   </div>
                </div>
              )}

` + anchorTeacherEnd;

content = content.replace(anchorTeacherEnd, newBlocks);
fs.writeFileSync(file, content);
console.log("Injected Teacher modules.");
