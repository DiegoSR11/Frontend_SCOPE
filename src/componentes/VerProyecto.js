import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Header, Titulo } from "./../elementos/Header";
import BtnRegresar from "./../elementos/BtnRegresar";
import styled from "styled-components";
import Cargando from "./../elementos/Cargando";
import { ContenedorBoton } from "./../elementos/ElementosDeFormulario";
import Boton from "./../elementos/Boton";
import ListaDeTareas from "../componentes/ListaDeTareas";
import ListaDeRiesgos from "../componentes/ListaDeRiesgos";
import ChatBotIA from "../componentes/ChatBotProyecto";
import DetallesProyecto from "../componentes/DetallesProyecto";
import useObtenerProyecto from "./../hooks/useObtenerProyecto";
import useObtenerTareas from "../hooks/useObtenerTareas";
import useObtenerRiesgos from "../hooks/useObtenerRiesgos";

const ContenedorCentral = styled.div`
  width: 100%;
  padding: 1.5rem 1rem;
  box-sizing: border-box;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.1rem 0 0.1rem;
  width: 100%;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  flex: 1 1 30%; /* Ocupa espacio equitativamente y se adapta en pantallas pequeñas */
  padding: 0.75rem 1rem;
  background: ${({ $activo }) => ($activo ? "#00A9FF" : "#ccc")};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;

  &:hover {
    background: ${({ $activo }) => ($activo ? "#00A9FF" : "#aaa")};
  }

  @media (max-width: 600px) {
    flex: 1 1 100%; /* En móviles, cada botón ocupa una fila */
  }
`;

const VerProyecto = () => {
  const { id } = useParams();
  const [proyecto] = useObtenerProyecto(id);
  const [tareas] = useObtenerTareas(id);
  const [riesgos] = useObtenerRiesgos(id);
  const [pestaña, setPestaña] = useState("detalles");

  if (!proyecto) return <Cargando />;

  return (
    <>
      <Helmet>
        <title>Detalles del Proyecto</title>
      </Helmet>

      <Header>
        <BtnRegresar />
        <Titulo>{proyecto.nombreProyecto}</Titulo>

        {pestaña === "detalles" && (
          <Boton as={Link} to={`/editarProyecto/${id}`}>
            Editar Proyecto
          </Boton>
        )}

        {pestaña === "tareas" && (
          <Boton as={Link} to={`/agregarTarea/${id}`}>
            + Agregar Tarea
          </Boton>
        )}

        {pestaña === "riesgos" && (
          <Boton as={Link} to={`/agregarRiesgo/${id}`}>
            + Agregar Riesgo
          </Boton>
        )}
      </Header>

      <ContenedorCentral>

        {/* Tabs */}
        <Tabs>
          <Tab $activo={pestaña === "detalles" ? "true" : undefined} onClick={() => setPestaña("detalles")}>
            Detalles
          </Tab>

          <Tab $activo={pestaña === "tareas" ? "true" : undefined} onClick={() => setPestaña("tareas")}>
            Tareas
          </Tab>

          <Tab $activo={pestaña === "riesgos" ? "true" : undefined} onClick={() => setPestaña("riesgos")}>
            Riesgos
          </Tab>
        </Tabs>

        {/* Contenido según pestaña */}
        {pestaña === "detalles" && (
          <>
            <DetallesProyecto proyecto={proyecto} idProyecto={id} />
            <ChatBotIA proyecto={proyecto} tareas={tareas} riesgos={riesgos} vista="detalles" />
          </>
        )}

        {pestaña === "tareas" && (
          <>
            <ListaDeTareas id={id} />
            <ContenedorBoton>
              <Boton as={Link} $primario $conIcono to={`/agregarTarea/${id}`}>
                + Agregar Tarea
              </Boton>
            </ContenedorBoton>
            <ChatBotIA proyecto={proyecto} tareas={tareas} riesgos={riesgos} vista="tareas" />
          </>
        )}

        {pestaña === "riesgos" && (
          <>
            <ListaDeRiesgos id={id} />
            <ContenedorBoton>
              <Boton as={Link} $primario $conIcono to={`/agregarRiesgo/${id}`}>
                + Agregar Riesgo
              </Boton>
            </ContenedorBoton>
            <ChatBotIA proyecto={proyecto} tareas={tareas} riesgos={riesgos} vista="riesgos" />
          </>
        )}

      </ContenedorCentral>
    </>
  );
};

export default VerProyecto;
