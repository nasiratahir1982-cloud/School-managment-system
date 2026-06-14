import { create } from 'zustand';
import { setupRealtimeSync, updateRealtimeData } from './firebase';

export interface PortalQuery {
  id: string;
  target: 'superadmin' | string; // 'superadmin' or school domain e.g., 'allied-school'
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
  reply?: string;
  senderEmail?: string;
}

interface QueryState {
  queries: PortalQuery[];
  loading: boolean;
  initialized: boolean;
  initialize: () => void;
  sendQuery: (query: Omit<PortalQuery, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  replyToQuery: (id: string, replyMessage: string) => Promise<boolean>;
}

export const useQueryStore = create<QueryState>((set, get) => ({
  queries: [],
  loading: false,
  initialized: false,
  
  initialize: () => {
    if (get().initialized) return;
    
    set({ loading: true, initialized: true });
    
    // Subscribe to portal_queries node in Firebase
    setupRealtimeSync('portal_queries', (data) => {
      if (data && typeof data === 'object') {
        // Data might be an object map (id -> query) or an array
        let queriesArray: PortalQuery[] = [];
        if (Array.isArray(data)) {
          queriesArray = data.filter(Boolean);
        } else {
          queriesArray = Object.values(data);
        }
        
        // Sort by createdAt descending
        queriesArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        set({ queries: queriesArray, loading: false });
      } else {
        set({ queries: [], loading: false });
      }
    });
  },
  
  sendQuery: async (queryData) => {
    try {
      const currentQueries = get().queries;
      const newQuery: PortalQuery = {
        ...queryData,
        id: `query-${Date.now()}`,
        status: 'open',
        createdAt: new Date().toISOString(),
      };
      
      const updatedQueries = [newQuery, ...currentQueries];
      
      // We store it as an array/list in Firebase or object map. Let's use object map for easier updates
      const queriesMap = updatedQueries.reduce((acc, q) => {
        acc[q.id] = q;
        return acc;
      }, {} as Record<string, PortalQuery>);
      
      await updateRealtimeData('portal_queries', queriesMap);
      return true;
    } catch (e) {
      console.error("Failed to send query:", e);
      return false;
    }
  },
  
  replyToQuery: async (id, replyMessage) => {
    try {
      const currentQueries = get().queries;
      const updatedQueries = currentQueries.map(q => {
        if (q.id === id) {
          return { ...q, status: 'resolved', reply: replyMessage };
        }
        return q;
      });
      
      const queriesMap = updatedQueries.reduce((acc, q) => {
        acc[q.id] = q;
        return acc;
      }, {} as Record<string, PortalQuery>);
      
      await updateRealtimeData('portal_queries', queriesMap);
      return true;
    } catch (e) {
      console.error("Failed to reply to query:", e);
      return false;
    }
  }
}));
