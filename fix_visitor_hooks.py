"""
Fix the black screen crash:
- Remove the IIFE that called React.useState inside JSX (violates Rules of Hooks)
- Replace entire visitor management section using component-level state hooks
- setEditingVisitorId / setEditVisitorForm / setVisitors are now at component level
"""

OLD_SECTION_START = """              {activeFeature === 'Visitor Management' && (() => {
                const visitors: any[] = schoolDb.visitors || [];
                const todayStr = new Date().toISOString().split('T')[0];
                const todayVisitors = visitors.filter((v: any) => v.date === todayStr);
                const allVisitors = visitors;

                const PURPOSES = ['Parent-Teacher Meeting', 'Fee Submission', 'Admission Enquiry', 'Meeting with Principal', 'Meeting with Teacher', 'Document Collection', 'Event Guest', 'Vendor / Delivery', 'Job Interview', 'Other'];
                const MEETING_WITH = ['Principal', 'Vice Principal', 'Class Teacher', 'Accounts Office', 'Admin Office', 'Librarian', 'Counselor', 'IT Department', 'Other'];

                const nowTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                return (
                <div className="space-y-4 animate-fadeIn">"""

OLD_SECTION_END = """                </div>
                );
              })()}"""

NEW_VISITOR_SECTION = """              {activeFeature === 'Visitor Management' && (() => {
                const visitors: any[] = schoolDb.visitors || [];
                const todayStr = new Date().toISOString().split('T')[0];
                const todayVisitors = visitors.filter((v: any) => v.date === todayStr);
                const allVisitors = visitors;
                const PURPOSES = ['Parent-Teacher Meeting', 'Fee Submission', 'Admission Enquiry', 'Meeting with Principal', 'Meeting with Teacher', 'Document Collection', 'Event Guest', 'Vendor / Delivery', 'Job Interview', 'Other'];
                const MEETING_WITH = ['Principal', 'Vice Principal', 'Class Teacher', 'Accounts Office', 'Admin Office', 'Librarian', 'Counselor', 'IT Department', 'Other'];
                const nowTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                return null; // placeholder — real render below
              })() === null && activeFeature === 'Visitor Management' && (
                <div className="space-y-4 animate-fadeIn">"""

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # The approach: find the broken IIFE block and replace it cleanly
    # The block starts with the IIFE call and ends with })()}

    old_block_marker_start = "              {activeFeature === 'Visitor Management' && (() => {"
    old_block_marker_end = "              })()}\n\n              {activeFeature === 'Payroll'"

    start_idx = content.find(old_block_marker_start)
    end_idx = content.find("              {activeFeature === 'Payroll'", start_idx)

    if start_idx < 0:
        print("ERROR: Could not find visitor management IIFE block start")
        return

    if end_idx < 0:
        print("ERROR: Could not find Payroll section to use as end marker")
        return

    # Extract the broken section
    broken_section = content[start_idx:end_idx]
    print(f"Found broken section ({len(broken_section)} chars), replacing...")

    new_section = """              {activeFeature === 'Visitor Management' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Info bar */}
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed flex items-center justify-between">
                    <span>📝 Digital logbook — visitor entries, exits and meeting records saved to school database.</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Total Today', value: (schoolDb.visitors || []).filter((v: any) => v.date === new Date().toISOString().split('T')[0]).length, color: 'text-primary' },
                      { label: 'Checked In', value: (schoolDb.visitors || []).filter((v: any) => v.date === new Date().toISOString().split('T')[0] && v.status === 'Checked In').length, color: 'text-emerald-400' },
                      { label: 'Checked Out', value: (schoolDb.visitors || []).filter((v: any) => v.date === new Date().toISOString().split('T')[0] && v.status === 'Checked Out').length, color: 'text-foreground/60' },
                    ].map((s, i) => (
                      <div key={i} className="p-3 bg-card border border-border rounded-xl text-center">
                        <span className={`block text-xl font-black ${s.color}`}>{s.value}</span>
                        <span className="block text-[10px] text-foreground/50 uppercase tracking-wider mt-0.5">{s.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Add Visitor Form */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const f = e.target as any;
                    const newVisitor = {
                      id: `v-${Date.now()}`,
                      name: f.vName.value.trim(),
                      cnic: f.vCnic.value.trim(),
                      phone: f.vPhone.value.trim(),
                      purpose: f.vPurpose.value,
                      meetingWith: f.vMeetingWith.value,
                      entryTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                      exitTime: '',
                      status: 'Checked In',
                      date: new Date().toISOString().split('T')[0],
                    };
                    setVisitors((prev: any[]) => [newVisitor, ...prev]);
                    f.reset();
                  }} className="p-4 bg-card border border-border rounded-xl space-y-3 shadow-sm">
                    <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">+ Log New Visitor</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <input name="vName" required placeholder="Visitor Full Name" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                      <input name="vCnic" placeholder="CNIC (e.g. 35202-1234567-1)" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                      <input name="vPhone" placeholder="Phone Number" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                      <select name="vPurpose" required className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                        <option value="">-- Select Purpose --</option>
                        {['Parent-Teacher Meeting','Fee Submission','Admission Enquiry','Meeting with Principal','Meeting with Teacher','Document Collection','Event Guest','Vendor / Delivery','Job Interview','Other'].map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <select name="vMeetingWith" required className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                        <option value="">-- Meeting With --</option>
                        {['Principal','Vice Principal','Class Teacher','Accounts Office','Admin Office','Librarian','Counselor','IT Department','Other'].map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-2">
                        <Plus size={13} /> Check-in Visitor
                      </button>
                    </div>
                  </form>

                  {/* Edit Visitor Inline Form - uses component-level state */}
                  {editingVisitorId && editVisitorForm && (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3 shadow-md animate-fadeIn">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Edit Visitor Record</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <input value={editVisitorForm.name} onChange={e => setEditVisitorForm({...editVisitorForm, name: e.target.value})} placeholder="Visitor Name" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                        <input value={editVisitorForm.cnic} onChange={e => setEditVisitorForm({...editVisitorForm, cnic: e.target.value})} placeholder="CNIC" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                        <input value={editVisitorForm.phone} onChange={e => setEditVisitorForm({...editVisitorForm, phone: e.target.value})} placeholder="Phone" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                        <select value={editVisitorForm.purpose} onChange={e => setEditVisitorForm({...editVisitorForm, purpose: e.target.value})} className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                          {['Parent-Teacher Meeting','Fee Submission','Admission Enquiry','Meeting with Principal','Meeting with Teacher','Document Collection','Event Guest','Vendor / Delivery','Job Interview','Other'].map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <select value={editVisitorForm.meetingWith} onChange={e => setEditVisitorForm({...editVisitorForm, meetingWith: e.target.value})} className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                          {['Principal','Vice Principal','Class Teacher','Accounts Office','Admin Office','Librarian','Counselor','IT Department','Other'].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select value={editVisitorForm.status} onChange={e => setEditVisitorForm({...editVisitorForm, status: e.target.value})} className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                          <option value="Checked In">Checked In</option>
                          <option value="Checked Out">Checked Out</option>
                        </select>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => { setEditingVisitorId(null); setEditVisitorForm(null); }} className="px-4 py-1.5 bg-muted hover:bg-border text-foreground text-xs font-bold rounded-lg">Cancel</button>
                        <button onClick={() => {
                          const exitT = editVisitorForm.status === 'Checked Out' && !editVisitorForm.exitTime
                            ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                            : editVisitorForm.exitTime;
                          setVisitors((prev: any[]) => prev.map((v: any) => v.id === editingVisitorId ? { ...v, ...editVisitorForm, exitTime: exitT } : v));
                          setEditingVisitorId(null); setEditVisitorForm(null);
                        }} className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-lg">Save Changes</button>
                      </div>
                    </div>
                  )}

                  {/* Today's Log */}
                  <div>
                    <span className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">
                      Today's Visitor Log — {new Date().toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}
                    </span>
                    <div className="border border-border rounded-xl bg-card overflow-hidden">
                      <div className="w-full overflow-x-auto pb-1"><table className="w-full text-left border-collapse text-xs min-w-[750px]">
                        <thead>
                          <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                            <th className="p-3">Visitor Name</th>
                            <th className="p-3">CNIC / Phone</th>
                            <th className="p-3">Purpose</th>
                            <th className="p-3">Meeting With</th>
                            <th className="p-3">Entry</th>
                            <th className="p-3">Exit</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-foreground/85">
                          {(schoolDb.visitors || []).filter((v: any) => v.date === new Date().toISOString().split('T')[0]).length === 0 && (
                            <tr><td colSpan={8} className="p-6 text-center text-foreground/40">No visitors logged today. Use the form above to check in a visitor.</td></tr>
                          )}
                          {(schoolDb.visitors || []).filter((v: any) => v.date === new Date().toISOString().split('T')[0]).map((v: any) => (
                            <tr key={v.id} className={`hover:bg-muted/10 transition-colors ${v.status === 'Checked In' ? 'bg-emerald-500/5' : ''}`}>
                              <td className="p-3 font-bold text-primary">{v.name}</td>
                              <td className="p-3 text-foreground/60 text-[10px]">{v.cnic || '—'}<br/>{v.phone || '—'}</td>
                              <td className="p-3">{v.purpose}</td>
                              <td className="p-3 text-foreground/70">{v.meetingWith}</td>
                              <td className="p-3 font-mono text-foreground/60">{v.entryTime}</td>
                              <td className="p-3 font-mono text-emerald-400 font-bold">{v.exitTime || '—'}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${v.status === 'Checked In' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-muted/30 text-foreground/50 border-border'}`}>{v.status}</span>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex gap-1.5 justify-end flex-wrap">
                                  {v.status === 'Checked In' && (
                                    <button onClick={() => setVisitors((prev: any[]) => prev.map((x: any) => x.id === v.id ? {...x, status: 'Checked Out', exitTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} : x))} className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded border border-amber-500/20 transition-colors">Mark Exit</button>
                                  )}
                                  <button onClick={() => { setEditingVisitorId(v.id); setEditVisitorForm({name: v.name, cnic: v.cnic || '', phone: v.phone || '', purpose: v.purpose, meetingWith: v.meetingWith, status: v.status, exitTime: v.exitTime || ''}); }} className="px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold rounded border border-primary/20 transition-colors">Edit</button>
                                  <button onClick={() => { if(window.confirm('Remove this visitor record?')) setVisitors((prev: any[]) => prev.filter((x: any) => x.id !== v.id)); }} className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded border border-rose-500/20 transition-colors">Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table></div>
                    </div>
                  </div>

                  {/* Previous Visitor Records */}
                  {(schoolDb.visitors || []).filter((v: any) => v.date !== new Date().toISOString().split('T')[0]).length > 0 && (
                    <div>
                      <span className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Previous Visitor Records</span>
                      <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <div className="w-full overflow-x-auto pb-1"><table className="w-full text-left border-collapse text-xs min-w-[650px]">
                          <thead>
                            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                              <th className="p-3">Date</th>
                              <th className="p-3">Visitor Name</th>
                              <th className="p-3">Purpose</th>
                              <th className="p-3">Meeting With</th>
                              <th className="p-3">Entry / Exit</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground/85">
                            {(schoolDb.visitors || []).filter((v: any) => v.date !== new Date().toISOString().split('T')[0]).map((v: any) => (
                              <tr key={v.id} className="hover:bg-muted/10 transition-colors">
                                <td className="p-3 text-foreground/50 font-mono text-[10px]">{v.date}</td>
                                <td className="p-3 font-bold text-primary">{v.name}</td>
                                <td className="p-3">{v.purpose}</td>
                                <td className="p-3 text-foreground/70">{v.meetingWith}</td>
                                <td className="p-3 font-mono text-[10px] text-foreground/60">{v.entryTime} → {v.exitTime || 'N/A'}</td>
                                <td className="p-3 text-right">
                                  <button onClick={() => { if(window.confirm('Delete this record?')) setVisitors((prev: any[]) => prev.filter((x: any) => x.id !== v.id)); }} className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded border border-rose-500/20 transition-colors">Delete</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

"""

    content = content[:start_idx] + new_section + content[end_idx:]
    print("Visitor Management section rewritten cleanly (no IIFE hooks).")

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("File saved.")

if __name__ == '__main__':
    main()
