import React, { useEffect, useState } from 'react';
import { useReactTable, ColumnDef, CellContext, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Box, Button, Switch } from '@chakra-ui/react';
import { Status } from '@/lib/definitions';
import { getTextColor } from '@/lib/color-utils';
import { fetchDeshabilitarEstado } from '@/lib/actions/deshabilitar-estado'; // Ajusta la ruta

interface TableEstadosProps {
  data: Status[];
  openColorPicker: (index: string) => void;
}

const TableEstados: React.FC<TableEstadosProps> = ({ data, openColorPicker }) => {
  const [disabledRows, setDisabledRows] = useState<boolean[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setDisabledRows(data.map(status => status.deshabilitado));
    }
  }, [data]);

  const handleToggleRow = async (id: string) => {
    const rowIndex = data.findIndex((status) => status.id === id);
    const newStatus = !disabledRows[rowIndex]; // Invertimos el estado actual

    try {
      await fetchDeshabilitarEstado(id, newStatus);

      setDisabledRows((prevDisabledRows) => {
        const newDisabledRows = [...prevDisabledRows];
        newDisabledRows[rowIndex] = newStatus;
        return newDisabledRows;
      });
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };


  // Filtrar los datos para excluir los elementos cuyo tipo es null
   const filteredData = data.filter(status => status.tipo !== null);

  const columns: ColumnDef<Status>[] = [
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      cell: (props: CellContext<Status, unknown>) => (
        <Box textAlign="center" className={!disabledRows[props.row.index] ? 'text-gray-400' : ''}>
          {props.getValue<string>()}
        </Box>
      ),
    },
    {
      accessorKey: 'color',
      header: 'Color',
      cell: (props: CellContext<Status, unknown>) => {
        const isDisabled = props.row.original.id === '0'; // Verificar si el id es '0'
        const colorValue = props.getValue<string>();
        const textColorClass = getTextColor(colorValue);
    
        return (
          <div className="flex items-center justify-center space-x-4">
            <div
              style={{ backgroundColor: colorValue }}
              className={`h-8 w-24 ${textColorClass} flex items-center justify-center rounded-md ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`} // Aplicar estilo similar a deshabilitado
            >
              {colorValue}
            </div>
            <Button
  width="2rem"
  height="2rem"
  borderRadius="lg"
  boxShadow="inner"
  style={{ backgroundColor: colorValue }}
  onClick={() => openColorPicker(props.row.original.id)} // Enviar el id del estado
></Button>

          </div>
        );
      },
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
      cell: (props: CellContext<Status, unknown>) => {
        const tipoValue = props.getValue<string>();
        const displayValue = tipoValue === 'A' ? 'Apunte' : tipoValue === 'M' ? 'Movimiento' : tipoValue;

        return (
          <Box textAlign="center" className={!disabledRows[props.row.index] ? 'text-gray-400' : ''}>
            {displayValue}
          </Box>
        );
      },
    },
    {
      accessorKey: 'deshabilitado',
      header: 'Habilitado',
      cell: (props: CellContext<Status, unknown>) => {
        const isDisabled = props.row.original.id === '0'; // Verificar si el id es '0'
        
        return (
          <Box textAlign="center">
            <Switch
              isChecked={disabledRows[props.row.index]}
              isDisabled={isDisabled} // Deshabilitar interacción si id es 0
              onChange={() => handleToggleRow(props.row.original.id)}
            />
          </Box>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data, // Usar los datos filtrados
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data || data.length === 0) {
    return <div>Cargando...</div>; // O cualquier otro indicador de carga
  }

  return (
    <Box className="table-container flex-grow overflow-auto w-full">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="p-2 text-center font-semibold text-gray-600 border-b border-gray-300"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white">
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className={`border-b border-gray-200 ${!disabledRows[row.index] ? 'bg-gray-100' : ''}`}
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className={`p-2 text-center text-xs text-gray-700 ${!disabledRows[row.index] ? 'text-gray-400' : ''}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default TableEstados;
