import re

def patch_academic_calendar():
    path = 'frontend/src/pages/AcademicCalendar.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add Imports
    import_addition = "import * as XLSX from 'xlsx';\nimport html2pdf from 'html2pdf.js';\n"
    content = content.replace("import { CalendarDays, Plus, Edit3, Trash2, X, Check, Clock } from 'lucide-react';", 
                              "import { CalendarDays, Plus, Edit3, Trash2, X, Check, Clock } from 'lucide-react';\n" + import_addition)

    # 2. Update exportToExcel
    old_export_excel_start = "  const exportToExcel = () => {"
    old_export_excel_end = "a.click();\n  };"
    
    old_export_block = re.search(r'const exportToExcel = \(\) => \{.*?a\.click\(\);\n  \};', content, re.DOTALL)
    
    new_export_excel = """const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // 1. Term Dates Sheet
    const termData = termDates.map(t => ({
      'Term Name': t.term,
      'Start Date': t.start,
      'End Date': t.end,
      'Status': t.status
    }));
    const wsTerms = XLSX.utils.json_to_sheet(termData);
    XLSX.utils.book_append_sheet(wb, wsTerms, "Term Dates");

    // 2. INSET Days Sheet
    const insetData = insetDays.map(d => ({
      'Date': d.date,
      'Title': d.title,
      'Type': 'Staff Only / No Students'
    }));
    const wsInset = XLSX.utils.json_to_sheet(insetData);
    XLSX.utils.book_append_sheet(wb, wsInset, "INSET Days");

    // 3. Academic Events
    const eventsData = academicEvents.map(e => ({
      'Date': e.date,
      'Event': e.title
    }));
    const wsEvents = XLSX.utils.json_to_sheet(eventsData);
    XLSX.utils.book_append_sheet(wb, wsEvents, "Academic Events");

    // 4. Public Holidays
    const holidaysData = schoolHolidays.map(h => ({
      'Date': h,
      'Type': 'Public/National Holiday'
    }));
    const wsHolidays = XLSX.utils.json_to_sheet(holidaysData);
    XLSX.utils.book_append_sheet(wb, wsHolidays, "Public Holidays");

    // 5. Full Year Grid Snapshot
    const yearData: any[] = [];
    academicYearMonths.forEach(({year, month}) => {
      const daysInMonth = getDaysInMonth(year, month);
      for(let d=1; d<=daysInMonth; d++) {
        const dateStr = formatDateStr(year, month, d);
        let type = 'Regular';
        let details = '';
        if(isBlockedDate(dateStr)) {
          type = isWeekend(dateStr) ? 'Weekend' : isHolidayDate(dateStr) ? 'Public Holiday' : isInTermBreak(dateStr) ? 'Term Break' : 'Blocked';
        } else if (isInsetDay(dateStr)) {
          type = 'INSET Day';
          details = getInsetDay(dateStr)?.title || '';
        } else {
           const evs = getEventsForDate(dateStr);
           if(evs.length > 0) {
              type = 'Event';
              details = evs.map(e => e.title).join('; ');
           }
        }
        if (type !== 'Regular' || details !== '') {
            yearData.push({
              'Date': dateStr,
              'Day': new Date(year, month, d).toLocaleDateString('en-GB', {weekday:'short'}),
              'Type': type,
              'Details': details
            });
        }
      }
    });
    const wsYear = XLSX.utils.json_to_sheet(yearData);
    XLSX.utils.book_append_sheet(wb, wsYear, "Full Year Summary");

    // Download
    XLSX.writeFile(wb, `Academic_Calendar_${startYear}_${MONTH_NAMES[startMonth]}.xlsx`);
  };"""

    if old_export_block:
        content = content.replace(old_export_block.group(0), new_export_excel)

    # 3. Add Export PDF Logic
    old_pdf_button = "onClick={() => alert('Full academic calendar exported to PDF!')}"
    new_pdf_button = """onClick={() => {
              const element = document.getElementById('calendar-export-area');
              if(element) {
                const opt = {
                  margin: 0.5,
                  filename: `Academic_Calendar_${startYear}.pdf`,
                  image: { type: 'jpeg', quality: 0.98 },
                  html2canvas: { scale: 2, useCORS: true },
                  jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
                };
                html2pdf().set(opt).from(element).save();
              }
            }}"""
    content = content.replace(old_pdf_button, new_pdf_button)

    # 4. Wrap Calendar Area with ID
    old_calendar_tab = "{activeTab === 'calendar' && (\n          <div className=\"space-y-4\">"
    new_calendar_tab = "{activeTab === 'calendar' && (\n          <div className=\"space-y-4\" id=\"calendar-export-area\">"
    content = content.replace(old_calendar_tab, new_calendar_tab)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("AcademicCalendar exports patched successfully.")

if __name__ == '__main__':
    patch_academic_calendar()
