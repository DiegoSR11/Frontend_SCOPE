import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import useObtenerRiesgo from "../hooks/useObtenerRiesgo";
import FormularioRiesgo from "./FormularioRiesgo"; // Debe permitir modo edición

const EditarRiesgo = () => {
  const { idProyecto, idRiesgo } = useParams();
  const riesgo = useObtenerRiesgo(idProyecto, idRiesgo);

  return (
    <>
      <Helmet>
        <title>Editar Riesgo</title>
      </Helmet>

      {riesgo ? (
        <FormularioRiesgo riesgo={riesgo} idProyecto={idProyecto} />
      ) : (
        <p>Cargando...</p>
      )}
    </>
  );
};

export default EditarRiesgo;
