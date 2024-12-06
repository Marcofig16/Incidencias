import { listarColecciones } from "./listarColecciones.js";

export function cargarAdministracion() {
  // Obtén el contenedor principal de la aplicación
  const appContainer = document.getElementById("app");

  // Reemplaza el contenido del contenedor con la vista de administración
  appContainer.innerHTML = `
    <h1>Administración</h1>
    <button id="ver-colecciones" class="btn btn-primary">Ver Colecciones</button>
    <div id="resultados-colecciones" class="mt-3"></div>
  `;

  // Agrega un evento al botón para listar las colecciones
  const btnVerColecciones = document.getElementById("ver-colecciones");
  btnVerColecciones.addEventListener("click", async () => {
    // Cambia el texto del botón mientras se cargan los datos
    btnVerColecciones.textContent = "Cargando...";
    btnVerColecciones.disabled = true;

    // Llama a la función para listar colecciones y actualiza el DOM
    await listarColecciones();
    btnVerColecciones.textContent = "Ver Colecciones";
    btnVerColecciones.disabled = false;
  });
}
