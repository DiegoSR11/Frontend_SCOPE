import React, { useState, useContext, useEffect} from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

//Creamos un contexto
 const AuthContext = React.createContext();

//Hook para acceder al contexto
const useAuth = () => {
    return useContext(AuthContext);
}

 const AuthProvider = ({children}) => {
    const [usuario, cambiarUsuario] = useState();
    //creamos un state para saber cuando termina
    //cargar la comprobacion de onAuthStateChanged
    const [cargando, cambiarCargando] = useState(true);

    //Este es el efecto para ejecutar la comporbacion una sola vez
    useEffect(() => {
        //Comprobamos si hay un usuario
        const cancelarSuscripcion = onAuthStateChanged(auth, (usuario) => {
            cambiarUsuario(usuario);
            cambiarCargando(false); 
        })

        return cancelarSuscripcion;
    }, []);

    return (
        <AuthContext.Provider value={{usuario: usuario}}>
            {!cargando && children}
        </AuthContext.Provider>
    );
 }

 export {AuthProvider, AuthContext, useAuth};
