import re
import random

def generate_students():
    classes = ['Class 10-A', 'Class 10-B', 'Class 9-A', 'Class 9-B', 'Class 8-A', 'Class 8-B', 'Class 7-A', 'Class 7-B']
    
    first_names_pk = ["Ali", "Ahmad", "Fatima", "Ayesha", "Muhammad", "Zainab", "Omar", "Hassan", "Bilal", "Sana", "Mariam", "Hamza", "Usman", "Saad", "Khadija"]
    last_names_pk = ["Khan", "Ahmed", "Ali", "Syed", "Raza", "Hussain", "Tariq", "Malik", "Sheikh", "Qureshi"]
    
    first_names_en = ["James", "Emma", "Liam", "Olivia", "Noah", "Ava", "Oliver", "Isabella", "Elijah", "Sophia", "William", "Mia", "Benjamin", "Charlotte", "Lucas"]
    last_names_en = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
    
    first_names_ar = ["Mohammed", "Ahmed", "Mahmoud", "Mustafa", "Youssef", "Fatima", "Aisha", "Khadija", "Mariam", "Zainab", "Ali", "Hassan", "Hussein", "Ibrahim", "Ismail"]
    last_names_ar = ["Al-Fayed", "Al-Saud", "Al-Hashimi", "Al-Otaibi", "Al-Rashid", "Al-Maktoum", "Al-Nahyan", "Al-Sabah", "Al-Thani", "Al-Khalifa"]

    campus_configs = [
        # Main Campus (PK)
        ("11111111-1111-1111-1111-111111111111", first_names_pk, last_names_pk, 100),
        # UK Campus (EN)
        ("22222222-2222-2222-2222-222222222222", first_names_en, last_names_en, 200),
        # UAE Campus (AR)
        ("33333333-3333-3333-3333-333333333333", first_names_ar, last_names_ar, 300),
        # KSA Campus (AR)
        ("44444444-4444-4444-4444-444444444444", first_names_ar, last_names_ar, 400),
        # CA Campus (EN)
        ("55555555-5555-5555-5555-555555555555", first_names_en, last_names_en, 500)
    ]

    replacements = {}
    
    for campus_id, fn, ln, base_roll in campus_configs:
        students = []
        id_counter = 1
        for cls in classes:
            num_students = random.randint(6, 9)
            for _ in range(num_students):
                name = f"{random.choice(fn)} {random.choice(ln)}"
                roll = str(base_roll + id_counter)
                status = random.choices(['Present', 'Absent', 'Late'], weights=[85, 10, 5])[0]
                transport = random.choices(['None', 'Route A', 'Route B', 'School Bus 1'], weights=[50, 20, 20, 10])[0]
                hostel = random.choices(['Day Scholar', 'Room 101', 'Room 205', 'Dorm A'], weights=[80, 5, 5, 10])[0]
                books = random.choices([[], ['Science Grade ' + cls.split('-')[0].replace('Class ', '')], ['History']], weights=[70, 15, 15])[0]
                
                books_str = str(books).replace("'", '"')
                students.append(f"        {{ id: '{id_counter}', name: '{name}', roll: '{roll}', className: '{cls}', status: '{status}', borrowedBooks: {books_str}, bookedTransport: '{transport}', hostelStatus: '{hostel}' }}")
                id_counter += 1
                
        students_str = ",\n".join(students)
        replacements[campus_id] = f"      students: [\n{students_str}\n      ],\n      teachers:"

    return replacements

def update_file():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Dynamic student count in Feature Details
    content = re.sub(
        r"const getFeatureDetails = \(featureName: string\) => \{",
        r"const getFeatureDetails = (featureName: string, studentCount?: number) => {",
        content
    )
    
    content = re.sub(
        r"stats: '480 Enrolled'",
        r"stats: `${studentCount || 0} Enrolled`",
        content
    )
    
    content = re.sub(
        r"const details = getFeatureDetails\(feature\);",
        r"const details = getFeatureDetails(feature, database[currentSchool?.schoolId || '']?.students?.length || 0);",
        content
    )

    replacements = generate_students()
    
    for campus_id, new_students_block in replacements.items():
        parts = content.split(f"'{campus_id}': {{")
        if len(parts) == 2:
            # Safer regex: match everything from 'students: [' to the next 'teachers:'
            sub_parts = re.split(r'students:\s*\[.*?\],\s*teachers:', parts[1], maxsplit=1, flags=re.DOTALL)
            if len(sub_parts) == 2:
                content = parts[0] + f"'{campus_id}': {{" + sub_parts[0] + new_students_block + sub_parts[1]
                
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Students expanded and feature details made dynamic.")

if __name__ == '__main__':
    update_file()
