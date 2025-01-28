import { renderTablaClientes } from "./mostrarClientes.js";
import { renderCrearUsuario } from "./crearUsuario.js";
import { renderVerUsuarios } from "./verUsuarios.js";

export const renderAdminDashboard = (dashboardContent) => {
  if (!dashboardContent) return;

  dashboardContent.innerHTML = `
    <div class="text-center">
      <h2 class="mb-4">Panel de Administración</h2>
      <div class="row justify-content-center">
        <div class="col-md-3 mb-3">
          <button id="crear-usuario-btn" class="btn btn-success w-100">Crear Nuevo Usuario</button>
        </div>
        <div class="col-md-3 mb-3">
          <button id="ver-usuarios-btn" class="btn btn-primary w-100">Ver Usuarios</button>
        </div>
        <div class="col-md-3 mb-3">
          <button id="gestionar-clientes-btn" class="btn btn-primary w-100">Gestionar Clientes</button>
        </div>
        <div class="col-md-3">
          <button id="cerrar-sesion-btn" class="btn btn-danger w-100">Cerrar Sesión</button>
        </div>
      </div>
    </div>
  `;

  const limpiarVista = () => {
    dashboardContent.innerHTML = ""; // Limpiar el contenido antes de cargar la nueva vista
  };

  const crearUsuarioBtn = document.getElementById("crear-usuario-btn");
  if (crearUsuarioBtn) {
    crearUsuarioBtn.addEventListener("click", () => {
      limpiarVista();
      renderCrearUsuario(dashboardContent);
    });
  }

  const verUsuariosBtn = document.getElementById("ver-usuarios-btn");
  if (verUsuariosBtn) {
    verUsuariosBtn.addEventListener("click", () => {
      limpiarVista();
      renderVerUsuarios(dashboardContent);
    });
  }

  const gestionarClientesBtn = document.getElementById("gestionar-clientes-btn");
  if (gestionarClientesBtn) {
    gestionarClientesBtn.addEventListener("click", () => {
      limpiarVista();
      renderTablaClientes(dashboardContent);
    });
  }

  const cerrarSesionBtn = document.getElementById("cerrar-sesion-btn");
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      document.getElementById("logout-button").click();
    });
  }
};
