"""
Replace static Visitor Management UI with a fully functional one:
- School-aware visitor log saved to schoolDb.visitors
- Add visitor form with dropdowns
- Edit, Delete, Mark Exit buttons on each row
- Visitor state hooks added
"""

NEW_VISITOR_SECTION = """              {activeFeature === 'Visitor Management' && (() => {
                const visitors: any[] = schoolDb.visitors || [];
                const todayStr = new Date().toISOString().split('T')[0];
                const todayVisitors = visitors.filter((v: any) => v.date === todayStr);
                const allVisitors = visitors;

                const PURPOSES = ['Parent-Teacher Meeting', 'Fee Submission', 'Admission Enquiry', 'Meeting with Principal', 'Meeting with Teacher', 'Document Collection', 'Event Guest', 'Vendor / Delivery', 'Job Interview', 'Other'];
                const MEETING_WITH = ['Principal', 'Vice Principal', 'Class Teacher', 'Accounts Office', 'Admin Office', 'Librarian', 'Counselor', 'IT Department', 'Other'];

                const nowTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                return (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed flex items-center justify-between">
                    <span>📝 Digital logbook — visitor entries, exits and meeting records saved to school database.</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Total Today', value: todayVisitors.length, color: 'text-primary' },
                      { label: 'Checked In', value: todayVisitors.filter((v:any) => v.status === 'Checked In').length, color: 'text-emerald-400' },
                      { label: 'Checked Out', value: todayVisitors.filter((v:any) => v.status === 'Checked Out').length, color: 'text-foreground/60' },
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
                      entryTime: nowTime(),
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
                        {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <select name="vMeetingWith" required className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                        <option value="">-- Meeting With --</option>
                        {MEETING_WITH.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-2">
                        <Plus size={13} /> Check-in Visitor
                      </button>
                    </div>
                  </form>

                  {/* Edit Visitor Inline Form */}
                  {(() => {
                    const [editingVId, setEditingVId] = React.useState<string|null>(null);
                    const [editVForm, setEditVForm] = React.useState<any>(null);
                    return (
                      <>
                        {editingVId && editVForm && (
                          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3 shadow-md animate-fadeIn">
                            <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Edit Visitor Record</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              <input value={editVForm.name} onChange={e => setEditVForm({...editVForm, name: e.target.value})} placeholder="Visitor Name" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                              <input value={editVForm.cnic} onChange={e => setEditVForm({...editVForm, cnic: e.target.value})} placeholder="CNIC" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                              <input value={editVForm.phone} onChange={e => setEditVForm({...editVForm, phone: e.target.value})} placeholder="Phone" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                              <select value={editVForm.purpose} onChange={e => setEditVForm({...editVForm, purpose: e.target.value})} className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                                {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                              <select value={editVForm.meetingWith} onChange={e => setEditVForm({...editVForm, meetingWith: e.target.value})} className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                                {MEETING_WITH.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                              <select value={editVForm.status} onChange={e => setEditVForm({...editVForm, status: e.target.value})} className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                                <option value="Checked In">Checked In</option>
                                <option value="Checked Out">Checked Out</option>
                              </select>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => { setEditingVId(null); setEditVForm(null); }} className="px-4 py-1.5 bg-muted hover:bg-border text-foreground text-xs font-bold rounded-lg">Cancel</button>
                              <button onClick={() => {
                                setVisitors((prev: any[]) => prev.map((v: any) => v.id === editingVId ? { ...v, ...editVForm, exitTime: editVForm.status === 'Checked Out' && !editVForm.exitTime ? nowTime() : editVForm.exitTime } : v));
                                setEditingVId(null); setEditVForm(null);
                              }} className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-lg">Save Changes</button>
                            </div>
                          </div>
                        )}

                        {/* Today's Log */}
                        <div>
                          <span className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Today's Visitor Log — {new Date().toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</span>
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
                                {todayVisitors.length === 0 && (
                                  <tr><td colSpan={8} className="p-6 text-center text-foreground/40">No visitors logged today. Use the form above to log a visitor.</td></tr>
                                )}
                                {todayVisitors.map((v: any) => (
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
                                          <button onClick={() => setVisitors((prev: any[]) => prev.map((x:any) => x.id === v.id ? {...x, status: 'Checked Out', exitTime: nowTime()} : x))} className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded border border-amber-500/20 transition-colors">Mark Exit</button>
                                        )}
                                        <button onClick={() => { setEditingVId(v.id); setEditVForm({name: v.name, cnic: v.cnic, phone: v.phone, purpose: v.purpose, meetingWith: v.meetingWith, status: v.status, exitTime: v.exitTime}); }} className="px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold rounded border border-primary/20 transition-colors">Edit</button>
                                        <button onClick={() => { if(window.confirm('Remove this visitor record?')) setVisitors((prev: any[]) => prev.filter((x:any) => x.id !== v.id)); }} className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded border border-rose-500/20 transition-colors">Delete</button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table></div>
                          </div>
                        </div>

                        {/* All Visitors History */}
                        {allVisitors.filter((v:any) => v.date !== todayStr).length > 0 && (
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
                                  {allVisitors.filter((v:any) => v.date !== todayStr).map((v: any) => (
                                    <tr key={v.id} className="hover:bg-muted/10 transition-colors">
                                      <td className="p-3 text-foreground/50 font-mono text-[10px]">{v.date}</td>
                                      <td className="p-3 font-bold text-primary">{v.name}</td>
                                      <td className="p-3">{v.purpose}</td>
                                      <td className="p-3 text-foreground/70">{v.meetingWith}</td>
                                      <td className="p-3 font-mono text-[10px] text-foreground/60">{v.entryTime} → {v.exitTime || 'N/A'}</td>
                                      <td className="p-3 text-right">
                                        <button onClick={() => { if(window.confirm('Delete this record?')) setVisitors((prev: any[]) => prev.filter((x:any) => x.id !== v.id)); }} className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded border border-rose-500/20 transition-colors">Delete</button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table></div>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                );
              })()}"""

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix the visitor management section
    old_block = """              {activeFeature === 'Visitor Management' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                    📝 Digital logbook for campus security tracking visitor entries and exits.
                  </div>
                  <div className="flex justify-end mb-2">
                     <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow hover:bg-primary/90 transition-all flex items-center gap-2">
                       <Plus size={14} /> Log Visitor
                     </button>
                  </div>
                  <div className="border border-border rounded-xl bg-card overflow-hidden">
                    <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                          <th className="p-3">Visitor Name</th>
                          <th className="p-3">Purpose</th>
                          <th className="p-3">Meeting With</th>
                          <th className="p-3">Entry Time</th>
                          <th className="p-3 text-right">Exit Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground/85">
                        <tr className="hover:bg-muted/10">
                          <td className="p-3 font-bold text-primary">Saad Malik</td>
                          <td className="p-3">Admission Query</td>
                          <td className="p-3">Admin Office</td>
                          <td className="p-3 text-foreground/60 font-mono">09:15 AM</td>
                          <td className="p-3 text-right text-emerald-500 font-bold font-mono">10:30 AM</td>
                        </tr>
                        <tr className="hover:bg-muted/10 bg-amber-500/5">
                          <td className="p-3 font-bold text-primary">Mrs. Fatima</td>
                          <td className="p-3">PTM</td>
                          <td className="p-3">Class 8 Teacher</td>
                          <td className="p-3 text-foreground/60 font-mono">11:45 AM</td>
                          <td className="p-3 text-right"><button className="text-[10px] font-bold px-2 py-1 bg-amber-500 text-white rounded">Mark Exit</button></td>
                        </tr>
                      </tbody>
                    </table></div>
                  </div>
                </div>
              )}"""

    if old_block in content:
        content = content.replace(old_block, NEW_VISITOR_SECTION)
        print("Visitor Management section replaced.")
    else:
        print("WARNING: old block not found exactly. Searching for partial match...")
        idx = content.find("activeFeature === 'Visitor Management' && (")
        if idx >= 0:
            print(f"Found at char {idx}. Manual intervention needed.")

    # Also seed visitor data into school 1 database directly
    old_s1_inv_end = """        { id: 'inv-15', name: 'Exam Answer Sheet Reams', category: 'Stationary', location: 'Admin Storeroom', qty: '500 reams Low Stock', value: 'Rs. 75,000' }
      ]
    },
    // 2. Beaconhouse Campus Lahore (PK)"""
    new_s1_inv_end = """        { id: 'inv-15', name: 'Exam Answer Sheet Reams', category: 'Stationary', location: 'Admin Storeroom', qty: '500 reams Low Stock', value: 'Rs. 75,000' }
      ],
      visitors: [
        { id: 'v-1', name: 'Saad Malik', cnic: '35202-1234567-1', phone: '+92 300 1234567', purpose: 'Admission Enquiry', meetingWith: 'Principal', entryTime: '09:15 AM', exitTime: '10:30 AM', status: 'Checked Out', date: '2026-06-13' },
        { id: 'v-2', name: 'Mrs. Fatima Naqvi', cnic: '35202-9876543-2', phone: '+92 311 9876543', purpose: 'Parent-Teacher Meeting', meetingWith: 'Class Teacher', entryTime: '11:45 AM', exitTime: '', status: 'Checked In', date: '2026-06-13' },
        { id: 'v-3', name: 'Arif Hussain', cnic: '35202-5555555-3', phone: '+92 321 5555555', purpose: 'Fee Submission', meetingWith: 'Accounts Office', entryTime: '02:00 PM', exitTime: '02:20 PM', status: 'Checked Out', date: '2026-06-12' },
        { id: 'v-4', name: 'Sobia Tariq', cnic: '35202-7777777-4', phone: '+92 333 7777777', purpose: 'Document Collection', meetingWith: 'Admin Office', entryTime: '10:00 AM', exitTime: '10:15 AM', status: 'Checked Out', date: '2026-06-12' }
      ]
    },
    // 2. Beaconhouse Campus Lahore (PK)"""
    if old_s1_inv_end in content:
        content = content.replace(old_s1_inv_end, new_s1_inv_end)
        print("School 1 visitors seeded.")

    # Add visitors to DB version merge logic
    content = content.replace(
        "              // Always take fresh inventory if saved one is empty/missing\n              inventory: (parsed[schoolId].inventory && parsed[schoolId].inventory.length > 0)",
        "              // Always take fresh inventory if saved one is empty/missing\n              visitors: parsed[schoolId].visitors || merged[schoolId].visitors || [],\n              inventory: (parsed[schoolId].inventory && parsed[schoolId].inventory.length > 0)"
    )
    print("DB merge logic updated with visitors.")

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("DONE.")

if __name__ == '__main__':
    main()
