import re

def update_file():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = [
        # TRANSPORT & HOSTEL
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('New vehicle added to fleet!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              alert('New vehicle added to fleet!'); 
              (e.target as HTMLFormElement).reset(); 
            }} className="""
        ),
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('New route saved!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              alert('New route saved!'); 
              (e.target as HTMLFormElement).reset(); 
            }} className="""
        ),
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('Driver registered successfully!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              alert('Driver registered successfully!'); 
              (e.target as HTMLFormElement).reset(); 
            }} className="""
        ),
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('Student transport route assigned!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              const f = e.target as HTMLFormElement;
              const stu = (f.elements.namedItem('stu_name') as HTMLSelectElement)?.value;
              const route = (f.elements.namedItem('route') as HTMLSelectElement)?.value;
              if (stu && route) {
                  setStudentTransport(prev => ({
                      ...prev,
                      [stu]: { active: true, route, vehicle: 'Assigned', driver: 'Pending', fee: 2500 }
                  }));
              }
              alert('Student transport route assigned!'); 
              f.reset(); 
            }} className="""
        ),
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('Mess menu updated successfully!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              alert('Mess menu updated successfully!'); 
              (e.target as HTMLFormElement).reset(); 
            }} className="""
        ),
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('Dorm room assigned successfully!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              alert('Dorm room assigned successfully!'); 
              (e.target as HTMLFormElement).reset(); 
            }} className="""
        ),
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('Hostel Bed allocation logged successfully!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              const f = e.target as HTMLFormElement;
              const stu = (f.elements.namedItem('stu_name') as HTMLSelectElement)?.value;
              const wing = (f.elements.namedItem('wing') as HTMLSelectElement)?.value;
              if (stu && wing) {
                  setStudentHostel(prev => ({
                      ...prev,
                      [stu]: { allocated: true, wing, room: 'Pending', warden: 'Assigned', feeStatus: 'Unpaid' }
                  }));
              }
              alert('Hostel Bed allocation logged successfully!'); 
              f.reset(); 
            }} className="""
        ),
        # HR & PAYROLL
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('Employee record registered successfully!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              const f = e.target as HTMLFormElement;
              const name = (f.elements.namedItem('empName') as HTMLInputElement)?.value;
              const role = (f.elements.namedItem('empRole') as HTMLSelectElement)?.value;
              if (name && role && currentSchool?.schoolId) {
                  setDatabase(prev => {
                      const db = prev[currentSchool.schoolId] || { teachers: [] };
                      return {
                          ...prev,
                          [currentSchool.schoolId]: {
                              ...db,
                              teachers: [...(db.teachers || []), { id: `emp-${Date.now()}`, name, subject: 'Staff', className: 'N/A', status: 'Active', role }]
                          }
                      };
                  });
              }
              alert('Employee record registered successfully!'); 
              f.reset(); 
            }} className="""
        ),
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('Monthly payroll disbursement initiated!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              alert('Monthly payroll disbursement initiated!'); 
              (e.target as HTMLFormElement).reset(); 
            }} className="""
        ),
        # ASSIGNMENTS
        (
            r"alert\('Assignment Published Successfully!'\);",
            r"""alert('Assignment Published Successfully!');
            if (currentSchool?.schoolId) {
                setDatabase(prev => {
                    const db = prev[currentSchool.schoolId];
                    if (!db) return prev;
                    return {
                        ...prev,
                        [currentSchool.schoolId]: {
                            ...db,
                            assignments: [...(db.assignments || []), { id: `asn-${Date.now()}`, title: newAssignmentTitle, class: newAssignmentClass, subject: newAssignmentSubject, deadline: newAssignmentDate, active: true }]
                        }
                    };
                });
                setNewAssignmentTitle('');
            }"""
        ),
        (
            r"alert\('Class diary has been updated\. Parents will be notified\.'\);",
            r"""alert('Class diary has been updated. Parents will be notified.');
            if (currentSchool?.schoolId) {
                setDatabase(prev => {
                    const db = prev[currentSchool.schoolId];
                    if (!db) return prev;
                    return {
                        ...prev,
                        [currentSchool.schoolId]: {
                            ...db,
                            notices: [...(db.notices || []), { id: `ntc-${Date.now()}`, date: new Date().toISOString().split('T')[0], title: 'Class Diary Updated', content: diaryEntry }]
                        }
                    };
                });
                setDiaryEntry('');
            }"""
        ),
        (
            r"alert\('Grades have been saved to the report card\.'\);",
            r"""alert('Grades have been saved to the report card.');
            setStudentGrades(prev => ({
                ...prev,
                [selectedReportStudent]: prev[selectedReportStudent] ? prev[selectedReportStudent].map(g => ({...g, grade: 'Updated'})) : []
            }));"""
        ),
        # FINANCE & FEES
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('Fee payment recorded!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              const f = e.target as HTMLFormElement;
              const stu = (f.elements.namedItem('stu_name') as HTMLSelectElement)?.value;
              const amount = (f.elements.namedItem('amount') as HTMLInputElement)?.value;
              if (stu && amount && currentSchool?.schoolId) {
                  setDatabase(prev => {
                      const db = prev[currentSchool.schoolId];
                      if (!db) return prev;
                      return {
                          ...prev,
                          [currentSchool.schoolId]: {
                              ...db,
                              invoices: [...(db.invoices || []), { id: `inv-${Date.now()}`, student: stu, amount: parseInt(amount), status: 'Paid' }]
                          }
                      };
                  });
              }
              alert('Fee payment recorded!'); 
              f.reset(); 
            }} className="""
        ),
        (
            r"alert\(`Fee collection of \$\{formatCurrency\(inv\.amount\)\} for \$\{inv\.name\} logged successfully!`\);",
            r"""alert(`Fee collection of ${formatCurrency(inv.amount)} for ${inv.name} logged successfully!`);
            if (currentSchool?.schoolId) {
                setDatabase(prev => {
                    const db = prev[currentSchool.schoolId];
                    if (!db) return prev;
                    return {
                        ...prev,
                        [currentSchool.schoolId]: {
                            ...db,
                            invoices: (db.invoices || []).map(i => i.id === inv.id ? {...i, status: 'Paid'} : i)
                        }
                    };
                });
            }"""
        ),
        (
            r"onClick=\{\(\) => alert\(\"Test SMS sent successfully!\"\)\}",
            r"""onClick={() => alert("Test SMS sent successfully!")}"""
        ),
        (
            r"<form onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\('Staff profile created successfully!'\); \}\} className=",
            r"""<form onSubmit={(e) => { 
              e.preventDefault(); 
              const f = e.target as HTMLFormElement;
              const name = (f.elements.namedItem('sName') as HTMLInputElement)?.value;
              const role = (f.elements.namedItem('sRole') as HTMLSelectElement)?.value;
              if (name && role && currentSchool?.schoolId) {
                  setDatabase(prev => {
                      const db = prev[currentSchool.schoolId] || { teachers: [] };
                      return {
                          ...prev,
                          [currentSchool.schoolId]: {
                              ...db,
                              teachers: [...(db.teachers || []), { id: `stf-${Date.now()}`, name, subject: 'General', className: 'N/A', status: 'Active', role }]
                          }
                      };
                  });
              }
              alert('Staff profile created successfully!'); 
              f.reset(); 
            }} className="""
        ),
        (
            r"alert\('Leave application successfully registered!'\);",
            r"""alert('Leave application successfully registered!');
            if (currentSchool?.schoolId && currentUser?.name) {
                setDatabase(prev => {
                    const db = prev[currentSchool.schoolId];
                    if (!db) return prev;
                    return {
                        ...prev,
                        [currentSchool.schoolId]: {
                            ...db,
                            leaves: [...(db.leaves || []), { id: `lv-${Date.now()}`, name: currentUser.name, date: new Date().toISOString().split('T')[0], reason: 'Applied via Student Portal', status: 'Pending Approval' }]
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
    
    print("Dashboard forms updated.")

if __name__ == '__main__':
    update_file()
