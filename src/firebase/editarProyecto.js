import { db } from './firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const editarProyecto = async ({
  id,
  nombreProyecto,
  descripcion,
  complejoRiesgos,
  presenciaCliente,
  iterativoProyecto,
  tamanioProyecto,
  tipoProyecto,
  metodologiaProyecto,
  gestores
}) => {
  if (!id || !nombreProyecto) {
    throw new Error("ID y nombre del proyecto son obligatorios.");
  }

  try {
    const proyectoRef = doc(db, 'proyectos', id);

    await updateDoc(proyectoRef, {
      nombreProyecto,
      descripcion,
      complejoRiesgos,
      presenciaCliente,
      iterativoProyecto,
      tamanioProyecto,
      tipoProyecto,
      metodologiaProyecto,
      gestores
    });

    return true;
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error);
    throw error;
  }
};

export default editarProyecto;
