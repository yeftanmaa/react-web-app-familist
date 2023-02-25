// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOyZ8VMZ3goUSeZWQQ4kXapOagMjwKy4Q",
  authDomain: "familist-web-app.firebaseapp.com",
  projectId: "familist-web-app",
  storageBucket: "familist-web-app.appspot.com",
  messagingSenderId: "166667339601",
  appId: "1:166667339601:web:f954d76b63cb7f50c13570",
  measurementId: "G-5NZMTB78WQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)