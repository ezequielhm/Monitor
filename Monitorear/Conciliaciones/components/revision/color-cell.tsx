import { Box } from "@chakra-ui/react";
import { CellContext } from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { useStore } from "@/lib/store";
import { Status } from "@/lib/definitions";

interface ColorCellProps<TData, TValue> extends CellContext<TData, TValue> {   id: string, tipo: 'bancos' | 'apuntes'}
interface TableMeta {
    updateData: (id: string, rowIndex: number, columnId: string, value: any) => void;
}
interface ColorIconProps {
    color: string;
    [key: string]: any; // Allow any additional props
}

export const ColorIcon: React.FC<ColorIconProps> = ({ color, ...props }) => (
    <Box w="12px" h="12px" bg={color} borderRadius="3px" {...props} />
);

const ColorCell = <TData, TValue>({ row, column, table, id, tipo }: ColorCellProps<TData, TValue>) => {
    const estadoData = (row.original as Record<string, any>)[column.id] as string;
    const [selectedEstado, setSelectedEstado] = useState<Status | undefined>();
    const estadosApuntes = useStore(state => state.estadosApuntes);
    const estadosMovimientos = useStore(state => state.estadosMovimientos);
    const estados = (tipo === 'apuntes') ? estadosApuntes : estadosMovimientos; // distintos estados para apuntes y movimientos de la BBDD
    const socket = useStore(state => state.socket);

    useEffect(() => {
        const estado = estados?.find((e: Status) => e.id === estadoData);
        setSelectedEstado(estado); // asignamos al estado local el estado seleccionado
        
    }, [estadoData]);

    const updateData = (table.options.meta as TableMeta).updateData; // declaramos la función para actualizar los datos en la tabla (creada en tabla.tsx)

    useEffect(() => { // Color-Cell es como editable-cell pero solo se actualiza, ya que no se puede editar
        if (socket) {
            socket.on('estado-toCliente', (estado: any) => { // evento socket para actualizar el estado en tiempo real cuando lo cambie otro usuario
                if (id === estado.id) { // si el id del registro actual coincide con el del id del registro modificado
                    setSelectedEstado(estado.estado); 
                    if (updateData) {
                        updateData(id, row.index, column.id, estado.estado.id);
                        // console.warn('HA LLEGADO BIEN');
                    }
                } else {
                    // console.warn('HA LLEGADO MAL');
                }
            });

        }
    }, [socket]);

    return (
        <Box h='100%' w='100%' textAlign="left" p={0} bg={selectedEstado?.color} className="estado">
            <p className="text-center overflow-clip h-4">{(selectedEstado?.id !== '0') && selectedEstado?.descripcion}</p>
        </Box>
    );
};

export default ColorCell;
