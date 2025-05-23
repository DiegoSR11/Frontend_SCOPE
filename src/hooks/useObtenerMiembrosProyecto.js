import { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const useObtenerMiembrosProyecto = (proyecto) => {
  const [gestores, setGestores] = useState([]);
  const [creador, setCreador] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerMiembros = async () => {
      if (!proyecto) return;

      try {
        // Obtener los gestores
        if (Array.isArray(proyecto.gestores)) {
          const gestoresInfo = await Promise.all(
            proyecto.gestores.map(async (uid) => {
              const docRef = doc(db, 'usuarios', uid);
              const docSnap = await getDoc(docRef);
              return docSnap.exists() ? { uid, ...docSnap.data() } : null;
            })
          );
          setGestores(gestoresInfo.filter(Boolean));
        }

        // Obtener el creador
        if (proyecto.creadoPor) {
          const creadorRef = doc(db, 'usuarios', proyecto.creadoPor);
          const creadorSnap = await getDoc(creadorRef);
          if (creadorSnap.exists()) {
            setCreador({ uid: proyecto.creadoPor, ...creadorSnap.data() });
          }
        }

      } catch (error) {
        console.error('Error al obtener gestores o creador:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerMiembros();
  }, [proyecto]);

  return { gestores, creador, cargando };
};

export default useObtenerMiembrosProyecto;
