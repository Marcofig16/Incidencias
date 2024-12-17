import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { renderAgregarCliente } from "./agregarCliente.js";
import { abrirFormularioIncidencia } from "./incidencias.js";

export const renderTablaClientes = async () => {
  const app = document.getElementById("app");

  // Verificar si el contenedor `app` está disponible
  if (!app) {
    console.error("El contenedor 'app' no está disponible en el DOM.");
    return;
  }

  // Renderizar la estructura inicial del HTML
  app.innerHTML = `
    <h2 class="text-center">Lista de Clientes</h2>
    <button id="btn-agregar-cliente" class="btn btn-primary mb-4">Agregar Cliente</button>
    <div id="clientes-container" class="table-responsive">
      <table id="clientes-table" class="table table-striped table-sm mt-4 table-hover table-interactiva">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody id="clientes-table-body">
          <tr>
            <td colspan="4">Cargando...</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="table-light">
            <td colspan="4" class="text-end small text-muted">
              * Doble click sobre una fila para ver/agregar incidencias
            </td>
          </tr>
        </tfoot>
      </table>      
    </div>
    <div id="clientes-cards" class="d-none"></div>
  `;

  const tableBody = document.getElementById("clientes-table-body");
  const cardsContainer = document.getElementById("clientes-cards");
  const tableContainer = document.getElementById("clientes-container");

  // Función para cargar clientes desde Firestore
  const cargarClientes = async () => {
    try {
      const clientesCol = collection(db, "clientes");
      const snapshot = await getDocs(clientesCol);

      const rows = [];
      const cards = [];

      snapshot.docs.forEach((doc) => {
        const cliente = doc.data();

        // Asegurar valores de ID y nombre
        const clienteId = doc.id;
        const clienteNombre = cliente.nombre || "N/A";

        // Agregar filas a la tabla
        rows.push(`
          <tr data-id="${clienteId}" data-nombre="${clienteNombre}">
            <td>${cliente.codigo || clienteId}</td>
            <td>${clienteNombre}</td>
            <td>${cliente.email || "N/A"}</td>
            <td>${cliente.telefono || "N/A"}</td>
          </tr>`);

        // Agregar tarjetas para vista móvil
        cards.push(`
          <div class="card mb-3" data-id="${clienteId}" data-nombre="${clienteNombre}">
            <div class="card-body">
              <h5 class="card-title">${clienteNombre}</h5>
              <p class="card-text"><strong>ID:</strong> ${cliente.codigo || clienteId}</p>
              <p class="card-text"><strong>Email:</strong> ${cliente.email || "N/A"}</p>
              <p class="card-text"><strong>Teléfono:</strong> ${cliente.telefono || "N/A"}</p>
            </div>
          </div>`);
      });

      tableBody.innerHTML = rows.join("");
      cardsContainer.innerHTML = cards.join("");
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
      tableBody.innerHTML = `<tr><td colspan='4' class="text-danger">Error al cargar los datos.</td></tr>`;
      cardsContainer.innerHTML = `<p class="text-danger">Error al cargar los datos.</p>`;
    }
  };

  // Delegación de eventos para la tabla
  tableBody.addEventListener("dblclick", (e) => {
    const row = e.target.closest("tr");
    if (row) {
      const id = row.dataset.id;
      const nombre = row.dataset.nombre;
      abrirFormularioIncidencia(id, nombre);
    }
  });

  // Delegación de eventos para tarjetas
  cardsContainer.addEventListener("dblclick", (e) => {
    const card = e.target.closest(".card");
    if (card) {
      const id = card.dataset.id;
      const nombre = card.dataset.nombre;
      abrirFormularioIncidencia(id, nombre);
    }
  });

  // Ajustar vista entre tabla y tarjetas
  const ajustarVista = () => {
    if (window.innerWidth <= 576) {
      tableContainer.classList.add("d-none");
      cardsContainer.classList.remove("d-none");
    } else {
      tableContainer.classList.remove("d-none");
      cardsContainer.classList.add("d-none");
    }
  };

  window.addEventListener("resize", ajustarVista);
  ajustarVista();

  // Botón para agregar cliente
  const btnAgregarCliente = document.getElementById("btn-agregar-cliente");
  if (btnAgregarCliente) {
    btnAgregarCliente.addEventListener("click", () => {
      renderAgregarCliente();
    });
  }

  // Cargar los clientes al inicio
  await cargarClientes();
};

// Ejecutar la función principal al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM completamente cargado.");
  renderTablaClientes();
});
