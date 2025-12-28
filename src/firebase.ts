// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "your key",
  authDomain: "your domain",
  projectId: "***********d82b",
  storageBucket: "*******b.firebasestorage.app",
  messagingSenderId: "101906581740",
  appId: "1:101906581740:web:4c9b8180c2c40f121f3dc9",
  measurementId: "G-CZ76TPBGXY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

const analytics = getAnalytics(app);
