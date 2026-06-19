import re

def patch_academic_calendar():
    path = 'frontend/src/pages/AcademicCalendar.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Click Logic
    content = content.replace("onClick={() => !blocked && setSelectedDate(dateStr)}", "onClick={() => (editable || !blocked) && setSelectedDate(dateStr)}")

    # 2. Add Quick State
    old_state = "const [activeTab, setActiveTab] = useState<'calendar' | 'terms' | 'inset' | 'events' | 'holidays'>('calendar');"
    new_state = """const [activeTab, setActiveTab] = useState<'calendar' | 'terms' | 'inset' | 'events' | 'holidays'>('calendar');
  const [quickType, setQuickType] = useState('Event');
  const [quickTitle, setQuickTitle] = useState('');"""
    content = content.replace(old_state, new_state)

    # 3. Add Quick Form to detail panel
    old_panel_end = """        {!blocked && events.length === 0 && !insetDay && (
          <p className="text-[10px] text-muted-foreground italic">No events or INSET days on this date.</p>
        )}
      </div>"""

    quick_form = """        {!blocked && events.length === 0 && !insetDay && (
          <p className="text-[10px] text-muted-foreground italic">No events or INSET days on this date.</p>
        )}

        {editable && (
          <div className="pt-3 border-t border-border/50 space-y-2">
            <span className="text-[10px] font-bold text-foreground/80 uppercase tracking-wider block">Quick Add to this Date</span>
            <div className="flex gap-2">
              <select value={quickType} onChange={e => setQuickType(e.target.value)} className="bg-muted/50 border border-border rounded text-[10px] p-1.5 text-foreground w-1/3">
                <option value="Event">Event</option>
                <option value="INSET Day">INSET Day</option>
                <option value="National Holiday">National Holiday</option>
                <option value="Religious Holiday">Religious Holiday</option>
              </select>
              {quickType !== 'National Holiday' && quickType !== 'Religious Holiday' && (
                <input value={quickTitle} onChange={e => setQuickTitle(e.target.value)} placeholder="Title (e.g. Science Fair)" className="bg-muted/50 border border-border rounded text-[10px] p-1.5 text-foreground flex-1 min-w-0" />
              )}
              <button onClick={() => {
                if (quickType === 'Event' && quickTitle) {
                  addAcademicEvent({ id: 'ev'+Date.now(), date: selectedDate, title: quickTitle, color: 'bg-blue-500' });
                } else if (quickType === 'INSET Day' && quickTitle) {
                  addInsetDay({ id: 'i'+Date.now(), date: selectedDate, title: quickTitle, editable: true });
                } else if (quickType === 'National Holiday') {
                  addSchoolHoliday(selectedDate);
                } else if (quickType === 'Religious Holiday') {
                  // Hack: saving religious holiday as a purple event
                  addAcademicEvent({ id: 'ev'+Date.now(), date: selectedDate, title: quickTitle || 'Religious Holiday', color: 'bg-purple-500' });
                }
                setQuickTitle('');
              }} className="px-2 py-1.5 bg-primary text-white text-[10px] font-bold rounded hover:bg-primary/90 transition-all">
                Add
              </button>
            </div>
          </div>
        )}
      </div>"""

    content = content.replace(old_panel_end, quick_form)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("AcademicCalendar patched successfully.")

if __name__ == '__main__':
    patch_academic_calendar()
