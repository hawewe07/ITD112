import { initializeApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  enableIndexedDbPersistence,
  collection,
  getDocs,
  writeBatch,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyApcwUtD16qRiYpqwZM_jAdYO13PpuDG-c",
  authDomain: "lab112-10d68.firebaseapp.com",
  projectId: "lab112-10d68",
  storageBucket: "lab112-10d68.appspot.com",
  messagingSenderId: "535047467584",
  appId: "1:535047467584:web:561b93c05b6a752ca725a5",
  measurementId: "G-86DCTYF261",
};

const app = initializeApp(firebaseConfig);

// Enable Firestore with Offline Persistence
const db = initializeFirestore(app, { experimentalForceLongPolling: true });

enableIndexedDbPersistence(db).catch((error) => {
  console.error("Offline persistence failed:", error.code);
});

isSupported()
  .then((supported) => supported && getAnalytics(app))
  .catch((error) => console.error("Analytics failed:", error));

export { app, db, collection, getDocs, writeBatch, doc, onSnapshot };
