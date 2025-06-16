import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Boton from "./../elementos/Boton";
import chatbotImage from './../imagenes/chatbot.png';

// ==== Estilos ====
const FloatingChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 350px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
  border-radius: 14px;
  background-color: #fff;
  transition: all 0.3s;
`;
const ChatContainer = styled.div`
  width: 100%;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
`;
const Mensajes = styled.div`
  flex-grow: 1;
  max-height: 260px;
  overflow-y: auto;
  margin-bottom: 12px;
  font-size: 1rem;
  color: #23272f;
  padding-right: 8px;
`;
const BotonesSeleccion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 12px;
  align-items: center; // centra los botones horizontalmente
`;

const BotonIA = styled(Boton)`
  width: 100%;
  max-width: 320px;
  min-width: 160px;
  min-height: 48px;
  font-weight: 700;
  border-radius: 13px;
  margin: 0 auto;
  color: #fff;
  text-align: center;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #fff;
    box-shadow: 0 6px 24px rgba(0,169,255,0.21);
    transform: translateY(-2px) scale(1.03);
  }
  &:active {
    background: #007bb5;
  }
  &:disabled {
    opacity: 0.7;
    background: #b6b6b6;
    color: #f6f6f6;
    cursor: not-allowed;
    transform: none;
  }
`;

const BotImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin: 0 auto 12px auto;
`;
const ToggleButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background-color: #00a9ff;
  color: white;
  border-radius: 6px;
  border: none;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s;
  &:hover {
    background-color: #007bb5;
  }
`;
const MinimizeButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff4d4d;
  color: white;
  border-radius: 6px;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  align-self: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.16);
  transition: background-color 0.3s;
  &:hover {
    background-color: #cc0000;
  }
`;

// ==== PROMPTS ====
function getPrompt(tipo, proyecto, tareas, riesgos) {
  switch (tipo) {
    // DETALLES
    case "explicar-metodologia":
      return `
Eres un sistema de gestión de proyectos con experiencia en TI. Explica brevemente por qué la metodología "${proyecto?.metodologiaProyecto}" fue seleccionada para este proyecto, basándote solo en los datos proporcionados y en los criterios de alineación con objetivos, alcance, tamaño y naturaleza del proyecto. 
No menciones otras metodologías ni alternativas.

- Título: ${proyecto?.nombreProyecto || "No especificado"}
- Descripción: ${proyecto?.descripcion || "Sin descripción"}
      `;
    case "buenas-practicas":
      return `
Eres un experto en buenas prácticas para la gestión de proyectos TI. Enumera solo 3 buenas prácticas prioritarias que deberían aplicarse para el éxito de este proyecto, considerando únicamente el título, la descripción y la metodología indicada (${proyecto?.metodologiaProyecto || "no especificada"}). No expliques ni justifiques, solo enumera la práctica y una breve frase de acción.

- Título: ${proyecto?.nombreProyecto || "No especificado"}
- Descripción: ${proyecto?.descripcion || "Sin descripción"}
      `;
    case "consejos-proyecto":
      return `
Actúa como consultor senior en gestión de proyectos TI. Proporciona 2 o 3 consejos accionables y directos para mejorar el desarrollo de este proyecto, enfocados en la planificación, gestión del equipo o entrega de valor.

- Título: ${proyecto?.nombreProyecto || "No especificado"}
- Descripción: ${proyecto?.descripcion || "Sin descripción"}
      `;
    // TAREAS
    case "analizar-tareas":
      return `
Eres un sistema de gestión de proyectos TI. Analiza las tareas actuales del proyecto y señala únicamente si alguna tarea es innecesaria, está duplicada, o si falta alguna esencial. Enumera solo los hallazgos, sin explicar la metodología ni agregar contexto adicional.

- Metodología: ${proyecto?.metodologiaProyecto || "no especificada"}
- Título: ${proyecto?.nombreProyecto || "No especificado"}

Tareas:
${tareas.map((t, i) => `${i + 1}. ${t.nombreTarea || "Sin nombre"}`).join("\n")}
      `;
    case "recomendar-tareas":
      return `
Eres un sistema experto en proyectos TI. Sugiere 3 a 5 tareas clave y relevantes que deben incluirse en la planificación de este proyecto, considerando la metodología (${proyecto?.metodologiaProyecto || "no especificada"}) y el contexto.

- Título: ${proyecto?.nombreProyecto || "No especificado"}
- Descripción: ${proyecto?.descripcion || "Sin descripción"}

Formato: 
- [Nombre de la tarea]: [Breve descripción]
      `;
    // RIESGOS
    case "analizar-riesgos":
      return `
Eres un sistema avanzado en gestión de riesgos de proyectos TI. Analiza los riesgos registrados y reporta solo si hay redundancias, riesgos críticos ausentes o si algún riesgo es innecesario, sin contexto adicional.

Riesgos:
${riesgos.length > 0 ? riesgos.map((r, i) => `${i + 1}. ${r.nombreRiesgo || "Sin nombre"}`).join("\n") : "No hay riesgos registrados"}
      `;
    case "recomendar-riesgos":
      return `
Eres un sistema de gestión de riesgos en proyectos TI. Sugiere 2 a 4 riesgos críticos para este proyecto y cómo se podrían mitigar. Solo muestra el riesgo y la mitigación breve, sin agregar contexto general.

- Título: ${proyecto?.nombreProyecto || "No especificado"}
- Descripción: ${proyecto?.descripcion || "Sin descripción"}
      `;
    default:
      return "No hay un prompt definido para esta opción.";
  }
}

const opcionesPorVista = (vista, proyecto, tareas, riesgos) => {
  switch (vista) {
    case "detalles":
      return [
        ...(proyecto?.metodologiaProyecto
          ? [{ prompt: getPrompt("explicar-metodologia", proyecto, tareas, riesgos), texto: "Explicación de metodología" }]
          : []),
        { prompt: getPrompt("buenas-practicas", proyecto, tareas, riesgos), texto: "Buenas prácticas de gestión" },
        { prompt: getPrompt("consejos-proyecto", proyecto, tareas, riesgos), texto: "Consejos sobre tu proyecto" },
      ];
    case "tareas":
      return [
        ...(tareas.length > 0
          ? [{ prompt: getPrompt("analizar-tareas", proyecto, tareas, riesgos), texto: "Analizar tareas actuales" }]
          : []),
        { prompt: getPrompt("recomendar-tareas", proyecto, tareas, riesgos), texto: "Recomendar tareas" },
      ];
    case "riesgos":
      return [
        ...(riesgos.length > 0
          ? [{ prompt: getPrompt("analizar-riesgos", proyecto, tareas, riesgos), texto: "Analizar riesgos actuales" }]
          : []),
        { prompt: getPrompt("recomendar-riesgos", proyecto, tareas, riesgos), texto: "Recomendar riesgos" },
      ];
    default:
      return [];
  }
};

const ChatBotIA = ({ proyecto, tareas = [], riesgos = [], vista }) => {
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);
  const [botonActivo, setBotonActivo] = useState(null);

  const botones = opcionesPorVista(vista, proyecto, tareas, riesgos);

  const obtenerSugerencias = async (prompt, idx) => {
    setBotonActivo(idx);  // Ocultar botón presionado
    setMensajes([]);      // Limpiar chat
    setCargando(true);
    setMensajes([{ usuario: "Tú", texto: "Procesando tu consulta..." }]);

    try {
      const respuesta = await axios.post(
        "https://backendscope-hkg5a4g8d7dsdwdh.canadacentral-01.azurewebsites.net/api/chat",
        { mensaje: prompt }
      );
      const respuestaIA = respuesta.data.respuesta?.content || "Sin respuesta válida";
      setMensajes([
        { usuario: "Tú", texto: "Procesando tu consulta..." },
        { usuario: "ChatBot", texto: respuestaIA }
      ]);
    } catch (error) {
      setMensajes([
        { usuario: "Tú", texto: "Procesando tu consulta..." },
        { usuario: "ChatBot", texto: "Error al obtener sugerencias." }
      ]);
    } finally {
      setCargando(false);
      setBotonActivo(null);
    }
  };

  const toggleChat = () => setChatAbierto(!chatAbierto);
  const minimizeChat = () => setChatAbierto(false);

  return (
    <>
      <ToggleButton onClick={toggleChat}>SCOPE AI</ToggleButton>
      {chatAbierto && (
        <FloatingChatContainer>
          <ChatContainer>
            <MinimizeButton onClick={minimizeChat}>Cerrar</MinimizeButton>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <BotImage src={chatbotImage} alt="Chatbot" />
            </div>
            <Mensajes>
              {mensajes.map((msg, index) => (
                <div key={index}>
                  <strong>{msg.usuario}:</strong>
                  <div dangerouslySetInnerHTML={{ __html: msg.texto.replace(/\n/g, "<br/>") }} />
                </div>
              ))}
            </Mensajes>
            <BotonesSeleccion>
              {botones.map((b, idx) =>
                (!cargando || botonActivo !== idx) && (
                  <BotonIA
                    key={idx}
                    onClick={() => obtenerSugerencias(b.prompt, idx)}
                    disabled={cargando}
                    style={{
                      display: botonActivo === idx && cargando ? "none" : "block",
                    }}
                  >
                    {cargando && botonActivo === idx ? "Procesando..." : b.texto}
                  </BotonIA>
                )
              )}
            </BotonesSeleccion>
          </ChatContainer>
        </FloatingChatContainer>
      )}
    </>
  );
};

export default ChatBotIA;
