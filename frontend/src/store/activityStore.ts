import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ActivityLog {
  id: string;
  timestamp: number;
  time: string;
  type: 'success' | 'info' | 'setup';
  message: string;
}

interface ActivityState {
  activities: ActivityLog[];
  addActivity: (activity: Omit<ActivityLog, 'id' | 'time' | 'timestamp'>) => void;
  clearActivities: () => void;
  refreshTimes: () => void;
}

const formatTimeAgo = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: '1',
    timestamp: Date.now() - 5000,
    time: 'Just now',
    type: 'info',
    message: 'System databases secured & regional compliance checks active.'
  },
  {
    id: '2',
    timestamp: Date.now() - 15 * 60000,
    time: '15 mins ago',
    type: 'setup',
    message: 'Roots International Toronto portal initialized with Canada compliance configuration.'
  },
  {
    id: '3',
    timestamp: Date.now() - 60 * 60000,
    time: '1 hour ago',
    type: 'success',
    message: 'Completed system backup and cleared cache memory pools.'
  }
];

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: INITIAL_ACTIVITIES,
      addActivity: (activity) => set((state) => {
        const newActivity: ActivityLog = {
          id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          time: 'Just now',
          ...activity
        };
        const updatedActivities = [newActivity, ...state.activities].map(act => ({
          ...act,
          time: formatTimeAgo(act.timestamp)
        })).slice(0, 50); // Keep last 50 activities
        
        return { activities: updatedActivities };
      }),
      clearActivities: () => set({ activities: [] }),
      refreshTimes: () => set((state) => ({
        activities: state.activities.map(act => ({
          ...act,
          time: formatTimeAgo(act.timestamp)
        }))
      }))
    }),
    {
      name: 'ah_network_activities',
    }
  )
);
