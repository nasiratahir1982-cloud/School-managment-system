import { create } from 'zustand';
import { setupRealtimeSync, updateRealtimeData } from './firebase';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TermDate {
  id: string;
  term: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  status: 'Upcoming' | 'Active' | 'Holiday' | 'Completed' | string;
}

export interface InsetDay {
  id: string;
  date: string;  // YYYY-MM-DD
  title: string;
  editable: boolean;
}

export interface AcademicEvent {
  id: string;
  date: string;  // YYYY-MM-DD
  title: string;
  color: string; // tailwind bg class e.g. 'bg-blue-500'
}

interface CalendarState {
  // ── Data ──
  termDates: TermDate[];
  insetDays: InsetDay[];
  schoolHolidays: string[];
  academicEvents: AcademicEvent[];
  editingTermId: string | null;
  editTermName: string;
  editTermStart: string;
  editTermEnd: string;

  // ── Term Dates CRUD ──
  setTermDates: (dates: TermDate[]) => void;
  addTermDate: (term: TermDate) => void;
  updateTermDate: (id: string, updates: Partial<TermDate>) => void;
  deleteTermDate: (id: string) => void;

  // ── INSET Days CRUD ──
  setInsetDays: (days: InsetDay[]) => void;
  addInsetDay: (day: InsetDay) => void;
  updateInsetDay: (id: string, updates: Partial<InsetDay>) => void;
  deleteInsetDay: (id: string) => void;

  // ── School Holidays CRUD ──
  setSchoolHolidays: (holidays: string[]) => void;
  addSchoolHoliday: (date: string) => void;
  removeSchoolHoliday: (date: string) => void;

  // ── Academic Events CRUD ──
  setAcademicEvents: (events: AcademicEvent[]) => void;
  addAcademicEvent: (event: AcademicEvent) => void;
  updateAcademicEvent: (id: string, updates: Partial<AcademicEvent>) => void;
  deleteAcademicEvent: (id: string) => void;

  // ── Edit Mode ──
  setEditingTermId: (id: string | null) => void;
  setEditTermName: (name: string) => void;
  setEditTermStart: (date: string) => void;
  setEditTermEnd: (date: string) => void;

  // ── Helpers ──
  isWeekend: (dateStr: string) => boolean;
  isHolidayDate: (dateStr: string) => boolean;
  isInTermBreak: (dateStr: string) => boolean;
  isBlockedDate: (dateStr: string) => boolean;
  isInsetDay: (dateStr: string) => boolean;
  getInsetDay: (dateStr: string) => InsetDay | undefined;
  getEventsForDate: (dateStr: string) => AcademicEvent[];
  getTermForDate: (dateStr: string) => TermDate | undefined;
  getMinDate: () => string;
  getTomorrow24h: () => string;
  getCurrentTerm: () => TermDate | undefined;
  getNextHolidayBreak: () => TermDate | undefined;
  getUpcomingEvents: (count: number) => AcademicEvent[];

  // ── Firebase Sync ──
  syncToFirebase: () => void;
  initFirebaseSync: () => () => void;
}

// ─── Default Data ────────────────────────────────────────────────────────────

const DEFAULT_HOLIDAYS: string[] = [
  '2026-12-25', '2026-12-26', '2027-01-01', '2026-08-14', '2026-11-09',
  '2027-03-23', '2026-07-01', '2026-07-02', '2026-07-03', '2026-06-17',
  '2026-06-18', '2026-06-19', '2026-06-29', '2026-06-30'
];

const DEFAULT_TERM_DATES: TermDate[] = [
  { id: 't1', term: 'Autumn Term 1', start: '2026-09-01', end: '2026-10-23', status: 'Upcoming' },
  { id: 't2', term: 'Autumn Half-Term Break', start: '2026-10-26', end: '2026-10-30', status: 'Holiday' },
  { id: 't3', term: 'Autumn Term 2', start: '2026-11-02', end: '2026-12-18', status: 'Upcoming' },
  { id: 't4', term: 'Christmas Break', start: '2026-12-21', end: '2027-01-01', status: 'Holiday' },
  { id: 't5', term: 'Spring Term 1', start: '2027-01-05', end: '2027-02-13', status: 'Upcoming' },
  { id: 't6', term: 'Spring Half-Term Break', start: '2027-02-16', end: '2027-02-20', status: 'Holiday' },
  { id: 't7', term: 'Spring Term 2', start: '2027-02-23', end: '2027-04-02', status: 'Upcoming' },
  { id: 't8', term: 'Easter Break', start: '2027-04-06', end: '2027-04-17', status: 'Holiday' },
  { id: 't9', term: 'Summer Term 1', start: '2027-04-20', end: '2027-05-22', status: 'Upcoming' },
  { id: 't10', term: 'Summer Half-Term Break', start: '2027-05-25', end: '2027-05-29', status: 'Holiday' },
  { id: 't11', term: 'Summer Term 2', start: '2027-06-01', end: '2027-07-17', status: 'Upcoming' },
  { id: 't12', term: 'Summer Holiday', start: '2027-07-20', end: '2027-08-31', status: 'Holiday' }
];

const DEFAULT_INSET_DAYS: InsetDay[] = [
  { id: 'i1', date: '2026-09-01', title: 'Staff Training & Orientation', editable: true },
  { id: 'i2', date: '2026-11-02', title: 'Curriculum Planning Day', editable: true },
  { id: 'i3', date: '2027-01-05', title: 'Safeguarding & First Aid Training', editable: true },
  { id: 'i4', date: '2027-04-20', title: 'Assessment & Moderation Day', editable: true },
  { id: 'i5', date: '2027-06-01', title: 'End of Year Review & CPD', editable: true }
];

const DEFAULT_ACADEMIC_EVENTS: AcademicEvent[] = [
  { id: 'ev1', date: '2026-09-10', title: 'Open Day / Admissions', color: 'bg-blue-500' },
  { id: 'ev2', date: '2026-10-15', title: 'Parents Evening - Autumn', color: 'bg-amber-500' },
  { id: 'ev3', date: '2026-11-14', title: 'Anti-Bullying Week', color: 'bg-rose-500' },
  { id: 'ev4', date: '2026-12-16', title: 'Christmas Concert', color: 'bg-emerald-500' },
  { id: 'ev5', date: '2027-02-10', title: 'Mock Exams Begin', color: 'bg-purple-500' },
  { id: 'ev6', date: '2027-03-13', title: 'Science Week', color: 'bg-cyan-500' },
  { id: 'ev7', date: '2027-03-20', title: 'Parents Evening - Spring', color: 'bg-amber-500' },
  { id: 'ev8', date: '2027-05-04', title: 'External Exams Begin', color: 'bg-red-500' },
  { id: 'ev9', date: '2027-06-25', title: 'Sports Day', color: 'bg-green-500' },
  { id: 'ev10', date: '2027-07-10', title: 'Prize Giving / Awards', color: 'bg-yellow-500' }
];

// ─── Store ───────────────────────────────────────────────────────────────────

export const useCalendarStore = create<CalendarState>((set, get) => ({
  // ── Initial Data ──
  termDates: DEFAULT_TERM_DATES,
  insetDays: DEFAULT_INSET_DAYS,
  schoolHolidays: DEFAULT_HOLIDAYS,
  academicEvents: DEFAULT_ACADEMIC_EVENTS,
  editingTermId: null,
  editTermName: '',
  editTermStart: '',
  editTermEnd: '',

  // ── Term Dates CRUD ──
  setTermDates: (dates) => { set({ termDates: dates }); get().syncToFirebase(); },
  addTermDate: (term) => { set((s) => ({ termDates: [...s.termDates, term] })); get().syncToFirebase(); },
  updateTermDate: (id, updates) => {
    set((s) => ({
      termDates: s.termDates.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
    get().syncToFirebase();
  },
  deleteTermDate: (id) => { set((s) => ({ termDates: s.termDates.filter(t => t.id !== id) })); get().syncToFirebase(); },

  // ── INSET Days CRUD ──
  setInsetDays: (days) => { set({ insetDays: days }); get().syncToFirebase(); },
  addInsetDay: (day) => { set((s) => ({ insetDays: [...s.insetDays, day] })); get().syncToFirebase(); },
  updateInsetDay: (id, updates) => {
    set((s) => ({
      insetDays: s.insetDays.map(d => d.id === id ? { ...d, ...updates } : d)
    }));
    get().syncToFirebase();
  },
  deleteInsetDay: (id) => { set((s) => ({ insetDays: s.insetDays.filter(d => d.id !== id) })); get().syncToFirebase(); },

  // ── School Holidays CRUD ──
  setSchoolHolidays: (holidays) => { set({ schoolHolidays: holidays }); get().syncToFirebase(); },
  addSchoolHoliday: (date) => {
    set((s) => ({ schoolHolidays: s.schoolHolidays.includes(date) ? s.schoolHolidays : [...s.schoolHolidays, date] }));
    get().syncToFirebase();
  },
  removeSchoolHoliday: (date) => {
    set((s) => ({ schoolHolidays: s.schoolHolidays.filter(h => h !== date) }));
    get().syncToFirebase();
  },

  // ── Academic Events CRUD ──
  setAcademicEvents: (events) => { set({ academicEvents: events }); get().syncToFirebase(); },
  addAcademicEvent: (event) => { set((s) => ({ academicEvents: [...s.academicEvents, event] })); get().syncToFirebase(); },
  updateAcademicEvent: (id, updates) => {
    set((s) => ({
      academicEvents: s.academicEvents.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
    get().syncToFirebase();
  },
  deleteAcademicEvent: (id) => { set((s) => ({ academicEvents: s.academicEvents.filter(e => e.id !== id) })); get().syncToFirebase(); },

  // ── Edit Mode ──
  setEditingTermId: (id) => set({ editingTermId: id }),
  setEditTermName: (name) => set({ editTermName: name }),
  setEditTermStart: (date) => set({ editTermStart: date }),
  setEditTermEnd: (date) => set({ editTermEnd: date }),

  // ── Helpers ──
  isWeekend: (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.getDay() === 0 || d.getDay() === 6;
  },

  isHolidayDate: (dateStr: string) => {
    return get().schoolHolidays.includes(dateStr);
  },

  isInTermBreak: (dateStr: string) => {
    return get().termDates.some(t => t.status === 'Holiday' && dateStr >= t.start && dateStr <= t.end);
  },

  isBlockedDate: (dateStr: string) => {
    return get().isWeekend(dateStr) || get().isHolidayDate(dateStr) || get().isInTermBreak(dateStr);
  },

  isInsetDay: (dateStr: string) => {
    return get().insetDays.some(d => d.date === dateStr);
  },

  getInsetDay: (dateStr: string) => {
    return get().insetDays.find(d => d.date === dateStr);
  },

  getEventsForDate: (dateStr: string) => {
    return get().academicEvents.filter(e => e.date === dateStr);
  },

  getTermForDate: (dateStr: string) => {
    return get().termDates.find(t => dateStr >= t.start && dateStr <= t.end);
  },

  getMinDate: () => {
    const d = new Date();
    let attempts = 0;
    while (get().isBlockedDate(d.toISOString().split('T')[0]) && attempts < 365) {
      d.setDate(d.getDate() + 1);
      attempts++;
    }
    return d.toISOString().split('T')[0];
  },

  getTomorrow24h: () => {
    const d = new Date();
    d.setHours(d.getHours() + 24);
    return d.toISOString().slice(0, 16);
  },

  getCurrentTerm: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().termDates.find(t => t.status !== 'Holiday' && today >= t.start && today <= t.end);
  },

  getNextHolidayBreak: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().termDates.find(t => t.status === 'Holiday' && t.start > today);
  },

  getUpcomingEvents: (count: number) => {
    const today = new Date().toISOString().split('T')[0];
    return get().academicEvents
      .filter(e => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, count);
  },

  // ── Firebase Sync ──
  syncToFirebase: () => {
    const { termDates, insetDays, schoolHolidays, academicEvents } = get();
    updateRealtimeData('academic_calendar', {
      termDates,
      insetDays,
      schoolHolidays,
      academicEvents
    });
  },

  initFirebaseSync: () => {
    const unsub = setupRealtimeSync('academic_calendar', (data) => {
      if (data) {
        if (data.termDates) set({ termDates: data.termDates });
        if (data.insetDays) set({ insetDays: data.insetDays });
        if (data.schoolHolidays) set({ schoolHolidays: data.schoolHolidays });
        if (data.academicEvents) set({ academicEvents: data.academicEvents });
      } else {
        // Seed initial data
        get().syncToFirebase();
      }
    });

    // Listen to mock events for local/offline mode
    const handleMock = (event: any) => {
      const { path, data } = event.detail;
      if (path === 'academic_calendar' && data) {
        if (data.termDates) set({ termDates: data.termDates });
        if (data.insetDays) set({ insetDays: data.insetDays });
        if (data.schoolHolidays) set({ schoolHolidays: data.schoolHolidays });
        if (data.academicEvents) set({ academicEvents: data.academicEvents });
      }
    };
    window.addEventListener('ah_mock_db_update', handleMock);

    return () => {
      unsub();
      window.removeEventListener('ah_mock_db_update', handleMock);
    };
  }
}));
