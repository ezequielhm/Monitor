'use client';

import { useStore } from '@/lib/store';
import { export2ListToExcel } from '../../lib/export2ListToExcel';
import { ApunteContable } from '@/lib/definitions';
import { MovimientoBancario } from '@/lib/definitions';
import clsx from 'clsx';

function BotonImprimir() {

    // Se toman del estado el array de apuntes
    const apuntesContables: ApunteContable[] = useStore((state) => state.apuntesContables);
    const movimientosBancarios: MovimientoBancario[] = useStore((state) => state.movimientosBancarios);


    // Función para exportar a Excel (puede usar datos de prueba o los datos seleccionados)
    const handleExport = () => {
        const docName = 'Conciliaciones';
        const sheetName = 'Conciliaciones';
        const title = 'Listado de apuntes pendientes de conciliar';
        const subtitle1 = 'Apuntes contables';
        const subtitle2 = 'Movimientos bancarios';
        const headersType1 = [
            { key: 'EMPRESA', title: 'Emp. Cont'},
            { key: 'COD_EMPRESA', title: 'Empresa'},
            { key: 'FECHA', title: 'Fecha'},
            { key: 'ID', title: 'ID'},
            { key: 'DESCRI_ASI', title: 'Descripción'},
            { key: 'IMPORTE', title: 'Importe'},
            { key: 'CLAVE_IMPORTE', title: 'D/H'}
        ];
        const headersType2 = [
            { key: 'fechaOperacion', title: 'Fecha'},
            { key: 'ID', title: 'ID'},
            { key: 'comentarios', title: 'Comentarios'},
            { key: 'importe', title: 'Importe'},
            { key: 'claveDebeHaber', title: 'D/H'}
        ]
        console.log('Exportando las tablas');
        export2ListToExcel(docName, sheetName, title, subtitle1, subtitle2, headersType1, headersType2, apuntesContables, movimientosBancarios);
    };

    return (
        <button onClick={handleExport} className={clsx('m-0 w-fit rounded-md px-10 py-2 text-lg font-medium transition-colors duration-300 text-gray-200', {
            'bg-red-500 hover:bg-red-600 transition-colors duration-300': true,
            'bg-green-600': false,
          })}>Exportar a Excel</button>
    );
}

export default BotonImprimir;