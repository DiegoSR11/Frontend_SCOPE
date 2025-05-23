import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import format from 'date-fns/format';
import 'react-day-picker/dist/style.css';
import styled from 'styled-components';
import theme from './../theme';

const ContenedorInput = styled.div`
    position: relative;

    input {
        font-family: 'Work Sans', sans-serif;
        box-sizing: border-box;
        background: ${theme.grisClaro};
        border: none;
        cursor: pointer;
        border-radius: 0.625rem;
        height: 2.5rem;
        width: 100%;
        padding: 0 1.25rem;
        font-size: 1rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
    }

    .rdp-root {
        position: absolute;
        z-index: 1000;
        transform: scale(0.75);
        transform-origin: center;
        top: -300px; /* Ajusta esta distancia para mover el calendario hacia arriba */
    }

    .rdp-months {
        display: flex;
        justify-content: center;
    }

    .rdp-month {
        background: #fff;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        padding: 20px;
        border-radius: 10px;
        font-size: 1rem;
    }

    @media (max-width: 60rem) {
        & > * {
            width: 100%;
        }
    }
`;

const formatFecha = (fecha = new Date()) => {
    return format(fecha, `dd 'de' MMMM 'de' yyyy`, { locale: es });
};

const DatePicker = ({ fecha, cambiarFecha }) => {
    const [visible, cambiarVisible] = useState(false);
    const refCalendario = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (refCalendario.current && !refCalendario.current.contains(event.target)) {
                cambiarVisible(false);
            }
        }

        if (visible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [visible]);

    return (
        <ContenedorInput ref={refCalendario}>
            <input
                type="text"
                readOnly
                value={formatFecha(fecha)}
                onClick={() => cambiarVisible(!visible)}
            />
            {visible && (
                <DayPicker
                    mode="single"
                    selected={fecha}
                    onSelect={(selectedDate) => {
                        if (selectedDate) {
                            cambiarFecha(selectedDate);
                            cambiarVisible(false);
                        }
                    }}
                    locale={es}
                />
            )}
        </ContenedorInput>
    );
};

export default DatePicker;
