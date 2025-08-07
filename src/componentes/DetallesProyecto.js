// src/componentes/DetallesProyecto.js

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { format, fromUnixTime } from "date-fns";
import { es } from "date-fns/locale";
import editarProyecto from "./../firebase/editarProyecto";
import { db } from "./../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ListaUsuariosModal from "./ListaUsuariosModal";
import Alerta from "./../elementos/Alerta";
import { useAuth } from "../contextos/AuthContext";
import useObtenerMetodologias from "../hooks/useObtenerMetodologias";

// Estilos principales
const ContenedorCentral = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const SeccionIzquierda = styled.div`
  flex: 2;
  min-width: 300px;
`;

const SeccionDerecha = styled.div`
  flex: 1;
  min-width: 280px;
  background: #f9f9ff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const DetallesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

const Tarjeta = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  padding: 1rem 1.25rem;
  transition: transform 0.2s;
  border-left: 5px solid ${({ color }) => color || "#4f46e5"};
  &:hover {
    transform: translateY(-3px);
  }
`;

const Etiqueta = styled.p`
  font-weight: bold;
  font-size: 0.9rem;
  color: #555;
  margin: 0 0 0.25rem 0;
`;

const Valor = styled.p`
  font-size: 1rem;
  color: #222;
  margin: 0;
  line-height: 1.4;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  margin-top: 1rem;
  font-size: 1rem;
`;

const BotonAgregar = styled.button`
  padding: 10px 20px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background-color: #3e3aaf;
  }
`;

const BotonEliminar = styled.button`
  margin-top: 8px;
  padding: 6px 12px;
  background-color: ${({ disabled }) => (disabled ? '#f87171' : '#dc2626')};
  color: #fff;
  border: none;
  border-radius: 0.4rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.2s;
  &:hover {
    background-color: #b91c1c;
  }
`;

const TarjetaGestor = styled.div`
  background: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid #4f46e5;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const NombreGestor = styled.p`
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const InfoGestor = styled.p`
  font-size: 0.95rem;
  margin: 0.25rem 0;
  color: #333;
`;

const EtiquetaCreador = styled.span`
  background-color: #7c3aed;
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  margin-left: 0.5rem;
`;

const BotonAbrirListaUsuarios = styled.button`
  padding: 10px 20px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background-color: #3e3aaf;
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 2px solid rgba(255,255,255,0.2);
  border-top: 2px solid white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: ${spin} 0.6s linear infinite;
  display: inline-block;
  vertical-align: middle;
`;

const ModalConfirmacion = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContenido = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 380px;
  width: 90%;
  text-align: center;
`;

const BotonModal = styled.button`
  margin: 0 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  color: #fff;
  background: ${({ $secundario }) => ($secundario ? "#bdbdbd" : "#dc2626")};
  cursor: pointer;
  &:hover { background: ${({ $secundario }) => ($secundario ? "#9e9e9e" : "#b91c1c")}; }
`;

const formatearFecha = (fecha) =>
  format(fromUnixTime(fecha), "dd 'de' MMMM 'de' yyyy", { locale: es });

const DetallesProyecto = ({ proyecto, idProyecto }) => {
  const { usuario } = useAuth();
  const metodologias = useObtenerMetodologias(idProyecto);

  const [gestoresUids, setGestoresUids] = useState(proyecto.gestores || []);
  const [gestores, setGestores] = useState([]);
  const [creador, setCreador] = useState(null);
  const [usuarioNuevo, setUsuarioNuevo] = useState("");
  const [mostrarModalUsuarios, setMostrarModalUsuarios] = useState(false);
  const [loading, setLoading] = useState(false);

  const [estadoAlertaUid, setEstadoAlertaUid] = useState(false);
  const [alertaUid, setAlertaUid] = useState({});

  const [modalEliminar, setModalEliminar] = useState({
    abierto: false,
    uid: null,
    nombre: '',
    esAutoEliminacion: false
  });

  useEffect(() => { if (proyecto?.gestores) setGestoresUids(proyecto.gestores); }, [proyecto]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const infoGestores = await Promise.all(
          gestoresUids.map(async (uid) => {
            const snap = await getDoc(doc(db, 'usuarios', uid));
            return snap.exists() ? { uid, ...snap.data() } : null;
          })
        );
        setGestores(infoGestores.filter(Boolean));
        if (proyecto.creadoPor) {
          const snapC = await getDoc(doc(db, 'usuarios', proyecto.creadoPor));
          if (snapC.exists()) setCreador({ uid: proyecto.creadoPor, ...snapC.data() });
        }
      } catch (error) {
        console.error('Error cargando detalles:', error);
      }
    };
    cargar();
  }, [gestoresUids, proyecto.creadoPor]);

  const esCreador = usuario && creador && usuario.uid === creador.uid;

  const actualizarGestores = async (newUids) => {
    setLoading(true);
    const prev = [...gestoresUids];
    setGestoresUids(newUids);
    try {
      await editarProyecto({ ...proyecto, id: idProyecto, gestores: newUids });
    } catch (error) {
      console.error('Error al actualizar gestores:', error);
      setGestoresUids(prev);
    } finally { setLoading(false); }
  };

  const handleAgregarUsuario = async () => {
    if (!esCreador) return;
    const uid = usuarioNuevo.trim();
    if (!uid || gestoresUids.includes(uid)) return;

    setLoading(true);
    setEstadoAlertaUid(false);
    setAlertaUid({});

    try {
      const snap = await getDoc(doc(db, 'usuarios', uid));
      if (!snap.exists()) {
        setEstadoAlertaUid(true);
        setAlertaUid({ tipo: 'error', mensaje: `El UID "${uid}" no existe.` });
      } else {
        await actualizarGestores([...gestoresUids, uid]);
        setEstadoAlertaUid(true);
        setAlertaUid({ tipo: 'exito', mensaje: 'Usuario agregado correctamente.' });
        setUsuarioNuevo("");
      }
    } catch (error) {
      console.error('Error validando UID:', error);
      setEstadoAlertaUid(true);
      setAlertaUid({ tipo: 'error', mensaje: 'Error al validar el UID.' });
    } finally { setLoading(false); }
  };

  const handleAgregarDesdeModal = (seleccionados) => {
    if (!esCreador) return;
    const uidsNuevos = seleccionados.map(u=>u.uid).filter(uid=>!gestoresUids.includes(uid));
    if (uidsNuevos.length) {
      actualizarGestores([...gestoresUids,...uidsNuevos]);
      setEstadoAlertaUid(true);
      setAlertaUid({ tipo: 'exito', mensaje: `${uidsNuevos.length} usuario(s) agregados.` });
    }
    setMostrarModalUsuarios(false);
  };

  const abrirModalEliminar = (uid, nombre, esAuto=false) => {
    setModalEliminar({ abierto:true, uid, nombre, esAutoEliminacion:esAuto });
  };
  const confirmarEliminar = async () => {
    if (!modalEliminar.uid) return;
    await actualizarGestores(gestoresUids.filter(x=>x!==modalEliminar.uid));
    setModalEliminar({ abierto:false, uid:null, nombre:'', esAutoEliminacion:false });
  };
  const cancelarEliminar = () => setModalEliminar({ abierto:false, uid:null, nombre:'', esAutoEliminacion:false });

  return (
    <ContenedorCentral>
      <SeccionIzquierda>
        <div style={{ marginBottom:'2rem' }}>
          <h2 style={{ color:'#4f46e5' }}>{proyecto.nombreProyecto}</h2>
          <p style={{ fontStyle:'italic', color:'#777' }}>{formatearFecha(proyecto.fechaCreado)}</p>
        </div>

        <Tarjeta color="#e0e0e0" style={{ marginBottom:'1rem' }}>
          <Etiqueta>Descripción</Etiqueta>
          <Valor>{proyecto.descripcion}</Valor>
        </Tarjeta>
        {creador && (
          <Tarjeta color="#7c3aed" style={{ marginBottom:'1rem' }}>
            <Etiqueta>Creador del Proyecto</Etiqueta>
            <Valor>{creador.nombre} – {creador.correo}</Valor>
          </Tarjeta>
        )}

        {proyecto.tipoProyecto==='hibrido' ? (
          <>
            <h3>Metodología Híbrida</h3>
            {['analisis','planificacion','desarrollo','entrega'].map(fase=>(
              <Tarjeta key={fase} color="#7c3aed" style={{ marginTop:'1rem' }}>
                <Etiqueta style={{ textTransform:'capitalize' }}>{fase}</Etiqueta>
                <Valor>{metodologias?.[fase]?.metodo}</Valor>
              </Tarjeta>
            ))}
          </>
        ) : (
          <DetallesGrid>
            {[
              { etiqueta:'Tamaño', valor:proyecto.tamanioProyecto, color:'#4f46e5' },
              { etiqueta:'Complejidad y Riesgos', valor:proyecto.complejoRiesgos, color:'#059669' },
              { etiqueta:'Presencia del Cliente', valor:proyecto.presenciaCliente, color:'#2563eb' },
              { etiqueta:'Iterativo', valor:proyecto.iterativoProyecto, color:'#d97706' },
              { etiqueta:'Tipo', valor:proyecto.tipoProyecto, color:'#dc2626' },
              { etiqueta:'Metodología', valor:proyecto.metodologiaProyecto, color:'#7c3aed' }
            ].map((item,i)=>(
              <Tarjeta key={i} color={item.color}>
                <Etiqueta>{item.etiqueta}</Etiqueta>
                <Valor>{item.valor}</Valor>
              </Tarjeta>
            ))}
          </DetallesGrid>
        )}


      </SeccionIzquierda>

      <SeccionDerecha>
        <h3>Gestores Asignados</h3>
        {gestores.map(g=>{
          const esCreadorGestor = creador?.uid===g.uid;
          const esUsuarioActual = usuario?.uid===g.uid;
          return (
            <TarjetaGestor key={g.uid}>
              <NombreGestor>
                {g.nombre}{esCreadorGestor && <EtiquetaCreador>Creador</EtiquetaCreador>}
              </NombreGestor>
              <InfoGestor><strong>Correo:</strong> {g.correo}</InfoGestor>
              <InfoGestor><strong>Área:</strong> {g.area}</InfoGestor>
              {!esCreadorGestor && esCreador && (
                <BotonEliminar disabled={loading} onClick={()=>abrirModalEliminar(g.uid,g.nombre,false)}>
                  {loading ? <Spinner /> : 'Eliminar'}
                </BotonEliminar>
              )}
              {!esCreadorGestor && esUsuarioActual && !esCreador && (
                <BotonEliminar disabled={loading} onClick={()=>abrirModalEliminar(g.uid,g.nombre,true)}>
                  {loading ? <Spinner /> : 'Eliminarme'}
                </BotonEliminar>
              )}
            </TarjetaGestor>
          );
        })}

        {esCreador && (
          <>
            <BotonAbrirListaUsuarios onClick={()=>setMostrarModalUsuarios(true)} disabled={loading}>
              Lista de Usuarios con Grupos comunes
            </BotonAbrirListaUsuarios>

            <Input
              type="text"
              value={usuarioNuevo}
              onChange={e=>setUsuarioNuevo(e.target.value)}
              placeholder="UID del nuevo gestor"
              disabled={loading}
            />
            <BotonAgregar disabled={loading} onClick={handleAgregarUsuario}>
              {loading ? <Spinner /> : 'Agregar Gestor'}
            </BotonAgregar>
          </>
        )}

        <Alerta tipo={alertaUid.tipo} mensaje={alertaUid.mensaje} estadoAlerta={estadoAlertaUid} cambiarEstadoAlerta={setEstadoAlertaUid} />
      </SeccionDerecha>

      {modalEliminar.abierto && (
        <ModalConfirmacion role="dialog">
          <ModalContenido>
            <p>
              {modalEliminar.esAutoEliminacion ?
                '¿Seguro que deseas salir del proyecto?' :
                `¿Seguro que deseas eliminar a ${modalEliminar.nombre} del proyecto?`}
            </p>
            <div style={{ marginTop:'1rem' }}>
              <BotonModal onClick={confirmarEliminar}>Sí, eliminar</BotonModal>
              <BotonModal $secundario onClick={cancelarEliminar}>Cancelar</BotonModal>
            </div>
          </ModalContenido>
        </ModalConfirmacion>
      )}

      {mostrarModalUsuarios && esCreador && (
        <ListaUsuariosModal existingUids={gestoresUids} closeModal={handleAgregarDesdeModal} />
      )}
    </ContenedorCentral>
  );
};

export default DetallesProyecto;
