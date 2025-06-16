import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Formulario,
  InputEstilizado,
  TextoCentrado,
  FondoCentrado,
  LogoImg,
  TarjetaContenedor,
  TituloSeccion,
  ContenedorInputsDosColumnas
} from './../elementos/ElementosDeFormulario';
import styled from "styled-components";
import logo from './../imagenes/logo-celeste.png';
import { auth } from './../firebase/firebaseConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import Alerta from "./../elementos/Alerta";
import agregarUsuario from './../firebase/agregarUsuario';
import editarUsuario from './../firebase/editarUsuario';
import useObtenerUsuario from './../hooks/useObtenerUsuario';

// Botón ancho y destacado
const BotonPrimarioGrande = styled.button`
  background: #00A9FF;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.625rem;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Work Sans', sans-serif;
  cursor: pointer;
  transition: background 0.3s ease;
  display: block;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 0.2rem;
  &:hover {
    background: #008FCC;
  }
  &:active {
    background: #007BB5;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

// Botón cancelar más sutil, delgado y pegado abajo
const BotonCancelar = styled.button`
  background: #fff;
  color: #00A9FF;
  border: 2px solid #00A9FF;
  border-radius: 0.5rem;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-family: inherit;
  font-weight: 600;
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 0.2rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  &:hover {
    background: #f0faff;
    color: #007bb5;
    border-color: #007bb5;
  }
`;

const campos = [
  { name: "nombre", label: "Nombre" },
  { name: "apellido", label: "Apellido" },
  { name: "celular", label: "Celular" },
  { name: "empresa", label: "Empresa" },
  { name: "area", label: "Área" },
  { name: "rol", label: "Puesto o Rol" },
  { name: "pais", label: "País" },
  { name: "departamento", label: "Departamento" },
];

const RegistroUsuarios = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { usuario: usuarioEditar, cargando } = useObtenerUsuario(id);

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
  const [alerta, cambiarAlerta] = useState({});
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [celular, setCelular] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [area, setArea] = useState('');
  const [rol, setRol] = useState('');
  const [pais, setPais] = useState('');
  const [departamento, setDepartamento] = useState('');

  useEffect(() => {
    if (usuarioEditar) {
      setNombre(usuarioEditar.nombre || "");
      setApellido(usuarioEditar.apellido || "");
      setCelular(usuarioEditar.celular || "");
      setEmpresa(usuarioEditar.empresa || "");
      setArea(usuarioEditar.area || "");
      setRol(usuarioEditar.rol || "");
      setPais(usuarioEditar.pais || "");
      setDepartamento(usuarioEditar.departamento || "");
      setCorreo(usuarioEditar.correo || "");
    }
  }, [usuarioEditar]);

  const capitalizarCadaPalabra = (texto) => {
    const limpio = texto.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
    return limpio
      .split(' ')
      .map(word =>
        word
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : ''
      )
      .join(' ');
  };
  const capitalizar = (texto) => {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'email':
        setCorreo(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'password2':
        setPassword2(value);
        break;
      case 'nombre':
        setNombre(capitalizarCadaPalabra(value));
        break;
      case 'apellido':
        setApellido(capitalizarCadaPalabra(value));
        break;
      case 'celular':
        if (/^\d*$/.test(value)) {
          setCelular(value.slice(0, 9));
        }
        break;
      case 'empresa':
        setEmpresa(capitalizar(value));
        break;
      case 'area':
        setArea(capitalizar(value));
        break;
      case 'rol':
        setRol(capitalizar(value));
        break;
      case 'pais':
        setPais(capitalizar(value));
        break;
      case 'departamento':
        setDepartamento(capitalizar(value));
        break;
      default:
        break;
    }
  };

  const validarCampos = (esEdicion = false) => {
    const values = {
      nombre, apellido, celular, empresa, area, rol, pais, departamento
    };
    const vacios = campos.filter(c => !values[c.name] || values[c.name].trim() === "");

    if (vacios.length === 1) {
      return {
        tipo: "error",
        mensaje: `Falta completar el campo: ${vacios[0].label}.`
      };
    }
    if (vacios.length > 1) {
      return {
        tipo: "error",
        mensaje: `Por favor completa todos los campos: ${vacios.map(c => c.label).join(", ")}.`
      };
    }

    // Correo/contraseña solo en creación
    if (!esEdicion) {
      if (!correo || correo.trim() === "") {
        return { tipo: 'error', mensaje: 'Falta completar el campo: Correo Electrónico.' };
      }
      if (!password || password.trim() === "") {
        return { tipo: 'error', mensaje: 'Falta completar el campo: Contraseña.' };
      }
      if (!password2 || password2.trim() === "") {
        return { tipo: 'error', mensaje: 'Falta completar el campo: Repetir Contraseña.' };
      }
    }

    if (!esEdicion) {
      const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (!emailRegex.test(correo)) {
        return { tipo: 'error', mensaje: 'Por favor ingresa un correo válido.' };
      }
      if (password.length < 6) {
        return { tipo: 'error', mensaje: 'La contraseña debe tener al menos 6 caracteres.' };
      }
      if (password !== password2) {
        return { tipo: 'error', mensaje: 'Las contraseñas no son iguales.' };
      }
    }

    if (!/^\d{9}$/.test(celular)) {
      return { tipo: 'error', mensaje: 'El número de celular debe tener 9 dígitos numéricos.' };
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    cambiarEstadoAlerta(false);
    cambiarAlerta({});

    if (usuarioEditar) {
      const error = validarCampos(true);
      if (error) {
        cambiarEstadoAlerta(true);
        cambiarAlerta(error);
        return;
      }
      try {
        await editarUsuario({
          uid: usuarioEditar.uid,
          nombre,
          apellido,
          celular,
          pais,
          departamento,
          empresa,
          area,
          rol
        });
        cambiarEstadoAlerta(true);
        cambiarAlerta({ tipo: 'exito', mensaje: 'Perfil actualizado correctamente.' });
        setTimeout(() => navigate(`/usuario/${usuarioEditar.uid}`), 2000);
      } catch (error) {
        cambiarEstadoAlerta(true);
        cambiarAlerta({ tipo: 'error', mensaje: 'Error al actualizar usuario.' });
      }
      return;
    }

    const error = validarCampos(false);
    if (error) {
      cambiarEstadoAlerta(true);
      cambiarAlerta(error);
      return;
    }

    try {
      const infoUsuario = await createUserWithEmailAndPassword(auth, correo, password);
      await agregarUsuario({
        uid: infoUsuario.user.uid,
        nombre,
        apellido,
        celular,
        pais,
        departamento,
        empresa,
        area,
        rol,
        correo
      });
      cambiarEstadoAlerta(true);
      cambiarAlerta({ tipo: 'exito', mensaje: 'Usuario registrado con éxito' });
      setTimeout(() => navigate('/iniciar-sesion'), 3000);

      setNombre('');
      setApellido('');
      setCelular('');
      setEmpresa('');
      setArea('');
      setRol('');
      setPais('');
      setDepartamento('');
      setCorreo('');
      setPassword('');
      setPassword2('');
    } catch (error) {
      cambiarEstadoAlerta(true);
      let mensaje;
      switch (error.code) {
        case 'auth/invalid-password':
          mensaje = 'La contraseña debe tener al menos 6 caracteres.';
          break;
        case 'auth/email-already-in-use':
          mensaje = 'Ya existe una cuenta con ese correo.';
          break;
        case 'auth/invalid-email':
          mensaje = 'El correo no es válido.';
          break;
        default:
          mensaje = 'Hubo un error al intentar crear la cuenta.';
      }
      cambiarAlerta({ tipo: 'error', mensaje });
    }
  };

  if (id && cargando) return <div style={{ textAlign: "center", marginTop: 32 }}>Cargando usuario...</div>;

  return (
    <FondoCentrado>
      <Helmet>
        <title>{usuarioEditar ? "Editar Perfil" : "Crear Cuenta"}</title>
      </Helmet>
      <TarjetaContenedor>
        <Formulario onSubmit={handleSubmit}>
          <LogoImg src={logo} alt="Logo" />
          <TituloSeccion>{usuarioEditar ? "Editar Perfil" : "Registrarse"}</TituloSeccion>
          <ContenedorInputsDosColumnas>
            <InputEstilizado
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nombre}
              onChange={handleChange}
              required
            />
            <InputEstilizado
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={apellido}
              onChange={handleChange}
              required
            />
            <InputEstilizado
              type="text"
              name="celular"
              placeholder="Celular"
              value={celular}
              onChange={handleChange}
              maxLength={9}
              inputMode="numeric"
              required
            />
            <InputEstilizado
              type="text"
              name="empresa"
              placeholder="Empresa"
              value={empresa}
              onChange={handleChange}
            />
            <InputEstilizado
              type="text"
              name="area"
              placeholder="Área"
              value={area}
              onChange={handleChange}
            />
            <InputEstilizado
              type="text"
              name="rol"
              placeholder="Puesto o Rol"
              value={rol}
              onChange={handleChange}
            />
            <InputEstilizado
              type="text"
              name="pais"
              placeholder="País"
              value={pais}
              onChange={handleChange}
            />
            <InputEstilizado
              type="text"
              name="departamento"
              placeholder="Departamento"
              value={departamento}
              onChange={handleChange}
            />
            <InputEstilizado
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={correo}
              onChange={handleChange}
              required
              disabled={!!usuarioEditar}
              style={usuarioEditar ? { background: "#f1f1f1", color: "#888" } : {}}
            />
            {!usuarioEditar && (
              <>
                <InputEstilizado
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={handleChange}
                  required
                />
                <InputEstilizado
                  type="password"
                  name="password2"
                  placeholder="Repetir Contraseña"
                  value={password2}
                  onChange={handleChange}
                  required
                />
              </>
            )}
          </ContenedorInputsDosColumnas>

          <BotonPrimarioGrande type="submit">
            {usuarioEditar ? "Guardar Cambios" : "Crear Cuenta"}
          </BotonPrimarioGrande>
          {usuarioEditar && (
            <BotonCancelar
              type="button"
              onClick={() => navigate(`/usuario/${usuarioEditar.uid}`)}
            >
              Cancelar
            </BotonCancelar>
          )}

          {!usuarioEditar && (
            <TextoCentrado>
              <a href="/iniciar-sesion">Ya tengo una cuenta</a>
            </TextoCentrado>
          )}
        </Formulario>
        <Alerta
          tipo={alerta.tipo}
          mensaje={alerta.mensaje}
          estadoAlerta={estadoAlerta}
          cambiarEstadoAlerta={cambiarEstadoAlerta}
        />
      </TarjetaContenedor>
    </FondoCentrado>
  );
};

export default RegistroUsuarios;
