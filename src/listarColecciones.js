import { getFirestore, getDocs, collection } from "firebase/firestore";

export async function listarColecciones() {
  try {
    const resultadosDiv = document.getElementById("resultados-colecciones");

    // Limpia el contenido previo
    resultadosDiv.innerHTML = "<p>Cargando colecciones...</p>";

    // Referencia de Firestore
    const firestore = getFirestore();

    // Simula colecciones raíz existentes para inspeccionarlas
    const coleccionesSimuladas = ["clientes", "pedidos", "productos"];
    const coleccionesExistentes = [];

    for (const coleccion of coleccionesSimuladas) {
      try {
        const snapshot = await getDocs(collection(firestore, coleccion));
        if (!snapshot.empty) {
          coleccionesExistentes.push(coleccion);
        }
      } catch (error) {
        console.warn(`No se pudo inspeccionar la colección: ${coleccion}`);
      }
    }

    // Construir UI para colecciones
    resultadosDiv.innerHTML = ""; // Limpiar el mensaje de carga
    if (coleccionesExistentes.length > 0) {
      const ul = document.createElement("ul");
      ul.classList.add("list-group");

      coleccionesExistentes.forEach((coleccion) => {
        const li = document.createElement("li");
        li.textContent = coleccion;
        li.classList.add("list-group-item");
        ul.appendChild(li);
      });

      resultadosDiv.appendChild(ul);
    } else {
      resultadosDiv.innerHTML = "<p>No se encontraron colecciones disponibles.</p>";
    }
  } catch (error) {
    console.error("Error al listar colecciones:", error);
    const resultadosDiv = document.getElementById("resultados-colecciones");
    resultadosDiv.innerHTML = "<p>Error al listar colecciones. Revisa la consola.</p>";
  }
}
