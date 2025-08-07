// src/componentes/fases/FaseEntrega.js

import React, { useState } from 'react';
import agregarMetodologia from '../../firebase/agregarMetodologia';
import { arbolDecision } from '../../const/metodologias';

export default function FaseEntrega({ projectId }) {
  const [clienteFeedback, setClienteFeedback] = useState(false);
  const [entregasIterativas, setEntregasIterativas] = useState(false);
  const [regulacionEstricta, setRegulacionEstricta] = useState(false);
  const [documentacionRequerida, setDocumentacionRequerida] = useState(false);
  const [soporteExtendido, setSoporteExtendido] = useState(false);
  const [SLADefinido, setSLADefinido] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const seleccionar = () => {
    const regla = arbolDecision.entrega.find(r =>
      Object.entries(r.condiciones).every(([key, value]) => {
        switch (key) {
          case 'clienteFeedback':        return clienteFeedback === value;
          case 'entregasIterativas':     return entregasIterativas === value;
          case 'regulacionEstricta':     return regulacionEstricta === value;
          case 'documentacionRequerida': return documentacionRequerida === value;
          case 'soporteExtendido':       return soporteExtendido === value;
          case 'SLADefinido':            return SLADefinido === value;
          default: return false;
        }
      })
    );
    return regla || { metodo: 'Por definir', descripcion: '', pasos: [] };
  };

  const onSubmit = async e => {
    e.preventDefault();
    setGuardando(true);
    const { metodo, descripcion, pasos } = seleccionar();
    await agregarMetodologia(projectId, 'entrega', {
      metodo,
      descripcion,
      pasos,
      criterios: {
        clienteFeedback,
        entregasIterativas,
        regulacionEstricta,
        documentacionRequerida,
        soporteExtendido,
        SLADefinido
      }
    });
    setGuardando(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Fase de Entrega</h2>
      <label>
        Recoge feedback del cliente:
        <input
          type="checkbox"
          checked={clienteFeedback}
          onChange={e => setClienteFeedback(e.target.checked)}
        />
      </label>
      <label>
        Entregas iterativas:
        <input
          type="checkbox"
          checked={entregasIterativas}
          onChange={e => setEntregasIterativas(e.target.checked)}
        />
      </label>
      <label>
        Regulación estricta:
        <input
          type="checkbox"
          checked={regulacionEstricta}
          onChange={e => setRegulacionEstricta(e.target.checked)}
        />
      </label>
      <label>
        Documentación requerida:
        <input
          type="checkbox"
          checked={documentacionRequerida}
          onChange={e => setDocumentacionRequerida(e.target.checked)}
        />
      </label>
      <label>
        Soporte extendido:
        <input
          type="checkbox"
          checked={soporteExtendido}
          onChange={e => setSoporteExtendido(e.target.checked)}
        />
      </label>
      <label>
        SLA definido:
        <input
          type="checkbox"
          checked={SLADefinido}
          onChange={e => setSLADefinido(e.target.checked)}
        />
      </label>
      <button type="submit" disabled={guardando}>
        {guardando ? 'Guardando…' : 'Seleccionar metodología'}
      </button>
    </form>
  );
}
