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
import editarGrupo from '../firebase/editarGrupo';  // Importar la función editarGrupo
import agregarGrupo from '../firebase/agregarGrupo';
const COLOR_PRINCIPAL = '#00A9FF';

const ContenedorPrincipal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f0f8ff;
`;

const FormularioEstilizado = styled(Formulario)`
  max-width: 700px;
  width: 100%;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 169, 255, 0.2);
`;

const InputEstilizado = styled(Input)`
  margin-bottom: 1rem;
  padding: 14px;
  border-radius: 8px;
  border: 2px solid #dcefff;
  font-size: 1rem;
  width: 100%;
  transition: border-color 0.3s;

  &:focus {
    border-color: ${COLOR_PRINCIPAL};
    outline: none;
  }
`;

const ContenedorFiltrosEstilizado = styled(ContenedorFiltros)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BotonPrimario = styled(Boton)`
  background-color: ${COLOR_PRINCIPAL};
  color: white;
  font-size: 1rem;
  border-radius: 8px;
  transition: background-color 0.3s;
  margin: 1rem;
  height: 1.5rem;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #008bd1;
  }
`;

const ListaMiembros = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const ItemMiembro = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e6f7ff;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 0.5rem;
`;

const BotonEliminar = styled.button`
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #cc0000;
  }
`;

const BotonCancelar = styled.button`
  background: #fff;
  border: 1px solid #ccc;
  color: #333;
  padding: 0.75rem 0.5rem;
  margin: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 8px;
  font-family: 'Work Sans', sans-serif;
  transition: all 0.3s;

  &:hover {
    background-color: #f5f5f5;
  }

`;

const FormularioGrupo = ({ grupo }) => {
    const [nombreGrupo, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [miembroInput, setMiembroInput] = useState('');
    const [miembros, setMiembros] = useState([]);
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const creadoPor = !grupo || (grupo.creadoPor === usuario.uid);


    useEffect(() => {
        const cargarMiembrosIniciales = async () => {
            if (grupo) {
                setNombre(grupo.nombreGrupo || '');
                setDescripcion(grupo.descripcion || '');

                const uidsMiembros = grupo.miembros || [];
                const miembrosCargados = [];

                // Recorremos todos los UIDs del grupo
                for (const uid of uidsMiembros) {
                    try {
                        const docRef = doc(db, 'usuarios', uid);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            const data = docSnap.data();
                            miembrosCargados.push({
                                uid,
                                nombre: data.nombre || 'Sin nombre',
                                correo: data.correo || 'Sin correo'
                            });
                        }
                    } catch (error) {
                        console.error(`Error al obtener datos del usuario con UID ${uid}:`, error);
                    }
                }

                setMiembros(miembrosCargados);
            } else {
                // Si es un nuevo grupo, solo cargamos al creador
                const docRef = doc(db, 'usuarios', usuario.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const creador = {
                        uid: usuario.uid,
                        nombre: data.nombre || 'Sin nombre',
                        correo: data.correo || 'Sin correo'
                    };
                    setMiembros([creador]);
                }
            }
        };

        cargarMiembrosIniciales();
    }, [grupo, usuario.uid]);

    const handleAgregarMiembro = async () => {
        const uid = miembroInput.trim();
        // Verificamos si el UID está vacío o si ya está en la lista
        if (!uid) return;
        if (miembros.some(m => m.uid === uid)) {
            cambiarAlerta({ tipo: 'error', mensaje: 'Este usuario ya está agregado.' });
            cambiarEstadoAlerta(true);
            setMiembroInput(''); // Limpiar el campo de UID
            return; // Salir si el miembro ya está en la lista
        }
    
        try {
            const docRef = doc(db, 'usuarios', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const nuevoMiembro = {
                    uid,
                    nombre: data.nombre || 'Sin nombre',
                    correo: data.correo || 'Sin correo'
                };
                setMiembros([...miembros, nuevoMiembro]);
                setMiembroInput(''); // Limpiar el campo de UID
            } else {
                cambiarAlerta({ tipo: 'error', mensaje: 'No se encontró un usuario con ese UID.' });
                cambiarEstadoAlerta(true);
            }
        } catch (error) {
            cambiarAlerta({ tipo: 'error', mensaje: 'Error al buscar el usuario.' });
            cambiarEstadoAlerta(true);
        }
    };
    

    const handleEliminarMiembro = (uid) => {
        if (uid === usuario.uid) return;
        setMiembros(miembros.filter(m => m.uid !== uid));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nombreGrupo.trim() === '' || miembros.length === 0) {
            cambiarAlerta({ tipo: 'error', mensaje: 'Nombre del grupo y al menos un miembro son obligatorios.' });
            cambiarEstadoAlerta(true);
            return;
        }

        try {
            const miembrosUIDs = miembros.map(m => m.uid);

            if (grupo) {
                // Actualizar grupo existente
                await editarGrupo({
                    id: grupo.id,
                    nombreGrupo: nombreGrupo,
                    descripcion,
                    miembros: miembrosUIDs
                });
                cambiarAlerta({ tipo: 'exito', mensaje: 'Grupo actualizado correctamente' });
            } else {
                // Crear grupo nuevo
                await agregarGrupo({
                    nombreGrupo: nombreGrupo,
                    descripcion,
                    fechaCreado: new Date(),
                    uidUsuario: usuario.uid,
                    miembros: miembrosUIDs
                });
                cambiarAlerta({ tipo: 'exito', mensaje: 'Grupo creado correctamente' });
            }

            cambiarEstadoAlerta(true);
            setTimeout(() => navigate('/grupos'), 1500);
        } catch (error) {
            console.error(error);
            cambiarAlerta({ tipo: 'error', mensaje: 'Hubo un problema al guardar el grupo.' });
            cambiarEstadoAlerta(true);
        }
    };

    return (
        <div>
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
                    onChange={e => setNombre(e.target.value)}
                    disabled={!creadoPor} // Bloquear input si no es el creador
                />
                <InputEstilizado
                    as="textarea"
                    placeholder="Descripción del grupo (opcional)"
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    disabled={!creadoPor} // Bloquear input si no es el creador
                />

                {/* Siempre mostrar la lista de miembros */}
                <ListaMiembros>
                    {miembros.map((miembro, index) => (
                        <ItemMiembro key={miembro.uid || index}>
                            <span>{miembro.nombre} ({miembro.correo})</span>
                            {miembro.uid !== usuario.uid && creadoPor && (  // Solo permitir eliminar si es el creador
                                <BotonEliminar onClick={() => handleEliminarMiembro(miembro.uid)}>
                                    Eliminar
                                </BotonEliminar>
                            )}
                        </ItemMiembro>
                    ))}
                </ListaMiembros>

                {/* Mostrar los controles de edición solo si el usuario es el creador */}
                {creadoPor && (
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

                        <BotonPrimario as="button" type="submit">
                            {grupo ? 'Actualizar Grupo' : 'Crear Grupo'}
                        </BotonPrimario>
                        <BotonCancelar type="button" onClick={() => navigate(-1)}>
                            Cancelar
                        </BotonCancelar>
                    </>
                )}
            </FormularioEstilizado>
            </ContenedorPrincipal>
            <Alerta tipo={alerta.tipo} mensaje={alerta.mensaje} estadoAlerta={estadoAlerta} cambiarEstadoAlerta={cambiarEstadoAlerta} />
        </div>
    );
};

export default FormularioGrupo;
