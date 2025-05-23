import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from './imagenes/logo.png';

const LandingWrapper = styled.div`
  width: 100%;
  font-family: 'Segoe UI', sans-serif;
  overflow-x: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const LogoImg = styled.img`
  height: 60px;
`;

const BotonLogin = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: #00a9ff;
  color: white;
  border-radius: 0.5rem;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.3s ease;

  &:hover {
    background-color: #008ecf;
  }
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  background-color: #00a9ff;
  color: white;
  text-align: center;
`;

const Titulo = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Descripcion = styled.p`
  font-size: 1.25rem;
  max-width: 800px;
  margin-bottom: 2rem;
`;

const Seccion = styled.section`
  padding: 4rem 2rem;
  text-align: center;
  background-color: ${({ fondo }) => fondo || 'white'};
`;

const Subtitulo = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #00a9ff;
`;

const Parrafo = styled.p`
  font-size: 1.1rem;
  max-width: 900px;
  margin: 0 auto 1.5rem;
  color: #333;
`;

const App = () => {
  return (
    <>
      <Helmet>
        <title>SCOPE - Plataforma Inteligente</title>
      </Helmet>

      <LandingWrapper>
        <Header>
          <div></div> {/* Espacio vacío para alinear el login a la derecha */}
          <BotonLogin to="/iniciar-sesion">Iniciar sesión</BotonLogin>
        </Header>

        <Hero>
          <LogoImg src={logo} alt="Logo SCOPE" style={{ height: '120px', marginBottom: '2rem' }} />
          <Titulo>Optimiza tus proyectos TI con IA</Titulo>
          <Descripcion>
            SCOPE combina Inteligencia Artificial generativa y buenas prácticas de gestión para ayudarte a tomar decisiones, organizar tareas y prevenir riesgos en tus proyectos de desarrollo.
          </Descripcion>
          <BotonLogin to="/iniciar-sesion">¡Empieza gratis ahora!</BotonLogin>
        </Hero>

        <Seccion>
          <Subtitulo>¿Quiénes somos?</Subtitulo>
          <Parrafo>
            Un equipo apasionado por la tecnología y la gestión de proyectos. Creamos SCOPE para ayudarte a trabajar más inteligentemente, reduciendo errores y aumentando la productividad con IA.
          </Parrafo>
        </Seccion>

        <Seccion>
          <Subtitulo>¿Cómo funcionamos?</Subtitulo>
          <Parrafo>
            Ingresas los detalles de tu proyecto, y SCOPE analiza automáticamente los datos para asignar la mejor metodología, sugerir tareas y detectar riesgos. Todo con apoyo de IA y recomendaciones personalizadas.
          </Parrafo>
        </Seccion>

        <Seccion>
          <Subtitulo>¿Cómo se usa la aplicación?</Subtitulo>
          <Parrafo>
            1. Regístrate. <br />
            2. Crea tu proyecto. <br />
            3. Deja que la IA te recomiende cómo gestionarlo. <br />
            4. Agrega tareas, analiza riesgos y sigue el progreso. <br />
          </Parrafo>
        </Seccion>

        <footer style={{ textAlign: 'center', padding: '2rem', color: '#777' }}>
          SCOPE · Idea innovadora 2025
        </footer>
      </LandingWrapper>
    </>
  );
};


export default App;
