import re

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add editingTeacherId state
    target_state = "const [newTeacherName, setNewTeacherName] = useState('');"
    new_state = "const [newTeacherName, setNewTeacherName] = useState('');\n    const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);"
    if target_state in content and "setEditingTeacherId" not in content:
        content = content.replace(target_state, new_state)

    # 2. Update the form submit to handle edit
    form_submit_target = """                          setTeachers(prev => [newTeach, ...prev]);
                          
                          // Reset form
                          setNewTeacherName('');"""
    
    new_form_submit = """                          if (editingTeacherId) {
                            setTeachers(prev => prev.map(t => t.id === editingTeacherId ? newTeach : t));
                            setEditingTeacherId(null);
                          } else {
                            setTeachers(prev => [newTeach, ...prev]);
                          }
                          
                          // Reset form
                          setNewTeacherName('');"""
    
    if form_submit_target in content:
        content = content.replace(form_submit_target, new_form_submit)

    # Also change the button text based on editingTeacherId
    btn_text_target = """                              + Add New Employee
                            </button>"""
    new_btn_text = """                              {editingTeacherId ? 'Save Changes' : '+ Add New Employee'}
                            </button>
                            {editingTeacherId && (
                              <button type="button" onClick={() => {
                                setEditingTeacherId(null);
                                setNewTeacherName('');
                                setNewTeacherQualification('');
                                setNewTeacherSalary('');
                                setNewTeacherEmail('');
                                setNewTeacherPhone('');
                              }} className="px-6 py-2 bg-muted hover:bg-border text-foreground font-bold text-xs rounded-lg transition-all shadow-md ml-2">
                                Cancel
                              </button>
                            )}"""
    if btn_text_target in content:
        content = content.replace(btn_text_target, new_btn_text)

    # 3. Add Edit button next to Dismiss
    dismiss_target = """                                  <button 
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to dismiss this employee?')) {"""
    
    edit_button = """                                  <button 
                                    onClick={() => {
                                      setEditingTeacherId(teach.id);
                                      setNewTeacherName(teach.name);
                                      setNewEmployeeRole(teach.role || 'Teacher');
                                      setNewTeacherGender(teach.gender || 'Male');
                                      setNewTeacherSubject(teach.subject !== 'N/A' ? teach.subject : '');
                                      setNewTeacherClass(teach.className !== 'N/A' ? teach.className : '');
                                      setNewTeacherQualification(teach.qualification !== 'N/A' ? teach.qualification : '');
                                      setNewTeacherSalary(teach.salary !== 'N/A' ? teach.salary : '');
                                      setNewTeacherExperience(teach.experience !== 'N/A' ? teach.experience : 'Fresh');
                                      setNewTeacherEmail(teach.email !== 'N/A' ? teach.email : '');
                                      setNewTeacherPhone(teach.phone !== 'N/A' ? teach.phone : '');
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="text-[10px] text-primary hover:text-primary/80 font-bold mt-1 uppercase mr-4"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to dismiss this employee?')) {"""
    
    if dismiss_target in content and "setEditingTeacherId(teach.id)" not in content:
        content = content.replace(dismiss_target, edit_button)

    # 4. Replace N/A in mock data
    # Find all teachers array items with N/A and replace them with realistic data
    # e.g., className: 'N/A' -> className: 'General', salary: 'N/A' -> salary: '50000', etc.
    # It's easier to just use regex on the whole document for specific N/A fields if it's within a teachers object
    # But since it's hardcoded mock objects, I will just do a simple replacement for those lines.
    content = content.replace("className: 'N/A'", "className: 'Admin Block'")
    content = content.replace("salary: 'N/A'", "salary: '45000'")
    content = content.replace("qualification: 'N/A'", "qualification: 'Bachelors'")
    content = content.replace("experience: 'N/A'", "experience: '3 Years'")
    content = content.replace("email: 'N/A'", "email: 'staff@academichub.com'")
    content = content.replace("phone: 'N/A'", "phone: '+92 300 1234567'")
    
    # Also fix {teach.salary ? ... : 'N/A'} if someone clears the salary
    content = content.replace("Rs. {teach.salary ? Number(teach.salary).toLocaleString() : 'N/A'}", "Rs. {teach.salary ? Number(teach.salary).toLocaleString() : 'Not Set'}")

    # Add default salaries to mock objects that don't even have the `salary` key
    # e.g. { id: '1', name: 'Sarah Khan', role: 'Teacher', subject: 'English', className: 'Class 10-A', status: 'Active' },
    content = re.sub(
        r"(role: 'Teacher', subject: '[^']+', className: '[^']+', status: 'Active')(\s*\})",
        r"\1, salary: '65000', qualification: 'M.Ed', phone: '+92 300 0000000'\2",
        content
    )
    content = re.sub(
        r"(role: 'Vice Principal', subject: '[^']+', className: '[^']+', status: 'Active')(\s*\})",
        r"\1, salary: '120000', qualification: 'PhD', phone: '+92 300 1111111'\2",
        content
    )
    content = re.sub(
        r"(role: 'Coordinator', subject: '[^']+', className: '[^']+', status: 'Active')(\s*\})",
        r"\1, salary: '85000', qualification: 'MBA', phone: '+92 300 2222222'\2",
        content
    )
    content = re.sub(
        r"(role: 'Guard', subject: '[^']+', className: '[^']+', status: 'Active')(\s*\})",
        r"\1, salary: '35000', qualification: 'Matric', phone: '+92 300 3333333'\2",
        content
    )
    content = re.sub(
        r"(role: 'Electrician', subject: '[^']+', className: '[^']+', status: 'Active')(\s*\})",
        r"\1, salary: '40000', qualification: 'Diploma', phone: '+92 300 4444444'\2",
        content
    )
    content = re.sub(
        r"(role: 'Plumber', subject: '[^']+', className: '[^']+', status: 'Active')(\s*\})",
        r"\1, salary: '38000', qualification: 'Diploma', phone: '+92 300 5555555'\2",
        content
    )
    content = re.sub(
        r"(role: 'Gardener', subject: '[^']+', className: '[^']+', status: 'Active')(\s*\})",
        r"\1, salary: '32000', qualification: 'Middle', phone: '+92 300 6666666'\2",
        content
    )
    
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully updated UnifiedDashboard.tsx!")

if __name__ == '__main__':
    main()
