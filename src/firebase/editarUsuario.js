// ./firebase/editarUsuario.js
import { db } from './firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const editarUsuario = async ({
  uid, nombre, apellido, celular, pais, departamento, empresa, area, rol
}) => {
  if (!uid) throw new Error("Falta el UID del usuario");
  const usuarioRef = doc(db, 'usuarios', uid);
  await updateDoc(usuarioRef, {
    nombre, apellido, celular, pais, departamento, empresa, area, rol
  });
};
export default editarUsuario;
