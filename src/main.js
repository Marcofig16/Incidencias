import { renderTablaClientes } from "./mostrarClientes.js";
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM completamente cargado.");

  // Inicializar todos los tooltips de Bootstrap
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });

  const renderLogin = () => {
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

    // Manejador de evento para el envío del formulario
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
    
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
    
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Usuario autenticado:", userCredential.user);

        // Limpiar mensaje de error
        errorMessage.textContent = "";

        // Renderizar la página de clientes tras un inicio de sesión exitoso
        renderTablaClientes();

      } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        // Mostrar mensaje de error amigable al usuario
        if (error.code === "auth/user-not-found") {
          errorMessage.textContent = "Usuario no registrado.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage.textContent = "Contraseña incorrecta.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage.textContent = "Formato de correo no válido.";
        } else {
          errorMessage.textContent = "Error inesperado. Intenta de nuevo más tarde.";
        }
      }
    });
  };

  renderLogin();

});
