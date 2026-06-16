import React, { useState, useMemo } from 'react';
import { useCalendarStore } from '../store/calendarStore';
import { CalendarDays, Plus, Edit3, Trash2, X, Check, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';


// ─── Types ───────────────────────────────────────────────────────────────────

interface AcademicCalendarProps {
  editable?: boolean;  // true for admin/principal portals
  compact?: boolean;   // true for smaller widget mode
}

// ─── Month Names ─────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  // Returns 0=Mon, 1=Tue, ..., 6=Sun
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ─── Color Mapping ───────────────────────────────────────────────────────────
const EVENT_DOT_COLORS: Record<string, string> = {
  'bg-blue-500': '#3b82f6',
  'bg-amber-500': '#f59e0b',
  'bg-rose-500': '#f43f5e',
  'bg-emerald-500': '#10b981',
  'bg-purple-500': '#a855f7',
  'bg-cyan-500': '#06b6d4',
  'bg-red-500': '#ef4444',
  'bg-green-500': '#22c55e',
  'bg-yellow-500': '#eab308',
  'bg-indigo-500': '#6366f1',
};

const EVENT_COLOR_OPTIONS = [
  { value: 'bg-blue-500', label: 'Blue', hex: '#3b82f6' },
  { value: 'bg-amber-500', label: 'Amber', hex: '#f59e0b' },
  { value: 'bg-rose-500', label: 'Rose', hex: '#f43f5e' },
  { value: 'bg-emerald-500', label: 'Emerald', hex: '#10b981' },
  { value: 'bg-purple-500', label: 'Purple', hex: '#a855f7' },
  { value: 'bg-cyan-500', label: 'Cyan', hex: '#06b6d4' },
  { value: 'bg-red-500', label: 'Red', hex: '#ef4444' },
  { value: 'bg-green-500', label: 'Green', hex: '#22c55e' },
  { value: 'bg-indigo-500', label: 'Indigo', hex: '#6366f1' },
];

// ─── Term Color Bands ────────────────────────────────────────────────────────
const TERM_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'Upcoming': { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', text: '#60a5fa' },
  'Active': { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', text: '#34d399' },
  'Holiday': { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', text: '#fbbf24' },
  'Completed': { bg: 'rgba(100,116,139,0.06)', border: 'rgba(100,116,139,0.2)', text: '#94a3b8' },
};

// ─── Component ───────────────────────────────────────────────────────────────

export const AcademicCalendar: React.FC<AcademicCalendarProps> = ({
  editable = false,
  compact = false
}) => {
  const {
    termDates, insetDays, schoolHolidays, academicEvents,
    editingTermId, editTermName, editTermStart, editTermEnd,
    setEditingTermId, setEditTermName, setEditTermStart, setEditTermEnd,
    updateTermDate, addTermDate, deleteTermDate,
    addInsetDay, updateInsetDay, deleteInsetDay,
    addAcademicEvent, updateAcademicEvent, deleteAcademicEvent,
    addSchoolHoliday, removeSchoolHoliday,
    isWeekend, isHolidayDate, isInTermBreak, isBlockedDate, isInsetDay,
    getInsetDay, getEventsForDate, getTermForDate
  } = useCalendarStore();

  const [startYear, setStartYear] = useState(2026);
  const [startMonth, setStartMonth] = useState(0); // 0 = Jan

  const academicYearMonths = useMemo(() => {
    const months: { year: number; month: number }[] = [];
    let currentY = startYear;
    let currentM = startMonth;
    for (let i = 0; i < 12; i++) {
      months.push({ year: currentY, month: currentM });
      currentM++;
      if (currentM > 11) {
        currentM = 0;
        currentY++;
      }
    }
    return months;
  }, [startYear, startMonth]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddInsetModal, setShowAddInsetModal] = useState(false);
  const [showAddTermModal, setShowAddTermModal] = useState(false);
  const [showAddHolidayModal, setShowAddHolidayModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventColor, setNewEventColor] = useState('bg-blue-500');
  const [newInsetTitle, setNewInsetTitle] = useState('');
  const [newInsetDate, setNewInsetDate] = useState('');
  const [newTermName, setNewTermName] = useState('');
  const [newTermStart, setNewTermStart] = useState('');
  const [newTermEnd, setNewTermEnd] = useState('');
  const [newTermStatus, setNewTermStatus] = useState('Upcoming');
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [activeTab, setActiveTab] = useState<'calendar' | 'terms' | 'inset' | 'events' | 'holidays'>('calendar');
  const [quickType, setQuickType] = useState('Event');
  const [quickTitle, setQuickTitle] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const exportToExcel = () => {
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
  };

  // ── Render a single month mini-calendar ──
  const renderMonth = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const cells: React.ReactNode[] = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="w-full aspect-square" />);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateStr(year, month, day);
      const blocked = isBlockedDate(dateStr);
      const weekend = isWeekend(dateStr);
      const holiday = isHolidayDate(dateStr);
      const termBreak = isInTermBreak(dateStr);
      const inset = isInsetDay(dateStr);
      const events = getEventsForDate(dateStr);
      const isToday = dateStr === todayStr;
      const term = getTermForDate(dateStr);
      const isSelected = dateStr === selectedDate;

      // Determine cell style
      let cellClasses = 'w-full aspect-square flex flex-col items-center justify-center rounded-md text-[10px] relative transition-all duration-150 ';

      if (isToday) {
        cellClasses += 'ring-2 ring-primary ring-offset-1 ring-offset-background font-black text-primary bg-primary/20 ';
      } else if (holiday) {
        cellClasses += 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 shadow-[inset_0_0_8px_rgba(244,63,94,0.1)] ';
      } else if (inset) {
        cellClasses += 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 shadow-[inset_0_0_8px_rgba(245,158,11,0.1)] ';
      } else if (events.length > 0) {
        const c = events[0].color;
        if(c.includes('purple')) cellClasses += 'bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30 shadow-[inset_0_0_8px_rgba(168,85,247,0.1)] ';
        else if(c.includes('rose') || c.includes('red')) cellClasses += 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 shadow-[inset_0_0_8px_rgba(244,63,94,0.1)] ';
        else if(c.includes('emerald') || c.includes('green')) cellClasses += 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 shadow-[inset_0_0_8px_rgba(16,185,129,0.1)] ';
        else if(c.includes('amber') || c.includes('yellow')) cellClasses += 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 shadow-[inset_0_0_8px_rgba(245,158,11,0.1)] ';
        else if(c.includes('cyan')) cellClasses += 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30 shadow-[inset_0_0_8px_rgba(6,182,212,0.1)] ';
        else cellClasses += 'bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30 shadow-[inset_0_0_8px_rgba(59,130,246,0.1)] ';
      } else if (blocked) {
        cellClasses += 'opacity-25 text-muted-foreground cursor-default ';
      } else if (term && term.status !== 'Holiday') {
        cellClasses += 'text-foreground/80 font-medium hover:bg-primary/10 cursor-pointer ';
      } else {
        cellClasses += 'text-foreground/70 hover:bg-muted/30 cursor-pointer ';
      }

      if (isSelected) {
        cellClasses += 'ring-2 ring-primary/60 bg-primary/20 scale-105 z-10 ';
      }

      cells.push(
        <div
          key={day}
          className={cellClasses}
          onClick={() => (editable || !blocked) && setSelectedDate(dateStr)}
          title={
            blocked
              ? (weekend ? 'Weekend' : holiday ? 'Public Holiday' : termBreak ? 'Term Break' : 'Blocked')
              : inset
                ? `INSET: ${getInsetDay(dateStr)?.title}`
                : events.length > 0
                  ? events.map(e => e.title).join(', ')
                  : dateStr
          }
        >
          <span className="leading-none">{day}</span>

          {/* Event & INSET dots */}
          {(events.length > 0 || inset) && (
            <div className="flex gap-[2px] mt-[1px] absolute bottom-[2px]">
              {inset && (
                <span className="w-[4px] h-[4px] rounded-full bg-amber-400" />
              )}
              {events.slice(0, 3).map((ev, idx) => (
                <span
                  key={idx}
                  className="w-[4px] h-[4px] rounded-full"
                  style={{ backgroundColor: EVENT_DOT_COLORS[ev.color] || '#6366f1' }}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-card/50 border border-border/50 rounded-xl p-3 hover:border-primary/20 transition-all duration-200">
        <h4 className="text-[11px] font-bold text-foreground/90 text-center mb-2 uppercase tracking-wider">
          {MONTH_NAMES[month]} {year}
        </h4>
        <div className="grid grid-cols-7 gap-[2px] mb-1">
          {DAY_HEADERS.map(d => (
            <div key={d} className="text-[8px] font-bold text-muted-foreground text-center uppercase tracking-wider py-0.5">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-[2px]">
          {cells}
        </div>
      </div>
    );
  };

  // ── Selected date detail panel ──
  const renderDateDetail = () => {
    if (!selectedDate) return null;
    const term = getTermForDate(selectedDate);
    const events = getEventsForDate(selectedDate);
    const insetDay = getInsetDay(selectedDate);
    const blocked = isBlockedDate(selectedDate);
    const dateObj = new Date(selectedDate + 'T12:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
      <div className="p-4 bg-card border border-border rounded-xl space-y-3 animate-fadeIn">
        <div className="flex justify-between items-center">
          <div>
            <strong className="text-sm font-bold text-foreground">{formattedDate}</strong>
            {term && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                term.status === 'Holiday' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : term.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>{term.term}</span>
            )}
          </div>
          <button onClick={() => setSelectedDate(null)} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {blocked && (
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[10px] text-rose-400 font-semibold">
            ⛔ This date is blocked — {isWeekend(selectedDate) ? 'Weekend' : isHolidayDate(selectedDate) ? 'Public Holiday' : 'Term Break'}
          </div>
        )}

        {insetDay && (
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex justify-between items-center">
            <div>
              <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider block">INSET Day</span>
              <strong className="text-xs text-foreground">{insetDay.title}</strong>
              <span className="text-[10px] text-amber-400 block">No Students — Staff Only</span>
            </div>
            {editable && (
              <div className="flex gap-1">
                <button onClick={() => {
                  const t = prompt('Edit INSET Day Title:', insetDay.title);
                  if (t) updateInsetDay(insetDay.id, { title: t });
                }} className="p-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-all"><Edit3 className="w-3 h-3" /></button>
                <button onClick={() => { if (confirm('Remove this INSET day?')) deleteInsetDay(insetDay.id); }}
                  className="p-1 bg-rose-500/10 text-rose-400 rounded hover:bg-rose-500/20 transition-all"><Trash2 className="w-3 h-3" /></button>
              </div>
            )}
          </div>
        )}

        {events.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-foreground/60 uppercase tracking-wider">Events</span>
            {events.map(ev => (
              <div key={ev.id} className="p-2 bg-muted/15 border border-border rounded-lg flex items-center gap-2 group">
                <span className="w-2 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: EVENT_DOT_COLORS[ev.color] || '#6366f1' }} />
                <span className="text-xs text-foreground font-semibold flex-1">{ev.title}</span>
                {editable && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => {
                      const t = prompt('Edit Event Title:', ev.title);
                      if (t) updateAcademicEvent(ev.id, { title: t });
                    }} className="p-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-all"><Edit3 className="w-3 h-3" /></button>
                    <button onClick={() => { if (confirm('Delete this event?')) deleteAcademicEvent(ev.id); }}
                      className="p-1 bg-rose-500/10 text-rose-400 rounded hover:bg-rose-500/20 transition-all"><Trash2 className="w-3 h-3" /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!blocked && events.length === 0 && !insetDay && (
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
      </div>
    );
  };

  // ── Term Dates Management Tab ──
  const renderTermsTab = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Term Dates & Breaks</span>
        {editable && (
          <button onClick={() => setShowAddTermModal(true)}
            className="px-2.5 py-1 bg-primary/10 text-primary text-[9px] font-bold rounded border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Term
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/20 font-bold text-foreground/60">
              <th className="p-2">Term / Break</th>
              <th className="p-2">Start Date</th>
              <th className="p-2">End Date</th>
              <th className="p-2">Status</th>
              {editable && <th className="p-2 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {termDates.map(t => (
              <tr key={t.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                {editingTermId === t.id ? (
                  <>
                    <td className="p-2"><input value={editTermName} onChange={(e) => setEditTermName(e.target.value)} className="bg-muted/30 border border-border rounded text-xs p-1.5 w-full text-foreground" /></td>
                    <td className="p-2"><input type="date" value={editTermStart} onChange={(e) => setEditTermStart(e.target.value)} className="bg-muted/30 border border-border rounded text-xs p-1.5 text-foreground" /></td>
                    <td className="p-2"><input type="date" value={editTermEnd} onChange={(e) => setEditTermEnd(e.target.value)} className="bg-muted/30 border border-border rounded text-xs p-1.5 text-foreground" /></td>
                    <td className="p-2">
                      <select value={t.status} onChange={(e) => updateTermDate(t.id, { status: e.target.value })} className="bg-muted/30 border border-border rounded text-xs p-1.5 text-foreground">
                        <option>Upcoming</option><option>Active</option><option>Holiday</option><option>Completed</option>
                      </select>
                    </td>
                    <td className="p-2 text-right flex gap-1 justify-end">
                      <button onClick={() => { updateTermDate(t.id, { term: editTermName, start: editTermStart, end: editTermEnd }); setEditingTermId(null); }}
                        className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-bold rounded cursor-pointer flex items-center gap-1"><Check className="w-3 h-3" /> Save</button>
                      <button onClick={() => setEditingTermId(null)}
                        className="px-2 py-1 bg-muted text-foreground text-[9px] font-bold rounded cursor-pointer border border-border"><X className="w-3 h-3" /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 font-semibold text-foreground">{t.term}</td>
                    <td className="p-2 text-muted-foreground font-mono">{t.start}</td>
                    <td className="p-2 text-muted-foreground font-mono">{t.end}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        t.status === 'Holiday' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : t.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : t.status === 'Completed' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>{t.status}</span>
                    </td>
                    {editable && (
                      <td className="p-2 text-right flex gap-1 justify-end">
                        <button onClick={() => { setEditingTermId(t.id); setEditTermName(t.term); setEditTermStart(t.start); setEditTermEnd(t.end); }}
                          className="px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-[9px] font-bold rounded cursor-pointer border border-primary/20 transition-all flex items-center gap-1">
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={() => { if (confirm(`Delete "${t.term}"?`)) deleteTermDate(t.id); }}
                          className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[9px] font-bold rounded cursor-pointer border border-rose-500/20 transition-all">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── INSET Days Tab ──
  const renderInsetTab = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">INSET Days (Teacher Training / Non-Pupil Days)</span>
        {editable && (
          <button onClick={() => setShowAddInsetModal(true)}
            className="px-2.5 py-1 bg-primary/10 text-primary text-[9px] font-bold rounded border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add INSET Day
          </button>
        )}
      </div>
      <div className="space-y-2">
        {insetDays.map(day => (
          <div key={day.id} className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-lg flex justify-between items-center group hover:border-amber-500/30 transition-all">
            <div>
              <strong className="text-xs text-foreground block">{day.title}</strong>
              <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> {day.date} — No Students
              </span>
            </div>
            {editable && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => {
                  const t = prompt('Edit INSET Day Title:', day.title);
                  if (t) updateInsetDay(day.id, { title: t });
                }} className="px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-[9px] font-bold rounded cursor-pointer border border-primary/20">Edit</button>
                <button onClick={() => { if (confirm('Remove this INSET day?')) deleteInsetDay(day.id); }}
                  className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[9px] font-bold rounded cursor-pointer border border-rose-500/20">Remove</button>
              </div>
            )}
          </div>
        ))}
        {insetDays.length === 0 && (
          <p className="text-[10px] text-muted-foreground italic p-3 text-center">No INSET days configured.</p>
        )}
      </div>
    </div>
  );

  // ── Events Tab ──
  const renderEventsTab = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Key Academic Events</span>
        {editable && (
          <button onClick={() => setShowAddEventModal(true)}
            className="px-2.5 py-1 bg-primary/10 text-primary text-[9px] font-bold rounded border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Event
          </button>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {academicEvents.map(ev => (
          <div key={ev.id} className="w-full sm:w-[calc(50%-0.25rem)] lg:w-[calc(33.333%-0.35rem)] p-3 bg-muted/15 border border-border rounded-lg flex items-center gap-3 group hover:border-primary/20 transition-all">
            <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: EVENT_DOT_COLORS[ev.color] || '#6366f1' }} />
            <div className="flex-1 min-w-0">
              <strong className="text-[11px] text-foreground block truncate">{ev.title}</strong>
              <span className="text-[10px] text-muted-foreground font-mono">{ev.date}</span>
            </div>
            {editable && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => {
                  const t = prompt('Edit Event Title:', ev.title);
                  if (t) updateAcademicEvent(ev.id, { title: t });
                }} className="p-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-all"><Edit3 className="w-3 h-3" /></button>
                <button onClick={() => { if (confirm('Delete this event?')) deleteAcademicEvent(ev.id); }}
                  className="p-1 bg-rose-500/10 text-rose-400 rounded hover:bg-rose-500/20 transition-all"><Trash2 className="w-3 h-3" /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Holidays Tab ──
  const renderHolidaysTab = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Public / National Holidays</span>
        {editable && (
          <button onClick={() => setShowAddHolidayModal(true)}
            className="px-2.5 py-1 bg-primary/10 text-primary text-[9px] font-bold rounded border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Holiday
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {schoolHolidays.sort().map((h, i) => (
          <span key={i} className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-[9px] font-bold flex items-center gap-1.5 group">
            {h}
            {editable && (
              <button onClick={() => { if (confirm(`Remove holiday ${h}?`)) removeSchoolHoliday(h); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-400 hover:text-rose-300">
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">
        Weekends (Sat/Sun), public holidays and term breaks are automatically blocked in all date pickers across the system.
      </p>
    </div>
  );

  // ── Legend ──
  const renderLegend = () => (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 p-3 bg-muted/10 border border-border/50 rounded-lg">
      <div className="flex items-center gap-1.5 text-[9px] text-foreground/70 font-semibold">
        <span className="w-3 h-3 rounded-sm ring-2 ring-primary bg-primary/10" /> Today
      </div>
      <div className="flex items-center gap-1.5 text-[9px] text-foreground/70 font-semibold">
        <span className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/30" /> INSET Day
      </div>
      <div className="flex items-center gap-1.5 text-[9px] text-foreground/70 font-semibold">
        <span className="w-3 h-3 rounded-sm bg-foreground/5 opacity-25" /> Weekend / Holiday / Break
      </div>
      <div className="flex items-center gap-1.5 text-[9px] text-foreground/70 font-semibold">
        <span className="w-[6px] h-[6px] rounded-full bg-blue-500" />
        <span className="w-[6px] h-[6px] rounded-full bg-amber-500" />
        <span className="w-[6px] h-[6px] rounded-full bg-emerald-500" />
        Events
      </div>
    </div>
  );

  // ── Modal: Add Event ──
  const renderAddEventModal = () => showAddEventModal && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn" onClick={() => setShowAddEventModal(false)}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <strong className="text-sm font-bold text-foreground flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary" /> Add Academic Event</strong>
          <button onClick={() => setShowAddEventModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
        <input value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} placeholder="Event Title" className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" />
        <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" />
        <div className="flex flex-wrap gap-2">
          {EVENT_COLOR_OPTIONS.map(c => (
            <button key={c.value} onClick={() => setNewEventColor(c.value)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${newEventColor === c.value ? 'border-foreground scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
              style={{ backgroundColor: c.hex }} title={c.label} />
          ))}
        </div>
        <button onClick={() => {
          if (newEventTitle && newEventDate) {
            addAcademicEvent({ id: 'ev' + Date.now(), date: newEventDate, title: newEventTitle, color: newEventColor });
            setNewEventTitle(''); setNewEventDate(''); setShowAddEventModal(false);
          }
        }} className="w-full py-2.5 bg-primary text-white font-bold text-xs rounded-lg hover:bg-primary/90 transition-all">
          Add Event
        </button>
      </div>
    </div>
  );

  // ── Modal: Add INSET Day ──
  const renderAddInsetModal = () => showAddInsetModal && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn" onClick={() => setShowAddInsetModal(false)}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <strong className="text-sm font-bold text-foreground flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" /> Add INSET Day</strong>
          <button onClick={() => setShowAddInsetModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
        <input value={newInsetTitle} onChange={e => setNewInsetTitle(e.target.value)} placeholder="INSET Day Title" className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" />
        <input type="date" value={newInsetDate} onChange={e => setNewInsetDate(e.target.value)} className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" />
        <button onClick={() => {
          if (newInsetTitle && newInsetDate) {
            addInsetDay({ id: 'i' + Date.now(), date: newInsetDate, title: newInsetTitle, editable: true });
            setNewInsetTitle(''); setNewInsetDate(''); setShowAddInsetModal(false);
          }
        }} className="w-full py-2.5 bg-amber-500 text-white font-bold text-xs rounded-lg hover:bg-amber-600 transition-all">
          Add INSET Day
        </button>
      </div>
    </div>
  );

  // ── Modal: Add Term ──
  const renderAddTermModal = () => showAddTermModal && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn" onClick={() => setShowAddTermModal(false)}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <strong className="text-sm font-bold text-foreground flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary" /> Add Term / Break</strong>
          <button onClick={() => setShowAddTermModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
        <input value={newTermName} onChange={e => setNewTermName(e.target.value)} placeholder="Term Name" className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" />
        <div className="grid grid-cols-2 gap-3">
          <input type="date" value={newTermStart} onChange={e => setNewTermStart(e.target.value)} className="bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" />
          <input type="date" value={newTermEnd} onChange={e => setNewTermEnd(e.target.value)} className="bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" />
        </div>
        <select value={newTermStatus} onChange={e => setNewTermStatus(e.target.value)} className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground">
          <option>Upcoming</option><option>Active</option><option>Holiday</option><option>Completed</option>
        </select>
        <button onClick={() => {
          if (newTermName && newTermStart && newTermEnd) {
            addTermDate({ id: 't' + Date.now(), term: newTermName, start: newTermStart, end: newTermEnd, status: newTermStatus });
            setNewTermName(''); setNewTermStart(''); setNewTermEnd(''); setShowAddTermModal(false);
          }
        }} className="w-full py-2.5 bg-primary text-white font-bold text-xs rounded-lg hover:bg-primary/90 transition-all">
          Add Term
        </button>
      </div>
    </div>
  );

  // ── Modal: Add Holiday ──
  const renderAddHolidayModal = () => showAddHolidayModal && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn" onClick={() => setShowAddHolidayModal(false)}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <strong className="text-sm font-bold text-foreground flex items-center gap-2"><CalendarDays className="w-4 h-4 text-rose-400" /> Add Public Holiday</strong>
          <button onClick={() => setShowAddHolidayModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
        <input type="date" value={newHolidayDate} onChange={e => setNewHolidayDate(e.target.value)} className="w-full bg-muted/30 border border-border rounded-lg text-xs p-2.5 text-foreground" />
        <button onClick={() => {
          if (newHolidayDate) {
            addSchoolHoliday(newHolidayDate);
            setNewHolidayDate(''); setShowAddHolidayModal(false);
          }
        }} className="w-full py-2.5 bg-rose-500 text-white font-bold text-xs rounded-lg hover:bg-rose-600 transition-all">
          Add Holiday
        </button>
      </div>
    </div>
  );

  // ─── Tab Navigation ────────────────────────────────────────────────────────
  const tabs = [
    { key: 'calendar' as const, label: 'Full Year Calendar', icon: CalendarDays },
    { key: 'terms' as const, label: 'Term Dates', icon: CalendarDays },
    { key: 'inset' as const, label: 'INSET Days', icon: Clock },
    { key: 'events' as const, label: 'Events', icon: CalendarDays },
    { key: 'holidays' as const, label: 'Holidays', icon: CalendarDays },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="p-5 bg-card border border-border rounded-xl space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-border/50">
          <strong className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" /> Academic Year Planner
          </strong>
          
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1 bg-muted/30 border border-border rounded-lg p-1">
              <select 
                value={startMonth} 
                onChange={e => setStartMonth(Number(e.target.value))}
                className="bg-transparent text-xs text-foreground font-bold outline-none cursor-pointer p-1"
              >
                {MONTH_NAMES.map((m, idx) => <option key={m} value={idx}>{m}</option>)}
              </select>
              <select 
                value={startYear} 
                onChange={e => setStartYear(Number(e.target.value))}
                className="bg-transparent text-xs text-foreground font-bold outline-none cursor-pointer p-1"
              >
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            
            <button onClick={exportToExcel}
              className="px-3 py-1.5 bg-emerald-500 text-white rounded text-[10px] font-bold shadow-md hover:bg-emerald-600 transition-all cursor-pointer border border-emerald-600/50">
              Export Excel
            </button>
            <button onClick={() => {
              const element = document.getElementById('calendar-export-area');
              if(element) {
                const opt = {
                  margin: 0.5,
                  filename: `Academic_Calendar_${startYear}.pdf`,
                  image: { type: 'jpeg' as const, quality: 0.98 },
                  html2canvas: { scale: 2, useCORS: true },
                  jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' as const }
                };
                html2pdf().set(opt).from(element).save();
              }
            }}
              className="px-3 py-1.5 bg-primary text-white rounded text-[10px] font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer">
              Export PDF
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-border/50'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'calendar' && (
          <div className="space-y-4" id="calendar-export-area">
            {/* Legend */}
            {renderLegend()}

            {/* 12-Month Grid */}
            <div className={`grid gap-3 ${compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
              {academicYearMonths.map(({ year, month }) => (
                <div key={`${year}-${month}`}>
                  {renderMonth(year, month)}
                </div>
              ))}
            </div>

            {/* Selected Date Detail */}
            {renderDateDetail()}

            {/* Term Timeline Bar */}
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-foreground/60 uppercase tracking-wider">Term Timeline Overview</span>
              <div className="space-y-1.5">
                {termDates.map(t => {
                  const colors = TERM_COLORS[t.status] || TERM_COLORS['Upcoming'];
                  return (
                    <div key={t.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:scale-[1.005]"
                      style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                    >
                      <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.text }} />
                      <div className="flex-1 min-w-0">
                        <strong className="text-[11px] block truncate" style={{ color: colors.text }}>{t.term}</strong>
                        <span className="text-[9px] text-muted-foreground font-mono">{t.start} → {t.end}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                        t.status === 'Holiday' ? 'bg-amber-500/15 text-amber-400' 
                        : t.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400'
                        : t.status === 'Completed' ? 'bg-slate-500/15 text-slate-400'
                        : 'bg-blue-500/15 text-blue-400'
                      }`}>{t.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'terms' && renderTermsTab()}
        {activeTab === 'inset' && renderInsetTab()}
        {activeTab === 'events' && renderEventsTab()}
        {activeTab === 'holidays' && renderHolidaysTab()}
      </div>

      {/* Modals */}
      {renderAddEventModal()}
      {renderAddInsetModal()}
      {renderAddTermModal()}
      {renderAddHolidayModal()}
    </div>
  );
};

export default AcademicCalendar;
