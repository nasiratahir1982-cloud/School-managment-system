def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_idx = -1
    end_idx = -1
    
    for i, line in enumerate(lines):
        if "Allied School Campus A', status: 'Active'" in line and start_idx == -1:
            # We want to start from the div just above this
            # Actually, let's find the exact block bounds
            for j in range(i-5, i):
                if '<div className="grid grid-cols-1 md:grid-cols-2 gap-4">' in lines[j]:
                    start_idx = j
                    break
        
        if start_idx != -1 and "{school.status === 'Active' ? 'Suspend School' : 'Revoke Suspension'}" in line:
            # The end is a few lines down
            for j in range(i, i+10):
                if "</div>" in lines[j] and "</div>" in lines[j-1]:
                    # Need to be precise
                    pass

    # We know it's roughly lines 11938 to 11954
    # Wait, in the Python list, that's indices 11937 to 11953
    # Let's just do a manual slice based on line numbers! 
    # Let's verify line numbers first!
    if 'Allied School Campus A' in lines[11939]:
        print("Line 11939 matches!")
        # 11938 is '<div className="grid grid-cols-1 md:grid-cols-2 gap-4">'
        # 11954 is '</div>'
        
        new_block = """                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {schoolsList.map((school) => {
                            const isSuspended = school.status === 'Suspended' || school.status === 'Inactive';
                            return (
                            <div key={school.id} className={`p-4 bg-card border ${isSuspended ? 'border-rose-500/50' : 'border-border'} rounded-xl space-y-3 shadow-sm flex items-center justify-between`}>
                              <div>
                                <span className="font-bold text-foreground text-xs block">{school.name}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${!isSuspended ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>{!isSuspended ? 'ACTIVE' : 'SUSPENDED'}</span>
                              </div>
                              <button 
                                onClick={() => {
                                  requestSecurityVerification(
                                    `${!isSuspended ? 'Suspend' : 'Revoke Suspension for'} Campus: ${school.name}`,
                                    () => {
                                      setSchoolsList(prev => prev.map(s => s.id === school.id ? { ...s, status: !isSuspended ? 'Suspended' : 'Active' } : s));
                                    }
                                  );
                                }}
                                className={`px-4 py-2 text-white text-[11px] font-bold rounded-lg shadow transition-all ${!isSuspended ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                                {!isSuspended ? 'Suspend School' : 'Revoke Suspension'}
                              </button>
                            </div>
                            );
                          })}
                        </div>\n"""
        
        # Replace the slice!
        # Indices 11937 to 11954 (which is line 11938 to 11955)
        # We want to replace lines[11937:11954]
        lines[11937:11954] = [new_block]
        
        with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print("Updated by index!")
    else:
        print("Lines shifted, couldn't update by index!")

if __name__ == '__main__':
    main()
