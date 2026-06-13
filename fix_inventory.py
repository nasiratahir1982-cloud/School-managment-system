"""
Fix inventory: 
1. Make inventoryItems school-aware (stored in database per-school)
2. Add Edit + Delete buttons to each row
3. Pre-seed each school with realistic, relevant inventory items
"""

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # -----------------------------------------------------------------------
    # 1. Change global inventoryItems state to a per-school lookup
    # Replace the old flat useState with school-aware data pulled from schoolDb
    # -----------------------------------------------------------------------

    old_state = """  const [inventoryItems, setInventoryItems] = useState([
    { id: '1', name: 'Dell Optiplex 3020', category: 'IT Equipment', location: 'Computer Lab 1', qty: '30 Good', value: '$6,500' },
    { id: '2', name: 'Chemistry Flasks', category: 'Lab Supplies', location: 'Science Lab', qty: '15 Low Stock', value: '$150' },
    { id: '3', name: 'Wooden Desks & Chairs', category: 'School Furniture', location: 'Class 10-A', qty: '40 Good', value: '$2,000' },
    { id: '4', name: 'Interactive Smart Board', category: 'Electronics', location: 'Lecture Hall', qty: '1 Good', value: '$1,200' },
    { id: '5', name: 'Swing Sets & Slides', category: 'Play Area Things', location: 'Kindergarten Yard', qty: '1 Set Good', value: '$800' }
  ]);"""

    new_state = """  const [editingInventoryId, setEditingInventoryId] = useState<string | null>(null);
  const [editInventoryForm, setEditInventoryForm] = useState<{name:string;category:string;location:string;qty:string;value:string} | null>(null);"""

    if old_state in content:
        content = content.replace(old_state, new_state)
        print("Inventory global state replaced.")

    # -----------------------------------------------------------------------
    # 2. Also add inventory to the database object
    # Each school's database entry needs an `inventory` field.
    # We store and read it via updateSchoolDb.
    # -----------------------------------------------------------------------

    # Add inventory to schoolDb fallback
    old_schooldb_fallback = """  const schoolDb = database[activeSchoolId] || {
    students: [] as any[],
    waitingList: [] as any[],
    teachers: [] as any[],
    notices: [] as any[],
    leaves: [],
    invoices: [],
    assignments: ["""

    new_schooldb_fallback = """  const schoolDb = database[activeSchoolId] || {
    students: [] as any[],
    waitingList: [] as any[],
    teachers: [] as any[],
    notices: [] as any[],
    leaves: [],
    invoices: [],
    inventory: [] as any[],
    assignments: ["""

    if old_schooldb_fallback in content:
        content = content.replace(old_schooldb_fallback, new_schooldb_fallback)
        print("schoolDb fallback updated with inventory.")

    # -----------------------------------------------------------------------
    # 3. Add setInventory helper alongside other setXxx helpers
    # -----------------------------------------------------------------------
    old_set_helpers = """    const setStudents = (val: any) => updateSchoolDb('students', val);
    const setWaitingList = (val: any) => updateSchoolDb('waitingList', val);
    const setTeachers = (val: any) => updateSchoolDb('teachers', val);"""

    new_set_helpers = """    const setStudents = (val: any) => updateSchoolDb('students', val);
    const setWaitingList = (val: any) => updateSchoolDb('waitingList', val);
    const setTeachers = (val: any) => updateSchoolDb('teachers', val);
    const setInventory = (val: any) => updateSchoolDb('inventory', val);"""

    if old_set_helpers in content:
        content = content.replace(old_set_helpers, new_set_helpers)
        print("setInventory helper added.")

    # -----------------------------------------------------------------------
    # 4. Seed each school's database with relevant inventory items
    # We need to add `inventory: [...]` into each school entry
    # -----------------------------------------------------------------------

    # School 1 - Academic Hub Lahore (PK)
    s1_inv_seed = """,
      inventory: [
        { id: 'inv-1', name: 'Dell Optiplex Desktops', category: 'IT Equipment', location: 'Computer Lab 1', qty: '32 Good', value: 'Rs. 3,200,000' },
        { id: 'inv-2', name: 'Interactive Smart Boards', category: 'Electronics', location: 'Lecture Hall A & B', qty: '4 Good', value: 'Rs. 480,000' },
        { id: 'inv-3', name: 'Student Wooden Desks', category: 'School Furniture', location: 'All Classrooms', qty: '350 Good', value: 'Rs. 1,750,000' },
        { id: 'inv-4', name: 'Chemistry Beakers & Flasks', category: 'Lab Supplies', location: 'Science Lab 1', qty: '60 Low Stock', value: 'Rs. 45,000' },
        { id: 'inv-5', name: 'Physics Lab Kits', category: 'Lab Supplies', location: 'Science Lab 2', qty: '20 Good', value: 'Rs. 80,000' },
        { id: 'inv-6', name: 'Teacher Whiteboard Markers', category: 'Stationary', location: 'Admin Storeroom', qty: '200 pcs Good', value: 'Rs. 6,000' },
        { id: 'inv-7', name: 'Football & Volleyball Set', category: 'Sports Equipment', location: 'Sports Room', qty: '15 Good', value: 'Rs. 45,000' },
        { id: 'inv-8', name: 'Swing Sets & Slides', category: 'Play Area Things', location: 'Junior Playground', qty: '1 Set Good', value: 'Rs. 95,000' },
        { id: 'inv-9', name: 'CCTV Security Cameras', category: 'Electronics', location: 'Campus-Wide', qty: '24 Good', value: 'Rs. 240,000' },
        { id: 'inv-10', name: 'Library Book Collection', category: 'Other', location: 'Main Library', qty: '3,500 Books Good', value: 'Rs. 700,000' },
        { id: 'inv-11', name: 'Projectors', category: 'Electronics', location: 'Class 10-A, 10-B, 9-A', qty: '6 Good', value: 'Rs. 180,000' },
        { id: 'inv-12', name: 'Fire Extinguishers', category: 'Other', location: 'All Floors', qty: '18 Good', value: 'Rs. 54,000' },
        { id: 'inv-13', name: 'Printer (HP LaserJet)', category: 'IT Equipment', location: 'Admin Office', qty: '3 Good', value: 'Rs. 90,000' },
        { id: 'inv-14', name: 'Water Cooler / Dispenser', category: 'Other', location: 'Corridor Block A & B', qty: '8 Good', value: 'Rs. 64,000' },
        { id: 'inv-15', name: 'Exam Answer Sheet Reams', category: 'Stationary', location: 'Admin Storeroom', qty: '500 reams Low Stock', value: 'Rs. 75,000' }
      ]"""
    target_s1_end = """      parentMessages: [
        { id: '1', parent: 'M. Shah (Kamran\\'s Father)', date: '2026-06-08', subject: 'Query about summer camp', message: 'Will school transport be available during the summer classes?' }
      ]
    },
    // 2. Beaconhouse Campus Lahore (PK)"""
    new_s1_end = """      parentMessages: [
        { id: '1', parent: 'M. Shah (Kamran\\'s Father)', date: '2026-06-08', subject: 'Query about summer camp', message: 'Will school transport be available during the summer classes?' }
      ]""" + s1_inv_seed + """
    },
    // 2. Beaconhouse Campus Lahore (PK)"""
    if target_s1_end in content:
        content = content.replace(target_s1_end, new_s1_end)
        print("School 1 inventory seeded.")

    # School 2 - Beaconhouse Lahore
    s2_inv_seed = """,
      inventory: [
        { id: 'inv-1', name: 'MacBook Air M2 (Teacher Units)', category: 'IT Equipment', location: 'Staff Room', qty: '12 Good', value: 'Rs. 4,800,000' },
        { id: 'inv-2', name: 'HP ProBook Student Laptops', category: 'IT Equipment', location: 'Computer Lab', qty: '45 Good', value: 'Rs. 7,200,000' },
        { id: 'inv-3', name: 'Ergonomic Student Chairs', category: 'School Furniture', location: 'All Classrooms', qty: '400 Good', value: 'Rs. 2,000,000' },
        { id: 'inv-4', name: 'Science Lab Microscopes', category: 'Lab Supplies', location: 'Bio Lab', qty: '25 Good', value: 'Rs. 375,000' },
        { id: 'inv-5', name: 'Digital Projectors Epson', category: 'Electronics', location: 'All Classrooms', qty: '20 Good', value: 'Rs. 600,000' },
        { id: 'inv-6', name: 'Cricket Bats & Pads Set', category: 'Sports Equipment', location: 'Sports Storeroom', qty: '10 Sets Good', value: 'Rs. 150,000' },
        { id: 'inv-7', name: 'Library Shelving Units', category: 'School Furniture', location: 'Library', qty: '30 Good', value: 'Rs. 300,000' },
        { id: 'inv-8', name: 'A4 Printing Paper Boxes', category: 'Stationary', location: 'Admin Store', qty: '200 Boxes Good', value: 'Rs. 120,000' },
        { id: 'inv-9', name: 'UPS Power Backup Units', category: 'Electronics', location: 'Server Room', qty: '4 Good', value: 'Rs. 120,000' },
        { id: 'inv-10', name: 'Playground Slides & Climbing', category: 'Play Area Things', location: 'Junior Section Yard', qty: '1 Set Good', value: 'Rs. 125,000' }
      ]"""
    target_s2_end = """      parentMessages: []
    },
    // 3. The Educators (PK)"""
    new_s2_end = """      parentMessages: []""" + s2_inv_seed + """
    },
    // 3. The Educators (PK)"""
    if target_s2_end in content:
        content = content.replace(target_s2_end, new_s2_end)
        print("School 2 inventory seeded.")

    # School 3 - The Educators (PK)
    s3_inv_patch = """      parentMessages: [
        { id: '1', parent: 'Mr. Sohail (Hamza\\'s Father)', date: '2026-06-09', subject: 'Transport Inquiry', message: 'Which route does my son take? Please confirm the morning pickup time.' }
      ]
    },
    // 4. Beaconhouse London (UK)"""
    s3_inv_new = """      parentMessages: [
        { id: '1', parent: 'Mr. Sohail (Hamza\\'s Father)', date: '2026-06-09', subject: 'Transport Inquiry', message: 'Which route does my son take? Please confirm the morning pickup time.' }
      ],
      inventory: [
        { id: 'inv-1', name: 'Classroom Chalkboards', category: 'School Furniture', location: 'All Classrooms', qty: '22 Good', value: 'Rs. 66,000' },
        { id: 'inv-2', name: 'Student Desks (Single)', category: 'School Furniture', location: 'All Classrooms', qty: '280 Good', value: 'Rs. 840,000' },
        { id: 'inv-3', name: 'Desktop PCs (Core i3)', category: 'IT Equipment', location: 'Computer Lab', qty: '25 Good', value: 'Rs. 1,250,000' },
        { id: 'inv-4', name: 'Teacher Podiums', category: 'School Furniture', location: 'All Classrooms', qty: '22 Good', value: 'Rs. 110,000' },
        { id: 'inv-5', name: 'Urdu / English Textbooks', category: 'Other', location: 'Library', qty: '1,500 Books Good', value: 'Rs. 300,000' },
        { id: 'inv-6', name: 'Football Goal Posts', category: 'Sports Equipment', location: 'Ground', qty: '2 Pairs Good', value: 'Rs. 20,000' },
        { id: 'inv-7', name: 'Marker Boards (Whiteboards)', category: 'Electronics', location: 'Class 9-A, 10-A', qty: '8 Good', value: 'Rs. 80,000' },
        { id: 'inv-8', name: 'Ceiling Fans', category: 'Electronics', location: 'All Rooms', qty: '60 Good', value: 'Rs. 180,000' },
        { id: 'inv-9', name: 'First Aid Kits', category: 'Other', location: 'Admin Office & Ground', qty: '5 Good', value: 'Rs. 10,000' },
        { id: 'inv-10', name: 'Drinking Water Dispensers', category: 'Other', location: 'Corridors', qty: '4 Good', value: 'Rs. 28,000' }
      ]
    },
    // 4. Beaconhouse London (UK)"""
    if s3_inv_patch in content:
        content = content.replace(s3_inv_patch, s3_inv_new)
        print("School 3 inventory seeded.")

    # School 4 - Beaconhouse London (UK)
    s4_inv_patch = """      parentMessages: [
        { id: '1', parent: 'Mrs. Harrison (George\\'s Mother)', date: '2026-06-10', subject: 'Extra Tuition Query', message: 'Is there any after-school Chemistry tutoring available before the GCSE mock?' }
      ]
    },
    // 5. Beaconhouse Dubai (AE)"""
    s4_inv_new = """      parentMessages: [
        { id: '1', parent: 'Mrs. Harrison (George\\'s Mother)', date: '2026-06-10', subject: 'Extra Tuition Query', message: 'Is there any after-school Chemistry tutoring available before the GCSE mock?' }
      ],
      inventory: [
        { id: 'inv-1', name: 'Apple iMac 27" (Staff)', category: 'IT Equipment', location: 'Staff Room', qty: '15 Good', value: '£22,500' },
        { id: 'inv-2', name: 'Chromebooks (Student)', category: 'IT Equipment', location: 'Computer Suite', qty: '60 Good', value: '£36,000' },
        { id: 'inv-3', name: 'Interactive SMART Boards 75"', category: 'Electronics', location: 'All Classrooms', qty: '18 Good', value: '£54,000' },
        { id: 'inv-4', name: 'Student Tables & Chairs', category: 'School Furniture', location: 'All Classrooms', qty: '400 Sets Good', value: '£40,000' },
        { id: 'inv-5', name: 'Chemistry Lab Equipment Set', category: 'Lab Supplies', location: 'Chem Lab', qty: '30 Sets Good', value: '£9,000' },
        { id: 'inv-6', name: 'Library Book Stock (GCSE)', category: 'Other', location: 'Main Library', qty: '2,800 Books Good', value: '£14,000' },
        { id: 'inv-7', name: 'Sports Hall Equipment', category: 'Sports Equipment', location: 'Sports Hall', qty: '1 Full Set Good', value: '£5,500' },
        { id: 'inv-8', name: 'Network Servers (Dell)', category: 'IT Equipment', location: 'Server Room', qty: '2 Good', value: '£8,000' },
        { id: 'inv-9', name: 'Outdoor Play Equipment', category: 'Play Area Things', location: 'Junior Playground', qty: '1 Set Good', value: '£3,200' },
        { id: 'inv-10', name: 'Fire Safety Equipment', category: 'Other', location: 'All Floors', qty: '30 Units Good', value: '£2,400' },
        { id: 'inv-11', name: 'Projector Screens', category: 'Electronics', location: 'Lecture Halls', qty: '4 Good', value: '£1,600' },
        { id: 'inv-12', name: 'Student Lockers', category: 'School Furniture', location: 'Corridors', qty: '200 Good', value: '£6,000' }
      ]
    },
    // 5. Beaconhouse Dubai (AE)"""
    if s4_inv_patch in content:
        content = content.replace(s4_inv_patch, s4_inv_new)
        print("School 4 inventory seeded.")

    # School 5 - Beaconhouse Dubai
    s5_inv_patch = """      parentMessages: [
        { id: '1', parent: 'Mr. Al-Mansoori (Omar\\'s Father)', date: '2026-06-11', subject: 'Attendance Clarification', message: 'My son was present but marked absent on June 7th. Please correct the record.' }
      ]
    },
    // 6. International Grammar School (SA)"""
    s5_inv_new = """      parentMessages: [
        { id: '1', parent: 'Mr. Al-Mansoori (Omar\\'s Father)', date: '2026-06-11', subject: 'Attendance Clarification', message: 'My son was present but marked absent on June 7th. Please correct the record.' }
      ],
      inventory: [
        { id: 'inv-1', name: 'HP EliteBook Laptops (Teacher)', category: 'IT Equipment', location: 'All Classrooms', qty: '20 Good', value: 'AED 140,000' },
        { id: 'inv-2', name: 'iPad Air (Student Tablets)', category: 'IT Equipment', location: 'Computer Lab', qty: '80 Good', value: 'AED 240,000' },
        { id: 'inv-3', name: 'A/C Split Units (Samsung)', category: 'Electronics', location: 'All Rooms', qty: '40 Good', value: 'AED 200,000' },
        { id: 'inv-4', name: 'Smart Boards (Promethean)', category: 'Electronics', location: 'All Classrooms', qty: '20 Good', value: 'AED 300,000' },
        { id: 'inv-5', name: 'Ergonomic Student Desks', category: 'School Furniture', location: 'All Classrooms', qty: '350 Good', value: 'AED 175,000' },
        { id: 'inv-6', name: 'Physics & Chemistry Lab Kits', category: 'Lab Supplies', location: 'Science Labs 1 & 2', qty: '40 Sets Good', value: 'AED 60,000' },
        { id: 'inv-7', name: 'Indoor Sports Equipment', category: 'Sports Equipment', location: 'Sports Hall', qty: '1 Full Set Good', value: 'AED 25,000' },
        { id: 'inv-8', name: 'Arabic Language Textbooks', category: 'Other', location: 'Library', qty: '600 Books Good', value: 'AED 18,000' },
        { id: 'inv-9', name: 'CCTV System 4K', category: 'Electronics', location: 'Campus-Wide', qty: '32 Cameras Good', value: 'AED 48,000' },
        { id: 'inv-10', name: 'Water Fountain Stations', category: 'Other', location: 'All Floors', qty: '10 Good', value: 'AED 15,000' },
        { id: 'inv-11', name: 'Outdoor Play Sets (Shaded)', category: 'Play Area Things', location: 'Junior Yard', qty: '2 Sets Good', value: 'AED 30,000' }
      ]
    },
    // 6. International Grammar School (SA)"""
    if s5_inv_patch in content:
        content = content.replace(s5_inv_patch, s5_inv_new)
        print("School 5 inventory seeded.")

    # School 6 - International Grammar School (SA)
    s6_inv_patch = """      parentMessages: []
    },
    // 7. Roots International (CA)"""
    s6_inv_new = """      parentMessages: [],
      inventory: [
        { id: 'inv-1', name: 'Lenovo ThinkPad Laptops', category: 'IT Equipment', location: 'Computer Lab', qty: '50 Good', value: 'SAR 375,000' },
        { id: 'inv-2', name: 'Smart Boards (75")', category: 'Electronics', location: 'All Classrooms', qty: '22 Good', value: 'SAR 330,000' },
        { id: 'inv-3', name: 'Quran Study Desks', category: 'School Furniture', location: 'Islamic Studies Room', qty: '60 Good', value: 'SAR 30,000' },
        { id: 'inv-4', name: 'Student Chairs (Padded)', category: 'School Furniture', location: 'All Classrooms', qty: '420 Good', value: 'SAR 210,000' },
        { id: 'inv-5', name: 'Islamic Books & References', category: 'Other', location: 'Library', qty: '1,200 Books Good', value: 'SAR 60,000' },
        { id: 'inv-6', name: 'Biology Lab Microscopes', category: 'Lab Supplies', location: 'Bio Lab', qty: '30 Good', value: 'SAR 45,000' },
        { id: 'inv-7', name: 'AC Split Inverter Units', category: 'Electronics', location: 'All Rooms', qty: '50 Good', value: 'SAR 250,000' },
        { id: 'inv-8', name: 'Prayer Mats & Qibla Boards', category: 'Other', location: 'Prayer Hall', qty: '200 Good', value: 'SAR 10,000' },
        { id: 'inv-9', name: 'Football & Basketball Set', category: 'Sports Equipment', location: 'Sports Area', qty: '20 Good', value: 'SAR 15,000' },
        { id: 'inv-10', name: 'Fire Extinguishers (CO2)', category: 'Other', location: 'All Floors', qty: '24 Good', value: 'SAR 12,000' },
        { id: 'inv-11', name: 'UPS Systems (APC)', category: 'Electronics', location: 'Server Room', qty: '6 Good', value: 'SAR 24,000' }
      ]
    },
    // 7. Roots International (CA)"""
    if s6_inv_patch in content:
        content = content.replace(s6_inv_patch, s6_inv_new)
        print("School 6 inventory seeded.")

    # School 7 - Roots International (CA)
    s7_inv_patch = """      parentMessages: [
        { id: '1', parent: 'Mr. Miller (Jack\\'s Father)', date: '2026-06-12', subject: 'Bus Route Change', message: 'We have moved houses. Can you please update Jack\\'s bus route to School Bus B?' }
      ]
    },
    // 8. Allied School Campus A (US)"""
    s7_inv_new = """      parentMessages: [
        { id: '1', parent: 'Mr. Miller (Jack\\'s Father)', date: '2026-06-12', subject: 'Bus Route Change', message: 'We have moved houses. Can you please update Jack\\'s bus route to School Bus B?' }
      ],
      inventory: [
        { id: 'inv-1', name: 'Dell Precision Workstations', category: 'IT Equipment', location: 'Computer Lab', qty: '40 Good', value: 'CAD 120,000' },
        { id: 'inv-2', name: 'SMART Board 6000 Series', category: 'Electronics', location: 'All Classrooms', qty: '16 Good', value: 'CAD 96,000' },
        { id: 'inv-3', name: 'Student Desks & Chairs (IKEA)', category: 'School Furniture', location: 'All Classrooms', qty: '350 Sets Good', value: 'CAD 70,000' },
        { id: 'inv-4', name: 'Chemistry Lab Equipment', category: 'Lab Supplies', location: 'Chem Lab', qty: '25 Sets Good', value: 'CAD 12,500' },
        { id: 'inv-5', name: 'French / English Textbooks', category: 'Other', location: 'Library', qty: '2,000 Books Good', value: 'CAD 20,000' },
        { id: 'inv-6', name: 'Hockey Sticks & Pucks', category: 'Sports Equipment', location: 'Sports Room', qty: '30 Sets Good', value: 'CAD 4,500' },
        { id: 'inv-7', name: 'Outdoor Climbing Frames', category: 'Play Area Things', location: 'Junior Yard', qty: '2 Sets Good', value: 'CAD 8,000' },
        { id: 'inv-8', name: 'Gymnasium Mats & Equipment', category: 'Sports Equipment', location: 'Gym', qty: '1 Full Set Good', value: 'CAD 15,000' },
        { id: 'inv-9', name: 'Network Access Points (Wi-Fi)', category: 'IT Equipment', location: 'Campus-Wide', qty: '20 Good', value: 'CAD 10,000' },
        { id: 'inv-10', name: 'Staff Photocopiers', category: 'IT Equipment', location: 'Admin Office', qty: '3 Good', value: 'CAD 7,500' }
      ]
    },
    // 8. Allied School Campus A (US)"""
    if s7_inv_patch in content:
        content = content.replace(s7_inv_patch, s7_inv_new)
        print("School 7 inventory seeded.")

    # School 8 - Allied School (US)
    s8_inv_patch = """      parentMessages: [
        { id: '1', parent: 'Mr. Doe (John\\'s Father)', date: '2026-06-10', subject: 'Grade Inquiry', message: 'Can we schedule a meeting to discuss John\\'s performance in the upcoming finals?' }
      ]
    }
  };"""
    s8_inv_new = """      parentMessages: [
        { id: '1', parent: 'Mr. Doe (John\\'s Father)', date: '2026-06-10', subject: 'Grade Inquiry', message: 'Can we schedule a meeting to discuss John\\'s performance in the upcoming finals?' }
      ],
      inventory: [
        { id: 'inv-1', name: 'MacBook Pro 14" (Teacher)', category: 'IT Equipment', location: 'All Classrooms', qty: '22 Good', value: '$49,500' },
        { id: 'inv-2', name: 'Google Chromebook (Student)', category: 'IT Equipment', location: 'Computer Lab', qty: '75 Good', value: '$52,500' },
        { id: 'inv-3', name: 'Epson Projectors (4K)', category: 'Electronics', location: 'All Classrooms', qty: '22 Good', value: '$33,000' },
        { id: 'inv-4', name: 'Cafeteria Tables & Benches', category: 'School Furniture', location: 'Cafeteria', qty: '30 Good', value: '$9,000' },
        { id: 'inv-5', name: 'Physics Lab Equipment', category: 'Lab Supplies', location: 'Physics Lab', qty: '30 Sets Good', value: '$15,000' },
        { id: 'inv-6', name: 'AP Chemistry Reagent Kits', category: 'Lab Supplies', location: 'Chem Lab', qty: '20 Kits Low Stock', value: '$4,000' },
        { id: 'inv-7', name: 'American Football Gear Sets', category: 'Sports Equipment', location: 'Sports Room', qty: '25 Sets Good', value: '$7,500' },
        { id: 'inv-8', name: 'Basketball Hoops & Balls', category: 'Sports Equipment', location: 'Gymnasium', qty: '4 Hoops + 20 Balls Good', value: '$3,200' },
        { id: 'inv-9', name: 'Student Lockers (Metal)', category: 'School Furniture', location: 'Hallways', qty: '300 Good', value: '$15,000' },
        { id: 'inv-10', name: 'AED Defibrillators', category: 'Other', location: 'Admin Office & Gym', qty: '3 Good', value: '$4,500' },
        { id: 'inv-11', name: 'Library Reference Books', category: 'Other', location: 'Main Library', qty: '3,200 Books Good', value: '$32,000' },
        { id: 'inv-12', name: 'Server Rack & UPS', category: 'IT Equipment', location: 'Server Room', qty: '1 Rack Good', value: '$8,000' }
      ]
    }
  };"""
    if s8_inv_patch in content:
        content = content.replace(s8_inv_patch, s8_inv_new)
        print("School 8 inventory seeded.")

    # -----------------------------------------------------------------------
    # 5. Update the inventory UI to use schoolDb.inventory + add Edit/Delete
    # -----------------------------------------------------------------------
    old_inv_ui_map = """                  <div className="border border-border rounded-xl bg-card overflow-hidden">
                    <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                          <th className="p-3">Item Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Qty / Status</th>
                          <th className="p-3 text-right">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground/85">
                        {inventoryItems.map(item => (
                          <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-3 font-bold text-primary">{item.name}</td>
                            <td className="p-3 font-medium">{item.category}</td>
                            <td className="p-3 text-foreground/70">{item.location}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded border font-bold text-[10px] ${
                                item.qty.toLowerCase().includes('low') 
                                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              }`}>
                                {item.qty}
                              </span>
                            </td>
                            <td className="p-3 text-right font-mono text-foreground/60">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table></div>
                  </div>"""

    new_inv_ui_map = """                  {/* Edit Row Modal */}
                  {editingInventoryId && editInventoryForm && (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3 mb-4 animate-fadeIn shadow-md">
                      <span className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">Edit Asset Record</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <input value={editInventoryForm.name} onChange={e => setEditInventoryForm({...editInventoryForm, name: e.target.value})} placeholder="Item Name" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                        <select value={editInventoryForm.category} onChange={e => setEditInventoryForm({...editInventoryForm, category: e.target.value})} className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground font-semibold">
                          <option value="School Furniture">School Furniture</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Play Area Things">Play Area Things</option>
                          <option value="IT Equipment">IT Equipment</option>
                          <option value="Lab Supplies">Lab Supplies</option>
                          <option value="Stationary">Stationary</option>
                          <option value="Sports Equipment">Sports Equipment</option>
                          <option value="Other">Other</option>
                        </select>
                        <input value={editInventoryForm.location} onChange={e => setEditInventoryForm({...editInventoryForm, location: e.target.value})} placeholder="Location" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                        <input value={editInventoryForm.qty} onChange={e => setEditInventoryForm({...editInventoryForm, qty: e.target.value})} placeholder="Qty & Status (e.g. 10 Good)" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                        <input value={editInventoryForm.value} onChange={e => setEditInventoryForm({...editInventoryForm, value: e.target.value})} placeholder="Value (e.g. Rs. 50,000)" className="bg-muted/50 border border-border rounded-lg text-xs p-2 text-foreground" />
                      </div>
                      <div className="flex gap-2 justify-end pt-1">
                        <button onClick={() => { setEditingInventoryId(null); setEditInventoryForm(null); }} className="px-4 py-1.5 bg-muted hover:bg-border text-foreground text-xs font-bold rounded-lg">Cancel</button>
                        <button onClick={() => {
                          setInventory((prev: any[]) => prev.map(i => i.id === editingInventoryId ? { ...i, ...editInventoryForm } : i));
                          setEditingInventoryId(null); setEditInventoryForm(null);
                        }} className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-lg">Save Changes</button>
                      </div>
                    </div>
                  )}
                  <div className="border border-border rounded-xl bg-card overflow-hidden">
                    <div className="w-full overflow-x-auto pb-2"><table className="w-full text-left border-collapse text-xs min-w-[700px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
                          <th className="p-3">Item Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Qty / Status</th>
                          <th className="p-3 text-right">Value</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground/85">
                        {(schoolDb.inventory || []).map((item: any) => (
                          <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-3 font-bold text-primary">{item.name}</td>
                            <td className="p-3 font-medium">{item.category}</td>
                            <td className="p-3 text-foreground/70">{item.location}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded border font-bold text-[10px] ${
                                item.qty.toLowerCase().includes('low') 
                                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              }`}>
                                {item.qty}
                              </span>
                            </td>
                            <td className="p-3 text-right font-mono text-foreground/60">{item.value}</td>
                            <td className="p-3 text-right">
                              <div className="flex gap-1.5 justify-end">
                                <button onClick={() => { setEditingInventoryId(item.id); setEditInventoryForm({name: item.name, category: item.category, location: item.location, qty: item.qty, value: item.value}); }} className="px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold rounded-lg border border-primary/20 transition-colors">Edit</button>
                                <button onClick={() => { if(window.confirm('Delete this asset?')) setInventory((prev: any[]) => prev.filter(i => i.id !== item.id)); }} className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded-lg border border-rose-500/20 transition-colors">Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {(schoolDb.inventory || []).length === 0 && (
                          <tr><td colSpan={6} className="p-8 text-center text-foreground/40 text-xs">No assets registered. Click "Add Asset" to get started.</td></tr>
                        )}
                      </tbody>
                    </table></div>
                  </div>"""

    if old_inv_ui_map in content:
        content = content.replace(old_inv_ui_map, new_inv_ui_map)
        print("Inventory UI updated with Edit/Delete.")

    # -----------------------------------------------------------------------
    # 6. Update the "Add Asset" form to use setInventory (school-aware)
    # -----------------------------------------------------------------------
    old_add_form_submit = """                      setInventoryItems([{
                        id: Date.now().toString(),
                        name: form.itemName.value,
                        category: form.itemCategory.value,
                        location: form.itemLocation.value,
                        qty: form.itemQty.value,
                        value: form.itemValue.value
                      }, ...inventoryItems]);
                      setShowAddInventory(false);
                      form.reset();"""
    new_add_form_submit = """                      setInventory((prev: any[]) => [{
                        id: Date.now().toString(),
                        name: form.itemName.value,
                        category: form.itemCategory.value,
                        location: form.itemLocation.value,
                        qty: form.itemQty.value,
                        value: form.itemValue.value
                      }, ...prev]);
                      setShowAddInventory(false);
                      form.reset();"""
    if old_add_form_submit in content:
        content = content.replace(old_add_form_submit, new_add_form_submit)
        print("Add Asset form updated to use school-aware setInventory.")

    # -----------------------------------------------------------------------
    # 7. Also add inventory to the new-school seed block
    # -----------------------------------------------------------------------
    old_seed_teachers = """            teachers: [
              { id: '1', name: 'Dr. Sajid Malik', subject: 'General Science', className: 'Class 10-A', status: 'Active' },
              { id: '2', name: 'Mrs. Huma Shah', subject: 'Mathematics', className: 'Class 9-A', status: 'Active', salary: '55000', qualification: 'B.Sc. Mathematics', phone: '+92 300 9999999', email: 'huma.s@school.edu' }
            ],"""
    new_seed_teachers = """            teachers: [
              { id: '1', name: 'Dr. Sajid Malik', subject: 'General Science', className: 'Class 10-A', status: 'Active', salary: '70000', qualification: 'M.Sc. General Science', phone: '+92 300 0000001', email: 'sajid.m@school.edu' },
              { id: '2', name: 'Mrs. Huma Shah', subject: 'Mathematics', className: 'Class 9-A', status: 'Active', salary: '55000', qualification: 'B.Sc. Mathematics', phone: '+92 300 9999999', email: 'huma.s@school.edu' }
            ],
            inventory: [
              { id: 'inv-1', name: 'Student Desks & Chairs', category: 'School Furniture', location: 'All Classrooms', qty: '120 Good', value: 'Rs. 600,000' },
              { id: 'inv-2', name: 'Desktop PCs', category: 'IT Equipment', location: 'Computer Lab', qty: '20 Good', value: 'Rs. 1,000,000' },
              { id: 'inv-3', name: 'Whiteboard & Markers', category: 'Electronics', location: 'All Classrooms', qty: '12 Good', value: 'Rs. 36,000' },
              { id: 'inv-4', name: 'Science Lab Equipment', category: 'Lab Supplies', location: 'Science Lab', qty: '15 Sets Good', value: 'Rs. 75,000' },
              { id: 'inv-5', name: 'Sports Equipment Set', category: 'Sports Equipment', location: 'Ground', qty: '1 Set Good', value: 'Rs. 30,000' }
            ],"""
    if old_seed_teachers in content:
        content = content.replace(old_seed_teachers, new_seed_teachers)
        print("New school seed teachers updated with inventory.")

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("ALL DONE! Inventory fully set up.")

if __name__ == '__main__':
    main()
