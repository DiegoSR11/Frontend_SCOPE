import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Ajusta la ruta según tu proyecto

const agregarUsuarioAProyecto = async (idProyecto, uidUsuario) => {
  if (!idProyecto || !uidUsuario) throw new Error("ID o UID no válido");

  const refProyecto = doc(db, "proyectos", idProyecto);

  await updateDoc(refProyecto, {
    gestores: arrayUnion(uidUsuario) // Firebase evita duplicados
  });
};

export default agregarUsuarioAProyecto;
