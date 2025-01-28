import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

export const renderVerUsuarios = async (dashboardContent) => {
  if (!dashboardContent) return;

  dashboardContent.innerHTML = `
    <div class="text-center">
      <h2>Lista de Usuarios</h2>
      <table class="table table-striped table-sm mt-4 table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody id="usuarios-table-body">
          <tr>
            <td colspan="3">Cargando...</td>
          </tr>
        </tbody>
      </table>
      <button id="volver-panel" class="btn btn-secondary mt-4">Volver al Panel</button>
    </div>
  `;

  const tableBody = document.getElementById("usuarios-table-body");
  const volverPanel = document.getElementById("volver-panel");

  try {
    const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
    const rows = usuariosSnapshot.docs.map((doc) => {
      const { nombre, email, rol } = doc.data();
      return `
        <tr>
          <td>${nombre || "N/A"}</td>
          <td>${email || "N/A"}</td>
          <td>${rol || "N/A"}</td>
        </tr>
      `;
    });

    tableBody.innerHTML = rows.join("") || `<tr><td colspan="3">No se encontraron usuarios.</td></tr>`;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    tableBody.innerHTML = `<tr><td colspan="3" class="text-danger">Error al cargar usuarios.</td></tr>`;
  }

  // Manejar el evento del botón "Volver al Panel"
  volverPanel.addEventListener("click", () => {
    import("./adminDashboard.js").then(({ renderAdminDashboard }) => {
      renderAdminDashboard(dashboardContent);
    });
  });
};
