import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB5jhrEr8C6rp9YC5vmqJk1DL7XDcoYAus",
  authDomain: "school-management-system-cac21.firebaseapp.com",
  databaseURL: "https://school-management-system-cac21-default-rtdb.firebaseio.com",
  projectId: "school-management-system-cac21",
  storageBucket: "school-management-system-cac21.firebasestorage.app",
  messagingSenderId: "324840021726",
  appId: "1:324840021726:web:58cfb07f0cb4b0c21b2c4f"
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
