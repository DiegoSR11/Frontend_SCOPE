// Archivo: DiagramaGantt.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { differenceInDays, addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';

const coloresEstado = {
  Pendiente: '#FFA500',
  'En desarrollo': '#2196f3',
  Completado: '#4caf50',
  Quebrado: '#f44336'
};

// --- ESTILOS --- (Los tuyos, completos)

const Container = styled.div`
  width: 100%;
  font-family: sans-serif;
`;
const Wrapper = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
`;
const LabelsColumn = styled.div`
  width: 200px;
  flex-shrink: 0;
  background: #fff;
  position: sticky;
  left: 0;
  z-index: 2;
`;
const HeaderRow = styled.div`
  height: 40px;
`;
const HeaderLabelCell = styled.div`
  width: 200px;
  height: 40px;
`;
const LabelRow = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 8px;
  box-sizing: border-box;
`;
const TaskLabel = styled.div`
  background: ${({ color }) => color};
  color: #ffffff;
  padding: 6px 8px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px;
  cursor: pointer;
`;
const TimelineWrapper = styled.div`
  overflow-x: auto;
  flex: 1;
`;
const MonthGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: ${({ pxPerDay }) => pxPerDay}px;
  align-items: center;
`;
const MonthCell = styled.div`
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 0;
  border-bottom: 1px solid #e2e8f0;
`;
const DayGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: ${({ pxPerDay }) => pxPerDay}px;
  align-items: center;
`;
const DayCell = styled.div`
  text-align: center;
  font-size: 0.7rem;
  padding: 2px 0;
  border-bottom: 1px solid #e2e8f0;
`;
const BarsContainer = styled.div`
  position: relative;
  height: ${({ rowHeight, count }) => rowHeight * count}px;
`;
const TaskBar = styled.div`
  position: absolute;
  top: ${({ rowIndex, rowHeight }) => rowIndex * rowHeight + 4}px;
  left: ${({ left }) => left}px;
  width: ${({ width }) => width}px;
  height: ${({ rowHeight }) => rowHeight - 8}px;
  background: ${({ color }) => color};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.75rem;
  pointer-events: none;
  z-index: 2;
`;
const TodayLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #2d3748;
  opacity: 0.6;
  z-index: 3;
`;
const DiaLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #b0b8c7;
  opacity: 0.17;
  z-index: 1;
  pointer-events: none;
`;
const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 0.75rem;
`;
const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const Circle = styled.span`
  width: 12px;
  height: 12px;
  background: ${({ color }) => color};
  border-radius: 50%;
`;
const VentanaDetalle = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;
const ContenedorDetalle = styled.div`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  width: 350px;
`;

// --- COMPONENTE ---
const DiagramaGantt = ({ tareas }) => {
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  if (!tareas || tareas.length === 0) return <p>No hay tareas.</p>;

  const stamps = tareas.flatMap(t => [t.fechaCreado * 1000, t.fechaVencimiento * 1000]);
  const minStamp = Math.min(...stamps) - 86400000;
  const maxStamp = addDays(new Date(Math.max(...stamps)), 1).getTime();
  const totalMs = maxStamp - minStamp;

  const totalDays = differenceInDays(maxStamp, minStamp) + 1;
  const pxPerDay = 40;
  const timelineWidth = totalDays * pxPerDay;
  const rowHeight = 40;

  const daysArr = Array.from({ length: totalDays }).map((_, i) => addDays(new Date(minStamp), i));
  const months = [];
  let curr = format(daysArr[0], 'MMM yyyy', { locale: es });
  let cnt = 0;
  daysArr.forEach(d => {
    const m = format(d, 'MMM yyyy', { locale: es });
    if (m === curr) cnt++;
    else { months.push({ label: curr.toUpperCase(), span: cnt }); curr = m; cnt = 1; }
  });
  months.push({ label: curr.toUpperCase(), span: cnt });

  const todayPx = ((Date.now() - minStamp) / totalMs) * timelineWidth;

  return (
    <Container>
      <Wrapper>
        <LabelsColumn>
          <HeaderRow><HeaderLabelCell /></HeaderRow>
          {tareas.map((t, i) => (
            <LabelRow key={t.id}>
              <TaskLabel color={coloresEstado[t.estadoTarea]} onClick={() => setTareaSeleccionada(t)}>
                {t.nombreTarea}
              </TaskLabel>
            </LabelRow>
          ))}
        </LabelsColumn>

        <TimelineWrapper>
          <MonthGrid pxPerDay={pxPerDay} style={{ width: timelineWidth }}>
            {months.map((m, i) => (
              <MonthCell key={i} style={{ gridColumn: `span ${m.span}` }}>{m.label}</MonthCell>
            ))}
          </MonthGrid>
          <DayGrid pxPerDay={pxPerDay} style={{ width: timelineWidth }}>
            {daysArr.map((d, i) => <DayCell key={i}>{format(d, 'd', { locale: es })}</DayCell>)}
          </DayGrid>

          <BarsContainer rowHeight={rowHeight} count={tareas.length} style={{ width: timelineWidth }}>
            <TodayLine style={{ left: todayPx }} />
            {/* Líneas de día: alineadas con DayCell */}
            {Array.from({ length: totalDays + 1 }).map((_, i) => (
              <DiaLine key={i} style={{ left: `${i * pxPerDay}px` }} />
            ))}
            {tareas.map((t, i) => {
              // El inicio de la barra debe ser alineado al inicio del día
              // t.fechaCreado * 1000 - minStamp nos da cuántos ms después del inicio global está la tarea
              // timelineWidth es px, totalMs es ms
              // left = días desde minStamp * pxPerDay
              const leftDays = differenceInDays(t.fechaCreado * 1000, minStamp);
              const startPx = leftDays * pxPerDay;
              // ancho: número de días * pxPerDay
              const taskDays = differenceInDays(t.fechaVencimiento * 1000, t.fechaCreado * 1000) + 1;
              let widthPx = taskDays * pxPerDay;
              const color = coloresEstado[t.estadoTarea];
              return (
                <TaskBar key={t.id} rowIndex={i} rowHeight={rowHeight} left={startPx} width={widthPx} color={color}>
                  {taskDays}d
                </TaskBar>
              );
            })}
          </BarsContainer>
        </TimelineWrapper>
      </Wrapper>

      <Legend>
        {Object.entries(coloresEstado).map(([st, col]) => (
          <LegendItem key={st}><Circle color={col} /> {st}</LegendItem>
        ))}
      </Legend>

      {tareaSeleccionada && (
        <VentanaDetalle onClick={() => setTareaSeleccionada(null)}>
          <ContenedorDetalle onClick={e => e.stopPropagation()}>
            <h2>{tareaSeleccionada.nombreTarea}</h2>
            <p><strong>Estado:</strong> {tareaSeleccionada.estadoTarea}</p>
            <p><strong>Fecha creación:</strong> {format(tareaSeleccionada.fechaCreado * 1000, 'PP', { locale: es })}</p>
            <p><strong>Fecha vencimiento:</strong> {format(tareaSeleccionada.fechaVencimiento * 1000, 'PP', { locale: es })}</p>
            <button onClick={() => setTareaSeleccionada(null)}>Cerrar</button>
          </ContenedorDetalle>
        </VentanaDetalle>
      )}
    </Container>
  );
};

export default DiagramaGantt;
