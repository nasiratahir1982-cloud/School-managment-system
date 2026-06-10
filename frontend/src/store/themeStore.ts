import { create } from 'zustand';

interface ThemeState {
  darkMode: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  const savedTheme = localStorage.getItem('ah_dark_mode');
  const isDark = savedTheme !== null ? savedTheme === 'true' : true;

  // Initial application of theme classes
  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    localStorage.setItem('ah_dark_mode', String(dark));
    if (dark) {
      root.classList.add('dark');
      root.style.setProperty('--background', '222 47% 6%'); // Sleek dark blue
      root.style.setProperty('--foreground', '213 31% 91%');
      root.style.setProperty('--card', '222 47% 9%');
      root.style.setProperty('--card-foreground', '210 40% 98%');
      root.style.setProperty('--border', '217.2 32.6% 16%');
      root.style.setProperty('--input', '217.2 32.6% 16%');
      root.style.setProperty('--muted', '223 47% 11%');
      root.style.setProperty('--muted-foreground', '215.4 16.3% 56.9%');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--background', '210 30% 95%'); // Soft premium light gray-blue background
      root.style.setProperty('--foreground', '222 47% 10%'); // Ultra-dark text for absolute readability
      root.style.setProperty('--card', '0 0% 100%'); // White cards
      root.style.setProperty('--card-foreground', '222 47% 10%'); // Ultra-dark card text
      root.style.setProperty('--border', '210 20% 88%'); // Slightly darker, visible card borders
      root.style.setProperty('--input', '210 20% 88%');
      root.style.setProperty('--muted', '210 20% 92%'); // Contrast muted background
      root.style.setProperty('--muted-foreground', '215 16% 35%'); // Deeper gray for muted text
    }
  };

  applyTheme(isDark);

  return {
    darkMode: isDark,
    toggleTheme: () => set((state) => {
      const next = !state.darkMode;
      applyTheme(next);
      return { darkMode: next };
    }),
    setTheme: (dark) => {
      applyTheme(dark);
      set({ darkMode: dark });
    }
  };
});
