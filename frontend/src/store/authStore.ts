import { create } from 'zustand';

export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'teacher' 
  | 'student' 
  | 'parent'
  | 'vice_principal';

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (session: UserSession) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('ah_user_session') || 'null'),
  isAuthenticated: localStorage.getItem('ah_user_session') !== null,

  login: (session: UserSession) => {
    localStorage.setItem('ah_user_session', JSON.stringify(session));
    set({ user: session, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('ah_user_session');
    set({ user: null, isAuthenticated: false });
  }
}));
