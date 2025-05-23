import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const useObtenerRiesgo = (idProyecto, idRiesgo) => {
  const [riesgo, setRiesgo] = useState(null);

  useEffect(() => {
    const obtenerRiesgo = async () => {
      if (!idProyecto || !idRiesgo) return;

      try {
        const riesgosRef = collection(db, 'proyectos', idProyecto, 'riesgos');
        const snapshot = await getDocs(riesgosRef);

        // Debug: Imprime todos los riesgos encontrados
        snapshot.docs.forEach(doc => {
          console.log("Riesgo en Firestore:", doc.id, doc.data());
        });

        // Buscar el riesgo por su doc.id
        const riesgoEncontrado = snapshot.docs.find(
          (doc) => doc.id === idRiesgo
        );

        if (riesgoEncontrado) {
          setRiesgo({ id: riesgoEncontrado.id, ...riesgoEncontrado.data() });
        } else {
          console.warn("No se encontró el riesgo dentro del proyecto.");
        }
      } catch (error) {
        console.error("Error al obtener el riesgo desde el proyecto:", error);
      }
    };

    obtenerRiesgo();
  }, [idProyecto, idRiesgo]);

  return riesgo;
};

export default useObtenerRiesgo;
