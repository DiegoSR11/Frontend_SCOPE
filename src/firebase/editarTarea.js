import { db } from './firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const editarTarea = async ({
  idTarea,
  idProyecto,
  uidUsuario,
  nombreTarea,
  descripcionTarea,
  fechaVencimiento = null,
  estadoTarea = 'pendiente',
  responsables = [],
  tareaAntecesora = null,
  tareaPredecesora = null,
  notas = []
}) => {
  if (!idTarea || !idProyecto) {
    throw new Error("ID de tarea y proyecto son obligatorios.");
  }

  try {
    // Referencia directa al documento de la tarea
    const tareaRef = doc(db, 'proyectos', idProyecto, 'tareas', idTarea);

    await updateDoc(tareaRef, {
      uidUsuario,
      nombreTarea,
      descripcionTarea,
      fechaVencimiento,
      estadoTarea,
      responsables,
      tareaAntecesora,
      tareaPredecesora,
      notas
    });

    return true;
  } catch (error) {
    console.error("Error al editar la tarea:", error);
    throw error;
  }
};

export default editarTarea;
