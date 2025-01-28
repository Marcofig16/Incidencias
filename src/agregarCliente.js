import { db } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";
import { renderTablaClientes } from "./mostrarClientes.js";

export const abrirFormularioAgregarCliente = (dashboardContent) => {
  console.log("Abriendo formulario de Agregar Cliente");

  // Obtener elementos del modal
  const modalElement = document.getElementById("modalAgregarCliente");
  const modalTitle = document.getElementById("modalAgregarClienteLabel");
  const agregarClienteForm = document.getElementById("form-agregar-cliente");

  if (!modalElement || !modalTitle || !agregarClienteForm) {
    console.error("Elementos del modal no encontrados. Verifica el HTML.");
    return;
  }

  // Limpiar el formulario
  agregarClienteForm.reset();
  modalTitle.textContent = "Agregar Nuevo Cliente";

  // Mostrar el modal
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Manejar el envío del formulario
  agregarClienteForm.onsubmit = async (e) => {
    e.preventDefault();

    const codigo = document.getElementById("codigo-cliente").value.trim();
    const nombre = document.getElementById("nombre-cliente").value.trim();
    const email = document.getElementById("email-cliente").value.trim();
    const telefono = document.getElementById("telefono-cliente").value.trim();
    const empresa = document.getElementById("empresa-cliente").value.trim(); // Nuevo campo Empresa

    if (!codigo || !nombre || !email || !telefono || !empresa) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      // Guardar el nuevo cliente en Firestore
      await addDoc(collection(db, "clientes"), { codigo, nombre, email, telefono, empresa });

      // Mostrar mensaje de éxito
      alert("Cliente agregado correctamente.");

      // Cerrar el modal
      modal.hide();

      // Actualizar la tabla de clientes después de cerrar el modal
      modalElement.addEventListener(
        "hidden.bs.modal",
        () => {
          if (dashboardContent) {
            renderTablaClientes(dashboardContent);
          }
        },
        { once: true } // Escucha el evento una sola vez
      );
    } catch (error) {
      console.error("Error al agregar el cliente:", error);
      alert("Error al agregar el cliente.");
    }
  };
};
