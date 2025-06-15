import React, { useState, useEffect } from 'react';
import { ContenedorFiltros, Formulario, Input } from './../elementos/ElementosDeFormulario';
import Boton from './../elementos/Boton';
import { useAuth } from '../contextos/AuthContext';
import Alerta from './../elementos/Alerta';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { Header, Titulo } from './../elementos/Header';
import BtnRegresar from "./../elementos/BtnRegresar";
import { db } from "../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import styled from 'styled-components';
import editarGrupo from '../firebase/editarGrupo';
import agregarGrupo from '../firebase/agregarGrupo';

const COLOR_PRINCIPAL = '#00A9FF';

const ContenedorPrincipal = styled.div`
  display: flex; flex-direction: column; align-items: center;
  padding: 2rem; background-color: #f0f8ff;
`;

const FormularioEstilizado = styled(Formulario)`
  max-width: 700px; width: 100%; background: white;
  padding: 2rem; border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 169, 255, 0.2);
`;

const InputEstilizado = styled(Input)`
  margin-bottom: 1rem; padding: 14px; border-radius: 8px;
  border: 2px solid #dcefff; font-size: 1rem; width: 100%;
  text-transform: capitalize;
  transition: border-color 0.3s;
  &:focus { border-color: ${COLOR_PRINCIPAL}; outline: none; }
`;

const ContenedorFiltrosEstilizado = styled(ContenedorFiltros)`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem;
`;

const BotonPrimario = styled(Boton)`
  background-color: ${COLOR_PRINCIPAL}; color: white;
  font-size: 1rem; border-radius: 8px; padding: 0.5rem 1rem;
  transition: background-color 0.3s;
  &:hover { background-color: #008bd1; }
`;

const BotonSalir = styled(BotonPrimario)`
  background-color: #ef4444;
  &:hover { background-color: #dc2626; }
`;

const ListaMiembros = styled.ul`
  list-style: none; padding: 0; width: 100%; margin-bottom: 1rem;
`;

const ItemMiembro = styled.li`
  display: flex; justify-content: space-between; align-items: center;
  background: #e6f7ff; padding: 0.75rem 1rem; border-radius: 6px;
  margin-bottom: 0.5rem;
`;

const BotonEliminar = styled.button`
  background: #ff4d4f; color: white; border: none;
  padding: 0.5rem 0.75rem; border-radius: 6px; cursor: pointer;
  &:hover { background: #cc0000; }
`;

const BotonesInferiores = styled.div`
  display: flex; justify-content: space-between; gap: 1rem; margin-top: 1.5rem;
`;

const BotonCancelar = styled.button`
  background: #fff; border: 1px solid #ccc; color: #333;
  padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;
  &:hover { background: #f5f5f5; }
`;

// Modal estilos (copiado de ListaDeGrupos)
const FondoModal = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); display: flex;
  justify-content: center; align-items: center; z-index: 999;
`;
const ModalConfirmacion = styled.div`
  background: white; padding: 2rem; border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2); max-width: 400px;
  width: 100%; text-align: center;
`;

const FormularioGrupo = ({ grupo }) => {
  const [nombreGrupo, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [miembroInput, setMiembroInput] = useState('');
  const [miembros, setMiembros] = useState([]);
  const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
  const [alerta, cambiarAlerta] = useState({});
  const [mostrarConfirmSalir, setMostrarConfirmSalir] = useState(false);

  const { usuario } = useAuth();
  const navigate = useNavigate();

  const creadoPor = !grupo || grupo.creadoPor === usuario.uid;

  useEffect(() => {
    const cargarMiembros = async () => {
      if (grupo) {
        setNombre(grupo.nombreGrupo);
        setDescripcion(grupo.descripcion || '');
        const uids = grupo.miembros || [];
        const carg = [];
        for (const uid of uids) {
          const snap = await getDoc(doc(db, 'usuarios', uid));
          if (snap.exists()) {
            const d = snap.data();
            carg.push({ uid, nombre: d.nombre, correo: d.correo });
          }
        }
        setMiembros(carg);
      } else {
        const snap = await getDoc(doc(db, 'usuarios', usuario.uid));
        if (snap.exists()) {
          const d = snap.data();
          setMiembros([{ uid: usuario.uid, nombre: d.nombre, correo: d.correo }]);
        }
      }
    };
    cargarMiembros();
  }, [grupo, usuario.uid]);

  const handleAgregarMiembro = async () => {
    const uid = miembroInput.trim();
    if (!uid) return;
    if (miembros.some(m => m.uid === uid)) {
      cambiarAlerta({ tipo: 'error', mensaje: 'Usuario ya agregado.' });
      cambiarEstadoAlerta(true);
      setMiembroInput('');
      return;
    }
    try {
      const snap = await getDoc(doc(db, 'usuarios', uid));
      if (snap.exists()) {
        const d = snap.data();
        setMiembros([...miembros, { uid, nombre: d.nombre, correo: d.correo }]);
        cambiarAlerta({ tipo: 'exito', mensaje: 'Usuario agregado.' });
      } else {
        cambiarAlerta({ tipo: 'error', mensaje: 'UID no encontrado.' });
      }
    } catch {
      cambiarAlerta({ tipo: 'error', mensaje: 'Error al buscar usuario.' });
    }
    cambiarEstadoAlerta(true);
    setMiembroInput('');
  };

  const handleEliminarMiembro = uid => {
    setMiembros(miembros.filter(m => m.uid !== uid));
  };

  const confirmarSalir = () => setMostrarConfirmSalir(true);

  const handleSalirGrupo = async () => {
    setMostrarConfirmSalir(false);
    const nuevos = miembros.filter(m => m.uid !== usuario.uid).map(m => m.uid);
    try {
      await editarGrupo({ id: grupo.id, nombreGrupo, descripcion, miembros: nuevos });
      cambiarAlerta({ tipo: 'exito', mensaje: 'Has salido del grupo.' });
      cambiarEstadoAlerta(true);
      setTimeout(() => navigate('/grupos'), 1000);
    } catch {
      cambiarAlerta({ tipo: 'error', mensaje: 'Error al salir.' });
      cambiarEstadoAlerta(true);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!nombreGrupo.trim() || miembros.length === 0) {
      cambiarAlerta({ tipo: 'error', mensaje: 'Nombre y al menos un miembro son obligatorios.' });
      cambiarEstadoAlerta(true);
      return;
    }
    try {
      const uids = miembros.map(m => m.uid);
      if (grupo) {
        await editarGrupo({ id: grupo.id, nombreGrupo, descripcion, miembros: uids });
        cambiarAlerta({ tipo: 'exito', mensaje: 'Grupo actualizado.' });
      } else {
        await agregarGrupo({ nombreGrupo, descripcion, fechaCreado: new Date(), uidUsuario: usuario.uid, miembros: uids });
        cambiarAlerta({ tipo: 'exito', mensaje: 'Grupo creado.' });
      }
      cambiarEstadoAlerta(true);
      setTimeout(() => navigate('/grupos'), 1500);
    } catch {
      cambiarAlerta({ tipo: 'error', mensaje: 'Error al guardar.' });
      cambiarEstadoAlerta(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>{grupo ? 'Editar Grupo' : 'Nuevo Grupo'}</title>
      </Helmet>
      <Header>
        <BtnRegresar />
        <Titulo>{grupo ? 'Editar Grupo' : 'Nuevo Grupo'}</Titulo>
      </Header>

      <ContenedorPrincipal>
        <FormularioEstilizado onSubmit={handleSubmit}>
          <InputEstilizado
            type="text"
            placeholder="Nombre del grupo"
            value={nombreGrupo}
            onChange={e => setNombre(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
            disabled={!creadoPor}
          />
          <InputEstilizado
            as="textarea"
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
            disabled={!creadoPor}
          />

          <ListaMiembros>
            {miembros.map(m => (
              <ItemMiembro key={m.uid}>
                <span>{m.nombre} ({m.correo})</span>
                {creadoPor ? (
                  m.uid !== usuario.uid && (
                    <BotonEliminar onClick={() => handleEliminarMiembro(m.uid)}>
                      Eliminar
                    </BotonEliminar>
                  )
                ) : null}
              </ItemMiembro>
            ))}
          </ListaMiembros>

          {creadoPor ? (
            <>
              <ContenedorFiltrosEstilizado>
                <InputEstilizado
                  type="text"
                  placeholder="UID del miembro"
                  value={miembroInput}
                  onChange={e => setMiembroInput(e.target.value)}
                />
                <BotonPrimario type="button" onClick={handleAgregarMiembro}>
                  Agregar
                </BotonPrimario>
              </ContenedorFiltrosEstilizado>

              <BotonesInferiores>
                <BotonCancelar type="button" onClick={() => navigate(-1)}>
                  Cancelar
                </BotonCancelar>
                <BotonPrimario as="button" type="submit">
                  {grupo ? 'Actualizar Grupo' : 'Crear Grupo'}
                </BotonPrimario>
              </BotonesInferiores>
            </>
          ) : (
            <BotonesInferiores>
              <BotonCancelar type="button" onClick={() => navigate(-1)}>
                Volver
              </BotonCancelar>
              <BotonSalir type="button" onClick={confirmarSalir}>
                Salir del Grupo
              </BotonSalir>
            </BotonesInferiores>
          )}
        </FormularioEstilizado>
      </ContenedorPrincipal>

      {mostrarConfirmSalir && (
        <FondoModal>
          <ModalConfirmacion>
            <p>¿Estás seguro de que deseas salir de este grupo?</p>
            <div style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1rem",
              justifyContent: "center"
            }}>
              <button
                onClick={handleSalirGrupo}
                style={{
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Sí, salir
              </button>
              <button
                onClick={() => setMostrarConfirmSalir(false)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
            </div>
          </ModalConfirmacion>
        </FondoModal>
      )}

      <Alerta
        tipo={alerta.tipo}
        mensaje={alerta.mensaje}
        estadoAlerta={estadoAlerta}
        cambiarEstadoAlerta={cambiarEstadoAlerta}
      />
    </>
  );
};

export default FormularioGrupo;
