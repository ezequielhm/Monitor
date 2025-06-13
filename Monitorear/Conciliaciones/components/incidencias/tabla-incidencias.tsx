import React, { useEffect, useState } from 'react';
import { createColumnHelper, useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';
import { Box, IconButton, Menu, MenuButton, MenuItem, MenuList, Table, Tbody, Td, Th, Thead, Tr, Link } from '@chakra-ui/react';
import { EditIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ApuntesVolcados, incidencia, IncidenciaConEmpresa, incidenciasAgrupadas, MovimientosVolcados, SaldosDescuadrados } from '@/lib/definitions/incidencia-definition';
import { useStore } from '@/lib/store';
import moment from 'moment';
import DetallesIncidencia from '@/components/ui/detalles-incidencia-modal';

const columnHelper = createColumnHelper<incidenciasAgrupadas>();

export const tituloIncidencia = (tipoIncidencia:string) => { 
  let titulo = "";

  switch (tipoIncidencia) {
      case 'asientosModificados':
          titulo = 'Asientos Modificados';
          break;
      case 'saldosDescuadrados':
          titulo = 'Saldos Descuadrados';
          break;
      case 'conciliacionesDescuadradas':
          titulo = 'Conciliaciones Descuadradas';
          break;
      case 'lineasConciliadasDistintasEmpresas':
          titulo = 'Líneas Conciliadas Distintas Empresas';
          break;
      case 'conciliacionAutomatica':
          titulo = 'Conciliación Automática';
          break;
      case 'apuntesVolcados':
          titulo = 'Apuntes Volcados';
          break;
      case 'movimientosVolcados':
          titulo = 'Movimientos Volcados';
          break;
      case 'saldosN43':
          titulo = 'Saldos de N43';
          break;
      default:
          titulo = 'Tipo de Incidencia no reconocido';
          break;
  }

  return titulo;
}

export const incidenciasColumnas = {
  asientosModificados: [
    {clave: 'ID', header: 'ID'},
    {clave: 'ID_CONCILIACION', header: 'ID Conciliación'},
    {clave: 'ID_Conciliado', header: 'ID Conciliado'},
    {clave: 'ID_Quiter', header: 'ID Quiter'},
    {clave: 'Importe_Conciliado', header: 'Importe Conciliado'},
    {clave: 'Importe_Quiter', header: 'Importe Quiter'},
    {clave: 'Descripcion', header: 'Descripción'},
  ],
  saldosDescuadrados: [
    {clave: 'SUBCTA_CONTABLE', header: 'Subcuenta Contable'},
    {clave: 'sumaApunte', header: 'Suma Apuntes'},
    {clave: 'sumaMovimientos', header: 'Suma Movimientos'},
    {clave: 'diferencia', header: 'Diferencia'},
  ],
  conciliacionesDescuadradas: [
    {clave: 'ID_CONCILIACION', header: 'ID Conciliación'},
    {clave: 'FechaCreacion', header: 'Fecha Creación'},
    {clave: 'ImporteConciliacion', header: 'Importe Conciliación'},
    {clave: 'TotalApuntes', header: 'Total Apuntes'},
    {clave: 'TotalMovimientos', header: 'Total Movimientos'},
    {clave: 'DiferenciaImportes', header: 'Diferencia Importes'},
    {clave: 'importeDistinto', header: 'Importe Distinto'},
  ],
  lineasConciliadasDistintasEmpresas: [
    {clave: 'ID_CONCILIACION', header: 'ID Conciliación'},
    {clave: 'ID_linea', header: 'ID Línea'},
    {clave: 'Cuenta_Conciliacion', header: 'Cuenta Conciliación'},
    {clave: 'Cuenta_Linea', header: 'Cuenta Línea'},
  ],
  conciliacionAutomatica: [
    {clave: 'ID_Apuntes', header: 'ID Apuntes'},
    {clave: 'ID_Movimiento', header: 'ID Movimiento'},
    {clave: 'importeApunte', header: 'Importe Apunte'},
    {clave: 'importeMovimiento', header: 'Importe Movimiento'},
    {clave: 'fechaApunte', header: 'Fecha Apunte'},
    {clave: 'fechaMovimiento', header: 'Fecha Movimiento'},
    {clave: 'claveApunte', header: 'Clave Apunte'},
    {clave: 'claveMovimiento', header: 'Clave Movimiento'},
  ],
  apuntesVolcados: [
    {clave: 'ApuntesVolcados', header: 'Apuntes Volcados'},
    {clave: 'ultimaCarga', header: 'Última Carga'},
  ],
  movimientosVolcados: [
    {clave: 'MovimientosVolcados', header: 'Movimientos Volcados'},
    {clave: 'ultimaCarga', header: 'Última Carga'},
  ],
  saldosN43: [
    {clave: 'numeroCuenta', header: 'Cuenta'},
    {clave: 'descripcion', header: 'Descripción'},
    {clave: 'fecha', header: 'Fecha'},
  ],
}

function groupByFields(array: incidencia[], keys: (keyof incidencia)[]): Record<string, incidencia[]> {
  return array.reduce((result: Record<string, incidencia[]>, item: incidencia) => {
    // Crea una clave de agrupación única basada en los valores de los campos especificados
    const groupKey =  (keys ?? []).map(key => item?.[key] ?? '').join('-');

    // Si el grupo aún no existe, lo inicializa como un array vacío
    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    // Añade el elemento al grupo correspondiente
    result[groupKey].push(item);

    return result;
  }, {});
}

function getGroups(grouped: Record<string, incidencia[]>, keys: (keyof incidencia)[]): incidenciasAgrupadas[] {
  // Mapea cada grupo para obtener un solo registro representativo de tipo incidenciasAgrupadas
  return Object.values(grouped).map(group => {
    const firstItem = group[0];

    // Verificamos si es un tipo especial de ApuntesVolcados o MovimientosVolcados
    if (firstItem.Tipo_Incidencia === "apuntesVolcados" || firstItem.Tipo_Incidencia === "movimientosVolcados") {
      return {
        ...firstItem,
        Empresa: '',
        NUM_CTA_BANCARIA: '',
        nombreGrupo: (keys ?? []).map(key => firstItem?.[key] ?? '').join('-'),
        count: group.length
      } as incidenciasAgrupadas;
    }

    // Para otros tipos, creamos un objeto con las propiedades de incidenciasAgrupadas
    const representativeRecord = {
      Tipo_Incidencia: firstItem.Tipo_Incidencia,
      Empresa: (firstItem as IncidenciaConEmpresa).Empresa,
      NUM_CTA_BANCARIA: (firstItem as IncidenciaConEmpresa).NUM_CTA_BANCARIA,
      nombreGrupo: (keys ?? []).map(key => firstItem?.[key] ?? '').join('-'),
      count: group.length,
      diferencia: (firstItem as SaldosDescuadrados).diferencia,
    };

    return representativeRecord;
  });
}


const TablaIncidencias = () => {

  const [data, setData] = useState<incidenciasAgrupadas[]>([]);
  const [groupedData, setGroupedData] = useState<Record<string, incidencia[]>>({});

  const incidencias: incidencia[] = useStore(state => state.incidencias);
  const {openDetallesIncidenciaModal, isDetallesIncidenciaModelOpen, setPropsIncidenciaDetalle} = useStore();
  const columnasAgrupadas = ['Tipo_Incidencia', 'Empresa', 'NUM_CTA_BANCARIA'] as (keyof incidencia)[];

  useEffect(() => {    
    // Array de incidencias agrupadas por Tipo_Incidencia, Empresa y NUM_CTA_BANCARIA
    const groupFields = groupByFields(incidencias, columnasAgrupadas);
    setGroupedData(groupFields);

    /// Array de incidencias con un solo registro representativo por grupo
    const groups = getGroups(groupFields, columnasAgrupadas);

    setData(groups);
  }, [incidencias]);

  const columns: ColumnDef<incidenciasAgrupadas, any>[] = [
    columnHelper.accessor('Tipo_Incidencia', {
      header: 'Tipo Incidencia',
      cell: (info) => <Box textAlign="center">{tituloIncidencia(info.getValue())}</Box>, // Ajusta la función de renderizado
    }),
    columnHelper.accessor('Empresa', {
      header: 'Empresa',
      cell: (info) => <Box textAlign="center">{info.getValue() ?? ''}</Box>,
    }),
    columnHelper.accessor('NUM_CTA_BANCARIA', {
      header: 'Número de Cuenta',
      cell: (info) => {
        const value = info.getValue(); 
        const numCtaBancarioRecortado = value?.slice(value.length - 5);
        return <Box textAlign="center">{numCtaBancarioRecortado ?? ''}</Box>
      }
    }),
    columnHelper.accessor('count', {
      header: 'Total',
      cell: (info) => {
        return <Box textAlign="center">{(info.row.original.Tipo_Incidencia !== 'apuntesVolcados' && info.row.original.Tipo_Incidencia !== 'movimientosVolcados' && info.row.original.Tipo_Incidencia !== 'saldosDescuadrados') ?
           info.getValue() ?? '' : ''}</Box>
      }
    }),
    {
      id: 'DetallesEspecificos',
      header: 'Detalles Específicos',
      cell: (info) => {
        const incidencia = info.row.original;
        switch (incidencia.Tipo_Incidencia) {
          case 'asientosModificados':
            return (
              <Box textAlign="center">
                {`Hay ${incidencia.count} asientos modificados`}
              </Box>
            );
            case 'saldosDescuadrados':
              return (
                <Box textAlign="center">
                  {`El saldo de esta cuanta está descuadrado por ${incidencia.diferencia}`}
                </Box>
              );
            case 'conciliacionesDescuadradas':
              return (
                <Box textAlign="center">
                  {`Hay ${incidencia.count} conciliaciones que descuadran en importes`}
                </Box>
              );
            case 'lineasConciliadasDistintasEmpresas':
              return (
                <Box textAlign="center">
                  {`Hay ${incidencia.count} líneas conciliadas que pertenecen a una cuenta distinta a la de la conciliación`}
                </Box>
              );
            case 'conciliacionAutomatica':
              return (
                <Box textAlign="center">
                  {`Se deberían de haber conciliado ${incidencia.count} conciliaciones automátcas`}
                </Box>
              );
            case 'apuntesVolcados':
              return (
                <Box >
                  {`No se han volcado Apuntes Contables. Última Carga el ${moment(incidencia.ultimaCarga).format('DD/MM/YYYY')}`}
                </Box>
              );
            case 'movimientosVolcados':
              return (
                <Box textAlign="center">
                  {`No se han volcado Movimientos Bancarios. Última Carga el ${moment(incidencia.ultimaCarga).format('DD/MM/YYYY')}`}
                </Box>
              );
          default:
            return null;
        }
      },
    },

    columnHelper.display({
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <Box textAlign="center">
          {
            row.original.Tipo_Incidencia !== 'apuntesVolcados' && row.original.Tipo_Incidencia !== 'movimientosVolcados' &&
            <Menu>
              <MenuButton as={IconButton} icon={<ChevronDownIcon />} variant="outline" />
                <MenuList>
                  <MenuItem as={Link} onClick={() => {openDetallesIncidenciaModal(); setPropsIncidenciaDetalle(groupedData[row.original.nombreGrupo])}} icon={<EditIcon />}>
                    Ver Detalles
                  </MenuItem>
                </MenuList>
            </Menu>
          }
        </Box>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box
      width="100%"
      height="100vh" // Usamos la altura máxima de la pantalla
    >
      <Box
        overflowX="hidden"
        width="100%"
        height="100vh" // Ajustamos para dejar algo de margen
        display="flex"
        justifyContent="center"
        alignItems="start"
        background="white"
      >
        <Box
          w="90%"
          marginTop="3%"
          maxHeight="90vh" // Limitar la altura de la tabla para permitir scroll interno
          overflowY="auto" // Habilitar el scroll vertical
          border="1px solid #e3e3e3"
          borderRadius="md"
        >
          <Table>
            {/* Encabezado fijo */}
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
        <DetallesIncidencia />
      </Box>
    </Box>
  );
  
  
};

export default TablaIncidencias;
