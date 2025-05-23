import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { getUnixTime } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { Formulario } from './../elementos/ElementosDeFormulario';
import { useAuth } from '../contextos/AuthContext';
import BtnRegresar from "./../elementos/BtnRegresar";
import Alerta from './../elementos/Alerta';
import { Header, Titulo, ContenedorHeader } from './../elementos/Header';
import DatePicker from './DatePicker';
import { ReactComponent as IconoPlus } from './../imagenes/plus.svg';
import useObtenerProyecto from '../hooks/useObtenerProyecto';
import agregarRiesgo from './../firebase/agregarRiesgo'; 
import editarRiesgo from './../firebase/editarRiesgo'; // Importa editarRiesgo
import {
  SelectNivelImpacto,
  SelectProbabilidad
} from './SelectPropiedades';

const TarjetaFormulario = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  margin: 2rem auto;

  @media (max-width: 100px) {
    padding: 1.5rem;
    margin: 1rem;
  }
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
  padding: 0.75rem 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'Work Sans', sans-serif;
  transition: all 0.3s;
  height: 2.5rem;

  &:hover {
    background-color: #f5f5f5;
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const BotonCrear = styled.button`
  background: #FF5733;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.625rem;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Work Sans', sans-serif;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;

  &:hover {
    background: #E04E2F;
  }

  &:active {
    background: #C63E24;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  svg {
    height: ${(props) => props.$iconoGrande ? '1.5rem' : '0.75rem'};
    width: auto;
    fill: white;
  }
`;

// Ahora el componente recibe props riesgo (opcional) e idProyecto
const FormularioRiesgo = ({ riesgo, idProyecto }) => {
  const { id } = useParams();
  const { usuario } = useAuth();
  const [proyecto] = useObtenerProyecto(idProyecto || id);
  const navigate = useNavigate();
  const idRiesgo = riesgo?.id;

  // Estados de los campos, si riesgo existe inicializamos con esos valores (para edición)
  const [nombreRiesgo, setNombreRiesgo] = useState(riesgo?.nombreRiesgo || '');
  const [descripcionRiesgo, setDescripcionRiesgo] = useState(riesgo?.descripcionRiesgo || '');
  const [fechaCreado, setfechaCreado] = useState(
    riesgo?.fechaIdentificacion
      ? new Date(riesgo.fechaCreado * 1000)
      : new Date()
  );
  const [nivelImpacto, setNivelImpacto] = useState(riesgo?.impacto || '');
  const [probabilidad, setProbabilidad] = useState(riesgo?.probabilidad || '');
  const [estrategia, setEstrategia] = useState(riesgo?.estrategia || '');
  const [estadoAlerta, setEstadoAlerta] = useState(false);
  const [alerta, setAlerta] = useState({});

  // Actualizar estados si cambia la prop riesgo (por si se carga después)
  useEffect(() => {
    if (riesgo) {
      setNombreRiesgo(riesgo.nombreRiesgo || '');
      setDescripcionRiesgo(riesgo.descripcionRiesgo || '');
      setfechaCreado(
        riesgo.fechaCreado ? new Date(riesgo.fechaCreado * 1000) : new Date()
      );
      setNivelImpacto(riesgo.impacto || '');
      setProbabilidad(riesgo.probabilidad || '');
      setEstrategia(riesgo.estrategia || '');
    }
  }, [riesgo]);

const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación: todos los campos obligatorios
    if (
      !nombreRiesgo.trim() ||
      !descripcionRiesgo.trim() ||
      !nivelImpacto.trim() ||
      !probabilidad.trim() ||
      !estrategia.trim()
    ) {
      setEstadoAlerta(true);
      setAlerta({ tipo: 'error', mensaje: 'Todos los campos son obligatorios' });
      return;
    }

    const dataRiesgo = {
      idProyecto: idProyecto || id,
      uidUsuario: usuario.uid,
      nombreRiesgo,
      descripcionRiesgo,
      impacto: nivelImpacto,
      probabilidad,
      estrategia,
      fechaCreado: getUnixTime(fechaCreado),
    };

    const dataRiesgoEditar = {
      idRiesgo,
      idProyecto: idProyecto || id,
      uidUsuario: usuario.uid,
      nombreRiesgo,
      descripcionRiesgo,
      impacto: nivelImpacto,
      probabilidad,
      estrategia,
      fechaCreado: getUnixTime(fechaCreado),
    };

    try {
      if (riesgo && riesgo.id) {
        // Edición
        await editarRiesgo(dataRiesgoEditar);
        setAlerta({ tipo: 'exito', mensaje: 'El riesgo fue editado correctamente' });
      } else {
        // Creación
        await agregarRiesgo({
          ...dataRiesgo,
          fechaCreado: getUnixTime(new Date()),
        });
        setAlerta({ tipo: 'exito', mensaje: 'El riesgo fue agregado correctamente' });

        // Limpiar campos solo en creación
        setNombreRiesgo('');
        setDescripcionRiesgo('');
        setNivelImpacto('');
        setProbabilidad('');
        setEstrategia('');
        setfechaCreado(new Date());
      }
      setEstadoAlerta(true);
      // Después de 800ms regresar a detalle proyecto
      setTimeout(() => navigate(`/proyecto/${idProyecto || id}`), 800);
    } catch (error) {
      console.error("Error al guardar riesgo:", error);
      setEstadoAlerta(true);
      setAlerta({ tipo: 'error', mensaje: 'Hubo un problema al guardar el riesgo' });
    }
  };

  return (
    <>
      <Helmet>
        <title>{riesgo ? 'Editar Riesgo' : 'Crear Riesgo'}</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <BtnRegresar />
          <Titulo>
            {riesgo ? `Editar Riesgo para el proyecto ${proyecto?.nombreProyecto || "..."}` : `Crear Riesgo para el proyecto ${proyecto?.nombreProyecto || "..."}`}
          </Titulo>
        </ContenedorHeader>
      </Header>

      <Formulario onSubmit={handleSubmit}>
        <TarjetaFormulario>
          <CampoFormulario>
            <Label>Nombre del Riesgo</Label>
            <InputTarea
              type="text"
              placeholder="Ej: Riesgo de retraso por proveedor"
              value={nombreRiesgo}
              onChange={(e) => setNombreRiesgo(e.target.value)}
            />
          </CampoFormulario>

          <CampoFormulario style={{ marginTop: '1rem' }}>
            <Label>Descripción</Label>
            <InputTarea
              type="text"
              placeholder="Describe el riesgo potencial"
              value={descripcionRiesgo}
              onChange={(e) => setDescripcionRiesgo(e.target.value)}
            />
          </CampoFormulario>

          <GridFormulario style={{ marginTop: '1.5rem' }}>
            <CampoFormulario>
              <Label>Fecha de Identificación</Label>
              <DatePicker fecha={fechaCreado} cambiarFecha={setfechaCreado} />
            </CampoFormulario>

            <SelectNivelImpacto
              valor={nivelImpacto}
              cambiarValor={setNivelImpacto}
            />

            <SelectProbabilidad
              valor={probabilidad}
              cambiarValor={setProbabilidad}
            />

            <CampoFormulario>
              <Label>Estrategia de Mitigación</Label>
              <InputTarea
                type="text"
                placeholder="Ej: Contratar proveedor alterno"
                value={estrategia}
                onChange={(e) => setEstrategia(e.target.value)}
              />
            </CampoFormulario>
          </GridFormulario>

          <ContenedorBotones>
            <BotonCancelar type="button" onClick={() => navigate(-1)}>
              Cancelar
            </BotonCancelar>
            <BotonCrear type="submit">
              {riesgo ? 'Editar Riesgo' : 'Agregar Riesgo'}
              <IconoPlus style={{ marginLeft: '0.5rem' }} />
            </BotonCrear>
          </ContenedorBotones>

          {estadoAlerta && <Alerta tipo={alerta.tipo}>{alerta.mensaje}</Alerta>}
        </TarjetaFormulario>
      </Formulario>
    </>
  );
};

export default FormularioRiesgo;
