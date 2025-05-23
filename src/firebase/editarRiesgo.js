import { db } from './firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const editarRiesgo = async ({
  idRiesgo,
  idProyecto,
  uidUsuario,
  nombreRiesgo,
  descripcionRiesgo,
  impacto,
  probabilidad,
  estrategia,
  fechaCreado
}) => {
  if (!idRiesgo || !idProyecto) {
    throw new Error("ID de riesgo y proyecto son obligatorios.");
  }

  try {
    // Referencia directa al documento del riesgo
    const riesgoRef = doc(db, 'proyectos', idProyecto, 'riesgos', idRiesgo);

    await updateDoc(riesgoRef, {
      uidUsuario,
      nombreRiesgo,
      descripcionRiesgo,
      impacto,
      probabilidad,
      estrategia,
      fechaCreado
    });

    return true;
  } catch (error) {
    console.error("Error al editar el riesgo:", error);
    throw error;
  }
};

export default editarRiesgo;
