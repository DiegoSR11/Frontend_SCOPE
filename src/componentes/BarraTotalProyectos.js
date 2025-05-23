import React from 'react';
import styled from 'styled-components';
import theme from './../theme';

const BarraTotal = styled.div`
    background: ${theme.verde};
    font-size: 1.0rem; 
    letter-spacing: 1px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 0.62rem 2.25rem; 
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.5rem;
    border-radius: 1rem;

    @media(max-width: 31.25rem) {
        flex-direction: column;
        font-size: 14px;
        align-items: flex-start;
    }
`;

const TextoDerecha = styled.div`
    margin-left: auto; /* Esto empuja el texto hacia la derecha */
`;

const BarraTotalProyectos = ({ total }) => {
    return (
        <BarraTotal>
            <TextoDerecha>
                Total de proyectos: {total}
            </TextoDerecha>
        </BarraTotal>
    );
};

export default BarraTotalProyectos;
