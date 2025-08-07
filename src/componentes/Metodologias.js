// src/componentes/Metodologias.js

import React from "react";
import styled from "styled-components";
import useObtenerMetodologias from "../hooks/useObtenerMetodologias";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: #00A9FF;
  color: #fff;
  padding: 0.75rem 1rem;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1rem;
`;

const Body = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
`;

const Description = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  color: #555;
  flex: 1;
`;

const Steps = styled.ol`
  padding-left: 1.2rem;
  margin: 0;
  color: #444;
  font-size: 0.9rem;
`;

export default function Metodologias({ proyectoId }) {
  const metodologias = useObtenerMetodologias(proyectoId);
  const fases = [
    { key: "analisis", label: "Análisis" },
    { key: "planificacion", label: "Planificación" },
    { key: "desarrollo", label: "Desarrollo" },
    { key: "entrega", label: "Entrega" }
  ];

  return (
    <Container>
      {fases.map(({ key, label }) => {
        const m = metodologias?.[key] || {};
        return (
          <Card key={key}>
            <Header>{label}</Header>
            <Body>
              <Title>{m.metodo || 'Por definir'}</Title>
              <Description>{m.descripcion || 'No hay descripción disponible.'}</Description>
              {m.pasos && m.pasos.length > 0 && (
                <Steps>
                  {m.pasos.map((paso, i) => <li key={i}>{paso}</li>)}
                </Steps>
              )}
            </Body>
          </Card>
        );
      })}
    </Container>
  );
}
