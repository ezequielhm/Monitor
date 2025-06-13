'use client'
import Tabla from '@/components/ui/tabla';
import { gestionCuentasStore } from '@/lib/store/store-gestion-cuentas';

const TablaApuntesIzquierda = () => {
    const setSelectedRowsApuntesIzquierda = gestionCuentasStore(state => state.setSelectedRowsApuntesIzquierda);
    const setImporteTotalApuntesIzquierda = gestionCuentasStore(state => state.setImporteTotalApuntesIzquierda);
    const setListaIdSelIzquierda = gestionCuentasStore(state => state.setListaIdSelIzquierda);
    const selectedRowsApuntesIzquierda = gestionCuentasStore(state => state.selectedRowsApuntesIzquierda);
    const importeTotalApuntesIzquierda = gestionCuentasStore(state => state.importeTotalApuntesIzquierda);


    return (
        <Tabla
            tableType="apuntesCuentasCeroIzquierda"
            tabla="apuntesCuentasCeroIzquierda"
            setImporteTotal={setImporteTotalApuntesIzquierda}
            setSelectedRows={setSelectedRowsApuntesIzquierda}
            importeTotal={importeTotalApuntesIzquierda}
            selectedRows={selectedRowsApuntesIzquierda}
            setListaIdSel={setListaIdSelIzquierda}
            enableRowSelection={true}
            colorSeleccion='verde'
        />
    );
};

export default TablaApuntesIzquierda;
