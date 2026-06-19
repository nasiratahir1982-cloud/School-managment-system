import re

def patch_student_dashboard_calendar():
    path = 'frontend/src/pages/student-portal/StudentDashboard.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add Import
    import_addition = "import { useQueryStore } from '../../store/queryStore';\nimport AcademicCalendar from '../AcademicCalendar';"
    content = content.replace("import { useQueryStore } from '../../store/queryStore';", import_addition)

    # 2. Insert Component at the bottom of the left column
    old_section_end = "            </div>\n          </div>\n\n          {/* Side Info Panel */}"
    
    new_calendar_section = """            </div>

            {/* Academic Calendar */}
            <div className="glass-card p-6 rounded-xl border border-slate-800">
              <AcademicCalendar editable={false} compact={true} />
            </div>
          </div>

          {/* Side Info Panel */}"""
          
    content = content.replace(old_section_end, new_calendar_section)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("StudentDashboard patched successfully.")

if __name__ == '__main__':
    patch_student_dashboard_calendar()
