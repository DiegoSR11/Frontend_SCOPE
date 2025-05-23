import React from "react";
import { Helmet } from "react-helmet";
import FormularioGrupo from './FormularioGrupo'; // Este formulario debe estar diseñado para editar un grupo
import { useParams } from 'react-router-dom';
import useObtenerGrupo from './../hooks/useObtenerGrupo'; // Importa el hook que creamos

const EditarGrupo = () => {
    const { id } = useParams(); // Obtiene el ID del grupo desde la URL
    const grupo = useObtenerGrupo(id); // Llama al hook para obtener los datos del grupo

    return (
        <>
            <Helmet>
                <title>Editar Grupo</title>
            </Helmet>

            {/* Pasamos los datos del grupo al formulario */}
            {grupo ? (
                <FormularioGrupo grupo={grupo}/>
            ) : (
                <p>Cargando...</p> // Muestra un mensaje de carga mientras se obtiene el grupo
            )}
        </>
    );
};

export default EditarGrupo;
