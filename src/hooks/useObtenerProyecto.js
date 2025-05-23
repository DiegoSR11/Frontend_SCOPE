import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const useObtenerProyecto = (idProyecto) => {
  const [proyecto, setProyecto] = useState(null);

  useEffect(() => {
    if (!idProyecto) return;

    const proyectoRef = doc(db, 'proyectos', idProyecto);
    // Suscripción en tiempo real:
    const unsubscribe = onSnapshot(proyectoRef, (snapshot) => {
      if (snapshot.exists()) {
        setProyecto({ id: snapshot.id, ...snapshot.data() });
      } else {
        setProyecto(null);
      }
    }, (error) => {
      console.error("Error escuchando proyecto:", error);
    });

    // Limpieza al desmontar:
    return () => unsubscribe();
  }, [idProyecto]);

  return [proyecto];
};

export default useObtenerProyecto;
