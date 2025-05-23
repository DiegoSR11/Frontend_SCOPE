import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const agregarProyecto = ({ 
  nombreProyecto, 
  descripcion,
  fechaCreado, 
  complejoRiesgos, 
  presenciaCliente, 
  iterativoProyecto, 
  tamanioProyecto, 
  tipoProyecto, 
  metodologiaProyecto, 
  uidUsuario 
}) => {
  return addDoc(collection(db, 'proyectos'), {
    nombreProyecto,
    descripcion, 
    fechaCreado,
    complejoRiesgos,
    presenciaCliente,
    iterativoProyecto,
    tamanioProyecto,
    tipoProyecto,
    metodologiaProyecto,
    creadoPor: uidUsuario,
    gestores: [uidUsuario]
  });
};

export default agregarProyecto;
