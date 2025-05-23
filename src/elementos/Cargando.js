import React from "react";
import styled, { keyframes } from "styled-components";

// Animación para el spinner
const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Contenedor para el loader
const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Ocupa todo el alto de la pantalla */
  flex-direction: column;
`;

// Spinner animado
const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${rotate} 1s linear infinite;
  margin-bottom: 15px;
`;

// Texto de carga
const LoadingText = styled.p`
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
`;

const Loader = () => (
  <LoaderContainer>
    <Spinner />
    <LoadingText>Cargando...</LoadingText>
  </LoaderContainer>
);

export default Loader;
