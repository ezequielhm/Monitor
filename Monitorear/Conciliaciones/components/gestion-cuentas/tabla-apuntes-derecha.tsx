'use client'
import Tabla from '@/components/ui/tabla';
import { gestionCuentasStore } from '@/lib/store/store-gestion-cuentas';

const tablaApuntesDerecha = () => {
    const setSelectedRowsApuntesDerecha = gestionCuentasStore(state => state.setSelectedRowsApuntesDerecha);
    const setImporteTotalApuntesDerecha = gestionCuentasStore(state => state.setImporteTotalApuntesDerecha);
    const setListaIdSelDerecha = gestionCuentasStore(state => state.setListaIdSelDerecha);
    const selectedRowsApuntesDerecha = gestionCuentasStore(state => state.selectedRowsApuntesDerecha);
    const importeTotalApuntesDerecha = gestionCuentasStore(state => state.importeTotalApuntesDerecha);

    return (
        <Tabla
            tableType="apuntesCuentasCeroDerecha"
            tabla="apuntesCuentasCeroDerecha"
            setImporteTotal={setImporteTotalApuntesDerecha}
            setSelectedRows={setSelectedRowsApuntesDerecha}
            importeTotal={importeTotalApuntesDerecha}
            selectedRows={selectedRowsApuntesDerecha}
            setListaIdSel={setListaIdSelDerecha}
            enableRowSelection={true}
            colorSeleccion='rojo'
        />
    );
};

export default tablaApuntesDerecha;
