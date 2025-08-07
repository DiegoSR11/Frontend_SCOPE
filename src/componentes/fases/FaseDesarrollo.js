// src/componentes/fases/FaseDesarrollo.js

import React, { useState } from 'react';
import agregarMetodologia from '../../firebase/agregarMetodologia';
import { arbolDecision } from '../../const/metodologias';

export default function FaseDesarrollo({ projectId }) {
  const [culturaColaborativa, setCulturaColaborativa] = useState(false);
  const [feedbackContinuo, setFeedbackContinuo] = useState(false);
  const [entregasFrecuentes, setEntregasFrecuentes] = useState(false);
  const [mantenimientoPrevisto, setMantenimientoPrevisto] = useState(false);
  const [integracionContinua, setIntegracionContinua] = useState(false);
  const [despliegueAutomatizado, setDespliegueAutomatizado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const seleccionar = () => {
    const regla = arbolDecision.desarrollo.find(r =>
      Object.entries(r.condiciones).every(([key, value]) => {
        switch (key) {
          case 'culturaColaborativa': return culturaColaborativa === value;
          case 'feedbackContinuo':    return feedbackContinuo === value;
          case 'entregasFrecuentes':  return entregasFrecuentes === value;
          case 'mantenimientoPrevisto': return mantenimientoPrevisto === value;
          case 'integracionContinua': return integracionContinua === value;
          case 'despliegueAutomatizado': return despliegueAutomatizado === value;
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
    await agregarMetodologia(projectId, 'desarrollo', {
      metodo,
      descripcion,
      pasos,
      criterios: {
        culturaColaborativa,
        feedbackContinuo,
        entregasFrecuentes,
        mantenimientoPrevisto,
        integracionContinua,
        despliegueAutomatizado
      }
    });
    setGuardando(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Fase de Desarrollo</h2>
      <label>
        Cultura colaborativa:
        <input
          type="checkbox"
          checked={culturaColaborativa}
          onChange={e => setCulturaColaborativa(e.target.checked)}
        />
      </label>
      <label>
        Feedback continuo:
        <input
          type="checkbox"
          checked={feedbackContinuo}
          onChange={e => setFeedbackContinuo(e.target.checked)}
        />
      </label>
      <label>
        Entregas frecuentes:
        <input
          type="checkbox"
          checked={entregasFrecuentes}
          onChange={e => setEntregasFrecuentes(e.target.checked)}
        />
      </label>
      <label>
        Mantenimiento previsto:
        <input
          type="checkbox"
          checked={mantenimientoPrevisto}
          onChange={e => setMantenimientoPrevisto(e.target.checked)}
        />
      </label>
      <label>
        Integración continua:
        <input
          type="checkbox"
          checked={integracionContinua}
          onChange={e => setIntegracionContinua(e.target.checked)}
        />
      </label>
      <label>
        Despliegue automatizado:
        <input
          type="checkbox"
          checked={despliegueAutomatizado}
          onChange={e => setDespliegueAutomatizado(e.target.checked)}
        />
      </label>
      <button type="submit" disabled={guardando}>
        {guardando ? 'Guardando…' : 'Seleccionar metodología'}
      </button>
    </form>
  );
}
