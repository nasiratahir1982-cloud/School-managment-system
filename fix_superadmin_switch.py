import re

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject login and returnToken variables
    var_target = "const currentUser = useAuthStore((state) => state.user);"
    if var_target in content:
        new_vars = """const currentUser = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const returnToken = localStorage.getItem('ah_superadmin_return_token');"""
        content = content.replace(var_target, new_vars)

    # 2. Add 'Enter Portal' button to the School Management table
    school_td_target = """                                  <td className="p-3 text-right">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      Isolated RLS
                                    </span>
                                  </td>
                                </tr>"""
    
    new_school_td = """                                  <td className="p-3 text-right">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      Isolated RLS
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    <button 
                                      onClick={() => {
                                        localStorage.setItem('ah_superadmin_return_token', JSON.stringify(currentUser));
                                        login({
                                          userId: `admin_${sch.id}`,
                                          name: 'System Admin',
                                          email: `admin@${sch.subdomain}.academichub.com`,
                                          role: 'admin',
                                          token: 'magic_token'
                                        });
                                      }}
                                      className="px-3 py-1.5 bg-primary text-white rounded-lg text-[10px] font-bold shadow hover:bg-primary/90 transition-all inline-flex items-center gap-1"
                                    >
                                      <ArrowRight className="w-3 h-3" /> Enter Portal
                                    </button>
                                  </td>
                                </tr>"""
    
    if school_td_target in content:
        content = content.replace(school_td_target, new_school_td)

    # 3. Add Return button to the header
    logout_btn_target = """                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-1 bg-card border border-border hover:bg-muted hover:text-foreground px-2.5 py-1.5 rounded-lg text-[10px] transition-all whitespace-nowrap shrink-0 font-semibold"
                  title="Sign Out"
                >"""
    
    new_logout_btn = """                {returnToken && (
                  <button 
                    onClick={() => {
                      try {
                        const superAdminSession = JSON.parse(returnToken);
                        localStorage.removeItem('ah_superadmin_return_token');
                        login(superAdminSession);
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="inline-flex items-center justify-center gap-1 bg-amber-500 text-white border border-amber-500 hover:bg-amber-600 px-2.5 py-1.5 rounded-lg text-[10px] transition-all whitespace-nowrap shrink-0 font-bold shadow"
                    title="Return to Master Control"
                  >
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline whitespace-nowrap">Master Control</span>
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-1 bg-card border border-border hover:bg-muted hover:text-foreground px-2.5 py-1.5 rounded-lg text-[10px] transition-all whitespace-nowrap shrink-0 font-semibold"
                  title="Sign Out"
                >"""

    if logout_btn_target in content:
        content = content.replace(logout_btn_target, new_logout_btn)

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully updated UnifiedDashboard.tsx!")

if __name__ == '__main__':
    main()
