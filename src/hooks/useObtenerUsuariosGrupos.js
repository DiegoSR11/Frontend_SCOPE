import { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../contextos/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const useObtenerUsuariosGrupos = () => {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      if (!usuario) return;

      try {
        // 1. Buscar grupos donde el usuario es miembro
        const q = query(
          collection(db, 'grupos'),
          where('miembros', 'array-contains', usuario.uid)
        );
        const snapshot = await getDocs(q);

        // 2. Extraer todos los UIDs únicos de los miembros (excepto el usuario actual)
        const uids = new Set();
        snapshot.forEach((doc) => {
          const { miembros } = doc.data();
          miembros.forEach((uid) => {
            if (uid !== usuario.uid) uids.add(uid);
          });
        });

        // 3. Obtener los datos de los usuarios basados en los UIDs
        const usuariosObtenidos = [];
        for (let uid of uids) {
          const userRef = doc(db, 'usuarios', uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            usuariosObtenidos.push({ uid, ...userSnap.data() });
          }
        }

        setUsuarios(usuariosObtenidos);
      } catch (error) {
        console.error('Error al obtener usuarios de grupos:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuarios();
  }, [usuario]);

  return { usuarios, cargando };
};

export default useObtenerUsuariosGrupos;
