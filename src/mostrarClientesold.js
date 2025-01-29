import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { abrirFormularioAgregarCliente } from "./agregarCliente.js";
import { abrirFormularioIncidencia } from "./incidencias.js";

export const renderTablaClientes = async (dashboardContent) => {
  if (!dashboardContent) {
    console.error("El contenedor para la tabla de clientes no está disponible.");
    return;
  }

  // Crear un sub-contenedor para la tabla si no existe
  let tablaClientes = document.getElementById("tabla-clientes");
  if (!tablaClientes) {
    tablaClientes = document.createElement("div");
    tablaClientes.id = "tabla-clientes";
    dashboardContent.appendChild(tablaClientes);
  }

  // Limpiar el contenido actual y renderizar la tabla
  tablaClientes.innerHTML = `
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
            <th>Incidencias</th>
          </tr>
        </thead>
        <tbody id="clientes-table-body">
          <tr>
            <td colspan="5">Cargando...</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const tableBody = document.getElementById("clientes-table-body");
  const btnAgregarCliente = document.getElementById("btn-agregar-cliente");

  // Función para cargar clientes desde Firestore
  const cargarClientes = async () => {
    try {
      const clientesCol = collection(db, "clientes");
      const snapshot = await getDocs(clientesCol);

      const rows = [];

      for (const docSnapshot of snapshot.docs) {
        const cliente = docSnapshot.data();
        const clienteId = docSnapshot.id;
        const clienteNombre = cliente.nombre || "N/A";

        // Determinar el estado de las incidencias
        const estadoIncidencias = await obtenerEstadoIncidencias(clienteId);

        rows.push(`
          <tr data-id="${clienteId}" data-nombre="${clienteNombre}">
            <td>${cliente.codigo || clienteId}</td>
            <td>${clienteNombre}</td>
            <td>${cliente.email || "N/A"}</td>
            <td>${cliente.telefono || "N/A"}</td>
            <td>${estadoIncidencias}</td>
          </tr>
        `);
      }

      tableBody.innerHTML = rows.join("");

      // Registrar eventos de doble clic para cada fila
      tableBody.querySelectorAll("tr").forEach((row) => {
        row.addEventListener("dblclick", () => {
          const id = row.dataset.id;
          const nombre = row.dataset.nombre;

          if (!window.usuarioActual) {
            console.error("Usuario actual no está definido. Verifica la autenticación.");
            alert("Error: Usuario no autenticado.");
            return;
          }

          abrirFormularioIncidencia(id, nombre, window.usuarioActual); // Pasamos el usuario actual
        });
      });
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
      tableBody.innerHTML = `<tr><td colspan="5" class="text-danger">Error al cargar los datos.</td></tr>`;
    }
  };

  // Obtener el estado de las incidencias para un cliente
  const obtenerEstadoIncidencias = async (clienteId) => {
    try {
      const incidenciasCol = collection(db, `clientes/${clienteId}/incidencias`);
      const incidenciasSnapshot = await getDocs(incidenciasCol);

      const incidenciasAbiertas = incidenciasSnapshot.docs.filter(
        (inc) => inc.data().status === "abierta"
      );
      return incidenciasAbiertas.length > 0
        ? `<span class="text-danger">Abierta</span>`
        : `<span class="text-success">Resuelta</span>`;
    } catch (error) {
      console.error(`Error al obtener el estado de las incidencias para el cliente ${clienteId}:`, error);
      return `<span class="text-muted">Error</span>`;
    }
  };

  // Escuchar el evento personalizado para actualizar la fila
  document.addEventListener("actualizarFila", async (e) => {
    const clienteId = e.detail.clienteId;
    const fila = tableBody.querySelector(`tr[data-id="${clienteId}"]`);
    if (fila) {
      const estadoIncidencias = await obtenerEstadoIncidencias(clienteId);
      const columnaIncidencias = fila.querySelector("td:last-child");
      if (columnaIncidencias) {
        columnaIncidencias.innerHTML = estadoIncidencias;
      }
    }
  });

  // Evento para el botón "Agregar Cliente"
  if (btnAgregarCliente) {
    btnAgregarCliente.addEventListener("click", () => {
      abrirFormularioAgregarCliente(dashboardContent); // Pasamos el contenedor principal
    });
  }

  // Cargar los clientes al inicio
  await cargarClientes();
};
