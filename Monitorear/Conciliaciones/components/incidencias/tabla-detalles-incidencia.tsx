import React, { useEffect, useState } from 'react';
import { createColumnHelper, useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';
import { Box, IconButton, Menu, MenuButton, MenuItem, MenuList, Table, Tbody, Td, Th, Thead, Tr, Link } from '@chakra-ui/react';
import { EditIcon, ChevronDownIcon, CheckIcon } from '@chakra-ui/icons';
import { incidencia, SaldosN43 } from '@/lib/definitions/incidencia-definition';
import { useStore } from '@/lib/store';
import { incidenciasColumnas } from '@/components/incidencias/tabla-incidencias';
import { fetchCorregirIncidenciaSaldosN43 } from '@/lib/actions/action-corregir-incidencia-saldos-n43';
import moment from 'moment';

const columnHelper = createColumnHelper<incidencia>();

const contieneCampo = (value:string, columnas:string[]) => {
  return columnas.includes(value);
}

const TablaDetallesIncidencia = () => {

  const [data, setData] = useState<incidencia[]>([]);
  const {propsIncidenciaDetalle, setRecargaIncidenciaSaldoN43, recargaIncidenciaSaldoN43} = useStore();
  
  useEffect(() => {
    setData(propsIncidenciaDetalle);
  }, [propsIncidenciaDetalle]);


  const columns: ColumnDef<incidencia, any>[] = [
    ...incidenciasColumnas[propsIncidenciaDetalle[0].Tipo_Incidencia].map((incidencia:any) => 
      columnHelper.accessor(incidencia.clave, {
        header: incidencia.header,
        cell: (info) =>  <Box textAlign="left">{contieneCampo(info.column.id, ['fechaMovimiento', 'fechaApunte', 'FechaCreacion', 'fecha']) ? 
                                                  moment(info.getValue()).format('DD/MM/YYYY') : 
                                                  info.getValue()}</Box>,
      })
    ),
    
    columnHelper.display({
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (

        <Box textAlign="center">
          {(row.original.Tipo_Incidencia === 'asientosModificados' || row.original.Tipo_Incidencia === 'saldosN43' ) && (
            <Menu>
              <MenuButton as={IconButton} icon={<ChevronDownIcon />} variant="outline" />
              <MenuList>
                {row.original.Tipo_Incidencia === 'asientosModificados' && 
                <MenuItem as={Link} href={`/editar/${row.original.ID_CONCILIACION}`} icon={<EditIcon />} target="_blank">
                  Editar
                </MenuItem>}
                {row.original.Tipo_Incidencia === 'saldosN43' &&
                  <MenuItem icon={<CheckIcon />} onClick={async () => {
                      row.original.Tipo_Incidencia === 'saldosN43' && await fetchCorregirIncidenciaSaldosN43(row.original.id);
                      setData(data.filter((incidencia) => (incidencia as SaldosN43).id !== (row.original as SaldosN43).id));
                      setRecargaIncidenciaSaldoN43(!recargaIncidenciaSaldoN43);
                    }} >
                    Corregir
                  </MenuItem>
                }
              </MenuList>
            </Menu>
          )}
        </Box>
      ),
    }),
  ];

  useEffect(() => { console.log('DATA: ',data) }, [data]);

  

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box
      className="w-100"
      overflowX="auto"
      display="flex"
      justifyContent="center"
      alignItems="start"
      background="white"
      paddingTop={'2em'}
    >
      <Box
        width="100%"
        maxHeight="70vh"
        overflowY="auto" // Scroll interno solo en el cuerpo de la tabla
      >
        <Table>
          {/* Header fijo */}
          <Thead
            position="sticky"
            top="0"
            zIndex="1"
            backgroundColor="#f0f0f0"
            borderBottom="1px solid #e3e3e3"
          >
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th key={header.id} textAlign="center">
                    {typeof header.column.columnDef.header === 'function'
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
  
          {/* Cuerpo de la tabla con scroll */}
          <Tbody>
            {table.getRowModel().rows.map(row => (
              <Tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <Td key={cell.id} textAlign="center">
                    {typeof cell.column.columnDef.cell === 'function'
                      ? cell.column.columnDef.cell(cell.getContext())
                      : cell.getValue()}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
  
};

export default TablaDetallesIncidencia;
