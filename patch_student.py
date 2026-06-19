import re

def sync_student_dashboard():
    path = 'frontend/src/pages/student-portal/StudentDashboard.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Imports
    content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';")
    
    import_addition = """import { useThemeStore } from '../../store/themeStore';
import { setupRealtimeSync } from '../../store/firebase';
import { useQueryStore } from '../../store/queryStore';"""
    
    content = content.replace("import { useThemeStore } from '../../store/themeStore';", import_addition)

    # 2. Add State and Sync logic inside component
    sync_logic = """
  const { darkMode, toggleTheme } = useThemeStore();

  const [schoolDb, setSchoolDb] = useState<any>({});
  
  useEffect(() => {
    const unsubscribeDb = setupRealtimeSync('school_database', (data) => {
      setSchoolDb(data || {});
    });
    return () => {
      unsubscribeDb();
    };
  }, []);

  const { queries: portal_queries, initialize: initQueries } = useQueryStore();
  
  useEffect(() => {
    initQueries();
  }, [initQueries]);

  const notices = schoolDb.notices || [];
  const supportTickets = schoolDb.supportTickets || [];
  const maintenanceLogs = schoolDb.maintenanceLogs || [];
"""
    content = content.replace("  const { darkMode, toggleTheme } = useThemeStore();", sync_logic)

    # 3. Replace Notice Board and append other sections
    old_notices = """<div className="space-y-3.5 pt-2">
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs">
                  <div className="flex justify-between items-center text-slate-400 mb-1">
                    <span>Principal Office</span>
                    <span>June 05</span>
                  </div>
                  <p className="text-slate-200 font-medium">
                    Summer vacation announcement: School will remain closed from June 15 to August 14.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs">
                  <div className="flex justify-between items-center text-slate-400 mb-1">
                    <span>Academics Head</span>
                    <span>June 01</span>
                  </div>
                  <p className="text-slate-200 font-medium">
                    Class 10 final exams schedule has been uploaded to the course materials section.
                  </p>
                </div>
              </div>
            </div>"""

    new_notices_and_sections = """<div className="space-y-3.5 pt-2">
                {notices.length > 0 ? notices.map((not: any) => (
                  <div key={not.id} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs">
                    <div className="flex justify-between items-center text-slate-400 mb-1">
                      <span className="font-bold">{not.title}</span>
                      <span>{not.date}</span>
                    </div>
                    <p className="text-slate-200 font-medium">
                      {not.content}
                    </p>
                  </div>
                )) : (
                  <p className="text-slate-500 text-xs text-center py-4">No active notices.</p>
                )}
              </div>
            </div>

            {/* My Queries */}
            <div className="glass-card p-6 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white m-0 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                My Portal Queries
              </h3>
              <div className="space-y-3.5 pt-2">
                {portal_queries.length > 0 ? portal_queries.map((q) => (
                  <div key={q.id} className={`p-3 rounded-lg border text-xs ${q.status === 'resolved' ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-900/60 border-slate-800'}`}>
                    <div className="flex justify-between items-center text-slate-400 mb-1">
                      <span className="font-bold">{q.subject}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${q.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{q.status}</span>
                    </div>
                    <p className="text-slate-300 font-medium mb-2">{q.message}</p>
                    {q.reply && (
                      <div className="mt-2 p-2 bg-black/30 rounded border border-emerald-500/20">
                        <span className="text-emerald-400 font-bold block mb-1 text-[10px]">Admin Reply:</span>
                        <p className="text-emerald-300/80">{q.reply}</p>
                      </div>
                    )}
                  </div>
                )) : (
                  <p className="text-slate-500 text-xs text-center py-4">No portal queries found.</p>
                )}
              </div>
            </div>

            {/* Support Tickets */}
            <div className="glass-card p-6 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white m-0 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-400" />
                Help Desk Tickets
              </h3>
              <div className="space-y-3.5 pt-2">
                {supportTickets.length > 0 ? supportTickets.map((t: any) => (
                  <div key={t.id} className={`p-3 rounded-lg border text-xs ${t.status === 'Resolved' ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-900/60 border-slate-800'}`}>
                    <div className="flex justify-between items-center text-slate-400 mb-1">
                      <span className="font-bold">{t.subject}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${t.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{t.status}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-500 text-xs text-center py-4">No active support tickets.</p>
                )}
              </div>
            </div>

            {/* Maintenance Logs */}
            {currentSchool?.modules?.hostel && (
              <div className="glass-card p-6 rounded-xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-white m-0 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  Hostel Maintenance
                </h3>
                <div className="space-y-3.5 pt-2">
                  {maintenanceLogs.length > 0 ? maintenanceLogs.map((m: any) => (
                    <div key={m.id} className={`p-3 rounded-lg border text-xs ${m.status === 'Resolved' ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-900/60 border-slate-800'}`}>
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="font-bold">{m.title}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${m.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : m.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>{m.status}</span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-slate-500 text-xs text-center py-4">No maintenance reports.</p>
                  )}
                </div>
              </div>
            )}"""
    
    content = content.replace(old_notices, new_notices_and_sections)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Student Dashboard Sync patch complete.")

if __name__ == '__main__':
    sync_student_dashboard()
