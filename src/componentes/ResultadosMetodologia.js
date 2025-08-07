// src/componentes/ResultadosMetodologia.js
import React from 'react';
import useObtenerMetodologias from '../hooks/useObtenerMetodologias';

export default function ResultadosMetodologia({ projectId }) {
  const metas = useObtenerMetodologias(projectId);

  return (
    <div>
      <h2>Metodologías Seleccionadas</h2>
      {['analisis','planificacion','desarrollo','entrega'].map(fase => (
        <div key={fase}>
          <h3>{fase.charAt(0).toUpperCase()+fase.slice(1)}</h3>
          {metas[fase] ? (
            <>
              <strong>Método:</strong> {metas[fase].metodo}<br/>
              <p>{metas[fase].descripcion}</p>
              <ul>
                {metas[fase].pasos.map((p,i) => <li key={i}>{p}</li>)}
              </ul>
            </>
          ) : (
            <em>No hay datos para esta fase.</em>
          )}
        </div>
      ))}
    </div>
  );
}
