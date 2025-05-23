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

  // Manejo de la selección
  const handleClick = (e) => {
    cambiarValor(e.currentTarget.dataset.valor);
    cambiarMostrarSelect(false); // Cierra el menú después de seleccionar
  };

  // Cierra el menú si se hace clic fuera
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

  // Filtramos las opciones para no mostrar "Selecciona una opción" si ya hay una opción seleccionada
  const opcionesFiltradas = valor
    ? opciones.filter((opcion) => opcion.value !== "")
    : opciones;

  return (
    <SelectPreguntaContainer>
      <LabelPregunta htmlFor={id}>{label}</LabelPregunta>
      <FilaSelect>
        <ContenedorSelect ref={refSelect} onClick={() => cambiarMostrarSelect(!mostrarSelect)}>
          <OpcionSeleccionada>
            {valor || "Selecciona una opción"}
          </OpcionSeleccionada>
          {mostrarSelect && (
            <Opciones>
              {opcionesFiltradas.map((opcion) => (
                <Opcion key={opcion.value} data-valor={opcion.value} onClick={handleClick}>
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

const SelectTamanioProyecto = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="tamanioProyecto"
    label="¿Cuál es el tamaño de tu proyecto?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Define el tamaño del proyecto según su alcance, duración, cantidad de recursos y complejidad."
    opciones={[
      { value: "Proyecto Pequeño", texto: "Pequeño: Alcance limitado, duración corta, pocos recursos involucrados." },
      { value: "Proyecto Mediano", texto: "Mediano: Alcance moderado, duración media, equipo y recursos intermedios." },
      { value: "Proyecto Grande", texto: "Grande: Alcance amplio, duración larga, varios equipos y recursos múltiples." },
    ]}
  />
);

const SelectComplejoRiesgos = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="complejoRiesgos"
    label="¿Tu proyecto es complejo?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Indica si el proyecto tiene alta complejidad técnica, de integración, gestión o incertidumbre en riesgos."
    opciones={[
      { value: "Proyecto Complejo", texto: "Sí: Requiere coordinación avanzada, integración compleja o manejo riguroso de riesgos." },
      { value: "Proyecto No Complejo", texto: "No: Proceso sencillo con pocos riesgos y baja complejidad técnica." },
    ]}
  />
);

const SelectPresenciaCliente = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="presenciaCliente"
    label="¿El cliente estará presente durante el desarrollo?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Indica si el cliente participará activamente en reuniones, revisiones, decisiones y validaciones del proyecto."
    opciones={[
      { value: "Cliente Presente", texto: "Sí: Cliente participa activamente en reuniones y toma de decisiones." },
      { value: "Cliente Ausente", texto: "No: Cliente con poca o ninguna participación durante el desarrollo." },
    ]}
  />
);

const SelectIterativoProyecto = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="iterativoProyecto"
    label="¿El proyecto se desarrollará de forma iterativa?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Define si el proyecto se ejecutará en ciclos iterativos que permiten revisiones y mejoras continuas."
    opciones={[
      { value: "Proyecto Iterativo", texto: "Sí: Desarrollo en ciclos con entregas y mejoras progresivas." },
      { value: "Proyecto No Iterativo", texto: "No: Desarrollo lineal sin revisiones intermedias planificadas." },
    ]}
  />
);


const SelectTipoProyecto = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="tipoProyecto"
    label="¿Cuál es el tipo de tu proyecto?"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Selecciona la categoría que mejor representa tu proyecto en la consultora. Esto ayudará a personalizar recomendaciones y tareas."
    opciones={[
      { value: "Infraestructura Tecnológica", texto: "Infraestructura Tecnológica" },
      { value: "Plataformas y Servicios Cloud", texto: "Plataformas y Servicios Cloud" },
      { value: "Aplicaciones Empresariales", texto: "Aplicaciones Empresariales" },
      { value: "Seguridad TI", texto: "Seguridad TI" },
      { value: "Cambio Tecnológico", texto: "Cambio Tecnológico" },
    ]}
  />
);



const SelectNivelImpacto = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="nivelImpacto"
    label="Nivel de Impacto"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Evalúa el impacto potencial del riesgo en el proyecto en caso de que ocurra."
    opciones={[
      { value: "Impacto Alto", texto: "Impacto Alto" },
      { value: "Impacto Medio", texto: "Impacto Medio" },
      { value: "Impacto Bajo", texto: "Impacto Bajo" },
    ]}
  />
);

const SelectProbabilidad = ({ valor, cambiarValor }) => (
  <SelectPregunta
    id="probabilidad"
    label="Probabilidad"
    valor={valor}
    cambiarValor={cambiarValor}
    mensajeInfo="Estima qué tan probable es que ocurra el riesgo en el contexto del proyecto."
    opciones={[
      { value: "Probabilidad Alta", texto: "Probabilidad Alta" },
      { value: "Probabilidad Media", texto: "Probabilidad Media" },
      { value: "Probabilidad Baja", texto: "Probabilidad Baja" },
    ]}
  />
);


export {
  SelectTamanioProyecto,
  SelectComplejoRiesgos,
  SelectPresenciaCliente,
  SelectIterativoProyecto,
  SelectTipoProyecto,
  SelectNivelImpacto,
  SelectProbabilidad
};
