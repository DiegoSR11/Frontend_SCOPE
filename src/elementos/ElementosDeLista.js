import styled from 'styled-components';
import theme from './../theme';

// Lista principal, solo contenedor de fechas
const Lista = styled.ul`
  list-style: none;
  padding: 0 2.5rem 2.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
`;

// Tarjeta individual de proyecto
const ElementoLista = styled.li`
  padding: 1rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #F2F2F2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  & > div {
    width: 100%;
    display: flex;
    align-items: center;
  }
`;

// Botones de acción (editar/borrar)
const ContenedorBotones = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const BotonAccion = styled.button`
  outline: none;
  background: ${theme.grisClaro};
  border: none;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  svg {
    width: 0.9rem;
    height: 0.9rem;
  }

  &:hover {
    background: ${theme.grisClaro2};
  }
`;

// Fecha destacada en cada grupo
const Fecha = styled.div`
  border-radius: 0.3rem;
  background: ${theme.azulClaro};
  text-align: center;
  color: #fff;
  padding: 0.62rem 3.12rem;
  display: inline-block;
  margin: 1.25rem auto 0.5rem auto;
  font-weight: 600;
`;

// Texto dentro de las tarjetas
const Descripcion = styled.p`
  font-size: 0.9rem;
  text-transform: capitalize;
`;

const Valor = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  text-align: right;
  color: ${theme.grisClaro};
`;

// Cuando no hay proyectos
const ContenedorSubtitulo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Subtitulo = styled.h3`
  color: ${theme.grisClaro2};
  font-weight: 400;
  font-size: 40px;
  padding: 1.5rem 0;
`;

const ContenedorBotonCentral = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem;
`;

const BotonCargarMas = styled.button`
  background: ${theme.grisClaro};
  border: none;
  border-radius: 7px;
  color: #000;
  font-family: 'Work Sans', sans-serif;
  padding: 1rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: .3s ease all;

  &:hover {
    background: ${theme.grisClaro2};
  }
`;

// Lista de proyectos por cada fecha (en filas horizontales)
const ContenedorProyectosPorFecha = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
`;

export {
  Lista,
  ElementoLista,
  ContenedorBotones,
  BotonAccion,
  Fecha,
  Descripcion,
  Valor,
  ContenedorSubtitulo,
  Subtitulo,
  ContenedorBotonCentral,
  BotonCargarMas,
  ContenedorProyectosPorFecha
};
