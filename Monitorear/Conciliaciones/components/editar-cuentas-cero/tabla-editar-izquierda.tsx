'use client'

import { Box, Tooltip } from "@chakra-ui/react";
import { 
    ColumnDef, 
    useReactTable, 
    getCoreRowModel, 
    getFilteredRowModel, 
    flexRender, 
    RowSelectionState
} from '@tanstack/react-table';
import { Apunte, gestionCuentasStore } from "@/lib/store/store-gestion-cuentas";
import { useEffect, useState } from "react";
import { useStore } from '@/lib/store';
import useWindowSize from "@/lib/hooks/use-window-size";
import {
    dateColumn,
    sortingImporteCuentasCero,
    textColumn,
    amountColumn,
    checkboxColumn
} from "@/components/ui/columns/column-factories";
import clsx from 'clsx';
import '@/components/conciliaciones/checkbox.css';

export interface ColumnFilter {
    id: string;
    value: any;
}

interface TablaEditarIzquierdaProps {
    apuntesCuentasCeroIzquierda: Apunte[];
}

const TablaEditarIzquierda = ({ apuntesCuentasCeroIzquierda = [] }: TablaEditarIzquierdaProps) => {

    const [columnFilter, setColumnFilter] = useState<ColumnFilter[]>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const selectedRowsApuntesIzquierda = gestionCuentasStore<Apunte[]>(state => state.selectedRowsApuntesIzquierda);
    const setSelectedRowsApuntesIzquierda = gestionCuentasStore(state => state.setSelectedRowsApuntesIzquierda);
    const setImporteTotalApuntesIzquierda = gestionCuentasStore(state => state.setImporteTotalApuntesIzquierda);
    const setListaIdSelIzquierda = gestionCuentasStore(state => state.setListaIdSelIzquierda);

    const importeTotalApuntesIzquierda = gestionCuentasStore(state => state.importeTotalApuntesIzquierda);    

    const size = useWindowSize().width;
    const columns: ColumnDef<any>[] = [
        dateColumn('fecha', 'Fecha', 'fecha', 'editarIzquierda', columnFilter, setColumnFilter, size),
        textColumn('id', 'ID', 'id', 'editarIzquierda', columnFilter, setColumnFilter, size),
        textColumn('descripcion', 'Descripción', 'descripcion', 'editarIzquierda', columnFilter, setColumnFilter, size),
        amountColumn('importe', 'Importe', 'importe', 'editarIzquierda', columnFilter, setColumnFilter, size, sortingImporteCuentasCero),
        textColumn('clave_importe', 'D/H', 'claveImporte', 'editarIzquierda', columnFilter, setColumnFilter, size),
        checkboxColumn('Check', 'check', 'editarIzquierda', size, 'checkbox-verde')
    ]

    useEffect(() => {
        if (apuntesCuentasCeroIzquierda.length > 0) {
            const defaultSelectedIds = apuntesCuentasCeroIzquierda.reduce((acc: Record<string, boolean>, row,index: number) => {
                acc[index] = true; // Marca como seleccionado el ID de cada fila
                return acc;
            }, {});
            setRowSelection(defaultSelectedIds);
        }
    }, [apuntesCuentasCeroIzquierda]);

    useEffect(() => {
        setSelectedRowsApuntesIzquierda(table.getSelectedRowModel().rows.map(row => row.original));
    }, [rowSelection]);

    useEffect(() => {
        // Lógica de edición de conciliación de Apuntes Conciliados
        // Debe Positivo, Haber Negativo
        let totalImporte = selectedRowsApuntesIzquierda.reduce((total, row) => 
            row.clave_importe === 'D' ? (Math.round((total + Number(row.importe)) * 100) / 100) :
            row.clave_importe === 'H' ? (Math.round((total - Number(row.importe)) * 100) / 100) : total, 0
        );

        setImporteTotalApuntesIzquierda(totalImporte);
        setListaIdSelIzquierda(selectedRowsApuntesIzquierda);
    }, [selectedRowsApuntesIzquierda]);

    const table = useReactTable({
        data: apuntesCuentasCeroIzquierda,
        columns,
        columnResizeMode: 'onChange',
        enableRowSelection: true,
        enableSorting: true,
        enableColumnResizing: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            rowSelection,
        },
        onRowSelectionChange: setRowSelection,
    });

    return (
        <Box className="container p-4 pb-0 bg-white rounded-md shadow-md w-full h-full flex flex-col">
            {/* TODO: Añadir título a la empresa */}
            <Box className="flex justify-center mb-2 self-start">Tabla Izquierda</Box>
            <Box className="table-container flex-grow overflow-auto">
                <Box className="table w-full overflow-hidden">
                    <Box className="thead sticky top-0 bg-white z-{-10}">
                        {table.getHeaderGroups().map(headerGroup => (
                            <Box key={headerGroup.id} className="tr">
                                {headerGroup.headers.map(header => (
                                    <Box className={`th th-${header.column.id}`} w={header.getSize()} key={header.id}>
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

                    <Box className='tbody'>
                        {table.getRowModel().rows.map(row => (
                            <Box key={row.id} className="tr">
                                {row.getVisibleCells().map(cell => (
                                    <Box className="td" w={cell.column.getSize()} key={cell.id}>
                                        {cell.column.id === 'descripcion' || cell.column.id === 'Estado' ? (
                                            <Tooltip
                                                label={String(cell.getValue() ?? '')}
                                                className="bg-gray-800 text-white text-xs p-2 rounded shadow-lg"
                                                placement="bottom"
                                            >
                                                <Box>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </Box>
                                            </Tooltip>
                                        ) : (
                                            flexRender(cell.column.columnDef.cell, cell.getContext())
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
            <Box className='w-full flex items-center p-2 mx-auto'>
                <div className='w-full flex justify-end'>
                    <div>
                        <div className={clsx('text-lg m-0 justify-end text-gray-200 font-medium rounded-md w-fit px-10 ', {
                            'bg-red-500 transition-colors duration-300': true,
                            'bg-green-600': false,
                        })}>
                            Total Importe: {new Intl.NumberFormat('es-ES', {
                                style: 'currency',
                                currency: 'EUR',
                            }).format(importeTotalApuntesIzquierda)}
                        </div>
                    </div>
                </div>
            </Box>
        </Box>
    )
}

export default TablaEditarIzquierda;