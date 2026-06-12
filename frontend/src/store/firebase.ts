import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set as dbSet } from 'firebase/database';

// Firebase configuration using environment variables or standard placeholders
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyPlaceholderForSyncSetup",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "academichub-sync-rtdb.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://academichub-sync-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "academichub-sync-rtdb",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "academichub-sync-rtdb.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);

// Check if using dummy placeholder config
export const isUsingDummyConfig = () => {
  return firebaseConfig.apiKey.includes("DummyKeyPlaceholder");
};

// Utility function to sync a path in Realtime Database
export const setupRealtimeSync = (path: string, callback: (data: any) => void) => {
  const dbRef = ref(rtdb, path);
  return onValue(dbRef, (snapshot) => {
    const val = snapshot.val();
    if (val) {
      callback(val);
    }
  }, (error) => {
    console.warn(`Firebase Realtime sync failed for path "${path}":`, error);
  });
};

// Utility function to write data to a path in Realtime Database
export const updateRealtimeData = async (path: string, data: any) => {
  try {
    const dbRef = ref(rtdb, path);
    await dbSet(dbRef, data);
    return true;
  } catch (error) {
    console.error(`Firebase Realtime write failed for path "${path}":`, error);
    return false;
  }
};
