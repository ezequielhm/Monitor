'use client'
import Tabla from '@/components/ui/tabla';

const TablaBancosWorksheet = () => {
    
    return (
        <Tabla
            tableType="bancos"
            tabla="bancosWorksheet"
            enableRowSelection={false} // Deshabilitamos todas la selección de filas
            // Al no enviar el resto de props, inhabilitamos toda la lógica de selección de filas
        />
    );
};

export default TablaBancosWorksheet;
