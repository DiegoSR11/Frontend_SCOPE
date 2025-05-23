// Confirmacion.js
import React from 'react';
import styled from 'styled-components';
import theme from './../theme';

const FondoOscuro = styled.div`
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Modal = styled.div`
    background: #fff;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 25px rgba(0,0,0,0.2);
    width: 90%;
    max-width: 400px;
    text-align: center;
`;

const Mensaje = styled.p`
    margin-bottom: 2rem;
    font-size: 1rem;
`;

const Botones = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
`;

const Boton = styled.button`
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 0.3rem;
    font-weight: bold;
    cursor: pointer;
    color: white;
    background-color: ${props => props.cancelar ? theme.grisClaro : theme.azul};
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${props => props.cancelar ? '#aaa' : theme.azulOscuro};
    }
`;

const Confirmacion = ({ mostrar, mensaje, onAceptar, onCancelar }) => {
    if (!mostrar) return null;

    return (
        <FondoOscuro>
            <Modal>
                <Mensaje>{mensaje}</Mensaje>
                <Botones>
                    <Boton onClick={onAceptar}>Aceptar</Boton>
                    <Boton cancelar onClick={onCancelar}>Cancelar</Boton>
                </Botones>
            </Modal>
        </FondoOscuro>
    );
};

export default Confirmacion;
