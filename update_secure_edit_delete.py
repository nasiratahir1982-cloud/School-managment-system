import re

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. State Injections
    if 'const [secureDeletePrompt' not in content:
        state_injection = """  const [secureDeletePrompt, setSecureDeletePrompt] = useState<{isOpen: boolean, entityType: string, entityId: string, entityName: string, passwordAttempt: string, error: string} | null>(null);
  const MASTER_PASSWORD = 'superadmin';
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null);
  const [editCountryForm, setEditCountryForm] = useState<any>({});
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [editOrgForm, setEditOrgForm] = useState<any>({});
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [editSchoolForm, setEditSchoolForm] = useState<any>({});
"""
        content = content.replace("const [editStudentForm, setEditStudentForm] = useState<any>({});", 
                                  "const [editStudentForm, setEditStudentForm] = useState<any>({});\n" + state_injection)

    # 2. Add Modal JSX just before closing tag
    if 'SECURE DELETE MODAL' not in content:
        modal_jsx = """
      {/* SECURE DELETE MODAL */}
      {secureDeletePrompt?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border-2 border-rose-500 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(244,63,94,0.3)] animate-in zoom-in-95 duration-200">
            <div className="bg-rose-500/10 p-5 border-b border-rose-500/20 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </div>
              <h3 className="text-xl font-black text-rose-500">CRITICAL WARNING</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm font-semibold text-foreground/80 leading-relaxed text-center">
                You are about to permanently delete <span className="text-white font-bold bg-rose-500/20 px-2 py-0.5 rounded">[{secureDeletePrompt.entityType}] {secureDeletePrompt.entityName}</span>.
                This action is irreversible and will orphan all associated records in the database.
              </p>
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-rose-500 uppercase">Super Admin Master Password</label>
                <input 
                  type="password" 
                  autoFocus
                  placeholder="Enter master password to confirm"
                  className="modern-input w-full border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/50"
                  value={secureDeletePrompt.passwordAttempt}
                  onChange={e => setSecureDeletePrompt({...secureDeletePrompt, passwordAttempt: e.target.value, error: ''})}
                />
                {secureDeletePrompt.error && <p className="text-xs font-bold text-rose-500 mt-1">{secureDeletePrompt.error}</p>}
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setSecureDeletePrompt(null)}
                  className="w-full py-2.5 bg-muted text-foreground text-sm font-bold rounded-lg hover:bg-muted/80 transition-all"
                >
                  Cancel & Go Back
                </button>
                <button 
                  onClick={() => {
                    if (secureDeletePrompt.passwordAttempt === MASTER_PASSWORD) {
                      requestSecurityVerification(`Delete ${secureDeletePrompt.entityType}: ${secureDeletePrompt.entityName}`, () => {
                        if (secureDeletePrompt.entityType === 'Country') {
                          setCountries(prev => prev.filter(c => c.id !== secureDeletePrompt.entityId));
                        } else if (secureDeletePrompt.entityType === 'Organization') {
                          setOrganizations(prev => prev.filter(o => o.id !== secureDeletePrompt.entityId));
                        } else if (secureDeletePrompt.entityType === 'Campus') {
                          setSchoolsList(prev => prev.filter(s => s.id !== secureDeletePrompt.entityId));
                        }
                        setSecureDeletePrompt(null);
                      });
                    } else {
                      setSecureDeletePrompt({...secureDeletePrompt, error: 'INCORRECT MASTER PASSWORD'});
                    }
                  }}
                  className="w-full py-2.5 bg-rose-500 text-white text-sm font-bold rounded-lg hover:bg-rose-600 transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                >
                  CONFIRM DELETE
                </button>
              </div>
            </div>
          </div>
        </div>
      """
        
        # Inject just before the final `</div>` block
        content = re.sub(r'(\s*</div>\s*)$', modal_jsx + r'\1', content)

    # 3. Country Editing mapping
    country_map_old = r"""                          \{countries\.map\(c => \(
                              <div key=\{c\.id\} className="p-3 bg-card border border-border rounded-lg flex items-center justify-between text-xs w-full sm:w-\[calc\(50%-6px\)\] lg:w-\[calc\(33\.33%-8px\)\]">
                                <div>
                                  <span className="font-bold block text-foreground">\{c\.name\} \(\{c\.code\}\)</span>
                                  <span className="text-\[10px\] text-foreground/60">Currency: \{c\.currency\}</span>
                                </div>
                                <button 
                                  onClick=\{\(\) => \{
                                    setCountries\(prev => prev\.map\(item => item\.id === c\.id \? \{ \.\.\.item, status: item\.status === 'Active' \? 'Inactive' : 'Active' \} : item\)\);
                                  \}\}
                                  className=\{`px-2\.5 py-1 rounded text-\[10px\] font-bold \$\{c\.status === 'Active' \? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'\}`\}
                                >
                                  \{c\.status\}
                                </button>
                              </div>
                            \)\)\}"""
                            
    country_map_new = """                          {countries.map(c => {
                            const isEditing = editingCountryId === c.id;
                            return (
                              <div key={c.id} className="p-3 bg-card border border-border rounded-lg flex flex-col justify-center text-xs w-full sm:w-[calc(50%-6px)] lg:w-[calc(33.33%-8px)]">
                                {isEditing ? (
                                  <form onSubmit={(e) => {
                                    e.preventDefault();
                                    requestSecurityVerification(`Update Country: ${editCountryForm.name}`, () => {
                                      setCountries(prev => prev.map(item => item.id === c.id ? { ...item, ...editCountryForm } : item));
                                      setEditingCountryId(null);
                                    });
                                  }} className="space-y-2 w-full">
                                    <input value={editCountryForm.name} onChange={e => setEditCountryForm({...editCountryForm, name: e.target.value})} className="modern-input text-[10px] p-1.5" required placeholder="Name" />
                                    <div className="flex gap-2">
                                      <input value={editCountryForm.code} onChange={e => setEditCountryForm({...editCountryForm, code: e.target.value})} className="modern-input text-[10px] p-1.5 w-1/3" required placeholder="Code" />
                                      <select value={editCountryForm.status} onChange={e => setEditCountryForm({...editCountryForm, status: e.target.value})} className="modern-input text-[10px] p-1.5 flex-1">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                      </select>
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                      <button type="submit" className="flex-1 py-1 bg-primary text-white text-[10px] font-bold rounded hover:bg-primary/90">Save</button>
                                      <button type="button" onClick={() => setEditingCountryId(null)} className="flex-1 py-1 bg-muted text-foreground text-[10px] font-bold rounded hover:bg-muted/80">Cancel</button>
                                    </div>
                                  </form>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <span className="font-bold block text-foreground">{c.name} ({c.code})</span>
                                        <span className="text-[10px] text-foreground/60">Currency: {c.currency}</span>
                                      </div>
                                      <div className="flex flex-col items-end gap-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                          {c.status}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex gap-1 mt-3 pt-2 border-t border-border/50 justify-end">
                                      <button onClick={() => { setEditingCountryId(c.id); setEditCountryForm({...c}); }} className="p-1 hover:bg-primary/20 hover:text-primary rounded text-foreground/60 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                                      </button>
                                      <button onClick={() => setSecureDeletePrompt({isOpen: true, entityType: 'Country', entityId: c.id, entityName: c.name, passwordAttempt: '', error: ''})} className="p-1 hover:bg-rose-500/20 hover:text-rose-500 rounded text-foreground/60 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}"""
    
    content = re.sub(country_map_old, country_map_new, content)

    # 4. Add Actions columns to headers
    content = content.replace('<th className="p-3 text-right">Status</th>', '<th className="p-3 text-right">Status</th>\n<th className="p-3 text-right">Actions</th>')
    content = content.replace('<th className="p-3 text-right">RLS Tenant Status</th>', '<th className="p-3 text-right">RLS Tenant Status</th>\n<th className="p-3 text-right">Actions</th>')

    # 5. Organizations Editing mapping
    org_map_old = r"""                            \{organizations\.map\(org => \(
                                <tr key=\{org\.id\} className="hover:bg-muted/10">
                                  <td className="p-3 font-bold">\{org\.name\}</td>
                                  <td className="p-3">\{org\.owner\}</td>
                                  <td className="p-3 text-center font-bold text-primary">\{org\.branches\}</td>
                                  <td className="p-3 text-right">
                                    <button 
                                      onClick=\{\(\) => \{
                                        setOrganizations\(prev => prev\.map\(item => item\.id === org\.id \? \{ \.\.\.item, status: item\.status === 'Active' \? 'Inactive' : 'Active' \} : item\)\);
                                      \}\}
                                      className=\{`px-2 py-0\.5 rounded text-\[10px\] font-bold \$\{org\.status === 'Active' \? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'\}`\}
                                    >
                                      \{org\.status\}
                                    </button>
                                  </td>
                                </tr>
                              \)\)\}"""
                              
    org_map_new = """                            {organizations.map(org => {
                                const isEditing = editingOrgId === org.id;
                                if (isEditing) {
                                  return (
                                    <tr key={org.id} className="bg-muted/30">
                                      <td colSpan={5} className="p-3">
                                        <form onSubmit={(e) => {
                                          e.preventDefault();
                                          requestSecurityVerification(`Update Organization: ${editOrgForm.name}`, () => {
                                            setOrganizations(prev => prev.map(item => item.id === org.id ? { ...item, ...editOrgForm } : item));
                                            setEditingOrgId(null);
                                          });
                                        }} className="flex gap-2 items-center">
                                          <input value={editOrgForm.name} onChange={e => setEditOrgForm({...editOrgForm, name: e.target.value})} className="modern-input flex-1 py-1.5" required />
                                          <input value={editOrgForm.owner} onChange={e => setEditOrgForm({...editOrgForm, owner: e.target.value})} className="modern-input flex-1 py-1.5" required />
                                          <input type="number" value={editOrgForm.branches} onChange={e => setEditOrgForm({...editOrgForm, branches: e.target.value})} className="modern-input w-20 py-1.5" required />
                                          <select value={editOrgForm.status} onChange={e => setEditOrgForm({...editOrgForm, status: e.target.value})} className="modern-input py-1.5">
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                          </select>
                                          <button type="submit" className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded">Save</button>
                                          <button type="button" onClick={() => setEditingOrgId(null)} className="px-3 py-1.5 bg-muted text-foreground text-xs font-bold rounded">Cancel</button>
                                        </form>
                                      </td>
                                    </tr>
                                  );
                                }
                                return (
                                  <tr key={org.id} className="hover:bg-muted/10">
                                    <td className="p-3 font-bold">{org.name}</td>
                                    <td className="p-3">{org.owner}</td>
                                    <td className="p-3 text-center font-bold text-primary">{org.branches}</td>
                                    <td className="p-3 text-right">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${org.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {org.status}
                                      </span>
                                    </td>
                                    <td className="p-3 text-right">
                                      <div className="flex justify-end gap-1">
                                        <button onClick={() => { setEditingOrgId(org.id); setEditOrgForm({...org}); }} className="p-1.5 hover:bg-primary/20 hover:text-primary rounded transition-colors">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                                        </button>
                                        <button onClick={() => setSecureDeletePrompt({isOpen: true, entityType: 'Organization', entityId: org.id, entityName: org.name, passwordAttempt: '', error: ''})} className="p-1.5 hover:bg-rose-500/20 hover:text-rose-500 rounded transition-colors">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}"""
    content = re.sub(org_map_old, org_map_new, content)
    
    # 6. School Editing mapping
    school_map_old = r"""                            \{schoolsList\.map\(sch => \(
                                <tr key=\{sch\.id\} className="hover:bg-muted/10">
                                  <td className="p-3 font-bold">\{sch\.name\}</td>
                                  <td className="p-3 text-primary font-semibold">\{sch\.subdomain\}\.academichub\.com</td>
                                  <td className="p-3 text-right">
                                    <span className="px-2 py-0\.5 rounded text-\[10px\] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      Isolated RLS
                                    </span>
                                  </td>
                                </tr>
                              \)\)\}"""
                              
    school_map_new = """                            {schoolsList.map(sch => {
                                const isEditing = editingSchoolId === sch.id;
                                if (isEditing) {
                                  return (
                                    <tr key={sch.id} className="bg-muted/30">
                                      <td colSpan={4} className="p-3">
                                        <form onSubmit={(e) => {
                                          e.preventDefault();
                                          requestSecurityVerification(`Update Campus: ${editSchoolForm.name}`, () => {
                                            setSchoolsList(prev => prev.map(item => item.id === sch.id ? { ...item, ...editSchoolForm } : item));
                                            setEditingSchoolId(null);
                                          });
                                        }} className="flex gap-2 items-center">
                                          <input value={editSchoolForm.name} onChange={e => setEditSchoolForm({...editSchoolForm, name: e.target.value})} className="modern-input flex-1 py-1.5" required />
                                          <input value={editSchoolForm.subdomain} onChange={e => setEditSchoolForm({...editSchoolForm, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')})} className="modern-input flex-1 py-1.5" required />
                                          <select value={editSchoolForm.status || 'Active'} onChange={e => setEditSchoolForm({...editSchoolForm, status: e.target.value})} className="modern-input py-1.5">
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                          </select>
                                          <button type="submit" className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded">Save</button>
                                          <button type="button" onClick={() => setEditingSchoolId(null)} className="px-3 py-1.5 bg-muted text-foreground text-xs font-bold rounded">Cancel</button>
                                        </form>
                                      </td>
                                    </tr>
                                  );
                                }
                                return (
                                  <tr key={sch.id} className="hover:bg-muted/10">
                                    <td className="p-3 font-bold flex items-center gap-2">
                                      {sch.name}
                                      {sch.status === 'Inactive' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-400">INACTIVE</span>}
                                    </td>
                                    <td className="p-3 text-primary font-semibold">{sch.subdomain}.academichub.com</td>
                                    <td className="p-3 text-right">
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        Isolated RLS
                                      </span>
                                    </td>
                                    <td className="p-3 text-right">
                                      <div className="flex justify-end gap-1">
                                        <button onClick={() => { setEditingSchoolId(sch.id); setEditSchoolForm({...sch}); }} className="p-1.5 hover:bg-primary/20 hover:text-primary rounded transition-colors">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                                        </button>
                                        <button onClick={() => setSecureDeletePrompt({isOpen: true, entityType: 'Campus', entityId: sch.id, entityName: sch.name, passwordAttempt: '', error: ''})} className="p-1.5 hover:bg-rose-500/20 hover:text-rose-500 rounded transition-colors">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}"""
    content = re.sub(school_map_old, school_map_new, content)

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated UnifiedDashboard.tsx successfully")

if __name__ == '__main__':
    main()
