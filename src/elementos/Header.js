import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
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

// Contenedor general del header
const Header = styled.header`
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.$bgColor || "#fff"};
  display: flex;
  flex-wrap: wrap;                      /* permite que los hijos bajen si no caben */
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-bottom: 5px solid ${theme.grisClaro};
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  animation: ${slideDown} 0.5s ease-out;
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  @media (max-width: 60rem) {
    padding: 0.5rem;                   /* menos padding en móvil */
  }
`;

// Contenedor para el logo y título
const ContenedorLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

// Enlace del logo
const LogoLink = styled(Link)`
  display: block;
  cursor: pointer;
  text-decoration: none;
`;

// Imagen del logo
const LogoImg = styled.img`
  width: 3rem;
  height: auto;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 600px) {
    width: 2.5rem;
  }
`;

// Título principal
const Titulo = styled.h1`
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1.5rem;
  color: ${theme.azul};
  margin: 0;

  @media (max-width: 60rem) {
    font-size: 1.4rem;
  }
`;

// Wrapper para título + botones (si lo usas dentro del Header)
const ContenedorHeader = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

// Contenedor de botones (grupos, perfil, logout)
const ContenedorBotones = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 60rem) {
    /* Cuando no quepan, bajan al siguiente renglón pero a la derecha */
    align-self: flex-end;
  }
`;

export {
  Header,
  ContenedorLogo,
  LogoLink,
  LogoImg,
  Titulo,
  ContenedorHeader,
  ContenedorBotones,
};
