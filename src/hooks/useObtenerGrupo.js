import { useEffect, useState } from 'react';
import { db } from './../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

const useObtenerGrupo = (id) => {
    const navigate = useNavigate();
    const [grupo, establecerGrupo] = useState(null); // Mejor usar null para indicar que aún no hay datos

    useEffect(() => {
        const obtenerGrupo = async () => {
            try {
                const documento = await getDoc(doc(db, 'grupos', id));

                if (documento.exists()) {
                    establecerGrupo({ id: documento.id, ...documento.data() });
                } else {
                    navigate('/lista');
                }
            } catch (error) {
                console.error('Error al obtener el grupo:', error);
                navigate('/lista');
            }
        };

        obtenerGrupo();
    }, [navigate, id]);

    return grupo;
};

export default useObtenerGrupo;
