import re

def modify_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add state variable extraction
    target1 = "  const schoolSubjects = schoolDb.subjects || SUBJECTS_LIST;\n"
    if target1 in content:
        content = content.replace(target1, target1 + "  const minAdmissionAge = schoolDb.minAdmissionAge || 3;\n")
        print("Inserted minAdmissionAge extraction.")

    # 2. Add setter
    target2 = "  const setSchoolSubjects = (val: any) => updateSchoolDb('subjects', val);\n"
    if target2 in content:
        content = content.replace(target2, target2 + "  const setMinAdmissionAge = (val: any) => updateSchoolDb('minAdmissionAge', val);\n")
        print("Inserted setMinAdmissionAge.")

    # 3. Add local input state
    target3 = "  const [newSetupSubject, setNewSetupSubject] = useState('');\n"
    if target3 in content:
        content = content.replace(target3, target3 + "  const [newSetupMinAge, setNewSetupMinAge] = useState(minAdmissionAge.toString());\n")
        print("Inserted newSetupMinAge local state.")

    # 4. Add Admission Settings card to Academic Setup Hub
    target4 = """                      </div>
                    </div>
                  </div>
                </div>"""
    
    card_html = """                      </div>
                    </div>
                  </div>

                  {/* Admission Settings */}
                  <div className="p-4 bg-card/50 border border-border rounded-xl space-y-4">
                    <h4 className="text-sm font-bold text-foreground">Admission Settings</h4>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={newSetupMinAge}
                        onChange={(e) => setNewSetupMinAge(e.target.value)}
                        placeholder="Minimum Admission Age"
                        className="flex-1 bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground"
                      />
                      <button
                        onClick={() => {
                          const age = parseInt(newSetupMinAge);
                          if (isNaN(age) || age < 1) {
                            alert('Please enter a valid age');
                            return;
                          }
                          requestSecurityVerification(`Set minimum admission age to ${age} years`, () => {
                            setMinAdmissionAge(age);
                          });
                        }}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                      >
                        Save Setting
                      </button>
                    </div>
                    <p className="text-[10px] text-foreground/50 m-0">Current limit: <strong>{minAdmissionAge} years</strong></p>
                  </div>
                </div>"""
    
    if target4 in content:
        content = content.replace(target4, card_html, 1)
        print("Inserted Admission Settings card.")

    # 5. Add validation in Enroll New Student
    target5 = """                        if (parseFloat(newStudentMarks) < 50) {"""
    
    validation_code = """                        if (parseFloat(newStudentAge) < minAdmissionAge) {
                          setEnrollmentError(`Admission Rejected: Student age (${newStudentAge}) is below the minimum admission age requirement of ${minAdmissionAge} years.`);
                          return;
                        }
                        if (parseFloat(newStudentMarks) < 50) {"""
    
    if target5 in content:
        content = content.replace(target5, validation_code, 1)
        print("Inserted enrollment age validation.")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    modify_file('frontend/src/pages/UnifiedDashboard.tsx')
