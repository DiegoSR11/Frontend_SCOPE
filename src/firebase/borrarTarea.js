import { db } from './firebaseConfig';
import { doc, deleteDoc } from "firebase/firestore";

// Ahora recibe idProyecto además de idTarea
const borrarTarea = async (idProyecto, idTarea) => {
  if (!idProyecto || !idTarea) {
    console.error("Error: idProyecto o idTarea no definido");
    return;
  }

  try {
    const tareaRef = doc(db, 'proyectos', idProyecto, 'tareas', idTarea);
    await deleteDoc(tareaRef);
    console.log(`Tarea ${idTarea} eliminada del proyecto ${idProyecto}`);
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
  }
};

export default borrarTarea;
