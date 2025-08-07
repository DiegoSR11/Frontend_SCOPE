import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { getUnixTime } from 'date-fns';
import { Formulario } from './../elementos/ElementosDeFormulario';
import agregarProyecto from '../firebase/agregarProyecto';
import { useAuth } from '../contextos/AuthContext';
import editarProyecto from './../firebase/editarProyecto';
import {
  SelectTamanioProyecto,
  SelectComplejoRiesgos,
  SelectPresenciaCliente,
  SelectIterativoProyecto,
  SelectTipoProyecto
} from './SelectPropiedades';
import BtnRegresar from "./../elementos/BtnRegresar";
import determinarMetodologia from './../funciones/determinarMetodologia';
import { Header, Titulo, ContenedorHeader } from './../elementos/Header';
import Alerta from "../elementos/Alerta";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BotonInfo from "./../elementos/BotonInfo";

const TarjetaFormulario = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.5);
  max-width: 900px;
  margin: 2rem auto;
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

const LabelBotonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
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

const InputProyecto = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 3px solid #ccc;
  border-radius: 0.625rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-family: 'Work Sans', sans-serif;
  background: ${({ disabled }) => (disabled ? "#f2f2f2" : "#fff")};
  color: ${({ disabled }) => (disabled ? "#888" : "#222")};
`;

const CampoProyecto = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
`;

const ContenedorBotonesAccion = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: stretch;
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  min-width: 185px;
  &:hover {
    background: #008FCC;
  }
  &:active {
    background: #007BB5;
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

const ContenedorIA = styled.div`
  background-color: #F0F8FF;
  border: 2px solid ${(props) => props.usarIA ? "#00A9FF" : "#ccc"};
  padding: 1rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  transition: border 0.3s ease;
  box-sizing: border-box;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 110px;
  height: 24px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 24px;
    transition: 0.4s;
  }
  span:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
  }
  input:checked + span {
    background-color: #00A9FF;
  }
  input:checked + span:before {
    transform: translateX(24px);
  }
`;

const SwitchIA = styled(ToggleSwitch)`
  transform: scale(1);
  input { transform: scale(1);}
  span { height: 28px; width: 54px; transition: background-color 0.4s; }
  span:before { height: 22px; width: 22px; transition: transform 0.4s; }
  input:checked + span { background-color: #00A9FF; }
  input:checked + span:before { transform: translateX(24px); }
  @media (max-width: 768px) {
    span { width: 48px; height: 26px; }
    span:before { width: 20px; height: 20px; }
  }
`;

const TextoIA = styled.div`
  font-size: 0.95rem;
  color: #333;
  strong { color: #007BB5; }
`;

// === COMPONENTE ===
const FormularioProyecto = ({ proyecto }) => {
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tamanioProyecto, setTamanioProyecto] = useState('');
  const [complejoRiesgos, setComplejoRiesgos] = useState('');
  const [presenciaCliente, setPresenciaCliente] = useState('');
  const [iterativoProyecto, setIterativoProyecto] = useState('');
  const [tipoProyecto, setTipoProyecto] = useState('');
  const [usarIA, setUsarIA] = useState(false);

  const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
  const [alerta, cambiarAlerta] = useState({});
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    if (proyecto) {
      setNombreProyecto(proyecto.nombreProyecto || '');
      setDescripcion(proyecto.descripcion || '');
      setTamanioProyecto(proyecto.tamanioProyecto || '');
      setComplejoRiesgos(proyecto.complejoRiesgos || '');
      setPresenciaCliente(proyecto.presenciaCliente || '');
      setIterativoProyecto(proyecto.iterativoProyecto || '');
      setTipoProyecto(proyecto.tipoProyecto || '');
    }
  }, [proyecto]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (enviando) return; // Previene doble submit
    setEnviando(true);
    cambiarEstadoAlerta(false);
    cambiarAlerta({});

    if (
      nombreProyecto.trim() === '' ||
      descripcion.trim() === '' ||
      tamanioProyecto === '' ||
      complejoRiesgos === '' ||
      presenciaCliente === '' ||
      iterativoProyecto === '' ||
      tipoProyecto === ''
    ) {
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'error',
        mensaje: 'Por favor completa todos los campos del formulario.',
      });
      setEnviando(false);
      return;
    }
    try {
      let metodologiaProyecto = '';

      if (usarIA) {
        metodologiaProyecto = await obtenerMetodologiaIA({
          nombreProyecto,
          descripcion,
          tamaño: tamanioProyecto,
          complejidad: complejoRiesgos,
          presenciaCliente
        });
      } else {
        metodologiaProyecto = determinarMetodologia({
          tamanio: tamanioProyecto,
          complejo: complejoRiesgos,
          cliente: presenciaCliente,
          iterativo: iterativoProyecto,
          tipo: tipoProyecto
        });
      }

      const datosProyectoNuevo = {
        nombreProyecto,
        descripcion,
        complejoRiesgos,
        presenciaCliente,
        iterativoProyecto,
        tamanioProyecto,
        tipoProyecto,
        metodologiaProyecto,
        uidUsuario: usuario.uid,
        nombreCreador: usuario?.nombre || "",
        gestores: proyecto?.gestores || [],
      };

      const datosProyecto = {
        id: proyecto?.id,
        nombreProyecto,
        descripcion,
        complejoRiesgos,
        presenciaCliente,
        iterativoProyecto,
        tamanioProyecto,
        tipoProyecto,
        metodologiaProyecto,
        gestores: proyecto?.gestores || [],
      };

      if (proyecto && proyecto.id) {
        await editarProyecto(datosProyecto);
        cambiarEstadoAlerta(true);
        cambiarAlerta({ tipo: 'exito', mensaje: 'Proyecto actualizado con éxito ✨' });
      } else {
        const fechaCreado = getUnixTime(new Date());
        await agregarProyecto({
          ...datosProyectoNuevo,
          fechaCreado
        });
        cambiarEstadoAlerta(true);
        cambiarAlerta({ tipo: 'exito', mensaje: 'Proyecto creado con éxito 🎉' });

        setNombreProyecto('');
        setDescripcion('');
        setTamanioProyecto('');
        setComplejoRiesgos('');
        setPresenciaCliente('');
        setIterativoProyecto('');
        setTipoProyecto('');
      }
      setTimeout(() => navigate('/lista'), 1500);
    } catch (error) {
      console.error(error);
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'error',
        mensaje: 'Hubo un problema al guardar el proyecto. Intenta nuevamente.'
      });
    }
    setEnviando(false);
  };

  
  const obtenerMetodologiaIA = async (datos) => {
    try {
      const prompt = `
        Eres un consultor senior en gestión de proyectos de TI con más de 15 años
        de experiencia aplicando metodologías de ciclo de vida y frameworks ágiles.

        INSTRUCCIONES ESTRICTAS  
        1. Analiza únicamente la información contenida en el objeto JSON proyecto.  
        2. Elige exactamente una de las siguientes opciones:  

          Waterfall
          Iterativo  
          Spiral  
          V-Model  
          Dynamic Systems Development Method
          Rational Unified Process
          Prototipado  
          Feature-Driven Development
          Six Sigma
          Scrum  
          Kanban  
          Extreme Programming
          Crystal  
          Lean Software Development  

        3. Selecciona la opción que mejor se ajuste a las características recibidas.  
        4. No combines opciones ni inventes variantes.  
        5. No expliques tu elección ni añadas texto adicional.  
        6. Devuelve solo el nombre exacto de la metodología o framework elegido, sin comillas.

        json
        {
          "proyecto": {
            "nombre":            "${datos.nombreProyecto || "No especificado"}",
            "descripcion":       "${datos.descripcion      || "No especificada"}",
            "tamaño":            "${datos.tamaño           || "No especificado"}",   
            "complejidad":       "${datos.complejidad      || "No especificada"}", 
            "presenciaCliente":  ${datos.presenciaCliente}                   
          }
        }
        `;
      const respuesta = await axios.post("https://backendscope-hkg5a4g8d7dsdwdh.canadacentral-01.azurewebsites.net/api/chat", {
        mensaje: prompt,
      });
      const metodologiaPropuesta = respuesta.data.respuesta?.content || "No se pudo obtener una metodología.";
      return metodologiaPropuesta;
    } catch (error) {
      console.error("Error al obtener la metodología mediante IA:", error);
      return "Error al obtener metodología IA.";
    }
  };

  return (
    <div>
      <Helmet>
        <title>{proyecto ? "Editar Proyecto" : "Crear Proyecto"}</title>
      </Helmet>

      <Header>
        <ContenedorHeader>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BtnRegresar />
            <Titulo>{proyecto ? "Editar Proyecto" : "Nuevo Proyecto"}</Titulo>
          </div>
        </ContenedorHeader>
      </Header>

      <Formulario onSubmit={handleSubmit}>
        <TarjetaFormulario>
          <ComentarioObligatorio>
            {/* Puedes poner aquí un ícono de advertencia si tienes alguno */}
            <span>Todos los campos son obligatorios.</span>
          </ComentarioObligatorio>

          <CampoProyecto>
            <Label htmlFor="nombreProyecto">Nombre del Proyecto</Label>
            <InputProyecto
              type="text"
              id="nombreProyecto"
              name="nombreProyecto"
              placeholder="Nombre del Proyecto"
              value={nombreProyecto}
              onChange={(e) => setNombreProyecto(e.target.value)}
            />
          </CampoProyecto>

          {/* Muestra campos solo si es edición */}
          {proyecto && (
            <CampoProyecto>
              <Label>UID del creador</Label>
              <InputProyecto
                type="text"
                value={proyecto.uidUsuario || usuario?.uid || "No disponible"}
                disabled
              />
            </CampoProyecto>
          )}

          <CampoProyecto>
            <LabelBotonContainer>
              <Label htmlFor="descripcion">Descripción del Proyecto</Label>
              <BotonInfo mensaje="Describe normas/compliance (ISO u otros), nivel de documentación inicial y de avance, disponibilidad de recursos y roles involucrados." />
            </LabelBotonContainer>
            <InputProyecto
              as="textarea"
              id="descripcion"
              name="descripcion"
              rows="4"
              placeholder="Describe normas/compliance (ISO u otros), nivel de documentación inicial y de avance, disponibilidad de recursos y roles involucrados."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={{ resize: "vertical", minHeight: "100px" }}
            />
          </CampoProyecto>

          <SelectsGrid>
            <SelectTamanioProyecto valor={tamanioProyecto} cambiarValor={setTamanioProyecto} />
            <SelectComplejoRiesgos valor={complejoRiesgos} cambiarValor={setComplejoRiesgos} />
            <SelectPresenciaCliente valor={presenciaCliente} cambiarValor={setPresenciaCliente} />
            <SelectIterativoProyecto valor={iterativoProyecto} cambiarValor={setIterativoProyecto} />
            <SelectTipoProyecto valor={tipoProyecto} cambiarValor={setTipoProyecto} />
            <ContenedorIA usarIA={usarIA}>
              <TextoIA>
                <strong>¿Usar Inteligencia Artificial?</strong><br />
                Deja que la IA elija automáticamente la metodología más adecuada en base a las características del proyecto.
              </TextoIA>
              <SwitchIA>
                <input type="checkbox" checked={usarIA} onChange={() => setUsarIA(!usarIA)} />
                <span />
              </SwitchIA>
            </ContenedorIA>
          </SelectsGrid>

          <ContenedorBotonesAccion>
            <BotonCancelar type="button" onClick={() => window.history.back()}>
              Cancelar
            </BotonCancelar>
            <BotonCrear type="submit" disabled={enviando}>
              {proyecto ? (enviando ? 'Actualizando...' : 'Actualizar Proyecto')
                : (enviando ? 'Creando...' : 'Crear Proyecto')}
            </BotonCrear>
          </ContenedorBotonesAccion>

          <Alerta
            tipo={alerta.tipo}
            mensaje={alerta.mensaje}
            estadoAlerta={estadoAlerta}
            cambiarEstadoAlerta={cambiarEstadoAlerta}
          />
        </TarjetaFormulario>
      </Formulario>
    </div>
  );
};

export default FormularioProyecto;
