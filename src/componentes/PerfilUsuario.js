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

const BotonAccionPerfil = styled.button`
  background: #00A9FF;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 1rem;
  padding: 0.5rem 1.0rem;
  font-size: 1rem;
  min-width: 140px;
  cursor: pointer;
  transition: background 0.14s, transform 0.13s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 2px 10px #0d47a11a;
  &:hover {
    background: #008fcc;
    transform: scale(1.04);
  }
  &:active {
    background: #007BB5;
    transform: scale(0.98);
  }
`;

const BotonEditarPerfil = styled(Link)`
  background: #00A9FF;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 1rem;
  padding: 0.5rem 1.0rem;
  font-size: 1rem;
  min-width: 140px;
  cursor: pointer;
  transition: background 0.14s, transform 0.13s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 2px 10px #0d47a11a;
  text-decoration: none;
  &:hover {
    background: #008fcc;
    transform: scale(1.04);
  }
  &:active {
    background: #007BB5;
    transform: scale(0.98);
  }
`;

// Agrupa los botones en horizontal y centra el UID debajo
const BotoneraPerfil = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.1rem;
`;

const FilaBotones = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.9rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.4rem;
`;

const UidBox = styled.div`
  background-color: #f0f0f0;
  padding: 0.5rem 1.2rem;
  border-radius: 1rem;
  cursor: pointer;
  display: inline-block;
  user-select: none;
  font-family: monospace;
  font-size: 1rem;
  margin-top: 0.1rem;
  transition: box-shadow 0.18s;
  box-shadow: 0 2px 10px #00a9ff33;
  &:hover {
    box-shadow: 0 4px 18px #00a9ff33;
  }
`;

const BotonHeaderConTexto = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  margin-right: 1.7rem;
`;

const ContenedorPerfil = styled.div`
  max-width: 800px;
  margin: 1rem auto;
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

const IconoHeader = styled.img`
  width: 3rem;
  height: auto;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
  @media (max-width: 600px) {
    width: 2.5rem;
  }
`;

const TextoDebajoHeader = styled.span`
  color: #222;
  font-size: 0.75rem;
  font-weight: 400;
  margin-top: 0.09rem;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 1rem;
`;

const IconLabel = styled.span`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #555;
`;

const StyledCerrarSesionButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.12s;
  &:hover {
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.97);
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
        {/* Logo Inicio */}
        <ContenedorLogo>
          <BotonHeaderConTexto to="/inicio">
            <IconoHeader src={logo} alt="Inicio" />
            <TextoDebajoHeader>Inicio</TextoDebajoHeader>
          </BotonHeaderConTexto>
        </ContenedorLogo>

        {/* Grupos */}
        {usuario && (
          <ContenedorLogo style={{ marginLeft: 'auto' }}>
            <BotonHeaderConTexto to="/grupos">
              <IconoHeader src={grupo} alt="Grupos" />
              <TextoDebajoHeader>Grupos</TextoDebajoHeader>
            </BotonHeaderConTexto>
          </ContenedorLogo>
        )}

        {/* Botón Cerrar Sesión con animación y texto debajo */}
        <ContenedorBotones>
          <IconWrapper>
            <StyledCerrarSesionButton>
              <BotonCerrarSesion />
              <IconLabel>Cerrar sesión</IconLabel>
            </StyledCerrarSesionButton>
          </IconWrapper>
        </ContenedorBotones>
      </Header>

      <ContenedorPerfil>
        <Titulo>{usuarioData.nombre} {usuarioData.apellido}</Titulo>
        
        {/* Botonera: botones juntos y UID debajo */}
        <BotoneraPerfil>
          <FilaBotones>
            <BotonAccionPerfil
              onClick={() => setMostrarUID(!mostrarUID)}
              type="button"
            >
              {mostrarUID ? 'Ocultar UID' : 'Mostrar UID'}
            </BotonAccionPerfil>

            <BotonEditarPerfil to={`/editar-usuario/${usuario?.uid}`}>
              <Pencil size={18} style={{ marginRight: 5 }} />
              Editar perfil
            </BotonEditarPerfil>
          </FilaBotones>

          {mostrarUID && (
            <UidBox onClick={copiarUID} title="Haz clic para copiar">
              {usuario.uid}
            </UidBox>
          )}
        </BotoneraPerfil>

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
