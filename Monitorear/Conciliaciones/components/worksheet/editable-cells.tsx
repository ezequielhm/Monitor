'use client'
import { Input } from "@chakra-ui/react"
import { useEffect, useState, useCallback } from "react"
import { CellContext } from '@tanstack/react-table';
import { useStore } from "@/lib/store";

// Define the type for the props
interface EditableCellProps<TData, TValue> extends CellContext<TData, TValue> { id: string}

interface TableMeta {
    updateData: (id: string, rowIndex: number, columnId: string, value: any) => void;
}

const EditableCell = <TData, TValue>({ getValue, row, column, table, id }: EditableCellProps<TData, TValue>) => {
    const initialValue = getValue();
    const [value, setValue] = useState<TValue>(initialValue); // Estado local para cada celda
    const socket = useStore(state => state.socket);

    // Función para actualizar los datos en la tabla y sincronizar con el servidor (llama a la autentica función de actualización)
    const updateData = useCallback((newValue: TValue) => {
        (table.options.meta as TableMeta).updateData(id, row.index, column.id, newValue);
    }, [row.index, column.id, table.options.meta]);

    useEffect(() => {
        if (socket) {
            socket.on('comentario-toCliente', (newComentario: any) => { // Evento socket para actualizar el comentario una vez recibido del servidor
                if (id === newComentario.id) {
                    setValue(newComentario.comentario);
                    updateData(newComentario.comentario); // Actualiza el estado global después de enviar al servidor
                }
            });

        }
    }, [socket]);

    const handleOnBlur = () => { // Envia el comentario al servidor y actualiza el estado global
        if (socket) {
            socket.emit('comentario-toServer', {
                id: id,
                rowIndex: row.index,
                columnId: column.id,
                comentario: value,
            });
            // console.log('Comentario enviado al servidor:', value);
        } else {
            // console.log('NO DETECTA EL SOCKET');
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleOnBlur(); // Una vez pulsado enter o se perdido el foco del input -> se llama a la función de enviar al servidor (para actualizar el comentario)
        }
    };

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <Input
            value={typeof value === 'string' ? value : String(value ?? '')}
            onChange={e => setValue(e.target.value as unknown as TValue)} // Actualizamos solo el estado local
            onBlur={handleOnBlur} // Sincroniza con el servidor y actualiza el estado global
            onKeyDown={onKeyDown}
            variant="filled"
            size="sm"
            w="100%"
            h="100%"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            className="text-sm"
        />
    );
}

export default EditableCell;
