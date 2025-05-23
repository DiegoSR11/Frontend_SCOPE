import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const agregarGrupo = ({ 
  nombreGrupo, 
  descripcion,
  fechaCreado, 
  uidUsuario, 
  miembros 
}) => {
  return addDoc(collection(db, 'grupos'), {
    nombreGrupo,
    descripcion,
    fechaCreado,
    creadoPor: uidUsuario,
    miembros: miembros.includes(uidUsuario) ? miembros : [...miembros, uidUsuario]
  });
};

export default agregarGrupo;
