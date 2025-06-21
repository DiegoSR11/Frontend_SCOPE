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

// Pill-style filter buttons
const FilterButtonGroup = styled.div`
  display: flex;
  gap: 0.7rem;
  align-items: center;
  margin-bottom: 0.2rem;
`;
const FilterButton = styled.button`
  padding: 0.45rem 1.2rem;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  background: #e3edf7;
  color: #2563eb;
  cursor: pointer;
  font-size: 0.97rem;
  box-shadow: 0 2px 8px #cbd5e150;
  letter-spacing: 0.03em;

  &:hover, &:focus {
    background: #bae6fd;
    color: #1e293b;
    outline: none;
    transform: scale(1.02);
  }
`;

const StyledSelect = styled.select`
  margin-top: 0.15rem;
  padding: 0.42rem 0.8rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 0.7rem;
  background: #f8fafc;
  font-size: 0.97rem;
  font-weight: 600;
  color: #2b2d42;
  &:focus {
    border-color: #2563eb;
    background: #e0f2fe;
  }
`;

const StyledInput = styled.input`
  margin-top: 0.15rem;
  padding: 0.42rem 0.8rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 0.7rem;
  background: #f8fafc;
  font-size: 0.97rem;
  font-weight: 500;
  color: #22223b;
  &:focus {
    border-color: #2563eb;
    background: #e0f2fe;
  }
`;

const FiltrosContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.4rem 2.2rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f1f5f9;
  border-radius: 1.2rem;
  align-items: flex-end;
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

const filtrosDisponibles = [
  { value: "Todos", label: "Todos" },
  { value: "Mes", label: "Mes" },
  { value: "Día", label: "Día" },
  { value: "Probabilidad", label: "Probabilidad" },
  { value: "Impacto", label: "Impacto" }
];

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

  const riesgosFiltrados = riesgos.filter(riesgo => {
    if (filterType === 'Todos') return true;
    if (filterType === 'Mes') {
      if (!filterMes || !filterAnio) return true;
      const date = new Date(riesgo.fechaCreado * 1000);
      return date.getFullYear() === parseInt(filterAnio, 10)
          && date.getMonth() + 1 === parseInt(filterMes, 10);
    }
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

  const riesgosAgrupados = riesgosFiltrados.reduce((acc, riesgo) => {
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
      <FiltrosContainer>
        <FilterButtonGroup>
          {filtrosDisponibles.map(filtro => (
            <FilterButton
              key={filtro.value}
              active={filterType === filtro.value}
              onClick={() => {
                setFilterType(filtro.value);
                setFilterValue('');
                setFilterMes('');
                setFilterAnio('');
              }}
              type="button"
            >
              {filtro.label}
            </FilterButton>
          ))}
        </FilterButtonGroup>

        {filterType === "Mes" && (
          <>
            <label>
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
            </label>
            <label>
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
            </label>
          </>
        )}

        {filterType === "Día" && (
          <label>
            
            <StyledInput
              type="date"
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
            />
          </label>
        )}

        {filterType === "Probabilidad" && (
          <label>
            
            <StyledSelect
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
            >
              <option value="">Todas</option>
              {probabilidades.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </StyledSelect>
          </label>
        )}

        {filterType === "Impacto" && (
          <label>
            
            <StyledSelect
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
            >
              <option value="">Todos</option>
              {impactos.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </StyledSelect>
          </label>
        )}
      </FiltrosContainer>

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

        {riesgosFiltrados.length === 0 && (
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
