// src/componentes/CrearProyectoHibrido.jsx

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Formulario } from './../elementos/ElementosDeFormulario';
import { auth } from '../firebase/firebaseConfig';
import agregarProyecto from '../firebase/agregarProyecto';
import agregarMetodologia from '../firebase/agregarMetodologia';
import { arbolDecision } from '../const/metodologias';
import {
  SelectNivelDocumentacion,
  SelectIterativoProyecto,
  SelectStakeholdersInvolucrados,
  SelectDuracionMeses,
  SelectPresupuesto,
  SelectNivelRiesgo,
  SelectRequisitosRegulatorios,
  SelectCulturaColaborativa,
  SelectFeedbackContinuo,
  SelectIntegracionContinua,
  SelectEntregasFrecuentes,
  SelectMantenimientoPrevisto,
  SelectAltaDisponibilidad,
  SelectDespliegueSegmentado,
  SelectPlanRollback
} from './SelectPropiedades';

// ─── Styled Components ─────────────────────────────────────────────────────────

const TarjetaFormulario = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0px 0px 12px rgba(0,0,0,0.5);
  max-width: 1200px;
  margin: 2rem 10rem 4rem 10rem;
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const ComentarioObligatorio = styled.div`
  background: #F7F8FC;
  color: #1a237e;
  border-left: 5px solid #1976d2;
  border-radius: 0.4rem;
  margin-bottom: 1.3rem;
  padding: 0.6rem 1.2rem;
  font-size: 1.01rem;
  font-weight: 500;
  font-family: 'Work Sans', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepTitle = styled.h2`
  color: #00A9FF;
  text-align: center;
  margin-bottom: 1rem;
`;

const CampoProyecto = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
`;

const InputProyecto = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 3px solid #ccc;
  border-radius: 0.625rem;
  font-size: 1.1rem;
  font-family: 'Work Sans', sans-serif;
  background: ${({ disabled }) => (disabled ? '#f2f2f2' : '#fff')};
  color: ${({ disabled }) => (disabled ? '#888' : '#222')};
`;

const TextareaProyecto = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 3px solid #ccc;
  border-radius: 0.625rem;
  font-size: 1.1rem;
  font-family: 'Work Sans', sans-serif;
  resize: vertical;
  min-height: 100px;
`;

const SelectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContenedorBotonesAccion = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Boton = styled.button`
  background: #00A9FF;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.625rem;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Work Sans', sans-serif;
  cursor: pointer;
  transition: background 0.3s ease;
  height: 2.5rem;
  flex: 1;
  &:hover { background: #008FCC; }
  &:active { background: #007BB5; }
  &:disabled { background: #ccc; cursor: not-allowed; }
`;

const BotonSecundario = styled(Boton)`
  background: #fff;
  color: #333;
  border: 1px solid #ccc;
  &:hover { background: #f5f5f5; }
`;

// ─── Componente ─────────────────────────────────────────────────────────────

export default function CrearProyectoHibrido() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Paso 1
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Paso 2
  const [nivelDocumentacion, setNivelDocumentacion] = useState('');
  const [iterativoProyecto, setIterativoProyecto] = useState('');
  const [stakeholders, setStakeholders] = useState('');

  // Paso 3
  const [duracionMeses, setDuracionMeses] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [nivelRiesgo, setNivelRiesgo] = useState('');
  const [requisitosRegulatorios, setRequisitosRegulatorios] = useState('');

  // Paso 4
  const [culturaColaborativa, setCulturaColaborativa] = useState('');
  const [feedbackContinuo, setFeedbackContinuo] = useState('');
  const [integracionContinua, setIntegracionContinua] = useState('');
  const [entregasFrecuentes, setEntregasFrecuentes] = useState('');
  const [mantenimientoPrevisto, setMantenimientoPrevisto] = useState('');

  // Paso 5
  const [altaDisponibilidad, setAltaDisponibilidad] = useState('');
  const [despliegueSegmentado, setDespliegueSegmentado] = useState('');
  const [planRollback, setPlanRollback] = useState('');

  const seleccionarRegla = (fase, criterios) => {
    const reglas = arbolDecision[fase] || [];
    return (
      reglas.find(r =>
        Object.entries(r.condiciones).every(([k, v]) => {
          if (k === 'duracionMeses' && typeof v === 'string') {
            if (v.startsWith('<=') && !(Number(criterios[k]) <= Number(v.slice(2)))) return false;
            if (v.startsWith('>') && !(Number(criterios[k]) > Number(v.slice(1)))) return false;
            return true;
          }
          if (typeof v === 'boolean') return criterios[k] === v;
          return criterios[k] === v;
        })
      ) || { metodo: 'Por definir', descripcion: '', pasos: [] }
    );
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1);
      return;
    }

    const uid = auth.currentUser.uid;
    const payload = {
      nombreProyecto: nombre,
      descripcion,
      fechaCreado: new Date(),
      complejoRiesgos: nivelRiesgo === 'alto',
      presenciaCliente: stakeholders === 'si',
      iterativoProyecto: iterativoProyecto === 'si',
      tamanioProyecto: '',
      tipoProyecto: 'hibrido',
      metodologiaProyecto: null,
      uidUsuario: uid
    };
    const { id: projectId } = await agregarProyecto(payload);

    const fases = [
      { key: 'analisis', criterios: { nivelDocumentacion, iterativoProyecto, stakeholders } },
      { key: 'planificacion', criterios: { duracionMeses, presupuesto, nivelRiesgo, requisitosRegulatorios } },
      { key: 'desarrollo', criterios: { culturaColaborativa, feedbackContinuo, integracionContinua, entregasFrecuentes, mantenimientoPrevisto } },
      { key: 'entrega', criterios: { altaDisponibilidad, despliegueSegmentado, planRollback } }
    ];
    for (const { key, criterios } of fases) {
      const { metodo, descripcion: descMet, pasos } = seleccionarRegla(key, criterios);
      await agregarMetodologia(projectId, key, { metodo, descripcion: descMet, pasos, criterios });
    }

    navigate(`/proyecto/${projectId}`);
  };

  const handleBack = () => {
    if (step === 1) return navigate('/');
    setStep(step - 1);
  };

  return (
    <div>
      <Helmet>
        <title>Crear Proyecto Híbrido</title>
      </Helmet>

      <Formulario onSubmit={e => { e.preventDefault(); handleNext(); }}>
        <TarjetaFormulario>
          <ComentarioObligatorio>
            <span>Paso {step} de 5: completa los campos requeridos</span>
          </ComentarioObligatorio>

          <StepTitle>Híbrido - Paso {step}</StepTitle>

          {step === 1 && (
            <>
              <CampoProyecto>
                <Label>Nombre del proyecto</Label>
                <InputProyecto
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                />
              </CampoProyecto>
              <CampoProyecto>
                <Label>Descripción</Label>
                <TextareaProyecto
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  required
                />
              </CampoProyecto>
            </>
          )}

          {step === 2 && (
            <SelectsGrid>
              <SelectNivelDocumentacion valor={nivelDocumentacion} cambiarValor={setNivelDocumentacion} />
              <SelectIterativoProyecto valor={iterativoProyecto} cambiarValor={setIterativoProyecto} />
              <SelectStakeholdersInvolucrados valor={stakeholders} cambiarValor={setStakeholders} />
            </SelectsGrid>
          )}

          {step === 3 && (
            <SelectsGrid>
              <SelectDuracionMeses valor={duracionMeses} cambiarValor={setDuracionMeses} />
              <SelectPresupuesto valor={presupuesto} cambiarValor={setPresupuesto} />
              <SelectNivelRiesgo valor={nivelRiesgo} cambiarValor={setNivelRiesgo} />
              <SelectRequisitosRegulatorios valor={requisitosRegulatorios} cambiarValor={setRequisitosRegulatorios} />
            </SelectsGrid>
          )}

          {step === 4 && (
            <SelectsGrid>
              <SelectCulturaColaborativa valor={culturaColaborativa} cambiarValor={setCulturaColaborativa} />
              <SelectFeedbackContinuo valor={feedbackContinuo} cambiarValor={setFeedbackContinuo} />
              <SelectIntegracionContinua valor={integracionContinua} cambiarValor={setIntegracionContinua} />
              <SelectEntregasFrecuentes valor={entregasFrecuentes} cambiarValor={setEntregasFrecuentes} />
              <SelectMantenimientoPrevisto valor={mantenimientoPrevisto} cambiarValor={setMantenimientoPrevisto} />
            </SelectsGrid>
          )}

          {step === 5 && (
            <SelectsGrid>
              <SelectAltaDisponibilidad valor={altaDisponibilidad} cambiarValor={setAltaDisponibilidad} />
              <SelectDespliegueSegmentado valor={despliegueSegmentado} cambiarValor={setDespliegueSegmentado} />
              <SelectPlanRollback valor={planRollback} cambiarValor={setPlanRollback} />
            </SelectsGrid>
          )}

          <ContenedorBotonesAccion>
            <BotonSecundario type="button" onClick={handleBack}>Atrás</BotonSecundario>
            <Boton type="submit">{step < 5 ? 'Siguiente' : 'Finalizar'}</Boton>
          </ContenedorBotonesAccion>
        </TarjetaFormulario>
      </Formulario>
    </div>
  );
}
