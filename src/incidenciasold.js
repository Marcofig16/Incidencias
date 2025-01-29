import { db } from "./firebase.js";
import {
  doc,
  updateDoc,
  collection,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  addDoc,
  arrayUnion,
} from "firebase/firestore";

// Función principal para abrir el formulario de incidencias
export const abrirFormularioIncidencia = async (clienteId, clienteNombre, usuarioActual) => {
  console.log(`Cargando incidencias para el cliente: ${clienteNombre}`);
  console.log(`Usuario actual: ${usuarioActual}`);

  // Obtener elementos del DOM
  const modalElement = document.getElementById("modalCrearIncidencia");
  const modalTitle = document.getElementById("modalCrearIncidenciaLabel");
  const incidenciaForm = document.getElementById("form-crear-incidencia");
  const listaIncidencias = document.getElementById("lista-incidencias");

  if (!modalElement || !modalTitle || !listaIncidencias || !incidenciaForm) {
    console.error("Elementos del modal no encontrados.");
    return;
  }

  // Limpiar la lista de incidencias y formulario
  listaIncidencias.innerHTML = `<li class="list-group-item">Cargando incidencias...</li>`;
  incidenciaForm.innerHTML = `
    <div class="mb-3">
      <label for="titulo-incidencia" class="form-label">Título</label>
      <input type="text" class="form-control" id="titulo-incidencia" placeholder="Título de la incidencia" required>
    </div>
    <div class="mb-3">
      <label for="detalle-incidencia" class="form-label">Detalle</label>
      <textarea class="form-control" id="detalle-incidencia" rows="3" placeholder="Describe la incidencia" required></textarea>
    </div>
    <button type="submit" class="btn btn-primary">Agregar Incidencia</button>
  `;
  incidenciaForm.reset();
  modalTitle.textContent = `Incidencias de ${clienteNombre}`;

  // Mostrar el modal
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Cargar el historial de incidencias
  await cargarHistoricoIncidencias(clienteId, usuarioActual);

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
      await addDoc(collection(db, `clientes/${clienteId}/incidencias`), {
        titulo,
        descripcion,
        status: "abierta",
        fecha: serverTimestamp(),
        usuario: usuarioActual || "Usuario desconocido",
        notas: [],
      });

      alert("Incidencia agregada correctamente.");
      await cargarHistoricoIncidencias(clienteId, usuarioActual);
      incidenciaForm.reset();
    } catch (error) {
      console.error("Error al agregar la incidencia:", error.message);
      alert(`Error al agregar la incidencia: ${error.message}`);
    }
  };

  // Escuchar el cierre del modal y emitir un evento para actualizar la tabla
  modalElement.addEventListener("hidden.bs.modal", () => {
    const actualizarEvento = new CustomEvent("actualizarFila", { detail: { clienteId } });
    document.dispatchEvent(actualizarEvento);
  });
};

// Función para cargar el historial de incidencias
const cargarHistoricoIncidencias = async (clienteId, usuarioActual) => {
  const listaIncidencias = document.getElementById("lista-incidencias");

  try {
    if (!listaIncidencias) {
      console.error("No se encontró el contenedor 'lista-incidencias' en el DOM.");
      return;
    }

    const incidenciasRef = collection(db, `clientes/${clienteId}/incidencias`);
    const q = query(incidenciasRef, orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);

    listaIncidencias.innerHTML = "";

    if (querySnapshot.empty) {
      listaIncidencias.innerHTML = `<li class="list-group-item">No hay incidencias registradas.</li>`;
    } else {
      querySnapshot.forEach((docSnapshot) => {
        const { titulo, descripcion, status, fecha, usuario, notas = [] } = docSnapshot.data();
        const incidenciaId = docSnapshot.id;

        const statusColor = status === "abierta" ? "text-danger" : "text-success";
        const fechaFormateada = fecha?.toDate().toLocaleString() || "Fecha no disponible";

        const notasHTML = notas.map((nota) => `
          <li class="list-group-item">
            <small>${nota.fecha}: ${nota.usuario || "Usuario desconocido"} - ${nota.texto}</small>
          </li>
        `).join("");

        listaIncidencias.innerHTML += `
          <li class="list-group-item">
            <div>
              <strong class="${statusColor}">${titulo} (${status.toUpperCase()})</strong><br>
              ${descripcion}<br>
              <small class="text-muted">Última edición: ${fechaFormateada} por ${usuario || "Usuario desconocido"}</small>
              <ul class="list-group mt-2">
                <h6>Notas:</h6>
                ${notasHTML || "<li class='list-group-item'>No hay notas registradas.</li>"}
              </ul>
              ${status === "abierta" ? `
                <button class="btn btn-primary btn-sm mt-2" onclick="abrirAgregarNota('${clienteId}', '${incidenciaId}', '${usuarioActual}')">Agregar Nota</button>
                <button class="btn btn-success btn-sm mt-2" onclick="marcarResuelta('${clienteId}', '${incidenciaId}', '${usuarioActual}')">Resuelta</button>
              ` : ""}
            </div>
          </li>
        `;
      });
    }
  } catch (error) {
    console.error("Error al cargar el historial de incidencias:", error.message);
    listaIncidencias.innerHTML = `
      <li class="list-group-item text-danger">
        Error al cargar las incidencias: ${error.message}
      </li>`;
  }
};

// Función para agregar una nueva nota a una incidencia
const abrirAgregarNota = async (clienteId, incidenciaId, usuarioActual) => {
  const nuevaNota = prompt("Escribe la nueva nota:");

  if (!nuevaNota || nuevaNota.trim() === "") {
    alert("La nota no puede estar vacía.");
    return;
  }

  try {
    const incidenciaRef = doc(db, `clientes/${clienteId}/incidencias/${incidenciaId}`);
    await updateDoc(incidenciaRef, {
      notas: arrayUnion({
        texto: nuevaNota,
        usuario: usuarioActual || "Usuario desconocido",
        fecha: new Date().toLocaleString(),
      }),
    });
    alert("Nota agregada correctamente.");
    await cargarHistoricoIncidencias(clienteId, usuarioActual);
  } catch (error) {
    console.error("Error al agregar la nota:", error.message);
    alert(`Error al agregar la nota: ${error.message}`);
  }
};

// Función para marcar una incidencia como resuelta
const marcarResuelta = async (clienteId, incidenciaId, usuarioActual) => {
  try {
    const incidenciaRef = doc(db, `clientes/${clienteId}/incidencias/${incidenciaId}`);
    await updateDoc(incidenciaRef, {
      status: "resuelta",
      usuario: usuarioActual || "Usuario desconocido",
      fecha: serverTimestamp(),
    });
    alert("Incidencia marcada como resuelta.");
    await cargarHistoricoIncidencias(clienteId, usuarioActual);
  } catch (error) {
    console.error("Error al marcar incidencia como resuelta:", error.message);
    alert(`Error al marcar incidencia como resuelta: ${error.message}`);
  }
};

// Exportar las funciones necesarias globalmente
window.abrirAgregarNota = abrirAgregarNota;
window.marcarResuelta = marcarResuelta;
