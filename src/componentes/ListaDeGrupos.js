import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "./../contextos/AuthContext";
import { db } from "./../firebase/firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Helmet } from "react-helmet";
import { Header, Titulo } from "./../elementos/Header";
import BtnRegresar from "./../elementos/BtnRegresar";
import { Link } from "react-router-dom";
import grupoImg from "./../imagenes/grupo.png";
import BotonInfo from "./../elementos/BotonInfo";

// Estilos
const ContenedorCentral = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 2rem 1rem 4rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const Tarjeta = styled.div`
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 6px 20px rgba(0, 169, 255, 0.12);
  border-top: 6px solid ${({ color }) => color || "#00A9FF"};
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 169, 255, 0.2);
  }
`;

const Contenido = styled.div`
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ImagenGrupo = styled.img`
  width: 100%;
  height: 160px;
  object-fit: contain;
  border-radius: 0 0 1rem 1rem;
  background-color: #f0f9ff;
  padding: 1rem;
`;

const Etiqueta = styled.p`
  font-weight: 600;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Valor = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  color: #1f2937;
  word-break: break-word;
`;

const BotonVerGrupo = styled(Link)`
  margin: 1.5rem 2rem 0.5rem;
  padding: 0.65rem 1.2rem;
  background-color: #00A9FF;
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: #008ed6;
    transform: scale(1.03);
    box-shadow: 0 4px 12px rgba(0, 169, 255, 0.3);
  }
`;

const BotonEliminar = styled.button`
  margin: 0 2rem 2rem;
  padding: 0.65rem 1.2rem;
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "#ef4444")};
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#ccc" : "#dc2626")};
  }
`;

const BotonRegistrar = styled(Link)`
  margin-left: auto;
  padding: 0.6rem 1.2rem;
  background-color: #00A9FF;
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: #008ed6;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 169, 255, 0.3);
  }
`;

const MensajeVacio = styled.p`
  font-size: 1.1rem;
  color: #4b5563;
  grid-column: 1 / -1;
  text-align: center;
  margin-top: 2rem;
`;

// Modal estilos
const FondoModal = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalConfirmacion = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

// Colores para borde superior de tarjetas
const colores = [
  "#00A9FF", "#0095DC", "#007EBA", "#006AA0", "#005884", "#004B78"
];

const ListaDeGrupos = () => {
  const { usuario } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [grupoAEliminar, setGrupoAEliminar] = useState(null);

  useEffect(() => {
    const obtenerGrupos = async () => {
      try {
        const consulta = query(
          collection(db, "grupos"),
          where("miembros", "array-contains", usuario.uid)
        );
        const resultado = await getDocs(consulta);
        const gruposObtenidos = resultado.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGrupos(gruposObtenidos);
      } catch (error) {
        console.error("Error al obtener grupos:", error);
      }
    };

    if (usuario) {
      obtenerGrupos();
    }
  }, [usuario]);

  const borrarProyecto = async id => {
    try {
      await deleteDoc(doc(db, "grupos", id));
      setGrupos(prev => prev.filter(grupo => grupo.id !== id));
      setMostrarConfirmacion(false);
      setGrupoAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar grupo:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Lista de Grupos</title>
      </Helmet>

      <Header>
        <BtnRegresar />
        <Titulo>Grupos de Trabajo</Titulo>
        <BotonInfo mensaje="Aquí puedes visualizar, editar o eliminar los grupos a los que perteneces." />
        <BotonRegistrar to="/agregarGrupo">
          + Registrar Grupo
        </BotonRegistrar>
      </Header>

      <ContenedorCentral>
        {grupos.length > 0 ? (
          grupos.map((grupo, index) => {
            const isCreator = grupo.creadoPor === usuario.uid;
            return (
              <Tarjeta key={grupo.id} color={colores[index % colores.length]}>
                <ImagenGrupo src={grupoImg} alt="Imagen Grupo" />
                <Contenido>
                  <Etiqueta>Nombre del Grupo</Etiqueta>
                  <Valor>{grupo.nombreGrupo}</Valor>

                  <Etiqueta>Descripción</Etiqueta>
                  <Valor>{grupo.descripcion || "Sin descripción"}</Valor>

                  <Etiqueta>Miembros</Etiqueta>
                  <Valor>{grupo.miembros?.length || 0}</Valor>
                </Contenido>

                <BotonVerGrupo to={`/editarGrupo/${grupo.id}`}>
                  Ver Grupo
                </BotonVerGrupo>

                <BotonEliminar
                  disabled={!isCreator}
                  onClick={() => {
                    if (!isCreator) return;
                    setGrupoAEliminar(grupo.id);
                    setMostrarConfirmacion(true);
                  }}
                >
                  Eliminar grupo
                </BotonEliminar>
              </Tarjeta>
            );
          })
        ) : (
          <MensajeVacio>No hay grupos por mostrar.</MensajeVacio>
        )}
      </ContenedorCentral>

      {mostrarConfirmacion && (
        <FondoModal>
          <ModalConfirmacion>
            <p>¿Estás seguro de que deseas eliminar este grupo?</p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", justifyContent: "center" }}>
              <button
                onClick={() => borrarProyecto(grupoAEliminar)}
                style={{ backgroundColor: "#dc2626", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none", cursor: "pointer" }}
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => {
                  setMostrarConfirmacion(false);
                  setGrupoAEliminar(null);
                }}
                style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none", cursor: "pointer" }}
              >
                Cancelar
              </button>
            </div>
          </ModalConfirmacion>
        </FondoModal>
      )}
    </>
  );
};

export default ListaDeGrupos;
