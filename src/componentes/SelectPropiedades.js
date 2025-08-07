// src/componentes/SelectPropiedades.js

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import theme from "./../theme"; // Suponiendo que tienes un archivo de tema
import BotonInfo from "./../elementos/BotonInfo";

// Contenedor principal del select con espacio para la etiqueta
const ContenedorSelect = styled.div`
  background: ${theme.grisClaro};
  cursor: pointer;
  border-radius: 0.625rem;
  position: relative;
  height: 2.5rem;
  width: 100%;
  padding: 0 1.0rem;
  font-size: 1.0rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  transition: 0.3s ease all;

  &:hover {
    background: ${theme.grisClaro2};
  }
`;

// Opción seleccionada (lo que se muestra en el select)
const OpcionSeleccionada = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.0rem;
  color: ${theme.textoGris};

  svg {
    width: 1.0rem;
    height: auto;
    margin-left: 1.25rem;
  }
`;

// Opciones que se despliegan
const Opciones = styled.div`
  background: ${theme.grisClaro};
  position: absolute;
  top: 2.5rem;
  left: 0;
  width: 100%;
  border-radius: 0.625rem;
  max-height: 9.75rem;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.6);
`;

// Estilo de cada opción
const Opcion = styled.div`
  padding: 1.0rem;
  font-size: 1.0rem;
  display: flex;
  align-items: center;
  transition: background 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${theme.grisClaro2};
  }
`;

// Contenedor para la etiqueta y el botón de selección
const SelectPreguntaContainer = styled.div`
  margin-bottom: 1.0rem;
`;

// Etiqueta para cada pregunta
const LabelPregunta = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 1.0rem;
  color: ${theme.textoGris};
`;

const FilaSelect = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Espacio entre el select y el botón info */
`;

// Componente select reutilizable
const SelectPregunta = ({ id, label, valor, cambiarValor, opciones, mensajeInfo }) => {
  const [mostrarSelect, cambiarMostrarSelect] = useState(false);
  const refSelect = useRef(null);

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refSelect.current && !refSelect.current.contains(event.target)) {
        cambiarMostrarSelect(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtramos las opciones para no mostrar "Selecciona una opción" si ya hay una opción seleccionada
  const opcionesFiltradas = valor
    ? opciones.filter((opcion) => opcion.value !== "")
    : opciones;

  return (
    <SelectPreguntaContainer>
      <LabelPregunta htmlFor={id}>{label}</LabelPregunta>
      <FilaSelect>
        <ContenedorSelect
          ref={refSelect}
          onClick={() => cambiarMostrarSelect(!mostrarSelect)}
        >
          <OpcionSeleccionada>{valor || "Selecciona una opción"}</OpcionSeleccionada>
          {mostrarSelect && (
            <Opciones>
              {opcionesFiltradas.map((opcion) => (
                <Opcion
                  key={opcion.value}
                  data-valor={opcion.value}
                  onClick={(e) => {
                    cambiarValor(e.currentTarget.dataset.valor);
                    cambiarMostrarSelect(false);
                  }}
                >
                  {opcion.texto}
                </Opcion>
              ))}
            </Opciones>
          )}
        </ContenedorSelect>
        <BotonInfo mensaje={mensajeInfo} />
      </FilaSelect>
    </SelectPreguntaContainer>
  );
};

// Usos específicos para cada pregunta

export const SelectTamanioProyecto = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="tamanioProyecto"
    label="¿Cuál es el tamaño de tu proyecto?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Define el tamaño del proyecto según su alcance, duración, cantidad de recursos y complejidad."
    opciones={[
      { value: "proyecto_pequeno", texto: "Pequeño: alcance limitado, duración corta" },
      { value: "proyecto_mediano", texto: "Mediano: alcance moderado, duración media" },
      { value: "proyecto_grande", texto: "Grande: alcance amplio, duración larga" }
    ]}
  />
);

export const SelectNivelDocumentacion = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="nivelDocumentacion"
    label="¿Nivel de documentación?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Selecciona si la documentación inicial será nula, básica o completa."
    opciones={[
      { value: "ninguna", texto: "Ninguna: no se requiere documentación formal" },
      { value: "basica", texto: "Básica: documentación esencial" },
      { value: "completa", texto: "Completa: documentación detallada" }
    ]}
  />
);

// Nuevo: Stakeholders involucrados (antes checkbox)
export const SelectStakeholdersInvolucrados = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="stakeholders"
    label="¿Stakeholders involucrados?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Indica si hay partes interesadas involucradas en el proyecto."
    opciones={[
      { value: "si", texto: "Sí: múltiples partes interesadas" },
      { value: "no", texto: "No: sin partes interesadas definidas" }
    ]}
  />
);

// Nuevo: Duración en meses (antes input number)
export const SelectDuracionMeses = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="duracionMeses"
    label="Duración (meses)"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Selecciona el rango aproximado de duración en meses."
    opciones={[
      { value: "1-3", texto: "1–3 meses" },
      { value: "4-6", texto: "4–6 meses" },
      { value: "7-12", texto: "7–12 meses" },
      { value: ">12", texto: "Más de 12 meses" }
    ]}
  />
);

export const SelectPresupuesto = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="presupuesto"
    label="¿Presupuesto disponible?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Indica si el presupuesto es limitado, medio o alto."
    opciones={[
      { value: "limitado", texto: "Limitado: fondos ajustados" },
      { value: "medio", texto: "Medio: presupuesto razonable" },
      { value: "alto", texto: "Alto: recursos suficientes" }
    ]}
  />
);

export const SelectNivelRiesgo = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="nivelRiesgo"
    label="¿Nivel de riesgo?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Evalúa el riesgo: bajo, medio o alto."
    opciones={[
      { value: "bajo", texto: "Bajo: riesgos mínimos" },
      { value: "medio", texto: "Medio: riesgos moderados" },
      { value: "alto", texto: "Alto: riesgos significativos" }
    ]}
  />
);

export const SelectRequisitosRegulatorios = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="requisitosRegulatorios"
    label="¿Requisitos regulatorios?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Indica si existen requisitos legales o normativos."
    opciones={[
      { value: "si", texto: "Sí: requisitos documentados" },
      { value: "no", texto: "No: sin requisitos especiales" }
    ]}
  />
);

export const SelectCulturaColaborativa = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="culturaColaborativa"
    label="¿Cultura colaborativa?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Define si el equipo fomenta la colaboración continua."
    opciones={[
      { value: "si", texto: "Sí: trabajo en pareja y revisiones frecuentes" },
      { value: "no", texto: "No: roles tradicionales" }
    ]}
  />
);

export const SelectFeedbackContinuo = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="feedbackContinuo"
    label="¿Feedback continuo?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Indica si se brindan devoluciones regulares."
    opciones={[
      { value: "si", texto: "Sí: tras cada entrega" },
      { value: "no", texto: "No: solo al final" }
    ]}
  />
);

export const SelectIntegracionContinua = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="integracionContinua"
    label="¿Integración continua?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="¿Se integran cambios automáticamente?"
    opciones={[
      { value: "si", texto: "Sí: builds y tests automáticos" },
      { value: "no", texto: "No: integraciones manuales" }
    ]}
  />
);

export const SelectEntregasFrecuentes = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="entregasFrecuentes"
    label="¿Entregas frecuentes?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Define si hay lanzamientos regulares."
    opciones={[
      { value: "si", texto: "Sí: despliegues periódicos" },
      { value: "no", texto: "No: despliegue único" }
    ]}
  />
);

export const SelectMantenimientoPrevisto = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="mantenimientoPrevisto"
    label="¿Mantenimiento previsto?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="¿Se planifican actualizaciones posteriores?"
    opciones={[
      { value: "si", texto: "Sí: plan de soporte y parches" },
      { value: "no", texto: "No: sin soporte formal" }
    ]}
  />
);

export const SelectAltaDisponibilidad = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="altaDisponibilidad"
    label="¿Requiere alta disponibilidad?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Downtime mínimo y redundancia requerida."
    opciones={[
      { value: "si", texto: "Sí: servicio 24/7" },
      { value: "no", texto: "No: caídas aceptables" }
    ]}
  />
);

export const SelectDespliegueSegmentado = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="despliegueSegmentado"
    label="¿Despliegue segmentado?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Liberación por fases o regiones."
    opciones={[
      { value: "si", texto: "Sí: lanzamiento por fases" },
      { value: "no", texto: "No: despliegue global" }
    ]}
  />
);

export const SelectPlanRollback = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="planRollback"
    label="¿Necesita plan de rollback?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Capacidad de revertir cambios si hay fallo."
    opciones={[
      { value: "si", texto: "Sí: procedimiento documentado" },
      { value: "no", texto: "No: rollback opcional" }
    ]}
  />
);

export const SelectComplejoRiesgos = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="complejoRiesgos"
    label="¿Tu proyecto es complejo?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Indica la complejidad técnica y de integración."
    opciones={[
      { value: "si", texto: "Sí: alta complejidad y riesgos" },
      { value: "no", texto: "No: baja complejidad" }
    ]}
  />
);

export const SelectPresenciaCliente = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="presenciaCliente"
    label="¿El cliente participará activamente?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Indica nivel de involucramiento del cliente."
    opciones={[
      { value: "si", texto: "Sí: participa en reuniones" },
      { value: "no", texto: "No: participación baja" }
    ]}
  />
);

export const SelectIterativoProyecto = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="iterativoProyecto"
    label="¿El proyecto será iterativo?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Define si habrá ciclos iterativos."
    opciones={[
      { value: "si", texto: "Sí: entregas frecuentes" },
      { value: "no", texto: "No: secuencial" }
    ]}
  />
);

export const SelectTipoProyecto = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="tipoProyecto"
    label="¿Cuál es el tipo de tu proyecto?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Selecciona la categoría del proyecto."
    opciones={[
      { value: "infraestructura", texto: "Infraestructura Tecnológica" },
      { value: "cloud", texto: "Plataformas y Servicios Cloud" },
      { value: "aplicaciones", texto: "Aplicaciones Empresariales" },
      { value: "seguridad", texto: "Seguridad TI" },
      { value: "cambio", texto: "Cambio Tecnológico" }
    ]}
  />
);

export const SelectNivelImpacto = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="nivelImpacto"
    label="Nivel de Impacto"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Evalúa el impacto potencial de los riesgos."
    opciones={[
      { value: "alto", texto: "Alto: afecta plazos y objetivos" },
      { value: "medio", texto: "Medio: requiere seguimiento" },
      { value: "bajo", texto: "Bajo: fácil mitigación" }
    ]}
  />
);

export const SelectProbabilidad = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="probabilidad"
    label="Probabilidad"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Estima la probabilidad del riesgo."
    opciones={[
      { value: "alta", texto: "Alta: muy probable" },
      { value: "media", texto: "Media: posible" },
      { value: "baja", texto: "Baja: poco probable" }
    ]}
  />
);
