'use client'
import Tabla from '@/components/ui/tabla';

const tablaDerechaRevision = () => {
    return (
        <Tabla
            tableType="revisionCuentasCeroDerecha" // Updated tableType
            tabla="revisionCuentasCeroDerecha"   // Ensure tabla matches
            enableRowSelection={false}
            />
    );
};

export default tablaDerechaRevision;
