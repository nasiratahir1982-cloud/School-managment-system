import { create } from 'zustand';

export type SupportedCountry = 'PK' | 'UK' | 'AE' | 'SA' | 'US' | 'CA';

export interface SchoolTheme {
  primaryHsl: string; // e.g. "263.4 70% 50.4%"
  secondaryHsl: string; // e.g. "217.2 32.6% 16%"
}

export interface SchoolInfo {
  schoolId: string;
  schoolName: string;
  domain: string;
  logoUrl: string | null;
  country: SupportedCountry;
  city: string;
  campusCount: number;
  currentAcademicSession: string;
  themeSettings: SchoolTheme;
  currencyOverride?: string;
  modules?: {
    transport: boolean;
    hostel: boolean;
    inventory: boolean;
    library: boolean;
    lms: boolean;
    payroll: boolean;
  };
}

export interface CountryConfig {
  countryCode: SupportedCountry;
  countryName: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  dateFormat: string;
  timezone: string;
  languages: string[];
  phonePrefix: string;
  rollNumberLabel: string;
}

export const COUNTRY_CONFIGS: Record<SupportedCountry, CountryConfig> = {
  PK: {
    countryCode: 'PK',
    countryName: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    currencySymbol: 'Rs',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Karachi',
    languages: ['Urdu', 'English'],
    phonePrefix: '+92',
    rollNumberLabel: 'Roll Number',
  },
  UK: {
    countryCode: 'UK',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Europe/London',
    languages: ['English'],
    phonePrefix: '+44',
    rollNumberLabel: 'Candidate No',
  },
  AE: {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'AED',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Dubai',
    languages: ['Arabic', 'English'],
    phonePrefix: '+971',
    rollNumberLabel: 'Student ID',
  },
  SA: {
    countryCode: 'SA',
    countryName: 'Saudi Arabia',
    flag: '🇸🇦',
    currency: 'SAR',
    currencySymbol: '﷼',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Riyadh',
    languages: ['Arabic', 'English'],
    phonePrefix: '+966',
    rollNumberLabel: 'Register ID',
  },
  US: {
    countryCode: 'US',
    countryName: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'America/New_York',
    languages: ['English'],
    phonePrefix: '+1',
    rollNumberLabel: 'Student ID',
  },
  CA: {
    countryCode: 'CA',
    countryName: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: '$',
    dateFormat: 'YYYY-MM-DD',
    timezone: 'America/Toronto',
    languages: ['English', 'French'],
    phonePrefix: '+1',
    rollNumberLabel: 'Student ID',
  },
};

// Base mock exchange rates (relative to USD)
const STATIC_FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  PKR: 278.5,
  GBP: 0.78,
  AED: 3.67,
  SAR: 3.75,
  CAD: 1.37,
};

interface SchoolState {
  currentSchool: SchoolInfo | null;
  selectedCountry: SupportedCountry | null;
  loading: boolean;
  error: string | null;
  schools: SchoolInfo[];
  activeLanguage: string;
  exchangeRates: Record<string, number>;
  fetchExchangeRates: () => Promise<void>;
  setLanguage: (lang: string) => void;
  resolveSchool: (subdomain: string) => Promise<SchoolInfo>;
  applyTheme: (theme: SchoolTheme) => void;
  setCountry: (country: SupportedCountry) => void;
  addSchool: (school: SchoolInfo) => void;
  formatCurrency: (amount: number, targetCurrency?: string) => string;
  getCountryConfig: () => CountryConfig;
  convertCurrency: (amount: number, from: string, to: string) => number;
  getPhonePrefix: () => string;
  getRollLabel: () => string;
  updateSchoolTheme: (schoolId: string, primaryHsl: string) => void;
}

export const INITIAL_SCHOOLS: SchoolInfo[] = [
  {
    schoolId: '11111111-1111-1111-1111-111111111111',
    schoolName: 'Dar-e-Arqam School',
    domain: 'school-a',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImcxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNEY0NkU1IiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzdDM0FFRCIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSJ1cmwoI2cxKSIvPjxwYXRoIGQ9Ik0zMCA0MCBRNTAgMzUgNTAgNDUgUTUwIDM1IDcwIDQwIEw3MCA2NSBRNTAgNjAgNTAgNzAgUTUwIDYwIDMwIDY1IFoiIGZpbGw9IndoaXRlIiAvPjxwYXRoIGQ9Ik01MCA0NSBMNTAgNzAiIHN0cm9rZT0iIzRGNDZFNSIgc3Ryb2tlLXdpZHRoPSIyIiAvPjxwYXRoIGQ9Ik00MiAyMiBBIDggOCAwIDEgMSA1NCAyOCBBIDYgNiAwIDEgMCA0MiAyMiIgZmlsbD0iI0ZCQkYyNCIgLz48L3N2Zz4=',
    country: 'PK',
    city: 'Lahore',
    campusCount: 3,
    currentAcademicSession: '2026-2027',
    themeSettings: {
      primaryHsl: '263.4 70% 50.4%', // Purple theme
      secondaryHsl: '217.2 32.6% 16%',
    },
    modules: {
      transport: true,
      hostel: false,
      inventory: true,
      library: true,
      lms: true,
      payroll: true,
    }
  },
  {
    schoolId: '22222222-2222-2222-2222-222222222222',
    schoolName: 'Beaconhouse Campus Lahore',
    domain: 'school-b',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImcyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMTBCOTk4MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwNTk2NjkiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIyNCIgZmlsbD0idXJsKCNnMikiLz48cGF0aCBkPSJNMzAgMjUgTDcwIDI1IEw3MCA0OCBDNzAgNjUsIDUwIDg4LCA1MCA3OEM1MCA3OCwgMzAgNjUsIDMwIDQ4IFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZCQkYyNCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTUwIDMzIEw2NSA0MCBMNTAgNDcgTDM1IDQwIFoiIGZpbGw9IiNGQkJGMjQiLz48cGF0aCBkPSJNNDEgNDMuNSBMNDEgNTEgQzQxIDU1LCA1OSA1NSwgNTkgNTEgTDU5IDQzLjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZCQkYyNCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTU4IDQyIEw1OCA1MiBMNjAgNTIgTDYwIDQyIFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
    country: 'PK',
    city: 'Lahore',
    campusCount: 5,
    currentAcademicSession: '2026-2027',
    themeSettings: {
      primaryHsl: '142.1 76.2% 36.3%', // Green theme
      secondaryHsl: '222.2 47.4% 11.2%',
    },
    modules: {
      transport: true,
      hostel: true,
      inventory: true,
      library: true,
      lms: false,
      payroll: true,
    }
  },
  {
    schoolId: '33333333-3333-3333-3333-333333333333',
    schoolName: 'The Educators',
    domain: 'the-educators',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImczIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMjU2M0VCIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFENGVEOCIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSJ1cmwoI2czKSIvPjxwYXRoIGQ9Ik0zNSAzMCBMNjUgMzAgTDY1IDM4IEw0NSAzOCBMNDUgNDYgTDYwIDQ2IEw2MCA1NCBMNDUgNTQgTDQ1IDYyIEw2NSA2MiBMNjUgNzAgTDM1IDcwIFoiIGZpbGw9IiNGOTczMTYiLz48Y2lyY2xlIGN4PSI3MiIgY3k9IjUwIiByPSI2IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4=',
    country: 'PK',
    city: 'Karachi',
    campusCount: 12,
    currentAcademicSession: '2026-2027',
    themeSettings: {
      primaryHsl: '217.2 91.2% 59.8%', // Blue
      secondaryHsl: '222.2 47.4% 11.2%',
    }
  },
  {
    schoolId: '44444444-4444-4444-4444-444444444444',
    schoolName: 'Beaconhouse London',
    domain: 'beaconhouse-uk',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImcyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRDk3NzA2IiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0I0NTMwOSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSJ1cmwoI2cyKSIvPjxwYXRoIGQ9Ik0zMCAyNSBMNzAgMjUgTDcwIDQ4IENDNzAgNjUsIDUwIDc4LCA1MCA3OEM1MCA3OCwgMzAgNjUsIDMwIDQ4IFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZCQkYyNCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTUwIDMzIEw2NSA0MCBMNTAgNDcgTDM1IDQwIFoiIGZpbGw9IiNGQkJGMjQiLz48cGF0aCBkPSJNNDEgNDMuNSBMNDEgNTEgQzQxIDU1LCA1OSA1NSwgNTkgNTEgTDU5IDQzLjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZCQkYyNCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTU4IDQyIEw1OCA1MiBMNjAgNTIgTDYwIDQyIFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
    country: 'UK',
    city: 'London',
    campusCount: 2,
    currentAcademicSession: '2026-2027',
    themeSettings: {
      primaryHsl: '43 96% 50%', // Golden Amber theme
      secondaryHsl: '222.2 47.4% 11.2%',
    }
  },
  {
    schoolId: '55555555-5555-5555-5555-555555555555',
    schoolName: 'Beaconhouse Dubai',
    domain: 'beaconhouse-uae',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImcyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRDU2QjA4IiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0I0NTMwOSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSJ1cmwoI2cyKSIvPjxwYXRoIGQ9Ik0zMCAyNSBMNzAgMjUgTDcwIDQ4IENDNzAgNjUsIDUwIDc4LCA1MCA3OEM1MCA3OCwgMzAgNjUsIDMwIDQ4IFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZCQkYyNCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTUwIDMzIEw2NSA0MCBMNTAgNDcgTDM1IDQwIFoiIGZpbGw9IiNGQkJGMjQiLz48cGF0aCBkPSJNNDEgNDMuNSBMNDEgNTEgQzQxIDU1LCA1OSA1NSwgNTkgNTEgTDU5IDQzLjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZCQkYyNCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTU4IDQyIEw1OCA1MiBMNjAgNTIgTDYwIDQyIFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
    country: 'AE',
    city: 'Dubai',
    campusCount: 4,
    currentAcademicSession: '2026-2027',
    themeSettings: {
      primaryHsl: '24.6 95% 53.1%', // Amber
      secondaryHsl: '222.2 47.4% 11.2%',
    }
  },
  {
    schoolId: '66666666-6666-6666-6666-666666666666',
    schoolName: 'International Grammar School',
    domain: 'igs-sa',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Imc0IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMEVBNUVJIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAyODRDNyIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSJ1cmwoI2c0KSIvPjx0ZXh0IHg9IjUwJSIgeT0iNjUlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtc2l6ZT0iNDUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JRzwvdGV4dD48L3N2Zz4=',
    country: 'SA',
    city: 'Riyadh',
    campusCount: 1,
    currentAcademicSession: '2026-2027',
    themeSettings: {
      primaryHsl: '172 66% 50%', // Teal
      secondaryHsl: '222.2 47.4% 11.2%',
    }
  },
  {
    schoolId: '77777777-7777-7777-7777-777777777777',
    schoolName: 'Roots International',
    domain: 'roots-ca',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Imc1IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRUM0ODk5IiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0Q5NDZFRiIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSJ1cmwoI2c1KSIvPjx0ZXh0IHg9IjUwJSIgeT0iNjUlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtc2l6ZT0iNDUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5SPC90ZXh0Pjwvc3ZnPg==',
    country: 'CA',
    city: 'Toronto',
    campusCount: 2,
    currentAcademicSession: '2026-2027',
    themeSettings: {
      primaryHsl: '280 85% 60%', // Purple-blue
      secondaryHsl: '222.2 47.4% 11.2%',
    }
  },
  {
    schoolId: '00000000-0000-0000-0000-000000000000',
    schoolName: 'Allied School Campus A',
    domain: 'superadmin',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Imc2IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjM0I4MkY2IiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzI1NjNFQiIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSJ1cmwoI2c2KSIvPjx0ZXh0IHg9IjUwJSIgeT0iNjUlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtc2l6ZT0iNDUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BUzwvdGV4dD48L3N2Zz4=',
    country: 'US',
    city: 'New York',
    campusCount: 1,
    currentAcademicSession: '2026-2027',
    themeSettings: {
      primaryHsl: '217.2 91.2% 59.8%', // Blue theme
      secondaryHsl: '222.2 47.4% 11.2%',
    }
  }
];

// Read dynamic schools from localStorage if they exist
const getInitialSchools = (): SchoolInfo[] => {
  if (typeof window === 'undefined') return INITIAL_SCHOOLS;
  const saved = localStorage.getItem('ah_dynamic_schools');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Automatically migrate any pure crimson red (346.8 77.2% 49.8%) to Royal Amber Gold (43 96% 50%)
        const migrated = parsed.map((s: any) => {
          if (s.themeSettings?.primaryHsl === '346.8 77.2% 49.8%') {
            return {
              ...s,
              themeSettings: {
                ...s.themeSettings,
                primaryHsl: '43 96% 50%'
              }
            };
          }
          return s;
        });

        // Save it back to local storage if migrated
        const hasChanges = migrated.some((s, idx) => s.themeSettings.primaryHsl !== parsed[idx].themeSettings?.primaryHsl);
        if (hasChanges) {
          localStorage.setItem('ah_dynamic_schools', JSON.stringify(migrated));
        }

        return [...INITIAL_SCHOOLS, ...migrated];
      }
    } catch (e) {
      console.error('Failed to parse dynamic schools:', e);
    }
  }
  return INITIAL_SCHOOLS;
};

// Read initial school from localStorage if it exists on page load/import
const getInitialSchool = (schools: SchoolInfo[]): SchoolInfo | null => {
  if (typeof window === 'undefined') return null;
  const savedDomain = localStorage.getItem('ah_current_school_domain');
  if (savedDomain) {
    const resolved = schools.find(s => s.domain === savedDomain);
    if (resolved) {
      // Apply theme CSS variables immediately to prevent render flash
      const root = document.documentElement;
      root.style.setProperty('--primary', resolved.themeSettings.primaryHsl);
      root.style.setProperty('--ring', resolved.themeSettings.primaryHsl);
      root.style.setProperty('--accent', resolved.themeSettings.primaryHsl);
      root.style.setProperty('--secondary', resolved.themeSettings.secondaryHsl);
      return resolved;
    }
  }
  return null;
};

export const useSchoolStore = create<SchoolState>((set, get) => {
  const allSchools = getInitialSchools();
  const initialSchool = getInitialSchool(allSchools);

  return {
    currentSchool: initialSchool,
    selectedCountry: initialSchool ? initialSchool.country : null,
    loading: false,
    error: null,
    activeLanguage: 'English',
    exchangeRates: STATIC_FALLBACK_RATES,
    fetchExchangeRates: async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (response.ok) {
          const data = await response.json();
          if (data && data.rates) {
            const newRates = { ...get().exchangeRates };
            for (const key of Object.keys(newRates)) {
              if (data.rates[key]) {
                newRates[key] = data.rates[key];
              }
            }
            set({ exchangeRates: newRates });
            console.log('Live exchange rates loaded successfully:', newRates);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch live exchange rates:', err);
      }
    },
    setLanguage: (_lang: string) => {
      set({ activeLanguage: 'English' });
      document.documentElement.dir = 'ltr';
    },
    schools: allSchools,

    resolveSchool: async (subdomain: string) => {
      set({ loading: true, error: null });
      try {
        const resolved = get().schools.find(s => s.domain === subdomain) || get().schools[0];
        set({ currentSchool: resolved, selectedCountry: resolved.country, loading: false });
        if (typeof window !== 'undefined') {
          localStorage.setItem('ah_current_school_domain', resolved.domain);
        }
        get().applyTheme(resolved.themeSettings);
        return resolved;
      } catch (err) {
        const errorMsg = 'Failed to resolve school configuration';
        set({ error: errorMsg, loading: false });
        throw new Error(errorMsg);
      }
    },

    applyTheme: (theme: SchoolTheme) => {
      const root = document.documentElement;
      root.style.setProperty('--primary', theme.primaryHsl);
      root.style.setProperty('--ring', theme.primaryHsl);
      root.style.setProperty('--accent', theme.primaryHsl);
      root.style.setProperty('--secondary', theme.secondaryHsl);
    },

    setCountry: (country: SupportedCountry) => {
      set((state) => {
        if (!state.currentSchool) return {};
        return {
          selectedCountry: country,
          currentSchool: {
            ...state.currentSchool,
            country
          }
        };
      });
    },

    addSchool: (school: SchoolInfo) => {
      set((state) => {
        const updated = [...state.schools, school];
        if (typeof window !== 'undefined') {
          const dynamicSchools = updated.filter(
            s => !INITIAL_SCHOOLS.some(init => init.schoolId === s.schoolId)
          );
          localStorage.setItem('ah_dynamic_schools', JSON.stringify(dynamicSchools));
        }
        return { schools: updated };
      });
    },

    formatCurrency: (amount: number, targetCurrency?: string) => {
      const school = get().currentSchool;
      const country = school?.country || 'US';
      const config = COUNTRY_CONFIGS[country];
      
      const currencyCode = targetCurrency || school?.currencyOverride || config.currency;
      const symbol = config.currencySymbol;
      
      const rates = get().exchangeRates;
      const baseRate = rates[config.currency] || 1.0;
      const targetRate = rates[currencyCode] || 1.0;
      const convertedAmount = amount * (targetRate / baseRate);

      return `${symbol} ${convertedAmount.toLocaleString(undefined, {
        minimumFractionDigits: currencyCode === 'PKR' || currencyCode === 'SAR' ? 0 : 2,
        maximumFractionDigits: currencyCode === 'PKR' || currencyCode === 'SAR' ? 0 : 2,
      })}`;
    },

    getCountryConfig: () => {
      const country = get().currentSchool?.country || 'US';
      return COUNTRY_CONFIGS[country];
    },

    convertCurrency: (amount: number, from: string, to: string) => {
      const rates = get().exchangeRates;
      const fromRate = rates[from] || 1.0;
      const toRate = rates[to] || 1.0;
      return amount * (toRate / fromRate);
    },

    getPhonePrefix: () => {
      const country = get().currentSchool?.country || 'US';
      return COUNTRY_CONFIGS[country]?.phonePrefix || '+1';
    },

    getRollLabel: () => {
      const country = get().currentSchool?.country || 'US';
      return COUNTRY_CONFIGS[country]?.rollNumberLabel || 'Student ID';
    },

    updateSchoolTheme: (schoolId: string, primaryHsl: string) => {
      set((state) => {
        const updatedSchools = state.schools.map(s => {
          if (s.schoolId === schoolId) {
            return {
              ...s,
              themeSettings: {
                ...s.themeSettings,
                primaryHsl
              }
            };
          }
          return s;
        });

        // Save back to localStorage if it's dynamic
        if (typeof window !== 'undefined') {
          const dynamicSchools = updatedSchools.filter(
            s => !INITIAL_SCHOOLS.some(init => init.schoolId === s.schoolId)
          );
          localStorage.setItem('ah_dynamic_schools', JSON.stringify(dynamicSchools));
        }

        const current = state.currentSchool;
        const updatedCurrent = current && current.schoolId === schoolId
          ? { ...current, themeSettings: { ...current.themeSettings, primaryHsl } }
          : current;

        if (updatedCurrent) {
          get().applyTheme(updatedCurrent.themeSettings);
        }

        return {
          schools: updatedSchools,
          currentSchool: updatedCurrent
        };
      });
    }
  };
});
