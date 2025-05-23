import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom"; // Asegúrate de importar Link
import theme from "../theme";

// Animación para el header al cargarse (slide down + fade in)
const slideDown = keyframes`
  from {
    transform: translateY(-20%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Contenedor general del header con sombra estática
const Header = styled.header`
    width: 100%;
    padding: 0.5rem 1rem;
    background-color: ${(props) => props.$bgColor || "#fff"};
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* Sombra estática */
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2);
    border-bottom: 5px solid ${theme.grisClaro};
    border-bottom-left-radius: 16px;  /* Curvas en la parte inferior */
    border-bottom-right-radius: 16px; /* Curvas en la parte inferior */
    animation: ${slideDown} 0.5s ease-out;
    transition: box-shadow 0.3s ease, transform 0.3s ease;

    @media (max-width: 60rem) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
`;

// Contenedor para el logo
const ContenedorLogo = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem; /* Espaciado entre el logo y el título */
`;

// Logo con funcionalidad de redirección
const LogoLink = styled(Link)`
    display: block;
    cursor: pointer;
    text-decoration: none;
`;

// Título principal
const Titulo = styled.h1`
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1.5rem;
    color: ${theme.azul};

    @media (max-width: 60rem) {
        font-size: 1.5rem;
    }
`;

// Contenedor que envuelve el header (título + botones u otros)
const ContenedorHeader = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 60rem) {
        flex-direction: column-reverse;
        align-items: flex-start;
        gap: 1rem;
    }
`;

// Botones o elementos a la derecha del header
const ContenedorBotones = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;

    @media (max-width: 60rem) {
        align-self: flex-end;
    }
`;

// Estilo para la imagen del logo con animación de levantarse al hacer hover
const LogoImg = styled.img`
    width: 3rem;
    max-height: 3.25rem;
    display: block;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

export { Header, Titulo, ContenedorHeader, ContenedorBotones, ContenedorLogo, LogoLink, LogoImg };
