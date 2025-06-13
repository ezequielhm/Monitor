'use client'
import Tabla from '@/components/ui/tabla';

const tablaIzquierdaRevisionTodos = () => {
    return (
        <Tabla
            tableType="revisionTodosCuentasCeroIzquierda" // Updated tableType
            tabla="revisionTodosCuentasCeroIzquierda"   // Ensure tabla matches
            enableRowSelection={false}
            />
    );
};

export default tablaIzquierdaRevisionTodos;
