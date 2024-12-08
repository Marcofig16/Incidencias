import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "firebase/firestore";
import { abrirFormularioIncidencia } from "./incidencias.js";

// Función para abrir el modal intermedio de incidencias
export const abrirModalIncidenciasCliente = async (clienteId, clienteNombre) => {
  const modalIncidencias = new bootstrap.Modal(document.getElementById("modalIncidenciasCliente"));
  const listaIncidencias = document.getElementById("lista-incidencias");

  // Limpiar lista de incidencias
  listaIncidencias.innerHTML = "<li class='list-group-item'>Cargando incidencias...</li>";

  try {
    // Consulta incidencias asociadas al cliente
    const incidenciasCol = collection(db, "incidencias");
    const q = query(incidenciasCol, where("clienteId", "==", clienteId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      listaIncidencias.innerHTML = "<li class='list-group-item'>No hay incidencias para este cliente.</li>";
    } else {
      listaIncidencias.innerHTML = snapshot.docs.map(doc => {
        const incidencia = doc.data();
        return `
          <li class="list-group-item">
            <strong>${incidencia.titulo || "Incidencia"}</strong>: ${incidencia.descripcion || "Sin descripción"}
          </li>
        `;
      }).join("");
    }
  } catch (error) {
    console.error("Error al cargar incidencias:", error);
    listaIncidencias.innerHTML = "<li class='list-group-item text-danger'>Error al cargar incidencias.</li>";
  }

  // Abrir el modal
  modalIncidencias.show();

  // Manejar el botón "Nueva Incidencia"
  document.getElementById("btn-nueva-incidencia").addEventListener("click", () => {
    modalIncidencias.hide();
    abrirFormularioIncidencia(clienteId, clienteNombre);
  });
};
