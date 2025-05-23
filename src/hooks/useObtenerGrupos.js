import { useState, useEffect } from 'react';
import { db } from './../firebase/firebaseConfig';
import { useAuth } from './../contextos/AuthContext';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  getDocs
} from 'firebase/firestore';

const useObtenerGrupos = () => {
  const { usuario } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [ultimoGrupo, setUltimoGrupo] = useState(null);
  const [hayMasPorCargar, setHayMasPorCargar] = useState(false);

  const combinarYOrdenar = (docs1, docs2) => {
    const combinados = [...docs1, ...docs2];
    const unicos = Array.from(
      new Map(combinados.map((doc) => [doc.id, doc])).values()
    );
    return unicos
      .sort((a, b) => b.data().fechaCreado - a.data().fechaCreado)
      .slice(0, 10);
  };

  const obtenerMasGrupos = async () => {
    try {
      const consulta1 = query(
        collection(db, 'grupos'),
        where('creadoPor', '==', usuario.uid),
        orderBy('fechaCreado', 'desc'),
        startAfter(ultimoGrupo?.data()?.fechaCreado || 0),
        limit(10)
      );

      const consulta2 = query(
        collection(db, 'grupos'),
        where('miembros', 'array-contains', usuario.uid),
        orderBy('fechaCreado', 'desc'),
        startAfter(ultimoGrupo?.data()?.fechaCreado || 0),
        limit(10)
      );

      const [snap1, snap2] = await Promise.all([getDocs(consulta1), getDocs(consulta2)]);

      const docsCombinados = combinarYOrdenar(snap1.docs, snap2.docs);

      if (docsCombinados.length > 0) {
        setUltimoGrupo(docsCombinados[docsCombinados.length - 1]);
        setGrupos((prev) =>
          prev.concat(
            docsCombinados.map((doc) => ({ ...doc.data(), id: doc.id }))
          )
        );
        setHayMasPorCargar(true);
      } else {
        setHayMasPorCargar(false);
      }
    } catch (error) {
      console.error('Error al cargar más grupos:', error);
    }
  };

  useEffect(() => {
    if (!usuario) return;

    const consulta1 = query(
      collection(db, 'grupos'),
      where('creadoPor', '==', usuario.uid),
      orderBy('fechaCreado', 'desc'),
      limit(10)
    );

    const consulta2 = query(
      collection(db, 'grupos'),
      where('miembros', 'array-contains', usuario.uid),
      orderBy('fechaCreado', 'desc'),
      limit(10)
    );

    const unsubscribes = [];

    const manejarSnapshot = (snapshot1, snapshot2) => {
      const docsCombinados = combinarYOrdenar(snapshot1.docs, snapshot2.docs);
      if (docsCombinados.length > 0) {
        setUltimoGrupo(docsCombinados[docsCombinados.length - 1]);
        setHayMasPorCargar(true);
      } else {
        setHayMasPorCargar(false);
      }
      setGrupos(docsCombinados.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const sub1 = onSnapshot(consulta1, (snap1) => {
      const sub2 = onSnapshot(consulta2, (snap2) => {
        manejarSnapshot(snap1, snap2);
      });
      unsubscribes.push(sub2);
    });

    unsubscribes.push(sub1);

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [usuario]);

  return [grupos, obtenerMasGrupos, hayMasPorCargar];
};

export default useObtenerGrupos;
