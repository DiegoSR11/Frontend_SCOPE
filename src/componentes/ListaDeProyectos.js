import React, { useEffect, useState } from "react";
import { Header, Titulo } from "./../elementos/Header";
import { Helmet } from "react-helmet";
import BtnRegresar from "./../elementos/BtnRegresar";
import logo from './../imagenes/logo-celeste.png';
import { ContenedorLogo, LogoImg } from './../elementos/Header';
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
  const [totalProyectos, setTotalProyectos] = useState(0);

  // Modal para confirmar eliminación
  const [modalEliminar, setModalEliminar] = useState({
    abierto: false,
    proyectoId: null,
    proyectoNombre: '',
  });

  // Mapa UID -> Nombre completo del creador
  const [mapaCreadores, setMapaCreadores] = useState({});

  // Función para formatear fecha unix timestamp
  const formatearFecha = (fecha) => {
    return format(fromUnixTime(fecha), "dd 'de' MMMM 'de' yyyy", { locale: es });
  };

  // Agrupar proyectos por fecha formateada (fechaCreado)
  const proyectosAgrupados = proyectos.reduce((acc, proyecto) => {
    const fechaFormateada = formatearFecha(proyecto.fechaCreado);
    if (!acc[fechaFormateada]) {
      acc[fechaFormateada] = [];
    }
    acc[fechaFormateada].push(proyecto);
    return acc;
  }, {});

  // Ordenar las fechas descendente
  const fechasOrdenadas = Object.keys(proyectosAgrupados).sort((a, b) => {
    // Convertir fecha string a objeto Date para comparación
    // Aquí asumo formato "dd de MMMM de yyyy"
    const parseFecha = (fechaStr) => {
      // Para evitar error simple, parseo con date-fns
      const partes = fechaStr.split(" de ");
      // partes: [dd, MMMM, yyyy]
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
    // Contar proyectos asignados al usuario actual
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
      // Extraer UIDs creadosPor de proyectos que no tenemos en el mapa
      const uidsFaltantes = proyectos
        .map(p => p.creadoPor)
        .filter(uid => uid && !nuevosMapas[uid]);

      // Quitar duplicados
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

    if (proyectos.length > 0) {
      obtenerNombresCreadores();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyectos]);

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
        <ContenedorLogo>
          <Link to="/inicio"><LogoImg src={logo} alt="Logo" /></Link>
        </ContenedorLogo>
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

        {proyectos.length === 0 && (
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
