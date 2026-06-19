import re

def update_file():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = [
        # QUIZ
        (
            r"onClick=\{\(\) => alert\(\"Quiz Generated! A notification has been sent to the class\.\"\)\}",
            r"""onClick={() => {
              alert("Quiz Generated! A notification has been sent to the class.");
              if (currentSchool?.schoolId) {
                  setDatabase(prev => {
                      const db = prev[currentSchool.schoolId];
                      if (!db) return prev;
                      return {
                          ...prev,
                          [currentSchool.schoolId]: {
                              ...db,
                              assignments: [...(db.assignments || []), { id: `quiz-${Date.now()}`, title: 'New Auto-Generated Quiz', class: 'Various', subject: 'Generated', deadline: new Date().toISOString().split('T')[0], active: true }]
                          }
                      };
                  });
              }
            }}"""
        ),
        # LIVE QUIZ
        (
            r"alert\('Live Quiz has been successfully launched\. Students will be notified instantly\.'\);",
            r"""alert('Live Quiz has been successfully launched. Students will be notified instantly.');
            if (currentSchool?.schoolId) {
                setDatabase(prev => {
                    const db = prev[currentSchool.schoolId];
                    if (!db) return prev;
                    return {
                        ...prev,
                        [currentSchool.schoolId]: {
                            ...db,
                            notices: [...(db.notices || []), { id: `ntc-${Date.now()}`, date: new Date().toISOString().split('T')[0], title: 'Live Quiz Active', content: 'A live quiz has been started by your teacher. Please join immediately.' }]
                        }
                    };
                });
            }"""
        ),
        # REMARKS
        (
            r"onClick=\{\(\) => alert\(\"Remark logged! It is now visible on the Parent's Dashboard\.\"\)\}",
            r"""onClick={() => {
              alert("Remark logged! It is now visible on the Parent's Dashboard.");
              if (currentSchool?.schoolId) {
                  setDatabase(prev => {
                      const db = prev[currentSchool.schoolId];
                      if (!db) return prev;
                      return {
                          ...prev,
                          [currentSchool.schoolId]: {
                              ...db,
                              disciplines: [...(db.disciplines || []), { id: `disc-${Date.now()}`, name: 'Selected Student', date: new Date().toISOString().split('T')[0], infraction: 'General Remark', action: 'Notified Parent' }]
                          }
                      };
                  });
              }
            }}"""
        ),
        # STUDENT REMARK 2
        (
            r"alert\('Student remark has been logged and sent to parents\.'\);",
            r"""alert('Student remark has been logged and sent to parents.');
            if (currentSchool?.schoolId) {
                setDatabase(prev => {
                    const db = prev[currentSchool.schoolId];
                    if (!db) return prev;
                    return {
                        ...prev,
                        [currentSchool.schoolId]: {
                            ...db,
                            disciplines: [...(db.disciplines || []), { id: `rmk-${Date.now()}`, name: selectedReportStudent || 'General', date: new Date().toISOString().split('T')[0], infraction: 'Teacher Remark', action: 'Sent to Parent Portal' }]
                        }
                    };
                });
            }"""
        ),
        # LEAVES
        (
            r"alert\(`Leave Request for \$\{req\.name\} Approved successfully\.\`\);",
            r"""alert(`Leave Request for ${req.name} Approved successfully.`);
            if (currentSchool?.schoolId) {
                setDatabase(prev => {
                    const db = prev[currentSchool.schoolId];
                    if (!db) return prev;
                    return {
                        ...prev,
                        [currentSchool.schoolId]: {
                            ...db,
                            leaves: (db.leaves || []).map(l => l.id === req.id ? {...l, status: 'Approved'} : l)
                        }
                    };
                });
            }"""
        ),
        (
            r"alert\(`Leave Request for \$\{req\.name\} Rejected\.\`\);",
            r"""alert(`Leave Request for ${req.name} Rejected.`);
            if (currentSchool?.schoolId) {
                setDatabase(prev => {
                    const db = prev[currentSchool.schoolId];
                    if (!db) return prev;
                    return {
                        ...prev,
                        [currentSchool.schoolId]: {
                            ...db,
                            leaves: (db.leaves || []).map(l => l.id === req.id ? {...l, status: 'Rejected'} : l)
                        }
                    };
                });
            }"""
        ),
        # LIBRARY
        (
            r"alert\('Book issued successfully to selected student!'\);",
            r"""alert('Book issued successfully to selected student!');
            const f = document.getElementById('issueBookForm') as HTMLFormElement;
            if (f) {
                const bTitle = (f.elements.namedItem('bookTitle') as HTMLInputElement)?.value;
                const stu = (f.elements.namedItem('studentName') as HTMLSelectElement)?.value;
                if (bTitle && stu) {
                    setStudentLibrary(prev => ({
                        ...prev,
                        [stu]: [...(prev[stu] || []), { id: `lib-${Date.now()}`, title: bTitle, issueDate: new Date().toISOString().split('T')[0], dueDate: '2026-06-30', status: 'Active' }]
                    }));
                    f.reset();
                }
            }"""
        ),
        # HR FORMS
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('Job vacancy opening posted successfully!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              alert('Job vacancy opening posted successfully!'); 
              (e.target as HTMLFormElement).reset(); 
            }} className="""
        ),
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('Performance score logged!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              alert('Performance score logged!'); 
              (e.target as HTMLFormElement).reset(); 
            }} className="""
        ),
        # PROSPECTIVE LEAD
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('Prospective lead added successfully!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              const f = e.target as HTMLFormElement;
              const name = (f.elements.namedItem('lName') as HTMLInputElement)?.value;
              const phone = (f.elements.namedItem('lPhone') as HTMLInputElement)?.value;
              if (name && currentSchool?.schoolId) {
                  setDatabase(prev => {
                      const db = prev[currentSchool.schoolId];
                      if (!db) return prev;
                      const funnel = db.admissionFunnel || { inquiries: [], applications: [], interviews: [], enrolled: [] };
                      return {
                          ...prev,
                          [currentSchool.schoolId]: {
                              ...db,
                              admissionFunnel: {
                                  ...funnel,
                                  inquiries: [...funnel.inquiries, { id: `inq-${Date.now()}`, name, phone: phone || '', email: '', className: 'Unspecified', date: new Date().toISOString().split('T')[0], notes: 'Added manually via dashboard', status: 'New' }]
                              }
                          }
                      };
                  });
              }
              alert('Prospective lead added successfully!'); 
              f.reset(); 
            }} className="""
        ),
        # EXPENSE
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('Expense payout logged!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              alert('Expense payout logged!'); 
              (e.target as HTMLFormElement).reset(); 
            }} className="""
        ),
        # GLOBAL NOTICE
        (
            r"alert\('Global notice announcement broadcasted successfully!'\);",
            r"""alert('Global notice announcement broadcasted successfully!');
            if (currentSchool?.schoolId) {
                setDatabase(prev => {
                    const db = prev[currentSchool.schoolId];
                    if (!db) return prev;
                    return {
                        ...prev,
                        [currentSchool.schoolId]: {
                            ...db,
                            notices: [{ id: `ntc-g-${Date.now()}`, date: new Date().toISOString().split('T')[0], title: 'GLOBAL ANNOUNCEMENT', content: 'Broadcasted to all users: Please check school communication channels.' }, ...(db.notices || [])]
                        }
                    };
                });
            }"""
        )
    ]

    for old, new_r in replacements:
        content = re.sub(old, new_r, content)

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Dashboard forms updated - phase 2.")

if __name__ == '__main__':
    update_file()
