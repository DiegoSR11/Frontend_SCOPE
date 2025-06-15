import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const agregarTarea = async ({
  idProyecto,
  uidUsuario,
  nombreTarea,
  descripcionTarea,
  fechaCreado = null,
  fechaVencimiento = null,
  estadoTarea = "Pendiente",
  responsables = [],
  tareaAntecesora = null,
  tareaPredecesora = null,
  notas = [],
}) => {
  if (!idProyecto) {
    console.error("Error: idProyecto no definido");
    return;
  }

  try {
    // Crear directamente en la subcolección del proyecto
    const nuevaTareaRef = await addDoc(collection(db, 'proyectos', idProyecto, 'tareas'), {
      uidUsuario,
      nombreTarea,
      descripcionTarea,
      fechaCreado,
      fechaVencimiento,
      estadoTarea,
      responsables,
      tareaAntecesora,
      tareaPredecesora,
      notas
    });

    return nuevaTareaRef;

  } catch (error) {
    console.error("Error al agregar tarea:", error);
  }
};

export default agregarTarea;
