import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set as dbSet } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase configuration using environment variables or standard placeholders
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB5jhrEr8C6rp9YC5vmqJk1DL7XDcoYAus",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "school-management-system-cac21.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://school-management-system-cac21-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "school-management-system-cac21",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "school-management-system-cac21.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "324840021726",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:324840021726:web:58cfb07f0cb4b0c21b2c4f"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Check if using dummy placeholder config
export const isUsingDummyConfig = () => {
  return firebaseConfig.apiKey.includes("DummyKeyPlaceholder");
};

// Utility function to sync a path in Realtime Database
export const setupRealtimeSync = (path: string, callback: (data: any) => void) => {
  if (isUsingDummyConfig()) {
    // Fallback to localStorage for demo/offline testing
    const localData = localStorage.getItem(`ah_mock_${path}`);
    if (localData) {
      try {
        callback(JSON.parse(localData));
      } catch (e) {
        console.error("Error parsing local mock data", e);
      }
    }
    // Return a dummy unsubscribe function
    return () => {};
  }

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
  if (isUsingDummyConfig() || !auth.currentUser) {
    console.log(`Firebase Realtime write locally mocked for path "${path}"`);
    localStorage.setItem(`ah_mock_${path}`, JSON.stringify(data));
    // Trigger a custom event so other tabs/components listening can update
    window.dispatchEvent(new CustomEvent('ah_mock_db_update', { detail: { path, data } }));
    return true;
  }
  
  try {
    const dbRef = ref(rtdb, path);
    await dbSet(dbRef, data);
    return true;
  } catch (error) {
    console.error(`Firebase Realtime write failed for path "${path}":`, error);
    return false;
  }
};
