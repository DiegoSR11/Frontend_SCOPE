// src/firebase/obtenerMetodologias.js
import { db } from './firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

export function suscribirMetodologias(projectId, callback) {
  const col = collection(db, 'proyectos', projectId, 'metodologias');
  return onSnapshot(col, snapshot => {
    const metas = {};
    snapshot.forEach(doc => metas[doc.id] = doc.data());
    callback(metas);
  });
}
