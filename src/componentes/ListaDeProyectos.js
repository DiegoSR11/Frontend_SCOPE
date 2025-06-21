import React, { useEffect, useState } from "react";
import { Header, Titulo } from "./../elementos/Header";
import { Helmet } from "react-helmet";
import logo from './../imagenes/logo-celeste.png';
import useObtenerProyectos from "./../hooks/useObtenerProyectos";
import {
  Lista,
  ElementoLista,
  Fecha,
  Descripcion,
  ContenedorBotones,
  BotonAccion,
  BotonCargarMas,
  ContenedorBotonCentral,
  ContenedorSubtitulo,
  Subtitulo,
  ContenedorProyectosPorFecha
} from "./../elementos/ElementosDeLista";
import { Link } from "react-router-dom";
import Boton from "./../elementos/Boton";
import { format, fromUnixTime } from "date-fns";
import { es } from "date-fns/locale";
import borrarProyecto from "./../firebase/borrarProyecto";
import { ReactComponent as IconoVer } from "./../imagenes/view.svg";
import { ReactComponent as IconoEditar } from "./../imagenes/editar.svg";
import { ReactComponent as IconoBorrar } from "./../imagenes/borrar.svg";
import BarraTotalProyectos from "./../componentes/BarraTotalProyectos";
import { collection, query, where, getCountFromServer, doc, getDoc } from "firebase/firestore";
import { db } from "./../firebase/firebaseConfig";
import { useAuth } from "./../contextos/AuthContext";
import styled from "styled-components";

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

const IconoAdvertencia = styled.span`
  color: #f44336;
  font-size: 2.2rem;
  display: block;
  margin-bottom: 0.8rem;
`;

const BotonAccionEliminar = styled.button`
  background: #f44336;
  color: #fff;
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.7rem 2rem;
  border-radius: 999px;
  margin: 0 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s, transform 0.15s;
  box-shadow: 0 2px 8px #f4433644;
  &:hover, &:focus {
    background: #d32f2f;
    transform: scale(1.04);
  }
`;

const BotonAccionCancelar = styled.button`
  background: #f0f2f5;
  color: #37474f;
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.7rem 2rem;
  border-radius: 999px;
  margin: 0 0.3rem;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 8px #b0bec544;
  &:hover, &:focus {
    background: #cfd8dc;
  }
`;

const BotonesConfirmacion = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const VentanaConfirmacion = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ContenedorConfirmacion = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  width: 90%;
  max-width: 400px;
`;

const LogoConTexto = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  margin-right: 1.0rem;
`;

const LogoInicio = styled.img`
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

const TextoDebajoLogo = styled.span`
  color: #222;
  font-size: 0.75rem;
  font-weight: 400;
  margin-top: 0.08rem;
  letter-spacing: 0.2px;
`;

const ListaDeProyectos = () => {
  const { usuario } = useAuth();
  const [proyectos, obtenerMasProyectos, hayMasPorCargar] = useObtenerProyectos();
  const [proyectosVista, setProyectosVista] = useState([]);
  const [totalProyectos, setTotalProyectos] = useState(0);

  // Modal para confirmar eliminación
  const [modalEliminar, setModalEliminar] = useState({
    abierto: false,
    proyectoId: null,
    proyectoNombre: '',
  });

  // Mapa UID -> Nombre completo del creador
  const [mapaCreadores, setMapaCreadores] = useState({});

  // Para mantener sincronizada la lista local
  useEffect(() => {
    setProyectosVista(proyectos);
  }, [proyectos]);

  // Función para formatear fecha unix timestamp
  const formatearFecha = (fecha) => {
    return format(fromUnixTime(fecha), "dd 'de' MMMM 'de' yyyy", { locale: es });
  };

  // Agrupar proyectos por fecha formateada (fechaCreado)
  const proyectosAgrupados = proyectosVista.reduce((acc, proyecto) => {
    const fechaFormateada = formatearFecha(proyecto.fechaCreado);
    if (!acc[fechaFormateada]) {
      acc[fechaFormateada] = [];
    }
    acc[fechaFormateada].push(proyecto);
    return acc;
  }, {});

  // Ordenar las fechas descendente
  const fechasOrdenadas = Object.keys(proyectosAgrupados).sort((a, b) => {
    const parseFecha = (fechaStr) => {
      const partes = fechaStr.split(" de ");
      const dia = parseInt(partes[0], 10);
      const mes = {
        enero: 0, febrero: 1, marzo: 2, abril: 3,
        mayo: 4, junio: 5, julio: 6, agosto: 7,
        septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
      }[partes[1].toLowerCase()] ?? 0;
      const anio = parseInt(partes[2], 10);
      return new Date(anio, mes, dia);
    };
    return parseFecha(b) - parseFecha(a);
  });

  useEffect(() => {
    const contarProyectos = async () => {
      if (!usuario) return;
      try {
        const consulta = query(
          collection(db, "proyectos"),
          where("gestores", "array-contains", usuario.uid)
        );
        const snapshot = await getCountFromServer(consulta);
        setTotalProyectos(snapshot.data().count);
      } catch (error) {
        console.error("Error contando proyectos:", error);
      }
    };
    contarProyectos();
  }, [usuario]);

  // Obtener nombres de creadores para los proyectos que se muestran
  useEffect(() => {
    const obtenerNombresCreadores = async () => {
      const nuevosMapas = { ...mapaCreadores };
      const uidsFaltantes = proyectosVista
        .map(p => p.creadoPor)
        .filter(uid => uid && !nuevosMapas[uid]);
      const uidsUnicos = [...new Set(uidsFaltantes)];
      await Promise.all(
        uidsUnicos.map(async (uid) => {
          try {
            const docRef = doc(db, "usuarios", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              nuevosMapas[uid] = `${data.nombre} ${data.apellido}`;
            } else {
              nuevosMapas[uid] = "Usuario desconocido";
            }
          } catch (error) {
            console.error("Error al obtener usuario:", error);
            nuevosMapas[uid] = "Error al cargar";
          }
        })
      );
      setMapaCreadores(nuevosMapas);
    };
    if (proyectosVista.length > 0) {
      obtenerNombresCreadores();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyectosVista]);

  // Funciones para abrir y cerrar modal
  const abrirModalEliminar = (id, nombre) => {
    setModalEliminar({
      abierto: true,
      proyectoId: id,
      proyectoNombre: nombre,
    });
  };
  const confirmarEliminar = async () => {
    if (modalEliminar.proyectoId) {
      await borrarProyecto(modalEliminar.proyectoId);
      setProyectosVista(prev => prev.filter(p => p.id !== modalEliminar.proyectoId));
      setTotalProyectos(prev => Math.max(0, prev - 1)); // actualiza el total
      setModalEliminar({ abierto: false, proyectoId: null, proyectoNombre: '' });
    }
  };
  const cancelarEliminar = () => {
    setModalEliminar({ abierto: false, proyectoId: null, proyectoNombre: '' });
  };

  return (
    <>
      <Helmet>
        <title>Lista de Proyectos</title>
      </Helmet>

      <Header>
        <LogoConTexto to="/inicio">
          <LogoInicio src={logo} alt="Inicio" />
          <TextoDebajoLogo>Inicio</TextoDebajoLogo>
        </LogoConTexto>
        <Titulo style={{ marginLeft: "0.2rem" }}>Lista de Proyectos</Titulo>
        <BotonRegistrar to="/formulario">
          + Registrar Proyecto
        </BotonRegistrar>
      </Header>

      <BarraTotalProyectos total={totalProyectos} />

      <Lista>
        {fechasOrdenadas.map((fecha) => (
          <div key={fecha}>
            <Fecha>{fecha}</Fecha>
            <ContenedorProyectosPorFecha>
              {proyectosAgrupados[fecha].map((proyecto) => (
                <ElementoLista key={proyecto.id}>
                  <Descripcion>
                    <strong>{proyecto.nombreProyecto}</strong>
                  </Descripcion>
                  <Descripcion>
                    <strong>Metodología: </strong>{proyecto.metodologiaProyecto}
                  </Descripcion>
                  <Descripcion>
                    <strong>Tipo: </strong>{proyecto.tipoProyecto}
                  </Descripcion>
                  <Descripcion>
                    <strong>Creador: </strong>
                    {mapaCreadores[proyecto.creadoPor] || "Cargando..."}
                  </Descripcion>
                  <ContenedorBotones>
                    <BotonAccion
                      onClick={() => abrirModalEliminar(proyecto.id, proyecto.nombreProyecto)}
                      title="Eliminar Proyecto"
                    >
                      <IconoBorrar />
                    </BotonAccion>
                    <BotonAccion
                      as={Link}
                      to={`/editarProyecto/${proyecto.id}`}
                      title="Editar Proyecto"
                    >
                      <IconoEditar />
                    </BotonAccion>
                    <BotonAccion
                      as={Link}
                      to={`/proyecto/${proyecto.id}`}
                      title="Ver Proyecto"
                    >
                      <IconoVer />
                    </BotonAccion>
                  </ContenedorBotones>
                </ElementoLista>
              ))}
            </ContenedorProyectosPorFecha>
          </div>
        ))}

        {proyectosVista.length === 0 && (
          <ContenedorSubtitulo>
            <Subtitulo>No hay proyectos por mostrar</Subtitulo>
            <Boton as={Link} to="/formulario">
              Agregar Proyecto
            </Boton>
          </ContenedorSubtitulo>
        )}
      </Lista>

      {hayMasPorCargar && (
        <ContenedorBotonCentral>
          <BotonCargarMas onClick={obtenerMasProyectos}>
            Cargar Más
          </BotonCargarMas>
        </ContenedorBotonCentral>
      )}

            {/* Modal de confirmación de eliminación */}
      {modalEliminar.abierto && (
        <VentanaConfirmacion role="dialog" aria-modal="true">
          <ContenedorConfirmacion>
            <IconoAdvertencia>
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#f44336" opacity="0.12"/>
                <path d="M12 7v5" stroke="#f44336" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1.1" fill="#f44336"/>
              </svg>
            </IconoAdvertencia>
            <p style={{ fontWeight: 600, fontSize: '1.15rem', color: '#333', marginBottom: '0.4rem' }}>
              ¿Eliminar proyecto <span style={{ color: '#f44336' }}>{modalEliminar.proyectoNombre}</span>?
            </p>
            <div style={{ color: "#777", fontSize: "0.97rem", marginBottom: "0.8rem" }}>
              Esta acción es irreversible. ¿Deseas continuar?
            </div>
            <BotonesConfirmacion>
              <BotonAccionEliminar onClick={confirmarEliminar}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M6 7h12M10 11v4M14 11v4M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Eliminar
              </BotonAccionEliminar>
              <BotonAccionCancelar onClick={cancelarEliminar}>
                Cancelar
              </BotonAccionCancelar>
            </BotonesConfirmacion>
          </ContenedorConfirmacion>
        </VentanaConfirmacion>
      )}

    </>
  );
};

export default ListaDeProyectos;
