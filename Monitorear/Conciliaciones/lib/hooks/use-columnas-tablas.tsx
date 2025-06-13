import { ColumnConfig } from '@/lib/hooks/use-generar-columnas';
import { CellContext } from '@tanstack/react-table';
import { ApunteContable, MovimientoBancario } from '@/lib/definitions';
import { Checkbox } from '@chakra-ui/react';
import EditableCell from '@/components/worksheet/editable-cells';
import StatusCell from '@/components/worksheet/status-cells';


export const apuntesConciliarColumns: ColumnConfig[] = [
    {
        accessorKey: 'Fecha',
        nombre: 'Fecha',
        headerContent: undefined,  // Usará el header predeterminado con sort y filter buttons
        cellContent: (props: CellContext<ApunteContable, unknown>) => {
        const dateValue = props.getValue<string>();
        return <p>{dateValue ? dateValue : 'Invalid Date'}</p>;
        },
        sortIcon: true,
        nombreSize: 'fecha',
        filterFn: 'includesString',
        sortingFn: 'sortingFecha',
    },
    {
        accessorKey: 'ID',
        nombre: 'ID',
        headerContent: undefined,
        cellContent: (props: CellContext<ApunteContable, unknown>) => {
        return <p className='text-left overflow-clip h-5'>{props.getValue<string>()}</p>;
        },
        sortIcon: true,
        nombreSize: 'id',
        filterFn: 'includesString',
    },
    {
        accessorKey: 'DESCRI_ASI',
        nombre: 'Descripción',
        headerContent: undefined,
        cellContent: (props: CellContext<ApunteContable, unknown>) => {
        return <p className='text-left overflow-clip h-5'>{props.getValue<string>()}</p>;
        },
        sortIcon: true,
        nombreSize: 'descripcion',
        filterFn: 'includesString',
    },
    {
        accessorKey: 'impString',
        nombre: 'Importe',
        headerContent: undefined,
        cellContent: (props: CellContext<ApunteContable, unknown>) => {
        return <p className='text-right mr-1'>{props.getValue<string>()}</p>;
        },
        sortIcon: true,
        nombreSize: 'importe',
        sortingFn: 'sortingImporte',
        filterFn: 'includesString',
    },
    {
        accessorKey: 'CLAVE_IMPORTE',
        nombre: 'D/H',
        headerContent: undefined,
        cellContent: (props: CellContext<ApunteContable, unknown>) => {
        return <p>{props.getValue<number>()}</p>;
        },
        sortIcon: true,
        nombreSize: 'claveImporte',
        filterFn: 'includesString',
    },
    {
        accessorKey: 'Check',
        headerContent: ({ table }) => (
                <Checkbox
                    className="checkbox-control checkbox-verde"
                    isChecked={table.getIsAllRowsSelected()}
                    isIndeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()} //or getToggleAllPageRowsSelectedHandler
                />
            ),
        cellContent: ({ row }) => (
                <Checkbox
                    className="checkbox-control checkbox-verde"
                    isChecked={row.getIsSelected()}
                    isDisabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
        sortIcon: true,
        nombreSize: 'check',
    },
];

export const bancosConciliarColumns: ColumnConfig[] = [
    {
        accessorKey: 'Check',
        headerContent: ({ table }) => (
                <Checkbox
                    className="checkbox-control checkbox-rojo"
                    isChecked={table.getIsAllRowsSelected()}
                    isIndeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()} //or getToggleAllPageRowsSelectedHandler
                />
            ),
        cellContent: ({ row }) => (
                <Checkbox
                    className="checkbox-control checkbox-rojo"
                    isChecked={row.getIsSelected()}
                    isDisabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
        sortIcon: true,
        nombreSize: 'check',
    },
    {
        accessorKey: 'Fecha',
        nombre: 'Fecha',
        headerContent: undefined,  // Usará el header predeterminado con sort y filter buttons
        cellContent: (props: CellContext<MovimientoBancario, unknown>) => {
        const dateValue = props.getValue<string>();
        return <p className='text-left'>{dateValue ? dateValue : 'Invalid Date'}</p>;
        },
        sortIcon: true,
        nombreSize: 'fecha',
        filterFn: 'includesString',
        sortingFn: 'sortingFecha',
    },
    {
        accessorKey: 'info_1',
        nombre: 'Info 1',
        headerContent: undefined,
        cellContent: (props: CellContext<MovimientoBancario, unknown>) => {
        return <p className='text-left overflow-clip h-5'>{props.getValue<string>()}</p>;
        },
        sortIcon: true,
        nombreSize: 'info_1',
        filterFn: 'includesString',
    },
    {
        accessorKey: 'info_2',
        nombre: 'Info 2',
        headerContent: undefined,
        cellContent: (props: CellContext<MovimientoBancario, unknown>) => {
        return <p className='text-left overflow-clip h-5'>{props.getValue<string>()}</p>;
        },
        sortIcon: true,
        nombreSize: 'info_2',
        filterFn: 'includesString',
    },
    {
        accessorKey: 'info_3_4',
        nombre: 'Info 3 - 4',
        headerContent: undefined,
        cellContent: (props: CellContext<MovimientoBancario, unknown>) => {
        return <p className='text-left overflow-clip h-5'>{props.getValue<string>()}</p>;
        },
        sortIcon: true,
        nombreSize: 'info_3_4',
        filterFn: 'includesString',
    },
    {
        accessorKey: 'info_5',
        nombre: 'Info 5',
        headerContent: undefined,
        cellContent: (props: CellContext<MovimientoBancario, unknown>) => {
        return <p className='text-left overflow-clip h-5'>{props.getValue<string>()}</p>;
        },
        sortIcon: true,
        nombreSize: 'info_5',
        filterFn: 'includesString',
    },
    {
        accessorKey: 'impString',
        nombre: 'Importe',
        headerContent: undefined,
        cellContent: (props: CellContext<MovimientoBancario, unknown>) => {
        return <p className='text-right mr-1'>{props.getValue<string>()}</p>;
        },
        sortIcon: true,
        nombreSize: 'importe',
        sortingFn: 'sortingImporte',
        filterFn: 'includesString',
    },
    {
        accessorKey: 'claveDebeHaber',
        nombre: 'D/H',
        headerContent: undefined,
        cellContent: (props: CellContext<MovimientoBancario, unknown>) => {
        return <p>{props.getValue<number>()}</p>;
        },
        sortIcon: true,
        nombreSize: 'claveImporte',
        filterFn: 'includesString',
    },
];

export const apuntesWorksheetColumns: ColumnConfig[] = [
    {
        accessorKey: 'Fecha',
        nombre: 'Fecha',
        headerContent: undefined,  // Usará el header predeterminado con sort y filter buttons
        cellContent: (props: CellContext<ApunteContable, unknown>) => {
        const dateValue = props.getValue<string>();
        return <p>{dateValue ? dateValue : 'Invalid Date'}</p>;
        },
        sortIcon: true,
        nombreSize: 'fecha',
        filterFn: 'includesString',
        sortingFn: 'sortingFecha',
    },
    {
        accessorKey: 'ID',
        nombre: 'ID',
        headerContent: undefined,
        cellContent: (props: CellContext<ApunteContable, unknown>) => {
        return <p className='text-left overflow-clip h-5'>{props.getValue<string>()}</p>;
        },
        sortIcon: true,
        nombreSize: 'id',
        filterFn: 'includesString',
    },
    {
        accessorKey: 'DESCRI_ASI',
        nombre: 'Desc',
        headerContent: undefined,
        cellContent: (props: CellContext<ApunteContable, unknown>) => {
        return <p className='text-left overflow-clip h-5'>{props.getValue<string>()}</p>;
        },
        sortIcon: true,
        nombreSize: 'desc',
        filterFn: 'includesString',
    },
    {
        accessorKey: 'impString',
        nombre: 'Importe',
        headerContent: undefined,
        cellContent: (props: CellContext<ApunteContable, unknown>) => {
        return <p className='text-right mr-1'>{props.getValue<string>()}</p>;
        },
        sortIcon: true,
        nombreSize: 'importe',
        sortingFn: 'sortingImporte',
        filterFn: 'includesString',
    },
    {
        accessorKey: 'CLAVE_IMPORTE',
        nombre: 'D/H',
        headerContent: undefined,
        cellContent: (props: CellContext<ApunteContable, unknown>) => {
        return <p>{props.getValue<number>()}</p>;
        },
        sortIcon: true,
        nombreSize: 'claveImporte',
        filterFn: 'includesString',
    },
    {
        accessorKey: 'Estado',
        nombre: 'Estado',
        headerContent: undefined,
        cellContent: ({ row, column, table, getValue, renderValue, cell }) => (
            // console.log('row: ', row),
            <StatusCell
                row={row}
                column={column}
                table={table}
                getValue={getValue}
                renderValue={renderValue}
                cell={cell}
                id={row.original.ID}
                tipo="apuntes"
            />),
        sortIcon: false,
        nombreSize: 'estado',
        filterFn: 'estadoFilter',
    },
    {
        accessorKey: 'Comentario',
        nombre: 'Comentario',
        headerContent: undefined,
        cellContent: ({ row, column, table, getValue, renderValue, cell }) => (
            <EditableCell
                row={row}
                column={column}
                table={table}
                getValue={getValue}
                renderValue={renderValue}
                cell={cell}
                id={row.original.ID}
            />),
        sortIcon: false,
        nombreSize: 'estado',
        filterFn: 'includesString',
    },
];