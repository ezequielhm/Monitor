// 'use client'
// import { apuntesConciliadosType } from '@/lib/definitions';
// import { useStore } from '@/lib/store';
// import Tabla from '@/components/ui/tabla';

// const TablaApuntesEditar = () => {
//     const selectedRowsCuentas: apuntesConciliadosType[] = useStore((state) => state.selectedRowsCuentas);
//     const setSelectedRowsCuentas = useStore((state) => state.setSelectedRowsCuentas);
//     const setImporteTotalCuentasSel = useStore((state) => state.setImporteTotalCuentasSel);
//     const setListaIdSelCuentas = useStore((state) => state.setListaIdSelCuentas);
//     const importeTotalCuentasSel = useStore(state => state.importeTotalCuentasSel);
  
//     return (
//         <Tabla
//             tableType="apuntes"
//             tabla="apuntesEditar"
//             enableRowSelection={true}
//             selectedRows={selectedRowsCuentas}
//             setSelectedRows={setSelectedRowsCuentas}
//             setImporteTotal={setImporteTotalCuentasSel}
//             importeTotal={importeTotalCuentasSel}
//             setListaIdSel={setListaIdSelCuentas}
//         />
//     );
// };

// export default TablaApuntesEditar;


'use client'
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useReactTable, ColumnDef, CellContext, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, FilterFn, RowSelectionState, SortingFn, PaginationState } from '@tanstack/react-table';
import { Box, Checkbox, HStack, IconButton, Select,Spinner, Tooltip } from '@chakra-ui/react';
import { apuntesConciliadosType } from '@/lib/definitions';
import { incidencia } from '@/lib/definitions/incidencia-definition';
import useWindowSize from '@/lib/hooks/use-window-size';
import getSizeBasedOnWidth from '@/lib/hooks/get-size-based-on-width';
import moment from 'moment';
import '@/components/conciliaciones/checkbox.css'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import SortIcon from '../worksheet/sort-icon';
import FilterButton from '../worksheet/filter-button';
import { SinResultados } from '@/components/ui/sin-resultados';
import { asignarTablaVacia } from '@/lib/store';
import { obtenerConExpiracion } from '@/lib/hooks/use-guardar-localStorage-expiracion';

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

const sortingImporte: SortingFn<any> = (rowA, rowB, columnId) => {
    return rowA.original.IMPORTE > rowB.original.IMPORTE ? 1 : rowA.original.IMPORTE < rowB.original.IMPORTE ? -1 : 0;
}

const TablaApuntesEditar = () => {
    const [data, setData] = useState<apuntesConciliadosType[]>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const selectedRowsCuentas: apuntesConciliadosType[] = useStore((state) => state.selectedRowsCuentas);
    const incidencias: incidencia[] = useStore(state => state.incidencias);
    const setSelectedRowsCuentas = useStore((state) => state.setSelectedRowsCuentas);
    
    const [loading, setLoading] = useState(true);  // Estado para manejar si está cargando

    const [pageSize, setPageSize] = useState(20); // Valor por defecto para pageSize
    const [pageIndex, setPageIndex] = useState(0);

    const apuntesConciliados: apuntesConciliadosType[] = useStore((state) => state.apuntesConciliados);
    // estado que inicializa despues de cada fetch y determina si hay resultados
    const tablaSinResultados = useStore(state => state.tablaSinResultados);

    const size = useWindowSize();

    // // Se guarda en el store el totalImporte para utilizarlo en otros componentes al pulsar el botón "Conciliar"
    const setImporteTotalCuentasSel = useStore((state) => state.setImporteTotalCuentasSel);
    const importeTotalCuentasSel = useStore(state => state.importeTotalCuentasSel);
    const setListaIdSelCuentas = useStore((state) => state.setListaIdSelCuentas);
    const setApuntesConciliadosByConciliacion = useStore((state) => state.setApuntesConciliadosByConciliacion);

    const columns: ColumnDef<apuntesConciliadosType>[] = [
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
            size: getSizeBasedOnWidth(size.width, 'fechaApunte', 'apuntesEditar'),
            cell: (props: CellContext<apuntesConciliadosType, unknown>) => {
                const dateValue = props.getValue<string>();
                return <p className='text-left'>{dateValue ? dateValue : 'Invalid Date'}</p>;
            },
            enableColumnFilter: true,
            filterFn: includesString,
        },
        {
            accessorKey: 'ID_Apuntes',
            header: ({ column }) => (
                <HStack>
                    <Box className='th-titulo'>ID</Box>
                    <SortIcon
                        isSorted={column.getIsSorted()}
                        isSortedDesc={column.getIsSorted() === 'desc'}
                        onClick={column.getToggleSortingHandler()}
                    />
                    <FilterButton column={column} columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
                </HStack>
            ),
            size: getSizeBasedOnWidth(size.width, 'id', 'apuntesEditar'),
            cell: (props: CellContext<apuntesConciliadosType, unknown>) => <p className='text-left'>{props.getValue<string>()}</p>,
            enableColumnFilter: true,
            filterFn: includesString,
        },
        {
            accessorKey: 'DESCRI_ASI',
            header: ({ column }) => (
                <HStack>
                    <Box className='th-titulo'>Descripción</Box>
                    <SortIcon
                        isSorted={column.getIsSorted()}
                        isSortedDesc={column.getIsSorted() === 'desc'}
                        onClick={column.getToggleSortingHandler()}
                    />
                    <FilterButton column={column} columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
                </HStack>
            ),
            size: getSizeBasedOnWidth(size.width, 'descripcion', 'apuntesEditar'),
            cell: (props: CellContext<apuntesConciliadosType, unknown>) => <p className='text-left overflow-clip h-5'>{props.getValue<string>()}</p>,
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
            size: getSizeBasedOnWidth(size.width, 'importe', 'apuntesEditar'),
            cell: (props: CellContext<apuntesConciliadosType, unknown>) => <p className='text-right mr-1'>{props.getValue<string>()}</p>,
            enableColumnFilter: true,
            sortingFn: sortingImporte,
            filterFn: includesString,
        },
        {
            accessorKey: 'DebeHaber',
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
            size: getSizeBasedOnWidth(size.width, 'claveImporte', 'apuntesEditar'),
            cell: (props: CellContext<apuntesConciliadosType, unknown>) => <p>{props.getValue<number>()}</p>,
            enableColumnFilter: true,
            filterFn: includesString,
        },
        {
            accessorKey: 'Check',
            size: getSizeBasedOnWidth(size.width, 'check', 'apuntesEditar'),
            header: ({ table }) => {
                console.log("table.getIsAllRowsSelected()", table.getIsAllRowsSelected())
                console.log("table.getIsSomeRowsSelected()", table.getIsSomeRowsSelected())
                return (
                <Checkbox
                    className="checkbox-control checkbox-verde"
                    isChecked={table.getIsAllRowsSelected()}
                    isIndeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            )},
            cell: ({ row }) => (
                <Checkbox
                    className="checkbox-control checkbox-verde"
                    isChecked={row.getIsSelected()}
                    isDisabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
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
        const defaultSelectedIds = data.reduce((acc: Record<string, boolean>, row: any, index: number) => {
            acc[index] = true;
            return acc;
        }, {});
        setRowSelection(defaultSelectedIds);
        // if (data.length === 0) setTablaCargada(true);
    }, [data]);

    useEffect(() => {
        // Lógica de edición de conciliación de Apuntes Conciliados
        // Debe Positivo, Haber Negativo

        let totalImporte = selectedRowsCuentas.reduce((total, row) =>
            row.DebeHaber === 'D' ? (Math.round((total + Number(row.IMPORTE)) * 100) / 100) :
            row.DebeHaber === 'H' ? (Math.round((total - Number(row.IMPORTE)) * 100) / 100) : total, 0
        );
        setImporteTotalCuentasSel(totalImporte);
        setListaIdSelCuentas(selectedRowsCuentas);
    }, [selectedRowsCuentas]);

    useEffect(() => {
        if (apuntesConciliados.length > 0) {

            setData(apuntesConciliados
                .map((apunte) => ({
                    ...apunte,
                    Fecha: moment(apunte.FechaApunte).format('DD/MM/YYYY'),
                    impString: new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                    })
                        .format(Number(apunte.IMPORTE))
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
                })));
            setLoading(false);  // Datos cargados, detener el estado de carga

        } else {
            setLoading(false);  // Si no hay datos, sigue mostrando "Cargando..."
        }

        const isTablaVacia = (apuntesConciliados.length === 0);
        asignarTablaVacia('apuntes', isTablaVacia);
    }, [apuntesConciliados]);

    const paginatedData = data.slice(
        pagination.pageIndex * pagination.pageSize, // Inicio de la página
        (pagination.pageIndex + 1) * pagination.pageSize // Fin de la página
    );

    useEffect(() => {
        // console.log('Column Filters:', columnFilters);
    }, [columnFilters]);


    useEffect(() => {
        setSelectedRowsCuentas(table.getSelectedRowModel().rows.map(row => row.original));
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
            <Box className='flex justify-center mb-2 self-start'>Editar Apuntes Conciliados</Box>
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
                    {tablaSinResultados.apuntes ? <SinResultados tabla="editar" /> :
                        <Box className='tbody'>
                            {table.getRowModel().rows.map(row => (
                                <Box className={`tr ${incidencias.some(incidencia => incidencia.Tipo_Incidencia === 'asientosModificados' && incidencia.ID === row.original.ID) ? 'bg-red-300' : ''}`} key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <Tooltip
                                            label={`${cell.column.id === 'DESCRI_ASI' ? cell.getValue() ?? '' : ''}`}
                                            className="bg-gray-800 text-white text-xs p-2 rounded shadow-lg bottom-4"
                                            placement='bottom'
                                            visibility={cell.column.id === 'DESCRI_ASI' || cell.column.id === 'Estado' ? 'visible' : 'hidden'}
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
            <Box className='w-full flex justify-around items-center p-1 mx-auto'>
                <Box className="pagination-controls text-sm">
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
                            <option key={pageSize} value={pageSize}>
                                Mostrar {pageSize}
                            </option>
                        ))}
                    </Select>
                </Box>
                <div className='w-full flex justify-end'>
                    <div>
                        <div className={'text-lg m-0 justify-end text-gray-200 font-medium rounded-md w-fit px-10 bg-red-500 transition-colors duration-300'}>
                            Total Importe: {new Intl.NumberFormat('es-ES', {
                                style: 'currency',
                                currency: 'EUR',
                                }).format(importeTotalCuentasSel)}
                        </div>
                    </div>
                </div>
            </Box>
            </>
            )}
        </Box>
    );
};

export default TablaApuntesEditar;
