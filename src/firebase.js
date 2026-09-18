import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const isFirebaseConfigured = Boolean(
  process.env.VUE_APP_FIREBASE_API_KEY &&
  process.env.VUE_APP_FIREBASE_API_KEY.trim() !== "" &&
  !process.env.VUE_APP_FIREBASE_API_KEY.includes("YOUR_")
);

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY || "AIzaSyDummyKeyForPreviewAndDevelopment0",
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN || "portfolio-admin-demo.firebaseapp.com",
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID || "portfolio-admin-demo",
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET || "portfolio-admin-demo.appspot.com",
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.VUE_APP_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456",
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID || "G-DEMO12345",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let db;
let storage;

try {
  db = getFirestore(app);
} catch (error) {
  console.warn("Firestore init warning:", error);
}

try {
  storage = getStorage(app);
} catch (error) {
  console.warn("Firebase Storage init warning:", error);
}

export { app, db, storage };
