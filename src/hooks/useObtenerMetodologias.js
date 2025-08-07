// src/hooks/useObtenerMetodologias.js
import { useEffect, useState } from 'react';
import { suscribirMetodologias } from '../firebase/obtenerMetodologias';

export default function useObtenerMetodologias(projectId) {
  const [metodologias, setMetodologias] = useState({});
  useEffect(() => {
    if (!projectId) return;
    const unsubscribe = suscribirMetodologias(projectId, setMetodologias);
    return () => unsubscribe();
  }, [projectId]);
  return metodologias;
}
