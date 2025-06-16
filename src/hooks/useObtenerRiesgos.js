import { useState, useEffect } from "react";
import { db } from "./../firebase/firebaseConfig";
import { collection, onSnapshot, query, orderBy, startAfter } from "firebase/firestore";

const useObtenerRiesgos = (idProyecto) => {
  const [riesgos, setRiesgos] = useState([]);
  const [ultimoRiesgo, setUltimoRiesgo] = useState(null);
  const [hayMasPorCargar, setHayMasPorCargar] = useState(false);

  useEffect(() => {
    if (!idProyecto) return;

    const consulta = query(
      collection(db, "proyectos", idProyecto, "riesgos"),
      orderBy("fechaCreado", "desc"),
    );

    const unsuscribe = onSnapshot(
      consulta,
      (snapshot) => {

        if (!snapshot.empty) {
          setUltimoRiesgo(snapshot.docs[snapshot.docs.length - 1]);
          setHayMasPorCargar(snapshot.docs.length === 10);
        } else {
          setHayMasPorCargar(false);
        }

        setRiesgos(snapshot.docs.map((riesgo) => ({
          id: riesgo.id,
          ...riesgo.data(),
        })));
      },
      (error) => console.error("❌ Error en onSnapshot de riesgos:", error)
    );

    return () => unsuscribe();
  }, [idProyecto]);

  const obtenerMasRiesgos = () => {
    if (!idProyecto || !ultimoRiesgo) return;

    const consulta = query(
      collection(db, "proyectos", idProyecto, "riesgos"),
      orderBy("fechaCreado", "desc"),
      startAfter(ultimoRiesgo),
    );

    onSnapshot(consulta, (snapshot) => {
      if (!snapshot.empty) {
        setUltimoRiesgo(snapshot.docs[snapshot.docs.length - 1]);
        setRiesgos((prevRiesgos) => [
          ...prevRiesgos,
          ...snapshot.docs.map((riesgo) => ({
            id: riesgo.id,
            ...riesgo.data(),
          })),
        ]);
      } else {
        setHayMasPorCargar(false);
      }
    }, console.error);
  };

  return [riesgos, obtenerMasRiesgos, hayMasPorCargar];
};

export default useObtenerRiesgos;
