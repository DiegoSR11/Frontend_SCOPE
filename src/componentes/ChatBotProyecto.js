import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Boton from "./../elementos/Boton";
import chatbotImage from './../imagenes/chatbot.png';

const FloatingChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 350px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  background-color: #fff;
  transition: all 0.3s ease-in-out;
`;

const ChatContainer = styled.div`
  width: 100%;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
`;

const Mensajes = styled.div`
  flex-grow: 1;
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #333;
  padding-right: 10px;
`;

const BotonesSeleccion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
`;

const BotonConTitulo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TituloBoton = styled.h4`
  margin-bottom: 5px;
  font-size: 1rem;
  color: #00a9ff;
  font-weight: 600;
  text-align: center;
`;

const BotImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin: 0 auto 10px auto;
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;

  &:hover {
    background-color: #cc0000;
  }
`;

const ChatBotIA = ({ proyecto, tareas = [], riesgos = [], vista }) => {
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);

  const obtenerSugerencias = async (prompt) => {
    setCargando(true);
    const nuevoMensaje = {
      usuario: "Tú",
      texto: "Generando análisis completo...",
    };
    setMensajes([...mensajes, nuevoMensaje]);

    try {
      const respuesta = await axios.post("https://backendscope-hkg5a4g8d7dsdwdh.canadacentral-01.azurewebsites.net/api/chat", {
        mensaje: prompt,
      });

      const respuestaIA = respuesta.data.respuesta?.content || "Sin respuesta válida";

      setMensajes((prev) => [
        ...prev,
        { usuario: "ChatBot", texto: respuestaIA },
      ]);
    } catch (error) {
      console.error("Error en el chatbot:", error);
      setMensajes((prev) => [
        ...prev,
        { usuario: "ChatBot", texto: "Error al obtener sugerencias." },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const toggleChat = () => setChatAbierto(!chatAbierto);
  const minimizeChat = () => setChatAbierto(false);

  const generarPrompt = () => {
    switch (vista) {
      case "tareas":
  if (tareas && tareas.length > 0) {
    return `
Analiza el siguiente proyecto y sus tareas en función de la metodología asignada (${proyecto?.metodologiaProyecto}). 
No expliques la metodología ni des información general. No uses negritas, cursivas ni otros formatos de texto. 
La respuesta debe ser concreta, objetiva y en formato de lista.

Indica:
- Tareas que no aportan valor o que no están alineadas con el objetivo del proyecto o con la metodología aplicada.
- Sugerencias para reemplazar, mejorar o eliminar tareas redundantes.

Datos del proyecto:
- Título: ${proyecto?.nombreProyecto || "No especificado"}
- Descripción: ${proyecto?.descripcion || "Sin descripción disponible"}

Tareas registradas:
${tareas.map((t, i) => `${i + 1}. ${t.nombreTarea || "Sin nombre"}`).join("\n")}

Tu análisis debe enfocarse en la utilidad de cada tarea según el objetivo del proyecto y la metodología indicada.
    `;
  } else {
    return `
No hay tareas registradas en este proyecto.

Basándote únicamente en el título, la descripción y la metodología asignada (${proyecto?.metodologiaProyecto}), sugiere entre 1 y 5 tareas que deberían desarrollarse. 
No expliques la metodología ni uses conclusiones. Sé breve, específico y usa formato de lista simple.

Datos del proyecto:
- Título: ${proyecto?.nombreProyecto || "No especificado"}
- Descripción: ${proyecto?.descripcion || "Sin descripción disponible"}

Formato sugerido:
- [Nombre de la tarea]: [Descripción breve de lo que se debe hacer]
    `;
  }

        
      case "riesgos":
        return `
        Analiza las tareas registradas y los riesgos asociados al proyecto. 
        No expliques la metodología ni repitas el nombre del proyecto. 
        La respuesta debe ser concreta y en formato de lista.

        Si ya hay riesgos, escribe:
        "Según las tareas y el objetivo del proyecto con metodología ${proyecto?.metodologiaProyecto}, considera lo siguiente:"
        - [Riesgo identificado]: [Recomendación breve para mitigarlo o prevenirlo]

        Puedes indicar si un riesgo es redundante o si falta cubrir un aspecto crítico.

        Si no hay riesgos, escribe:
        "No hay riesgos registrados. Según las tareas y el objetivo del proyecto, considera los siguientes posibles riesgos y cómo mitigarlos:"
        - [Riesgo]: [Recomendación breve] y [Recomendación breve para mitigarlo o prevenirlo]

        Sugiere entre 1 y 5 riesgos clave, centrados en posibles fallos o amenazas que puedan afectar las tareas y objetivos del proyecto.

        Datos:
        ${tareas && tareas.length > 0  
          ? "Tareas registradas:\n" + tareas.map((t, i) => `${i + 1}. ${t.nombreTarea || "Sin nombre"}`).join("\n") 
          : "Este proyecto aún no tiene tareas registradas."}
        ${riesgos && riesgos.length > 0 
          ? "Riesgos registrados:\n" + riesgos.map((r, i) => `${i + 1}. ${r.nombreRiesgo || "Sin descripción"}`).join("\n") 
          : "No hay riesgos registrados."}
        `;
        
      default:
        return `
        Con base en los siguientes datos del proyecto, proporciona 2 o 3 sugerencias muy breves para 
        mejorar su planificación y gestión, de acuerdo con la metodología ya asignada y la estructura de esta metodologia. 
        No repitas el nombre del proyecto.
        Si el proyecto no es especifico o no tiene información adicional, informalo y sugiere que info deberian colocar.
        Ejemplo, si piden desarrollar una app se debe explicar en descripción los detalles de esta aplicación, o si desea instalar
        o cambiar algun componte, piensa en lo que se debe hacer y sugiere la entrada de estos datos.
        - Titulo: ${proyecto?.nombreProyecto || "No especificado"}
        - Descripción: ${proyecto?.descripcion || "Sin descripción disponible"}
        - Metodologia: ${proyecto?.metodologiaProyecto || "No especificado"}
        `;
    }
  };
  

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
            <BotonConTitulo>
              <TituloBoton>Analizar</TituloBoton>
              <Boton onClick={() => obtenerSugerencias(generarPrompt())} disabled={cargando}>
                {cargando ? "Analizando..." : `Analizar ${vista}`}
              </Boton>
            </BotonConTitulo>

            </BotonesSeleccion>
          </ChatContainer>
        </FloatingChatContainer>
      )}
    </>
  );
};

export default ChatBotIA;
