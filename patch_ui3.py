import re

def update_ui():
    path = 'frontend/src/pages/UnifiedDashboard.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Maintenance Logs Delete button & Green Background
    old_log = """<div key={log.id} className="p-2 bg-card border border-border rounded-lg flex justify-between items-center gap-2">
                            <span>{log.title}</span>
                            {isEditor ? ("""
                            
    new_log = """<div key={log.id} className={`p-2 border rounded-lg flex justify-between items-center gap-2 ${log.status === 'Resolved' ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-card border-border'}`}>
                            <span>{log.title}</span>
                            {isEditor ? ("""

    content = content.replace(old_log, new_log)

    old_log_end = """</select>
                            ) : ("""
                            
    new_log_end = """</select>
                              <button onClick={() => setMaintenanceLogs(prev => prev.filter(item => item.id !== log.id))} className="text-[10px] text-red-500 hover:bg-red-500/10 px-1.5 py-1 rounded font-bold transition-colors ml-1">Del</button>
                              </>
                            ) : ("""
    # Need to add Fragments to wrap the select and button since they are in a ternary condition
    
    old_log_start_ternary = """{isEditor ? (
                              <select"""
                              
    new_log_start_ternary = """{isEditor ? (
                              <div className="flex items-center gap-1">
                              <select"""
                              
    old_log_end_ternary = """</select>
                            ) : ("""
                            
    new_log_end_ternary = """</select>
                              <button onClick={() => setMaintenanceLogs(prev => prev.filter(item => item.id !== log.id))} className="text-[10px] text-red-500 hover:bg-red-500/10 px-1.5 py-1 rounded font-bold transition-colors ml-1" title="Delete Log">Del</button>
                              </div>
                            ) : ("""

    content = content.replace(old_log_start_ternary, new_log_start_ternary)
    content = content.replace(old_log_end_ternary, new_log_end_ternary)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("UI Patch Phase 3 Complete.")

if __name__ == '__main__':
    update_ui()
