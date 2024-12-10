// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log(`Running in environment: ${import.meta.env.VITE_ENV_NAME}`);
console.log("Firebase configuration:", firebaseConfig);

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios de Firebase
const auth = getAuth(app);
const db = getFirestore(app);

// Conectar a emuladores solo en entorno de desarrollo
if (import.meta.env.VITE_ENV_NAME === "Development") {
  console.log("Connecting to Firebase emulators...");

  connectAuthEmulator(auth, import.meta.env.VITE_AUTH_EMULATOR_HOST);
  connectFirestoreEmulator(
    db,
    import.meta.env.VITE_FIRESTORE_EMULATOR_HOST,
    Number(import.meta.env.VITE_FIRESTORE_EMULATOR_PORT)
  );

  console.log("Connected to Firestore emulator in Development mode");
} else {
  console.log("Connected to Firebase project:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
}

export { app, auth, db };