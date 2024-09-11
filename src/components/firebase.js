// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRV-R-Azm9SK-sgOhkqAue6lut5pkg0WY",
  authDomain: "contactlist-4b6f6.firebaseapp.com",
  projectId: "contactlist-4b6f6",
  storageBucket: "contactlist-4b6f6.appspot.com",
  messagingSenderId: "1011000806077",
  appId: "1:1011000806077:web:31b416b982297139d9c5d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export Auth and Firestore
export { auth, db };
export default app;


