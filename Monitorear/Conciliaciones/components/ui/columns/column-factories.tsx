import React from 'react';
import { ColumnDef, SortingFn, FilterFn, CellContext } from '@tanstack/react-table';
import getSizeBasedOnWidth from '@/lib/hooks/get-size-based-on-width';
import { Checkbox, Box } from '@chakra-ui/react';
import moment from 'moment';
import StatusCell from '@/components/worksheet/status-cells';
import EditableCell from '@/components/worksheet/editable-cells';
import { EditIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import SortIcon from '@/components/worksheet/sort-icon';
import FilterButton from '@/components/worksheet/filter-button';
import ColorCell from '@/components/revision/color-cell';

export interface ColumnFilter {
    id: string;
    value: any;
}

export const includesString: FilterFn<any> = (row, columnId, filterValue) => {
    const cell = String(row.getValue(columnId) ?? '').toLowerCase();
    if (Array.isArray(filterValue)) return filterValue.some(v => cell.includes(String(v).toLowerCase()));
    return cell.includes(String(filterValue).toLowerCase());
};

export const estadoFilter: FilterFn<any> = (row, columnId, filterValue) => {
    const val = row.getValue(columnId);
    if (!val) return false;
    const filterVals = Array.isArray(filterValue) ? filterValue : [filterValue];
    return filterVals.includes(val);
};

export const sortingFecha: SortingFn<any> = (rowA, rowB, columnId) => {
    const da = moment(rowA.getValue<string>(columnId), 'DD/MM/YYYY').toDate();
    const db = moment(rowB.getValue<string>(columnId), 'DD/MM/YYYY').toDate();
    return da > db ? 1 : da < db ? -1 : 0;
};

export const sortingImporte: SortingFn<any> = (rowA, rowB) =>
    rowA.original.IMPORTE > rowB.original.IMPORTE ? 1 : rowA.original.IMPORTE < rowB.original.IMPORTE ? -1 : 0;

export const sortingImporteCuentasCero: SortingFn<any> = (rowA, rowB) =>
    rowA.original.importe > rowB.original.importe ? 1 : rowA.original.importe < rowB.original.importe ? -1 : 0;

function renderHeader(
    title: string,
    columnFilters: ColumnFilter[],
    setColumnFilters: Dispatch<SetStateAction<ColumnFilter[]>>,
    estados_?: any
) {
    function HeaderComponent({ column }: { column: any }) {
        return (
            <Box display="flex" alignItems="center" gap="1">
                <Box className="th-titulo">{title}</Box>
                <SortIcon
                    isSorted={column.getIsSorted()}
                    isSortedDesc={column.getIsSorted() === 'desc'}
                    onClick={column.getToggleSortingHandler()}
                />
                <FilterButton
                    column={column}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    estados_={estados_}
                />
            </Box>
        );
    }

    HeaderComponent.displayName = `Header_${title}`;
    return HeaderComponent;
}

export function textColumn<T>(
    accessorKey: keyof T,
    title: string,
    sizeKey: string,
    tabla: string,
    columnFilters: ColumnFilter[],
    setColumnFilters: Dispatch<SetStateAction<ColumnFilter[]>>,
    size: number,
    filterFn: FilterFn<T> = includesString
): ColumnDef<T> {
    return {
        accessorKey: String(accessorKey),
        header: renderHeader(title, columnFilters, setColumnFilters),
        size: getSizeBasedOnWidth(size, sizeKey, tabla),
        cell: (ctx: CellContext<T, any>) => {
            const value = ctx.getValue();
            if (Array.isArray(value)) return <p className="overflow-clip h-5 text-center">{value.join(', ')}</p>;
            return <p className="overflow-clip h-5 text-center">{value ?? ''}</p>;
        },
        enableColumnFilter: true,
        filterFn
    };
}

export function dateColumn<T>(
    accessorKey: keyof T,
    title: string,
    sizeKey: string,
    tabla: string,
    columnFilters: ColumnFilter[],
    setColumnFilters: Dispatch<SetStateAction<ColumnFilter[]>>,
    size: number,
    sortingFn: SortingFn<T> = sortingFecha,
    formatDate: boolean = true
): ColumnDef<T> {
    return {
        accessorKey: String(accessorKey),
        header: renderHeader(title, columnFilters, setColumnFilters),
        size: getSizeBasedOnWidth(size, sizeKey, tabla),
        cell: (ctx: CellContext<T, unknown>) => {
            const raw = ctx.getValue() as string;
            if (!raw) return <p className="text-left">{''}</p>;
            return <p className="text-left">{formatDate ? moment(raw).format('DD/MM/YYYY') : raw}</p>;
        },
        enableColumnFilter: true,
        filterFn: includesString,
        sortingFn
    };
}

export function amountColumn<T>(
    accessorKey: keyof T,
    title: string,
    sizeKey: string,
    tabla: string,
    columnFilters: ColumnFilter[],
    setColumnFilters: Dispatch<SetStateAction<ColumnFilter[]>>,
    size: number,
    sortingFn: SortingFn<T> = sortingImporte,
    formatCurrency: boolean = true
): ColumnDef<T> {
    return {
        accessorKey: String(accessorKey),
        header: renderHeader(title, columnFilters, setColumnFilters),
        size: getSizeBasedOnWidth(size, sizeKey, tabla),
        cell: (ctx: CellContext<T, any>) => {
            const value = ctx.getValue();
            const amount = typeof value === 'number' ? value : Number(value ?? 0);
            return (
                <p className="text-right mr-1">
                    {formatCurrency
                        ? new Intl.NumberFormat('es-ES', {
                              style: 'currency',
                              currency: 'EUR',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                              useGrouping: true,
                          }).format(amount)
                        : amount.toLocaleString('es-ES')}
                </p>
            );
        },
        enableColumnFilter: true,
        filterFn: includesString,
        sortingFn
    };
}

export function checkboxColumn<T>(
    accessorKey: keyof T,
    sizeKey: string,
    tabla: string,
    size: number,
    colorClass: string,
): ColumnDef<T> {
    return {
        accessorKey: String(accessorKey),
        size: getSizeBasedOnWidth(size, sizeKey, tabla),
        header: ({ table }) => (
            <Checkbox
                className={`checkbox-control ${colorClass}`}
                isChecked={table.getIsAllRowsSelected()}
                isIndeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                className={`checkbox-control ${colorClass}`}
                isChecked={row.getIsSelected()}
                isDisabled={!row.getCanSelect()}
                onChange={row.getToggleSelectedHandler()}
            />
        )
    };
}

export function statusColumn<T>(
    accessorKey: keyof T,
    title: string,
    sizeKey: string,
    tabla: string,
    columnFilters: ColumnFilter[],
    setColumnFilters: Dispatch<SetStateAction<ColumnFilter[]>>,
    size: number,
    tipo: 'apuntes' | 'bancos',
    idKey: keyof T
): ColumnDef<T> {
    return {
        accessorKey: String(accessorKey),
        header: renderHeader(title, columnFilters, setColumnFilters),
        size: getSizeBasedOnWidth(size, sizeKey, tabla),
        cell: ({ row, column, table, getValue, renderValue, cell }) => (
            <StatusCell row={row} column={column} table={table} getValue={getValue} renderValue={renderValue} cell={cell} id={String(row.original[idKey])} tipo={tipo} />
        ),
        enableColumnFilter: true,
        enableSorting: false,
        filterFn: estadoFilter
    };
}

export function editableColumn<T>(
    accessorKey: keyof T,
    title: string,
    sizeKey: string,
    tabla: string,
    columnFilters: ColumnFilter[],
    setColumnFilters: Dispatch<SetStateAction<ColumnFilter[]>>,
    size: number,
    idKey: keyof T
): ColumnDef<T> {
    return {
        accessorKey: String(accessorKey),
        header: renderHeader(title, columnFilters, setColumnFilters),
        size: getSizeBasedOnWidth(size, sizeKey, tabla),
        cell: ({ row, column, table, getValue, renderValue, cell }) => (
            <EditableCell row={row} column={column} table={table} getValue={getValue} renderValue={renderValue} cell={cell} id={String(row.original[idKey])} />
        ),
        enableColumnFilter: true,
        enableSorting: false,
        filterFn: includesString
    };
}

export function optionsColumn<T>(
    idConciliacionKey: keyof T,
    idKey: keyof T,
    sizeKey: string,
    tabla: string,
    size: number,
    prefix: string = '/editar'
): ColumnDef<T> {
    return {
        accessorKey: 'Opciones',
        header: () => <Box className="th-titulo">Opciones</Box>,
        size: getSizeBasedOnWidth(size, sizeKey, tabla),
        cell: ({ row }) => {
            const idConciliacion = row.original[idConciliacionKey];
            if (idConciliacion == null) return <Box className="flex justify-center items-center" />;
            return (
                <Box className="flex justify-center items-center">
                    <Box className="flex items-center gap-1">
                        <EditIcon />
                        <Link
                            href={`${prefix}/${idConciliacion}`}
                            target="_blank"
                            className="bg-gray-300 px-[0.4em] rounded-sm text-xs"
                        >
                            Editar
                        </Link>
                    </Box>
                </Box>
            );
        },
        enableColumnFilter: true,
        enableSorting: false,
        filterFn: includesString
    };
}

export function activoColumn<T extends { activo: boolean }>(
    accessorKey: keyof T,
    title: string,
    sizeKey: string,
    tabla: string,
    columnFilters: ColumnFilter[],
    setColumnFilters: Dispatch<SetStateAction<ColumnFilter[]>>,
    size: number
): ColumnDef<T> {
    return {
        accessorKey: String(accessorKey),
        header: renderHeader(title, columnFilters, setColumnFilters),
        size: getSizeBasedOnWidth(size, sizeKey, tabla),
        cell: ({ row }) => <p>{row.original.activo ? 'S' : 'N'}</p>,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
            const value = row.original.activo ? 'S' : 'N';
            return filterValue.includes(value);
        }
    };
}

export function readonlyStatusColumn<T>(
    accessorKey: keyof T,
    title: string,
    sizeKey: string,
    tabla: string,
    size: number,
    tipo: 'bancos' | 'apuntes'
): ColumnDef<T> {
    return {
        accessorKey: String(accessorKey),
        header: () => <Box className="th-titulo">{title}</Box>,
        size: getSizeBasedOnWidth(size, sizeKey, tabla),
        cell: ({ row, column, table, getValue, renderValue, cell }) => (
            <ColorCell
                row={row}
                column={column}
                table={table}
                getValue={getValue}
                renderValue={renderValue}
                cell={cell}
                id={String(row.getValue('ID') ?? '')}
                tipo={tipo}
            />
        ),
        enableColumnFilter: false,
        enableSorting: false
    };
}

export function readonlyEditableColumn<T>(
    accessorKey: keyof T,
    title: string,
    sizeKey: string,
    tabla: string,
    size: number
): ColumnDef<T> {
    return {
        accessorKey: String(accessorKey),
        header: () => <Box className="th-titulo">{title}</Box>,
        size: getSizeBasedOnWidth(size, sizeKey, tabla),
        cell: (ctx) => <TruncatedText>{ctx.getValue() as React.ReactNode ?? ''}</TruncatedText>,
        enableColumnFilter: false,
        enableSorting: false
    };
}

const TruncatedText = ({ children }: { children: React.ReactNode }) => {
    if (
        children === null ||
        children === undefined ||
        children === 'null' ||
        children === 'undefined'
    ) {
        return <p className="overflow-hidden whitespace-nowrap text-ellipsis">{''}</p>;
    }

    return (
        <p className="overflow-hidden whitespace-nowrap text-ellipsis">
            {children}
        </p>
    );
};

TruncatedText.displayName = 'TruncatedText';
