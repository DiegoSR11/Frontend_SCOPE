import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./../firebase/firebaseConfig";
import useObtenerTareas from "./../hooks/useObtenerTareas";
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
  ContenedorProyectosPorFecha as ContenedorTareasPorFecha
} from "./../elementos/ElementosDeLista";
import { format, fromUnixTime } from "date-fns";
import { es } from "date-fns/locale";
import { ReactComponent as IconoEditar } from "./../imagenes/editar.svg";
import { ReactComponent as IconoVer } from "./../imagenes/view.svg";
import { ReactComponent as IconoBorrar } from "./../imagenes/borrar.svg";
import styled from "styled-components";
import borrarTarea from "./../firebase/borrarTarea";
import { Link } from "react-router-dom";

// === Estilos adicionales ===
const Responsable = styled.div`
  background-color: #e1f5fe;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: bold;
  font-size: 0.95rem;
  margin-top: 0.3rem;
  display: inline-block;
  margin-right: 0.5rem;
`;

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

const SeccionDetalle = styled.div`
  margin-bottom: 1rem;
`;

const Etiqueta = styled.div`
  font-weight: bold;
  color: #37474f;
  margin-bottom: 0.3rem;
`;

const Contenido = styled.div`
  color: #455a64;
  font-size: 0.95rem;
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
`;

const coloresEstado = {
  "Pendiente": "#FFA500",
  "En desarrollo": "#2196f3",
  "Completado": "#4caf50",
  "Quebrado": "#f44336"
};

const Estado = styled.span`
  font-weight: bold;
  background-color: ${({ color }) => color || "transparent"};
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  display: inline-block;
  min-width: 90px;
  text-align: center;
`;

const ListaDeTareas = ({ id }) => {
  // Hooks y estados
  const [tareas, setTareas, obtenerMasTareas, hayMasPorCargar] = useObtenerTareas(id);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [tareaAEliminar, setTareaAEliminar] = useState(null);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [mapaUsuarios, setMapaUsuarios] = useState({});

  useEffect(() => {
    const obtenerResponsables = async () => {
      const uids = new Set();
      tareas.forEach(t => Array.isArray(t.responsables) && t.responsables.forEach(r => uids.add(r)));

      const usuariosObtenidos = {};
      await Promise.all(
        Array.from(uids).map(async uid => {
          try {
            const userSnap = await getDoc(doc(db, "usuarios", uid));
            if (userSnap.exists()) {
              const { nombre, apellido } = userSnap.data();
              usuariosObtenidos[uid] = `${nombre} ${apellido}`;
            }
          } catch (error) {
            console.error("Error al obtener usuario:", error);
          }
        })
      );
      setMapaUsuarios(usuariosObtenidos);
    };

    if (tareas.length) obtenerResponsables();
  }, [tareas]);

  const formatearFecha = fecha =>
    format(fromUnixTime(fecha), "dd 'de' MMMM 'de' yyyy", { locale: es });

  const tareasAgrupadas = tareas.reduce((acc, t) => {
    const fecha = formatearFecha(t.fechaCreado);
    acc[fecha] = acc[fecha] || [];
    acc[fecha].push(t);
    return acc;
  }, {});

  const fechasOrdenadas = Object.keys(tareasAgrupadas).sort((a, b) => new Date(b) - new Date(a));

  // Confirmación eliminación
  const confirmarEliminacion = tarea => {
    setTareaAEliminar(tarea);
    setMostrarConfirmacion(true);
  };
  const cancelarEliminacion = () => {
    setTareaAEliminar(null);
    setMostrarConfirmacion(false);
  };
  const eliminarTarea = async () => {
    try {
      await borrarTarea(id, tareaAEliminar.id);
      setTareas(prev => prev.filter(t => t.id !== tareaAEliminar.id));
      cancelarEliminacion();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  return (
    <>

      {/* Listado */}
      <Lista>
        {fechasOrdenadas.map(fecha => (
          <div key={fecha}>
            <Fecha>{fecha}</Fecha>
            <ContenedorTareasPorFecha>
              {tareasAgrupadas[fecha].map(tarea => (
                <ElementoLista key={tarea.id}>
                  <Descripcion>
                    <strong>{tarea.nombreTarea}</strong>
                  </Descripcion>
                  <Descripcion>Fin: {formatearFecha(tarea.fechaVencimiento)}</Descripcion>
                  <Descripcion>
                    Estado: <Estado color={coloresEstado[tarea.estadoTarea]}>{tarea.estadoTarea}</Estado>
                  </Descripcion>
                  <Descripcion>
                    Responsables:{" "}
                    {Array.isArray(tarea.responsables) && tarea.responsables.length > 0 ? (
                      tarea.responsables.map((uid, i) => (
                        <Responsable key={i}>{mapaUsuarios[uid] || "Cargando..."}</Responsable>
                      ))
                    ) : (
                      <em>No asignado</em>
                    )}
                  </Descripcion>
                  <ContenedorBotones>
                    <BotonAccion title="Eliminar tarea" onClick={() => confirmarEliminacion(tarea)}>
                      <IconoBorrar />
                    </BotonAccion>
                    <BotonAccion as={Link} to={`/editarTarea/${id}/${tarea.id}`} title="Editar tarea">
                      <IconoEditar />
                    </BotonAccion>
                    <BotonAccion title="Ver tarea" onClick={() => setTareaSeleccionada(tarea)}>
                      <IconoVer />
                    </BotonAccion>
                  </ContenedorBotones>
                </ElementoLista>
              ))}
            </ContenedorTareasPorFecha>
          </div>
        ))}

        {!tareas.length && (
          <ContenedorSubtitulo>
            <Subtitulo>No hay tareas registradas</Subtitulo>
          </ContenedorSubtitulo>
        )}

        {hayMasPorCargar && (
          <ContenedorBotonCentral>
            <BotonCargarMas onClick={obtenerMasTareas}>Cargar Más</BotonCargarMas>
          </ContenedorBotonCentral>
        )}
      </Lista>

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <VentanaConfirmacion>
          <ContenedorConfirmacion>
            <p>
              ¿Eliminar tarea <strong>{tareaAEliminar?.nombreTarea}</strong>?
            </p>
            <BotonConfirmar onClick={eliminarTarea}>Eliminar</BotonConfirmar>
            <BotonCancelar onClick={cancelarEliminacion}>Cancelar</BotonCancelar>
          </ContenedorConfirmacion>
        </VentanaConfirmacion>
      )}

      {/* Modal de detalles */}
      {tareaSeleccionada && (
        <VentanaDetalle onClick={() => setTareaSeleccionada(null)}>
          <ContenedorDetalle onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: "1rem", color: "#2c3e50" }}>
              {tareaSeleccionada.nombreTarea}
            </h2>
            <SeccionDetalle>
              <Etiqueta>Descripción:</Etiqueta>
              <Contenido>{tareaSeleccionada.descripcionTarea || "No proporcionada"}</Contenido>
            </SeccionDetalle>
            <SeccionDetalle>
              <Etiqueta>Estado:</Etiqueta>
              <Estado color={coloresEstado[tareaSeleccionada.estadoTarea]}>
                {tareaSeleccionada.estadoTarea}
              </Estado>
            </SeccionDetalle>
            <SeccionDetalle>
              <Etiqueta>Fecha de Vencimiento:</Etiqueta>
              <Contenido>{formatearFecha(tareaSeleccionada.fechaVencimiento)}</Contenido>
            </SeccionDetalle>
            <SeccionDetalle>
              <Etiqueta>Responsables:</Etiqueta>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                {Array.isArray(tareaSeleccionada.responsables) &&
                tareaSeleccionada.responsables.length > 0 ? (
                  tareaSeleccionada.responsables.map((uid, i) => (
                    <Responsable key={i}>{mapaUsuarios[uid] || "Cargando..."}</Responsable>
                  ))
                ) : (
                  <Contenido>
                    <em>No asignado</em>
                  </Contenido>
                )}
              </div>
            </SeccionDetalle>
          </ContenedorDetalle>
        </VentanaDetalle>
      )}
    </>
  );
};

export default ListaDeTareas;
