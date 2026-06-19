import re

def patch_academic_calendar():
    path = 'frontend/src/pages/AcademicCalendar.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add new state for quickEditDate
    state_anchor = "  const [selectedDate, setSelectedDate] = useState<string | null>(null);"
    new_state = "  const [selectedDate, setSelectedDate] = useState<string | null>(null);\n  const [quickEditDate, setQuickEditDate] = useState<string | null>(null);\n  const [quickEditType, setQuickEditType] = useState<'holiday' | 'inset' | 'event'>('event');\n  const [quickEditTitle, setQuickEditTitle] = useState('');\n  const [quickEditColor, setQuickEditColor] = useState('bg-blue-500');"
    content = content.replace(state_anchor, new_state)

    # 2. Extract needed functions from useCalendarStore
    store_anchor = "getInsetDay, getEventsForDate, getTermForDate"
    new_store_anchor = "getInsetDay, getEventsForDate, getTermForDate,\n    addSchoolHoliday, removeSchoolHoliday, addInsetDay, addAcademicEvent"
    content = content.replace(store_anchor, new_store_anchor)

    # 3. Modify cell onClick
    old_onclick = "onClick={() => (editable || !blocked) && setSelectedDate(dateStr)}"
    new_onclick = "onClick={() => { setSelectedDate(dateStr); if(editable) { setQuickEditDate(dateStr); setQuickEditType('event'); setQuickEditTitle(''); } }}"
    content = content.replace(old_onclick, new_onclick)

    # 4. Add the QuickEditModal UI at the bottom before final closing div
    # Find the end of the return statement
    old_end = "      {/* Hidden iframe for printing PDF */}\n      <iframe id=\"print-frame\" style={{ display: 'none' }} title=\"Print Frame\" />\n    </div>\n  );\n}"
    
    quick_edit_modal = """      {/* Quick Edit Modal */}
      {quickEditDate && editable && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-sm rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <div>
                <h3 className="font-bold text-foreground">Manage Date</h3>
                <p className="text-xs text-muted-foreground font-mono">{quickEditDate}</p>
              </div>
              <button onClick={() => setQuickEditDate(null)} className="p-1 hover:bg-muted rounded text-muted-foreground"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex bg-muted/30 rounded-lg p-1 gap-1">
                <button onClick={() => setQuickEditType('event')} className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${quickEditType === 'event' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:bg-muted'}`}>Event</button>
                <button onClick={() => setQuickEditType('inset')} className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${quickEditType === 'inset' ? 'bg-amber-500 text-white shadow' : 'text-muted-foreground hover:bg-muted'}`}>INSET Day</button>
                <button onClick={() => setQuickEditType('holiday')} className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${quickEditType === 'holiday' ? 'bg-rose-500 text-white shadow' : 'text-muted-foreground hover:bg-muted'}`}>Holiday</button>
              </div>

              {quickEditType === 'holiday' && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Mark this date as a National or Religious Holiday. This will block the date for students.</p>
                  <div className="flex gap-2">
                    {isHolidayDate(quickEditDate) ? (
                      <button onClick={() => { removeSchoolHoliday(quickEditDate); setQuickEditDate(null); }} className="flex-1 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 py-2 rounded-lg text-sm font-bold transition-all">Remove Holiday</button>
                    ) : (
                      <button onClick={() => { addSchoolHoliday(quickEditDate); setQuickEditDate(null); }} className="flex-1 bg-rose-500 text-white hover:bg-rose-600 py-2 rounded-lg text-sm font-bold transition-all">Set as Holiday</button>
                    )}
                  </div>
                </div>
              )}

              {quickEditType === 'inset' && (
                <div className="space-y-3">
                  <input type="text" placeholder="INSET Day Title (e.g. Staff Training)" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" value={quickEditTitle} onChange={e => setQuickEditTitle(e.target.value)} />
                  <button onClick={() => { if(quickEditTitle){ addInsetDay({ id: 'i'+Date.now(), date: quickEditDate, title: quickEditTitle, editable: true }); setQuickEditDate(null); } }} className="w-full bg-amber-500 text-white hover:bg-amber-600 py-2 rounded-lg text-sm font-bold transition-all">Add INSET Day</button>
                </div>
              )}

              {quickEditType === 'event' && (
                <div className="space-y-3">
                  <input type="text" placeholder="Event Title (e.g. Sports Day)" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" value={quickEditTitle} onChange={e => setQuickEditTitle(e.target.value)} />
                  <div className="flex gap-2 flex-wrap justify-center py-2">
                    {Object.keys(EVENT_DOT_COLORS).map(c => (
                      <button key={c} onClick={() => setQuickEditColor(c)} className={`w-6 h-6 rounded-full border-2 transition-all ${quickEditColor === c ? 'border-foreground scale-110' : 'border-transparent hover:scale-110'}`} style={{ backgroundColor: EVENT_DOT_COLORS[c] }} />
                    ))}
                  </div>
                  <button onClick={() => { if(quickEditTitle){ addAcademicEvent({ id: 'e'+Date.now(), date: quickEditDate, title: quickEditTitle, color: quickEditColor }); setQuickEditDate(null); } }} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-lg text-sm font-bold transition-all">Add Event</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
"""
    
    if old_end in content:
        content = content.replace(old_end, quick_edit_modal + old_end)
    else:
        # Fallback if iframe is removed
        content = content.replace("    </div>\n  );\n}", quick_edit_modal + "    </div>\n  );\n}")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("QuickEditModal added.")

if __name__ == '__main__':
    patch_academic_calendar()
