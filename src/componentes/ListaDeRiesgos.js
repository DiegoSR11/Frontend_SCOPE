import React, { useState, useRef, useEffect } from "react";
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
  Subtitulo
} from "./../elementos/ElementosDeLista";
import { format, fromUnixTime } from "date-fns";
import { es } from "date-fns/locale";
import { ReactComponent as IconoEditar } from "./../imagenes/editar.svg";
import { ReactComponent as IconoVer } from "./../imagenes/view.svg";
import { ReactComponent as IconoBorrar } from "./../imagenes/borrar.svg";
import styled from "styled-components";
import borrarRiesgo from "./../firebase/borrarRiesgo";
import { Link } from "react-router-dom";

// ========== ESTILOS (idénticos a ListaDeTareas)
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

const Resaltado = styled.span`
  background-color: ${({ nivel }) => {
    switch (nivel) {
      case "Impacto Alto":
      case "Probabilidad Alta":
        return "#f44336";
      case "Impacto Medio":
      case "Probabilidad Media":
        return "#FFA832";
      case "Impacto Bajo":
      case "Probabilidad Baja":
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

const probabilidades = [
  "Probabilidad Alta",
  "Probabilidad Media",
  "Probabilidad Baja"
];
const impactos = [
  "Impacto Alto",
  "Impacto Medio",
  "Impacto Bajo"
];

const filtrosDisponibles = [
  { value: "Todos", label: "Todos" },
  { value: "Mes", label: "Mes" },
  { value: "Día", label: "Día" },
  { value: "Probabilidad", label: "Probabilidad" },
  { value: "Impacto", label: "Impacto" }
];

const ListaDeRiesgos = ({ id }) => {
  const [riesgos, setRiesgos, obtenerMasRiesgos, hayMasPorCargar] = useObtenerRiesgos(id);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [riesgoAEliminar, setRiesgoAEliminar] = useState(null);
  const [riesgoSeleccionado, setRiesgoSeleccionado] = useState(null);

  // Estados de filtrado
  const [filterType, setFilterType] = useState('Todos');
  const [filterValue, setFilterValue] = useState('');
  const [filterMes, setFilterMes] = useState('');
  const [filterAnio, setFilterAnio] = useState('');

  const meses = [
    { value: '1', label: 'Enero' }, { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' }, { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' }, { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' }, { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' }, { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' }
  ];
  const anios = Array.from(new Set(
    riesgos.map(r => new Date(r.fechaCreado * 1000).getFullYear())
  )).sort((a, b) => b - a);

  const formatearFecha = (fecha) =>
    format(fromUnixTime(fecha), "dd 'de' MMMM 'de' yyyy", { locale: es });

  // FILTRADO UNIFICADO idéntico a tareas
  const riesgosFiltrados = riesgos.filter(riesgo => {
    if (filterType === 'Mes') {
      const date = new Date(riesgo.fechaCreado * 1000);
      // Solo mes
      if (filterMes && !filterAnio) {
        return date.getMonth() + 1 === parseInt(filterMes, 10);
      }
      // Solo año
      if (!filterMes && filterAnio) {
        return date.getFullYear() === parseInt(filterAnio, 10);
      }
      // Ambos
      if (filterMes && filterAnio) {
        return (
          date.getFullYear() === parseInt(filterAnio, 10) &&
          date.getMonth() + 1 === parseInt(filterMes, 10)
        );
      }
      // Si nada, muestra todos
      if (!filterMes && !filterAnio) return true;
    }
    if (filterType === 'Todos') return true;
    if (filterType === 'Día') {
      if (!filterValue) return true;
      return format(fromUnixTime(riesgo.fechaCreado), 'yyyy-MM-dd') === filterValue;
    }
    if (filterType === 'Probabilidad')
      return !filterValue || riesgo.probabilidad === filterValue;
    if (filterType === 'Impacto')
      return !filterValue || riesgo.impacto === filterValue;
    return true;
  });

  // ORDENAR por fechaCreado descendente
  const riesgosFiltradosOrdenados = [...riesgosFiltrados].sort((a, b) => b.fechaCreado - a.fechaCreado);

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
      <FiltrosContainer>
        <FiltroLabel>
          Filtrar por
          <SingleSelectDropdown
            options={filtrosDisponibles}
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
        {filterType === "Probabilidad" && (
          <FiltroLabel>
            Probabilidad
            <SingleSelectDropdown
              options={[
                { value: "", label: "Todas" },
                ...probabilidades.map(e => ({ value: e, label: e }))
              ]}
              value={filterValue}
              setValue={setFilterValue}
              placeholder="Probabilidad"
            />
          </FiltroLabel>
        )}
        {filterType === "Impacto" && (
          <FiltroLabel>
            Impacto
            <SingleSelectDropdown
              options={[
                { value: "", label: "Todos" },
                ...impactos.map(e => ({ value: e, label: e }))
              ]}
              value={filterValue}
              setValue={setFilterValue}
              placeholder="Impacto"
            />
          </FiltroLabel>
        )}
      </FiltrosContainer>

      <Lista>
        {riesgosFiltradosOrdenados.length ? (
          <TaskGrid>
            {riesgosFiltradosOrdenados.map(riesgo => (
              <TaskCardWrapper key={riesgo.id}>
                <FechaCard>{formatearFecha(riesgo.fechaCreado)}</FechaCard>
                <ElementoLista>
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
              </TaskCardWrapper>
            ))}
          </TaskGrid>
        ) : (
          <ContenedorSubtitulo>
            <Subtitulo>No hay riesgos que coincidan con el filtro</Subtitulo>
          </ContenedorSubtitulo>
        )}

        {hayMasPorCargar && (
          <ContenedorBotonCentral>
            <BotonCargarMas onClick={obtenerMasRiesgos}>Cargar Más</BotonCargarMas>
          </ContenedorBotonCentral>
        )}
      </Lista>

      {/* Confirmación de borrado */}
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
              ¿Eliminar riesgo <span style={{ color: '#f44336' }}>{riesgoAEliminar?.nombreRiesgo}</span>?
            </p>
            <div style={{ color: "#777", fontSize: "0.97rem", marginBottom: "0.8rem" }}>
              Esta acción es irreversible. ¿Deseas continuar?
            </div>
            <BotonesConfirmacion>
              <BotonAccionEliminar onClick={eliminarRiesgo}>
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

      {/* Detalle de riesgo */}
      {riesgoSeleccionado && (
        <VentanaDetalle onClick={() => setRiesgoSeleccionado(null)}>
          <ContenedorDetalle onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: "1rem", color: "#2c3e50" }}>
              {riesgoSeleccionado.nombreRiesgo}
            </h2>
            <SeccionDetalle>
              <Etiqueta>Descripción:</Etiqueta>
              <Contenido>
                {riesgoSeleccionado.descripcionRiesgo || "No proporcionada"}
              </Contenido>
            </SeccionDetalle>
            <SeccionDetalle>
              <Etiqueta>Fecha creado:</Etiqueta>
              <Contenido>
                {formatearFecha(riesgoSeleccionado.fechaCreado)}
              </Contenido>
            </SeccionDetalle>
            <SeccionDetalle>
              <Etiqueta>Probabilidad:</Etiqueta>
              <Resaltado nivel={riesgoSeleccionado.probabilidad}>{riesgoSeleccionado.probabilidad}</Resaltado>
            </SeccionDetalle>
            <SeccionDetalle>
              <Etiqueta>Impacto:</Etiqueta>
              <Resaltado nivel={riesgoSeleccionado.impacto}>{riesgoSeleccionado.impacto}</Resaltado>
            </SeccionDetalle>
          </ContenedorDetalle>
        </VentanaDetalle>
      )}
    </>
  );
};

export default ListaDeRiesgos;
