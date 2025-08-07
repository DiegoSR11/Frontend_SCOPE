import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import WebFont from 'webfontloader';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import InicioSesion from './componentes/InicioSesion';
import EditarGasto from './componentes/EditarGasto';
import EditarGrupo from './componentes/EditarGrupo';
import EditarTarea from './componentes/EditarTarea';
import EditarRiesgo from './componentes/EditarRiesgo';
import VerProyecto from './componentes/VerProyecto';
import GastosPorCategoria from './componentes/GastosPorCategoria';
//import ListaDeGastos from './componentes/ListaDeGastos';
import ListaDeProyectos from './componentes/ListaDeProyectos';
//import FormularioGasto from './componentes/FormularioGasto';
import FormularioProyecto from './componentes/FormularioProyecto';
import FormularioTarea from './componentes/FormularioTarea';
import FormularioRiesgo from './componentes/FormularioRiesgo';
import FormularioGrupo from './componentes/FormularioGrupo';
import RegistroUsuarios from './componentes/RegistroUsuarios';
import Inicio from './componentes/Inicio';
import { Helmet } from 'react-helmet';
import favicon from './imagenes/logo.png'
import Fondo from './elementos/Fondo';
import { AuthProvider } from './contextos/AuthContext';
import RutaPrivada from './componentes/RutaPrivada';
import PerfilUsuario from './componentes/PerfilUsuario';
import ListaDeGrupos from './componentes/ListaDeGrupos';
import EditarProyecto from './componentes/EditarProyecto';
import MetodologiaSelector from './componentes/MetodologiaSelector';
import CrearProyectoHibrido from './componentes/CrearProyectoHibrido';

WebFont.load({
  google: {
    families: ['Work Sans:400,500,700', 'sans-serif']
  }
});

const Index = () => {
  return (
    <>
      <Helmet>
        <link rel="shortcut icon" href={favicon} type="image/x-icon"/>
      </Helmet>

      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path='/iniciar-sesion' element={<InicioSesion/>}/>
            <Route path='/crear-cuenta' element={<RegistroUsuarios/>}/>
            <Route path='/editar-usuario/:id' element={
              <RutaPrivada>
                <RegistroUsuarios />
              </RutaPrivada>
            }/>
            <Route
              path="/proyecto/:id/metodologia"
              element={<RutaPrivada><MetodologiaSelector/></RutaPrivada>}
            />
            <Route
              path="/formulario/hibrido"
              element={<RutaPrivada><CrearProyectoHibrido/></RutaPrivada>}
            />
            <Route path='/categorias' element={
              <RutaPrivada>
                <GastosPorCategoria />
              </RutaPrivada>
            }/>
            <Route path='/grupos' element={
              <RutaPrivada>
                <ListaDeGrupos />
              </RutaPrivada>
            }/>
            <Route path='/inicio' element={
              <RutaPrivada>
                <Inicio />
              </RutaPrivada>
            }/>
            <Route path='/usuario/:id' element={
              <RutaPrivada>
                <PerfilUsuario />
              </RutaPrivada>
            }/>

            <Route path='/lista' element={
              <RutaPrivada>
                <ListaDeProyectos />
              </RutaPrivada>                
            }/>
            <Route path='/formulario' element={
              <RutaPrivada>
                <FormularioProyecto />
              </RutaPrivada>                
            }/>
            
            <Route path='/agregarGrupo' element={
              <RutaPrivada>
                <FormularioGrupo />
              </RutaPrivada>
            }/>
            <Route path='/editarGrupo/:id' element={
              <RutaPrivada>
                <EditarGrupo />
              </RutaPrivada>
            }/>
            <Route path='/editarTarea/:idProyecto/:idTarea' element={
              <RutaPrivada>
                <EditarTarea />
              </RutaPrivada>
            }/>
            <Route path='/editarRiesgo/:idProyecto/:idRiesgo' element={
              <RutaPrivada>
                <EditarRiesgo />
              </RutaPrivada>
            }/>
            <Route path='/editarProyecto/:id' element={
              <RutaPrivada>
                <EditarProyecto />
              </RutaPrivada>
            }/>
            <Route path='/editar/:id' element={
              <RutaPrivada>
                <EditarGasto />
              </RutaPrivada>
            }/>
            <Route path='/proyecto/:id' element={
              <RutaPrivada>
                <VerProyecto />
              </RutaPrivada>
             }/>
            <Route path='/agregarTarea/:id' element={
              <RutaPrivada>
                <FormularioTarea />
              </RutaPrivada>
            }/>
            <Route path='/agregarRiesgo/:id' element={
              <RutaPrivada>
                <FormularioRiesgo />
              </RutaPrivada>
            }/>
            <Route path='/' element={
                <App />
            }/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>

      <Fondo />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);
