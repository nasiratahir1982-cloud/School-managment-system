import re

def modify_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    target = """                  {/* Employee Staff Roster */}
                  <div className="space-y-3 pt-2 border-t border-border/60">
                    <span className="block text-xs font-bold text-foreground/75 uppercase tracking-wider">Employee Staff Roster</span>
                    <div className="flex flex-wrap justify-center gap-3">
                      {filteredTeachers.map((teach) => (
                        <div 
                          key={teach.id} 
                          onClick={() => setSelectedDetailedTeacher(teach)}
                          className="p-4 bg-card/60 border border-border rounded-xl flex items-center justify-between gap-3 hover:border-primary/45 hover:bg-card/80 transition-all w-full md:w-[calc(50%-6px)] cursor-pointer group shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            {teach.photo ? (
                              <img src={teach.photo} alt={teach.name} className="w-10 h-10 rounded-full object-cover border border-primary/20 shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-xs shrink-0 group-hover:scale-105 transition-transform">
                                {teach.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <strong className="block text-xs text-foreground font-bold group-hover:text-primary transition-colors">{teach.name}</strong>
                              <span className="text-[10px] font-bold text-primary block my-0.5">{teach.role || 'Teacher'}</span>
                              {(!teach.role || teach.role === 'Teacher') ? (
                                <span className="text-[10px] text-foreground/60 block">{teach.subject} | {teach.className}</span>
                              ) : (
                                <span className="text-[10px] text-foreground/60 block">Dep/Area: {teach.subject}</span>
                              )}
                              {teach.qualification && (
                                <span className="text-[9px] font-semibold text-primary block mt-0.5">{teach.qualification}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[9px] uppercase tracking-wider shrink-0">
                              Verified
                            </span>
                            {isEditor && (
                              <button 
                                onClick={() => requestSecureDelete(
                                  `Are you sure you want to dismiss and delete the teacher record for ${teach.name}?`,
                                  () => {
                                    setRecycleBin(prev => [...prev, { id: teach.id, type: 'teacher', data: teach, labelName: teach.name }]);
                                    setTeachers((prev: any[]) => prev.filter(t => t.id !== teach.id));
                                    if (selectedDetailedTeacher?.id === teach.id) {
                                      setSelectedDetailedTeacher(null);
                                    }
                                  }
                                )}
                                className="text-[10px] text-red-400 hover:text-red-300 font-medium"
                              >
                                Dismiss
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>"""

    replacement = """                  {/* Staff Directory */}
                  <div className="space-y-3 pt-4 border-t border-border/60">
                    <span className="block text-xs font-bold text-foreground/75 uppercase tracking-wider">Staff Directory</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredTeachers.map((teach) => (
                        <div 
                          key={teach.id} 
                          onClick={() => setSelectedDetailedTeacher(teach)}
                          className="p-4 bg-card/60 border border-border rounded-xl flex flex-col gap-4 hover:border-primary/45 hover:bg-card/80 transition-all cursor-pointer group shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              {teach.photo ? (
                                <img src={teach.photo} alt={teach.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shrink-0" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-black text-primary text-sm shrink-0 group-hover:scale-105 transition-transform">
                                  {teach.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <strong className="block text-sm text-foreground font-black group-hover:text-primary transition-colors">{teach.name}</strong>
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm inline-block mt-1">{teach.role || 'Teacher'}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2" onClick={(e) => e.stopPropagation()}>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[9px] uppercase tracking-wider shrink-0">
                                Verified
                              </span>
                              {isEditor && (
                                <button 
                                  onClick={() => requestSecureDelete(
                                    `Are you sure you want to dismiss and delete the teacher record for ${teach.name}?`,
                                    () => {
                                      setRecycleBin(prev => [...prev, { id: teach.id, type: 'teacher', data: teach, labelName: teach.name }]);
                                      setTeachers((prev: any[]) => prev.filter(t => t.id !== teach.id));
                                      if (selectedDetailedTeacher?.id === teach.id) {
                                        setSelectedDetailedTeacher(null);
                                      }
                                    }
                                  )}
                                  className="text-[10px] text-rose-400 hover:text-rose-300 font-bold mt-1 uppercase"
                                >
                                  Dismiss
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 bg-muted/40 p-3 rounded-lg border border-border/50">
                            {(!teach.role || teach.role === 'Teacher') ? (
                              <>
                                <div>
                                  <span className="block text-[9px] font-bold text-foreground/50 uppercase">Subject</span>
                                  <span className="block text-xs font-semibold text-foreground/90">{teach.subject || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="block text-[9px] font-bold text-foreground/50 uppercase">Class</span>
                                  <span className="block text-xs font-semibold text-foreground/90">{teach.className || 'N/A'}</span>
                                </div>
                              </>
                            ) : (
                              <div className="col-span-2">
                                <span className="block text-[9px] font-bold text-foreground/50 uppercase">Department / Area</span>
                                <span className="block text-xs font-semibold text-foreground/90">{teach.subject || 'N/A'}</span>
                              </div>
                            )}
                            
                            {teach.experience && (
                              <div>
                                <span className="block text-[9px] font-bold text-foreground/50 uppercase">Experience</span>
                                <span className="block text-xs font-semibold text-foreground/90">{teach.experience}</span>
                              </div>
                            )}
                            {teach.qualification && (
                              <div>
                                <span className="block text-[9px] font-bold text-foreground/50 uppercase">Qualification</span>
                                <span className="block text-xs font-semibold text-foreground/90">{teach.qualification}</span>
                              </div>
                            )}
                            {teach.phone && teach.phone !== 'N/A' && (
                              <div>
                                <span className="block text-[9px] font-bold text-foreground/50 uppercase">Contact</span>
                                <span className="block text-xs font-semibold text-foreground/90">{teach.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>"""

    if target in content:
        content = content.replace(target, replacement)
        print("Replaced Employee UI successfully.")
    else:
        print("Target not found. Please verify the exact string.")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    modify_file('frontend/src/pages/UnifiedDashboard.tsx')
