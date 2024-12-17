import { db } from "./firebase.js";
import { addDoc, collection, query, orderBy, getDocs, serverTimestamp } from "firebase/firestore";

// Función principal para abrir el formulario de incidencias
export const abrirFormularioIncidencia = async (clienteId, clienteNombre) => {
  console.log(`Cargando incidencias para el cliente: ${clienteNombre}`);

  // Obtener elementos del DOM
  const modalElement = document.getElementById("modalCrearIncidencia");
  const modalTitle = document.getElementById("modalCrearIncidenciaLabel");
  const incidenciaForm = document.getElementById("form-crear-incidencia");
  const listaIncidencias = document.getElementById("lista-incidencias");

  // Verificar si los elementos existen
  if (!modalElement || !modalTitle || !listaIncidencias || !incidenciaForm) {
    console.error("Elementos del modal no encontrados.");
    return;
  }

  // Limpiar la lista de incidencias y formulario
  listaIncidencias.innerHTML = `<li class="list-group-item">Cargando incidencias...</li>`;
  incidenciaForm.reset();
  modalTitle.textContent = `Incidencias de ${clienteNombre}`;

  // Mostrar el modal
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Cargar el historial de incidencias
  await cargarHistoricoIncidencias(clienteId);

  // Manejar el envío de nuevas incidencias
  incidenciaForm.onsubmit = async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo-incidencia").value.trim();
    const descripcion = document.getElementById("detalle-incidencia").value.trim();

    if (!titulo || !descripcion) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      // Guardar la nueva incidencia con estado "abierta" y fecha actual
      await addDoc(collection(db, `clientes/${clienteId}/incidencias`), {
        titulo,
        descripcion,
        status: "abierta", // Estado inicial
        fecha: serverTimestamp(), // Fecha y hora actuales
      });

      alert("Incidencia agregada correctamente.");
      await cargarHistoricoIncidencias(clienteId); // Recargar el historial
      incidenciaForm.reset();
    } catch (error) {
      console.error("Error al agregar la incidencia:", error);
      alert("Error al agregar la incidencia.");
    }
  };
};

// Función para cargar el historial de incidencias
const cargarHistoricoIncidencias = async (clienteId) => {
  const listaIncidencias = document.getElementById("lista-incidencias");

  try {
    // Verificar si el contenedor de incidencias existe
    if (!listaIncidencias) {
      console.error("No se encontró el contenedor 'lista-incidencias' en el DOM.");
      return;
    }

    // Referencia a la colección de incidencias del cliente
    const incidenciasRef = collection(db, `clientes/${clienteId}/incidencias`);
    const q = query(incidenciasRef, orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);

    // Limpiar el contenedor antes de agregar nuevos datos
    listaIncidencias.innerHTML = "";

    if (querySnapshot.empty) {
      listaIncidencias.innerHTML = `<li class="list-group-item">No hay incidencias registradas.</li>`;
    } else {
      querySnapshot.forEach((docSnapshot) => {
        const { titulo, descripcion, status = "abierta", fecha } = docSnapshot.data();

        // Validar y formatear la fecha
        let fechaFormateada = "Fecha no disponible";
        if (fecha && fecha.toDate) {
          fechaFormateada = fecha.toDate().toLocaleString();
        }

        // Determinar el color según el status
        const statusColor = status === "abierta" ? "text-danger" : "text-success";

        // Generar la lista de incidencias
        listaIncidencias.innerHTML += `
          <li class="list-group-item">
            <div>
              <strong class="${statusColor}">${titulo || "Sin título"} (${status.toUpperCase()})</strong><br>
              ${descripcion || "Sin descripción"}<br>
              <small class="text-muted">Fecha: ${fechaFormateada}</small>
            </div>
          </li>`;
      });
    }
  } catch (error) {
    console.error("Error al cargar el historial de incidencias:", error);
    listaIncidencias.innerHTML = `
      <li class="list-group-item text-danger">
        Error al cargar las incidencias: ${error.message}
      </li>`;
  }
};
