import styled from "styled-components";
import { Link } from "react-router-dom";

const Boton = styled(Link)`
    background: ${(props) => props.$primario ? '#00A9FF' : '#00A9FF'};
    border: none;
    border-radius: 0.625rem;
    color: #fff;
    font-family: 'Work Sans', sans-serif;
    height: 1.75rem;
    padding: 1.0rem 1.87rem;
    font-size: 1.0rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    outline: none;
 
    svg {
    height: ${(props) => props.$iconoGrande ? '1.5rem' : '0.75rem'};
    width: auto;
    fill: white;
    }
`;

export default Boton;
