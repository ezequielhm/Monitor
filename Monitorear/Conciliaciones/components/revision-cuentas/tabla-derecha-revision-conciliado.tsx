'use client'
import Tabla from '@/components/ui/tabla';

const tablaDerechaRevisionConciliados = () => {
    return (
        <Tabla
            tableType="revisionConciliadosCuentasCeroDerecha" // Updated tableType
            tabla="revisionConciliadosCuentasCeroDerecha"   // Ensure tabla matches
            enableRowSelection={false}
            />
    );
};

export default tablaDerechaRevisionConciliados;
