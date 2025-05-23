import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import Alerta from "../elementos/Alerta";
import {
    Formulario, 
    FondoCentrado,
    TarjetaContenedor,
    LogoImg,
    TituloSeccion,
    InputEstilizado,
    BotonPrimario,
    TextoCentrado
} from "../elementos/ElementosDeFormulario"; // Asegúrate de que la ruta sea correcta
import logo from "../imagenes/logo-celeste.png";

const InicioSesion = () => {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [estadoAlerta, setEstadoAlerta] = useState(false);
    const [alerta, setAlerta] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        name === 'email' ? setCorreo(value) : setPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEstadoAlerta(false);
        setAlerta({});

        const regexCorreo = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!regexCorreo.test(correo)) {
            setEstadoAlerta(true);
            setAlerta({ tipo: 'error', mensaje: 'Por favor ingresa un correo electrónico válido' });
            return;
        }

        if (correo === '' || password === '') {
            setEstadoAlerta(true);
            setAlerta({ tipo: 'error', mensaje: 'Por favor rellena todos los campos' });
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, correo, password);
            navigate('/inicio');
        } catch (error) {
            console.log('Código de error:', error.code);
            let mensaje;
            switch (error.code) {
                case 'auth/invalid-credential':
                    mensaje = 'Correo electrónico o contraseña incorrectos.';
                    break;
                case 'auth/user-not-found':
                    mensaje = 'No se encontró ninguna cuenta con este correo electrónico.';
                    break;
                default:
                    mensaje = 'Hubo un error al intentar iniciar sesión.';
            }
            setEstadoAlerta(true);
            setAlerta({ tipo: 'error', mensaje });
        }
    };

    return (
        <FondoCentrado>
            <TarjetaContenedor>
                <LogoImg src={logo} alt="Logo" />
                <TituloSeccion>Iniciar Sesión</TituloSeccion>
                <Formulario onSubmit={handleSubmit}>
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
                    <BotonPrimario as="button" type="submit">
                        Iniciar Sesión
                    </BotonPrimario>
                </Formulario>
                <TextoCentrado>
                    ¿No tienes una cuenta? <a href="/crear-cuenta">Registrarse</a>
                </TextoCentrado>
                <TextoCentrado>
                    <a href="/">¿Quienes somos?</a>
                </TextoCentrado>
                <Alerta
                    tipo={alerta.tipo}
                    mensaje={alerta.mensaje}
                    estadoAlerta={estadoAlerta}
                    cambiarEstadoAlerta={setEstadoAlerta}
                />
            </TarjetaContenedor>
        </FondoCentrado>
    );
};

export default InicioSesion;
