// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-fusion-lab-a13f7.firebaseapp.com",
  projectId: "ai-fusion-lab-a13f7",
  storageBucket: "ai-fusion-lab-a13f7.firebasestorage.app",
  messagingSenderId: "492166644340",
  appId: "1:492166644340:web:a042a7dceb551a50364721",
  measurementId: "G-PQWCQ55SPR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);