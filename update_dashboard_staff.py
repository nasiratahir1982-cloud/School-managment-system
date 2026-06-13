import re

def update_dashboard():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add State Variable
    if 'const [newTeacherGender, setNewTeacherGender] = useState(' not in content:
        content = content.replace(
            "const [newTeacherName, setNewTeacherName] = useState('');",
            "const [newTeacherName, setNewTeacherName] = useState('');\n    const [newTeacherGender, setNewTeacherGender] = useState('Male');"
        )
    
    # 2. Add to Submission Payload (first form at ~line 5084)
    content = content.replace(
        "role: newEmployeeRole,\n                              subject:",
        "role: newEmployeeRole,\n                              gender: newTeacherGender,\n                              subject:"
    )
    
    # 3. Add to Quick Register form (~line 9660)
    content = content.replace(
        "role: newEmployeeRole,\n                               subject:",
        "role: newEmployeeRole,\n                               gender: newTeacherGender,\n                               subject:"
    )

    # 4. Add Gender Select in the Employee UI form (near newTeacherName input)
    form_input_target = """                            <input type="text" placeholder="Full Name" className="bg-muted border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold" value={newTeacherName} onChange={(e) => setNewTeacherName(e.target.value)} required />"""
    
    if form_input_target in content:
        replacement = form_input_target + """
                            <select value={newTeacherGender} onChange={(e) => setNewTeacherGender(e.target.value)} className="bg-muted border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold">
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>"""
        content = content.replace(form_input_target, replacement)
    
    # Same for Quick Register form
    form_input_target_quick = """                            <input type="text" placeholder="Full Name" className="bg-muted border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold" required />"""
    # Wait, the quick form doesn't bind to newTeacherName natively if it's uncontrolled, but looking at it, it probably does. Let's skip the quick form UI for now to avoid breaking it, or just do the main one.

    # 5. Update the Staff Cards rendering
    old_avatar = """{teach.photo ? (
                                <img src={teach.photo} alt={teach.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shrink-0" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-black text-primary text-sm shrink-0 group-hover:scale-105 transition-transform">
                                  {teach.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                              )}"""
    
    new_avatar = """{teach.photo ? (
                                <img src={teach.photo} alt={teach.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shrink-0" />
                              ) : (
                                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${teach.gender === 'Female' ? 'bg-pink-500/10 border-pink-500/20 text-pink-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                                  {teach.gender === 'Female' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z"/><path d="M16 16v-2a4 4 0 0 0-8 0v2"/><path d="M12 16v6"/><path d="M9 22h6"/></svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                  )}
                                </div>
                              )}"""
    content = content.replace(old_avatar, new_avatar)
    
    # 6. Add Salary block in the UI
    salary_target = """                          <div className="flex justify-between items-start">"""
    # Wait, instead of hacking it here, let's just replace the whole card body.
    
    old_card_grid = """                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 bg-muted/40 p-3 rounded-lg border border-border/50">
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
                          </div>"""

    new_card_grid = """                          <div className="space-y-3">
                            <div className="bg-primary/5 rounded border border-primary/10 p-2.5">
                              <span className="block text-[9px] font-bold text-foreground/50 uppercase tracking-wider mb-0.5">Salary</span>
                              <span className="block text-lg font-black text-foreground">Rs. {teach.salary ? Number(teach.salary).toLocaleString() : 'N/A'}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 bg-muted/40 p-3 rounded-lg border border-border/50">
                              {(!teach.role || teach.role === 'Teacher') ? (
                                <div className="col-span-2">
                                  <span className="block text-[9px] font-bold text-foreground/50 uppercase">Subject & Class</span>
                                  <span className="block text-xs font-semibold text-foreground/90">{teach.subject || 'N/A'} ({teach.className || 'N/A'})</span>
                                </div>
                              ) : (
                                <div className="col-span-2">
                                  <span className="block text-[9px] font-bold text-foreground/50 uppercase">Department / Area</span>
                                  <span className="block text-xs font-semibold text-foreground/90">{teach.subject || 'N/A'}</span>
                                </div>
                              )}
                              
                              <div className="col-span-2">
                                <span className="block text-[9px] font-bold text-foreground/50 uppercase">Qualification</span>
                                <span className="block text-xs font-semibold text-foreground/90">{teach.qualification || 'N/A'} {teach.experience ? `• ${teach.experience}` : ''}</span>
                              </div>
                              
                              {(teach.phone && teach.phone !== 'N/A') && (
                                <div className="col-span-2 flex items-center gap-2 mt-1">
                                  <span className="text-foreground/50"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
                                  <span className="block text-xs font-semibold text-foreground/90">{teach.phone}</span>
                                </div>
                              )}
                              
                              {(teach.email && teach.email !== 'N/A') && (
                                <div className="col-span-2 flex items-center gap-2">
                                  <span className="text-foreground/50"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>
                                  <span className="block text-xs font-semibold text-foreground/90 truncate">{teach.email}</span>
                                </div>
                              )}
                            </div>
                          </div>"""
    
    content = content.replace(old_card_grid, new_card_grid)

    # 7. Update Real Base Data
    old_teachers_data = """      teachers: [
        { id: '1', name: 'Usman Ghani', subject: 'English', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'Nida Yasir', subject: 'Physics', className: 'Class 10-B', status: 'Active' },
        { id: '3', name: 'Tariq Jameel', subject: 'Mathematics', className: 'Class 9-A', status: 'Active' }
      ],"""
      
    new_teachers_data = """      teachers: [
        { id: '1', name: 'Usman Ghani', subject: 'English', className: 'Class 10-A', status: 'Active', salary: '55000', experience: '4 Years', qualification: 'M.A. English', phone: '+92 300 1111111', email: 'usman.g@school.edu', gender: 'Male', role: 'Teacher' },
        { id: '2', name: 'Ayesha Khan', subject: 'Mathematics', className: 'Class 10-B', status: 'Active', salary: '60000', experience: '5 Years', qualification: 'M.Sc. Mathematics', phone: '+92 300 2222221', email: 'ayesha@school.edu', gender: 'Female', role: 'Teacher' },
        { id: '3', name: 'Fatima Noor', subject: 'Science', className: 'Class 6-A', status: 'Active', salary: '40000', experience: '2 Years', qualification: 'B.Sc. General Science', phone: '+92 300 3333333', email: 'fatima@school.edu', gender: 'Female', role: 'Teacher' },
        { id: '4', name: 'Tariq Jameel', subject: 'Islamic Studies', className: 'Class 9-A', status: 'Active', salary: '45000', experience: '8 Years', qualification: 'M.A. Islamic Studies', phone: '+92 300 4444444', email: 'tariq.j@school.edu', gender: 'Male', role: 'Teacher' },
        { id: '5', name: 'Nida Yasir', subject: 'Physics', className: 'Class 10-B', status: 'Active', salary: '50000', experience: '3 Years', qualification: 'M.Sc. Physics', phone: '+92 300 5555555', email: 'nida@school.edu', gender: 'Female', role: 'Teacher' }
      ],"""
      
    content = content.replace(old_teachers_data, new_teachers_data)

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Dashboard updated!")

if __name__ == '__main__':
    update_dashboard()
