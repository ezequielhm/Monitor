// 'use client'
// import { useStore } from '@/lib/store';
// import { movimientosConciliadosType } from '@/lib/definitions';
// import Tabla from '@/components/ui/tabla';
// import { useEffect } from 'react';

// const TablaBancosEditar = () => {
//     const selectedRowsBancos: movimientosConciliadosType[] = useStore((state) => state.selectedRowsBancos);
//     const setSelectedRowsBancos = useStore((state) => state.setSelectedRowsBancos);
//     const setImporteTotalBacnSel = useStore((state) => state.setImporteTotalBacnSel);
//     const setListaIdSelBancos = useStore((state) => state.setListaIdSelBancos);
//     const importeTotalBacnSel = useStore(state => state.importeTotalBacnSel);
  
//     return (
//         <Tabla
//             tableType="bancos"
//             tabla="bancosEditar"
//             enableRowSelection={true}
//             selectedRows={selectedRowsBancos}
//             setSelectedRows={setSelectedRowsBancos}
//             setImporteTotal={setImporteTotalBacnSel}
//             importeTotal={importeTotalBacnSel}
//             setListaIdSel={setListaIdSelBancos}
//         />
//     );
// };

// export default TablaBancosEditar;


'use client'
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useReactTable, ColumnDef, CellContext, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, FilterFn, RowSelectionState, SortingFn, PaginationState } from '@tanstack/react-table';
import { Box, Checkbox, HStack, IconButton, Select, Spinner, Tooltip } from '@chakra-ui/react';
import { movimientosConciliadosType } from '@/lib/definitions';
import useWindowSize from '@/lib/hooks/use-window-size';
import getSizeBasedOnWidth from '@/lib/hooks/get-size-based-on-width';
import moment from 'moment';
import '@/components/conciliaciones/checkbox.css'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import SortIcon from '../worksheet/sort-icon';
import FilterButton from '../worksheet/filter-button';
import clsx from 'clsx';
import { SinResultados } from '@/components/ui/sin-resultados';
import { asignarTablaVacia } from '@/lib/store';

interface ColumnFilter {
    id: string;
    value: any;
}

const includesString: FilterFn<any> = (row, columnId, filterValue) => {
    const cellValue = row.getValue(columnId);
    if (Array.isArray(filterValue)) {
        return filterValue.some(value => String(cellValue).toLowerCase().includes(String(value).toLowerCase()));
    }
    return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
};

const sortingImporte: SortingFn<movimientosConciliadosType> = (rowA, rowB, columnId) => {
    return rowA.original.IMPORTE > rowB.original.IMPORTE ? 1 : rowA.original.IMPORTE < rowB.original.IMPORTE ? -1 : 0;
}

const TablaBancosEditar = () => {
    const [data, setData] = useState<movimientosConciliadosType[]>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const selectedRowsBancos: movimientosConciliadosType[] = useStore((state) => state.selectedRowsBancos);
    const setSelectedRowsBancos = useStore((state) => state.setSelectedRowsBancos);
    const [loading, setLoading] = useState(true);  // Estado para manejar si está cargando
    const [pageSize, setPageSize] = useState(20); // Valor por defecto para pageSize
    const [pageIndex, setPageIndex] = useState(0);

    const movimientosConciliados: movimientosConciliadosType[] = useStore((state) => state.movimientosConciliados);
    // estado que inicializa despues de cada fetch y determina si hay resultados
    const tablaSinResultados = useStore(state => state.tablaSinResultados);

    const size = useWindowSize();

    // // Se guarda en el store el totalImporte para utilizarlo en otros componentes al pulsar el botón "Conciliar"
    const setImporteTotalBacnSel = useStore((state) => state.setImporteTotalBacnSel);
    const setListaIdSelBancos = useStore((state) => state.setListaIdSelBancos);
    const setMovimientosConciliadosByConciliacion = useStore(state => state.setMovimientosConciliadosByConciliacion);
    const importeTotalBacnSel = useStore(state => state.importeTotalBacnSel);

    const listaIdStore = useStore((state) => state.listaIdSelBancos);

    const columns: ColumnDef<movimientosConciliadosType>[] = [
        {
            accessorKey: 'Check',
            size: getSizeBasedOnWidth(size.width, 'check', 'bancosEditar'),
            header: ({ table }) => (
                <Checkbox
                    className="checkbox-control checkbox-rojo"
                    isChecked={table.getIsAllRowsSelected()}
                    isIndeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    className="checkbox-control checkbox-rojo"
                    isChecked={row.getIsSelected()}
                    isDisabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
        },
        {
            accessorKey: 'Fecha',
            header: ({ column }) => (
                <HStack>
                    <Box className='th-titulo'>Fecha</Box>
                    <SortIcon
                        isSorted={column.getIsSorted()}
                        isSortedDesc={column.getIsSorted() === 'desc'}
                        onClick={column.getToggleSortingHandler()}
                    />
                    <FilterButton column={column} columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
                </HStack>
            ),
            size: getSizeBasedOnWidth(size.width, 'fechaMovimiento', 'bancosEditar'),
            cell: (props: CellContext<movimientosConciliadosType, unknown>) => {
                const dateValue = props.getValue<string>();
                return <p className='text-left'>{dateValue ? dateValue : 'Invalid Date'}</p>;
            },
            enableColumnFilter: true,
            filterFn: includesString,
        },
        {
            accessorKey: 'info_1',
            header: ({ column }) => (
                <HStack>
                    <Box className='th-titulo'>Info 1</Box>
                    <SortIcon
                        isSorted={column.getIsSorted()}
                        isSortedDesc={column.getIsSorted() === 'desc'}
                        onClick={column.getToggleSortingHandler()}
                    />
                    <FilterButton column={column} columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
                </HStack>
            ),
            size: getSizeBasedOnWidth(size.width, 'info_1', 'bancosEditar'),
            cell: (props: CellContext<movimientosConciliadosType, unknown>) => <p className='text-left overflow-clip h-5'>{props.getValue<string>()}</p>,
            enableColumnFilter: true,
            filterFn: includesString,
        },
        {
            accessorKey: 'info_2',
            header: ({ column }) => (
                <HStack>
                    <Box className='th-titulo'>Info 2</Box>
                    <SortIcon
                        isSorted={column.getIsSorted()}
                        isSortedDesc={column.getIsSorted() === 'desc'}
                        onClick={column.getToggleSortingHandler()}
                    />
                    <FilterButton column={column} columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
                </HStack>
            ),
            size: getSizeBasedOnWidth(size.width, 'info_2', 'bancosEditar'),
            cell: (props: CellContext<movimientosConciliadosType, unknown>) => <p className='text-left overflow-clip h-5'>{props.getValue<string>()}</p>,
            enableColumnFilter: true,
            filterFn: includesString,
        },
        {
            accessorKey: 'info_3_4',
            header: ({ column }) => (
                <HStack>
                    <Box className='th-titulo'>Info 3 - 4</Box>
                    <SortIcon
                        isSorted={column.getIsSorted()}
                        isSortedDesc={column.getIsSorted() === 'desc'}
                        onClick={column.getToggleSortingHandler()}
                    />
                    <FilterButton column={column} columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
                </HStack>
            ),
            size: getSizeBasedOnWidth(size.width, 'info_3_4', 'bancosEditar'),
            cell: (props: CellContext<movimientosConciliadosType, unknown>) => <p className='text-left overflow-clip h-5'>{props.getValue<string>()}</p>,
            enableColumnFilter: true,
            filterFn: includesString,
        },
        {
            accessorKey: 'info_5',
            header: ({ column }) => (
                <HStack>
                    <Box className='th-titulo'>Info 5</Box>
                    <SortIcon
                        isSorted={column.getIsSorted()}
                        isSortedDesc={column.getIsSorted() === 'desc'}
                        onClick={column.getToggleSortingHandler()}
                    />
                    <FilterButton column={column} columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
                </HStack>
            ),
            size: getSizeBasedOnWidth(size.width, 'info_5', 'bancosEditar'),
            cell: (props: CellContext<movimientosConciliadosType, unknown>) => <p className='text-left overflow-clip h-5'>{props.getValue<string>()}</p>,
            enableColumnFilter: true,
            filterFn: includesString,
        },
        {
            accessorKey: 'impString',
            header: ({ column }) => (
                <HStack>
                    <Box className='th-titulo'>Importe</Box>
                    <SortIcon
                        isSorted={column.getIsSorted()}
                        isSortedDesc={column.getIsSorted() === 'desc'}
                        onClick={column.getToggleSortingHandler()}
                    />
                    <FilterButton column={column} columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
                </HStack>
            ),
            size: getSizeBasedOnWidth(size.width, 'importe', 'bancosEditar'),
            cell: (props: CellContext<movimientosConciliadosType, unknown>) => <p className='text-right mr-1'>{props.getValue<string>()}</p>,
            enableColumnFilter: true,
            sortingFn: sortingImporte,
            filterFn: includesString,
        },
        {
            accessorKey: 'claveDebeHaber',
            header: ({ column }) => (
                <HStack>
                    <Box className='th-titulo'>D/H</Box>
                    <SortIcon
                        isSorted={column.getIsSorted()}
                        isSortedDesc={column.getIsSorted() === 'desc'}
                        onClick={column.getToggleSortingHandler()}
                    />
                    <FilterButton column={column} columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
                </HStack>
            ),
            size: getSizeBasedOnWidth(size.width, 'claveImporte', 'bancosEditar'),
            cell: (props: CellContext<movimientosConciliadosType, unknown>) => <p>{props.getValue<number>()}</p>,
            enableColumnFilter: true,
            filterFn: includesString,
        },
    ];

    // Definir el estado de paginación usando PaginationState
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,   // Página inicial
        pageSize: 20,   // Tamaño de página inicial
    });

    // Actualización del estado de paginación utilizando el tipo `Updater<PaginationState>`
    const handlePaginationChange: any = (updater:any) => {
        setPagination((prevState) => {
            // Si el `updater` es una función, llamamos a la función con el estado anterior
            if (typeof updater === 'function') {
                return updater(prevState);
            }

            // Si es un objeto (nuevo estado de paginación), lo combinamos con el estado anterior
            return {
                ...prevState,
                ...updater,
            };
        });
    };

    useEffect(() => {
        // Lógica de conciliación de Movimientos Bancarios
        // Debe Positivo, Haber Negativo
        // console.warn('selectedRowsBancos:', selectedRowsBancos);
        const totalImporte = selectedRowsBancos.reduce((total, row) =>
            row.claveDebeHaber === 'H' ? (Math.round((total + Number(row.IMPORTE)) * 100) / 100) :
            row.claveDebeHaber === 'D' ? (Math.round((total - Number(row.IMPORTE)) * 100) / 100) : total, 0);
        setImporteTotalBacnSel(totalImporte);
        setListaIdSelBancos(selectedRowsBancos);    
    }, [selectedRowsBancos]);

    useEffect(() => {
        if (data.length > 0) {
            const defaultSelectedIds = data.reduce((acc: Record<string, boolean>, row: any, index: number) => {
                acc[row.ID] = true;
                return acc;
            }, {});
            setRowSelection(defaultSelectedIds);
        }
    }, [data]);


    useEffect(() => {
        if (movimientosConciliados.length > 0) {
            // console.log('Movimientos Conciliados:', movimientosConciliados);
            setData(movimientosConciliados
                .map((movimiento) => ({
                    ...movimiento,
                    Fecha: moment(movimiento.FechaMovimiento).format('DD/MM/YYYY'),
                    impString: new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                    })
                        .format(Number(movimiento.IMPORTE))
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
                }))
            );
            setLoading(false);  // Datos cargados, detener el estado de carga

        } else {
            setLoading(false);  // Si no hay datos, sigue mostrando "Cargando..."

        }
        const isTablaVacia = (movimientosConciliados.length === 0);
        asignarTablaVacia('bancos', isTablaVacia);
    }, [movimientosConciliados]);

    const paginatedData = data.slice(
        pagination.pageIndex * pagination.pageSize, // Inicio de la página
        (pagination.pageIndex + 1) * pagination.pageSize // Fin de la página
    );

    useEffect(() => {
        // console.log('Column Filters:', columnFilters);
    }, [columnFilters]);


    useEffect(() => {
        // console.warn('ROW SELECTION: ', rowSelection);
        
        setSelectedRowsBancos(table.getSelectedRowModel().rows.map(row => row.original));
        // console.log('ROWS: ', table.getSelectedRowModel().rows.map(row => row.original))
    }, [rowSelection]);

    const table = useReactTable({
        data: paginatedData,
        columns,
        manualPagination: true,  // Habilitar paginación manual
        pageCount: Math.ceil(data.length / pagination.pageSize), // Controlar el número de páginas manualmente
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getRowId: row => String(row.ID),
        columnResizeMode: "onChange",
        state: {
            columnFilters,
            rowSelection,
            pagination,
        },
        onPaginationChange: handlePaginationChange,
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
    });

    // {console.log('Row Selection: ',table.getState().rowSelection)}
    return (
        <Box className="container p-4 pb-0 bg-white rounded-md shadow-md w-full h-full flex flex-col">
            {loading ? (
                <Box className="flex justify-center items-center h-full">
                    <Spinner size="xl" color="red.500" />
                    <Box ml={2}>Cargando...</Box>
                </Box>
            ) : (
                <>
                    <Box className='flex justify-center mb-2 self-start'>Editar Movimientos Bancarios Conciliados</Box>
                    <Box className="table-container flex-grow overflow-auto">
                        <Box className='table w-full overflow-hidden'>
                            <Box className='thead sticky top-0 bg-white z-{-10}'>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <Box className='tr' key={headerGroup.id}>
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
                            {tablaSinResultados.bancos ? <SinResultados tabla="editar" /> :
                                <Box className='tbody'>
                                    {table.getRowModel().rows.map(row => (
                                        <Box className='tr' key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <Tooltip
                                                    label={`${cell.column.id === 'descripcionTipoMovimiento' ? cell.getValue() ?? '' : cell.column.id === 'comentarios' ? cell.getValue() : ''}`}
                                                    className="bg-gray-800 text-white text-xs p-2 rounded shadow-lg bottom-4"
                                                    placement='bottom'
                                                    visibility={cell.column.id === 'descripcionTipoMovimiento' || cell.column.id === 'comentarios' ? 'visible' : 'hidden'}
                                                    key={cell.id}
                                                >
                                                    <Box className='td' w={cell.column.getSize()} key={cell.id}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </Box>
                                                </Tooltip>
                                            ))}
                                        </Box>
                                    ))}
                                </Box>
                            }
                        </Box>
                    </Box>
                    <Box className='w-full flex items-center p-1 mx-auto'>
                        <div className='w-full flex justify-start'>
                            <div>
                                <div className={clsx('text-lg m-0 justify-end text-gray-200 font-medium rounded-md w-fit px-10 ', {
                                    'bg-red-500 transition-colors duration-300': true,
                                    'bg-green-600': false,
                                })}>
                                    Total Importe: {new Intl.NumberFormat('es-ES', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(importeTotalBacnSel)}
                                </div>
                            </div>
                        </div>
                        <Box className="pagination-controls flex justify-end text-sm">
                            {table.getCanPreviousPage() && (
                                <IconButton
                                    icon={<ChevronLeftIcon />}
                                    onClick={() => table.previousPage()}
                                    isDisabled={!table.getCanPreviousPage()}
                                    aria-label="Previous page"
                                />
                            )}
                            <span className='mx-1'>
                                Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                            </span>
                            {table.getCanNextPage() && (
                                <IconButton
                                    icon={<ChevronRightIcon />}
                                    onClick={() => table.nextPage()}
                                    isDisabled={!table.getCanNextPage()}
                                    aria-label="Next page"
                                />
                            )}
                            <Select
                                value={table.getState().pagination.pageSize}
                                onChange={e => {
                                    table.setPageSize(Number(e.target.value))
                                }}
                                mx={5}
                                width={"fit"}
                                className='border border-gray-300 rounded-md w-fit text-sm'
                            >
                                {[20, 30, 40, 50, 100, 150, 200].map(pageSize => (
                                    <option key={pageSize} value={pageSize} >
                                        Mostrar {pageSize}
                                    </option>
                                ))}
                            </Select>
                        </Box>
                    </Box>
                    </>
            )}
                </Box>
            );
};

            export default TablaBancosEditar;
