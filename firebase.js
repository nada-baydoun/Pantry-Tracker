// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWm0BodZaWi7fQjICxOmPjXruXMHP_9lA",
  authDomain: "inventory-management-61ecd.firebaseapp.com",
  projectId: "inventory-management-61ecd",
  storageBucket: "inventory-management-61ecd.appspot.com",
  messagingSenderId: "62915504170",
  appId: "1:62915504170:web:1a191cd6aab4a69733bb53",
  measurementId: "G-DEEHQGGV1X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Firebase Storage
const firestore = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Export Firestore and Firebase Storage
export { firestore, storage };
