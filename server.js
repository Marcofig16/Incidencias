const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Configurar entorno de emuladores locales
const FIRESTORE_EMULATOR_PORT = "9150"; // Asegúrate que este sea el puerto correcto
process.env.FIRESTORE_EMULATOR_HOST = `127.0.0.1:${FIRESTORE_EMULATOR_PORT}`;
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

// Inicializar Firebase Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: "pwa-spa-firebase", // Asegúrate de usar el mismo projectId en los emuladores
  });
}

// Configurar Firestore para conectarse al emulador explícitamente
const firestore = admin.firestore();
firestore.settings({
  host: `127.0.0.1:${FIRESTORE_EMULATOR_PORT}`,
  ssl: false, // Desactiva SSL porque estás en local
});

const app = express();
const PORT = 6000;

app.use(cors());
app.use(express.json());

// Ruta para crear un usuario en Authentication y guardarlo en Firestore
app.post("/api/crearUsuario", async (req, res) => {
  const { email, password, nombre, rol } = req.body;

  if (!email || !password || !nombre || !rol) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    console.log("Conectando a emuladores...");

    // Crear usuario en Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: nombre,
    });
    console.log(`Usuario creado en Authentication: UID ${userRecord.uid}`);

    // Guardar usuario en Firestore
    await firestore.collection("usuarios").doc(userRecord.uid).set({
      nombre,
      rol,
      email,
      createdAt: new Date().toISOString(),
    });
    console.log(`Usuario guardado en Firestore: UID ${userRecord.uid}`);

    res.status(201).json({
      message: "Usuario creado correctamente en Authentication y Firestore",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error("Error al crear el usuario o guardar en Firestore:", error);
    res.status(500).json({ error: "Error al crear el usuario o guardar en Firestore." });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
