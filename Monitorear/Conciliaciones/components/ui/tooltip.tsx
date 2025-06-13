'use client'

import { Box, Tooltip } from '@chakra-ui/react';
import { Cell, flexRender } from '@tanstack/react-table';
import React, { ReactNode, useEffect, useState } from 'react';
import { useStore } from '@/lib/store';

interface ToolTipCustomProps<TData> {
  cell: Cell<TData, unknown>;
  campo: string;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

const ToolTipCustom = <TData,>({ cell, campo, scrollContainerRef }: ToolTipCustomProps<TData>) => {
  const estadosApuntes = useStore(state => state.estadosApuntes);
  const estadosMovimientos = useStore(state => state.estadosMovimientos);
  const [tooltipLabel, setTooltipLabel] = useState<ReactNode>('');
  const [isHovered, setIsHovered] = useState(false);

  const [shouldShow, setShouldShow] = useState(false);

  // Determina si este cell debe tener tooltip
  useEffect(() => {
    const columna = cell.column.id;
    let show = false;

    switch (campo) {
      case 'apuntesConciliar':
        show = columna === 'DESCRI_ASI';
        break;
      case 'bancosConciliar':
      case 'bancosWorksheet':
      case 'bancosRevision':
        show = ['Comentario', 'Estado', 'info_1', 'info_2', 'info_3_4', 'info_5'].includes(columna);
        break;
      case 'apuntesWorksheet':
      case 'apuntesRevision':
        show = ['DESCRI_ASI', 'Estado'].includes(columna);
        break;
      case 'apuntesConciliadosRevision':
      case 'bancosConciliadosRevision':
        show = ['Desc', 'Estado'].includes(columna);
        break;
      case 'apuntesCuentasCeroIzquierda':
      case 'apuntesCuentasCeroDerecha':
        show = columna === 'descripcion';
        break;
    }

    setShouldShow(show);
  }, [campo, cell]);

  // Etiqueta del tooltip
  useEffect(() => {
    const fila = cell.row.original as TData & { usuario?: string };
    const usuario = fila.usuario ?? 'desconocido';

    let label: ReactNode = '';

    if (!shouldShow) {
      setTooltipLabel('');
      return;
    }

    const columna = cell.column.id;
    const valor = String(cell.getValue() ?? '');

    if (campo.includes('Worksheet') || campo.includes('Revision') || campo.includes('Conciliar')) {
      if (columna === 'Estado') {
        const estado = campo.includes('apuntes')
          ? estadosApuntes.find(e => e.id !== '0' && e.id === cell.getValue())
          : estadosMovimientos.find(e => e.id !== '0' && e.id === cell.getValue());
        label = estado?.descripcion ?? '';
      } else if (columna === 'Comentario') {
        label = (
          <Box whiteSpace="pre-line">
            {`Último cambio hecho por ${usuario}:\n${valor}`}
          </Box>
        );
      } else {
        label = valor;
      }
    } else {
      label = valor;
    }

    setTooltipLabel(label);
  }, [campo, cell, estadosApuntes, estadosMovimientos, shouldShow]);

  // Oculta el tooltip al hacer scroll
  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleScroll = () => {
      setIsHovered(false);
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollContainerRef]);

  
    useEffect(() => {
      // Cierra el tooltip si el valor de la celda ha cambiado
      setIsHovered(false);
    }, [cell.getValue()]);

  const uniqueId = `${cell.row.id}-${cell.column.id}-${cell.id}`;

  return (
    <Tooltip
      label={tooltipLabel}
      placement="bottom"
      isOpen={isHovered && shouldShow}
    >
      <Box
        className="td"
        w={cell.column.getSize()}
        key={uniqueId}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </Box>
    </Tooltip>
  );
};

export default ToolTipCustom;
