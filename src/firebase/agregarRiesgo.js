import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const agregarRiesgo = async ({
  idProyecto,
  uidUsuario,
  nombreRiesgo,
  descripcionRiesgo,
  impacto,
  probabilidad,
  estrategia,
  fechaCreado
}) => {
  if (!idProyecto) {
    console.error("Error: idProyecto no definido");
    return;
  }

  // Validación de campos obligatorios
  if (!nombreRiesgo || !impacto || !probabilidad || !estrategia) {
    console.error("Error: Faltan campos obligatorios para registrar el riesgo.");
    return;
  }

  const riesgo = {
    uidUsuario: uidUsuario || "", // en caso esté vacío
    nombreRiesgo: nombreRiesgo || "Sin título",
    descripcionRiesgo: descripcionRiesgo || "",
    impacto: impacto || "medio",
    probabilidad: probabilidad || "media",
    estrategia: estrategia || "No especificada",
    fechaCreado: fechaCreado || Date.now()
  };

  try {
    const docRef = await addDoc(collection(db, 'proyectos', idProyecto, 'riesgos'), riesgo);
    console.log("Riesgo agregado con ID:", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error al agregar riesgo:", error);
  }
};

export default agregarRiesgo;
