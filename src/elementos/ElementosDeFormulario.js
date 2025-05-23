import styled from "styled-components";
import theme from "./../theme"; // Asegúrate de que el tema esté correctamente importado
import { Link } from "react-router-dom";
// Contenedor para filtros
const ContenedorFiltros = styled.div`
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 1.87rem; /* 30px */

    @media(max-width: 60rem){ /* 950px */
        flex-direction: column;

        & > * {
            width: 100%;
            margin-bottom: 0.62rem; /* 10px */
        }
    }
`;

// Contenedor para columnas
const ContenedorColumnas = styled.div`
    display: flex;
    flex-direction: column; /* Asegura que los elementos estén en columna */
    align-items: flex-start; /* Alinea los elementos a la izquierda */
    margin-bottom: 1.87rem; /* 30px */

    & > * {
        width: 100%;
        margin-bottom: 0.62rem; /* 10px */
        font-weight: bold; /* Texto en negrita */
    }
`;

// Estilo para formulario
const Formulario = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    input {
        width: 100%;
        text-align: center;
        padding: 1 rem 0;
        font-family: 'Work Sans', sans-serif;

        &::placeholder {
            color: rgba(0,0,0,.2);
        }
    }

    @media(max-width: 60rem){ /* 950px */
        justify-content: start;
    }
`;

// Estilo para Input
const Input = styled.input`
    font-size: 1.5rem; /* 40px */
    border: none;
    border-bottom: 2px solid ${theme.grisClaro};
    outline: none;

    @media(max-width: 60rem){ /* 950px */
        font-size: 2.2rem; /* 24px */
    }
`;

// Input con tamaño grande
const InputGrande = styled(Input)`
    font-size: 4.37rem; /* 70px */
    font-weight: bold;
`;

// Contenedor para el botón
const ContenedorBoton = styled.div`
    display: flex;
    justify-content: center;
    margin: 1.5rem 0;  /* 40px */
`;

// Fondo centrado en la pantalla
const FondoCentrado = styled.div`
    min-height: 100vh;
    background-color: #f4f6f8;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.25rem;
`;

// Tarjeta con fondo blanco
const TarjetaContenedor = styled.div`
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    width: 100%;
    max-width: 420px;
    margin: 1rem;
`;

// Logo de la aplicación
const LogoImg = styled.img`
    width: 8rem;
    max-height: 6.25rem;
    margin: 0 auto 1rem;
    display: block;
`;

// Título de sección
const TituloSeccion = styled.h2`
    font-size: 1.75rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
    text-align: center;
`;

// Input estilizado
const InputEstilizado = styled(Input)`
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 0.5rem 0.5rem;
    font-size: 1rem;
    margin-bottom: 0.25rem;
    width: 5rem;

    &:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    }
`;

// Botón primario
const BotonPrimario = styled(Link)`
    background: ${(props) => props.$primario ? '#2563eb' : '#00A9FF'};
    width: ${(props) => props.$conIcono ? '15.62rem' : 'auto'};
    border: none;
    border-radius: 0.625rem;
    color: #fff;
    font-family: 'Work Sans', sans-serif;
    height: 2.25rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    align-items: center;
    outline: none;
    transition: background-color 0.3s ease;
    margin-top: 0.5rem;
    &:hover {
        background-color: ${(props) => props.$primario ? '#1e40af' : '#1e40af'};
    }

    svg {
        height: ${(props) => props.$iconoGrande ? '2rem' : '0.75rem'};
        width: auto;
        fill: white;
    }
`;

// Texto centrado, para enlaces
const TextoCentrado = styled.div`
    margin-top: 1.5rem;
    text-align: center;

    a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 500;

        &:hover {
            text-decoration: underline;
        }
    }
`;

const ContenedorBotones = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin: 2rem 0;

    a {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 1.5rem;
        width: 100%;
        max-width: 18rem;
    }

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;

        a {
            width: 14rem;
        }
    }
`;

const ContenedorInputsDosColumnas = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
`;

export {
    ContenedorColumnas,
    ContenedorFiltros,
    Formulario,
    Input,
    InputGrande,
    ContenedorBoton,
    FondoCentrado,
    TarjetaContenedor,
    LogoImg,
    TituloSeccion,
    InputEstilizado,
    BotonPrimario,
    TextoCentrado,
    ContenedorBotones,
    ContenedorInputsDosColumnas
};
