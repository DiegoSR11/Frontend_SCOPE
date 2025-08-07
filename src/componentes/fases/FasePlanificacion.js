// src/componentes/fases/FasePlanificacion.js

import React, { useState } from 'react';
import agregarMetodologia from '../../firebase/agregarMetodologia';
import { arbolDecision } from '../../const/metodologias';

export default function FasePlanificacion({ projectId }) {
  const [duracionMeses, setDuracionMeses] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [riesgos, setRiesgos] = useState('');
  const [clienteInvolucrado, setClienteInvolucrado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const seleccionar = () => {
    const regla = arbolDecision.planificacion.find(r => {
      const c = r.condiciones;
      if (c.duracionMeses) {
        const expr = c.duracionMeses.trim();
        if (expr.startsWith('<=') && !(Number(duracionMeses) <= Number(expr.slice(2)))) return false;
        if (expr.startsWith('>') && !(Number(duracionMeses) > Number(expr.slice(1)))) return false;
      }
      if (c.presupuesto && c.presupuesto !== presupuesto) return false;
      if (c.riesgos && c.riesgos !== riesgos) return false;
      if (typeof c.clienteInvolucrado === 'boolean' && c.clienteInvolucrado !== clienteInvolucrado) return false;
      return true;
    });
    return regla || { metodo: 'Por definir', descripcion: '', pasos: [] };
  };

  const onSubmit = async e => {
    e.preventDefault();
    setGuardando(true);
    const { metodo, descripcion, pasos } = seleccionar();
    await agregarMetodologia(projectId, 'planificacion', {
      metodo,
      descripcion,
      pasos,
      criterios: { duracionMeses, presupuesto, riesgos, clienteInvolucrado }
    });
    setGuardando(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Fase de Planificación</h2>
      <label>
        Duración (meses):
        <input
          type="number"
          min="0"
          value={duracionMeses}
          onChange={e => setDuracionMeses(e.target.value)}
          required
        />
      </label>
      <label>
        Presupuesto:
        <select
          value={presupuesto}
          onChange={e => setPresupuesto(e.target.value)}
          required
        >
          <option value="">—</option>
          <option value="limitado">Limitado</option>
          <option value="alto">Alto</option>
        </select>
      </label>
      <label>
        Nivel de riesgos:
        <select
          value={riesgos}
          onChange={e => setRiesgos(e.target.value)}
          required
        >
          <option value="">—</option>
          <option value="bajo">Bajo</option>
          <option value="altos">Altos</option>
        </select>
      </label>
      <label>
        Cliente involucrado:
        <input
          type="checkbox"
          checked={clienteInvolucrado}
          onChange={e => setClienteInvolucrado(e.target.checked)}
        />
      </label>
      <button type="submit" disabled={guardando}>
        {guardando ? 'Guardando…' : 'Seleccionar metodología'}
      </button>
    </form>
  );
}
