const fs = require('fs');
const file = 'frontend/src/pages/UnifiedDashboard.tsx';
let content = fs.readFileSync(file, 'utf-8');

const anchorAdmissions = `              {/* ADMISSIONS & CRM MODULES */}`;

const newSecurityBlocks = `
              {/* SYSTEM SECURITY MODULES */}
              {(activeFeature === 'Two Factor Authentication') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 flex justify-between items-center">
                    <span>🛡️ Global Multi-Factor Authentication Settings.</span>
                    <button className="px-3 py-1 bg-primary text-white rounded text-[10px] font-bold">Save Policies</button>
                  </div>
                  
                  <div className="p-5 bg-card border border-border rounded-xl space-y-5">
                    <div className="flex justify-between items-center pb-4 border-b border-border/50">
                      <div>
                        <strong className="text-sm font-black text-foreground block">Enforce 2FA Globally</strong>
                        <span className="text-[11px] text-muted-foreground block max-w-sm">Require all organization members (teachers, admins) to configure an Authenticator app (e.g. Google Authenticator) before accessing the portal.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer group">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner group-hover:ring-2 ring-emerald-500/30"></div>
                      </label>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-border/50">
                      <div>
                        <strong className="text-sm font-black text-foreground block">SMS OTP Fallback</strong>
                        <span className="text-[11px] text-muted-foreground block max-w-sm">Allow users to receive an SMS text message to their registered phone number if they lose access to their authenticator app.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer group">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner group-hover:ring-2 ring-primary/30"></div>
                      </label>
                    </div>

                    <div className="p-4 bg-muted/30 border border-border rounded-lg flex flex-col md:flex-row gap-4 items-center md:items-start">
                      <div className="w-24 h-24 bg-white rounded-lg border-2 border-dashed border-border flex items-center justify-center p-1 shrink-0">
                        {/* Mock QR Code Image Placeholder */}
                        <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/AcademicHub:Admin?secret=JBSWY3DPEHPK3PXP&issuer=AcademicHub')] bg-cover bg-no-repeat opacity-80" style={{ filter: 'grayscale(100%)' }}></div>
                      </div>
                      <div>
                        <strong className="text-xs text-foreground block mb-1">Your Personal Admin 2FA Setup</strong>
                        <p className="text-[11px] text-muted-foreground mb-3">Scan this QR code with Google Authenticator or Authy to bind your device.</p>
                        <div className="flex gap-2">
                          <input type="text" placeholder="Enter 6-digit code" className="px-3 py-1.5 bg-background border border-border rounded text-[11px] outline-none focus:border-primary w-32" />
                          <button className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[11px] rounded transition-colors">Verify</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Device Management' || activeFeature === 'Session Tracking') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-card border border-border rounded-xl space-y-4 overflow-x-auto">
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">Active Authorized Devices</span>
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                          <th className="p-2">Device / OS</th>
                          <th className="p-2">Location & IP</th>
                          <th className="p-2">Last Active</th>
                          <th className="p-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] font-semibold">
                        {[
                          { dev: 'MacBook Pro 16" - Chrome', loc: 'Lahore, PK (119.16.22.1)', time: 'Current Session', icon: <Smartphone className="w-4 h-4 text-emerald-400" />, active: true },
                          { dev: 'iPhone 14 Pro Max - Safari', loc: 'Lahore, PK (119.16.22.8)', time: '2 hours ago', icon: <Smartphone className="w-4 h-4 text-muted-foreground" />, active: false },
                          { dev: 'Windows 11 Desktop - Edge', loc: 'Dubai, UAE (185.22.11.9)', time: '3 days ago', icon: <Activity className="w-4 h-4 text-amber-500" />, active: false },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/10 transition-colors device-row">
                            <td className="p-2 flex items-center gap-2">
                              {row.icon}
                              <span className={row.active ? 'text-primary font-bold' : 'text-foreground'}>{row.dev}</span>
                              {row.active && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] rounded ml-1">Live</span>}
                            </td>
                            <td className="p-2 text-muted-foreground">{row.loc}</td>
                            <td className="p-2">{row.time}</td>
                            <td className="p-2 text-right">
                              {row.active ? (
                                <span className="text-[10px] text-muted-foreground italic">This Device</span>
                              ) : (
                                <button 
                                  onClick={(e) => {
                                    const tr = (e.currentTarget as HTMLElement).closest('tr');
                                    if(tr) {
                                      tr.style.transition = 'all 0.5s ease';
                                      tr.style.opacity = '0';
                                      tr.style.transform = 'translateX(20px)';
                                      setTimeout(() => tr.remove(), 500);
                                    }
                                  }}
                                  className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded font-bold text-[10px] transition-colors"
                                >
                                  Revoke Access
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {(activeFeature === 'IP Restriction') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-gradient-to-br from-indigo-500/10 via-card to-card border border-indigo-500/20 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <strong className="text-sm font-black text-foreground block flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-400" /> Static IP Whitelisting</strong>
                      <p className="text-[11px] text-muted-foreground max-w-md leading-relaxed">
                        Restrict dashboard access to specific campus networks. If enabled, any login attempt from an unlisted IP address will be instantly blocked, even with correct credentials.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer group shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500 shadow-inner group-hover:ring-2 ring-indigo-500/30"></div>
                      <span className="ml-2 text-xs font-bold text-foreground">Strict Mode</span>
                    </label>
                  </div>

                  <div className="p-4 bg-card border border-border rounded-xl">
                    <div className="flex gap-2 mb-4">
                      <input type="text" placeholder="Enter IP Address (e.g. 192.168.1.1/24)" className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-indigo-500 text-foreground" />
                      <input type="text" placeholder="Description (e.g. Main Campus WiFi)" className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-indigo-500 text-foreground hidden md:block" />
                      <button 
                        onClick={(e) => {
                          alert("New IP Address added to whitelist successfully!");
                        }}
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        Add IP
                      </button>
                    </div>

                    <div className="space-y-2">
                      {[
                        { ip: '203.101.44.12', desc: 'Main Campus Admin Block Gateway' },
                        { ip: '119.16.22.0/24', desc: 'City Branch Office Network' }
                      ].map((item, i) => (
                        <div key={i} className="p-3 bg-muted/20 border border-border rounded-lg flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                              <ShieldAlert className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className="text-xs text-foreground block font-mono">{item.ip}</strong>
                              <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                            </div>
                          </div>
                          <button className="p-1.5 text-muted-foreground hover:text-rose-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(activeFeature === 'Login Audit Trail') && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-card border border-border rounded-xl overflow-x-auto">
                    <div className="flex justify-between items-center mb-4">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Immutable Access Logs</span>
                      <button className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground border border-border rounded text-[10px] font-bold flex items-center gap-1 transition-colors">
                        <Download className="w-3 h-3" /> Export CSV
                      </button>
                    </div>
                    
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-border text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                          <th className="p-2">Timestamp</th>
                          <th className="p-2">User / Role</th>
                          <th className="p-2">IP & Location</th>
                          <th className="p-2">Event</th>
                          <th className="p-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] font-semibold">
                        {[
                          { time: '2026-06-13 08:42:15', user: 'Admin User', ip: '119.16.22.1 (Lahore, PK)', event: 'Password Login', status: 'Success', color: 'emerald' },
                          { time: '2026-06-13 08:40:02', user: 'Admin User', ip: '119.16.22.1 (Lahore, PK)', event: '2FA OTP Verification', status: 'Success', color: 'emerald' },
                          { time: '2026-06-12 23:15:44', user: 'Unknown', ip: '45.22.19.8 (Moscow, RU)', event: 'Password Brute Force', status: 'Blocked (IP Restricted)', color: 'rose' },
                          { time: '2026-06-12 14:30:10', user: 'Teacher (Ayesha)', ip: '203.101.44.12 (Lahore, PK)', event: 'Session Expiry', status: 'Logged Out', color: 'amber' },
                          { time: '2026-06-11 09:05:22', user: 'Teacher (Ayesha)', ip: '203.101.44.12 (Lahore, PK)', event: 'Password Login', status: 'Success', color: 'emerald' },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                            <td className="p-2 text-muted-foreground font-mono">{row.time}</td>
                            <td className="p-2 font-bold text-foreground">{row.user}</td>
                            <td className="p-2 text-muted-foreground">{row.ip}</td>
                            <td className="p-2">{row.event}</td>
                            <td className="p-2 text-right">
                              <span className={\`px-2 py-0.5 bg-\${row.color}-500/10 text-\${row.color}-500 rounded text-[9px] font-black uppercase\`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

` + anchorAdmissions;

content = content.replace(anchorAdmissions, newSecurityBlocks);
fs.writeFileSync(file, content);
