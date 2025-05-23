import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import theme from "./../theme";

const ContenedorSelect = styled.div`
  background: ${theme.grisClaro};
  cursor: pointer;
  border-radius: 0.625rem;
  position: relative;
  height: 2.5rem; /* Ajustado el alto */
  width: 100%;
  padding: 0 1.25rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center; /* Centrado del contenido */
  text-align: center; /* Asegura que el texto dentro se centre */
  transition: 0.3s ease all;

  &:hover {
    background: ${theme.grisClaro2};
  }
`;

const OpcionSeleccionada = styled.div`
  width: 15.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.0rem;
  font-weight: normal; /* Asegura que el texto seleccionado no esté en negrita */
    
  svg {
    width: 1.25rem;
    height: auto;
    margin-left: 1.25rem;
  }
`;

const Opciones = styled.div`
  background: ${theme.grisClaro};
  position: absolute;
  bottom: 100%; /* Cambiado a bottom para mostrar hacia arriba */
  left: 0;
  width: 100%;
  border-radius: 0.625rem;
  max-height: 18.75rem;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Opcion = styled.div`
  padding: 1rem; /* Ajustado el padding */
  font-size: 1.0rem; /* Tamaño de fuente reducido */
  font-weight: normal; /* Eliminada la negrita */
  display: flex;
  align-items: center;
  transition: background 0.3s ease;

  &:hover {
    background: ${theme.grisClaro2};
  }
`;

const SelectEstado = ({ estado, cambiarEstado }) => {
  const [mostrarSelect, cambiarMostrarSelect] = useState(false);
  const refSelect = useRef(null);

  const estados = [
    { id: "Pendiente", texto: "Pendiente" },
    { id: "En desarrollo", texto: "En desarrollo" },
    { id: "Completado", texto: "Completado" },
    { id: "Quebrado", texto: "Quebrado" },
  ];

  const handleClick = (e) => {
    cambiarEstado(e.currentTarget.dataset.valor);
    cambiarMostrarSelect(false); // Cierra el menú después de seleccionar
  };

  // Cierra el menú si el usuario hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refSelect.current && !refSelect.current.contains(event.target)) {
        cambiarMostrarSelect(false);
      }
    };

    if (mostrarSelect) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mostrarSelect]);

  return (
    <ContenedorSelect ref={refSelect} onClick={() => cambiarMostrarSelect(!mostrarSelect)}>
      <OpcionSeleccionada>
        {estado}
      </OpcionSeleccionada>
      {mostrarSelect && (
        <Opciones>
          {estados.map((opcion) => (
            <Opcion key={opcion.id} data-valor={opcion.id} onClick={handleClick}>
              {opcion.texto}
            </Opcion>
          ))}
        </Opciones>
      )}
    </ContenedorSelect>
  );
};

export default SelectEstado;
