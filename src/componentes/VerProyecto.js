// src/componentes/VerProyecto.js

import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import { Header, Titulo } from "./../elementos/Header";
import BtnRegresar from "./../elementos/BtnRegresar";
import Cargando from "./../elementos/Cargando";
import { ContenedorBoton } from "./../elementos/ElementosDeFormulario";
import Boton from "./../elementos/Boton";

import DetallesProyecto from "../componentes/DetallesProyecto";
import ListaDeTareas    from "../componentes/ListaDeTareas";
import ListaDeRiesgos   from "../componentes/ListaDeRiesgos";
import ChatBotIA        from "../componentes/ChatBotProyecto";
import Metodologias     from "../componentes/Metodologias";

import useObtenerProyecto from "../hooks/useObtenerProyecto";
import useObtenerTareas    from "../hooks/useObtenerTareas";
import useObtenerRiesgos   from "../hooks/useObtenerRiesgos";
import { useAuth }         from "../contextos/AuthContext";

import logo from '../imagenes/logo-celeste.png';

const ContenedorCentral = styled.div`
  width: 100%;
  padding: 1.5rem 1rem;
  box-sizing: border-box;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.1rem 0;
  width: 100%;
  flex-wrap: nowrap;
`;

const Tab = styled.button`
  flex: 1 1 25%;
  padding: 0.75rem 1rem;
  background: ${({ $activo }) => ($activo ? "#00A9FF" : "#ccc")};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  &:hover { background: ${({ $activo }) => ($activo ? "#00A9FF" : "#aaa")}; }
  @media (max-width: 600px) { flex: 1 1 100%; }
`;

const MensajeError = styled.div`
  background: #fff8e1;
  border: 1px solid #ff9800;
  color: #ff9800;
  padding: 2rem;
  margin: 2rem auto;
  text-align: center;
  border-radius: 1rem;
  font-size: 1.2rem;
  max-width: 500px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoConTexto = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  margin: 0 1.7rem 0 0;
`;

const LogoInicio = styled.img`
  width: 3rem;
  height: auto;
  transition: transform 0.3s ease;
  &:hover { transform: translateY(-5px); }
  @media (max-width: 600px) { width: 2.5rem; }
`;

const TextoDebajoLogo = styled.span`
  color: #222;
  font-size: 0.75rem;
  font-weight: 400;
  margin-top: 0.07rem;
  letter-spacing: 0.2px;
`;

export default function VerProyecto() {
  const { id }           = useParams();
  const [proyecto]       = useObtenerProyecto(id);
  const [tareas]         = useObtenerTareas(id);
  const [riesgos]        = useObtenerRiesgos(id);
  const { usuario }      = useAuth();
  const [pestaña, setPestaña] = useState("detalles");

  if (!proyecto) return <Cargando />;

  const puedeVer = usuario && proyecto.gestores?.includes(usuario.uid);
  if (!puedeVer) {
    return (
      <>
        <Helmet><title>Acceso Denegado</title></Helmet>
        <Header>
          <HeaderActions>
            <BtnRegresar />
            <LogoConTexto to="/inicio">
              <LogoInicio src={logo} alt="Inicio" />
              <TextoDebajoLogo>Inicio</TextoDebajoLogo>
            </LogoConTexto>
          </HeaderActions>
          <Titulo>Acceso Denegado</Titulo>
        </Header>
        <MensajeError>
          <strong>No tienes acceso a este proyecto.</strong><br />
          Contacta con el administrador si crees que es un error.<br />
          <Boton as={Link} to="/inicio" style={{ marginTop:16 }}>Ir a mis proyectos</Boton>
        </MensajeError>
      </>
    );
  }

  const esHibrido = proyecto.tipoProyecto === "hibrido";

  return (
    <>
      <Helmet><title>{proyecto.nombreProyecto}</title></Helmet>

      <Header>
        <HeaderActions>
          <BtnRegresar />
          <LogoConTexto to="/inicio">
            <LogoInicio src={logo} alt="Inicio" />
            <TextoDebajoLogo>Inicio</TextoDebajoLogo>
          </LogoConTexto>
        </HeaderActions>
        <Titulo>{proyecto.nombreProyecto}</Titulo>
        {pestaña === "detalles" && <Boton as={Link} to={`/editarProyecto/${id}`}>Editar Proyecto</Boton>}
        {pestaña === "tareas"    && <Boton as={Link} to={`/agregarTarea/${id}`}>+ Agregar Tarea</Boton>}
        {pestaña === "riesgos"   && <Boton as={Link} to={`/agregarRiesgo/${id}`}>+ Agregar Riesgo</Boton>}
      </Header>

      <ContenedorCentral>
        <Tabs>
          <Tab $activo={pestaña === "detalles"} onClick={()=>setPestaña("detalles")}>Detalles</Tab>
          {esHibrido && (
            <Tab $activo={pestaña === "metodologias"} onClick={()=>setPestaña("metodologias")}>Metodologías</Tab>
          )}
          <Tab $activo={pestaña === "tareas"}    onClick={()=>setPestaña("tareas")}>Tareas</Tab>
          <Tab $activo={pestaña === "riesgos"}   onClick={()=>setPestaña("riesgos")}>Riesgos</Tab>
        </Tabs>

        {pestaña === "detalles" && (
          <>
            <DetallesProyecto proyecto={proyecto} idProyecto={id} />
            <ChatBotIA proyecto={proyecto} tareas={tareas} riesgos={riesgos} vista="detalles" />
          </>
        )}

        {pestaña === "metodologias" && esHibrido && (
          <Metodologias proyectoId={id} />
        )}

        {pestaña === "tareas" && (
          <>
            <ListaDeTareas id={id} />
            <ContenedorBoton>
              <Boton as={Link} $primario $conIcono to={`/agregarTarea/${id}`}>+ Agregar Tarea</Boton>
            </ContenedorBoton>
            <ChatBotIA proyecto={proyecto} tareas={tareas} riesgos={riesgos} vista="tareas" />
          </>
        )}

        {pestaña === "riesgos" && (
          <>
            <ListaDeRiesgos id={id} />
            <ContenedorBoton>
              <Boton as={Link} $primario $conIcono to={`/agregarRiesgo/${id}`}>+ Agregar Riesgo</Boton>
            </ContenedorBoton>
            <ChatBotIA proyecto={proyecto} tareas={tareas} riesgos={riesgos} vista="riesgos" />
          </>
        )}
      </ContenedorCentral>
    </>
  );
}
