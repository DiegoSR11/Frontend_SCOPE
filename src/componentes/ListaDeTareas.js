// Archivo: ListaDeTareas.jsx
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
import DiagramaGantt from "./DiagramaGantt";

// Estilos atractivos para filtros y selects
const StyledSelect = styled.select`
  appearance: none;
  border: none;
  outline: none;
  background: #e3edf7;
  color: #222;
  border-radius: 999px;
  font-size: 1rem;
  padding: 0.6rem 1.6rem 0.6rem 0.9rem;
  font-weight: 600;
  margin-top: 0.25rem;
  box-shadow: 0 2px 10px 0 #e3edf780;
  transition: background 0.15s, box-shadow 0.15s;
  cursor: pointer;
  &:hover, &:focus {
    background: #cde7fd;
    box-shadow: 0 4px 18px 0 #a1c4fd80;
  }
`;

const StyledInput = styled.input`
  border: none;
  outline: none;
  background: #e3edf7;
  color: #222;
  border-radius: 999px;
  font-size: 1rem;
  padding: 0.6rem 1.2rem;
  font-weight: 500;
  margin-top: 0.25rem;
  box-shadow: 0 2px 10px 0 #e3edf780;
  transition: background 0.15s, box-shadow 0.15s;
  &:focus, &:hover {
    background: #cde7fd;
    box-shadow: 0 4px 18px 0 #a1c4fd80;
  }
`;

const FiltrosContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f7fafc;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px 0 #a1c4fd22;
  align-items: flex-end;
`;

const FiltroLabel = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: 600;
  color: #37474f;
  font-size: 0.95rem;
`;

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

const VentanaDetalle = styled(VentanaConfirmacion)``;
const ContenedorDetalle = styled(ContenedorConfirmacion)`
  text-align: left;
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

const IconoAdvertencia = styled.span`
  color: #f44336;
  font-size: 2.2rem;
  display: block;
  margin-bottom: 0.8rem;
`;

const BotonAccionEliminar = styled.button`
  background: #f44336;
  color: #fff;
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.7rem 2rem;
  border-radius: 999px;
  margin: 0 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s, transform 0.15s;
  box-shadow: 0 2px 8px #f4433644;
  &:hover, &:focus {
    background: #d32f2f;
    transform: scale(1.04);
  }
`;

const BotonAccionCancelar = styled.button`
  background: #f0f2f5;
  color: #37474f;
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.7rem 2rem;
  border-radius: 999px;
  margin: 0 0.3rem;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 8px #b0bec544;
  &:hover, &:focus {
    background: #cfd8dc;
  }
`;

const BotonesConfirmacion = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const ListaDeTareas = ({ id }) => {
  const [tareas, setTareas, obtenerMasTareas, hayMasPorCargar] = useObtenerTareas(id);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [tareaAEliminar, setTareaAEliminar] = useState(null);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [mapaUsuarios, setMapaUsuarios] = useState({});

  // Estados de filtrado
  const [filterType, setFilterType] = useState('Todos');
  const [filterValue, setFilterValue] = useState('');
  const [filterMes, setFilterMes] = useState('');
  const [filterAnio, setFilterAnio] = useState('');

  // Meses y años dinámicos
  const meses = [
    { value: '1', label: 'Enero' }, { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' }, { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' }, { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' }, { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' }, { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' }
  ];
  const anios = Array.from(new Set(
    tareas.map(t => new Date(t.fechaCreado * 1000).getFullYear())
  )).sort((a, b) => b - a);

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

  const tareasFiltradas = tareas.filter(t => {
    if (filterType === 'Todos') return true;
    if (filterType === 'Mes') {
      if (!filterMes || !filterAnio) return true;
      const date = new Date(t.fechaCreado * 1000);
      return date.getFullYear() === parseInt(filterAnio, 10)
          && date.getMonth() + 1 === parseInt(filterMes, 10);
    }
    if (filterType === 'Día') {
      if (!filterValue) return true;
      return format(fromUnixTime(t.fechaCreado), 'yyyy-MM-dd') === filterValue;
    }
    if (filterType === 'Estado')
      return !filterValue || t.estadoTarea === filterValue;
    if (filterType === 'Responsable')
      return !filterValue
          || (Array.isArray(t.responsables) && t.responsables.includes(filterValue));
    return true;
  });

  const tareasAgrupadas = tareasFiltradas.reduce((acc, t) => {
    const fecha = formatearFecha(t.fechaCreado);
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(t);
    return acc;
  }, {});

  const fechasOrdenadas = Object.keys(tareasAgrupadas)
    .sort((a, b) => new Date(b) - new Date(a));

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
      <FiltrosContainer>
        <FiltroLabel>
          Filtrar por
          <StyledSelect
            value={filterType}
            onChange={e => {
              setFilterType(e.target.value);
              setFilterValue('');
              setFilterMes('');
              setFilterAnio('');
            }}
          >
            <option value="Todos">Todos</option>
            <option value="Mes">Mes</option>
            <option value="Día">Día</option>
            <option value="Estado">Estado</option>
            <option value="Responsable">Responsable</option>
            <option value="Gantt">Diagrama de Gantt</option>
          </StyledSelect>
        </FiltroLabel>

        {filterType === "Mes" && (
          <>
            <FiltroLabel>
              Mes
              <StyledSelect
                value={filterMes}
                onChange={e => setFilterMes(e.target.value)}
              >
                <option value="">Todos</option>
                {meses.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </StyledSelect>
            </FiltroLabel>

            <FiltroLabel>
              Año
              <StyledSelect
                value={filterAnio}
                onChange={e => setFilterAnio(e.target.value)}
              >
                <option value="">Todos</option>
                {anios.map(a => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </StyledSelect>
            </FiltroLabel>
          </>
        )}

        {filterType === "Día" && (
          <FiltroLabel>
            Fecha Inicio
            <StyledInput
              type="date"
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
            />
          </FiltroLabel>
        )}

        {filterType === "Estado" && (
          <FiltroLabel>
            Estado
            <StyledSelect
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
            >
              <option value="">Todos</option>
              {Object.keys(coloresEstado).map(estado => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </StyledSelect>
          </FiltroLabel>
        )}

        {filterType === "Responsable" && (
          <FiltroLabel>
            Responsable
            <StyledSelect
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
            >
              <option value="">Todos</option>
              {Object.entries(mapaUsuarios).map(([uid, name]) => (
                <option key={uid} value={uid}>
                  {name}
                </option>
              ))}
            </StyledSelect>
          </FiltroLabel>
        )}
      </FiltrosContainer>

      {/* Mostrar lista o gantt según filtro */}
      {filterType === "Gantt" ? (
        <div style={{ marginTop: "2rem" }}>
          <DiagramaGantt tareas={tareasFiltradas} />
        </div>
      ) : (
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
                    <Descripcion>
                      Fin: {formatearFecha(tarea.fechaVencimiento)}
                    </Descripcion>
                    <Descripcion>
                      Estado:{" "}
                      <Estado color={coloresEstado[tarea.estadoTarea]}>
                        {tarea.estadoTarea}
                      </Estado>
                    </Descripcion>
                    <Descripcion>
                      Responsables:{" "}
                      {Array.isArray(tarea.responsables) && tarea.responsables.length > 0 ? (
                        tarea.responsables.map((uid, i) => (
                          <Responsable key={i}>
                            {mapaUsuarios[uid] || "Cargando..."}
                          </Responsable>
                        ))
                      ) : (
                        <em>No asignado</em>
                      )}
                    </Descripcion>
                    <ContenedorBotones>
                      <BotonAccion
                        title="Eliminar tarea"
                        onClick={() => confirmarEliminacion(tarea)}
                      >
                        <IconoBorrar />
                      </BotonAccion>
                      <BotonAccion
                        as={Link}
                        to={`/editarTarea/${id}/${tarea.id}`}
                        title="Editar tarea"
                      >
                        <IconoEditar />
                      </BotonAccion>
                      <BotonAccion
                        title="Ver tarea"
                        onClick={() => setTareaSeleccionada(tarea)}
                      >
                        <IconoVer />
                      </BotonAccion>
                    </ContenedorBotones>
                  </ElementoLista>
                ))}
              </ContenedorTareasPorFecha>
            </div>
          ))}

          {!tareasFiltradas.length && (
            <ContenedorSubtitulo>
              <Subtitulo>No hay tareas que coincidan con el filtro</Subtitulo>
            </ContenedorSubtitulo>
          )}

          {hayMasPorCargar && (
            <ContenedorBotonCentral>
              <BotonCargarMas onClick={obtenerMasTareas}>
                Cargar Más
              </BotonCargarMas>
            </ContenedorBotonCentral>
          )}
        </Lista>
      )}

            {mostrarConfirmacion && (
        <VentanaConfirmacion>
          <ContenedorConfirmacion>
            <IconoAdvertencia>
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#f44336" opacity="0.12"/>
                <path d="M12 7v5" stroke="#f44336" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1.1" fill="#f44336"/>
              </svg>
            </IconoAdvertencia>
            <p style={{ fontWeight: 600, fontSize: '1.15rem', color: '#333', marginBottom: '0.4rem' }}>
              ¿Eliminar tarea <span style={{ color: '#f44336' }}>{tareaAEliminar?.nombreTarea}</span>?
            </p>
            <div style={{ color: "#777", fontSize: "0.97rem", marginBottom: "0.8rem" }}>
              Esta acción es irreversible. ¿Deseas continuar?
            </div>
            <BotonesConfirmacion>
              <BotonAccionEliminar onClick={eliminarTarea}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M6 7h12M10 11v4M14 11v4M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Eliminar
              </BotonAccionEliminar>
              <BotonAccionCancelar onClick={cancelarEliminacion}>
                Cancelar
              </BotonAccionCancelar>
            </BotonesConfirmacion>
          </ContenedorConfirmacion>
        </VentanaConfirmacion>
      )}

      {/* Modal de detalle */}
      {tareaSeleccionada && (
        <VentanaDetalle onClick={() => setTareaSeleccionada(null)}>
          <ContenedorDetalle onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: "1rem", color: "#2c3e50" }}>
              {tareaSeleccionada.nombreTarea}
            </h2>
            <SeccionDetalle>
              <Etiqueta>Descripción:</Etiqueta>
              <Contenido>
                {tareaSeleccionada.descripcionTarea || "No proporcionada"}
              </Contenido>
            </SeccionDetalle>
            <SeccionDetalle>
              <Etiqueta>Estado:</Etiqueta>
              <Estado color={coloresEstado[tareaSeleccionada.estadoTarea]}>
                {tareaSeleccionada.estadoTarea}
              </Estado>
            </SeccionDetalle>
            <SeccionDetalle>
              <Etiqueta>Fecha de Vencimiento:</Etiqueta>
              <Contenido>
                {formatearFecha(tareaSeleccionada.fechaVencimiento)}
              </Contenido>
            </SeccionDetalle>
            <SeccionDetalle>
              <Etiqueta>Responsables:</Etiqueta>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                {Array.isArray(tareaSeleccionada.responsables) &&
                tareaSeleccionada.responsables.length > 0 ? (
                  tareaSeleccionada.responsables.map((uid, i) => (
                    <Responsable key={i}>
                      {mapaUsuarios[uid] || "Cargando..."}
                    </Responsable>
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
