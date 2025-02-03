import { auth, db } from "./firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { renderAdminDashboard } from "./adminDashboard.js";
import { renderTablaClientes } from "./mostrarClientes.js"; // 🔥 Usado para "interno" y "externo"
import { renderLogin } from "./login.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM completamente cargado.");
  window.usuarioActual = null;
  window.evitarRedireccion = false;

  // 🔹 Iniciar mostrando el login siempre
  renderLogin();

  const renderDashboard = (rol) => {
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div>
          <p id="userInfo">Usuario: ${window.usuarioActual?.email || "Desconocido"} (${rol || "Sin rol"})</p>
          <p id="datetime"></p>
        </div>
        <button id="logout-button" class="btn btn-danger">Cerrar Sesión</button>
      </div>
      <div id="dashboard-content" class="mt-4"></div>
    `;

    document.getElementById("logout-button").addEventListener("click", cerrarSesion);

    const datetimeElement = document.getElementById("datetime");
    if (datetimeElement) {
      const updateDateTime = () => {
        datetimeElement.innerText = `Fecha y hora: ${new Date().toLocaleString()}`;
      };
      updateDateTime();
      setInterval(updateDateTime, 1000);
    }

    const dashboardContent = document.getElementById("dashboard-content");
    if (!rol) {
      console.error("Rol no definido, cerrando sesión...");
      alert("Error: No se encontró rol para este usuario.");
      cerrarSesion();
      return;
    }

    switch (rol) {
      case "administrador":
        renderAdminDashboard(dashboardContent);
        break;
      case "interno":
      case "externo": // 🔥 Ambos roles van a mostrarClientes.js
        renderTablaClientes(dashboardContent);
        break;
      default:
        console.error("Rol desconocido:", rol);
        alert("Error: No tienes permisos para acceder.");
        cerrarSesion();
    }
  };

  // 🔹 Función para cerrar sesión
  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("usuario");
      window.usuarioActual = null;
      console.log("Sesión cerrada");
      renderLogin();
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  // 🔹 Escuchar cambios en la autenticación
  onAuthStateChanged(auth, async (user) => {
    if (user && !window.evitarRedireccion) {
      console.log("Usuario autenticado:", user.email);

      try {
        const userRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (!userData.rol) {
            console.error("El usuario no tiene rol asignado.");
            alert("Error: No tienes permisos para acceder.");
            cerrarSesion();
            return;
          }

          window.usuarioActual = {
            uid: user.uid,
            email: user.email,
            rol: userData.rol,
            nombre: userData.nombre,
          };

          console.log("Redirigiendo al dashboard...");
          renderDashboard(userData.rol);
        } else {
          console.error("No se encontró información del usuario en Firestore.");
          alert("Error: No tienes permisos para acceder.");
          cerrarSesion();
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        cerrarSesion();
      }
    } else {
      console.log("No hay usuario autenticado.");
    }

    window.evitarRedireccion = false;
  });
});
