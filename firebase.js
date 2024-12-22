import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiUp8rpqVqvgekYm33RfocMQ9thKKMpmM",
  authDomain: "lanuzaitd112.firebaseapp.com",
  projectId: "lanuzaitd112",
  storageBucket: "lanuzaitd112.appspot.com",
  messagingSenderId: "902903813847",
  appId: "1:902903813847:web:8cf8f9a2306adff41a4292",
  measurementId: "G-HWP76LZEH4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

export { db };
