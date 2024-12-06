import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { abrirFormularioIncidencia } from "./incidencias.js";

export const renderClientes = async () => {
  const app = document.getElementById("app");

  // Generar estructura inicial
  app.innerHTML = `
    <h2 class="text-center">Lista de Clientes</h2>
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
    </form>
    <div class="table-responsive">
        <table class="table mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody id="clientes-table-body"></tbody>
        </table>
    </div>
  `;

  // Manejar el envío del formulario
  const nuevoClienteForm = document.getElementById("nuevo-cliente-form");
  nuevoClienteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener los valores de los campos
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;

    try {
      // Agregar el cliente a Firestore
      await addDoc(collection(db, "clientes"), { nombre, email, telefono });
      console.log("Cliente agregado correctamente");
      console.log("Usando el Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

      // Limpiar el formulario
      nuevoClienteForm.reset();

      // Recargar la tabla de clientes
      cargarClientes();
    } catch (error) {
      console.error("Error al agregar el cliente:", error);
      alert("Hubo un error al agregar el cliente. Intenta nuevamente.");
    }
  });

  // Función para cargar los clientes
  const cargarClientes = async () => {
    const tableBody = document.getElementById("clientes-table-body");
    tableBody.innerHTML = ""; // Limpiar la tabla
  
    const clientesCol = collection(db, "clientes");
    const snapshot = await getDocs(clientesCol);
  
    snapshot.forEach((doc) => {
      const cliente = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${doc.id}</td>
        <td>${cliente.nombre || "N/A"}</td>
        <td>${cliente.email || "N/A"}</td>
        <td>${cliente.telefono || "N/A"}</td>
      `;
  
      // Agregar evento de doble clic a la fila
      row.addEventListener("dblclick", () => {
        abrirFormularioIncidencia(doc.id, cliente.nombre);
      });
  
      tableBody.appendChild(row);
    });
  };

  // Cargar los clientes inicialmente
  cargarClientes();
  
};
