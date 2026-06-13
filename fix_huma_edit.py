import re

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Mrs. Huma Shah missing data
    target_huma = "{ id: '2', name: 'Mrs. Huma Shah', subject: 'Mathematics', className: 'Class 9-A', status: 'Active' }"
    new_huma = "{ id: '2', name: 'Mrs. Huma Shah', subject: 'Mathematics', className: 'Class 9-A', status: 'Active', salary: '55000', qualification: 'B.Sc. Mathematics', phone: '+92 300 9999999', email: 'huma.s@school.edu' }"
    if target_huma in content:
        content = content.replace(target_huma, new_huma)
        
    # 2. Update the actual setTeachers inside the Detailed Add Form
    target_set_teachers = """                            setTeachers(prev => [
                              ...prev,
                              { 
                                id: `t-${Date.now()}`, 
                                name: newTeacherName, 
                                role: newEmployeeRole,
                                gender: newTeacherGender,
                                subject: newTeacherSubject || 'N/A',
                                className: newEmployeeRole === 'Teacher' ? newTeacherClass : 'N/A', 
                                qualification: newTeacherQualification || 'N/A',
                                salary: newTeacherSalary || 'N/A',
                                experience: newTeacherExperience,
                                email: newTeacherEmail || 'N/A',
                                phone: newTeacherPhone || 'N/A',
                                photo: newTeacherPhoto,
                                doc: newTeacherDoc,
                                status: 'Active' 
                              }
                            ]);"""

    new_set_teachers = """                          if (editingTeacherId) {
                            setTeachers(prev => prev.map(t => t.id === editingTeacherId ? {
                                id: editingTeacherId, 
                                name: newTeacherName, 
                                role: newEmployeeRole,
                                gender: newTeacherGender,
                                subject: newTeacherSubject || 'N/A',
                                className: newEmployeeRole === 'Teacher' ? newTeacherClass : 'N/A', 
                                qualification: newTeacherQualification || 'N/A',
                                salary: newTeacherSalary || 'N/A',
                                experience: newTeacherExperience,
                                email: newTeacherEmail || 'N/A',
                                phone: newTeacherPhone || 'N/A',
                                photo: newTeacherPhoto,
                                doc: newTeacherDoc,
                                status: 'Active'
                            } : t));
                            setEditingTeacherId(null);
                          } else {
                            setTeachers(prev => [
                              ...prev,
                              { 
                                id: `t-${Date.now()}`, 
                                name: newTeacherName, 
                                role: newEmployeeRole,
                                gender: newTeacherGender,
                                subject: newTeacherSubject || 'N/A',
                                className: newEmployeeRole === 'Teacher' ? newTeacherClass : 'N/A', 
                                qualification: newTeacherQualification || 'N/A',
                                salary: newTeacherSalary || 'N/A',
                                experience: newTeacherExperience,
                                email: newTeacherEmail || 'N/A',
                                phone: newTeacherPhone || 'N/A',
                                photo: newTeacherPhoto,
                                doc: newTeacherDoc,
                                status: 'Active' 
                              }
                            ]);
                          }"""

    if target_set_teachers in content:
        content = content.replace(target_set_teachers, new_set_teachers)

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully updated UnifiedDashboard.tsx!")

if __name__ == '__main__':
    main()
