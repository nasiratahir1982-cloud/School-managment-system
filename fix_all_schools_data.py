"""
Populate all 8 school databases with 10 students + full essential staff + salaries.
No N/A anywhere. All data is realistic and ready-to-use.
"""

PDF_BASE64 = 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4gPj4gPj4gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNjAgPj4Kc3RyZWFtCkJUCi9GMSAxNCBUZgo1MCA3NTAgVGQKKEFjYWRlbWljIEh1YiAtIERlbW8gUGFzdCBQYXBlciBhbmQgSG9tZXdvcmsgQXNzaWdubWVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMjQgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA1IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgozMzMKJSVFT0Y='

# --- School 1: Academic Hub Lahore (PK) — already rich, just fix staff salaries ---
SCHOOL_1_TEACHERS = """[
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
      ]"""

# --- School 2: Beaconhouse Lahore (PK) — already good, enhance staff ---
SCHOOL_2_TEACHERS = """[
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
      ]"""

# --- School 3: The Educators (PK) ---
SCHOOL_3_DATA = """{
      students: [
        { id: '1', name: 'Hamza Sohail', roll: '55', className: 'Class 10-A', status: 'Present', borrowedBooks: ['English Grammar'], bookedTransport: 'Route A', hostelStatus: 'Day Scholar' },
        { id: '2', name: 'Sana Javed', roll: '21', className: 'Class 10-B', status: 'Present', borrowedBooks: [], bookedTransport: 'Route B', hostelStatus: 'Day Scholar' },
        { id: '3', name: 'Faisal Nawaz', roll: '33', className: 'Class 9-A', status: 'Absent', borrowedBooks: ['Urdu Adab'], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '4', name: 'Rabia Tariq', roll: '12', className: 'Class 9-B', status: 'Present', borrowedBooks: [], bookedTransport: 'Route A', hostelStatus: 'Room 201' },
        { id: '5', name: 'Adeel Maqsood', roll: '07', className: 'Class 8-A', status: 'Present', borrowedBooks: ['Science Workbook'], bookedTransport: 'Route C', hostelStatus: 'Day Scholar' },
        { id: '6', name: 'Mahnoor Riaz', roll: '44', className: 'Class 10-A', status: 'Late', borrowedBooks: [], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '7', name: 'Shahzaib Khan', roll: '08', className: 'Class 7-A', status: 'Present', borrowedBooks: ['Math Book 7'], bookedTransport: 'Route B', hostelStatus: 'Day Scholar' },
        { id: '8', name: 'Gulnaz Fatima', roll: '29', className: 'Class 8-B', status: 'Present', borrowedBooks: [], bookedTransport: 'Route A', hostelStatus: 'Room 305' },
        { id: '9', name: 'Asif Raza', roll: '16', className: 'Class 9-A', status: 'Present', borrowedBooks: ['Chemistry 9'], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '10', name: 'Hina Zulfiqar', roll: '38', className: 'Class 10-B', status: 'Present', borrowedBooks: [], bookedTransport: 'Route C', hostelStatus: 'Day Scholar' }
      ],
      teachers: [
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
      ],
      notices: [
        { id: '1', date: '2026-06-06 10:00 AM', title: 'Parent Teacher Meeting', content: 'PTM is scheduled for Saturday. Report cards will be distributed.' },
        { id: '2', date: '2026-06-09', title: 'Annual Sports Week Begins', content: 'Students are requested to bring sports kits from Monday onwards.' }
      ],
      leaves: [
        { id: '1', name: 'Maryam Bibi', date: '2026-06-11', reason: 'Family Emergency', status: 'Approved' }
      ],
      invoices: [
        { id: 'INV-201', student: 'Hamza Sohail', amount: 5500, status: 'Unpaid' },
        { id: 'INV-202', student: 'Sana Javed', amount: 5500, status: 'Paid' },
        { id: 'INV-203', student: 'Faisal Nawaz', amount: 5500, status: 'Unpaid' },
        { id: 'INV-204', student: 'Rabia Tariq', amount: 5500, status: 'Paid' },
        { id: 'INV-205', student: 'Adeel Maqsood', amount: 4800, status: 'Unpaid' },
        { id: 'INV-206', student: 'Mahnoor Riaz', amount: 5500, status: 'Paid' },
        { id: 'INV-207', student: 'Shahzaib Khan', amount: 4200, status: 'Paid' },
        { id: 'INV-208', student: 'Gulnaz Fatima', amount: 4800, status: 'Unpaid' },
        { id: 'INV-209', student: 'Asif Raza', amount: 5500, status: 'Paid' },
        { id: 'INV-210', student: 'Hina Zulfiqar', amount: 5500, status: 'Unpaid' }
      ],
      assignments: [
        { id: '1', title: 'Urdu Nazam Analysis', subject: 'Urdu', publishDate: '2026-06-05', dueDate: '2026-06-20', fileName: 'urdu_nazm_task.pdf', fileType: 'pdf', status: 'Published', fileUrl: '""" + PDF_BASE64 + """' }
      ],
      disciplines: [
        { id: '1', name: 'Faisal Nawaz', date: '2026-06-08', infraction: 'Habitual Late Arrival', action: 'Parent Called' }
      ],
      parentMessages: [
        { id: '1', parent: 'Mr. Sohail (Hamza\\'s Father)', date: '2026-06-09', subject: 'Transport Inquiry', message: 'Which route does my son take? Please confirm the morning pickup time.' }
      ]
    }"""

# --- School 4: Beaconhouse London (UK) ---
SCHOOL_4_DATA = """{
      students: [
        { id: '1', name: 'George Harrison', roll: '201', className: 'Class 10-A', status: 'Present', borrowedBooks: ['GCSE Chemistry Guide'], bookedTransport: 'Bus Route 4', hostelStatus: 'Day Scholar' },
        { id: '2', name: 'Oliver Smith', roll: '202', className: 'Class 10-B', status: 'Present', borrowedBooks: [], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '3', name: 'Amelia Johnson', roll: '203', className: 'Class 9-A', status: 'Absent', borrowedBooks: ['History of Britain'], bookedTransport: 'Bus Route 2', hostelStatus: 'Day Scholar' },
        { id: '4', name: 'Noah Williams', roll: '204', className: 'Class 10-A', status: 'Present', borrowedBooks: [], bookedTransport: 'None', hostelStatus: 'Boarding Room 11' },
        { id: '5', name: 'Sophia Brown', roll: '205', className: 'Class 8-A', status: 'Present', borrowedBooks: ['English Literature Key Texts'], bookedTransport: 'Bus Route 1', hostelStatus: 'Day Scholar' },
        { id: '6', name: 'Liam Davis', roll: '206', className: 'Class 10-B', status: 'Present', borrowedBooks: [], bookedTransport: 'Bus Route 4', hostelStatus: 'Day Scholar' },
        { id: '7', name: 'Emma Wilson', roll: '207', className: 'Class 9-B', status: 'Late', borrowedBooks: ['Physics Revision'], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '8', name: 'James Taylor', roll: '208', className: 'Class 7-A', status: 'Present', borrowedBooks: [], bookedTransport: 'Bus Route 3', hostelStatus: 'Day Scholar' },
        { id: '9', name: 'Charlotte Anderson', roll: '209', className: 'Class 8-B', status: 'Present', borrowedBooks: ['Maths GCSE Practice'], bookedTransport: 'Bus Route 2', hostelStatus: 'Day Scholar' },
        { id: '10', name: 'Ethan Thomas', roll: '210', className: 'Class 9-A', status: 'Present', borrowedBooks: [], bookedTransport: 'None', hostelStatus: 'Day Scholar' }
      ],
      teachers: [
        { id: '1', name: 'Mrs. Patricia Hawkins', role: 'Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '320000', qualification: 'Ph.D. Education Management', experience: '22 Years', phone: '+44 7700 100001', email: 'principal@beaconhouse.co.uk', gender: 'Female' },
        { id: '2', name: 'John Watson', role: 'Teacher', subject: 'Chemistry', className: 'Class 10-A', status: 'Active', salary: '210000', qualification: 'M.Sc. Chemistry', experience: '10 Years', phone: '+44 7700 100002', email: 'j.watson@beaconhouse.co.uk', gender: 'Male' },
        { id: '3', name: 'Clara Oswald', role: 'Teacher', subject: 'History', className: 'Class 10-B', status: 'Active', salary: '195000', qualification: 'M.A. History', experience: '7 Years', phone: '+44 7700 100003', email: 'c.oswald@beaconhouse.co.uk', gender: 'Female' },
        { id: '4', name: 'Richard Moore', role: 'Teacher', subject: 'Mathematics', className: 'Class 9-A', status: 'Active', salary: '220000', qualification: 'M.Sc. Pure Mathematics', experience: '12 Years', phone: '+44 7700 100004', email: 'r.moore@beaconhouse.co.uk', gender: 'Male' },
        { id: '5', name: 'Sophie Turner', role: 'Teacher', subject: 'English Language', className: 'Class 9-B', status: 'Active', salary: '185000', qualification: 'B.A. Hons English', experience: '5 Years', phone: '+44 7700 100005', email: 's.turner@beaconhouse.co.uk', gender: 'Female' },
        { id: '6', name: 'Mark Williams', role: 'Vice Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '280000', qualification: 'MBA, PGCE', experience: '15 Years', phone: '+44 7700 100006', email: 'vp@beaconhouse.co.uk', gender: 'Male' },
        { id: '7', name: 'Anna Clarke', role: 'Librarian', subject: 'Library', className: 'Library Block', status: 'Active', salary: '130000', qualification: 'B.A. Library & Info Science', experience: '8 Years', phone: '+44 7700 100007', email: 'library@beaconhouse.co.uk', gender: 'Female' },
        { id: '8', name: 'David Cooper', role: 'IT Administrator', subject: 'Technology', className: 'IT Lab', status: 'Active', salary: '160000', qualification: 'B.Sc. Computer Science', experience: '6 Years', phone: '+44 7700 100008', email: 'it@beaconhouse.co.uk', gender: 'Male' },
        { id: '9', name: 'Helen Foster', role: 'Admin Officer', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '120000', qualification: 'HND Business Admin', experience: '9 Years', phone: '+44 7700 100009', email: 'admin@beaconhouse.co.uk', gender: 'Female' },
        { id: '10', name: 'Terry White', role: 'Guard', subject: 'Security', className: 'Main Gate', status: 'Active', salary: '95000', qualification: 'BTEC Security Management', experience: '11 Years', phone: '+44 7700 100010', email: 'security@beaconhouse.co.uk', gender: 'Male' }
      ],
      notices: [
        { id: '1', date: '2026-06-08', title: 'GCSE Exam Prep Timetable', content: 'Check the board for extra coaching classes before the final mocks.' },
        { id: '2', date: '2026-06-11', title: 'Summer Fayre on 28th June', content: 'Parents and students are welcome to join the annual summer fayre and craft fair.' }
      ],
      leaves: [
        { id: '1', name: 'Clara Oswald', date: '2026-06-10', reason: 'Medical Appointment', status: 'Approved' }
      ],
      invoices: [
        { id: 'INV-301', student: 'George Harrison', amount: 1200, status: 'Unpaid' },
        { id: 'INV-302', student: 'Oliver Smith', amount: 1200, status: 'Paid' },
        { id: 'INV-303', student: 'Amelia Johnson', amount: 1200, status: 'Unpaid' },
        { id: 'INV-304', student: 'Noah Williams', amount: 1200, status: 'Paid' },
        { id: 'INV-305', student: 'Sophia Brown', amount: 1000, status: 'Unpaid' },
        { id: 'INV-306', student: 'Liam Davis', amount: 1200, status: 'Paid' },
        { id: 'INV-307', student: 'Emma Wilson', amount: 1100, status: 'Unpaid' },
        { id: 'INV-308', student: 'James Taylor', amount: 950, status: 'Paid' },
        { id: 'INV-309', student: 'Charlotte Anderson', amount: 1000, status: 'Paid' },
        { id: 'INV-310', student: 'Ethan Thomas', amount: 1100, status: 'Unpaid' }
      ],
      assignments: [
        { id: '1', title: 'GCSE Chemistry Module 3 Worksheet', subject: 'Chemistry', publishDate: '2026-06-06', dueDate: '2026-06-18', fileName: 'chem_module3.pdf', fileType: 'pdf', status: 'Published', fileUrl: '""" + PDF_BASE64 + """' }
      ],
      disciplines: [
        { id: '1', name: 'Liam Davis', date: '2026-06-09', infraction: 'Mobile Phone in Class', action: 'Device Confiscated' }
      ],
      parentMessages: [
        { id: '1', parent: 'Mrs. Harrison (George\\'s Mother)', date: '2026-06-10', subject: 'Extra Tuition Query', message: 'Is there any after-school Chemistry tutoring available before the GCSE mock?' }
      ]
    }"""

# --- School 5: Beaconhouse Dubai (AE) ---
SCHOOL_5_DATA = """{
      students: [
        { id: '1', name: 'Omar Al-Mansoori', roll: '301', className: 'Class 10-A', status: 'Present', borrowedBooks: ['Arabic Advanced Reader'], bookedTransport: 'Bus Route 1', hostelStatus: 'Day Scholar' },
        { id: '2', name: 'Yasmin Qureshi', roll: '302', className: 'Class 10-B', status: 'Present', borrowedBooks: [], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '3', name: 'Khalid Al-Rashid', roll: '303', className: 'Class 9-A', status: 'Absent', borrowedBooks: ['Islamic Studies Grade 9'], bookedTransport: 'Bus Route 3', hostelStatus: 'Day Scholar' },
        { id: '4', name: 'Noor Bint Hassan', roll: '304', className: 'Class 10-A', status: 'Present', borrowedBooks: ['English for Gulf Students'], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '5', name: 'Tariq Al-Amin', roll: '305', className: 'Class 8-A', status: 'Present', borrowedBooks: [], bookedTransport: 'Bus Route 2', hostelStatus: 'Day Scholar' },
        { id: '6', name: 'Amira Siddiqui', roll: '306', className: 'Class 10-B', status: 'Present', borrowedBooks: ['Maths CBSE G10'], bookedTransport: 'Bus Route 1', hostelStatus: 'Day Scholar' },
        { id: '7', name: 'Yousef Ibrahim', roll: '307', className: 'Class 9-B', status: 'Late', borrowedBooks: [], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '8', name: 'Laila Zaheer', roll: '308', className: 'Class 7-A', status: 'Present', borrowedBooks: ['Science Grade 7'], bookedTransport: 'Bus Route 2', hostelStatus: 'Day Scholar' },
        { id: '9', name: 'Saif Al-Kuwari', roll: '309', className: 'Class 8-B', status: 'Present', borrowedBooks: [], bookedTransport: 'Bus Route 3', hostelStatus: 'Day Scholar' },
        { id: '10', name: 'Mariam Chaudhry', roll: '310', className: 'Class 9-A', status: 'Present', borrowedBooks: ['History of Arabia'], bookedTransport: 'None', hostelStatus: 'Day Scholar' }
      ],
      teachers: [
        { id: '1', name: 'Mr. Faisal Al-Tamimi', role: 'Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '450000', qualification: 'Ph.D. International Education', experience: '20 Years', phone: '+971 50 100 1001', email: 'principal@beaconhouse-dxb.edu.ae', gender: 'Male' },
        { id: '2', name: 'Fatima Al-Hashimi', role: 'Teacher', subject: 'Arabic', className: 'Class 10-A', status: 'Active', salary: '280000', qualification: 'M.A. Arabic Language', experience: '9 Years', phone: '+971 50 100 1002', email: 'f.hashimi@beaconhouse-dxb.edu.ae', gender: 'Female' },
        { id: '3', name: 'David Miller', role: 'Teacher', subject: 'English', className: 'Class 10-B', status: 'Active', salary: '260000', qualification: 'PGCE English', experience: '7 Years', phone: '+971 50 100 1003', email: 'd.miller@beaconhouse-dxb.edu.ae', gender: 'Male' },
        { id: '4', name: 'Priya Sharma', role: 'Teacher', subject: 'Mathematics', className: 'Class 9-A', status: 'Active', salary: '240000', qualification: 'M.Sc. Mathematics', experience: '6 Years', phone: '+971 50 100 1004', email: 'p.sharma@beaconhouse-dxb.edu.ae', gender: 'Female' },
        { id: '5', name: 'Ahmed Al-Farsi', role: 'Teacher', subject: 'Islamic Studies', className: 'Class 10-B', status: 'Active', salary: '230000', qualification: 'B.A. Islamic Theology', experience: '8 Years', phone: '+971 50 100 1005', email: 'a.farsi@beaconhouse-dxb.edu.ae', gender: 'Male' },
        { id: '6', name: 'Sarah O'Brien', role: 'Vice Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '380000', qualification: 'MBA Education', experience: '14 Years', phone: '+971 50 100 1006', email: 'vp@beaconhouse-dxb.edu.ae', gender: 'Female' },
        { id: '7', name: 'Ravi Nair', role: 'IT Administrator', subject: 'Technology', className: 'IT Lab', status: 'Active', salary: '200000', qualification: 'B.Sc. IT', experience: '5 Years', phone: '+971 50 100 1007', email: 'it@beaconhouse-dxb.edu.ae', gender: 'Male' },
        { id: '8', name: 'Hessa Al-Darmaki', role: 'Librarian', subject: 'Library', className: 'Library Block', status: 'Active', salary: '160000', qualification: 'B.A. Library Science', experience: '6 Years', phone: '+971 50 100 1008', email: 'library@beaconhouse-dxb.edu.ae', gender: 'Female' },
        { id: '9', name: 'Mohan Krishnan', role: 'Guard', subject: 'Security', className: 'Main Gate', status: 'Active', salary: '90000', qualification: 'Matric', experience: '10 Years', phone: '+971 50 100 1009', email: 'security@beaconhouse-dxb.edu.ae', gender: 'Male' },
        { id: '10', name: 'Bindu Joseph', role: 'Domestic Staff', subject: 'Cleaning', className: 'Admin Block', status: 'Active', salary: '75000', qualification: 'Primary', experience: '4 Years', phone: '+971 50 100 1010', email: 'staff@beaconhouse-dxb.edu.ae', gender: 'Female' }
      ],
      notices: [
        { id: '1', date: '2026-06-07', title: 'Ramadan Timing Update', content: 'School hours will be adjusted as per government declarations.' },
        { id: '2', date: '2026-06-10', title: 'Model UN Conference Registration', content: 'Students wishing to participate in Model UN must register by June 20.' }
      ],
      leaves: [
        { id: '1', name: 'Ahmed Al-Farsi', date: '2026-06-14', reason: 'Religious Observance', status: 'Approved' }
      ],
      invoices: [
        { id: 'INV-401', student: 'Omar Al-Mansoori', amount: 2500, status: 'Unpaid' },
        { id: 'INV-402', student: 'Yasmin Qureshi', amount: 2500, status: 'Paid' },
        { id: 'INV-403', student: 'Khalid Al-Rashid', amount: 2500, status: 'Unpaid' },
        { id: 'INV-404', student: 'Noor Bint Hassan', amount: 2500, status: 'Paid' },
        { id: 'INV-405', student: 'Tariq Al-Amin', amount: 2200, status: 'Unpaid' },
        { id: 'INV-406', student: 'Amira Siddiqui', amount: 2500, status: 'Paid' },
        { id: 'INV-407', student: 'Yousef Ibrahim', amount: 2300, status: 'Unpaid' },
        { id: 'INV-408', student: 'Laila Zaheer', amount: 2000, status: 'Paid' },
        { id: 'INV-409', student: 'Saif Al-Kuwari', amount: 2200, status: 'Paid' },
        { id: 'INV-410', student: 'Mariam Chaudhry', amount: 2300, status: 'Unpaid' }
      ],
      assignments: [
        { id: '1', title: 'Arabic Comprehension Exercise', subject: 'Arabic', publishDate: '2026-06-05', dueDate: '2026-06-19', fileName: 'arabic_comp.pdf', fileType: 'pdf', status: 'Published', fileUrl: '""" + PDF_BASE64 + """' }
      ],
      disciplines: [],
      parentMessages: [
        { id: '1', parent: 'Mr. Al-Mansoori (Omar\\'s Father)', date: '2026-06-11', subject: 'Attendance Clarification', message: 'My son was present but marked absent on June 7th. Please correct the record.' }
      ]
    }"""

# --- School 6: International Grammar School (SA) ---
SCHOOL_6_DATA = """{
      students: [
        { id: '1', name: 'Yasser Qahtani', roll: '401', className: 'Class 10-A', status: 'Present', borrowedBooks: ['Tafseer Quran Vol 1'], bookedTransport: 'Bus Route 1', hostelStatus: 'Day Scholar' },
        { id: '2', name: 'Layla Bukhari', roll: '402', className: 'Class 10-B', status: 'Present', borrowedBooks: [], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '3', name: 'Abdullah Al-Ghamdi', roll: '403', className: 'Class 9-A', status: 'Absent', borrowedBooks: ['Saudi History'], bookedTransport: 'Bus Route 2', hostelStatus: 'Day Scholar' },
        { id: '4', name: 'Haya Al-Zahrani', roll: '404', className: 'Class 10-A', status: 'Present', borrowedBooks: ['English Plus Grade 10'], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '5', name: 'Faris Al-Otaibi', roll: '405', className: 'Class 8-A', status: 'Present', borrowedBooks: [], bookedTransport: 'Bus Route 3', hostelStatus: 'Day Scholar' },
        { id: '6', name: 'Reem Al-Dosari', roll: '406', className: 'Class 10-B', status: 'Present', borrowedBooks: ['Math Grade 10'], bookedTransport: 'Bus Route 1', hostelStatus: 'Day Scholar' },
        { id: '7', name: 'Walid Al-Shehri', roll: '407', className: 'Class 9-B', status: 'Present', borrowedBooks: ['Science Grade 9'], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '8', name: 'Nouf Al-Harbi', roll: '408', className: 'Class 7-A', status: 'Late', borrowedBooks: [], bookedTransport: 'Bus Route 2', hostelStatus: 'Day Scholar' },
        { id: '9', name: 'Saud Bin Nasser', roll: '409', className: 'Class 8-B', status: 'Present', borrowedBooks: ['Islamic Studies 8'], bookedTransport: 'Bus Route 3', hostelStatus: 'Day Scholar' },
        { id: '10', name: 'Maryam Al-Qurashi', roll: '410', className: 'Class 9-A', status: 'Present', borrowedBooks: [], bookedTransport: 'None', hostelStatus: 'Day Scholar' }
      ],
      teachers: [
        { id: '1', name: 'Dr. Abdulaziz Al-Muqrin', role: 'Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '520000', qualification: 'Ph.D. Islamic Education', experience: '24 Years', phone: '+966 50 100 2001', email: 'principal@igs-sa.edu', gender: 'Male' },
        { id: '2', name: 'Sheikh Abdul Latif', role: 'Teacher', subject: 'Islamic Studies', className: 'Class 10-A', status: 'Active', salary: '310000', qualification: 'Shariah & Law Degree', experience: '12 Years', phone: '+966 50 100 2002', email: 'sheikh.a@igs-sa.edu', gender: 'Male' },
        { id: '3', name: 'Reem Al-Dosari', role: 'Teacher', subject: 'Mathematics', className: 'Class 10-B', status: 'Active', salary: '270000', qualification: 'M.Sc. Mathematics', experience: '8 Years', phone: '+966 50 100 2003', email: 'reem.d@igs-sa.edu', gender: 'Female' },
        { id: '4', name: 'Michael Preston', role: 'Teacher', subject: 'English Language', className: 'Class 9-A', status: 'Active', salary: '290000', qualification: 'CELTA, B.A. English', experience: '7 Years', phone: '+966 50 100 2004', email: 'm.preston@igs-sa.edu', gender: 'Male' },
        { id: '5', name: 'Hana Al-Johani', role: 'Teacher', subject: 'Arabic Language', className: 'Class 9-B', status: 'Active', salary: '260000', qualification: 'M.A. Arabic', experience: '6 Years', phone: '+966 50 100 2005', email: 'hana.j@igs-sa.edu', gender: 'Female' },
        { id: '6', name: 'Nawaf Al-Subaie', role: 'Vice Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '420000', qualification: 'M.Ed. Administration', experience: '16 Years', phone: '+966 50 100 2006', email: 'vp@igs-sa.edu', gender: 'Male' },
        { id: '7', name: 'Afnan Al-Mutairi', role: 'Librarian', subject: 'Library', className: 'Library Block', status: 'Active', salary: '175000', qualification: 'B.A. Information Science', experience: '5 Years', phone: '+966 50 100 2007', email: 'library@igs-sa.edu', gender: 'Female' },
        { id: '8', name: 'Ramzi Issa', role: 'IT Administrator', subject: 'Technology', className: 'IT Lab', status: 'Active', salary: '210000', qualification: 'B.Sc. Network Engineering', experience: '7 Years', phone: '+966 50 100 2008', email: 'it@igs-sa.edu', gender: 'Male' },
        { id: '9', name: 'Hassan Al-Bajali', role: 'Guard', subject: 'Security', className: 'Main Gate', status: 'Active', salary: '95000', qualification: 'Matric', experience: '9 Years', phone: '+966 50 100 2009', email: 'security@igs-sa.edu', gender: 'Male' },
        { id: '10', name: 'Parveen Naidu', role: 'Domestic Staff', subject: 'Cleaning', className: 'Admin Block', status: 'Active', salary: '70000', qualification: 'Primary', experience: '6 Years', phone: '+966 50 100 2010', email: 'staff@igs-sa.edu', gender: 'Female' }
      ],
      notices: [
        { id: '1', date: '2026-06-07', title: 'Quran Recitation Competition', content: 'Annual Quran Tilawat competition will be held on June 22nd. Registrations open.' },
        { id: '2', date: '2026-06-11', title: 'National Day Celebrations', content: 'School will host flag-raising ceremony and cultural parade on June 24th.' }
      ],
      leaves: [],
      invoices: [
        { id: 'INV-501', student: 'Yasser Qahtani', amount: 3200, status: 'Unpaid' },
        { id: 'INV-502', student: 'Layla Bukhari', amount: 3200, status: 'Paid' },
        { id: 'INV-503', student: 'Abdullah Al-Ghamdi', amount: 3200, status: 'Unpaid' },
        { id: 'INV-504', student: 'Haya Al-Zahrani', amount: 3200, status: 'Paid' },
        { id: 'INV-505', student: 'Faris Al-Otaibi', amount: 2800, status: 'Unpaid' },
        { id: 'INV-506', student: 'Reem Al-Dosari', amount: 3200, status: 'Paid' },
        { id: 'INV-507', student: 'Walid Al-Shehri', amount: 3000, status: 'Paid' },
        { id: 'INV-508', student: 'Nouf Al-Harbi', amount: 2600, status: 'Unpaid' },
        { id: 'INV-509', student: 'Saud Bin Nasser', amount: 2800, status: 'Paid' },
        { id: 'INV-510', student: 'Maryam Al-Qurashi', amount: 3000, status: 'Unpaid' }
      ],
      assignments: [
        { id: '1', title: 'Tafseer Assignment – Surah Al-Baqarah', subject: 'Islamic Studies', publishDate: '2026-06-06', dueDate: '2026-06-20', fileName: 'tafseer_albaqarah.pdf', fileType: 'pdf', status: 'Published', fileUrl: '""" + PDF_BASE64 + """' }
      ],
      disciplines: [
        { id: '1', name: 'Abdullah Al-Ghamdi', date: '2026-06-08', infraction: 'Repeated Late Arrival', action: 'Parent Meeting Scheduled' }
      ],
      parentMessages: []
    }"""

# --- School 7: Roots International (CA) ---
SCHOOL_7_DATA = """{
      students: [
        { id: '1', name: 'Jack Miller', roll: '501', className: 'Class 10-A', status: 'Present', borrowedBooks: ['Canadian History Vol 2'], bookedTransport: 'School Bus A', hostelStatus: 'Day Scholar' },
        { id: '2', name: 'Emily Vance', roll: '502', className: 'Class 10-B', status: 'Present', borrowedBooks: [], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '3', name: 'Lucas Martin', roll: '503', className: 'Class 9-A', status: 'Absent', borrowedBooks: ['Sciences 9 Ontario'], bookedTransport: 'School Bus B', hostelStatus: 'Day Scholar' },
        { id: '4', name: 'Chloe Thompson', roll: '504', className: 'Class 10-A', status: 'Present', borrowedBooks: ['English 10 Grade Text'], bookedTransport: 'None', hostelStatus: 'Boarding House 3' },
        { id: '5', name: 'Aiden Walker', roll: '505', className: 'Class 8-A', status: 'Present', borrowedBooks: [], bookedTransport: 'School Bus A', hostelStatus: 'Day Scholar' },
        { id: '6', name: 'Madison Clark', roll: '506', className: 'Class 10-B', status: 'Present', borrowedBooks: ['French as Second Language'], bookedTransport: 'School Bus B', hostelStatus: 'Day Scholar' },
        { id: '7', name: 'Ethan Scott', roll: '507', className: 'Class 9-B', status: 'Present', borrowedBooks: [], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '8', name: 'Ava Rodriguez', roll: '508', className: 'Class 7-A', status: 'Late', borrowedBooks: ['Math 7 Resource'], bookedTransport: 'School Bus A', hostelStatus: 'Day Scholar' },
        { id: '9', name: 'Ben Carter', roll: '509', className: 'Class 8-B', status: 'Present', borrowedBooks: [], bookedTransport: 'School Bus B', hostelStatus: 'Day Scholar' },
        { id: '10', name: 'Mia Lewis', roll: '510', className: 'Class 9-A', status: 'Present', borrowedBooks: ['Civics Grade 9'], bookedTransport: 'None', hostelStatus: 'Day Scholar' }
      ],
      teachers: [
        { id: '1', name: 'Dr. Catherine McLaren', role: 'Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '380000', qualification: 'Ph.D. Curriculum Studies', experience: '21 Years', phone: '+1 416 555 0101', email: 'principal@rootsintl.ca', gender: 'Female' },
        { id: '2', name: 'Robert Downey', role: 'Teacher', subject: 'Social Studies', className: 'Class 10-A', status: 'Active', salary: '220000', qualification: 'B.Ed. Social Sciences', experience: '11 Years', phone: '+1 416 555 0102', email: 'r.downey@rootsintl.ca', gender: 'Male' },
        { id: '3', name: 'Sarah Jenkins', role: 'Teacher', subject: 'Biology', className: 'Class 10-B', status: 'Active', salary: '215000', qualification: 'M.Sc. Biology', experience: '8 Years', phone: '+1 416 555 0103', email: 's.jenkins@rootsintl.ca', gender: 'Female' },
        { id: '4', name: 'Patrick O'Neil', role: 'Teacher', subject: 'Mathematics', className: 'Class 9-A', status: 'Active', salary: '225000', qualification: 'M.Sc. Applied Math', experience: '10 Years', phone: '+1 416 555 0104', email: 'p.oneil@rootsintl.ca', gender: 'Male' },
        { id: '5', name: 'Nadia Belanger', role: 'Teacher', subject: 'French', className: 'Class 10-B', status: 'Active', salary: '200000', qualification: 'M.A. French Studies', experience: '7 Years', phone: '+1 416 555 0105', email: 'n.belanger@rootsintl.ca', gender: 'Female' },
        { id: '6', name: 'Tyler Ross', role: 'Vice Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '320000', qualification: 'M.Ed. Administration', experience: '14 Years', phone: '+1 416 555 0106', email: 'vp@rootsintl.ca', gender: 'Male' },
        { id: '7', name: 'Danielle Trudeau', role: 'Librarian', subject: 'Library', className: 'Library Block', status: 'Active', salary: '145000', qualification: 'MLIS', experience: '9 Years', phone: '+1 416 555 0107', email: 'library@rootsintl.ca', gender: 'Female' },
        { id: '8', name: 'Marcus Singh', role: 'IT Administrator', subject: 'Technology', className: 'IT Lab', status: 'Active', salary: '175000', qualification: 'B.Sc. Computer Science', experience: '6 Years', phone: '+1 416 555 0108', email: 'it@rootsintl.ca', gender: 'Male' },
        { id: '9', name: 'Frank Lavoie', role: 'Guard', subject: 'Security', className: 'Main Gate', status: 'Active', salary: '100000', qualification: 'Ontario Security License', experience: '12 Years', phone: '+1 416 555 0109', email: 'security@rootsintl.ca', gender: 'Male' },
        { id: '10', name: 'Rosa Pereira', role: 'Domestic Staff', subject: 'Cleaning', className: 'Admin Block', status: 'Active', salary: '85000', qualification: 'High School', experience: '5 Years', phone: '+1 416 555 0110', email: 'staff@rootsintl.ca', gender: 'Female' }
      ],
      notices: [
        { id: '1', date: '2026-06-09', title: 'Canada Day Celebration', content: 'School will celebrate Canada Day with cultural events and student performances on July 1st.' },
        { id: '2', date: '2026-06-11', title: 'Provincial Exam Schedule', content: 'Grade 10 Ontario provincial exams are scheduled for June 22-26. Please review the timetable.' }
      ],
      leaves: [
        { id: '1', name: 'Patrick O\\'Neil', date: '2026-06-13', reason: 'Bereavement Leave', status: 'Approved' }
      ],
      invoices: [
        { id: 'INV-601', student: 'Jack Miller', amount: 1600, status: 'Unpaid' },
        { id: 'INV-602', student: 'Emily Vance', amount: 1600, status: 'Paid' },
        { id: 'INV-603', student: 'Lucas Martin', amount: 1600, status: 'Unpaid' },
        { id: 'INV-604', student: 'Chloe Thompson', amount: 1600, status: 'Paid' },
        { id: 'INV-605', student: 'Aiden Walker', amount: 1400, status: 'Unpaid' },
        { id: 'INV-606', student: 'Madison Clark', amount: 1600, status: 'Paid' },
        { id: 'INV-607', student: 'Ethan Scott', amount: 1500, status: 'Unpaid' },
        { id: 'INV-608', student: 'Ava Rodriguez', amount: 1300, status: 'Paid' },
        { id: 'INV-609', student: 'Ben Carter', amount: 1400, status: 'Paid' },
        { id: 'INV-610', student: 'Mia Lewis', amount: 1500, status: 'Unpaid' }
      ],
      assignments: [
        { id: '1', title: 'Civics Assignment – Canadian Government', subject: 'Social Studies', publishDate: '2026-06-06', dueDate: '2026-06-20', fileName: 'civics_govt.pdf', fileType: 'pdf', status: 'Published', fileUrl: '""" + PDF_BASE64 + """' }
      ],
      disciplines: [
        { id: '1', name: 'Ava Rodriguez', date: '2026-06-08', infraction: 'Running in Hallways', action: 'Verbal Warning' }
      ],
      parentMessages: [
        { id: '1', parent: 'Mr. Miller (Jack\\'s Father)', date: '2026-06-12', subject: 'Bus Route Change', message: 'We have moved houses. Can you please update Jack\\'s bus route to School Bus B?' }
      ]
    }"""

# --- School 8: Allied School Campus A (US) ---
SCHOOL_8_DATA = """{
      students: [
        { id: '1', name: 'John Doe', roll: '601', className: 'Class 10-A', status: 'Present', borrowedBooks: ['US History 10th Grade'], bookedTransport: 'Bus Route Alpha', hostelStatus: 'Day Scholar' },
        { id: '2', name: 'Jane Doe', roll: '602', className: 'Class 10-B', status: 'Present', borrowedBooks: [], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '3', name: 'Michael Johnson', roll: '603', className: 'Class 9-A', status: 'Absent', borrowedBooks: ['Algebra 2 Textbook'], bookedTransport: 'Bus Route Beta', hostelStatus: 'Day Scholar' },
        { id: '4', name: 'Emily Davis', roll: '604', className: 'Class 10-A', status: 'Present', borrowedBooks: ['AP Chemistry Guide'], bookedTransport: 'None', hostelStatus: 'On-Campus Dorm 5' },
        { id: '5', name: 'Chris Wilson', roll: '605', className: 'Class 8-A', status: 'Present', borrowedBooks: [], bookedTransport: 'Bus Route Alpha', hostelStatus: 'Day Scholar' },
        { id: '6', name: 'Ashley Martinez', roll: '606', className: 'Class 10-B', status: 'Present', borrowedBooks: ['AP English Lit'], bookedTransport: 'Bus Route Beta', hostelStatus: 'Day Scholar' },
        { id: '7', name: 'Daniel Anderson', roll: '607', className: 'Class 9-B', status: 'Present', borrowedBooks: [], bookedTransport: 'None', hostelStatus: 'Day Scholar' },
        { id: '8', name: 'Jessica Taylor', roll: '608', className: 'Class 7-A', status: 'Late', borrowedBooks: ['Pre-Algebra'], bookedTransport: 'Bus Route Alpha', hostelStatus: 'Day Scholar' },
        { id: '9', name: 'Ryan Lee', roll: '609', className: 'Class 8-B', status: 'Present', borrowedBooks: [], bookedTransport: 'Bus Route Beta', hostelStatus: 'Day Scholar' },
        { id: '10', name: 'Samantha White', roll: '610', className: 'Class 9-A', status: 'Present', borrowedBooks: ['Earth Science Grade 9'], bookedTransport: 'None', hostelStatus: 'Day Scholar' }
      ],
      teachers: [
        { id: '1', name: 'Dr. Brian Foster', role: 'Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '420000', qualification: 'Ed.D. Educational Leadership', experience: '22 Years', phone: '+1 212 555 0201', email: 'principal@allied-us.edu', gender: 'Male' },
        { id: '2', name: 'Alan Turing', role: 'Teacher', subject: 'Computer Science', className: 'Class 10-A', status: 'Active', salary: '260000', qualification: 'M.S. Computer Science', experience: '13 Years', phone: '+1 212 555 0202', email: 'a.turing@allied-us.edu', gender: 'Male' },
        { id: '3', name: 'Ada Lovelace', role: 'Teacher', subject: 'Mathematics', className: 'Class 10-B', status: 'Active', salary: '250000', qualification: 'M.S. Mathematics', experience: '10 Years', phone: '+1 212 555 0203', email: 'a.lovelace@allied-us.edu', gender: 'Female' },
        { id: '4', name: 'Marie Curie', role: 'Teacher', subject: 'Physics & Chemistry', className: 'Class 9-A', status: 'Active', salary: '265000', qualification: 'M.S. Physics, Chemistry Minor', experience: '12 Years', phone: '+1 212 555 0204', email: 'm.curie@allied-us.edu', gender: 'Female' },
        { id: '5', name: 'Ernest Hemingway', role: 'Teacher', subject: 'English Literature', className: 'Class 10-B', status: 'Active', salary: '235000', qualification: 'M.F.A. Creative Writing', experience: '9 Years', phone: '+1 212 555 0205', email: 'e.hemingway@allied-us.edu', gender: 'Male' },
        { id: '6', name: 'Linda Roberts', role: 'Vice Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '360000', qualification: 'M.Ed. Administration', experience: '17 Years', phone: '+1 212 555 0206', email: 'vp@allied-us.edu', gender: 'Female' },
        { id: '7', name: 'Tom Bradley', role: 'Librarian', subject: 'Library', className: 'Library Block', status: 'Active', salary: '155000', qualification: 'MLIS', experience: '10 Years', phone: '+1 212 555 0207', email: 'library@allied-us.edu', gender: 'Male' },
        { id: '8', name: 'Grace Kim', role: 'IT Administrator', subject: 'Technology', className: 'IT Lab', status: 'Active', salary: '195000', qualification: 'B.S. Information Systems', experience: '7 Years', phone: '+1 212 555 0208', email: 'it@allied-us.edu', gender: 'Female' },
        { id: '9', name: 'Joe Torres', role: 'Guard', subject: 'Security', className: 'Main Gate', status: 'Active', salary: '105000', qualification: 'State Security License', experience: '15 Years', phone: '+1 212 555 0209', email: 'security@allied-us.edu', gender: 'Male' },
        { id: '10', name: 'Maria Gonzalez', role: 'Domestic Staff', subject: 'Cleaning', className: 'Admin Block', status: 'Active', salary: '80000', qualification: 'High School Diploma', experience: '6 Years', phone: '+1 212 555 0210', email: 'staff@allied-us.edu', gender: 'Female' }
      ],
      notices: [
        { id: '1', date: '2026-06-09', title: 'Independence Day Holiday', content: 'School will remain closed on July 4th in observance of Independence Day.' },
        { id: '2', date: '2026-06-11', title: 'SAT Prep Workshop', content: 'Free SAT preparation workshop for Grade 10 students starts June 17th after school.' }
      ],
      leaves: [
        { id: '1', name: 'Marie Curie', date: '2026-06-12', reason: 'Conference Attendance', status: 'Approved' }
      ],
      invoices: [
        { id: 'INV-701', student: 'John Doe', amount: 1900, status: 'Unpaid' },
        { id: 'INV-702', student: 'Jane Doe', amount: 1900, status: 'Paid' },
        { id: 'INV-703', student: 'Michael Johnson', amount: 1900, status: 'Unpaid' },
        { id: 'INV-704', student: 'Emily Davis', amount: 1900, status: 'Paid' },
        { id: 'INV-705', student: 'Chris Wilson', amount: 1700, status: 'Unpaid' },
        { id: 'INV-706', student: 'Ashley Martinez', amount: 1900, status: 'Paid' },
        { id: 'INV-707', student: 'Daniel Anderson', amount: 1800, status: 'Unpaid' },
        { id: 'INV-708', student: 'Jessica Taylor', amount: 1600, status: 'Paid' },
        { id: 'INV-709', student: 'Ryan Lee', amount: 1700, status: 'Paid' },
        { id: 'INV-710', student: 'Samantha White', amount: 1800, status: 'Unpaid' }
      ],
      assignments: [
        { id: '1', title: 'AP US History: Reconstruction Era Essay', subject: 'US History', publishDate: '2026-06-05', dueDate: '2026-06-21', fileName: 'reconstruction_essay.pdf', fileType: 'pdf', status: 'Published', fileUrl: '""" + PDF_BASE64 + """' }
      ],
      disciplines: [
        { id: '1', name: 'Michael Johnson', date: '2026-06-09', infraction: 'Bullying Incident', action: 'Counselor Session Scheduled' }
      ],
      parentMessages: [
        { id: '1', parent: 'Mr. Doe (John\\'s Father)', date: '2026-06-10', subject: 'Grade Inquiry', message: 'Can we schedule a meeting to discuss John\\'s performance in the upcoming finals?' }
      ]
    }"""


def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # --- Fix School 1 teachers (lines ~557-568) ---
    old_s1_teachers = """      teachers: [
        { id: '1', name: 'Sarah Khan', role: 'Teacher', subject: 'English', className: 'Class 10-A', status: 'Active', salary: '65000', qualification: 'M.Ed', phone: '+92 300 0000000' },
        { id: '2', name: 'Raza Ahmed', role: 'Teacher', subject: 'Physics', className: 'Class 10-B', status: 'Active', salary: '65000', qualification: 'M.Ed', phone: '+92 300 0000000' },
        { id: '3', name: 'Hina Malik', role: 'Teacher', subject: 'Mathematics', className: 'Class 9-A', status: 'Active', salary: '65000', qualification: 'M.Ed', phone: '+92 300 0000000' },
        { id: '4', name: 'Tariq Mehmood', role: 'Vice Principal', subject: 'Administration', className: 'Admin Block', status: 'Active', salary: '120000', qualification: 'PhD', phone: '+92 300 1111111' },
        { id: '5', name: 'Ayesha Bibi', role: 'Coordinator', subject: 'Academics', className: 'Admin Block', status: 'Active', salary: '85000', qualification: 'MBA', phone: '+92 300 2222222' },
        { id: '6', name: 'Bashir Ahmed', role: 'Guard', subject: 'Security', className: 'Main Gate', status: 'Active', salary: '35000', qualification: 'Matric', phone: '+92 300 3333333' },
        { id: '7', name: 'Sajid Ali', role: 'Electrician', subject: 'Maintenance', className: 'Campus', status: 'Active', salary: '40000', qualification: 'Diploma', phone: '+92 300 4444444' },
        { id: '8', name: 'Ghafoor Khan', role: 'Plumber', subject: 'Maintenance', className: 'Campus', status: 'Active', salary: '38000', qualification: 'Diploma', phone: '+92 300 5555555' },
        { id: '9', name: 'Munir', role: 'Gardener', subject: 'Maintenance', className: 'Grounds', status: 'Active', salary: '32000', qualification: 'Middle', phone: '+92 300 6666666' },
        { id: '10', name: 'Zubaida', role: 'Domestic Staff', subject: 'Cleaning', className: 'Block A', status: 'Active' },
        { id: '11', name: 'Faizan', role: 'Helper', subject: 'Support', className: 'Admin Block', status: 'Active' }
      ],"""
    new_s1_teachers = "      teachers: " + SCHOOL_1_TEACHERS + ","
    if old_s1_teachers in content:
        content = content.replace(old_s1_teachers, new_s1_teachers)
        print("School 1 teachers updated.")

    # --- Fix School 2 teachers ---
    old_s2_teachers = """      teachers: [
        { id: '1', name: 'Usman Ghani', subject: 'English', className: 'Class 10-A', status: 'Active', salary: '55000', experience: '4 Years', qualification: 'M.A. English', phone: '+92 300 1111111', email: 'usman.g@school.edu', gender: 'Male', role: 'Teacher' },
        { id: '2', name: 'Ayesha Khan', subject: 'Mathematics', className: 'Class 10-B', status: 'Active', salary: '60000', experience: '5 Years', qualification: 'M.Sc. Mathematics', phone: '+92 300 2222221', email: 'ayesha@school.edu', gender: 'Female', role: 'Teacher' },
        { id: '3', name: 'Fatima Noor', subject: 'Science', className: 'Class 6-A', status: 'Active', salary: '40000', experience: '2 Years', qualification: 'B.Sc. General Science', phone: '+92 300 3333333', email: 'fatima@school.edu', gender: 'Female', role: 'Teacher' },
        { id: '4', name: 'Tariq Jameel', subject: 'Islamic Studies', className: 'Class 9-A', status: 'Active', salary: '45000', experience: '8 Years', qualification: 'M.A. Islamic Studies', phone: '+92 300 4444444', email: 'tariq.j@school.edu', gender: 'Male', role: 'Teacher' },
        { id: '5', name: 'Nida Yasir', subject: 'Physics', className: 'Class 10-B', status: 'Active', salary: '50000', experience: '3 Years', qualification: 'M.Sc. Physics', phone: '+92 300 5555555', email: 'nida@school.edu', gender: 'Female', role: 'Teacher' }
      ],"""
    new_s2_teachers = "      teachers: " + SCHOOL_2_TEACHERS + ","
    if old_s2_teachers in content:
        content = content.replace(old_s2_teachers, new_s2_teachers)
        print("School 2 teachers updated.")

    # --- Replace school 3 data ---
    old_s3 = """    // 3. The Educators (PK)
    '33333333-3333-3333-3333-333333333333': {
      students: [
        { id: '1', name: 'Hamza Sohail', roll: '55', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Sana Javed', roll: '21', className: 'Class 10-B', status: 'Present' }
      ],
      teachers: [
        { id: '1', name: 'Maryam Bibi', subject: 'Urdu', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'Khalid Butt', subject: 'Science', className: 'Class 9-A', status: 'Active' }
      ],
      notices: [
        { id: '1', date: '2026-06-06 10:00 AM', title: 'Parent Teacher Meeting', content: 'PTM is scheduled for Saturday. Report cards will be distributed.' }
      ],
      leaves: [],
      invoices: [
        { id: 'INV-201', student: 'Hamza Sohail', amount: 5000, status: 'Unpaid' }
      ],
      assignments: [
        { 
          id: 'demo-1', 
          title: 'Demo Class Homework Assignment', 
          subject: 'English', 
          publishDate: '2026-06-05', 
          dueDate: '2026-06-25', 
          fileName: 'demo_assignment_guidelines.pdf', 
          fileType: 'pdf', 
          status: 'Published', 
          fileUrl: '""" + PDF_BASE64 + """'
        }
      ],
      disciplines: [],
      parentMessages: []
    },"""
    new_s3 = "    // 3. The Educators (PK)\n    '33333333-3333-3333-3333-333333333333': " + SCHOOL_3_DATA + ","
    if old_s3 in content:
        content = content.replace(old_s3, new_s3)
        print("School 3 replaced.")

    # --- Replace school 4 data ---
    old_s4 = """    // 4. Beaconhouse London (UK)
    '44444444-4444-4444-4444-444444444444': {
      students: [
        { id: '1', name: 'George Harrison', roll: '201', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Oliver Smith', roll: '202', className: 'Class 10-B', status: 'Present' }
      ],
      teachers: [
        { id: '1', name: 'John Watson', subject: 'Chemistry', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'Clara Oswald', subject: 'History', className: 'Class 10-B', status: 'Active' }
      ],
      notices: [
        { id: '1', date: '2026-06-08', title: 'GCSE Exam Prep Timetable', content: 'Check the board for extra coaching classes before the final mocks.' }
      ],
      leaves: [],
      invoices: [
        { id: 'INV-301', student: 'George Harrison', amount: 1200, status: 'Unpaid' }
      ],
      assignments: [
        { 
          id: 'demo-1', 
          title: 'Demo Class Homework Assignment', 
          subject: 'English', 
          publishDate: '2026-06-05', 
          dueDate: '2026-06-25', 
          fileName: 'demo_assignment_guidelines.pdf', 
          fileType: 'pdf', 
          status: 'Published', 
          fileUrl: '""" + PDF_BASE64 + """'
        }
      ],
      disciplines: [],
      parentMessages: []
    },"""
    new_s4 = "    // 4. Beaconhouse London (UK)\n    '44444444-4444-4444-4444-444444444444': " + SCHOOL_4_DATA + ","
    if old_s4 in content:
        content = content.replace(old_s4, new_s4)
        print("School 4 replaced.")

    # --- Replace school 5 data ---
    old_s5 = """    // 5. Beaconhouse Dubai (AE)
    '55555555-5555-5555-5555-555555555555': {
      students: [
        { id: '1', name: 'Omar Al-Mansoori', roll: '301', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Yasmin Qureshi', roll: '302', className: 'Class 10-B', status: 'Present' }
      ],
      teachers: [
        { id: '1', name: 'Fatima Al-Hashimi', subject: 'Arabic', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'David Miller', subject: 'English', className: 'Class 10-B', status: 'Active' }
      ],
      notices: [
        { id: '1', date: '2026-06-07', title: 'Ramadan Timing Update', content: 'School hours will be adjusted as per government declarations.' }
      ],
      leaves: [],
      invoices: [
        { id: 'INV-401', student: 'Omar Al-Mansoori', amount: 2500, status: 'Unpaid' }
      ],
      assignments: [
        { 
          id: 'demo-1', 
          title: 'Demo Class Homework Assignment', 
          subject: 'English', 
          publishDate: '2026-06-05', 
          dueDate: '2026-06-25', 
          fileName: 'demo_assignment_guidelines.pdf', 
          fileType: 'pdf', 
          status: 'Published', 
          fileUrl: '""" + PDF_BASE64 + """'
        }
      ],
      disciplines: [],
      parentMessages: []
    },"""
    new_s5 = "    // 5. Beaconhouse Dubai (AE)\n    '55555555-5555-5555-5555-555555555555': " + SCHOOL_5_DATA + ","
    if old_s5 in content:
        content = content.replace(old_s5, new_s5)
        print("School 5 replaced.")

    # --- Replace school 6 data ---
    old_s6 = """    // 6. International Grammar School (SA)
    '66666666-6666-6666-6666-666666666666': {
      students: [
        { id: '1', name: 'Yasser Qahtani', roll: '401', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Layla Bukhari', roll: '402', className: 'Class 10-B', status: 'Present' }
      ],
      teachers: [
        { id: '1', name: 'Sheikh Abdul', subject: 'Islamic Studies', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'Reem', subject: 'Maths', className: 'Class 10-B', status: 'Active' }
      ],
      notices: [],
      leaves: [],
      invoices: [
        { id: 'INV-501', student: 'Yasser Qahtani', amount: 3000, status: 'Unpaid' }
      ],
      assignments: [
        { 
          id: 'demo-1', 
          title: 'Demo Class Homework Assignment', 
          subject: 'English', 
          publishDate: '2026-06-05', 
          dueDate: '2026-06-25', 
          fileName: 'demo_assignment_guidelines.pdf', 
          fileType: 'pdf', 
          status: 'Published', 
          fileUrl: '""" + PDF_BASE64 + """'
        }
      ],
      disciplines: [],
      parentMessages: []
    },"""
    new_s6 = "    // 6. International Grammar School (SA)\n    '66666666-6666-6666-6666-666666666666': " + SCHOOL_6_DATA + ","
    if old_s6 in content:
        content = content.replace(old_s6, new_s6)
        print("School 6 replaced.")

    # --- Replace school 7 data ---
    old_s7 = """    // 7. Roots International (CA)
    '77777777-7777-7777-7777-777777777777': {
      students: [
        { id: '1', name: 'Jack Miller', roll: '501', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Emily Vance', roll: '502', className: 'Class 10-B', status: 'Present' }
      ],
      teachers: [
        { id: '1', name: 'Robert Downey', subject: 'Social Studies', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'Sarah Jenkins', subject: 'Biology', className: 'Class 10-B', status: 'Active' }
      ],
      notices: [],
      leaves: [],
      invoices: [
        { id: 'INV-601', student: 'Jack Miller', amount: 1500, status: 'Unpaid' }
      ],
      assignments: [
        { 
          id: 'demo-1', 
          title: 'Demo Class Homework Assignment', 
          subject: 'English', 
          publishDate: '2026-06-05', 
          dueDate: '2026-06-25', 
          fileName: 'demo_assignment_guidelines.pdf', 
          fileType: 'pdf', 
          status: 'Published', 
          fileUrl: '""" + PDF_BASE64 + """'
        }
      ],
      disciplines: [],
      parentMessages: []
    },"""
    new_s7 = "    // 7. Roots International (CA)\n    '77777777-7777-7777-7777-777777777777': " + SCHOOL_7_DATA + ","
    if old_s7 in content:
        content = content.replace(old_s7, new_s7)
        print("School 7 replaced.")

    # --- Replace school 8 data ---
    old_s8 = """    // 8. Allied School Campus A (US)
    '00000000-0000-0000-0000-000000000000': {
      students: [
        { id: '1', name: 'John Doe', roll: '601', className: 'Class 10-A', status: 'Present' },
        { id: '2', name: 'Jane Doe', roll: '602', className: 'Class 10-B', status: 'Present' }
      ],
      teachers: [
        { id: '1', name: 'Alan Turing', subject: 'Computer Science', className: 'Class 10-A', status: 'Active' },
        { id: '2', name: 'Ada Lovelace', subject: 'Mathematics', className: 'Class 10-B', status: 'Active' }
      ],
      notices: [],
      leaves: [],
      invoices: [
        { id: 'INV-701', student: 'John Doe', amount: 1800, status: 'Unpaid' }
      ],
      assignments: [
        { 
          id: 'demo-1', 
          title: 'Demo Class Homework Assignment', 
          subject: 'English', 
          publishDate: '2026-06-05', 
          dueDate: '2026-06-25', 
          fileName: 'demo_assignment_guidelines.pdf', 
          fileType: 'pdf', 
          status: 'Published', 
          fileUrl: '""" + PDF_BASE64 + """'
        }
      ],
      disciplines: [],
      parentMessages: []
    }"""
    new_s8 = "    // 8. Allied School Campus A (US)\n    '00000000-0000-0000-0000-000000000000': " + SCHOOL_8_DATA
    if old_s8 in content:
        content = content.replace(old_s8, new_s8)
        print("School 8 replaced.")

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

    print("\n✅ All schools updated successfully!")

if __name__ == '__main__':
    main()
