import React, { useState } from "react";
import useObtenerRiesgos from "./../hooks/useObtenerRiesgos";
import {
  Lista,
  ElementoLista,
  Fecha,
  Descripcion,
  ContenedorBotones,
  BotonAccion,
  BotonCargarMas,
  ContenedorBotonCentral,
  ContenedorSubtitulo,
  Subtitulo,
  ContenedorProyectosPorFecha as ContenedorRiesgosPorFecha
} from "./../elementos/ElementosDeLista";
import { format, fromUnixTime } from "date-fns";
import { es } from "date-fns/locale";
import { ReactComponent as IconoEditar } from "./../imagenes/editar.svg";
import { ReactComponent as IconoVer } from "./../imagenes/view.svg";
import { ReactComponent as IconoBorrar } from "./../imagenes/borrar.svg";
import styled from "styled-components";
import borrarRiesgo from "./../firebase/borrarRiesgo";
import { Link } from "react-router-dom";

// === Estilos adicionales ===
const VentanaConfirmacion = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ContenedorConfirmacion = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  width: 90%;
  max-width: 400px;
`;

const BotonConfirmar = styled.button`
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  margin: 1rem;
  cursor: pointer;
  font-weight: bold;
`;

const BotonCancelar = styled.button`
  background-color: #bdbdbd;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  margin: 1rem;
  cursor: pointer;
  font-weight: bold;
`;

const VentanaDetalle = styled(VentanaConfirmacion)``;

const ContenedorDetalle = styled(ContenedorConfirmacion)`
  text-align: left;
  padding: 2rem;
  line-height: 1.6;
  background: #f9f9f9;
  h2 {
    margin-bottom: 1rem;
    color: #333;
  }
  strong {
    display: block;
    margin-top: 1rem;
    color: #555;
  }
`;

const Resaltado = styled.span`
  background-color: ${({ nivel }) => {
    switch (nivel) {
      case "Alto":
      case "Alta":
        return "#f44336";
      case "Medio":
      case "Media":
        return "#FFA832";
      case "Bajo":
      case "Baja":
        return "#eeca06";
      default:
        return "transparent";
    }
  }};
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
  font-weight: bold;
`;

const ListaDeRiesgos = ({ id }) => {
  const [riesgos, setRiesgos, obtenerMasRiesgos, hayMasPorCargar] = useObtenerRiesgos(id);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [riesgoAEliminar, setRiesgoAEliminar] = useState(null);
  const [riesgoSeleccionado, setRiesgoSeleccionado] = useState(null);

  const formatearFecha = (fecha) =>
    format(fromUnixTime(fecha), "dd 'de' MMMM 'de' yyyy", { locale: es });

  const riesgosAgrupados = riesgos.reduce((acc, riesgo) => {
    const fechaFormateada = formatearFecha(riesgo.fechaCreado);
    if (!acc[fechaFormateada]) acc[fechaFormateada] = [];
    acc[fechaFormateada].push(riesgo);
    return acc;
  }, {});

  const fechasOrdenadas = Object.keys(riesgosAgrupados).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const confirmarEliminacion = (riesgo) => {
    setRiesgoAEliminar(riesgo);
    setMostrarConfirmacion(true);
  };

  const cancelarEliminacion = () => {
    setRiesgoAEliminar(null);
    setMostrarConfirmacion(false);
  };

  const eliminarRiesgo = async () => {
    try {
      await borrarRiesgo(id, riesgoAEliminar.id);
      setRiesgos((prev) => prev.filter((r) => r.id !== riesgoAEliminar.id));
      setMostrarConfirmacion(false);
      setRiesgoAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar riesgo:", error);
    }
  };

  return (
    <>
      <Lista>
        {fechasOrdenadas.map((fecha) => (
          <div key={fecha}>
            <Fecha>{fecha}</Fecha>
            <ContenedorRiesgosPorFecha>
              {riesgosAgrupados[fecha].map((riesgo) => (
                <ElementoLista key={riesgo.id}>
                  <Descripcion><strong>{riesgo.nombreRiesgo}</strong></Descripcion>
                  <Descripcion>Fecha creado: {formatearFecha(riesgo.fechaCreado)}</Descripcion>
                  <Descripcion>
                    Probabilidad: <Resaltado nivel={riesgo.probabilidad}>{riesgo.probabilidad}</Resaltado>
                  </Descripcion>
                  <Descripcion>
                    Impacto: <Resaltado nivel={riesgo.impacto}>{riesgo.impacto}</Resaltado>
                  </Descripcion>
                  <ContenedorBotones>
                    <BotonAccion title="Eliminar riesgo" onClick={() => confirmarEliminacion(riesgo)}>
                      <IconoBorrar />
                    </BotonAccion>
                    <BotonAccion as={Link} to={`/editarRiesgo/${id}/${riesgo.id}`} title="Editar riesgo">
                      <IconoEditar />
                    </BotonAccion>
                    <BotonAccion title="Ver riesgo" onClick={() => setRiesgoSeleccionado(riesgo)}>
                      <IconoVer />
                    </BotonAccion>
                  </ContenedorBotones>
                </ElementoLista>
              ))}
            </ContenedorRiesgosPorFecha>
          </div>
        ))}

        {riesgos.length === 0 && (
          <ContenedorSubtitulo>
            <Subtitulo>No hay riesgos registrados</Subtitulo>
          </ContenedorSubtitulo>
        )}

        {hayMasPorCargar && (
          <ContenedorBotonCentral>
            <BotonCargarMas onClick={obtenerMasRiesgos}>Cargar Más</BotonCargarMas>
          </ContenedorBotonCentral>
        )}
      </Lista>

      {mostrarConfirmacion && (
        <VentanaConfirmacion>
          <ContenedorConfirmacion>
            <p>¿Estás seguro de que deseas eliminar el riesgo <strong>{riesgoAEliminar?.nombreRiesgo}</strong>?</p>
            <BotonConfirmar onClick={eliminarRiesgo}>Eliminar</BotonConfirmar>
            <BotonCancelar onClick={cancelarEliminacion}>Cancelar</BotonCancelar>
          </ContenedorConfirmacion>
        </VentanaConfirmacion>
      )}

      {riesgoSeleccionado && (
        <VentanaDetalle onClick={() => setRiesgoSeleccionado(null)}>
          <ContenedorDetalle onClick={(e) => e.stopPropagation()}>
            <h2>{riesgoSeleccionado.nombreRiesgo}</h2>
            <strong>Descripción:</strong>
            <p>{riesgoSeleccionado.descripcionRiesgo}</p>

            <strong>Fecha creado:</strong>
            <p>{formatearFecha(riesgoSeleccionado.fechaCreado)}</p>

            <strong>Probabilidad:</strong>
            <p><Resaltado nivel={riesgoSeleccionado.probabilidad}>{riesgoSeleccionado.probabilidad}</Resaltado></p>

            <strong>Impacto:</strong>
            <p><Resaltado nivel={riesgoSeleccionado.impacto}>{riesgoSeleccionado.impacto}</Resaltado></p>
          </ContenedorDetalle>
        </VentanaDetalle>
      )}
    </>
  );
};

export default ListaDeRiesgos;
