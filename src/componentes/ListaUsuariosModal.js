import React, { useState } from "react";
import styled from "styled-components";
import useObtenerUsuariosGrupos from "./../hooks/useObtenerUsuariosGrupos";

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const UsuarioLista = styled.ul`
  list-style: none;
  padding: 0;
  max-height: 400px;
  overflow-y: auto;
`;

const UsuarioItem = styled.li`
  background: ${(props) => (props.selected ? "#dcdcdc" : "#f9f9f9")};
  padding: 10px;
  margin: 10px 0;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    background: #e0e0e0;
  }
`;

const BotonBarra = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Boton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: bold;
`;

const BotonAsignar = styled(Boton)`
  background: #4f46e5;
  color: white;
`;

const BotonCerrar = styled(Boton)`
  background: red;
  color: white;
`;

const ListaUsuariosModal = ({ closeModal, existingUids = [] }) => {
  const { usuarios, cargando } = useObtenerUsuariosGrupos();
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);

  const toggleSeleccion = (usuario) => {
    if (usuariosSeleccionados.some((u) => u.uid === usuario.uid)) {
      setUsuariosSeleccionados((prev) => prev.filter((u) => u.uid !== usuario.uid));
    } else {
      setUsuariosSeleccionados((prev) => [...prev, usuario]);
    }
  };

  const handleAsignar = () => {
    // Filtrar solo nuevos
    const seleccionNeta = usuariosSeleccionados.filter(u => !existingUids.includes(u.uid));
    closeModal(seleccionNeta);
  };

  return (
    <ModalContainer>
      <Modal>
        <h3>Selecciona usuarios para asignar</h3>
        {cargando ? (
          <p>Cargando usuarios...</p>
        ) : (
          <UsuarioLista>
            {usuarios.map((usuario) => (
              <UsuarioItem
                key={usuario.uid}
                selected={usuariosSeleccionados.some((u) => u.uid === usuario.uid)}
                onClick={() => toggleSeleccion(usuario)}
              >
                <p><strong>{usuario.nombre}</strong></p>
                <p>{usuario.correo}</p>
              </UsuarioItem>
            ))}
          </UsuarioLista>
        )}
        <BotonBarra>
          <BotonCerrar onClick={() => closeModal([])}>Cancelar</BotonCerrar>
          <BotonAsignar onClick={handleAsignar}>Asignar</BotonAsignar>
        </BotonBarra>
      </Modal>
    </ModalContainer>
  );
};

export default ListaUsuariosModal;
