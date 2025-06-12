import React from 'react';
import styled from "styled-components";
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import historial_proyectos from './../imagenes/historial_proyectos.png';
import proyecto_nuevo     from './../imagenes/proyecto_nuevo.png';
import logo               from './../imagenes/logo-celeste.png';
import grupo              from './../imagenes/grupo.png';
import perfil             from './../imagenes/perfil.png';

import {
  Header,
  ContenedorLogo,
  LogoImg,
  ContenedorBotones as BaseContenedorBotones
} from './../elementos/Header';
import BotonCerrarSesion from './../elementos/BotonCerrarSesion';
import { auth } from '../firebase/firebaseConfig';

// Elevamos el ContenedorBotones e forzamos alineación centrada
const ContenedorBotones = styled(BaseContenedorBotones)`
  /* siempre centrar verticalmente dentro del header */
  align-self: center !important;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 1rem;
`;
const IconLabel = styled.span`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #555;
`;

const Titulo = styled.h1`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 3.5rem;
  text-align: center;
  color: #00A9FF;
  margin-bottom: 1rem;

  @media(max-width: 950px) {
    font-size: 2.5rem;
  }
  @media(max-width: 600px){
    font-size: 2rem;
  }
`;

const Descripcion = styled.p`
  font-size: 1rem;
  color: #777;
  text-align: center;
  max-width: 400px;
  margin-bottom: 1.5rem;

  @media(max-width: 600px){
    font-size: 0.9rem;
    padding: 0 1rem;
  }
`;

const Contenedor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  background-color: #fff;
  min-height: calc(100vh - 4rem);
`;

const BotonesContainer = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  max-width: 600px;
  justify-content: center;
  margin: 20px 0;  
  align-items: center;
  @media(max-width: 48rem){
    flex-direction: column;
    gap: 10px;
  }
`;

const BotonContenido = styled(Link)`
  background: #00A9FF;
  width: 20rem;
  margin-left: 1.25rem;
  border-radius: 0.625rem;
  color: #fff;
  font-family: 'Work Sans', sans-serif;
  height: 11.75rem;
  padding: 1.25rem 1.87rem;
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  text-align: center;

  @media(max-width: 48rem){
    width: 90%;
    margin-left: 0;
    height: auto;
    padding: 1rem;
  }
`;

const TextoBoton = styled.span`
  color: #fff;
`;

const LogoImgIcon = styled.img`
  width: 5rem;
  max-height: 5.25rem;
  margin-bottom: 0.5rem;

  @media(max-width: 48rem){
    width: 4rem;
  }
`;

const Inicio = () => {
  const userId = auth.currentUser?.uid;

  return (
    <>
      <Helmet>
        <title>Inicio - Bienvenido</title>
      </Helmet>

      <Header>
        <ContenedorLogo>
          <Link to="/">
            <LogoImg src={logo} alt="Logo" />
          </Link>
        </ContenedorLogo>

        {userId && (
          <>
            <IconWrapper>
              <Link to="/grupos">
                <LogoImg src={grupo} alt="Grupos" />
              </Link>
              <IconLabel>Grupos</IconLabel>
            </IconWrapper>
            <IconWrapper>
              <Link to={`/usuario/${userId}`}>
                <LogoImg src={perfil} alt="Perfil" />
              </Link>
              <IconLabel>Perfil</IconLabel>
            </IconWrapper>
          </>
        )}

        <ContenedorBotones>
          <BotonCerrarSesion />
        </ContenedorBotones>
      </Header>

      <Contenedor>
        <Titulo>Bienvenido</Titulo>
        <Descripcion>¿En qué puedo ayudarte?</Descripcion>

        <BotonesContainer>
          <BotonContenido to="/formulario">
            <LogoImgIcon src={proyecto_nuevo} alt="Nuevo proyecto" />
            <TextoBoton>Tengo un nuevo proyecto</TextoBoton>
          </BotonContenido>
          <BotonContenido to="/lista">
            <LogoImgIcon src={historial_proyectos} alt="Historial de proyectos" />
            <TextoBoton>Lista de Proyectos</TextoBoton>
          </BotonContenido>
        </BotonesContainer>

        <Descripcion>
          Te ayudamos a elegir una metodología adaptada a las necesidades de tu proyecto.
        </Descripcion>
      </Contenedor>
    </>
  );
};

export default Inicio;
