import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const renderCrearUsuario = (dashboardContent) => {
  if (!dashboardContent) return;

  dashboardContent.innerHTML = `
    <h2 class="text-center">Crear Nuevo Usuario</h2>
    <form id="crear-usuario-form" class="mt-3">
      <div class="mb-3">
        <label for="nombre" class="form-label">Nombre</label>
        <input type="text" class="form-control" id="nombre" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Correo Electrónico</label>
        <input type="email" class="form-control" id="email" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input type="password" class="form-control" id="password" required>
      </div>
      <div class="mb-3">
        <label for="rol" class="form-label">Rol</label>
        <select class="form-control" id="rol" required>
          <option value="interno">Interno</option>
          <option value="externo">Externo</option>
          <option value="administrador">Administrador</option>
        </select>
      </div>
      <button type="submit" class="btn btn-success w-100">Crear Usuario</button>
    </form>
    <button id="volver-panel" class="btn btn-secondary w-100 mt-3">Volver al Panel</button>
  `;

  const form = document.getElementById("crear-usuario-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rol = document.getElementById("rol").value;

    try {
      const adminUser = auth.currentUser;
      if (!adminUser) {
        alert("Error: No hay un administrador autenticado.");
        return;
      }

      console.log("Administrador actual:", adminUser.email);

      // Crear el nuevo usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre,
        email,
        rol
      });

      console.log("Usuario creado correctamente:", user.email);

      // Mostrar mensaje de éxito sin cambiar de ventana
      alert("Usuario creado correctamente");

      // Limpiar el formulario para que se pueda ingresar otro usuario
      form.reset();

    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("Error al crear usuario: " + error.message);
    }
  });

  // ✅ MANTIENE FUNCIONALIDAD DEL BOTÓN "VOLVER AL PANEL"
  document.getElementById("volver-panel").addEventListener("click", () => {
    import("./adminDashboard.js").then(({ renderAdminDashboard }) => {
      renderAdminDashboard(dashboardContent);
    }).catch((error) => {
      console.error("Error al volver al panel de administración:", error);
    });
  });
};
