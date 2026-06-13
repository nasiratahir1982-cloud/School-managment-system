import re

def update_css():
    with open('frontend/src/index.css', 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '.modern-input' not in content:
        new_css = """
@layer components {
  .modern-input {
    @apply bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold outline-none transition-all duration-300;
  }
  .modern-input:focus {
    @apply border-primary ring-1 ring-primary/50 shadow-[0_0_15px_hsl(var(--primary)_/_0.3)] bg-muted/80;
  }
  .modern-input:hover:not(:focus) {
    @apply border-primary/50 shadow-[0_0_10px_hsl(var(--primary)_/_0.15)];
  }
}
"""
        content += new_css
        with open('frontend/src/index.css', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated index.css")

def update_dashboard():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update existing ugly tailwind classes for inputs to `modern-input`
    # Replace common patterns
    patterns_to_replace = [
        "bg-card border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold outline-none focus:border-primary",
        "bg-muted border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold outline-none focus:border-primary",
        "bg-card border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold",
        "bg-muted border border-border rounded-lg text-xs p-2.5 text-foreground font-semibold",
        "bg-muted border border-border rounded-lg text-[11px] p-2 px-3",
        "bg-card border border-border rounded-lg text-[11px] p-2 px-3 text-foreground outline-none focus:border-primary transition-colors"
    ]
    
    for pattern in patterns_to_replace:
        content = content.replace(pattern, "modern-input")
        # Also handle any cases where they might be appended with w-full
        content = content.replace('modern-input w-full', 'modern-input w-full')

    # 2. Add New States for Student Management
    if 'const [studentClassFilter, setStudentClassFilter] = useState' not in content:
        state_injection = """  const [studentClassFilter, setStudentClassFilter] = useState('All');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editStudentForm, setEditStudentForm] = useState<any>({});"""
        content = content.replace("const [studentSearchTerm, setStudentSearchTerm] = useState('');", 
                                  "const [studentSearchTerm, setStudentSearchTerm] = useState('');\n" + state_injection)

    # 3. Add 10 Students to Default DB
    old_students_data = """      students: [
        { id: '1', name: 'Muhammad Ali', roll: '101', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Fatima Zahra', roll: '104', className: 'Class 10-B', status: 'Present' },
        { id: '3', name: 'Bilal Ahmed', roll: '102', className: 'Class 9-A', status: 'Absent' }
      ],"""
      
    new_students_data = """      students: [
        { id: '1', name: 'Muhammad Ali', roll: '101', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Fatima Zahra', roll: '104', className: 'Class 10-B', status: 'Present' },
        { id: '3', name: 'Bilal Ahmed', roll: '102', className: 'Class 9-A', status: 'Absent' },
        { id: '4', name: 'Zainab Qasim', roll: '105', className: 'Class 10-A', status: 'Present' },
        { id: '5', name: 'Omar Farooq', roll: '106', className: 'Class 10-B', status: 'Present' },
        { id: '6', name: 'Ayesha Siddiqa', roll: '107', className: 'Class 9-A', status: 'Present' },
        { id: '7', name: 'Hassan Raza', roll: '108', className: 'Class 10-A', status: 'Absent' },
        { id: '8', name: 'Maryam Noor', roll: '109', className: 'Class 8-A', status: 'Present' },
        { id: '9', name: 'Usman Tariq', roll: '110', className: 'Class 8-A', status: 'Present' },
        { id: '10', name: 'Khadija Sultan', roll: '111', className: 'Class 9-B', status: 'Present' },
        { id: '11', name: 'Ali Hamza', roll: '112', className: 'Class 9-B', status: 'Absent' },
        { id: '12', name: 'Sara Khan', roll: '113', className: 'Class 7-A', status: 'Present' },
        { id: '13', name: 'Ibrahim Malik', roll: '114', className: 'Class 7-A', status: 'Present' }
      ],"""
    content = content.replace(old_students_data, new_students_data)
    
    # 4. Filter Logic update
    # In the Student Roster Grid:
    roster_target = """                      <div className="flex flex-wrap justify-center gap-3">
                        {filteredStudents.filter(s => s.name.toLowerCase().includes(studentSearchTerm.toLowerCase())).map((stud) => {"""
                        
    roster_injection = """                      {/* Class Filter Pill Menu */}
                      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
                        <button onClick={() => setStudentClassFilter('All')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${studentClassFilter === 'All' ? 'bg-primary text-white shadow-md' : 'bg-muted/50 text-foreground/70 hover:bg-muted'}`}>All Classes</button>
                        {classes.map(c => (
                          <button key={c.id} onClick={() => setStudentClassFilter(c.name)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${studentClassFilter === c.name ? 'bg-primary text-white shadow-md' : 'bg-muted/50 text-foreground/70 hover:bg-muted'}`}>
                            {c.name}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap justify-center gap-3">
                        {filteredStudents
                          .filter(s => studentClassFilter === 'All' || s.className === studentClassFilter)
                          .filter(s => s.name.toLowerCase().includes(studentSearchTerm.toLowerCase()))
                          .map((stud) => {"""
    
    if roster_target in content:
        content = content.replace(roster_target, roster_injection)

    # 5. Student Card Editable UI
    # We replace the map body for the student card.
    # We will need to locate the existing card first.
    
    # Use regex or exact string matching to replace the return block inside the student map
    card_start = """                          return (
                            <div key={stud.id} className="relative group w-full sm:w-48 bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all overflow-hidden">"""
    
    card_end = """                            </div>
                          );"""
    
    # Instead of string replacement which can be fragile for a large block, let's inject just inside the card.
    
    old_card_full = """                          return (
                            <div key={stud.id} className="relative group w-full sm:w-48 bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-black text-primary text-sm shadow-sm group-hover:scale-105 transition-transform">
                                  {initials}
                                </div>
                                <div className="text-center">
                                  <span className="block text-sm font-black text-foreground truncate w-40">{stud.name}</span>
                                  <span className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider">{stud.className}</span>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center px-1">
                                <div className="flex flex-col">
                                  <span className="text-[9px] text-foreground/50 uppercase font-bold">Roll No</span>
                                  <span className="text-xs font-mono font-bold">{stud.roll}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-[9px] text-foreground/50 uppercase font-bold">Status</span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stud.status === 'Present' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{stud.status}</span>
                                </div>
                              </div>
                            </div>
                          );"""
                          
    new_card_full = """                          const isEditing = editingStudentId === stud.id;
                          return (
                            <div key={stud.id} className="relative group w-full sm:w-60 bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                              
                              {isEditing ? (
                                <form onSubmit={(e) => {
                                  e.preventDefault();
                                  setEditingStudentId(null);
                                  requestSecurityVerification(`Update records for student: ${editStudentForm.name}`, () => {
                                    setStudents(prev => prev.map((s: any) => s.id === stud.id ? { ...s, ...editStudentForm } : s));
                                  });
                                }} className="space-y-2">
                                  <input type="text" value={editStudentForm.name} onChange={e => setEditStudentForm({...editStudentForm, name: e.target.value})} className="modern-input w-full text-xs" required />
                                  <div className="grid grid-cols-2 gap-2">
                                    <input type="text" value={editStudentForm.roll} onChange={e => setEditStudentForm({...editStudentForm, roll: e.target.value})} className="modern-input w-full text-xs" required placeholder="Roll No" />
                                    <select value={editStudentForm.className} onChange={e => setEditStudentForm({...editStudentForm, className: e.target.value})} className="modern-input w-full text-xs">
                                      {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                  </div>
                                  <select value={editStudentForm.status} onChange={e => setEditStudentForm({...editStudentForm, status: e.target.value})} className="modern-input w-full text-xs">
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Suspended">Suspended</option>
                                  </select>
                                  <div className="flex gap-2 pt-1">
                                    <button type="submit" className="w-full py-1.5 bg-primary text-white text-xs font-bold rounded shadow-md hover:bg-primary/90">Save</button>
                                    <button type="button" onClick={() => setEditingStudentId(null)} className="w-full py-1.5 bg-muted text-foreground text-xs font-bold rounded shadow-sm hover:bg-muted/80">Cancel</button>
                                  </div>
                                </form>
                              ) : (
                                <>
                                  <div className="flex flex-col items-center gap-2 relative">
                                    {isEditor && (
                                      <button onClick={() => {
                                        setEditingStudentId(stud.id);
                                        setEditStudentForm({...stud});
                                      }} className="absolute top-0 right-0 p-1.5 text-foreground/40 hover:text-primary transition-colors bg-muted/50 rounded-lg hover:bg-primary/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                                      </button>
                                    )}
                                    <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-black text-primary text-sm shadow-sm group-hover:scale-105 transition-transform">
                                      {initials}
                                    </div>
                                    <div className="text-center">
                                      <span className="block text-sm font-black text-foreground truncate w-40">{stud.name}</span>
                                      <span className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider">{stud.className}</span>
                                    </div>
                                  </div>
                                  <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center px-1">
                                    <div className="flex flex-col">
                                      <span className="text-[9px] text-foreground/50 uppercase font-bold">Roll No</span>
                                      <span className="text-xs font-mono font-bold">{stud.roll}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                      <span className="text-[9px] text-foreground/50 uppercase font-bold">Status</span>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stud.status === 'Present' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{stud.status}</span>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          );"""
                          
    if old_card_full in content:
        content = content.replace(old_card_full, new_card_full)

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated UnifiedDashboard.tsx")

if __name__ == '__main__':
    update_css()
    update_dashboard()
