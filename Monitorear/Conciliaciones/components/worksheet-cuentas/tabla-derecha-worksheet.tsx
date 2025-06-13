'use client'
import Tabla from '@/components/ui/tabla';

const tablaDerechaWorksheet = () => {
    return (
        <Tabla
            tableType="worksheetCuentasCeroDerecha" // Updated tableType
            tabla="worksheetCuentasCeroDerecha"   // Ensure tabla matches
            enableRowSelection={false}
            />
    );
};

export default tablaDerechaWorksheet;
