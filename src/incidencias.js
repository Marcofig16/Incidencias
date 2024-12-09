import { db } from "./firebase.js";
import { addDoc, collection } from "firebase/firestore";

export const abrirFormularioIncidencia = (clienteId, clienteNombre) => {
  console.log("Método de abrir formulario de incidencias... Cargado!");

  // Obtener el modal del DOM
  const modalElement = document.getElementById("modalCrearIncidencia");
  if (!modalElement) {
    console.error("El modal 'modalCrearIncidencia' no existe en el DOM.");
    return;
  }

  // Actualizar el título del modal
  const modalTitle = document.getElementById("modalCrearIncidenciaLabel");
  if (!modalTitle) {
    console.error("El elemento 'modalCrearIncidenciaLabel' no existe en el DOM.");
    return;
  }
  modalTitle.textContent = `Agregar Incidencia para ${clienteNombre}`;

  // Obtener el formulario y limpiar los campos
  const incidenciaForm = document.getElementById("form-crear-incidencia");
  if (!incidenciaForm) {
    console.error("El formulario 'form-crear-incidencia' no existe en el DOM.");
    return;
  }
  incidenciaForm.reset();

  // Crear y mostrar el modal
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Evitar duplicación de eventos `submit`
  incidenciaForm.removeEventListener("submit", handleSubmit);
  incidenciaForm.addEventListener("submit", handleSubmit);

  // Función para manejar el envío del formulario
  async function handleSubmit(e) {
    e.preventDefault();

    // Obtener los valores del formulario
    const titulo_incidencia = document.getElementById("titulo-incidencia").value.trim();
    const detalle_incidencia = document.getElementById("detalle-incidencia").value.trim();
    const fecha = new Date().toISOString(); 

    if (!detalle_incidencia) {
      alert("Por favor, escribe una descripción de la incidencia.");
      return;
    }

    // Referencia al botón de guardar
    const guardarBtn = incidenciaForm.querySelector("button[type='submit']");
    const originalText = guardarBtn.textContent;

    try {
      // Deshabilitar el botón y mostrar el spinner
      guardarBtn.disabled = true;
      guardarBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...`;

      // Guardar incidencia en Firestore
      await addDoc(collection(db, "incidencias"), {
        clienteId,
        titulo: titulo_incidencia,
        descripcion: detalle_incidencia,
        fecha,
      });

      alert("Incidencia guardada correctamente.");
      modal.hide();
    } catch (error) {
      console.error("Error al guardar la incidencia:", error);
      alert("Hubo un error al guardar la incidencia. Intenta nuevamente.");
    } finally {
      // Restaurar el botón
      guardarBtn.disabled = false;
      guardarBtn.textContent = originalText;
    }
  }
};
