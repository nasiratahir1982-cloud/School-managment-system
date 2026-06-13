import re

def modify_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to replace the validation
    target_validation = """                        if (isNaN(age) || age < 4) {
                          setEnrollmentError('Admission Criteria Failed: Student must be at least 4 years old.');"""
    
    new_validation = """                        if (isNaN(age) || age < minAdmissionAge) {
                          setEnrollmentError(`Admission Criteria Failed: Student must be at least ${minAdmissionAge} years old.`);"""

    if target_validation in content:
        content = content.replace(target_validation, new_validation)
        print("Updated validation logic.")
    
    target_input = """<input type="number" required placeholder="Minimum 4 years" value={newStudentAge} onChange={(e) => setNewStudentAge(e.target.value)}"""
    new_input = """<input type="number" required placeholder={`Minimum ${minAdmissionAge} years`} value={newStudentAge} onChange={(e) => setNewStudentAge(e.target.value)}"""
    
    if target_input in content:
        content = content.replace(target_input, new_input)
        print("Updated input placeholder.")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    modify_file('frontend/src/pages/UnifiedDashboard.tsx')
