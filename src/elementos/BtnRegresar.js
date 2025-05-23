import React from "react";
import styled from "styled-components";
import {ReactComponent as IconoFlecha} from './../imagenes/flecha.svg'
import {useNavigate} from 'react-router-dom'

const Btn = styled.button`
    display: block;
    width: 2.12rem; 
    height: 2.12rem; 
    line-height: 3.12rem; 
    text-align: center;
    margin-right: 1.25rem; 
    border: none;
    background: #00A9FF;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.31rem; 
    cursor: pointer;
 
    @media(max-width: 60rem){
        width: 2.5rem; 
        height: 2.5rem; 
        line-height: 2.5rem; 
    }
`;
 
const Icono = styled(IconoFlecha)`
    width: 50%;
    height: auto;
    fill: #fff;
    background: #00A9FF;
    
`;

const BtnRegresar = () => {
    const navigate = useNavigate();
    
    return (
        <Btn onClick={() => navigate(-1)}><Icono/></Btn>
    );
}
 
export default BtnRegresar;