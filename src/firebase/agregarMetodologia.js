// src/firebase/agregarMetodologia.js
import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default async function agregarMetodologia(projectId, fase, data) {
  const ref = doc(db, 'proyectos', projectId, 'metodologias', fase);
  return await setDoc(ref, data, { merge: true });
}
