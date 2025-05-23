import React from "react";
import { Helmet } from "react-helmet";
import FormularioProyecto from './FormularioProyecto'; // Este formulario debe estar diseñado para editar un grupo
import { useParams } from 'react-router-dom';
import useObtenerProyecto from './../hooks/useObtenerProyecto'; // Importa el hook que creamos

const EditarProyecto = () => {
    const { id } = useParams(); // Obtiene el ID del grupo desde la URL
    const proyecto = useObtenerProyecto(id); // Llama al hook para obtener los datos del grupo
    return (
        <>
            <Helmet>
                <title>Editar Proyecto</title>
            </Helmet>

            {/* Pasamos los datos del grupo al formulario */}
            {proyecto ? (
                <FormularioProyecto proyecto={proyecto[0]}/>
            ) : (
                <p>Cargando...</p> // Muestra un mensaje de carga mientras se obtiene el grupo
            )}
        </>
    );
};

export default EditarProyecto;