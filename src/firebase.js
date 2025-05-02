// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2zURLoNmlM8KkrGf0I9EPUbRSltrfF9o",
  authDomain: "hiddenfriends-747e1.firebaseapp.com",
  projectId: "hiddenfriends-747e1",
  storageBucket: "hiddenfriends-747e1.appspot.com",
  messagingSenderId: "135241231437",
  appId: "1:135241231437:web:9335b27faed50d191c0004",
  measurementId: "G-GD4FXSHH0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
