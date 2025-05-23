import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const useDatosProyecto = (idProyecto) => {
  const [gestores, setGestores] = useState([]);
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const proyectoRef = doc(db, "proyectos", idProyecto);
        const proyectoSnap = await getDoc(proyectoRef);

        if (proyectoSnap.exists()) {
          const proyecto = proyectoSnap.data();

          // Obtener info de gestores
          if (Array.isArray(proyecto.gestores)) {
            const gestoresInfo = await Promise.all(
              proyecto.gestores.map(async (uid) => {
                const usuarioSnap = await getDoc(doc(db, "usuarios", uid));
                return usuarioSnap.exists() ? { uid, ...usuarioSnap.data() } : null;
              })
            );
            setGestores(gestoresInfo.filter(Boolean));
          }
        }

        // Obtener tareas del proyecto
        const tareasSnap = await getDocs(collection(db, "proyectos", idProyecto, "tareas"));
        const tareasData = tareasSnap.docs.map(doc => ({
          id: doc.id,
          nombre: doc.data().nombre,
        }));
        setTareas(tareasData);
      } catch (error) {
        console.error("Error obteniendo datos del proyecto:", error);
      }
    };

    if (idProyecto) obtenerDatos();
  }, [idProyecto]);

  return { gestores, tareas };
};

export default useDatosProyecto;
