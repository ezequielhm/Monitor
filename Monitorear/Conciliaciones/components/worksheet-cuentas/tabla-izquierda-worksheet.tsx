'use client'
import Tabla from '@/components/ui/tabla';

const tablaIzquierdaWorksheet = () => {
    return (
        <Tabla
            tableType="worksheetCuentasCeroIzquierda" // Updated tableType
            tabla="worksheetCuentasCeroIzquierda"   // Ensure tabla matches
            enableRowSelection={false}
            />
    );
};

export default tablaIzquierdaWorksheet;
