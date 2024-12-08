import { db } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";
import { renderTablaClientes } from "./mostrarClientes.js";

export const renderAgregarCliente = () => {
  const app = document.getElementById("app");

  // Estructura del formulario
  app.innerHTML = `
    <h2 class="text-center">Agregar Cliente</h2>
    <form id="nuevo-cliente-form" class="mb-4">
      <div class="mb-3">
        <label for="nombre" class="form-label">Nombre</label>
        <input type="text" class="form-control" id="nombre" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" required>
      </div>
      <div class="mb-3">
        <label for="telefono" class="form-label">Teléfono</label>
        <input type="text" class="form-control" id="telefono" required>
      </div>
      <button type="submit" class="btn btn-success w-100">Agregar Cliente</button>
      <button type="button" id="btn-volver" class="btn btn-secondary w-100 mt-2">Volver</button>
    </form>
  `;

  const nuevoClienteForm = document.getElementById("nuevo-cliente-form");

  // Manejar el envío del formulario
  nuevoClienteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;

    try {
      await addDoc(collection(db, "clientes"), { nombre, email, telefono });
      alert("Cliente agregado correctamente.");
      renderTablaClientes(); // Volver a la vista de la tabla
    } catch (error) {
      console.error("Error al agregar el cliente:", error);
      alert("Hubo un problema al agregar el cliente. Intenta nuevamente.");
    }
  });

  // Botón para volver a la tabla de clientes
  document.getElementById("btn-volver").addEventListener("click", () => {
    renderTablaClientes();
  });
};
