import React from 'react';
import styled from "styled-components";
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import historial_proyectos from './../imagenes/historial_proyectos.png';
import proyecto_nuevo from './../imagenes/proyecto_nuevo.png';
import logo from './../imagenes/logo-celeste.png';
import grupo from './../imagenes/grupo.png';
import perfil from './../imagenes/perfil.png';

import { Header, ContenedorBotones, ContenedorLogo, LogoImg } from './../elementos/Header';
import BotonCerrarSesion from './../elementos/BotonCerrarSesion';
import { auth } from '../firebase/firebaseConfig'; // Importa la configuración de Firebase para acceder al UID del usuario autenticado

// Título principal
const Titulo = styled.h1`
    font-weight: bold;
    text-transform: uppercase;
    font-size: 3.5rem; /* 40px */
    text-align: center;
    color: #00A9FF;
    margin-bottom: 1rem;
    
    @media(max-width: 60rem){ /* 950px */
        font-size: 2rem; /* 32px */
    }
`;

// Contenedor para los botones de opciones
const BotonesContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 15px;
    width: 100%;
    max-width: 600px;
    justify-content: center;
    margin: 20px 0;
    
    @media(max-width: 48rem){ /* 768px */
        flex-direction: column;
        gap: 10px;
    }
`;

// Botón de opción
const BotonContenido = styled(Link)`
    background: #00A9FF;
    width: 20rem;
    margin-left: 1.25rem;
    border: none;
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
    gap: 0.75rem; /* Espacio entre imagen y texto */
    text-align: center;

    outline: none;

    @media(max-width: 48rem){
        width: 90%;
        margin-left: 0;
        height: auto;
        padding: 1rem;
    }
`;

// Texto que va dentro del botón
const TextoBoton = styled.span`
    color: #fff;
`;

// Descripción del contenido
const Descripcion = styled.p`
    font-size: 0.9rem;
    color: #777;
    max-width: 400px;
    margin-bottom: 1.5rem;
    
    @media(max-width: 48rem){
        font-size: 0.85rem;
        padding: 0 1rem;
    }
`;

// Contenedor del contenido principal (logo, título, botones, descripción)
const Contenedor = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    high: 100%;
    padding: 20px;
    background-color:rgb(255, 255, 255);
    
    @media (max-width: 60rem) {
        padding-top: 9rem; /* Más espacio si el header se apila en móvil */
    }
`;

// Componente para la imagen de opción (en botones)
const LogoImgIcon = styled.img`
    width: 5rem;
    max-height: 5.25rem;
    margin: 0 auto 0.5rem;
    display: block;
    
    @media(max-width: 48rem){
        width: 4rem;
    }
`;

const Inicio = () => {
    const userId = auth.currentUser?.uid; // Obtener el UID del usuario autenticado

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

                {/* Contenedor de perfil y grupo alineado a la derecha */}
                {userId && (
                    <>
                        <ContenedorLogo style={{ marginLeft: '1rem' }}>
                            <Link to="/grupos">
                                <LogoImg src={grupo} alt="Equipos" />
                            </Link>
                        </ContenedorLogo>
                        <ContenedorLogo style={{ marginLeft: '1rem' }}>
                            <Link to={`/usuario/${userId}`}>
                                <LogoImg src={perfil} alt="Perfil" />
                            </Link>
                        </ContenedorLogo>
                    </>
                )}

                <ContenedorBotones>
                    <BotonCerrarSesion /> {/* Botón para cerrar sesión */}
                </ContenedorBotones>
            </Header>

            {/* Contenido principal */}
            <Contenedor>
                <Titulo>Bienvenido</Titulo>
                <Descripcion>
                    ¿En qué puedo ayudarte?
                </Descripcion>
                <BotonesContainer>
                    <BotonContenido to="/formulario">
                        <LogoImgIcon src={proyecto_nuevo} alt="Nuevo proyecto" />
                        <TextoBoton>Tengo un nuevo proyecto</TextoBoton>
                    </BotonContenido>
                    <BotonContenido to="/lista">
                        <LogoImgIcon src={historial_proyectos} alt="Historial de proyectos"/>
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
