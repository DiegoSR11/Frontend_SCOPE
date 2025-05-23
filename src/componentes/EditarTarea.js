import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import useObtenerTarea from "../hooks/useObtenerTarea";
import FormularioTarea from "./FormularioTarea"; // Debe permitir modo edición

const EditarTarea = () => {
  const { idProyecto, idTarea } = useParams();
  const tarea = useObtenerTarea(idProyecto, idTarea);

  return (
    <>
      <Helmet>
        <title>Editar Tarea</title>
      </Helmet>

      {tarea ? (
        <FormularioTarea tarea={tarea} idProyecto={idProyecto} />
      ) : (
        <p>Cargando...</p>
      )}
    </>
  );
};

export default EditarTarea;
