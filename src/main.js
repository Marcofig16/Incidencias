import { renderLogin } from "./login.js";
import { renderClientes } from "./clientes.js";
import { cargarAdministracion } from "./admin.js"; 


document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM completamente cargado.");

  console.log("Modal encontrado:", document.getElementById("modalIncidencia"));
  console.log("Modal title encontrado:", document.getElementById("modalIncidenciaLabel"));


  const renderDashboard = () => {
    const app = document.getElementById("app");

    app.innerHTML = `
      <h2 class="text-center">Dashboard</h2>
      <p class="text-center">Bienvenido al sistema. Selecciona una acción:</p>
      <div class="text-center mt-4">
        <a href="#/clientes" class="btn btn-primary">Ver Clientes</a>
        <a href="#/admin" class="btn btn-secondary">Administración</a>
      </div>
    `;
  };

  const routes = {
    "/": () => {
      document.getElementById("app").innerHTML = "<h2>Bienvenido a la SPA Firebase</h2>Click en Login";
    },
    "/login": renderLogin,
    "/dashboard": renderDashboard,
    "/clientes": renderClientes,
    "/admin": cargarAdministracion,
  };

  const router = () => {
    const path = window.location.hash.slice(1) || "/";
    const render = routes[path] || (() => {
      document.getElementById("app").innerHTML = "<h2>Página no encontrada</h2>";
    });
    render();
  };

  window.addEventListener("hashchange", router);
  window.addEventListener("load", router);
});
