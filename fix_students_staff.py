"""
Comprehensive fix:
1. All schools get exactly 10 properly-formatted students (with borrowedBooks, bookedTransport, hostelStatus)
2. All schools get 15+ staff including substitute teachers - all with salaries
3. Fix school 2's incomplete student data
"""

SETHELPER = "const setInventory = (val: any) => updateSchoolDb('inventory', val);"

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # -----------------------------------------------------------------------
    # SCHOOL 1 - Academic Hub Lahore (already has 22 students, trim to 10 best + add hostel/transport)
    # -----------------------------------------------------------------------
    old_s1_students = """      students: [
        { id: '1', name: 'Kamran Shah', roll: '12', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Ayesha Siddiqui', roll: '04', className: 'Class 10-B', status: 'Present' },
        { id: '3', name: 'Zainab Ali', roll: '22', className: 'Class 9-A', status: 'Absent' },
        { id: '4', name: 'Bilal Ahmed', roll: '08', className: 'Class 10-A', status: 'Present' },
        { id: '5', name: 'Fatima Noor', roll: '15', className: 'Class 8-C', status: 'Present' },
        { id: '6', name: 'Saad Tariq', roll: '31', className: 'Class 9-B', status: 'Late' },
        { id: '7', name: 'Hassan Raza', roll: '02', className: 'Class 7-A', status: 'Present' },
        { id: '8', name: 'Mariam Khan', roll: '19', className: 'Class 10-A', status: 'Present' },
        { id: '9', name: 'Usman Ghani', roll: '27', className: 'Class 8-B', status: 'Absent' },
        { id: '10', name: 'Hira Malik', roll: '11', className: 'Class 9-A', status: 'Present' },
        { id: '11', name: 'Ali Zafar', roll: '05', className: 'Class 7-B', status: 'Present' },
        { id: '12', name: 'Sana Javed', roll: '14', className: 'Class 10-B', status: 'Late' },
        { id: '13', name: 'Omar Farooq', roll: '21', className: 'Class 8-A', status: 'Present' },
        { id: '14', name: 'Amina Baig', roll: '09', className: 'Class 9-B', status: 'Present' },
        { id: '15', name: 'Zeeshan Qureshi', roll: '33', className: 'Class 10-A', status: 'Absent' },
        { id: '16', name: 'Nida Yasir', roll: '18', className: 'Class 7-A', status: 'Present' },
        { id: '17', name: 'Hamza Ali', roll: '25', className: 'Class 8-C', status: 'Present' },
        { id: '18', name: 'Rabia Aslam', roll: '07', className: 'Class 9-A', status: 'Present' },
        { id: '19', name: 'Danish Nawaz', roll: '30', className: 'Class 10-B', status: 'Present' },
        { id: '20', name: 'Iqra Aziz', roll: '16', className: 'Class 8-B', status: 'Late' },
        { id: '21', name: 'Imran Abbas', roll: '03', className: 'Class 7-B', status: 'Present' },
        { id: '22', name: 'Mahira Khan', roll: '28', className: 'Class 10-A', status: 'Present' }
      ],"""
    new_s1_students = """      students: [
        { id: '1', name: 'Kamran Shah', roll: '12', className: 'Class 10-A', status: 'Present', borrowedBooks: ['Physics Vol 1', 'Advanced Mathematics'], bookedTransport: 'Route A', hostelStatus: 'Room 101' },
        { id: '2', name: 'Ayesha Siddiqui', roll: '04', className: 'Class 10-B', status: 'Present', borrowedBooks: ['English Literature'], bookedTransport: 'Route B', hostelStatus: 'Day Scholar' },
        { id: '3', name: 'Zainab Ali', roll: '22', className: 'Class 9-A', status: 'Absent', borrowedBooks: ['Biology Concepts'], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '4', name: 'Bilal Ahmed', roll: '08', className: 'Class 10-A', status: 'Present', borrowedBooks: ['Chemistry Essentials'], bookedTransport: 'Route A', hostelStatus: 'Room 102' },
        { id: '5', name: 'Fatima Noor', roll: '15', className: 'Class 8-C', status: 'Present', borrowedBooks: [], bookedTransport: 'Route C', hostelStatus: 'Day Scholar' },
        { id: '6', name: 'Saad Tariq', roll: '31', className: 'Class 9-B', status: 'Late', borrowedBooks: ['World History'], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '7', name: 'Hassan Raza', roll: '02', className: 'Class 7-A', status: 'Present', borrowedBooks: ['Math Grade 7'], bookedTransport: 'Route B', hostelStatus: 'Day Scholar' },
        { id: '8', name: 'Mariam Khan', roll: '19', className: 'Class 10-A', status: 'Present', borrowedBooks: ['English Grammar'], bookedTransport: 'Route A', hostelStatus: 'Room 205' },
        { id: '9', name: 'Usman Ghani', roll: '27', className: 'Class 8-B', status: 'Absent', borrowedBooks: ['Intro to Computer Science'], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '10', name: 'Hira Malik', roll: '11', className: 'Class 9-A', status: 'Present', borrowedBooks: ['Geography Workbook'], bookedTransport: 'Route C', hostelStatus: 'Room 110' }
      ],"""
    if old_s1_students in content:
        content = content.replace(old_s1_students, new_s1_students)
        print("School 1 students updated to exactly 10.")

    # Update School 1 teachers - expand to 15 staff including substitutes
    old_s1_teachers = """      teachers: [
        { id: '1', name: 'Sarah Khan', role: 'Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '150000', qualification: 'PhD Education', experience: '18 Years', phone: '+92 300 1010101', email: 'sarah.khan@academichub.edu', gender: 'Female' },
        { id: '2', name: 'Raza Ahmed', role: 'Teacher', subject: 'Physics', className: 'Class 10-B', status: 'Active', salary: '75000', qualification: 'M.Sc. Physics', experience: '9 Years', phone: '+92 300 1020202', email: 'raza.ahmed@academichub.edu', gender: 'Male' },
        { id: '3', name: 'Hina Malik', role: 'Teacher', subject: 'Mathematics', className: 'Class 9-A', status: 'Active', salary: '70000', qualification: 'M.Sc. Mathematics', experience: '7 Years', phone: '+92 300 1030303', email: 'hina.malik@academichub.edu', gender: 'Female' },
        { id: '4', name: 'Tariq Mehmood', role: 'Vice Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '120000', qualification: 'PhD', experience: '14 Years', phone: '+92 300 1040404', email: 'tariq.m@academichub.edu', gender: 'Male' },
        { id: '5', name: 'Ayesha Bibi', role: 'Academic Coordinator', subject: 'Academics', className: 'Admin Block', status: 'Active', salary: '85000', qualification: 'MBA', experience: '10 Years', phone: '+92 300 1050505', email: 'ayesha.b@academichub.edu', gender: 'Female' },
        { id: '6', name: 'Nadia Hussain', role: 'Teacher', subject: 'English Literature', className: 'Class 10-A', status: 'Active', salary: '68000', qualification: 'M.A. English', experience: '6 Years', phone: '+92 300 1060606', email: 'nadia.h@academichub.edu', gender: 'Female' },
        { id: '7', name: 'Omer Shahid', role: 'Teacher', subject: 'Biology', className: 'Class 8-A', status: 'Active', salary: '65000', qualification: 'M.Sc. Biology', experience: '5 Years', phone: '+92 300 1070707', email: 'omer.s@academichub.edu', gender: 'Male' },
        { id: '8', name: 'Bashir Ahmed', role: 'Guard', subject: 'Security', className: 'Main Gate', status: 'Active', salary: '35000', qualification: 'Matric', experience: '8 Years', phone: '+92 300 1080808', email: 'security@academichub.edu', gender: 'Male' },
        { id: '9', name: 'Sajid Ali', role: 'Electrician', subject: 'Maintenance', className: 'Campus', status: 'Active', salary: '42000', qualification: 'Diploma Electrical', experience: '6 Years', phone: '+92 300 1090909', email: 'maintenance@academichub.edu', gender: 'Male' },
        { id: '10', name: 'Zubaida Parveen', role: 'Domestic Staff', subject: 'Cleaning', className: 'Block A', status: 'Active', salary: '28000', qualification: 'Middle', experience: '4 Years', phone: '+92 300 1001001', email: 'staff@academichub.edu', gender: 'Female' }
      ],"""
    new_s1_teachers = """      teachers: [
        { id: '1', name: 'Sarah Khan', role: 'Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '150000', qualification: 'PhD Education', experience: '18 Years', phone: '+92 300 1010101', email: 'sarah.khan@academichub.edu', gender: 'Female' },
        { id: '2', name: 'Tariq Mehmood', role: 'Vice Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '120000', qualification: 'PhD', experience: '14 Years', phone: '+92 300 1040404', email: 'tariq.m@academichub.edu', gender: 'Male' },
        { id: '3', name: 'Raza Ahmed', role: 'Teacher', subject: 'Physics', className: 'Class 10-B', status: 'Active', salary: '75000', qualification: 'M.Sc. Physics', experience: '9 Years', phone: '+92 300 1020202', email: 'raza.ahmed@academichub.edu', gender: 'Male' },
        { id: '4', name: 'Hina Malik', role: 'Teacher', subject: 'Mathematics', className: 'Class 9-A', status: 'Active', salary: '70000', qualification: 'M.Sc. Mathematics', experience: '7 Years', phone: '+92 300 1030303', email: 'hina.malik@academichub.edu', gender: 'Female' },
        { id: '5', name: 'Nadia Hussain', role: 'Teacher', subject: 'English Literature', className: 'Class 10-A', status: 'Active', salary: '68000', qualification: 'M.A. English', experience: '6 Years', phone: '+92 300 1060606', email: 'nadia.h@academichub.edu', gender: 'Female' },
        { id: '6', name: 'Omer Shahid', role: 'Teacher', subject: 'Biology', className: 'Class 8-A', status: 'Active', salary: '65000', qualification: 'M.Sc. Biology', experience: '5 Years', phone: '+92 300 1070707', email: 'omer.s@academichub.edu', gender: 'Male' },
        { id: '7', name: 'Imran Qureshi', role: 'Teacher', subject: 'Chemistry', className: 'Class 9-B', status: 'Active', salary: '67000', qualification: 'M.Sc. Chemistry', experience: '6 Years', phone: '+92 300 1111222', email: 'imran.q@academichub.edu', gender: 'Male' },
        { id: '8', name: 'Sadia Hussain', role: 'Teacher', subject: 'Urdu', className: 'Class 8-C', status: 'Active', salary: '58000', qualification: 'M.A. Urdu', experience: '5 Years', phone: '+92 300 1222333', email: 'sadia.h@academichub.edu', gender: 'Female' },
        { id: '9', name: 'Khalid Waseem', role: 'Teacher', subject: 'Islamiyat', className: 'Class 7-A', status: 'Active', salary: '55000', qualification: 'M.A. Islamic Studies', experience: '4 Years', phone: '+92 300 1333444', email: 'khalid.w@academichub.edu', gender: 'Male' },
        { id: '10', name: 'Ayesha Bibi', role: 'Academic Coordinator', subject: 'Academics', className: 'Admin Block', status: 'Active', salary: '85000', qualification: 'MBA', experience: '10 Years', phone: '+92 300 1050505', email: 'ayesha.b@academichub.edu', gender: 'Female' },
        { id: '11', name: 'Zara Ansar', role: 'Substitute Teacher', subject: 'English / Urdu', className: 'Cover Classes', status: 'Active', salary: '42000', qualification: 'B.A. English', experience: '2 Years', phone: '+92 300 1444555', email: 'zara.a@academichub.edu', gender: 'Female' },
        { id: '12', name: 'Fawad Malik', role: 'Substitute Teacher', subject: 'Mathematics / Science', className: 'Cover Classes', status: 'Active', salary: '40000', qualification: 'B.Sc. Mathematics', experience: '1 Year', phone: '+92 300 1555666', email: 'fawad.m@academichub.edu', gender: 'Male' },
        { id: '13', name: 'Abrar Hussain', role: 'Lab Assistant', subject: 'Science Lab', className: 'Science Lab', status: 'Active', salary: '35000', qualification: 'B.Sc. Chemistry', experience: '3 Years', phone: '+92 300 1666777', email: 'lab@academichub.edu', gender: 'Male' },
        { id: '14', name: 'Bashir Ahmed', role: 'Guard', subject: 'Security', className: 'Main Gate', status: 'Active', salary: '35000', qualification: 'Matric', experience: '8 Years', phone: '+92 300 1080808', email: 'security@academichub.edu', gender: 'Male' },
        { id: '15', name: 'Zubaida Parveen', role: 'Domestic Staff', subject: 'Cleaning', className: 'Block A', status: 'Active', salary: '28000', qualification: 'Middle', experience: '4 Years', phone: '+92 300 1001001', email: 'staff@academichub.edu', gender: 'Female' }
      ],"""
    if old_s1_teachers in content:
        content = content.replace(old_s1_teachers, new_s1_teachers)
        print("School 1 teachers expanded to 15 with substitutes.")

    # -----------------------------------------------------------------------
    # SCHOOL 2 - Beaconhouse Lahore - fix students missing fields + expand staff
    # -----------------------------------------------------------------------
    old_s2_students = """      students: [
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
    new_s2_students = """      students: [
        { id: '1', name: 'Muhammad Ali', roll: '101', className: 'Class 10-A', status: 'Present', borrowedBooks: ['A-Level Physics', 'Maths Advance'], bookedTransport: 'Route A', hostelStatus: 'Room 301' },
        { id: '2', name: 'Fatima Zahra', roll: '104', className: 'Class 10-B', status: 'Present', borrowedBooks: ['English Lit Anthology'], bookedTransport: 'Route B', hostelStatus: 'Day Scholar' },
        { id: '3', name: 'Bilal Ahmed', roll: '102', className: 'Class 9-A', status: 'Absent', borrowedBooks: [], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '4', name: 'Zainab Qasim', roll: '105', className: 'Class 10-A', status: 'Present', borrowedBooks: ['Chemistry Advanced'], bookedTransport: 'Route A', hostelStatus: 'Room 302' },
        { id: '5', name: 'Omar Farooq', roll: '106', className: 'Class 10-B', status: 'Present', borrowedBooks: ['Biology Concepts'], bookedTransport: 'Route C', hostelStatus: 'Day Scholar' },
        { id: '6', name: 'Ayesha Siddiqa', roll: '107', className: 'Class 9-A', status: 'Present', borrowedBooks: ['Islamic Studies 9'], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '7', name: 'Hassan Raza', roll: '108', className: 'Class 10-A', status: 'Absent', borrowedBooks: ['Calculus Textbook'], bookedTransport: 'Route B', hostelStatus: 'Day Scholar' },
        { id: '8', name: 'Maryam Noor', roll: '109', className: 'Class 8-A', status: 'Present', borrowedBooks: ['Science Grade 8'], bookedTransport: 'Route A', hostelStatus: 'Room 410' },
        { id: '9', name: 'Usman Tariq', roll: '110', className: 'Class 8-A', status: 'Present', borrowedBooks: [], bookedTransport: 'Route C', hostelStatus: 'Day Scholar' },
        { id: '10', name: 'Khadija Sultan', roll: '111', className: 'Class 9-B', status: 'Present', borrowedBooks: ['Urdu Adab 9'], bookedTransport: 'None', hostelStatus: 'Day Scholar' }
      ],"""
    if old_s2_students in content:
        content = content.replace(old_s2_students, new_s2_students)
        print("School 2 students fixed to 10 with full fields.")

    # Expand School 2 staff to 15 with substitutes
    old_s2_teachers = """      teachers: [
        { id: '1', name: 'Dr. Arshad Raza', role: 'Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '180000', qualification: 'PhD Mathematics', experience: '20 Years', phone: '+92 300 2010101', email: 'principal@beaconhouse-lhr.edu', gender: 'Male' },
        { id: '2', name: 'Usman Ghani', role: 'Teacher', subject: 'English', className: 'Class 10-A', status: 'Active', salary: '65000', experience: '4 Years', qualification: 'M.A. English', phone: '+92 300 2111111', email: 'usman.g@beaconhouse-lhr.edu', gender: 'Male' },
        { id: '3', name: 'Ayesha Khan', role: 'Teacher', subject: 'Mathematics', className: 'Class 10-B', status: 'Active', salary: '70000', experience: '5 Years', qualification: 'M.Sc. Mathematics', phone: '+92 300 2222221', email: 'ayesha@beaconhouse-lhr.edu', gender: 'Female' },
        { id: '4', name: 'Fatima Noor', role: 'Teacher', subject: 'General Science', className: 'Class 6-A', status: 'Active', salary: '55000', experience: '2 Years', qualification: 'B.Sc. General Science', phone: '+92 300 2333333', email: 'fatima@beaconhouse-lhr.edu', gender: 'Female' },
        { id: '5', name: 'Tariq Jameel', role: 'Teacher', subject: 'Islamic Studies', className: 'Class 9-A', status: 'Active', salary: '58000', experience: '8 Years', qualification: 'M.A. Islamic Studies', phone: '+92 300 2444444', email: 'tariq.j@beaconhouse-lhr.edu', gender: 'Male' },
        { id: '6', name: 'Nida Yasir', role: 'Teacher', subject: 'Physics', className: 'Class 10-B', status: 'Active', salary: '62000', experience: '3 Years', qualification: 'M.Sc. Physics', phone: '+92 300 2555555', email: 'nida@beaconhouse-lhr.edu', gender: 'Female' },
        { id: '7', name: 'Sohail Mirza', role: 'Academic Coordinator', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '88000', qualification: 'M.Ed.', experience: '11 Years', phone: '+92 300 2666666', email: 'coordinator@beaconhouse-lhr.edu', gender: 'Male' },
        { id: '8', name: 'Rukhsana Bibi', role: 'Librarian', subject: 'Library', className: 'Library Block', status: 'Active', salary: '45000', qualification: 'B.A. Library Science', experience: '7 Years', phone: '+92 300 2777777', email: 'library@beaconhouse-lhr.edu', gender: 'Female' },
        { id: '9', name: 'Ghulam Qadir', role: 'Guard', subject: 'Security', className: 'Main Gate', status: 'Active', salary: '33000', qualification: 'Matric', experience: '5 Years', phone: '+92 300 2888888', email: 'security@beaconhouse-lhr.edu', gender: 'Male' },
        { id: '10', name: 'Mariam Akhtar', role: 'Domestic Staff', subject: 'Cleaning', className: 'Block B', status: 'Active', salary: '27000', qualification: 'Primary', experience: '3 Years', phone: '+92 300 2999999', email: 'staff@beaconhouse-lhr.edu', gender: 'Female' }
      ],"""
    new_s2_teachers = """      teachers: [
        { id: '1', name: 'Dr. Arshad Raza', role: 'Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '180000', qualification: 'PhD Mathematics', experience: '20 Years', phone: '+92 300 2010101', email: 'principal@beaconhouse-lhr.edu', gender: 'Male' },
        { id: '2', name: 'Sohail Mirza', role: 'Vice Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '130000', qualification: 'M.Ed.', experience: '11 Years', phone: '+92 300 2666666', email: 'coordinator@beaconhouse-lhr.edu', gender: 'Male' },
        { id: '3', name: 'Usman Ghani', role: 'Teacher', subject: 'English', className: 'Class 10-A', status: 'Active', salary: '65000', experience: '4 Years', qualification: 'M.A. English', phone: '+92 300 2111111', email: 'usman.g@beaconhouse-lhr.edu', gender: 'Male' },
        { id: '4', name: 'Ayesha Khan', role: 'Teacher', subject: 'Mathematics', className: 'Class 10-B', status: 'Active', salary: '70000', experience: '5 Years', qualification: 'M.Sc. Mathematics', phone: '+92 300 2222221', email: 'ayesha@beaconhouse-lhr.edu', gender: 'Female' },
        { id: '5', name: 'Fatima Noor', role: 'Teacher', subject: 'General Science', className: 'Class 9-A', status: 'Active', salary: '55000', experience: '2 Years', qualification: 'B.Sc. General Science', phone: '+92 300 2333333', email: 'fatima@beaconhouse-lhr.edu', gender: 'Female' },
        { id: '6', name: 'Tariq Jameel', role: 'Teacher', subject: 'Islamic Studies', className: 'Class 9-B', status: 'Active', salary: '58000', experience: '8 Years', qualification: 'M.A. Islamic Studies', phone: '+92 300 2444444', email: 'tariq.j@beaconhouse-lhr.edu', gender: 'Male' },
        { id: '7', name: 'Nida Yasir', role: 'Teacher', subject: 'Physics', className: 'Class 10-B', status: 'Active', salary: '62000', experience: '3 Years', qualification: 'M.Sc. Physics', phone: '+92 300 2555555', email: 'nida@beaconhouse-lhr.edu', gender: 'Female' },
        { id: '8', name: 'Arif Nawaz', role: 'Teacher', subject: 'Chemistry', className: 'Class 10-A', status: 'Active', salary: '64000', experience: '5 Years', qualification: 'M.Sc. Chemistry', phone: '+92 300 2123456', email: 'arif.n@beaconhouse-lhr.edu', gender: 'Male' },
        { id: '9', name: 'Saba Saleem', role: 'Teacher', subject: 'Biology', className: 'Class 8-A', status: 'Active', salary: '60000', experience: '4 Years', qualification: 'M.Sc. Biology', phone: '+92 300 2234567', email: 'saba.s@beaconhouse-lhr.edu', gender: 'Female' },
        { id: '10', name: 'Rukhsana Bibi', role: 'Librarian', subject: 'Library', className: 'Library Block', status: 'Active', salary: '45000', qualification: 'B.A. Library Science', experience: '7 Years', phone: '+92 300 2777777', email: 'library@beaconhouse-lhr.edu', gender: 'Female' },
        { id: '11', name: 'Kamran Mirza', role: 'Accountant', subject: 'Finance', className: 'Admin Office', status: 'Active', salary: '72000', qualification: 'B.Com, ACCA Pursuing', experience: '6 Years', phone: '+92 300 2345678', email: 'accounts@beaconhouse-lhr.edu', gender: 'Male' },
        { id: '12', name: 'Huma Baig', role: 'Substitute Teacher', subject: 'English / Urdu', className: 'Cover Classes', status: 'Active', salary: '45000', qualification: 'M.A. English', experience: '2 Years', phone: '+92 300 2456789', email: 'huma.b@beaconhouse-lhr.edu', gender: 'Female' },
        { id: '13', name: 'Shoaib Rana', role: 'Substitute Teacher', subject: 'Mathematics / Physics', className: 'Cover Classes', status: 'Active', salary: '43000', qualification: 'B.Sc. Mathematics', experience: '1.5 Years', phone: '+92 300 2567890', email: 'shoaib.r@beaconhouse-lhr.edu', gender: 'Male' },
        { id: '14', name: 'Ghulam Qadir', role: 'Guard', subject: 'Security', className: 'Main Gate', status: 'Active', salary: '33000', qualification: 'Matric', experience: '5 Years', phone: '+92 300 2888888', email: 'security@beaconhouse-lhr.edu', gender: 'Male' },
        { id: '15', name: 'Mariam Akhtar', role: 'Domestic Staff', subject: 'Cleaning', className: 'Block B', status: 'Active', salary: '27000', qualification: 'Primary', experience: '3 Years', phone: '+92 300 2999999', email: 'staff@beaconhouse-lhr.edu', gender: 'Female' }
      ],"""
    if old_s2_teachers in content:
        content = content.replace(old_s2_teachers, new_s2_teachers)
        print("School 2 teachers expanded to 15 with substitutes and accountant.")

    # -----------------------------------------------------------------------
    # SCHOOL 3 - The Educators - add substitutes and accountant
    # -----------------------------------------------------------------------
    old_s3_teachers = """      teachers: [
        { id: '1', name: 'Mrs. Samina Afridi', role: 'Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '140000', qualification: 'M.Ed.', experience: '16 Years', phone: '+92 300 3010101', email: 'principal@educators.edu.pk', gender: 'Female' },
        { id: '2', name: 'Maryam Bibi', role: 'Teacher', subject: 'Urdu', className: 'Class 10-A', status: 'Active', salary: '55000', qualification: 'M.A. Urdu', experience: '6 Years', phone: '+92 300 3020202', email: 'maryam.b@educators.edu.pk', gender: 'Female' },
        { id: '3', name: 'Khalid Butt', role: 'Teacher', subject: 'General Science', className: 'Class 9-A', status: 'Active', salary: '60000', qualification: 'M.Sc. Chemistry', experience: '8 Years', phone: '+92 300 3030303', email: 'khalid.b@educators.edu.pk', gender: 'Male' },
        { id: '4', name: 'Nasreen Akhtar', role: 'Teacher', subject: 'English', className: 'Class 9-B', status: 'Active', salary: '58000', qualification: 'M.A. English', experience: '5 Years', phone: '+92 300 3040404', email: 'nasreen.a@educators.edu.pk', gender: 'Female' },
        { id: '5', name: 'Imtiaz Hussain', role: 'Teacher', subject: 'Mathematics', className: 'Class 10-B', status: 'Active', salary: '62000', qualification: 'M.Sc. Mathematics', experience: '7 Years', phone: '+92 300 3050505', email: 'imtiaz.h@educators.edu.pk', gender: 'Male' },
        { id: '6', name: 'Qaiser Mehmood', role: 'Vice Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '110000', qualification: 'PhD', experience: '13 Years', phone: '+92 300 3060606', email: 'vp@educators.edu.pk', gender: 'Male' },
        { id: '7', name: 'Sobia Anwar', role: 'Teacher', subject: 'Islamiyat', className: 'Class 8-A', status: 'Active', salary: '50000', qualification: 'M.A. Islamiyat', experience: '4 Years', phone: '+92 300 3070707', email: 'sobia.a@educators.edu.pk', gender: 'Female' },
        { id: '8', name: 'Rehman Gul', role: 'Guard', subject: 'Security', className: 'Main Gate', status: 'Active', salary: '30000', qualification: 'Matric', experience: '6 Years', phone: '+92 300 3080808', email: 'security@educators.edu.pk', gender: 'Male' },
        { id: '9', name: 'Pervaiz Ahmad', role: 'Electrician', subject: 'Maintenance', className: 'Campus', status: 'Active', salary: '38000', qualification: 'DAE Electrical', experience: '9 Years', phone: '+92 300 3090909', email: 'elec@educators.edu.pk', gender: 'Male' },
        { id: '10', name: 'Naseema Bano', role: 'Domestic Staff', subject: 'Cleaning', className: 'Admin Block', status: 'Active', salary: '25000', qualification: 'Primary', experience: '5 Years', phone: '+92 300 3001001', email: 'staff@educators.edu.pk', gender: 'Female' }
      ],"""
    new_s3_teachers = """      teachers: [
        { id: '1', name: 'Mrs. Samina Afridi', role: 'Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '140000', qualification: 'M.Ed.', experience: '16 Years', phone: '+92 300 3010101', email: 'principal@educators.edu.pk', gender: 'Female' },
        { id: '2', name: 'Qaiser Mehmood', role: 'Vice Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '110000', qualification: 'PhD', experience: '13 Years', phone: '+92 300 3060606', email: 'vp@educators.edu.pk', gender: 'Male' },
        { id: '3', name: 'Maryam Bibi', role: 'Teacher', subject: 'Urdu', className: 'Class 10-A', status: 'Active', salary: '55000', qualification: 'M.A. Urdu', experience: '6 Years', phone: '+92 300 3020202', email: 'maryam.b@educators.edu.pk', gender: 'Female' },
        { id: '4', name: 'Khalid Butt', role: 'Teacher', subject: 'General Science', className: 'Class 9-A', status: 'Active', salary: '60000', qualification: 'M.Sc. Chemistry', experience: '8 Years', phone: '+92 300 3030303', email: 'khalid.b@educators.edu.pk', gender: 'Male' },
        { id: '5', name: 'Nasreen Akhtar', role: 'Teacher', subject: 'English', className: 'Class 9-B', status: 'Active', salary: '58000', qualification: 'M.A. English', experience: '5 Years', phone: '+92 300 3040404', email: 'nasreen.a@educators.edu.pk', gender: 'Female' },
        { id: '6', name: 'Imtiaz Hussain', role: 'Teacher', subject: 'Mathematics', className: 'Class 10-B', status: 'Active', salary: '62000', qualification: 'M.Sc. Mathematics', experience: '7 Years', phone: '+92 300 3050505', email: 'imtiaz.h@educators.edu.pk', gender: 'Male' },
        { id: '7', name: 'Sobia Anwar', role: 'Teacher', subject: 'Islamiyat', className: 'Class 8-A', status: 'Active', salary: '50000', qualification: 'M.A. Islamiyat', experience: '4 Years', phone: '+92 300 3070707', email: 'sobia.a@educators.edu.pk', gender: 'Female' },
        { id: '8', name: 'Ahsan Dar', role: 'Teacher', subject: 'Pakistan Studies', className: 'Class 10-A', status: 'Active', salary: '52000', qualification: 'M.A. Pakistan Studies', experience: '3 Years', phone: '+92 300 3111222', email: 'ahsan.d@educators.edu.pk', gender: 'Male' },
        { id: '9', name: 'Rabia Yasmin', role: 'Teacher', subject: 'Home Economics', className: 'Class 8-B', status: 'Active', salary: '48000', qualification: 'B.Sc. Home Economics', experience: '4 Years', phone: '+92 300 3222333', email: 'rabia.y@educators.edu.pk', gender: 'Female' },
        { id: '10', name: 'Waqas Saleem', role: 'Accountant', subject: 'Finance', className: 'Admin Office', status: 'Active', salary: '65000', qualification: 'B.Com', experience: '5 Years', phone: '+92 300 3333444', email: 'accounts@educators.edu.pk', gender: 'Male' },
        { id: '11', name: 'Layla Arif', role: 'Substitute Teacher', subject: 'Urdu / English', className: 'Cover Classes', status: 'Active', salary: '38000', qualification: 'B.A. Urdu', experience: '1 Year', phone: '+92 300 3444555', email: 'layla.a@educators.edu.pk', gender: 'Female' },
        { id: '12', name: 'Naeem Baig', role: 'Substitute Teacher', subject: 'Maths / Science', className: 'Cover Classes', status: 'Active', salary: '36000', qualification: 'B.Sc.', experience: '1.5 Years', phone: '+92 300 3555666', email: 'naeem.b@educators.edu.pk', gender: 'Male' },
        { id: '13', name: 'Rehman Gul', role: 'Guard', subject: 'Security', className: 'Main Gate', status: 'Active', salary: '30000', qualification: 'Matric', experience: '6 Years', phone: '+92 300 3080808', email: 'security@educators.edu.pk', gender: 'Male' },
        { id: '14', name: 'Pervaiz Ahmad', role: 'Electrician', subject: 'Maintenance', className: 'Campus', status: 'Active', salary: '38000', qualification: 'DAE Electrical', experience: '9 Years', phone: '+92 300 3090909', email: 'elec@educators.edu.pk', gender: 'Male' },
        { id: '15', name: 'Naseema Bano', role: 'Domestic Staff', subject: 'Cleaning', className: 'Admin Block', status: 'Active', salary: '25000', qualification: 'Primary', experience: '5 Years', phone: '+92 300 3001001', email: 'staff@educators.edu.pk', gender: 'Female' }
      ],"""
    if old_s3_teachers in content:
        content = content.replace(old_s3_teachers, new_s3_teachers)
        print("School 3 teachers expanded to 15.")

    # -----------------------------------------------------------------------
    # Fix salary display: "Rs. Not Set" -> show salary or "Not Provided"
    # -----------------------------------------------------------------------
    content = content.replace(
        "Rs. {teach.salary ? Number(teach.salary).toLocaleString() : 'Not Set'}",
        "Rs. {teach.salary && teach.salary !== 'N/A' ? Number(teach.salary).toLocaleString() : 'Not Provided'}"
    )
    content = content.replace(
        "PKR {teach.salary ? Number(teach.salary).toLocaleString() : '0'}",
        "PKR {teach.salary && teach.salary !== 'N/A' ? Number(teach.salary).toLocaleString() : 'See Admin'}"
    )
    # Also fix the "Decided Salary" in detail panel
    content = content.replace(
        "{selectedDetailedTeacher.salary ? `Rs. ${selectedDetailedTeacher.salary}` : 'N/A'}",
        "{selectedDetailedTeacher.salary && selectedDetailedTeacher.salary !== 'N/A' ? `Rs. ${Number(selectedDetailedTeacher.salary).toLocaleString()}` : 'Contact Admin'}"
    )
    print("Salary display fixed.")

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("ALL DONE!")

if __name__ == '__main__':
    main()
