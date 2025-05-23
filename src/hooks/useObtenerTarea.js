import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const useObtenerTarea = (idProyecto, idTarea) => {
  const [tarea, setTarea] = useState(null);

  useEffect(() => {
    const obtenerTarea = async () => {
      if (!idProyecto || !idTarea) return;

      try {
        const tareasRef = collection(db, 'proyectos', idProyecto, 'tareas');
        const snapshot = await getDocs(tareasRef);

        // Debug: Imprime todas las tareas encontradas
        snapshot.docs.forEach(doc => {
          console.log("Tarea en Firestore:", doc.id, doc.data());
        });

        // Buscar la tarea por su doc.id (no por campo interno)
        const tareaEncontrada = snapshot.docs.find(
          (doc) => doc.id === idTarea
        );

        if (tareaEncontrada) {
          setTarea({ id: tareaEncontrada.id, ...tareaEncontrada.data() });
        } else {
          console.warn("No se encontró la tarea dentro del proyecto.");
        }
      } catch (error) {
        console.error("Error al obtener la tarea desde el proyecto:", error);
      }
    };

    obtenerTarea();
  }, [idProyecto, idTarea]);

  return tarea;
};

export default useObtenerTarea;
