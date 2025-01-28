import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

// Configurar persistencia de sesión SOLO si no está ya autenticado
if (!auth.currentUser) {
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      console.log("Persistencia de sesión configurada en 'session'.");
    })
    .catch((error) => {
      console.error("Error configurando la persistencia de sesión:", error);
    });
} else {
  console.log("Usuario ya autenticado, manteniendo sesión activa.");
}

console.log("Conectado al proyecto Firebase:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

export { app, auth, db };
