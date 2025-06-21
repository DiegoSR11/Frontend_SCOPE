import React, { useEffect, useState } from "react";
import { Header, Titulo } from "./../elementos/Header";
import { Helmet } from "react-helmet";
import BtnRegresar from "./../elementos/BtnRegresar";
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
        <BtnRegresar />
        <Titulo>Lista de Proyectos</Titulo>
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
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "0.5rem",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <p>
              ¿Seguro que deseas eliminar el proyecto{" "}
              <strong>{modalEliminar.proyectoNombre}</strong>?
            </p>
            <div style={{ marginTop: "1rem" }}>
              <Boton onClick={confirmarEliminar} style={{ marginRight: "1rem" }}>
                Sí, eliminar
              </Boton>
              <Boton onClick={cancelarEliminar} estilo="secundario">
                Cancelar
              </Boton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListaDeProyectos;
