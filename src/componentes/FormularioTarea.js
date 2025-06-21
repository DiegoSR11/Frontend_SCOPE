// src/components/FormularioTarea.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { getUnixTime } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { Formulario } from './../elementos/ElementosDeFormulario';
import agregarTarea from './../firebase/agregarTarea';
import editarTarea from './../firebase/editarTarea';
import { useAuth } from '../contextos/AuthContext';
import BtnRegresar from "./../elementos/BtnRegresar";
import Alerta from './../elementos/Alerta';
import MultiSelectDropdown from "./../elementos/MultiSelectDropdown";
import { Header, Titulo, ContenedorHeader } from './../elementos/Header';
import DatePicker from './DatePicker';
import { ReactComponent as IconoPlus } from './../imagenes/plus.svg';
import SelectEstado from './SelectEstado';
import useObtenerProyecto from '../hooks/useObtenerProyecto';
import useObtenerTareas from "./../hooks/useObtenerTareas";
import { doc, getDoc } from 'firebase/firestore';
import { db } from './../firebase/firebaseConfig';

const TarjetaFormulario = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 0 12px rgba(0,0,0,0.1);
  margin: 2rem auto;
  max-width: 800px;
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

const GridFormulario = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const CampoFormulario = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const InputTarea = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ccc;
  border-radius: 0.625rem;
  font-size: 1rem;
  font-family: 'Work Sans', sans-serif;
`;

// Nuevo: textarea extensible para descripción
const TextareaDescripcion = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ccc;
  border-radius: 0.625rem;
  font-size: 1rem;
  font-family: 'Work Sans', sans-serif;
  min-height: 100px;
  resize: vertical;
  margin-bottom: 1rem;
  background: #fff;
`;

const ContenedorBotones = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;
const BotonCancelar = styled.button`
  background: #fff;
  border: 1px solid #ccc;
  color: #333;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  height: 2.5rem;
  &:hover { background: #f5f5f5; }
`;
const BotonCrear = styled.button`
  background: #00A9FF;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.625rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 2.5rem;
  &:hover { background: #008FCC; }
  &:disabled { background: #ccc; cursor: not-allowed; }
  svg { height: 1rem; margin-right: 0.5rem; fill: white; }
`;
const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ccc;
  border-radius: 0.625rem;
  font-size: 1rem;
  font-family: 'Work Sans', sans-serif;
`;

const validarNombreTarea = (valor) => valor && valor.trim() !== '';
const validarDescripcionTarea = (valor) => valor && valor.trim() !== '';
const validarResponsables = (valor) => Array.isArray(valor) && valor.length > 0;

const FormularioTarea = ({ tarea: tareaProp, idProyecto: idProyectoProp }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // Determinar IDs via props o params
  const idProyecto = idProyectoProp || params.id;
  const idTarea = tareaProp?.id || params.idTarea;

  const [proyecto] = useObtenerProyecto(idProyecto);
  const [tareas] = useObtenerTareas(idProyecto);

  // Form state
  const [nombreTarea, setNombreTarea] = useState('');
  const [descripcionTarea, setDescripcionTarea] = useState('');
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState(new Date());
  const [estadoTarea, setEstadoTarea] = useState("Pendiente");
  const [responsables, setResponsables] = useState([]);
  const [antecesora, setAntecesora] = useState('');
  const [predecesora, setPredecesora] = useState('');
  const [gestores, setGestores] = useState([]);
  const [enviando, setEnviando] = useState(false);

  // Alertas
  const [estadoAlerta, setEstadoAlerta] = useState(false);
  const [alerta, setAlerta] = useState({});

  const esEdicion = Boolean(idTarea);

  useEffect(() => {
    if (esEdicion && tareaProp) {
      setNombreTarea(tareaProp.nombreTarea || '');
      setDescripcionTarea(tareaProp.descripcionTarea || '');
      setFechaInicio(
        tareaProp.fechaCreado
          ? new Date(tareaProp.fechaCreado * 1000)
          : new Date()
      );
      setFechaVencimiento(
        tareaProp.fechaVencimiento
          ? new Date(tareaProp.fechaVencimiento * 1000)
          : new Date()
      );
      setEstadoTarea(tareaProp.estadoTarea || 'Pendiente');
      setResponsables(tareaProp.responsables || []);
      setAntecesora(tareaProp.tareaAntecesora || '');
      setPredecesora(tareaProp.tareaPredecesora || '');
    }
  }, [esEdicion, tareaProp]);

  useEffect(() => {
    const fetchGestores = async () => {
      if (!proyecto?.gestores) return;
      const info = await Promise.all(
        proyecto.gestores.map(async uid => {
          const ref = doc(db, 'usuarios', uid);
          const snap = await getDoc(ref);
          return snap.exists() ? { uid, ...snap.data() } : null;
        })
      );
      setGestores(info.filter(Boolean));
    };
    fetchGestores();
  }, [proyecto]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);

    const faltantes = [];
    if (!validarNombreTarea(nombreTarea)) faltantes.push('nombre de la tarea');
    if (!validarDescripcionTarea(descripcionTarea)) faltantes.push('descripción');
    if (!validarResponsables(responsables)) faltantes.push('responsable(s)');

    if (faltantes.length === 1) {
      setAlerta({ tipo: 'error', mensaje: `Debe completar el campo: ${faltantes[0]}.` });
      setEstadoAlerta(true);
      setEnviando(false);
      return;
    }
    if (faltantes.length > 1) {
      setAlerta({ tipo: 'error', mensaje: `Debe completar los siguientes campos: ${faltantes.join(', ')}.` });
      setEstadoAlerta(true);
      setEnviando(false);
      return;
    }

    if (fechaVencimiento < fechaInicio) {
      setAlerta({ tipo: 'error', mensaje: 'La fecha de vencimiento no puede ser anterior a la fecha de inicio.' });
      setEstadoAlerta(true);
      setEnviando(false);
      return;
    }

    const currentId = esEdicion ? idTarea : null;
    if (antecesora && predecesora && antecesora === predecesora) {
      setAlerta({ tipo: 'error', mensaje: 'La tarea antecesora y la predecesora no pueden ser la misma.' });
      setEstadoAlerta(true);
      setEnviando(false);
      return;
    }
    if (currentId) {
      if (antecesora && antecesora === currentId) {
        setAlerta({ tipo: 'error', mensaje: 'La tarea no puede ser antecesora de sí misma.' });
        setEstadoAlerta(true);
        setEnviando(false);
        return;
      }
      if (predecesora && predecesora === currentId) {
        setAlerta({ tipo: 'error', mensaje: 'La tarea no puede ser predecesora de sí misma.' });
        setEstadoAlerta(true);
        setEnviando(false);
        return;
      }
    }

    const payload = {
      idProyecto,
      uidUsuario: usuario.uid,
      nombreTarea,
      descripcionTarea,
      fechaCreado: getUnixTime(fechaInicio),
      fechaVencimiento: getUnixTime(fechaVencimiento),
      estadoTarea,
      responsables,
      tareaAntecesora: antecesora,
      tareaPredecesora: predecesora,
      notas: []
    };

    try {
      if (esEdicion) {
        await editarTarea({ idTarea, ...payload });
        setAlerta({ tipo: 'exito', mensaje: 'Tarea actualizada.' });
      } else {
        await agregarTarea(payload);
        setAlerta({ tipo: 'exito', mensaje: 'Tarea creada.' });
        setNombreTarea('');
        setDescripcionTarea('');
        setFechaInicio(new Date());
        setFechaVencimiento(new Date());
        setEstadoTarea('Pendiente');
        setResponsables([]);
        setAntecesora('');
        setPredecesora('');
      }
      setEstadoAlerta(true);
      setTimeout(() => navigate(`/proyecto/${idProyecto}`), 800);
    } catch (err) {
      console.error(err);
      setAlerta({ tipo: 'error', mensaje: 'Error al guardar.' });
      setEstadoAlerta(true);
    }
    setEnviando(false);
  };

  return (
    <>
      <Helmet>
        <title>{esEdicion ? 'Editar Tarea' : 'Crear Tarea'}</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <BtnRegresar />
          <Titulo>
            {esEdicion ? 'Editar Tarea' : 'Crear Tarea'} – {nombreTarea || '...'}
          </Titulo>
        </ContenedorHeader>
      </Header>

      <Formulario onSubmit={handleSubmit}>
        <TarjetaFormulario>
          <ComentarioObligatorio>
            Campos obligatorios: Nombre, Descipción, Estado, Responsable y Fechas.
          </ComentarioObligatorio>

          <CampoFormulario>
            <Label>Nombre de la tarea</Label>
            <InputTarea
              value={nombreTarea}
              onChange={e => setNombreTarea(e.target.value)}
              placeholder="Ejemplo: Preparar informe de avance del proyecto"
            />
          </CampoFormulario>

          <CampoFormulario style={{ marginTop: '1rem' }}>
            <Label>Descripción</Label>
            <TextareaDescripcion
              value={descripcionTarea}
              onChange={e => setDescripcionTarea(e.target.value)}
              placeholder="Describe con detalle la actividad, entregable esperado y cualquier requerimiento especial"
            />
          </CampoFormulario>

          <GridFormulario style={{ marginTop: '1.5rem' }}>
            <CampoFormulario>
              <Label>Fecha de inicio</Label>
              <DatePicker fecha={fechaInicio} cambiarFecha={setFechaInicio} />
            </CampoFormulario>
            <CampoFormulario>
              <Label>Fecha de vencimiento</Label>
              <DatePicker fecha={fechaVencimiento} cambiarFecha={setFechaVencimiento} />
            </CampoFormulario>
            <CampoFormulario>
              <Label>Estado</Label>
              <SelectEstado estado={estadoTarea} cambiarEstado={setEstadoTarea} />
            </CampoFormulario>
            <CampoFormulario>
              <Label>Responsables</Label>
              <MultiSelectDropdown
                options={gestores}
                selected={responsables}
                setSelected={setResponsables}
                label="responsables"
              />
            </CampoFormulario>
            <CampoFormulario>
              <Label>Tarea antecesora</Label>
              <Select value={antecesora} onChange={e => setAntecesora(e.target.value)}>
                <option value="">Ninguna</option>
                {tareas.map(t => (
                  <option key={t.id} value={t.id}>{t.nombreTarea}</option>
                ))}
              </Select>
            </CampoFormulario>
            <CampoFormulario>
              <Label>Tarea predecesora</Label>
              <Select value={predecesora} onChange={e => setPredecesora(e.target.value)}>
                <option value="">Ninguna</option>
                {tareas.map(t => (
                  <option key={t.id} value={t.id}>{t.nombreTarea}</option>
                ))}
              </Select>
            </CampoFormulario>
          </GridFormulario>

          <ContenedorBotones>
            <BotonCancelar type="button" onClick={() => navigate(-1)}>
              Cancelar
            </BotonCancelar>
            <BotonCrear type="submit" disabled={enviando}>
              {esEdicion
                ? enviando ? 'Actualizando...' : 'Actualizar'
                : enviando ? 'Creando...' : '+ Agregar Tarea'}
            </BotonCrear>
          </ContenedorBotones>

          <Alerta
            tipo={alerta.tipo}
            mensaje={alerta.mensaje}
            estadoAlerta={estadoAlerta}
            cambiarEstadoAlerta={setEstadoAlerta}
          />
        </TarjetaFormulario>
      </Formulario>
    </>
  );
};

export default FormularioTarea;
