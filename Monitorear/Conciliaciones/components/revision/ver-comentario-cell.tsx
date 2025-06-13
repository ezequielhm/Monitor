import { Box } from "@chakra-ui/react";
import { CellContext } from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { useStore } from "@/lib/store";

interface VerComentario<TData, TValue> extends CellContext<TData, TValue> {   id: string }
interface TableMeta {
    updateData: (id: string, rowIndex: number, columnId: string, value: any) => void;
}

const VerComentarioCell = <TData, TValue>({ row, column, table, id }: VerComentario<TData, TValue>) => {
    const comentarioData = (row.original as Record<string, any>)[column.id] as string;
    const [comentario, setComentario] = useState<string | undefined>();
    const socket = useStore(state => state.socket);

    useEffect(() => {
        setComentario(comentarioData);
    }, [comentarioData]); // asignamos el comentario contenido del registro al estado local

    const updateData = (table.options.meta as TableMeta).updateData; // declaramos la función para actualizar los datos en la tabla (creada en tabla.tsx)

    useEffect(() => { // ver-comentario-cell es como editable-cell pero solo se actualiza, ya que no se puede editar el comentario
        if (socket) {
            socket.on('comentario-toCliente', (newComentario: any) => {

                if (id === newComentario.id) { // si el id del registro actual coincide con el del id del registro modificado
                    setComentario(newComentario.comentario); 
                    if (updateData) {
                        updateData(id, row.index, column.id, newComentario.comentario);
                        // console.warn('HA LLEGADO BIEN');
                    }
                } else {
                    // console.warn('HA LLEGADO MAL');
                }
            });

        }
    }, [socket]);

    return (
        <Box h='100%' w='100%' textAlign="left" p={0}>
            <p className="overflow-clip h-4">{comentario}</p>
        </Box>
    );
};

export default VerComentarioCell;
