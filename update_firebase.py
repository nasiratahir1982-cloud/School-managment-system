import re

def modify_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    target = """const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyPlaceholderForSyncSetup",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "academichub-sync-rtdb.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://academichub-sync-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "academichub-sync-rtdb",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "academichub-sync-rtdb.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};"""

    replacement = """const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB5jhrEr8C6rp9YC5vmqJk1DL7XDcoYAus",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "school-management-system-cac21.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://school-management-system-cac21-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "school-management-system-cac21",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "school-management-system-cac21.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "324840021726",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:324840021726:web:58cfb07f0cb4b0c21b2c4f"
};"""

    if target in content:
        content = content.replace(target, replacement)
        print("Replaced Firebase Config successfully.")
    else:
        print("Target not found. Please verify the exact string.")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    modify_file('frontend/src/store/firebase.ts')
