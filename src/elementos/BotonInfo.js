// elementos/BotonInfo.js
import React from "react";
import styled from "styled-components";

const Contenedor = styled.div`
  position: relative;
  display: inline-block;
`;

const Icono = styled.div`
  background-color: #facc15;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  padding: 0;
  font-size: 20px;
  line-height: 26px;
  margin-left: 0.5rem;
  transition: background 0.3s;
  font-family: 'Merriweather', serif;
  user-select: none;

  /* Evita que sea clickeable */
  pointer-events: none;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 35px;
  left: 0;
  background-color: #1f2937;
  color: #fff;
  padding: 0.5rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  max-width: 300px;  /* Aumentado de 220px a 300px */
  white-space: normal;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s;

  ${Contenedor}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;  

const BotonInfo = ({ mensaje }) => {
  return (
    <Contenedor>
      <Icono>i</Icono>
      <Tooltip>{mensaje}</Tooltip>
    </Contenedor>
  );
};

export default BotonInfo;
