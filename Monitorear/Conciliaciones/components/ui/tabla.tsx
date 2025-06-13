'use client'
import React, {  useRef } from 'react';
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  RowSelectionState,
  ColumnFilter,
} from '@tanstack/react-table';
import { Box, Spinner } from '@chakra-ui/react';
import { SinResultados } from '@/components/ui/sin-resultados';
import { useEffect, useState } from 'react';
import {
  ApunteContable,
  MovimientoBancario,
  apuntesConciliadosType,
  movimientosConciliadosType,
  todosApuntesType,
  todosMovimientosType,
} from '@/lib/definitions';
import { useStore } from '@/lib/store';
import MyColumn from './columns';
import '../conciliaciones/checkbox.css';
import { saldoStore } from '@/lib/store/store-saldos';
import { useVirtualizer } from '@tanstack/react-virtual';
import moment from 'moment';
import {
  DataMovimientosConciliacionHistorica,
  DataApuntesConciliacionHistorica,
  DataApuntesConciliados,
  DataApuntesContables,
  DataMovimientosBancarios,
  DataMovimientosConciliados,
  DataTodosApuntes,
  DataTodosMovimientos,
} from '@/lib/hooks/use-transform-data';
import { fetchInsertApunteEstComen } from '@/lib/actions/insertar-contables-estado-comentario';
import { fetchInsertMovimientoEstComen } from '@/lib/actions/insertar-bancos-estado-comentario';
import ToolTipCustom from '@/components/ui/tooltip';
import { gestionCuentasStore } from '@/lib/store/store-gestion-cuentas'; // Nuevo import
import { ApunteConciliable } from '@/lib/definitions/gestion-cuentas-definitions';

interface TableMeta {
  updateData: (id: string, rowIndex: number, columnId: string, value: any) => void;
}

type TableData =
  | ApunteContable
  | MovimientoBancario
  | apuntesConciliadosType
  | movimientosConciliadosType
  | todosApuntesType
  | todosMovimientosType;

interface TablaProps {
  tableType: string;
  tabla: string;
  enableRowSelection: boolean;
  selectedRows?: ApunteContable[] | MovimientoBancario[] | apuntesConciliadosType[] | movimientosConciliadosType[] | ApunteConciliable[];
  setSelectedRows?: (selectedRows: any) => void;
  setImporteTotal?: (importeTotal: number) => void;
  importeTotal?: number;
  setListaIdSel?: (listaIdSel: any) => void;
  colorSeleccion?: 'verde' | 'rojo'; // 👈 nueva prop
}

const Tabla = ({
  tableType = 'default',
  tabla,
  enableRowSelection = false,
  selectedRows,
  setSelectedRows,
  setImporteTotal,
  importeTotal,
  setListaIdSel,
  colorSeleccion,
}: TablaProps) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const cargando = useStore((state) => state.cargando);
  const [loading, setLoading] = useState(true);
  const tablaSinResultados = useStore((state) => state.tablaSinResultados);
  const fechaCarga = useStore((state) => state.fechaCarga);
  const saldoMovimiento = saldoStore((state) => state.saldoMovimiento);
  const userData = useStore(state => state.userData)

  // Obtener datos de gestión de cuentas
  const gestionCuentasData = gestionCuentasStore((state: { listaCuentas: any; setListaCuentas: any; }) => ({
    listaCuentas: state.listaCuentas,
    setListaCuentas: state.setListaCuentas
  }));
  const apuntesCuentasCeroData = gestionCuentasStore((state) => ({
    apuntesIzquierda: state.apuntesIzquierda,
    apuntesDerecha: state.apuntesDerecha,
    setListadoApuntes: state.setListado
  }));
  
  const filtros = gestionCuentasStore(state => state.filtrosGestionCuentas);

  const { data, setData } =
    (tabla === 'apuntesConciliar' || tabla === 'apuntesWorksheet' || tabla === 'apuntesRevision')
      ? DataApuntesContables()
      : (tabla === 'bancosConciliar' || tabla === 'bancosWorksheet' || tabla === 'bancosRevision')
        ? DataMovimientosBancarios()
        : (tabla === 'apuntesConciliadosRevision')
          ? DataApuntesConciliados()
          : (tabla === 'bancosConciliadosRevision')
            ? DataMovimientosConciliados()
            : (tabla === 'apuntesEditar')
              ? DataApuntesConciliados(setLoading)
              : (tabla === 'bancosEditar')
                ? DataMovimientosConciliados(setLoading)
                : (tabla === 'apuntesTodosRevision')
                  ? DataTodosApuntes()
                  : (tabla === 'bancosTodosRevision')
                    ? DataTodosMovimientos()
                    : (tabla === 'apuntesConciliacionHistorica')
                      ? DataApuntesConciliacionHistorica()
                      : (tabla === 'bancosConciliacionHistorica')
                        ? DataMovimientosConciliacionHistorica()
                        : (tabla.includes('Izquierda'))
                          ? { data: apuntesCuentasCeroData.apuntesIzquierda, setData: () => { } }
                          : (tabla.includes('Derecha')) // Ensure both cases are handled
                            ? { data: apuntesCuentasCeroData.apuntesDerecha, setData: () => { } }
                            : (tabla === 'gestionCuentas') // Nuevo caso para gestión de cuentas
                              ? {
                                data: gestionCuentasData.listaCuentas,
                                setData: gestionCuentasData.setListaCuentas
                              }
                              : { data: [], setData: () => { } };

  const columns: ColumnDef<any, any>[] = MyColumn({ tabla, columnFilters, setColumnFilters }); // Trae las columnas de la tabla que toque mostrar

  useEffect(() => {
    try {
      if (!selectedRows || !setImporteTotal || !setListaIdSel) return;
      let totalImporte = 0;
      if (tabla === 'apuntesConciliar') {
        totalImporte = selectedRows.reduce((total, row: any) => Math.round((total + row.IMP_DEBE - row.IMP_HABER) * 100) / 100, 0);
      } else if (tabla === 'bancosConciliar') {
        totalImporte = selectedRows.reduce(
          (total, row: any) =>
            row.claveDebeHaber === 'H'
              ? Math.round((total + row.IMPORTE) * 100) / 100
              : row.claveDebeHaber === 'D'
                ? Math.round((total - row.IMPORTE) * 100) / 100
                : total,
          0
        );
      } else if (tabla === 'apuntesEditar') {
        totalImporte = selectedRows.reduce(
          (total, row: any) =>
            row.DebeHaber === 'D'
              ? Math.round((total + Number(row.IMPORTE)) * 100) / 100
              : row.DebeHaber === 'H'
                ? Math.round((total - Number(row.IMPORTE)) * 100) / 100
                : total,
          0
        );
      } else if (tabla === 'bancosEditar') {
        totalImporte = selectedRows.reduce(
          (total, row: any) =>
            row.claveDebeHaber === 'H'
              ? Math.round((total + Number(row.IMPORTE)) * 100) / 100
              : row.claveDebeHaber === 'D'
                ? Math.round((total - Number(row.IMPORTE)) * 100) / 100
                : total,
          0
        );
      } else if (tabla === 'apuntesCuentasCeroIzquierda') {
        totalImporte = selectedRows.reduce(
          (total, row: any) => {
            if (row.clave_importe === 'D') {
              return Math.round((total + Number(row.importe)) * 100) / 100;
            } else if (row.clave_importe === 'H') {
              return Math.round((total - Number(row.importe)) * 100) / 100;
            } else {
              return total;
            }
          },
          0
        );
      } else if (tabla === 'apuntesCuentasCeroDerecha') {
        totalImporte = selectedRows.reduce(
          (total, row: any) => {
            if (row.clave_importe === 'H') {
              return Math.round((total + Number(row.importe)) * 100) / 100;
            } else if (row.clave_importe === 'D') {
              return Math.round((total - Number(row.importe)) * 100) / 100;
            } else {
              return total;
            }
          },
          0
        );
      }
      setImporteTotal(totalImporte);
      setListaIdSel(selectedRows);
    } catch (error) {
      console.error('Error calculating totalImporte or setting state:', error);
    }
  }, [selectedRows, setImporteTotal, setListaIdSel]);

  useEffect(() => {
    console.log('Data: ', DataMovimientosBancarios);
    if (data.length > 0) {
      const defaultSelectedIds = data.reduce((acc: Record<string, boolean>, row: any, index: number) => {
        // Usa 'ID' si existe, si no, usa 'id'
        const rowId = row.ID ?? row.id;
        if (rowId !== undefined) acc[rowId] = true;
        return acc;
      }, {});
      setRowSelection(defaultSelectedIds);
    }
  }, [data]);

  useEffect(() => {
    try {
      const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
      setSelectedRows && setSelectedRows(selectedRows);
    } catch (error) {
      console.error('Error updating selected rows:', error);
    }
  }, [rowSelection]);

  const updateData = async (id: string, rowIndex: number, columnId: string, value: any) => {
    if (tabla === 'gestionCuentas') {
      // Lógica específica para actualizar cuentas si es necesario
      setData((prev: any) =>
        prev.map((cuenta: any) =>
          cuenta.id === id ? { ...cuenta, [columnId]: value } : cuenta
        )
      );
      return;
    }
    setData((prev: any) => {
      return tableType === 'apuntes'
        ? prev.map((row: any) => (row.ID === id ? { ...row, [columnId]: value } : row))
        : prev.map((row: any) => (String(row.ID) === id ? { ...row, [columnId]: value } : row));
    });

    if (tabla === 'apuntesWorksheet' || tabla === 'bancosWorksheet') {
      const apunteMovimiento =
        tableType === 'apuntes'
          ? data.filter((row: { ID: string; }) => row.ID === id)[0].ID
          : data.filter((row: { ID: number; }) => row.ID === Number(id))[0].ID;

      const selectedRow = data.filter((row: { ID: string | number; }) => row.ID === id || row.ID === Number(id))[0];

      let estado = '';
      let comentario = '';

      if ('Estado' in selectedRow) {
        estado = selectedRow.Estado;
      }

      if ('Comentario' in selectedRow) {
        comentario = selectedRow.Comentario;
      }

      if (columnId === 'Estado') {
        estado = value;
      } else if (columnId === 'Comentario') {
        comentario = value;
      }

      try {
        if (tableType === 'apuntes') {
          await fetchInsertApunteEstComen(String(apunteMovimiento), estado, comentario, userData.user.usuario);
        } else {
          await fetchInsertMovimientoEstComen(Number(apunteMovimiento), estado, comentario, userData.user.usuario);
        }
      } catch (error) {
        console.error('Error updating data:', error);
      }
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      rowSelection,
    },
    onColumnFiltersChange: (updater) => setColumnFilters(updater),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: enableRowSelection,
    meta: {
      updateData,
    } as TableMeta,
  });


  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 25,
    overscan: Math.max(10, Math.ceil(window.innerHeight / 120)),
  });


  console.log(rowVirtualizer.getVirtualItems())

  useEffect(() => {
    console.log('RowSelection: ', rowSelection);
    console.log('Data: ', data);
    if (data.length > 0 && setImporteTotal) {
      const totalImporte = data.reduce((total: number, row: { IMPORTE: any; }) => total + Number(row.IMPORTE || 0), 0);
      setImporteTotal(totalImporte);
    }
  }, [data]);


  return (
    <Box className="container p-4 pb-0 bg-white rounded-md shadow-md w-full h-full flex flex-col">
      {(tabla.includes('Editar') && loading) || cargando ? (
        <Box className="flex justify-center items-center h-full">
          <Spinner size="xl" color="red.500" />
          <Box ml={2}>Cargando...</Box>
        </Box>
      ) : (
        <>
          <Box className='w-full flex justify-start mb-2 self-start gap-3'>
            {tabla.includes('Izquierda')
              ? `Apuntes Contables: ${filtros?.empresa1 || 'N/A'} - ${filtros?.cuenta1 || 'N/A'}`
              : tabla.includes('Derecha')
                ? `Apuntes Contables: ${filtros?.empresa2 || 'N/A'} - ${filtros?.cuenta2 || 'N/A'}`
                : tabla === 'gestionCuentas'
                  ? 'Gestión de Cuentas Contables'
                  : tabla.includes('Conciliados')
                    ? (tableType === 'apuntes')
                      ? 'Apuntes Contables Conciliados'
                      : 'Movimientos Bancarios Conciliados'
                    : tabla.includes('Editar')
                      ? (tableType === 'apuntes')
                        ? 'Editar Apuntes Conciliados'
                        : 'Editar Movimientos Conciliados'
                      : (tableType === 'apuntes')
                        ? 'Apuntes Contables'
                        : 'Movimientos Bancarios'}

            {(tabla === 'apuntesWorksheet') && (
              <div> Fecha últ. Carg. {moment(fechaCarga.toISOString()).format('DD/MM/YYYY')} </div>
            )}
            {(tabla === 'bancosWorksheet') && (
              <div>
                Fecha últ. Carg.
                {saldoMovimiento?.fechaFinal
                  ? (saldoMovimiento.fechaFinal instanceof Date
                    ? moment(saldoMovimiento.fechaFinal.toISOString()).format('DD/MM/YYYY')
                    : 'No hay datos')
                  : 'No hay datos'}
              </div>
            )}
          </Box>
          <Box key={JSON.stringify(columnFilters)} className="table-container flex-grow overflow-auto" ref={parentRef}>
            <Box className='table w-full overflow-hidden'>
              <Box className="thead sticky top-0 bg-white">
                {table.getHeaderGroups().map(headerGroup => (
                  <Box className='tr' key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <Box className={`th th-${header.column.id}`} w={header.getSize()} key={header.id} position="relative">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <Box
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}
                        />
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
              {/* Mapeamos las filas de la tabla */}
              {((tableType === 'apuntes') ? tablaSinResultados.apuntes : tablaSinResultados.bancos) ? <SinResultados tabla="conciliar" /> :
                <Box className='tbody' style={{ position: 'relative', height: `${rowVirtualizer.getTotalSize()}px` }}>
                  {rowVirtualizer.getVirtualItems().map(virtualRow => {
                    const row = table.getRowModel().rows[virtualRow.index] || null;
                    return (
                      <Box
                        className={`tr ${row?.getIsSelected()
                            ? colorSeleccion === 'verde'
                              ? 'fila-seleccionada-verde'
                              : colorSeleccion === 'rojo'
                                ? 'fila-seleccionada-rojo'
                                : ''
                            : ''
                          }`}

                        key={row ? row.id : virtualRow.index}
                        style={{
                          position: 'absolute',
                          top: `${virtualRow.start}px`,
                          left: 0,
                          width: '100%',
                          height: `${virtualRow.size}px`,
                        }}
                      >
                        {row ? row.getVisibleCells().map(cell => (
                          <ToolTipCustom cell={cell} campo={tabla} key={cell.id} scrollContainerRef={parentRef} />
                        )) : null}
                      </Box>
                    );
                  })}
                </Box>
              }
            </Box>
          </Box>
          {(tabla.includes('Conciliar') || tabla.includes('Editar')) && (
            <div className={`w-full p-2 flex ${(tableType === 'apuntes') ? 'justify-end' : 'justify-start '} `}>
              <div className={`text-lg m-0 justify-start text-gray-200 font-medium rounded-md w-fit px-2 mx-2 bg-red-500 transition-colors duration-300 ${(tableType === 'apuntes') ? 'order-1' : 'order-2'}`}>
                Total Importe: {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(importeTotal || 0)}
              </div>
            </div>
          )}
          {(tabla.includes('apuntesCuentasCero')) && (
            <div className={`w-full p-2 flex ${(tableType === 'apuntesCuentasCeroIzquierda') ? 'justify-end' : 'justify-start '} `}>
              <div className={`text-lg m-0 justify-start text-gray-200 font-medium rounded-md w-fit px-2 mx-2 bg-red-500 transition-colors duration-300 ${(tableType === 'apuntesCuentasCeroIzquierda') ? 'order-1' : 'order-2'}`}>
                Total Importe: {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(importeTotal || 0)}
              </div>
            </div>
          )}
        </>
      )}
    </Box>
  );
};
export default Tabla;