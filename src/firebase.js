// Import Firebase modules
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  update,
} from "firebase/database";

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyBikoSMUAdpfXeC6kL7DVtp2H7GOCwnGus",
  authDomain: "hivez-modtools.firebaseapp.com",
  databaseURL:
    "https://hivez-modtools-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hivez-modtools",
  storageBucket: "hivez-modtools.firebasestorage.app",
  messagingSenderId: "476428998567",
  appId: "1:476428998567:web:6285e06672d70400e04882",
  measurementId: "G-XBK6HBD3DK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const db = getDatabase(app);

export { db, ref, set, push, onValue, update };
