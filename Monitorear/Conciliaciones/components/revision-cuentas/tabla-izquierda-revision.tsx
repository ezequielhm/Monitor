'use client'
import Tabla from '@/components/ui/tabla';

const tablaIzquierdaRevision = () => {
    return (
        <Tabla
            tableType="revisionCuentasCeroIzquierda" // Updated tableType
            tabla="revisionCuentasCeroIzquierda"   // Ensure tabla matches
            enableRowSelection={false}
            />
    );
};

export default tablaIzquierdaRevision;
