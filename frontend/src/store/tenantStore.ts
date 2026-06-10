import { create } from 'zustand';

export type SupportedCountry = 'PK' | 'UK' | 'AE' | 'SA' | 'US' | 'CA';

export interface TenantTheme {
  primaryHsl: string; // e.g. "263.4 70% 50.4%"
  secondaryHsl: string; // e.g. "217.2 32.6% 16%"
}

export interface TenantInfo {
  tenantId: string;
  schoolName: string;
  domain: string;
  logoUrl: string | null;
  country: SupportedCountry;
  city: string;
  campusCount: number;
  currentAcademicSession: string;
  themeSettings: TenantTheme;
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
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  PKR: 278.5,
  GBP: 0.78,
  AED: 3.67,
  SAR: 3.75,
  CAD: 1.37,
};

interface TenantState {
  currentTenant: TenantInfo | null;
  selectedCountry: SupportedCountry | null;
  loading: boolean;
  error: string | null;
  tenants: TenantInfo[];
  activeLanguage: string;
  setLanguage: (lang: string) => void;
  resolveTenant: (subdomain: string) => Promise<TenantInfo>;
  applyTheme: (theme: TenantTheme) => void;
  setCountry: (country: SupportedCountry) => void;
  addTenant: (tenant: TenantInfo) => void;
  formatCurrency: (amount: number, targetCurrency?: string) => string;
  getCountryConfig: () => CountryConfig;
  convertCurrency: (amount: number, from: string, to: string) => number;
  getPhonePrefix: () => string;
  getRollLabel: () => string;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  currentTenant: null,
  selectedCountry: null,
  loading: false,
  error: null,
  activeLanguage: 'English',
  setLanguage: (_lang: string) => {
    set({ activeLanguage: 'English' });
    document.documentElement.dir = 'ltr';
  },
  tenants: [
    {
      tenantId: '11111111-1111-1111-1111-111111111111',
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
      tenantId: '22222222-2222-2222-2222-222222222222',
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
      tenantId: '33333333-3333-3333-3333-333333333333',
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
      tenantId: '44444444-4444-4444-4444-444444444444',
      schoolName: 'Beaconhouse London',
      domain: 'beaconhouse-uk',
      logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImcyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjREMyNjI2IiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0I5MTkwNiIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSJ1cmwoI2cyKSIvPjxwYXRoIGQ9Ik0zMCAyNSBMNzAgMjUgTDcwIDQ4IENDNzAgNjUsIDUwIDc4LCA1MCA3OEM1MCA3OCwgMzAgNjUsIDMwIDQ4IFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZCQkYyNCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTUwIDMzIEw2NSA0MCBMNTAgNDcgTDM1IDQwIFoiIGZpbGw9IiNGQkJGMjQiLz48cGF0aCBkPSJNNDEgNDMuNSBMNDEgNTEgQzQxIDU1LCA1OSA1NSwgNTkgNTEgTDU5IDQzLjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZCQkYyNCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTU4IDQyIEw1OCA1MiBMNjAgNTIgTDYwIDQyIFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
      country: 'UK',
      city: 'London',
      campusCount: 2,
      currentAcademicSession: '2026-2027',
      themeSettings: {
        primaryHsl: '346.8 77.2% 49.8%', // Crimson
        secondaryHsl: '222.2 47.4% 11.2%',
      }
    },
    {
      tenantId: '55555555-5555-5555-5555-555555555555',
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
      tenantId: '66666666-6666-6666-6666-666666666666',
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
      tenantId: '77777777-7777-7777-7777-777777777777',
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
      tenantId: '00000000-0000-0000-0000-000000000000',
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
  ],

  resolveTenant: async (subdomain: string) => {
    set({ loading: true, error: null });
    try {
      const resolved = get().tenants.find(t => t.domain === subdomain) || get().tenants[0];
      set({ currentTenant: resolved, selectedCountry: resolved.country, loading: false });
      get().applyTheme(resolved.themeSettings);
      return resolved;
    } catch (err) {
      const errorMsg = 'Failed to resolve tenant configuration';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  applyTheme: (theme: TenantTheme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primaryHsl);
    root.style.setProperty('--ring', theme.primaryHsl);
    root.style.setProperty('--accent', theme.primaryHsl);
    root.style.setProperty('--secondary', theme.secondaryHsl);
  },

  setCountry: (country: SupportedCountry) => {
    set((state) => {
      if (!state.currentTenant) return {};
      return {
        selectedCountry: country,
        currentTenant: {
          ...state.currentTenant,
          country
        }
      };
    });
  },

  addTenant: (tenant: TenantInfo) => {
    set((state) => ({
      tenants: [...state.tenants, tenant]
    }));
  },

  formatCurrency: (amount: number, targetCurrency?: string) => {
    const tenant = get().currentTenant;
    const country = tenant?.country || 'US';
    const config = COUNTRY_CONFIGS[country];
    
    const currencyCode = targetCurrency || tenant?.currencyOverride || config.currency;
    const symbol = config.currencySymbol;
    
    // Simulate real-time currency conversion
    const baseRate = EXCHANGE_RATES[config.currency] || 1.0;
    const targetRate = EXCHANGE_RATES[currencyCode] || 1.0;
    const convertedAmount = amount * (targetRate / baseRate);

    return `${symbol} ${convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits: currencyCode === 'PKR' || currencyCode === 'SAR' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'PKR' || currencyCode === 'SAR' ? 0 : 2,
    })}`;
  },

  getCountryConfig: () => {
    const country = get().currentTenant?.country || 'US';
    return COUNTRY_CONFIGS[country];
  },

  convertCurrency: (amount: number, from: string, to: string) => {
    const fromRate = EXCHANGE_RATES[from] || 1.0;
    const toRate = EXCHANGE_RATES[to] || 1.0;
    return amount * (toRate / fromRate);
  },

  getPhonePrefix: () => {
    const country = get().currentTenant?.country || 'US';
    return COUNTRY_CONFIGS[country]?.phonePrefix || '+1';
  },

  getRollLabel: () => {
    const country = get().currentTenant?.country || 'US';
    return COUNTRY_CONFIGS[country]?.rollNumberLabel || 'Student ID';
  }
}));
