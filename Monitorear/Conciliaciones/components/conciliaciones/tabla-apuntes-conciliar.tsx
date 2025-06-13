'use client'
import { useStore } from '@/lib/store';
import { ApunteContable } from '@/lib/definitions';
import Tabla from '@/components/ui/tabla';

const TablaApuntesConciliar = () => {
    const selectedRowsCuentas: ApunteContable[] = useStore((state) => state.selectedRowsCuentas);   // filas seleccionadas (guardadas en el store)
    const setSelectedRowsCuentas = useStore((state) => state.setSelectedRowsCuentas);               // para guardar las filas seleccionadas en el store
    const setImporteTotalCuentasSel = useStore((state) => state.setImporteTotalCuentasSel);        // para guardar el importe total de las filas seleccionadas en el store
    const setListaIdSelCuentas = useStore((state) => state.setListaIdSelCuentas);                 // para guardar las filas seleccionadas en el store
    const importeTotalCuentasSel = useStore(state => state.importeTotalCuentasSel);
  
    return (
        <Tabla
            tableType="apuntes"
            tabla="apuntesConciliar"
            enableRowSelection={true}
            selectedRows={selectedRowsCuentas}
            setSelectedRows={setSelectedRowsCuentas}
            setImporteTotal={setImporteTotalCuentasSel}
            importeTotal={importeTotalCuentasSel}
            setListaIdSel={setListaIdSelCuentas}
            colorSeleccion='verde'
        />
    );
};

export default TablaApuntesConciliar;
