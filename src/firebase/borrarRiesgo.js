import { db } from './firebaseConfig';
import { doc, deleteDoc } from "firebase/firestore";

// Ahora recibe idProyecto y idRiesgo
const borrarRiesgo = async (idProyecto, idRiesgo) => {
  if (!idProyecto || !idRiesgo) {
    console.error("Error: idProyecto o idRiesgo no definido");
    return;
  }

  try {
    const riesgoRef = doc(db, 'proyectos', idProyecto, 'riesgos', idRiesgo);
    await deleteDoc(riesgoRef);
    console.log(`Riesgo ${idRiesgo} eliminado del proyecto ${idProyecto}`);
  } catch (error) {
    console.error("Error al eliminar riesgo:", error);
  }
};

export default borrarRiesgo;
