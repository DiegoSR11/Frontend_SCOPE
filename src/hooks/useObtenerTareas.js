import { useState, useEffect } from "react";
import { db } from "./../firebase/firebaseConfig";
import { collection, onSnapshot, query, orderBy, startAfter } from "firebase/firestore";

const useObtenerTareas = (idProyecto) => {
  const [tareas, setTareas] = useState([]);
  const [ultimaTarea, setUltimaTarea] = useState(null);
  const [hayMasPorCargar, setHayMasPorCargar] = useState(false);
  
  useEffect(() => {
    if (!idProyecto) return;

    const consulta = query(
      collection(db, "proyectos", idProyecto, "tareas"), 
      orderBy("fechaCreado", "desc"),
    );

    const unsuscribe = onSnapshot(
      consulta,
      (snapshot) => {

        if (!snapshot.empty) {
          setUltimaTarea(snapshot.docs[snapshot.docs.length - 1]);
          setHayMasPorCargar(snapshot.docs.length === 10);
        } else {
          setHayMasPorCargar(false);
        }

        setTareas(snapshot.docs.map((tarea) => ({
          id: tarea.id,
          ...tarea.data(),
        })));
      },
      (error) => console.error("❌ Error en onSnapshot:", error)
    );

    return () => unsuscribe();
  }, [idProyecto]);

  const obtenerMasTareas = () => {
    if (!idProyecto || !ultimaTarea) return;

    const consulta = query(
      collection(db, "proyectos", idProyecto, "tareas"),
      orderBy("fechaCreado", "desc"),
      startAfter(ultimaTarea),
    );

    onSnapshot(consulta, (snapshot) => {
      if (!snapshot.empty) {
        setUltimaTarea(snapshot.docs[snapshot.docs.length - 1]);
        setTareas((prevTareas) => [
          ...prevTareas,
          ...snapshot.docs.map((tarea) => ({
            id: tarea.id,
            ...tarea.data(),
          })),
        ]);
      } else {
        setHayMasPorCargar(false);
      }
    }, console.error);
  };

  return [tareas, obtenerMasTareas, hayMasPorCargar];
};

export default useObtenerTareas;
