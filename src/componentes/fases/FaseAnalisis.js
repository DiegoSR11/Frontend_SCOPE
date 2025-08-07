// src/componentes/fases/FaseAnalisis.js

import React, { useState } from 'react';
import agregarMetodologia from '../../firebase/agregarMetodologia';
import { arbolDecision } from '../../const/metodologias';

export default function FaseAnalisis({ projectId }) {
  const [tamañoEquipo, setTamañoEquipo] = useState('');
  const [complejidad, setComplejidad] = useState('');
  const [guardando, setGuardando] = useState(false);

  const seleccionar = () => {
    const regla = arbolDecision.analisis.find(r =>
      r.condiciones.tamañoEquipo === tamañoEquipo &&
      r.condiciones.complejidad === complejidad
    );
    return regla || { metodo: 'Por definir', descripcion: '', pasos: [] };
  };

  const onSubmit = async e => {
    e.preventDefault();
    setGuardando(true);
    const { metodo, descripcion, pasos } = seleccionar();
    await agregarMetodologia(projectId, 'analisis', {
      metodo,
      descripcion,
      pasos,
      criterios: { tamañoEquipo, complejidad }
    });
    setGuardando(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Fase de Análisis</h2>
      <label>
        Tamaño del equipo:
        <select
          value={tamañoEquipo}
          onChange={e => setTamañoEquipo(e.target.value)}
          required
        >
          <option value="">—</option>
          <option value="pequeño">Pequeño</option>
          <option value="mediano">Mediano</option>
          <option value="grande">Grande</option>
        </select>
      </label>
      <label>
        Complejidad:
        <select
          value={complejidad}
          onChange={e => setComplejidad(e.target.value)}
          required
        >
          <option value="">—</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </label>
      <button type="submit" disabled={guardando}>
        {guardando ? 'Guardando…' : 'Seleccionar metodología'}
      </button>
    </form>
  );
}
