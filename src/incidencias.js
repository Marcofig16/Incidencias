import { db } from "./firebase.js";
import { addDoc, collection } from "firebase/firestore";

export const abrirFormularioIncidencia = (clienteId, clienteNombre) => {
    const modalTitle = document.getElementById("modalIncidenciaLabel");
    if (!modalTitle) {
      console.error("El modal no se encuentra en el DOM.");
      return;
    }
  
    modalTitle.textContent = `Agregar Incidencia para ${clienteNombre}`;
  
    const modalBody = document.querySelector("#modalIncidencia .modal-body");
    modalBody.innerHTML = `
      <form id="incidencia-form">
        <div class="mb-3">
          <label for="incidencia" class="form-label">Descripción de la Incidencia</label>
          <textarea id="incidencia" class="form-control" rows="4" required></textarea>
        </div>
        <div class="mb-3">
          <label for="fecha" class="form-label">Fecha</label>
          <input type="date" id="fecha" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Guardar Incidencia</button>
      </form>
    `;
  
    const modal = new bootstrap.Modal(document.getElementById("modalIncidencia"));
    modal.show();
  
    const incidenciaForm = document.getElementById("incidencia-form");
    incidenciaForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const incidencia = document.getElementById("incidencia").value;
      const fecha = document.getElementById("fecha").value;
  
      try {
        await addDoc(collection(db, "incidencias"), {
          clienteId,
          descripcion: incidencia,
          fecha,
        });
        alert("Incidencia guardada correctamente.");
        modal.hide();
      } catch (error) {
        console.error("Error al guardar la incidencia:", error);
        alert("Hubo un error al guardar la incidencia. Intenta nuevamente.");
      }
    });
  };
