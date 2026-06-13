const fs = require('fs');
const file = 'frontend/src/pages/UnifiedDashboard.tsx';
let content = fs.readFileSync(file, 'utf-8');

const anchorTeacherBlocks = `{(activeFeature === 'Attendance Monitoring' || activeFeature === 'Attendance Marking' || activeFeature === 'Child Attendance' || activeFeature === 'Attendance Ledger') && (`;

const newTeacherBlocks = `
              {/* TEACHER ADVANCED MODULES */}
              {(activeFeature === 'Lesson Planner') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📝 Create and upload your weekly lesson plans. Ensure alignment with the curriculum syllabus.
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Demo Lesson Plan */}
                    <div className="p-5 bg-card border border-border rounded-xl space-y-4 flex flex-col h-[400px]">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Demo Lesson Plan: Physics (Kinematics)</span>
                      <div className="flex-1 bg-muted/20 border border-border rounded-lg p-4 overflow-y-auto space-y-3">
                        <div className="space-y-1">
                          <strong className="text-xs text-foreground block">Objective:</strong>
                          <p className="text-[11px] text-muted-foreground">Students will understand Newton's First Law of Motion and be able to define inertia with real-world examples.</p>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-xs text-foreground block">Materials Required:</strong>
                          <p className="text-[11px] text-muted-foreground">Whiteboard, Physics Lab Kit #2 (Ramp, Cart, Weights), Projector.</p>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-xs text-foreground block">Instructional Sequence:</strong>
                          <ul className="list-disc list-inside text-[11px] text-muted-foreground space-y-0.5">
                            <li>Warm-up (5 mins): Discuss why passengers jerk forward when a bus stops.</li>
                            <li>Direct Instruction (15 mins): Define Inertia & Mass relationship.</li>
                            <li>Guided Practice (15 mins): Ramp & Cart experiment in groups.</li>
                            <li>Closure (5 mins): Quick exit ticket summarizing findings.</li>
                          </ul>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg transition-colors border border-primary/20">
                        Use as Template
                      </button>
                    </div>

                    {/* Upload Planner Form */}
                    <div className="p-5 bg-card border border-border rounded-xl space-y-4 flex flex-col h-[400px]">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Upload Weekly Plan (PDF)</span>
                      
                      <div className="flex-1 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center p-6 bg-muted/5 group hover:bg-muted/10 hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        <strong className="text-sm text-foreground block mb-1">Drag & Drop PDF Document</strong>
                        <span className="text-xs text-muted-foreground max-w-[200px]">Only .pdf files are accepted. Max size 5MB.</span>
                      </div>
                      
                      <div className="space-y-3">
                        <select className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold">
                          <option>Select Class Section</option>
                          <option>10-A (Physics)</option>
                          <option>9-B (Physics)</option>
                        </select>
                        <button 
                          onClick={(e) => { e.preventDefault(); alert("Lesson Plan uploaded and sent to Principal for review!"); }}
                          className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md flex justify-center items-center gap-2"
                        >
                          <Upload className="w-4 h-4" /> Submit to Principal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Class Diary') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📓 Maintain a daily log of topics covered and homework assigned for each class. Parents can view this on their portal.
                  </div>
                  
                  <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Daily Entry Form</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1 space-y-3">
                        <label className="text-[11px] font-bold text-muted-foreground">Class & Subject</label>
                        <select className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold">
                          <option>10-A (Physics)</option>
                          <option>9-B (Physics)</option>
                        </select>
                        <label className="text-[11px] font-bold text-muted-foreground mt-3 block">Date</label>
                        <input type="date" className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold" defaultValue={new Date().toISOString().split('T')[0]} />
                      </div>
                      <div className="md:col-span-2 space-y-3">
                        <label className="text-[11px] font-bold text-muted-foreground">Topics Covered Today</label>
                        <textarea rows={2} className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" placeholder="e.g. Discussed Chapter 4, Newton's Laws..."></textarea>
                        
                        <label className="text-[11px] font-bold text-muted-foreground mt-3 block">Homework / Next Steps</label>
                        <textarea rows={2} className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" placeholder="e.g. Complete Exercise 4.2..."></textarea>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2 border-t border-border/50">
                      <button 
                        onClick={() => alert("Class Diary Entry successfully published! Parents will receive a notification.")}
                        className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                      >
                        Publish Diary Entry
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Quiz Creation') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed flex justify-between items-center">
                    <span>✏️ Generate dynamic digital quizzes and online assessments for your students.</span>
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-[10px] font-black uppercase">Live Quiz Engine</span>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Create Form */}
                    <div className="lg:col-span-2 p-5 bg-card border border-border rounded-xl space-y-4">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Quiz Builder</span>
                      
                      <div className="flex gap-3">
                        <input type="text" placeholder="Quiz Title (e.g. End of Chapter 4 Test)" className="flex-1 bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" />
                        <input type="number" placeholder="Duration (Mins)" className="w-32 bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" />
                      </div>
                      
                      <div className="p-4 border border-border bg-muted/10 rounded-lg space-y-3">
                        <span className="text-[11px] font-bold text-primary flex items-center gap-2"><Plus className="w-3 h-3" /> Add Question 1</span>
                        <input type="text" placeholder="Type your question here..." className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border">
                            <input type="radio" name="q1" className="text-primary" />
                            <input type="text" placeholder="Option A" className="flex-1 bg-transparent text-xs outline-none" />
                          </div>
                          <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border">
                            <input type="radio" name="q1" className="text-primary" />
                            <input type="text" placeholder="Option B" className="flex-1 bg-transparent text-xs outline-none" />
                          </div>
                          <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border">
                            <input type="radio" name="q1" className="text-primary" />
                            <input type="text" placeholder="Option C" className="flex-1 bg-transparent text-xs outline-none" />
                          </div>
                          <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border">
                            <input type="radio" name="q1" className="text-primary" />
                            <input type="text" placeholder="Option D" className="flex-1 bg-transparent text-xs outline-none" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <button className="text-xs text-primary font-bold hover:underline">+ Add Another Question</button>
                        <button 
                          onClick={() => alert("Quiz Generated! A notification has been sent to the class.")}
                          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                        >
                          Generate & Publish Quiz
                        </button>
                      </div>
                    </div>

                    {/* Active Quizzes */}
                    <div className="lg:col-span-1 space-y-3">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Active Quizzes</span>
                      {[
                        { title: 'Physics Mid-term Prep', class: '10-A', subs: 14, tot: 28 },
                        { title: 'Basic Algebra Test', class: '9-B', subs: 25, tot: 25 },
                      ].map((q, i) => (
                        <div key={i} className="p-3.5 bg-card border border-border rounded-xl border-l-4 border-l-primary flex flex-col gap-2">
                          <strong className="text-xs text-foreground block truncate">{q.title}</strong>
                          <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
                            <span>Class: {q.class}</span>
                            <span>{q.subs}/{q.tot} Submitted</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1 mt-1">
                            <div className="bg-primary h-1 rounded-full" style={{ width: \`\${(q.subs/q.tot)*100}%\` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Student Remarks') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    🌟 Log individual student remarks regarding behavior, participation, and academic improvement.
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Add Remark</span>
                      <select className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold">
                        {students.map(s => <option key={s.id}>{s.name} ({s.className})</option>)}
                      </select>
                      <select className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold">
                        <option value="Positive">Positive / Reward</option>
                        <option value="Improvement">Needs Improvement</option>
                        <option value="Behavioral">Behavioral Alert</option>
                      </select>
                      <textarea rows={4} className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" placeholder="Write detailed remark here..."></textarea>
                      <button 
                        onClick={() => alert("Remark logged! It is now visible on the Parent's Dashboard.")}
                        className="w-full py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                      >
                        Submit Remark
                      </button>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-xl space-y-3 overflow-y-auto max-h-[350px]">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">Recent Logs</span>
                      {[
                        { student: 'Kamran Shah', type: 'Positive', text: 'Excellent participation in the Physics lab experiment today.' },
                        { student: 'Ali Raza', type: 'Improvement', text: 'Needs to focus more on completing homework on time.' },
                      ].map((r, i) => (
                        <div key={i} className="p-3 bg-muted/30 border border-border rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <strong className="text-xs text-foreground">{r.student}</strong>
                            <span className={\`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase \${r.type === 'Positive' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}\`}>
                              {r.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

` + anchorTeacherBlocks;

content = content.replace(anchorTeacherBlocks, newTeacherBlocks);
fs.writeFileSync(file, content);
