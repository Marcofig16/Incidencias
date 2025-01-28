export const renderExternalDashboard = () => {
    const app = document.getElementById("app");
  
    app.innerHTML = `
      <div class="container mt-5">
        <h2 class="text-center">Panel Externo</h2>
        <div class="row mt-4">
          <div class="col-md-12">
            <button id="btn-ver-clientes" class="btn btn-primary w-100 mb-3">Ver Clientes</button>
            <button id="btn-salir" class="btn btn-danger w-100">Cerrar Sesión</button>
          </div>
        </div>
      </div>
    `;
  
    document.getElementById("btn-ver-clientes").addEventListener("click", () => {
      window.location.hash = "#/dashboard-externo";
    });
  
    document.getElementById("btn-salir").addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.hash = "#/login";
    });
  };
  