import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from './../contextos/AuthContext';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import grupo from './../imagenes/grupo.png';
import logo from './../imagenes/logo-celeste.png';
import { Header, ContenedorBotones, ContenedorLogo, LogoImg } from './../elementos/Header';
import BotonCerrarSesion from './../elementos/BotonCerrarSesion';
import Alerta from '../elementos/Alerta';
import { Mail, Phone, Building2, Briefcase, Globe, MapPin, Pencil } from 'lucide-react';
import Cargando from "./../elementos/Cargando";

// Botón Editar Perfil estilizado
const BotonEditarPerfil = styled(Link)`
  background: linear-gradient(90deg, #2196f3, #00bcd4);
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 1.5rem;
  padding: 0.5rem 1.3rem;
  font-size: 1rem;
  margin-left: 1.3rem;
  margin-right: 0.5rem;
  box-shadow: 0 2px 10px #0d47a11a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: background 0.16s, transform 0.12s;
  &:hover {
    background: linear-gradient(90deg, #1976d2, #00acc1);
    transform: scale(1.04);
  }
`;

const ContenedorPerfil = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;

const Titulo = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #00A9FF;
  text-align: center;
`;

const DatosGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TarjetaDato = styled.div`
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  gap: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const Icono = styled.div`
  color: #00A9FF;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextoDato = styled.div`
  display: flex;
  flex-direction: column;
  span {
    font-size: 0.85rem;
    color: #666;
  }
  strong {
    font-size: 1rem;
    color: #222;
  }
`;

const PerfilUsuario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { usuario } = useAuth();

  const [usuarioData, setUsuarioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estadoAlerta, setEstadoAlerta] = useState(false);
  const [alerta, setAlerta] = useState({});

  const [mostrarUID, setMostrarUID] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!usuario) {
      navigate('/iniciar-sesion');
      return;
    }
    if (id !== usuario.uid) {
      setAlerta({ tipo: 'error', mensaje: 'No tienes permiso para ver este perfil.' });
      setEstadoAlerta(true);
      navigate('/inicio');
      return;
    }
    const obtenerUsuario = async () => {
      try {
        const usuarioRef = doc(db, 'usuarios', id);
        const docSnap = await getDoc(usuarioRef);
        if (docSnap.exists()) {
          setUsuarioData(docSnap.data());
        } else {
          setAlerta({ tipo: 'error', mensaje: 'No se encontró el usuario' });
          setEstadoAlerta(true);
        }
      } catch (error) {
        setAlerta({ tipo: 'error', mensaje: 'Error al obtener los datos del usuario' });
        setEstadoAlerta(true);
      } finally {
        setLoading(false);
      }
    };
    obtenerUsuario();
  }, [id, usuario, navigate]);

  const copiarUID = async () => {
    try {
      await navigator.clipboard.writeText(usuario.uid);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (error) {
      console.error("Error al copiar el UID:", error);
    }
  };

  if (loading) return <Cargando />;
  if (!usuarioData) return <div>No se encontraron datos del usuario</div>;

  return (
    <>
      <Helmet>
        <title>Perfil de Usuario</title>
      </Helmet>

      <Header>
        <ContenedorLogo>
          <Link to="/inicio">
            <LogoImg src={logo} alt="Logo" />
          </Link>
        </ContenedorLogo>

        {usuario && (
          <ContenedorLogo style={{ marginLeft: 'auto' }}>
            <Link to="/grupos">
              <LogoImg src={grupo} alt="Equipos" />
            </Link>
          </ContenedorLogo>
        )}

        {/* Botón Editar Perfil */}
        <BotonEditarPerfil to={`/editar-usuario/${usuario?.uid}`}>
          <Pencil size={18} style={{ marginRight: 5 }} />
          Editar perfil
        </BotonEditarPerfil>

        <ContenedorBotones>
          <BotonCerrarSesion />
        </ContenedorBotones>
      </Header>

      <ContenedorPerfil>
        <Titulo>{usuarioData.nombre} {usuarioData.apellido}</Titulo>
        <div style={{ margin: '0.5rem', textAlign: 'center' }}>
          <button
            onClick={() => setMostrarUID(!mostrarUID)}
            style={{
              backgroundColor: '#00A9FF',
              color: '#fff',
              border: 'none',
              borderRadius: '1rem',
              padding: '0.5rem 1.0rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              margin: '1rem'
            }}
          >
            {mostrarUID ? 'Ocultar UID' : 'Mostrar UID'}
          </button>

          {mostrarUID && (
            <div
              onClick={copiarUID}
              style={{
                backgroundColor: '#f0f0f0',
                padding: '0.5rem',
                borderRadius: '1rem',
                cursor: 'pointer',
                display: 'inline-block',
                userSelect: 'none',
                fontFamily: 'monospace'
              }}
              title="Haz clic para copiar"
            >
              {usuario.uid}
            </div>
          )}

          {copiado && (
            <div style={{
              position: 'fixed',
              top: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#e6ffe6',
              color: 'green',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 9999,
              fontWeight: 'bold'
            }}>
              UID copiado al portapapeles ✅
            </div>
          )}
        </div>
        <DatosGrid>
          <TarjetaDato>
            <Icono><Mail size={20} /></Icono>
            <TextoDato>
              <span>Correo</span>
              <strong>{usuarioData.correo}</strong>
            </TextoDato>
          </TarjetaDato>
          <TarjetaDato>
            <Icono><Phone size={20} /></Icono>
            <TextoDato>
              <span>Celular</span>
              <strong>{usuarioData.celular}</strong>
            </TextoDato>
          </TarjetaDato>
          <TarjetaDato>
            <Icono><Building2 size={20} /></Icono>
            <TextoDato>
              <span>Empresa</span>
              <strong>{usuarioData.empresa}</strong>
            </TextoDato>
          </TarjetaDato>
          <TarjetaDato>
            <Icono><Briefcase size={20} /></Icono>
            <TextoDato>
              <span>Área / Puesto</span>
              <strong>{usuarioData.area} - {usuarioData.rol}</strong>
            </TextoDato>
          </TarjetaDato>
          <TarjetaDato>
            <Icono><Globe size={20} /></Icono>
            <TextoDato>
              <span>País</span>
              <strong>{usuarioData.pais}</strong>
            </TextoDato>
          </TarjetaDato>
          <TarjetaDato>
            <Icono><MapPin size={20} /></Icono>
            <TextoDato>
              <span>Departamento</span>
              <strong>{usuarioData.departamento}</strong>
            </TextoDato>
          </TarjetaDato>
        </DatosGrid>

        <Alerta
          tipo={alerta.tipo}
          mensaje={alerta.mensaje}
          estadoAlerta={estadoAlerta}
          cambiarEstadoAlerta={setEstadoAlerta}
        />
      </ContenedorPerfil>
    </>
  );
};

export default PerfilUsuario;
