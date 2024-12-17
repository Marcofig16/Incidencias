import { renderTablaClientes } from "./mostrarClientes.js";
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM completamente cargado.");

  // Renderizar Login
  const renderLogin = () => {
    const app = document.getElementById("app");
    if (!app) {
      console.error("No se encontró el contenedor 'app' en el DOM.");
      return;
    }

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

    if (!loginForm || !errorMessage) {
      console.error("No se encontraron los elementos del formulario en el DOM.");
      return;
    }

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log(`Usuario autenticado: ${user.email}`);
        renderDashboard();
      } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        errorMessage.textContent = "Credenciales incorrectas. Por favor, intenta de nuevo.";
      }
    });
  };

  // Renderizar el Dashboard
  const renderDashboard = () => {
    const app = document.getElementById("app");
    if (!app) {
      console.error("No se encontró el contenedor 'app' en el DOM.");
      return;
    }

    app.innerHTML = `
      <h2 class="text-center">Listado de Clientes</h2>
      <div id="clientes-container" class="mt-4"></div>
      <button id="logout-button" class="btn btn-danger mt-3">Cerrar Sesión</button>
    `;

    renderTablaClientes(); // Cargar tabla de clientes

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", cerrarSesion);
    } else {
      console.error("No se encontró el botón de cerrar sesión en el DOM.");
    }
  };

  // Cerrar sesión
  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  // Iniciar la aplicación
  renderLogin();
});
