const fs = require('fs');
const file = 'frontend/src/pages/UnifiedDashboard.tsx';
let content = fs.readFileSync(file, 'utf-8');

const anchor = "{/* LEAVE APPROVALS & LEAVE MANAGEMENT & TEACHER LEAVE REQUESTS */}";

const block = `
              {/* STUDENT ADVANCED MODULES */}
              {(activeFeature === 'Student Goal Tracking') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    🎯 Set academic goals and track your progress in real-time. Keep pushing your limits!
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Goal creation */}
                    <div className="md:col-span-1 p-4 bg-muted/30 border border-border rounded-xl space-y-3 h-fit">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Create New Goal</span>
                      <input 
                        type="text" 
                        placeholder="e.g. Score 95% in Math Finals" 
                        value={newGoalTitle}
                        onChange={(e) => setNewGoalTitle(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" 
                      />
                      <button 
                        onClick={() => {
                          if(!newGoalTitle) return;
                          setStudentGoals(prev => [{ id: Date.now().toString(), title: newGoalTitle, status: 'Not Started', progress: 0 }, ...prev]);
                          setNewGoalTitle('');
                        }}
                        className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                      >
                        Add Goal
                      </button>
                    </div>

                    {/* Goal List */}
                    <div className="md:col-span-2 space-y-3">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Active Goals</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {studentGoals.map(goal => (
                          <div key={goal.id} className="p-3.5 bg-card border border-border rounded-xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                            <div className="flex justify-between items-start mb-2 pl-2">
                              <strong className="text-sm text-foreground pr-2">{goal.title}</strong>
                              <span className={\`text-[10px] px-2 py-0.5 rounded font-bold whitespace-nowrap \${goal.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}\`}>
                                {goal.status}
                              </span>
                            </div>
                            <div className="pl-2 space-y-1 mt-3">
                              <div className="flex justify-between text-[10px] font-bold text-foreground/60">
                                <span>Progress</span>
                                <span>{goal.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-1000" style={{ width: \`\${goal.progress}%\` }}></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'GPA & Progress Analytics') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📈 Analyze your GPA progression across semesters and subject-wise performance benchmarks.
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* GPA Chart Mock */}
                    <div className="p-5 bg-card border border-border rounded-xl flex flex-col justify-between">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-4">Semester GPA Trend</span>
                      <div className="flex items-end gap-2 h-40">
                        {[3.1, 3.4, 3.2, 3.6, 3.8, 3.85].map((gpa, i) => (
                          <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1 group">
                            <div className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-foreground transition-opacity">{gpa}</div>
                            <div className="w-full bg-primary/40 hover:bg-primary transition-colors rounded-t-sm" style={{ height: \`\${(gpa / 4.0) * 100}%\` }}></div>
                            <span className="text-[9px] text-muted-foreground font-mono">Sem {i+1}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                        <span className="text-xs text-foreground/70">Current Cumulative GPA</span>
                        <strong className="text-xl text-emerald-400 font-black">3.85 / 4.0</strong>
                      </div>
                    </div>

                    {/* Subject Radar/Bars Mock */}
                    <div className="p-5 bg-card border border-border rounded-xl">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-4">Subject Proficiency</span>
                      <div className="space-y-4">
                        {[
                          { subject: 'Physics', score: 92, color: 'bg-purple-500' },
                          { subject: 'Chemistry', score: 88, color: 'bg-emerald-500' },
                          { subject: 'Mathematics', score: 96, color: 'bg-blue-500' },
                          { subject: 'English', score: 85, color: 'bg-amber-500' }
                        ].map(s => (
                          <div key={s.subject} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-foreground">
                              <span>{s.subject}</span>
                              <span>{s.score}%</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div className={\`h-full \${s.color}\`} style={{ width: \`\${s.score}%\` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Achievement System') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    🏆 Unlock badges and earn recognition by completing academic challenges and maintaining high standards!
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[
                      { title: 'Perfect Attendance', desc: 'No absences in Q1', icon: '⏰', unlocked: true },
                      { title: 'Math Wizard', desc: 'Score >95% in Math', icon: '🧮', unlocked: true },
                      { title: 'Science Fair Pro', desc: 'Top 3 in Science Fair', icon: '🔬', unlocked: true },
                      { title: 'Bookworm', desc: 'Read 10 library books', icon: '📚', unlocked: false },
                      { title: 'Helpful Peer', desc: 'Assist 5 classmates', icon: '🤝', unlocked: false },
                      { title: 'Homework Hero', desc: '100% submission rate', icon: '📝', unlocked: true },
                    ].map((badge, i) => (
                      <div key={i} className={\`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all \${badge.unlocked ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)] scale-100' : 'bg-card border-border opacity-50 grayscale scale-95'}\`}>
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <strong className={\`text-xs block mb-1 \${badge.unlocked ? 'text-amber-500 font-black' : 'text-foreground'}\`}>{badge.title}</strong>
                        <span className="text-[10px] text-foreground/60 leading-tight">{badge.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeFeature === 'Digital Certificates') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    🎓 Download your official, digitally signed certificates for course completions and special achievements.
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {studentCertificates.map(cert => (
                      <div key={cert.id} className="p-5 bg-card border border-border rounded-xl relative overflow-hidden group hover:border-primary/50 transition-colors">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
                        <div className="flex flex-col h-full justify-between gap-4 relative z-10">
                          <div>
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-3">
                              <Award className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-black text-foreground pr-2">{cert.title}</h4>
                            <span className="text-xs text-muted-foreground block mt-2">Issued by: {cert.issuer}</span>
                            <span className="text-xs text-muted-foreground block">Date: {cert.issueDate}</span>
                          </div>
                          <button className="flex items-center justify-center w-full mt-2 gap-2 py-2 rounded-lg bg-muted border border-border text-xs font-bold text-foreground hover:bg-card hover:text-primary transition-colors">
                            Download PDF <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeFeature === 'Study Planner' || activeFeature === 'Exam Preparation Tracker' || activeFeature === 'Homework Reminder') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📅 Manage your study schedule, track exam preparation, and get reminded of upcoming homework deadlines.
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 p-4 bg-muted/30 border border-border rounded-xl space-y-3 h-fit">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Add Study Task</span>
                      <input 
                        type="text" 
                        placeholder="Task Name (e.g. Read Physics Ch2)" 
                        value={newStudyTaskTitle}
                        onChange={(e) => setNewStudyTaskTitle(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg text-xs p-2.5 text-foreground" 
                      />
                      <div className="flex gap-2">
                        <input type="date" className="w-1/2 bg-card border border-border rounded-lg text-xs p-2 text-foreground" />
                        <input type="time" className="w-1/2 bg-card border border-border rounded-lg text-xs p-2 text-foreground" />
                      </div>
                      <button 
                        onClick={() => {
                          if(!newStudyTaskTitle) return;
                          setStudyTasks(prev => [{ id: Date.now().toString(), title: newStudyTaskTitle, date: new Date().toISOString().split('T')[0], time: '12:00', completed: false }, ...prev]);
                          setNewStudyTaskTitle('');
                        }}
                        className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add to Planner
                      </button>
                    </div>

                    <div className="md:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                        <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Upcoming Tasks & Exams</span>
                        <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-1 rounded font-bold">Next 7 Days</span>
                      </div>
                      <div className="divide-y divide-border flex-1">
                        {studyTasks.map(task => (
                          <div key={task.id} className="p-3.5 flex items-center gap-3 hover:bg-muted/10 transition-colors">
                            <input 
                              type="checkbox" 
                              checked={task.completed} 
                              onChange={() => setStudyTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-card"
                            />
                            <div className={\`flex-1 \${task.completed ? 'opacity-50 line-through' : ''}\`}>
                              <strong className="text-sm font-semibold text-foreground block">{task.title}</strong>
                              <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 mt-0.5">
                                <CalendarDays className="w-3 h-3" /> {task.date} @ {task.time}
                              </span>
                            </div>
                            {!task.completed && (
                              <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[9px] font-bold rounded flex items-center gap-1 uppercase">
                                <Bell className="w-2.5 h-2.5" /> Reminder On
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'AI Study Assistant') && (
                <div className="space-y-4 animate-fadeIn h-full flex flex-col min-h-[500px]">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-500" />
                    <span>Hi! I am your AI Study Tutor. Ask me to explain a concept, summarize a chapter, or create a quiz.</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                      {aiChatResponses.map((chat, i) => (
                        <div key={i} className="space-y-4">
                          {/* User Message */}
                          <div className="flex justify-end">
                            <div className="bg-primary text-white text-sm py-2 px-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                              {chat.query}
                            </div>
                          </div>
                          {/* AI Response */}
                          {chat.response && (
                            <div className="flex justify-start">
                              <div className="bg-muted text-foreground text-sm py-2 px-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm leading-relaxed border border-border">
                                {chat.response}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {studioLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted text-foreground text-sm py-3 px-4 rounded-2xl rounded-tl-none border border-border flex gap-1 items-center">
                            <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Chat Input */}
                    <div className="p-3 bg-muted/30 border-t border-border flex items-center gap-2 mt-auto">
                      <input 
                        type="text" 
                        value={aiChatQuery}
                        onChange={(e) => setAiChatQuery(e.target.value)}
                        placeholder="Ask a question..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && aiChatQuery.trim()) {
                            const q = aiChatQuery;
                            setAiChatQuery('');
                            setStudioLoading(true);
                            setAiChatResponses(prev => [...prev, { query: q, response: '' }]);
                            setTimeout(() => {
                              setAiChatResponses(prev => {
                                const newArr = [...prev];
                                newArr[newArr.length - 1].response = "I am an AI Study Assistant prototype! In a real environment, I would analyze your question about '" + q + "' and provide an interactive explanation.";
                                return newArr;
                              });
                              setStudioLoading(false);
                            }, 1500);
                          }
                        }}
                        className="flex-1 bg-card border border-border rounded-full px-4 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none"
                      />
                      <button 
                        onClick={() => {
                          if (!aiChatQuery.trim()) return;
                          const q = aiChatQuery;
                          setAiChatQuery('');
                          setStudioLoading(true);
                          setAiChatResponses(prev => [...prev, { query: q, response: '' }]);
                          setTimeout(() => {
                            setAiChatResponses(prev => {
                              const newArr = [...prev];
                              newArr[newArr.length - 1].response = "I am an AI Study Assistant prototype! In a real environment, I would analyze your question about '" + q + "' and provide an interactive explanation.";
                              return newArr;
                            });
                            setStudioLoading(false);
                          }, 1500);
                        }}
                        className="p-2 bg-primary hover:bg-primary/90 text-white rounded-full transition-colors flex-shrink-0 shadow-md"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
`;

content = content.replace(anchor, block + "\\n" + anchor);
fs.writeFileSync(file, content);
