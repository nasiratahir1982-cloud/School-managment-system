import re

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. State Injection
    state_injection = """  const [apiKeys, setApiKeys] = useState([{id: '1', appName: 'ZK Teco Biometrics Sync', key: 'sk_live_1234567890abcdefa49b', date: '2026-05-10'}, {id: '2', appName: 'QuickBooks Finance API', key: 'sk_live_0987654321fedcba8f2c', date: '2026-06-01'}]);
  const [isAddingApiKey, setIsAddingApiKey] = useState(false);
  const [newApiKeyForm, setNewApiKeyForm] = useState({appName: '', key: ''});
"""
    if 'const [apiKeys, setApiKeys]' not in content:
        content = content.replace("const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);", 
                                  "const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);\n" + state_injection)

    # 2. JSX Replacement
    api_key_section_old = r"""                    \{/\* Super Admin Advanced Feature 6: API Key Management \*/\}
                    \{activeFeature === 'API Key Management' && \(
                      <div className="space-y-4 animate-fadeIn">
                        <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                          Y"' Generate and revoke secure API keys for 3rd-party integrations \(Biometric Devices, Accounts Software, etc\.\)\.
                        </div>
                        <div className="flex justify-end mb-4">
                           <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow hover:bg-primary/90 transition-all flex items-center gap-2">
                             <Key size=\{14\} /> Generate New Key
                           </button>
                        </div>
                        <div className="border border-border rounded-xl bg-card overflow-hidden">
                          <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-\[600px\]">
                            <thead>
                              <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                                <th className="p-3">Application Name</th>
                                <th className="p-3">API Key \(Masked\)</th>
                                <th className="p-3">Created Date</th>
                                <th className="p-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-foreground/85">
                              <tr className="hover:bg-muted/10">
                                <td className="p-3 font-bold text-primary">ZK Teco Biometrics Sync</td>
                                <td className="p-3 font-mono text-foreground/60">sk_live_\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*a49b</td>
                                <td className="p-3 text-foreground/60">2026-05-10</td>
                                <td className="p-3 text-right"><button className="text-xs font-bold text-rose-400 hover:text-rose-500 transition-colors">Revoke</button></td>
                              </tr>
                              <tr className="hover:bg-muted/10">
                                <td className="p-3 font-bold text-primary">QuickBooks Finance API</td>
                                <td className="p-3 font-mono text-foreground/60">sk_live_\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*8f2c</td>
                                <td className="p-3 text-foreground/60">2026-06-01</td>
                                <td className="p-3 text-right"><button className="text-xs font-bold text-rose-400 hover:text-rose-500 transition-colors">Revoke</button></td>
                              </tr>
                            </tbody>
                          </table></div>
                        </div>
                      </div>
                    \)\}"""

    api_key_section_new = """                    {/* Super Admin Advanced Feature 6: API Key Management */}
                    {activeFeature === 'API Key Management' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                          🔑 Generate and revoke secure API keys for 3rd-party integrations (Biometric Devices, Accounts Software, etc.) or manually link external keys like WhatsApp API.
                        </div>
                        <div className="flex justify-end mb-4">
                           <button onClick={() => setIsAddingApiKey(!isAddingApiKey)} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow hover:bg-primary/90 transition-all flex items-center gap-2">
                             <Key size={14} /> {isAddingApiKey ? 'Cancel' : 'Generate / Add New Key'}
                           </button>
                        </div>
                        
                        {isAddingApiKey && (
                          <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-3.5 mb-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Configure New API Key</span>
                            <form onSubmit={(e) => {
                              e.preventDefault();
                              if (!newApiKeyForm.appName || !newApiKeyForm.key) return;
                              setApiKeys(prev => [{
                                id: Date.now().toString(),
                                appName: newApiKeyForm.appName,
                                key: newApiKeyForm.key,
                                date: new Date().toISOString().split('T')[0]
                              }, ...prev]);
                              setNewApiKeyForm({appName: '', key: ''});
                              setIsAddingApiKey(false);
                            }} className="flex flex-col sm:flex-row gap-3">
                              <input value={newApiKeyForm.appName} onChange={e => setNewApiKeyForm({...newApiKeyForm, appName: e.target.value})} type="text" placeholder="Application Name (e.g. WhatsApp API)" className="modern-input flex-1" required />
                              <div className="flex flex-1 gap-2">
                                <input value={newApiKeyForm.key} onChange={e => setNewApiKeyForm({...newApiKeyForm, key: e.target.value})} type="text" placeholder="Paste Key or Auto-Generate" className="modern-input flex-1 font-mono text-xs" required />
                                <button type="button" onClick={() => {
                                  const randomKey = 'sk_live_' + Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join('');
                                  setNewApiKeyForm({...newApiKeyForm, key: randomKey});
                                }} className="px-3 py-1.5 bg-muted border border-border text-foreground text-xs font-bold rounded-lg hover:bg-muted/80 transition-all whitespace-nowrap">
                                  Auto-Generate
                                </button>
                              </div>
                              <button type="submit" className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-all">Save Key</button>
                            </form>
                          </div>
                        )}

                        <div className="border border-border rounded-xl bg-card overflow-hidden">
                          <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[600px]">
                            <thead>
                              <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                                <th className="p-3">Application Name</th>
                                <th className="p-3">API Key (Masked)</th>
                                <th className="p-3">Created Date</th>
                                <th className="p-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-foreground/85">
                              {apiKeys.map(apiKey => (
                                <tr key={apiKey.id} className="hover:bg-muted/10">
                                  <td className="p-3 font-bold text-primary">{apiKey.appName}</td>
                                  <td className="p-3 font-mono text-foreground/60 flex items-center gap-2">
                                    {apiKey.key.substring(0, 8)}...{apiKey.key.substring(apiKey.key.length - 4)}
                                    <button onClick={() => {
                                      navigator.clipboard.writeText(apiKey.key);
                                      alert('Copied to clipboard!');
                                    }} className="p-1 hover:bg-muted rounded text-foreground/40 hover:text-foreground transition-colors" title="Copy full key">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                    </button>
                                  </td>
                                  <td className="p-3 text-foreground/60">{apiKey.date}</td>
                                  <td className="p-3 text-right">
                                    <button onClick={() => setSecureDeletePrompt({isOpen: true, entityType: 'API Key', entityId: apiKey.id, entityName: apiKey.appName, passwordAttempt: '', error: ''})} className="text-xs font-bold text-rose-400 hover:text-rose-500 transition-colors">Revoke</button>
                                  </td>
                                </tr>
                              ))}
                              {apiKeys.length === 0 && (
                                <tr>
                                  <td colSpan={4} className="p-8 text-center text-foreground/50">No API keys configured.</td>
                                </tr>
                              )}
                            </tbody>
                          </table></div>
                        </div>
                      </div>
                    )}"""
                    
    content = re.sub(api_key_section_old, api_key_section_new, content)

    # 3. Secure Delete execution update for API Key
    delete_logic_old = r"""                        if \(secureDeletePrompt\.entityType === 'Country'\) \{
                          setCountries\(prev => prev\.filter\(c => c\.id !== secureDeletePrompt\.entityId\)\);
                        \} else if \(secureDeletePrompt\.entityType === 'Organization'\) \{
                          setOrganizations\(prev => prev\.filter\(o => o\.id !== secureDeletePrompt\.entityId\)\);
                        \} else if \(secureDeletePrompt\.entityType === 'Campus'\) \{
                          setSchoolsList\(prev => prev\.filter\(s => s\.id !== secureDeletePrompt\.entityId\)\);
                        \}"""
                        
    delete_logic_new = """                        if (secureDeletePrompt.entityType === 'Country') {
                          setCountries(prev => prev.filter(c => c.id !== secureDeletePrompt.entityId));
                        } else if (secureDeletePrompt.entityType === 'Organization') {
                          setOrganizations(prev => prev.filter(o => o.id !== secureDeletePrompt.entityId));
                        } else if (secureDeletePrompt.entityType === 'Campus') {
                          setSchoolsList(prev => prev.filter(s => s.id !== secureDeletePrompt.entityId));
                        } else if (secureDeletePrompt.entityType === 'API Key') {
                          setApiKeys(prev => prev.filter(k => k.id !== secureDeletePrompt.entityId));
                        }"""
    
    content = re.sub(delete_logic_old, delete_logic_new, content)

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Updated UnifiedDashboard.tsx successfully")

if __name__ == '__main__':
    main()
