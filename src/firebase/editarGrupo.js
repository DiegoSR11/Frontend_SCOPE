import { db } from './firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const editarGrupo = async ({ id, nombreGrupo, descripcion, miembros }) => {
  try {
    const grupoRef = doc(db, 'grupos', id);
    await updateDoc(grupoRef, {
      nombreGrupo: nombreGrupo,
      descripcion,
      miembros
    });
  } catch (error) {
    console.error("Error al actualizar el grupo:", error);
    throw error;
  }
};


export default editarGrupo;
