import { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const useObtenerUsuario = (uid) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerUsuario = async () => {
      if (!uid) {
        setCargando(false);
        return;
      }

      try {
        const userRef = doc(db, 'usuarios', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUsuario({
            uid,
            nombre: data.nombre,
            apellido: data.apellido,
            celular: data.celular,
            pais: data.pais,
            departamento: data.departamento,
            empresa: data.empresa,
            area: data.area,
            rol: data.rol,
            correo: data.correo
          });
        } else {
          setUsuario(null);
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuario();
  }, [uid]);

  return { usuario, cargando };
};

export default useObtenerUsuario;
