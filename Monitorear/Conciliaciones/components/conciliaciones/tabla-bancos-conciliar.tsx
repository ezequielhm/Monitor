'use client'
import { useStore } from '@/lib/store';
import { MovimientoBancario } from '@/lib/definitions';
import Tabla from '@/components/ui/tabla';

const TablaBancosConciliar = () => {
    const selectedRowsBancos: MovimientoBancario[] = useStore((state) => state.selectedRowsBancos);
    const setSelectedRowsBancos = useStore((state) => state.setSelectedRowsBancos);
    const setImporteTotalBacnSel = useStore((state) => state.setImporteTotalBacnSel);
    const setListaIdSelBancos = useStore((state) => state.setListaIdSelBancos);
    const importeTotalBacnSel = useStore(state => state.importeTotalBacnSel);
  
    return (
        <Tabla
            tableType="bancos"
            tabla="bancosConciliar"
            enableRowSelection={true}
            selectedRows={selectedRowsBancos}
            setSelectedRows={setSelectedRowsBancos}
            setImporteTotal={setImporteTotalBacnSel}
            importeTotal={importeTotalBacnSel}
            setListaIdSel={setListaIdSelBancos}
            colorSeleccion='rojo'
        />
    );
};

export default TablaBancosConciliar;
