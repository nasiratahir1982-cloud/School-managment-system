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
      let queriesMap: Record<string, PortalQuery> = {};
      
      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          data.filter(Boolean).forEach(q => { queriesMap[q.id] = q; });
        } else {
          queriesMap = { ...data };
        }
      }
      
      // Clean up any old demo queries that might be stuck in local storage
      let cleaned = false;
      for (const key of Object.keys(queriesMap)) {
        if (queriesMap[key].subject?.includes('Demo:')) {
          delete queriesMap[key];
          cleaned = true;
        }
      }
      
      // Force inject demo queries if they are missing
      let injected = false;
      const demoQueries: Record<string, PortalQuery> = {
        'query-demo-1': {
          id: 'query-demo-1',
          target: 'school-a',
          subject: 'Admission Process Query',
          message: 'Hello, I would like to know if admissions for Class 5 are still open for the upcoming session.',
          status: 'open',
          createdAt: new Date().toISOString()
        },
        'query-demo-2': {
          id: 'query-demo-2',
          target: 'school-b',
          subject: 'Fee Structure Inquiry',
          message: 'Could you please share the updated fee structure for the secondary section?',
          status: 'open',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        'query-demo-3': {
          id: 'query-demo-3',
          target: 'superadmin',
          subject: 'System Integration Support',
          message: 'We need help integrating the biometric attendance system.',
          status: 'open',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      };

      for (const [id, q] of Object.entries(demoQueries)) {
        if (!queriesMap[id]) {
          queriesMap[id] = q;
          injected = true;
        }
      }

      if (injected || cleaned) {
        updateRealtimeData('portal_queries', queriesMap);
      }

      const queriesArray = Object.values(queriesMap);
      // Sort by createdAt descending
      queriesArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      set({ queries: queriesArray, loading: false });
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
          return { ...q, status: 'resolved' as 'resolved', reply: replyMessage };
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
