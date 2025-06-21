import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
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
  Subtitulo
} from "./../elementos/ElementosDeLista";
import { format, fromUnixTime } from "date-fns";
import { es } from "date-fns/locale";
import { ReactComponent as IconoEditar } from "./../imagenes/editar.svg";
import { ReactComponent as IconoVer } from "./../imagenes/view.svg";
import { ReactComponent as IconoBorrar } from "./../imagenes/borrar.svg";
import borrarTarea from "./../firebase/borrarTarea";
import { Link } from "react-router-dom";
import DiagramaGantt from "./DiagramaGantt";

// ========== ESTILOS (puedes mantenerlos como en tu código)
const ModernInput = styled.input`
  border: 2px solid #b9e5ff;
  outline: none;
  background: #fff;
  color: #222;
  border-radius: 16px;
  font-size: 1rem;
  padding: 0.68rem 1.2rem;
  font-weight: 500;
  margin-top: 0.25rem;
  box-shadow: 0 2px 10px 0 #e3edf780;
  transition: border 0.18s, box-shadow 0.18s;
  &:focus, &:hover {
    border: 2.5px solid #42a5f5;
    background: #e7f6ff;
    box-shadow: 0 4px 18px 0 #b9e5ff70;
  }
`;

const FiltrosContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.4rem;
  margin-bottom: 1rem;
  padding: 1.0rem 1.0rem;
  background: #f5fbff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px 0 #b9e5ff20;
  align-items: flex-end;
`;

const FiltroLabel = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: 600;
  color: #37474f;
  font-size: 1rem;
  gap: 0.2rem;
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

const TaskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  grid-template-columns: repeat(3, 1fr);
  gap: 2.3rem 1.3rem;
  width: 100%;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const TaskCardWrapper = styled.div`
  min-width: 0;
  width: 100%;
  margin-bottom: 0.2rem;
`;

const FechaCard = styled(Fecha)`
  margin-bottom: 0.6rem;
  margin-top: 0.2rem;
  font-size: 1.01rem;
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
  padding: 0.22rem 0.6rem;
  border-radius: 0.7rem;
  display: inline-block;
  min-width: 90px;
  text-align: center;
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

// ========== Dropdown custom igual al anterior
const DropdownContainer = styled.div`
  position: relative;
  min-width: 270px;
  user-select: none;
`;

const Selected = styled.div`
  padding: 0.5rem 1.0rem;
  background: #fff;
  border: 2px solid #b9e5ff;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 10px 0 #e3edf7a3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover, &:focus {
    border: 2.5px solid #42a5f5;
    background: #e7f6ff;
  }
`;

const OptionsList = styled.ul`
  position: absolute;
  width: 100%;
  margin: 0;
  top: 110%;
  left: 0;
  background: #fff;
  border-radius: 16px;
  border: 2px solid #b9e5ff;
  box-shadow: 0 8px 32px #8ad7ff3a;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
  padding: 0.3rem 0;
  list-style: none;
`;

const Option = styled.li`
  padding: 0.7rem 1.1rem;
  cursor: pointer;
  font-size: 1rem;
  background: ${({ active, selected }) =>
    selected ? "#16b1ff"
    : active ? "#e3edf7"
    : "#fff"};
  color: ${({ selected }) => selected ? "#fff" : "#212121"};
  font-weight: ${({ selected }) => selected ? 700 : 500};
  border-radius: 10px;
  margin: 0.12rem 0.4rem;
  transition: background 0.16s;
  &:hover, &:focus {
    background: ${({ selected }) => selected ? "#16b1ff" : "#e3edf7"};
    color: ${({ selected }) => selected ? "#fff" : "#222"};
  }
`;

const Icon = styled.span`
  margin-left: 0.6rem;
  font-size: 1.2rem;
  color: #88bbdf;
  pointer-events: none;
`;

function SingleSelectDropdown({
  options,
  value,
  setValue,
  placeholder = "Selecciona...",
  labelKey = "label",
  valueKey = "value"
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef();

  useEffect(() => {
    const handleClick = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selectedOption = options.find(opt => opt[valueKey] === value);

  return (
    <DropdownContainer ref={ref} tabIndex={0}>
      <Selected
        onClick={() => setOpen(o => !o)}
        tabIndex={0}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
      >
        {selectedOption ? selectedOption[labelKey] : placeholder}
        <Icon>▼</Icon>
      </Selected>
      {open && (
        <OptionsList>
          {options.map((opt, idx) => (
            <Option
              key={opt[valueKey] ?? idx}
              selected={value === opt[valueKey]}
              active={idx === activeIndex}
              onClick={() => { setValue(opt[valueKey]); setOpen(false); }}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              {opt[labelKey]}
            </Option>
          ))}
        </OptionsList>
      )}
    </DropdownContainer>
  );
}

// ========== COMPONENTE PRINCIPAL ==========

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

  // FILTRADO UNIFICADO
  const tareasFiltradas = tareas.filter(t => {
if (filterType === 'Mes') {
      const date = new Date(t.fechaCreado * 1000);
      // Si seleccionaste solo mes
      if (filterMes && !filterAnio) {
        return date.getMonth() + 1 === parseInt(filterMes, 10);
      }
      // Si seleccionaste solo año
      if (!filterMes && filterAnio) {
        return date.getFullYear() === parseInt(filterAnio, 10);
      }
      // Si ambos, filtra por ambos
      if (filterMes && filterAnio) {
        return (
          date.getFullYear() === parseInt(filterAnio, 10) &&
          date.getMonth() + 1 === parseInt(filterMes, 10)
        );
      }
      // Si nada, muestra todas
      if (!filterMes && !filterAnio) return true;
    }
    if (filterType === 'Todos') return true;
    if (filterType === 'Día') {
      if (!filterValue) return true;
      return format(fromUnixTime(t.fechaCreado), 'yyyy-MM-dd') === filterValue;
    }
    if (filterType === 'Todos') return true;
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

  // ORDENAR tareas por fechaCreado descendente
  const tareasFiltradasOrdenadas = [...tareasFiltradas].sort((a, b) => b.fechaCreado - a.fechaCreado);

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
          <SingleSelectDropdown
            options={[
              { value: "Todos", label: "Todos" },
              { value: "Mes", label: "Mes" },
              { value: "Día", label: "Día" },
              { value: "Estado", label: "Estado" },
              { value: "Responsable", label: "Responsable" },
              { value: "Gantt", label: "Diagrama de Gantt" }
            ]}
            value={filterType}
            setValue={val => {
              setFilterType(val);
              setFilterValue('');
              setFilterMes('');
              setFilterAnio('');
            }}
            placeholder="Filtrar por"
          />
        </FiltroLabel>
        {filterType === "Mes" && (
          <>
            <FiltroLabel>
              Mes
              <SingleSelectDropdown
                options={[
                  { value: "", label: "Todos" },
                  ...meses
                ]}
                value={filterMes}
                setValue={setFilterMes}
                placeholder="Mes"
              />
            </FiltroLabel>
            <FiltroLabel>
              Año
              <SingleSelectDropdown
                options={[
                  { value: "", label: "Todos" },
                  ...anios.map(a => ({ value: a, label: a }))
                ]}
                value={filterAnio}
                setValue={setFilterAnio}
                placeholder="Año"
              />
            </FiltroLabel>
          </>
        )}
        {filterType === "Día" && (
          <FiltroLabel>
            Fecha Inicio
            <ModernInput
              type="date"
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
            />
          </FiltroLabel>
        )}
        {filterType === "Estado" && (
          <FiltroLabel>
            Estado
            <SingleSelectDropdown
              options={[
                { value: "", label: "Todos" },
                ...Object.keys(coloresEstado).map(e => ({ value: e, label: e }))
              ]}
              value={filterValue}
              setValue={setFilterValue}
              placeholder="Estado"
            />
          </FiltroLabel>
        )}
        {filterType === "Responsable" && (
          <FiltroLabel>
            Responsable
            <SingleSelectDropdown
              options={[
                { value: "", label: "Todos" },
                ...Object.entries(mapaUsuarios).map(([uid, name]) => ({
                  value: uid,
                  label: name
                }))
              ]}
              value={filterValue}
              setValue={setFilterValue}
              placeholder="Responsable"
            />
          </FiltroLabel>
        )}
      </FiltrosContainer>

      {/* Mostrar lista o gantt según filtro */}
      {filterType === "Gantt" ? (
        <div style={{ marginTop: "2rem" }}>
          <DiagramaGantt tareas={tareasFiltradasOrdenadas} />
        </div>
      ) : (
        <Lista>
          {tareasFiltradasOrdenadas.length ? (
            <TaskGrid>
              {tareasFiltradasOrdenadas.map(tarea => (
                <TaskCardWrapper key={tarea.id}>
                  <FechaCard>{formatearFecha(tarea.fechaCreado)}</FechaCard>
                  <ElementoLista>
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
                </TaskCardWrapper>
              ))}
            </TaskGrid>
          ) : (
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

      {/* Modal de confirmación */}
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
