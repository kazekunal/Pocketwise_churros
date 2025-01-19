// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore, collection, getDoc, addDoc, updateDoc, doc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIjVP6gAqeV4mLabZPIm8E3FN5oDq2cUI",
  authDomain: "pocketwise-7f278.firebaseapp.com",
  projectId: "pocketwise-7f278",
  storageBucket: "pocketwise-7f278.firebasestorage.app",
  messagingSenderId: "707354446767",
  appId: "1:707354446767:web:4cc5686f459439f2e27d5a",
  measurementId: "G-DN504JWFH8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore(app);
export default app;