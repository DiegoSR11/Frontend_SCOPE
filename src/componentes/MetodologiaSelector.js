// src/componentes/MetodologiaSelector.js
import React from 'react';
import { useParams } from 'react-router-dom';
import FaseAnalisis from './fases/FaseAnalisis';
import FasePlanificacion from './fases/FasePlanificacion';
import FaseDesarrollo from './fases/FaseDesarrollo';
import FaseEntrega from './fases/FaseEntrega';
import ResultadosMetodologia from './ResultadosMetodologia';

export default function MetodologiaSelector() {
  const { id: projectId } = useParams();

  return (
    <div>
      <h1>Selección de Metodología (BETA)</h1>
      <FaseAnalisis projectId={projectId} />
      <FasePlanificacion projectId={projectId} />
      <FaseDesarrollo projectId={projectId} />
      <FaseEntrega projectId={projectId} />
      <ResultadosMetodologia projectId={projectId} />
    </div>
  );
}
