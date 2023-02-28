// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCOyZ8VMZ3goUSeZWQQ4kXapOagMjwKy4Q",
  authDomain: "familist-web-app.firebaseapp.com",
  projectId: "familist-web-app",
  storageBucket: "familist-web-app.appspot.com",
  messagingSenderId: "166667339601",
  appId: "1:166667339601:web:f954d76b63cb7f50c13570",
  measurementId: "G-5NZMTB78WQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();