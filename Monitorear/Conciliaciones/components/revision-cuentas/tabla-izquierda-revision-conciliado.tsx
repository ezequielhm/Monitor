'use client'
import Tabla from '@/components/ui/tabla';

const tablaIzquierdaRevisionConciliados = () => {
    return (
        <Tabla
            tableType="revisionConciliadosCuentasCeroIzquierda" // Updated tableType
            tabla="revisionConciliadosCuentasCeroIzquierda"   // Ensure tabla matches
            enableRowSelection={false}
            />
    );
};

export default tablaIzquierdaRevisionConciliados;
