'use client'
import Tabla from '@/components/ui/tabla';

const tablaDerechaRevisionTodos = () => {
    return (
        <Tabla
            tableType="revisionTodosCuentasCeroDerecha" // Updated tableType
            tabla="revisionTodosCuentasCeroDerecha"   // Ensure tabla matches
            enableRowSelection={false}
            />
    );
};

export default tablaDerechaRevisionTodos;
