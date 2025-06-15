import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { format, fromUnixTime } from "date-fns";
import { es } from "date-fns/locale";
import editarProyecto from "./../firebase/editarProyecto";
import { db } from "./../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ListaUsuariosModal from "./ListaUsuariosModal";
import Alerta from "./../elementos/Alerta";  // <-- Importar Alerta

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

const formatearFecha = (fecha) =>
  format(fromUnixTime(fecha), "dd 'de' MMMM 'de' yyyy", { locale: es });

const DetallesProyecto = ({ proyecto, idProyecto }) => {
  const [gestoresUids, setGestoresUids] = useState(proyecto.gestores || []);
  const [gestores, setGestores] = useState([]);
  const [creador, setCreador] = useState(null);
  const [usuarioNuevo, setUsuarioNuevo] = useState("");
  const [mostrarModalUsuarios, setMostrarModalUsuarios] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para la alerta de validación de UID
  const [estadoAlertaUid, setEstadoAlertaUid] = useState(false);
  const [alertaUid, setAlertaUid] = useState({});

  // Sincronizar UIDs al cambiar proyecto
  useEffect(() => {
    if (proyecto?.gestores) setGestoresUids(proyecto.gestores);
  }, [proyecto]);

  // Cargar detalles de gestores y creador
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

  const actualizarGestores = async (newUids) => {
    setLoading(true);
    const prev = [...gestoresUids];
    setGestoresUids(newUids);
    try {
      await editarProyecto({ ...proyecto, id: idProyecto, gestores: newUids });
    } catch (error) {
      console.error('Error al actualizar gestores:', error);
      setGestoresUids(prev);
    } finally {
      setLoading(false);
    }
  };

  // Validación de UID antes de agregar desde input
  const handleAgregarUsuario = async () => {
    const uid = usuarioNuevo.trim();
    if (!uid || gestoresUids.includes(uid)) return;

    setLoading(true);
    setEstadoAlertaUid(false);
    setAlertaUid({});

    try {
      const snap = await getDoc(doc(db, 'usuarios', uid));
      if (!snap.exists()) {
        setEstadoAlertaUid(true);
        setAlertaUid({
          tipo: 'error',
          mensaje: `El UID "${uid}" no existe.`
        });
      } else {
        await actualizarGestores([...gestoresUids, uid]);
        setEstadoAlertaUid(true);
        setAlertaUid({
          tipo: 'exito',
          mensaje: 'Se agregó el usuario correctamente.'
        });
        setUsuarioNuevo("");
      }
    } catch (error) {
      console.error('Error validando UID:', error);
      setEstadoAlertaUid(true);
      setAlertaUid({
        tipo: 'error',
        mensaje: 'Hubo un error al validar el UID.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Validación y alerta al agregar desde modal
  const handleAgregarDesdeModal = (seleccionados) => {
    const uidsNuevos = seleccionados
      .map((u) => u.uid)
      .filter((uid) => !gestoresUids.includes(uid));

    if (uidsNuevos.length) {
      actualizarGestores([...gestoresUids, ...uidsNuevos]);
      setEstadoAlertaUid(true);
      setAlertaUid({
        tipo: 'exito',
        mensaje: `Se agregaron ${uidsNuevos.length} usuario(s) correctamente.`
      });
    }

    setMostrarModalUsuarios(false);
  };

  const handleEliminarUsuario = (uid) => {
    if (creador?.uid === uid) return;
    actualizarGestores(gestoresUids.filter((x) => x !== uid));
  };

  return (
    <ContenedorCentral>
      <SeccionIzquierda>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#4f46e5' }}>{proyecto.nombreProyecto}</h2>
          <p style={{ fontStyle: 'italic', color: '#777' }}>
            {formatearFecha(proyecto.fechaCreado)}
          </p>
        </div>

        <Tarjeta color="#e0e0e0" style={{ marginBottom: '2rem' }}>
          <Etiqueta>Descripción</Etiqueta>
          <Valor>{proyecto.descripcion}</Valor>
        </Tarjeta>

        <DetallesGrid>
          {[
            { etiqueta: 'Tamaño', valor: proyecto.tamanioProyecto },
            { etiqueta: 'Complejidad y Riesgos', valor: proyecto.complejoRiesgos },
            { etiqueta: 'Presencia del Cliente', valor: proyecto.presenciaCliente },
            { etiqueta: 'Iterativo', valor: proyecto.iterativoProyecto },
            { etiqueta: 'Tipo', valor: proyecto.tipoProyecto },
            { etiqueta: 'Metodología', valor: proyecto.metodologiaProyecto },
          ].map((item, i) => (
            <Tarjeta key={i} color={['#4f46e5','#059669','#2563eb','#d97706','#dc2626','#7c3aed'][i % 6]}>
              <Etiqueta>{item.etiqueta}</Etiqueta>
              <Valor>{item.valor}</Valor>
            </Tarjeta>
          ))}
        </DetallesGrid>

        {creador && (
          <Tarjeta color="#7c3aed" style={{ marginTop: '2rem' }}>
            <Etiqueta>Creador del Proyecto</Etiqueta>
            <Valor>{creador.nombre} – {creador.correo}</Valor>
          </Tarjeta>
        )}
      </SeccionIzquierda>

      <SeccionDerecha>
        <h3>Gestores Asignados</h3>
        {gestores.map((g) => {
          const esCreador = creador?.uid === g.uid;
          return (
            <TarjetaGestor key={g.uid}>
              <NombreGestor>
                {g.nombre}{esCreador && <EtiquetaCreador>Creador</EtiquetaCreador>}
              </NombreGestor>
              <InfoGestor><strong>Correo:</strong> {g.correo}</InfoGestor>
              <InfoGestor><strong>Área:</strong> {g.area}</InfoGestor>
              {!esCreador && (
                <BotonEliminar disabled={loading} onClick={() => handleEliminarUsuario(g.uid)}>
                  {loading ? <Spinner /> : 'Eliminar'}
                </BotonEliminar>
              )}
            </TarjetaGestor>
          );
        })}

        <BotonAbrirListaUsuarios onClick={() => setMostrarModalUsuarios(true)} disabled={loading}>
          Lista de Usuarios con Grupos común
        </BotonAbrirListaUsuarios>

        <Input
          type="text"
          value={usuarioNuevo}
          onChange={(e) => setUsuarioNuevo(e.target.value)}
          placeholder="UID del nuevo gestor"
          disabled={loading}
        />
        <BotonAgregar disabled={loading} onClick={handleAgregarUsuario}>
          {loading ? <Spinner /> : 'Agregar Gestor'}
        </BotonAgregar>

        <Alerta
          tipo={alertaUid.tipo}
          mensaje={alertaUid.mensaje}
          estadoAlerta={estadoAlertaUid}
          cambiarEstadoAlerta={setEstadoAlertaUid}
        />
      </SeccionDerecha>

      {mostrarModalUsuarios && (
        <ListaUsuariosModal
          existingUids={gestoresUids}
          closeModal={handleAgregarDesdeModal}
        />
      )}
    </ContenedorCentral>
  );
};

export default DetallesProyecto;
