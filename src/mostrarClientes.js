import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { abrirFormularioAgregarCliente } from "./agregarCliente.js";
import { abrirFormularioIncidencia } from "./incidencias.js";

export const renderTablaClientes = async (dashboardContent) => {
  if (!dashboardContent) {
    console.error("El contenedor para la tabla de clientes no está disponible.");
    return;
  }

  let tablaClientes = document.getElementById("tabla-clientes");
  if (!tablaClientes) {
    tablaClientes = document.createElement("div");
    tablaClientes.id = "tabla-clientes";
    dashboardContent.appendChild(tablaClientes);
  }

  // 🔥 Verificar si el usuario es administrador
  const esUsuarioAdministrador = window.usuarioActual?.rol === "administrador";

  tablaClientes.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex align-items-center">
        <button id="btn-agregar-cliente" class="btn btn-primary me-2">Agregar Cliente</button>
        ${esUsuarioAdministrador ? `<button id="btn-volver-panel" class="btn btn-secondary me-2">Volver al Panel</button>` : ""}
        <select id="criterio-buscador" class="form-select me-2" style="width: 150px;">
          <option value="nombre">Nombre</option>
          <option value="codigo">ID</option>
          <option value="empresa">Empresa</option>
        </select>
        <input
          type="text"
          id="buscador-clientes"
          class="form-control"
          placeholder="Buscar..."
          style="width: 200px;"
        />
      </div>
      <select id="filtro-incidencias" class="form-select" style="width: 180px;">
        <option value="todos">Todos</option>
        <option value="abierta">Con incidencias abiertas</option>
        <option value="resuelta">Solo resueltas</option>
        <option value="sin incidencias">Sin incidencias</option>
      </select>
    </div>
    <h2 class="text-center">Lista de Clientes</h2>
    <div id="clientes-container" class="table-responsive">
      <table id="clientes-table" class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Empresa</th>
            <th>Incidencias</th>
          </tr>
        </thead>
        <tbody id="clientes-table-body">
          <tr>
            <td colspan="6">Cargando...</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const tableBody = document.getElementById("clientes-table-body");
  const btnAgregarCliente = document.getElementById("btn-agregar-cliente");
  const btnVolverPanel = document.getElementById("btn-volver-panel");
  const buscadorInput = document.getElementById("buscador-clientes");
  const criterioBuscador = document.getElementById("criterio-buscador");
  const filtroIncidencias = document.getElementById("filtro-incidencias");

  const cargarClientes = async () => {
    try {
      const clientesCol = collection(db, "clientes");
      const snapshot = await getDocs(clientesCol);

      const rows = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const cliente = docSnapshot.data();
          const clienteId = docSnapshot.id;
          const clienteNombre = cliente.nombre || "N/A";
          const clienteEmpresa = cliente.empresa || "N/A";
          const codigo = cliente.codigo || clienteId;

          const estadoIncidencias = await obtenerEstadoIncidencias(clienteId);

          return `
            <tr data-id="${clienteId}" data-codigo="${codigo}" data-nombre="${clienteNombre.toLowerCase()}" data-empresa="${clienteEmpresa.toLowerCase()}" data-incidencias="${estadoIncidencias.toLowerCase()}">
              <td>${codigo}</td>
              <td>${clienteNombre}</td>
              <td>${cliente.email || "N/A"}</td>
              <td>${cliente.telefono || "N/A"}</td>
              <td>${clienteEmpresa}</td>
              <td>${formatearEstadoIncidencias(estadoIncidencias)}</td>
            </tr>
          `;
        })
      );

      tableBody.innerHTML = rows.join("");

      tableBody.querySelectorAll("tr").forEach((row) => {
        row.addEventListener("dblclick", () => {
          const id = row.dataset.id;
          const nombre = row.dataset.nombre;

          if (!window.usuarioActual) {
            console.error("Usuario actual no está definido. Verifica la autenticación.");
            alert("Error: Usuario no autenticado.");
            return;
          }

          abrirFormularioIncidencia(id, nombre, window.usuarioActual);
        });
      });
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
      tableBody.innerHTML = `<tr><td colspan="6" class="text-danger">Error al cargar los datos.</td></tr>`;
    }
  };

  const obtenerEstadoIncidencias = async (clienteId) => {
    try {
      const incidenciasCol = collection(db, `clientes/${clienteId}/incidencias`);
      const incidenciasSnapshot = await getDocs(incidenciasCol);

      if (incidenciasSnapshot.empty) {
        return "Sin incidencias";
      }

      const incidenciasAbiertas = incidenciasSnapshot.docs.filter(
        (inc) => inc.data().status === "abierta"
      );

      return incidenciasAbiertas.length > 0 ? "Abierta" : "Resuelta";
    } catch (error) {
      console.error(`Error al obtener el estado de las incidencias para el cliente ${clienteId}:`, error);
      return "Error";
    }
  };

  const formatearEstadoIncidencias = (estado) => {
    switch (estado) {
      case "Abierta":
        return `<span class="text-danger">Abierta</span>`;
      case "Resuelta":
        return `<span class="text-success">Resuelta</span>`;
      case "Sin incidencias":
        return `<span class="text-black">Sin incidencias</span>`;
      default:
        return `<span class="text-muted">Error</span>`;
    }
  };

  const filtrarClientes = () => {
    const filtroTexto = buscadorInput.value.toLowerCase();
    const criterio = criterioBuscador.value.toLowerCase();
    const filas = tableBody.querySelectorAll("tr");

    filas.forEach((fila) => {
      const valor = fila.dataset[criterio] || "";
      fila.style.display = valor.startsWith(filtroTexto) ? "" : "none";
    });
  };

  buscadorInput.addEventListener("input", filtrarClientes);

  document.addEventListener("actualizarFila", async (e) => {
    const clienteId = e.detail.clienteId;
    const fila = tableBody.querySelector(`tr[data-id="${clienteId}"]`);
    if (fila) {
      const estadoIncidencias = await obtenerEstadoIncidencias(clienteId);
      const columnaIncidencias = fila.querySelector("td:last-child");
      if (columnaIncidencias) {
        columnaIncidencias.innerHTML = formatearEstadoIncidencias(estadoIncidencias);
        fila.dataset.incidencias = estadoIncidencias.toLowerCase();
      }
    }
  });

  filtroIncidencias.addEventListener("change", () => {
    const filtro = filtroIncidencias.value.toLowerCase();
    const filas = tableBody.querySelectorAll("tr");

    filas.forEach((fila) => {
      const estado = fila.dataset.incidencias || "todos";
      fila.style.display = filtro === "todos" || estado === filtro ? "" : "none";
    });
  });

  if (btnAgregarCliente) {
    btnAgregarCliente.addEventListener("click", () => {
      abrirFormularioAgregarCliente(dashboardContent);
    });
  }

  if (btnVolverPanel) {
    btnVolverPanel.addEventListener("click", () => {
      import("./adminDashboard.js").then(({ renderAdminDashboard }) => {
        renderAdminDashboard(dashboardContent);
      });
    });
  }

  await cargarClientes();
};
