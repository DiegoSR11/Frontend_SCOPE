import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  Formulario,
  InputEstilizado,
  TextoCentrado,
  FondoCentrado,
  LogoImg,
  TarjetaContenedor,
  TituloSeccion,
  BotonPrimario,
  ContenedorInputsDosColumnas
} from './../elementos/ElementosDeFormulario';
import logo from './../imagenes/logo-celeste.png';
import { auth } from './../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import Alerta from "./../elementos/Alerta";
import agregarUsuario from './../firebase/agregarUsuario';

const RegistroUsuarios = () => {
  const navigate = useNavigate();
  const [correo, establecerCorreo] = useState('');
  const [password, establecerPassword] = useState('');
  const [password2, establecerPassword2] = useState('');
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

  // Capitaliza cada palabra, elimina espacios iniciales y colapsa múltiples, pero permite un espacio final
  const capitalizarCadaPalabra = (texto) => {
    // Quita espacios al inicio, colapsa más de uno y conserva el resto intacto (incluido espacio final)
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

  // Capitaliza solo la primera letra y minúsculas el resto
  const capitalizar = (texto) => {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'email':
        establecerCorreo(value);
        break;
      case 'password':
        establecerPassword(value);
        break;
      case 'password2':
        establecerPassword2(value);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    cambiarEstadoAlerta(false);
    cambiarAlerta({});

    const emailRegex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
    if (!emailRegex.test(correo)) {
      cambiarEstadoAlerta(true);
      cambiarAlerta({ tipo: 'error', mensaje: 'Por favor ingresa un correo electrónico válido' });
      return;
    }

    if ([correo, password, password2, nombre, apellido, celular].some(v => v.trim() === '')) {
      cambiarEstadoAlerta(true);
      cambiarAlerta({ tipo: 'error', mensaje: 'Por favor rellena todos los datos obligatorios' });
      return;
    }

    if (password !== password2) {
      cambiarEstadoAlerta(true);
      cambiarAlerta({ tipo: 'error', mensaje: 'Las contraseñas no son iguales' });
      return;
    }

    if (!/^\d{9}$/.test(celular)) {
      cambiarEstadoAlerta(true);
      cambiarAlerta({ tipo: 'error', mensaje: 'El número de celular debe tener 9 dígitos y sólo números' });
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
    } catch (error) {
      cambiarEstadoAlerta(true);
      let mensaje;
      switch (error.code) {
        case 'auth/invalid-password':
          mensaje = 'La contraseña debe tener al menos 6 caracteres.';
          break;
        case 'auth/email-already-in-use':
          mensaje = 'Ya existe una cuenta con el correo electrónico proporcionado.';
          break;
        case 'auth/invalid-email':
          mensaje = 'El correo electrónico no es válido.';
          break;
        default:
          mensaje = 'Hubo un error al intentar crear la cuenta.';
      }
      cambiarAlerta({ tipo: 'error', mensaje });
    }
  };

  return (
    <FondoCentrado>
      <Helmet>
        <title>Crear Cuenta</title>
      </Helmet>

      <TarjetaContenedor>
        <Formulario onSubmit={handleSubmit}>
          <LogoImg src={logo} alt="Logo" />
          <TituloSeccion>Registrarse</TituloSeccion>

          <ContenedorInputsDosColumnas>
            <InputEstilizado
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nombre}
              onChange={handleChange}
            />
            <InputEstilizado
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={apellido}
              onChange={handleChange}
            />
            <InputEstilizado
              type="text"
              name="celular"
              placeholder="Celular"
              value={celular}
              onChange={handleChange}
              maxLength={9}
              inputMode="numeric"
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
            />
            <InputEstilizado
              type="password"
              name="password"
              placeholder="Contraseña"
              value={password}
              onChange={handleChange}
            />
            <InputEstilizado
              type="password"
              name="password2"
              placeholder="Repetir Contraseña"
              value={password2}
              onChange={handleChange}
            />
          </ContenedorInputsDosColumnas>

          <BotonPrimario as="button" type="submit">
            Crear Cuenta
          </BotonPrimario>

          <TextoCentrado>
            <a href="/iniciar-sesion">Ya tengo una cuenta</a>
          </TextoCentrado>
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
