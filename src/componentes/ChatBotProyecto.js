import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Boton from "./../elementos/Boton";
import chatbotImage from './../imagenes/chatbot.png';

// ==== Constante de sistema ====
const SYSTEM_PREFIX = `
Eres SCOPE AI, un asistente experto, objetivo y crítico en gestión de proyectos TI.
Solo debes analizar, sugerir o alertar sobre metodología, planificación, tareas y riesgos en proyectos TI. 
Si la petición es ajena a estos temas, responde:
  "Lo siento, lo que solicitas no parece un proyecto TI válido. Esta aplicación solo gestiona proyectos de TI."
`.trim();

// ==== Estilos ====
const FloatingChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 90vw;
  max-width: 350px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0 8px 20px rgba(0,0,0,0.22);
  border-radius: 14px;
`;

const ChatHeader = styled.div`
  flex: 0 0 auto;
  padding: 10px 20px;
  background: #00a9ff;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
`;

const ChatContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  background: #f9f9f9;
  overflow: hidden;
`;

const Mensajes = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  margin-bottom: 10px;
  font-size: 1rem;
  color: #23272f;
  overflow-wrap: break-word;
  word-break: break-word;
`;

const BotonesSeleccion = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BotonIA = styled(Boton)`
  width: 100%;
  height: 36px;
  padding: 0 12px;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    box-shadow: 0 6px 24px rgba(0,169,255,0.21);
    transform: translateY(-2px) scale(1.03);
  }
  &:active { background: #007bb5; }
  &:disabled {
    opacity: 0.7; background: #b6b6b6; color: #f6f6f6;
    cursor: not-allowed; transform: none;
  }
`;

const BotImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin: 0 auto 10px;
`;

const ToggleButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  background-color: #00a9ff;
  color: white;
  border-radius: 6px;
  border: none;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: background-color 0.3s;
  &:hover { background-color: #007bb5; }
`;

const MinimizeButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
`;

// ==== Prompts de ingeniería crítica ====
function getPrompt(tipo, proyecto, tareas, riesgos) {
  const baseData = `
- Título: ${proyecto?.nombreProyecto || "No especificado"}
- Descripción: ${proyecto?.descripcion || "Sin descripción"}
- Metodología: ${proyecto?.metodologiaProyecto || "No especificada"}
`.trim();

  switch (tipo) {
    case "analizar-tareas":
      return tareas && tareas.length
        ? `
${SYSTEM_PREFIX}

Analiza las tareas listadas del proyecto de forma exhaustiva y crítica.
- Detecta tareas innecesarias, duplicadas, solapadas, con poca relevancia o que puedan bloquear el avance.
- Indica SIEMPRE si hay tareas faltantes esenciales para un proyecto TI exitoso (aunque no existan tareas actuales).
- No repitas títulos, justifica con 1 línea cada hallazgo.
- No expliques contexto general ni seas complaciente, enfócate en riesgos reales y omisiones.

${baseData}
Tareas:
${tareas.map((t, i) => `${i + 1}. ${t.nombreTarea || "Sin nombre"}`).join("\n")}
`.trim()
        : `
${SYSTEM_PREFIX}

No hay tareas registradas para este proyecto. Para realizar un análisis crítico de tareas, primero debes agregar al menos una tarea al proyecto.
`.trim();

    case "recomendar-tareas":
      return `
${SYSTEM_PREFIX}

Como consultor TI, sugiere 3-5 tareas CLAVE, relevantes y que APORTEN VALOR real y medible a la planificación del proyecto.
- Cada tarea debe ser accionable, no genérica, y alineada a la metodología indicada.
- NO repitas tareas ya registradas.
- Explica en 1 línea la importancia o el objetivo de cada tarea.

${baseData}
Tareas actuales:
${tareas && tareas.length
  ? tareas.map((t, i) => `${i + 1}. ${t.nombreTarea || "Sin nombre"}`).join("\n")
  : "No hay tareas registradas"}
`.trim();

    // -- RIESGOS --
    case "analizar-riesgos":
      return riesgos && riesgos.length
        ? `
${SYSTEM_PREFIX}

Haz un análisis crítico de los riesgos registrados:
- Detecta duplicados, riesgos irrelevantes, poco específicos o improbables.
- Identifica SIEMPRE riesgos críticos ausentes, según el contexto del proyecto (aunque no existan riesgos actuales).
- Justifica por qué cada riesgo detectado o ausente es relevante.

${baseData}
Riesgos:
${riesgos.map((r, i) => `${i + 1}. ${r.nombreRiesgo || "Sin nombre"}`).join("\n")}
`.trim()
        : `
${SYSTEM_PREFIX}

No se identifican riesgos registrados para este proyecto.
`.trim();

    case "recomendar-riesgos":
      return `
${SYSTEM_PREFIX}

Sugiere de forma crítica los 2-4 riesgos MÁS críticos y específicos para el proyecto.
- No repitas riesgos ya registrados.
- Para cada riesgo, explica brevemente su impacto y da una medida de mitigación práctica y concreta, no genérica.

${baseData}
Riesgos actuales:
${riesgos && riesgos.length
  ? riesgos.map((r, i) => `${i + 1}. ${r.nombreRiesgo || "Sin nombre"}`).join("\n")
  : "No hay riesgos registrados"}
`.trim();

    // -- Por defecto: detalles --
    case "explicar-metodologia":
      return `
${SYSTEM_PREFIX}

Explica de forma crítica y breve por qué la metodología "${proyecto?.metodologiaProyecto}" es la más adecuada para el proyecto, usando los criterios:
- Objetivos
- Alcance
- Tamaño
- Naturaleza
Evita mencionar otras metodologías.

${baseData}
`.trim();

    case "buenas-practicas":
      return `
${SYSTEM_PREFIX}

Enumera solo 3 buenas prácticas PRIORITARIAS para el éxito del proyecto, adaptadas al contexto y la metodología.
Formato: [Práctica] – [Acción muy breve].

${baseData}
`.trim();

    case "consejos-proyecto":
      return `
${SYSTEM_PREFIX}

Proporciona 3 consejos accionables, realistas y directos para mejorar el proyecto. Enfócate en:
- Planificación realista
- Gestión del equipo
- Entrega de valor

${baseData}
`.trim();

    default:
      return SYSTEM_PREFIX;
  }
}


// ==== Opciones por pestaña (SIEMPRE dos en tareas y riesgos) ====
const opcionesPorVista = (vista, proyecto, tareas, riesgos) => {
  if (vista === "detalles") {
    return [
      { prompt: getPrompt("explicar-metodologia", proyecto, tareas, riesgos), texto: "Explicar metodología" },
      { prompt: getPrompt("buenas-practicas", proyecto, tareas, riesgos), texto: "Buenas prácticas" },
      { prompt: getPrompt("consejos-proyecto", proyecto, tareas, riesgos), texto: "Consejos proyecto" }
    ];
  }
  if (vista === "tareas") {
    return [
      { prompt: getPrompt("analizar-tareas", proyecto, tareas, riesgos), texto: "Análisis crítico de tareas" },
      { prompt: getPrompt("recomendar-tareas", proyecto, tareas, riesgos), texto: "Recomendación de nuevas tareas" }
    ];
  }
  if (vista === "riesgos") {
    return [
      { prompt: getPrompt("analizar-riesgos", proyecto, tareas, riesgos), texto: "Análisis crítico de riesgos" },
      { prompt: getPrompt("recomendar-riesgos", proyecto, tareas, riesgos), texto: "Recomendación de nuevos riesgos" }
    ];
  }
  return [];
};

// ==== Componente principal ====
const ChatBotIA = ({ proyecto, tareas = [], riesgos = [], vista }) => {
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);
  const [botonActivo, setBotonActivo] = useState(null);

  const botones = opcionesPorVista(vista, proyecto, tareas, riesgos);

  const limpiarMarkdown = (texto) =>
    texto
      .replace(/\*\*/g, "")     // negritas
      .replace(/^#+\s*/gm, "")  // encabezados (#, ##, ###)
      .replace(/^- /gm, "")     // viñetas
      .trim();

  const obtenerSugerencias = async (prompt, idx) => {
    setBotonActivo(idx);
    setMensajes([{ usuario: "Tú", texto: "Procesando tu consulta..." }]);
    setCargando(true);

    try {
      const { data } = await axios.post(
        "https://backendscope-hkg5a4g8d7dsdwdh.canadacentral-01.azurewebsites.net/api/chat",
        { mensaje: prompt }
      );
      let texto = limpiarMarkdown(data.respuesta?.content || "");
      setMensajes([
        { usuario: "Tú", texto: "Procesando tu consulta..." },
        { usuario: "ChatBot", texto: texto || "Sin respuesta válida" }
      ]);
    } catch {
      setMensajes([
        { usuario: "Tú", texto: "Procesando tu consulta..." },
        { usuario: "ChatBot", texto: "Error al obtener sugerencias." }
      ]);
    } finally {
      setCargando(false);
      setBotonActivo(null);
    }
  };

  return (
    <>
      {!chatAbierto && (
        <ToggleButton onClick={() => setChatAbierto(true)}>
          SCOPE AI
        </ToggleButton>
      )}
      {chatAbierto && (
        <FloatingChatContainer>
          <ChatHeader>
            SCOPE AI
            <MinimizeButton onClick={() => setChatAbierto(false)}>
              ✕
            </MinimizeButton>
          </ChatHeader>
          <ChatContainer>
            <BotImage src={chatbotImage} alt="Chatbot" />
            <Mensajes>
              {mensajes.map((msg, i) => (
                <div key={i}>
                  <strong>{msg.usuario}:</strong>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: msg.texto.replace(/\n/g, "<br/>")
                    }}
                  />
                </div>
              ))}
            </Mensajes>
            <BotonesSeleccion>
              {botones.map((b, idx) => (
                <BotonIA
                  key={idx}
                  onClick={() => obtenerSugerencias(b.prompt, idx)}
                  disabled={cargando}
                >
                  {cargando && botonActivo === idx
                    ? "Procesando..."
                    : b.texto}
                </BotonIA>
              ))}
            </BotonesSeleccion>
          </ChatContainer>
        </FloatingChatContainer>
      )}
    </>
  );
};

export default ChatBotIA;
