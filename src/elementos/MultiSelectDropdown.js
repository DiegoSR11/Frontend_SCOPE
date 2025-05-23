import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownHeader = styled.div`
  border: 2px solid #ccc;
  border-radius: 0.625rem;
  padding: 0.75rem;
  font-family: 'Work Sans', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;

  &:hover {
    border-color: #00A9FF;
  }
`;

const DropdownListContainer = styled.div`
  position: absolute;
  width: 100%;
  overflow-y: auto;
  background: white;
  border: 2px solid #00A9FF;
  border-radius: 0.625rem;
  margin-top: 0.25rem;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const DropdownList = styled.ul`
  list-style: none;
  padding: 0.5rem;
  margin: 0;
`;

const ListItem = styled.li`
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-left: 1;
  border-radius: 0.625rem;
  margin: 0.1rem;
  /* Cambiar fondo si está seleccionado */
  ${props => props.selected && css`
    background-color: #00A9FF;
    font-weight: 600;
    font-color: white;
  `}

  &:hover {
    background-color: #E8EFF1;
  }
`;

const SelectedItems = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Chevron = styled.span`
  border-style: solid;
  border-width: 0.15em 0.15em 0 0;
  content: '';
  display: inline-block;
  height: 0.45em;
  left: 0.15em;
  position: relative;
  top: 0.15em;
  transform: rotate(45deg);
  vertical-align: top;
  width: 0.45em;
  transition: transform 0.2s ease;
  ${props => props.open && 'transform: rotate(-135deg);'}
`;

const MultiSelectDropdown = ({ options, selected, setSelected, label }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (uid) => {
    if (selected.includes(uid)) {
      setSelected(selected.filter(id => id !== uid));
    } else {
      setSelected([...selected, uid]);
    }
  };

  return (
    <DropdownContainer ref={ref}>
      <DropdownHeader onClick={() => setOpen(!open)}>
        <SelectedItems>
          {selected.length === 0
            ? `Seleccionar ${label}`
            : options
                .filter(o => selected.includes(o.uid))
                .map(o => o.nombre)
                .join(', ')
          }
        </SelectedItems>
        <Chevron open={open} />
      </DropdownHeader>
      {open && (
        <DropdownListContainer>
          <DropdownList>
            {options.map(option => (
              <ListItem
                key={option.uid}
                selected={selected.includes(option.uid)}
                onClick={() => toggleOption(option.uid)}
              >
                {option.nombre}
              </ListItem>
            ))}
          </DropdownList>
        </DropdownListContainer>
      )}
    </DropdownContainer>
  );
};

export default MultiSelectDropdown;
