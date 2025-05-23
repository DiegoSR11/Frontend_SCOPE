import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const agregarUsuario = ({ uid, nombre, apellido, celular, pais, departamento, empresa, area, rol, correo }) => {
  return setDoc(doc(db, 'usuarios', uid), {
    nombre,
    apellido,
    celular,
    pais,
    departamento,
    empresa,
    area,
    rol,
    correo
  });
};

export default agregarUsuario;
