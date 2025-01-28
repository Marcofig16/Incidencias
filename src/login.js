import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const renderLogin = () => {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h2 class="text-center">Iniciar Sesión</h2>
    <form id="login-form" class="mt-3">
      <div class="mb-3">
        <label for="email" class="form-label">Correo Electrónico</label>
        <input type="email" class="form-control" id="email" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input type="password" class="form-control" id="password" required>
      </div>
      <button type="submit" class="btn btn-primary w-100">Ingresar</button>
    </form>
    <div id="error-message" class="text-danger mt-3"></div>
  `;

  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      errorMessage.textContent = "Por favor, complete todos los campos.";
      return;
    }

    try {
      // Autenticación del usuario
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener el rol del usuario desde Firestore
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log("Usuario autenticado:", user.email, "Rol:", userData.rol);

        // Guardar los datos del usuario en localStorage
        localStorage.setItem("usuario", JSON.stringify({
          uid: user.uid,
          nombre: userData.nombre,
          rol: userData.rol,
          email: user.email
        }));

        errorMessage.textContent = "";

        // Redirigir al módulo correspondiente según el rol
        redirigirSegunRol(userData.rol);
      } else {
        throw new Error("No se encontró información de rol para este usuario.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      errorMessage.textContent = "Error al iniciar sesión: " + (error.message || "Intente nuevamente.");
    }
  });
};

// Función para redirigir a la vista correspondiente según el rol
const redirigirSegunRol = (rol) => {
  switch (rol) {
    case "administrador":
      import("./adminDashboard.js").then(({ renderAdminDashboard }) => {
        renderAdminDashboard();
      });
      break;
    case "interno":
    case "externo":  // 🔥 Ambos roles van a mostrarClientes.js
      import("./mostrarClientes.js").then(({ renderMostrarClientes }) => {
        renderMostrarClientes();
      });
      break;
    default:
      console.error("Rol desconocido:", rol);
      alert("Acceso denegado. Rol desconocido.");
  }
};
