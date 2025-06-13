import {
    textColumn,
    dateColumn,
    amountColumn,
    checkboxColumn,
    statusColumn,
    editableColumn,
    optionsColumn,
    sortingImporteCuentasCero,
    sortingFecha,
    activoColumn,
    readonlyStatusColumn,
    readonlyEditableColumn
} from './columns/column-factories';
import { useStore } from '@/lib/store';
import useWindowSize from '@/lib/hooks/use-window-size';
import { ColumnDef } from '@tanstack/react-table';
import getSizeBasedOnWidth from '@/lib/hooks/get-size-based-on-width';
import { count } from 'console';
// import ColumnHeader from './columns/column-header';

interface ColumnFilter {
    id: string;
    value: any;
}

interface MyColumnProps {
    tabla: string;
    columnFilters: ColumnFilter[];
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
}

const MyColumn = ({ tabla, columnFilters, setColumnFilters }: MyColumnProps): ColumnDef<any, any>[] => {
    const { estadosApuntes, estadosMovimientos } = useStore(state => ({
        estadosApuntes: state.estadosApuntes,
        estadosMovimientos: state.estadosMovimientos
    }));

    const size = useWindowSize()?.width || 0;

    const getColumns = () => {
        if (!tabla || !columnFilters || !setColumnFilters) {
            console.error('Invalid arguments passed to MyColumn:', { tabla, columnFilters, setColumnFilters });
            return [];
        }

        switch (tabla) {
            case 'apuntesConciliar':
                return [
                    dateColumn('Fecha', 'Fecha', 'fecha', tabla, columnFilters, setColumnFilters, size, undefined, false),
                    textColumn('ID', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('DESCRI_ASI', 'Descripción', 'descripcion', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('IMPORTE', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, undefined, true),
                    textColumn('CLAVE_IMPORTE', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    checkboxColumn('Check', 'check', tabla, size, 'checkbox-verde'),
                ];
            case 'bancosConciliar':
                return [
                    checkboxColumn('Check', 'check', tabla, size, 'checkbox-rojo'),
                    dateColumn('Fecha', 'Fecha', 'fecha', tabla, columnFilters, setColumnFilters, size, undefined, false),
                    textColumn('info_1', 'info_1', 'info_1', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_2', 'info_2', 'info_2', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_3_4', 'info_3_4', 'info_3_4', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_5', 'info_5', 'info_5', tabla, columnFilters, setColumnFilters, size),
                    textColumn('claveDebeHaber', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('IMPORTE', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, undefined, true),
                ];
            case 'apuntesWorksheet':
                return [
                    dateColumn('Fecha', 'Fecha', 'fechaApunte', tabla, columnFilters, setColumnFilters, size, undefined, false),
                    textColumn('ID', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('DESCRI_ASI', 'Descripción', 'desc', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('IMPORTE', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, undefined, true),
                    textColumn('CLAVE_IMPORTE', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    statusColumn('Estado', 'Estado', 'estado', tabla, columnFilters, setColumnFilters, size, 'apuntes', 'ID'),
                    editableColumn('Comentario', 'Comentario', 'comentario', tabla, columnFilters, setColumnFilters, size, 'ID')
                ];
            case 'bancosWorksheet':
                return [
                    dateColumn('Fecha', 'Fecha', 'fechaOperacion', tabla, columnFilters, setColumnFilters, size, undefined, false),
                    textColumn('info_1', 'info_1', 'info_1', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_2', 'info_2', 'info_2', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_3_4', 'info_3_4', 'info_3_4', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_5', 'info_5', 'info_5', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('IMPORTE', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, undefined, true),
                    textColumn('claveDebeHaber', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    statusColumn('Estado', 'Estado', 'estado', tabla, columnFilters, setColumnFilters, size, 'bancos', 'ID'),
                    editableColumn('Comentario', 'Comentario', 'comentario', tabla, columnFilters, setColumnFilters, size, 'ID')
                ];
            case 'apuntesRevision':
                return [
                    dateColumn('Fecha', 'Fecha', 'fechaApunte', tabla, columnFilters, setColumnFilters, size, undefined, false),
                    textColumn('ID', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('DESCRI_ASI', 'Descripción', 'desc', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('IMPORTE', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, undefined, true),
                    textColumn('CLAVE_IMPORTE', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    readonlyStatusColumn('Estado', 'Estado', 'estado', tabla, size, 'apuntes'),
                    readonlyEditableColumn('Comentario', 'Comentario', 'comentario', tabla, size)
                ];
            case 'apuntesConciliadosRevision':
                return [
                    dateColumn('Fecha', 'Fecha', 'fechaApunte', tabla, columnFilters, setColumnFilters, size, undefined, false),
                    textColumn('ID_CONCILIACION', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('DESCRI_ASI', 'Descripción', 'descripcion', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('IMPORTE', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, undefined, true),
                    textColumn('DebeHaber', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    optionsColumn('ID_CONCILIACION', 'Opciones', 'Opciones', tabla, size, '/editar'),
                ];
            case 'apuntesTodosRevision':
                return [
                    dateColumn('Fecha', 'Fecha', 'fechaApunte', tabla, columnFilters, setColumnFilters, size, undefined, false),
                    textColumn('ID_CONCILIACION', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('DESCRI_ASI', 'Descripción', 'descripcion', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('IMPORTE', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, undefined, true),
                    textColumn('DebeHaber', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    optionsColumn('ID_CONCILIACION', 'Opciones', 'Opciones', tabla, size, '/editar'),
                ];
            case 'bancosRevision':
                return [
                    dateColumn('Fecha', 'Fecha', 'fechaMovimiento', tabla, columnFilters, setColumnFilters, size, undefined, false),
                    textColumn('info_1', 'info_1', 'info_1', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_2', 'info_2', 'info_2', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_3_4', 'info_3_4', 'info_3_4', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_5', 'info_5', 'info_5', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('IMPORTE', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, undefined, true),
                    textColumn('claveDebeHaber', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    readonlyStatusColumn('Estado', 'Estado', 'estado', tabla, size, 'bancos'),
                    readonlyEditableColumn('Comentario', 'Comentario', 'comentario', tabla, size)
                ];
            case 'bancosConciliadosRevision':
                return [
                    dateColumn('Fecha', 'Fecha', 'fechaMovimiento', tabla, columnFilters, setColumnFilters, size, undefined, false),
                    textColumn('ID_CONCILIACION', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_1', 'info_1', 'info_1', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_2', 'info_2', 'info_2', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_3_4', 'info_3_4', 'info_3_4', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_5', 'info_5', 'info_5', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('IMPORTE', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, undefined, true),
                    textColumn('claveDebeHaber', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    optionsColumn('ID_CONCILIACION', 'Opciones', 'Opciones', tabla, size, '/editar'),
                ];
            case 'bancosTodosRevision':
                return [
                    dateColumn('Fecha', 'Fecha', 'fechaMovimiento', tabla, columnFilters, setColumnFilters, size, undefined, false),
                    textColumn('info_1', 'info_1', 'info_1', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_2', 'info_2', 'info_2', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_3_4', 'info_3_4', 'info_3_4', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_5', 'info_5', 'info_5', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('IMPORTE', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, undefined, true),
                    textColumn('claveDebeHaber', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    optionsColumn('ID_CONCILIACION', 'Opciones', 'Opciones', tabla, size, '/editar'),
                ];
            case 'apuntesCuentasCeroIzquierda':
                return [
                    dateColumn('fecha', 'Fecha', 'fecha', tabla, columnFilters, setColumnFilters, size),
                    textColumn('id', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('descripcion', 'Descripción', 'descripcion', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('importe', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, sortingImporteCuentasCero),
                    textColumn('clave_importe', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    checkboxColumn('Check', 'check', tabla, size, 'checkbox-verde')
                ];
            case 'apuntesCuentasCeroDerecha':
                return [
                    checkboxColumn('Check', 'check', tabla, size, 'checkbox-rojo'),
                    dateColumn('fecha', 'Fecha', 'fecha', tabla, columnFilters, setColumnFilters, size),
                    textColumn('id', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('descripcion', 'Descripción', 'descripcion', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('importe', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, sortingImporteCuentasCero),
                    textColumn('clave_importe', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size)
                ];
            case 'gestionCuentas':
                return [
                    textColumn('empresa1', 'Empresa 1', 'empresa1', tabla, columnFilters, setColumnFilters, size),
                    textColumn('cuenta1', 'Cuenta 1', 'cuenta1', tabla, columnFilters, setColumnFilters, size),
                    textColumn('empresa2', 'Empresa 2', 'empresa2', tabla, columnFilters, setColumnFilters, size),
                    textColumn('cuenta2', 'Cuenta 2', 'cuenta2', tabla, columnFilters, setColumnFilters, size),
                    textColumn('usuario', 'Usuario', 'usuario', tabla, columnFilters, setColumnFilters, size),
                    dateColumn('fechaInicio', 'Fecha Inicio', 'fechaInicio', tabla, columnFilters, setColumnFilters, size, sortingFecha),
                    textColumn('tercero1', 'Tercero 1', 'tercero1', tabla, columnFilters, setColumnFilters, size),
                    textColumn('tercero2', 'Tercero 2', 'tercero2', tabla, columnFilters, setColumnFilters, size),
                    activoColumn('activo', 'Activo', 'activo', tabla, columnFilters, setColumnFilters, size)
                ];
            case 'worksheetCuentasCeroIzquierda':
                return [
                    dateColumn('fecha', 'Fecha', 'fecha', tabla, columnFilters, setColumnFilters, size),
                    textColumn('id', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('descripcion', 'Descripción', 'descripcion', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('importe', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, sortingImporteCuentasCero),
                    textColumn('clave_importe', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    editableColumn('Comentario', 'Comentario', 'comentario', tabla, columnFilters, setColumnFilters, size, 'ID')
                ]
            case 'worksheetCuentasCeroDerecha':
                return [
                    dateColumn('fecha', 'Fecha', 'fecha', tabla, columnFilters, setColumnFilters, size),
                    textColumn('id', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('descripcion', 'Descripción', 'descripcion', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('importe', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, sortingImporteCuentasCero),
                    textColumn('clave_importe', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    editableColumn('Comentario', 'Comentario', 'comentario', tabla, columnFilters, setColumnFilters, size, 'ID')
                ]
            case 'revisionCuentasCeroIzquierda':
                return [
                    dateColumn('fecha', 'Fecha', 'fecha', tabla, columnFilters, setColumnFilters, size),
                    textColumn('id', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('descripcion', 'Descripción', 'descripcion', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('importe', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, sortingImporteCuentasCero),
                    textColumn('clave_importe', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                ];
            case 'revisionCuentasCeroDerecha':
                return [
                    dateColumn('fecha', 'Fecha', 'fecha', tabla, columnFilters, setColumnFilters, size),
                    textColumn('id', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('descripcion', 'Descripción', 'descripcion', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('importe', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, sortingImporteCuentasCero),
                    textColumn('clave_importe', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                ];
            case 'revisionTodosCuentasCeroDerecha':
                return [
                    dateColumn('fecha', 'Fecha', 'fecha', tabla, columnFilters, setColumnFilters, size),
                    textColumn('id_conciliacion', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('descripcion', 'Descripción', 'descripcion', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('importe', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, sortingImporteCuentasCero),
                    textColumn('clave_importe', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    optionsColumn('id_conciliacion', 'Opciones', 'Opciones', tabla, size, '/editar-cuentas'),
                ];
            case 'revisionTodosCuentasCeroIzquierda':
                return [
                    dateColumn('fecha', 'Fecha', 'fecha', tabla, columnFilters, setColumnFilters, size),
                    textColumn('id_conciliacion', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('descripcion', 'Descripción', 'descripcion', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('importe', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, sortingImporteCuentasCero),
                    textColumn('clave_importe', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    optionsColumn('id_conciliacion', 'Opciones', 'Opciones', tabla, size, '/editar-cuentas'),
                ];
            case 'revisionConciliadosCuentasCeroIzquierda':
                return [
                    dateColumn('fecha', 'Fecha', 'fecha', tabla, columnFilters, setColumnFilters, size),
                    textColumn('id_conciliacion', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('descripcion', 'Descripción', 'descripcion', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('importe', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, sortingImporteCuentasCero),
                    textColumn('clave_importe', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    optionsColumn('id_conciliacion', 'Opciones', 'Opciones', tabla, size, '/editar-cuentas'),
                ];
            case 'revisionConciliadosCuentasCeroDerecha':
                return [
                    dateColumn('fecha', 'Fecha', 'fecha', tabla, columnFilters, setColumnFilters, size),
                    textColumn('id_conciliacion', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('descripcion', 'Descripción', 'descripcion', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('importe', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, sortingImporteCuentasCero),
                    textColumn('clave_importe', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    optionsColumn('id_conciliacion', 'Opciones', 'Opciones', tabla, size, '/editar-cuentas'),
                ];
            case 'apuntesConciliacionHistorica':
                return [
                    dateColumn('Fecha', 'Fecha', 'fecha', tabla, columnFilters, setColumnFilters, size, undefined, false),
                    textColumn('ID', 'ID', 'id', tabla, columnFilters, setColumnFilters, size),
                    textColumn('DESCRI_ASI', 'Descripción', 'descripcion', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('IMPORTE', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, undefined, true),
                    textColumn('CLAVE_IMPORTE', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                ];
            case 'bancosConciliacionHistorica':
                return [
                    dateColumn('Fecha', 'Fecha', 'fecha', tabla, columnFilters, setColumnFilters, size, undefined, false),
                    textColumn('info_1', 'info_1', 'info_1', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_2', 'info_2', 'info_2', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_3_4', 'info_3_4', 'info_3_4', tabla, columnFilters, setColumnFilters, size),
                    textColumn('info_5', 'info_5', 'info_5', tabla, columnFilters, setColumnFilters, size),
                    textColumn('claveDebeHaber', 'D/H', 'claveImporte', tabla, columnFilters, setColumnFilters, size),
                    amountColumn('IMPORTE', 'Importe', 'importe', tabla, columnFilters, setColumnFilters, size, undefined, true),
                ];
            default:
                return [];
        }
    };

    return getColumns();
};

export default MyColumn;
