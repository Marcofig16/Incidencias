import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

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

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario autenticado:", userCredential.user);
      errorMessage.textContent = "";
      window.location.hash = "#/dashboard";
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      errorMessage.textContent = "Credenciales incorrectas. Por favor, intenta de nuevo.";
    }
  });
};
