'use client'
import { Menu, MenuButton, MenuItem, MenuList, Box, Portal } from "@chakra-ui/react";
import { CellContext } from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { useStore } from "@/lib/store";
import { Status } from "@/lib/definitions";
import { CloseIcon } from "@chakra-ui/icons";

interface EditableCellProps<TData, TValue> extends CellContext<TData, TValue> {  id: string, tipo: 'bancos' | 'apuntes' }
interface TableMeta {
    updateData: (id: string, rowIndex: number, columnId: string, value: any) => void;
}
interface ColorIconProps {
    color: string;
    [key: string]: any;
}

export const ColorIcon: React.FC<ColorIconProps> = ({ color, ...props }) => (
    <Box w="12px" h="12px" bg={color} borderRadius="3px" {...props} />
);

const StatusCell = <TData, TValue>({ row, column, table, id, tipo }: EditableCellProps<TData, TValue>) => {
    const estadoData = (row.original as Record<string, any>)[column.id] as string;
    const [selectedEstado, setSelectedEstado] = useState<Status | undefined>();
    const estadosApuntes = useStore(state => state.estadosApuntes);
    const estadosMovimientos = useStore(state => state.estadosMovimientos);
    const estados = (tipo === 'apuntes') ? estadosApuntes : estadosMovimientos;
    const socket = useStore(state => state.socket);
    useEffect(() => {
        const estado = estados?.find((e: Status) => e.id === estadoData);
        setSelectedEstado(estado);
    }, [estadoData]);

    const updateData = (table.options.meta as TableMeta).updateData;

    useEffect(() => {
        if (socket) {
            socket.on('estado-toCliente', (estado: any) => {
                if (id === estado.id) {
                    setSelectedEstado(estado.estado);
                    if (updateData) {
                        updateData(id, row.index, column.id, estado.estado.id);
                    }
                }
            });
        }
    }, [socket]);

    const handleSelectEstado = (newEstado: Status) => {        
        if (socket) {
            socket.emit('estado-toServer', {
                id: id,
                rowIndex: row.index,
                columnId: column.id,
                estado: newEstado,
            });
        }
    };

    return (
        <Menu isLazy offset={[10, 0]} flip={true} autoSelect={false} placement="auto">
            <MenuButton h='100%' w='100%' textAlign="left" p={0} bg={selectedEstado?.color} className="estado">
                <p className="overflow-hidden h-4">{(selectedEstado?.id !== '0') && selectedEstado?.descripcion}</p>
            </MenuButton>
            <Portal>
                <MenuList rounded={5} zIndex="popover" minWidth="150px" maxWidth="200px">
                    {estados?.map((estado, index) => (
                        <MenuItem 
                            fontSize={'small'} 
                            key={index} 
                            bg={'white'} 
                            _hover={{ 
                                bg: estado?.id === '0' ? '#000' : estado.color, 
                                color: estado?.id === '0' ? '#fff' : '#000' 
                            }} 
                            onClick={() => handleSelectEstado(estado)}
                        >
                            {estado.id === '0' ? (
                                <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                                    <CloseIcon />
                                </Box>
                            ) : (
                                <>
                                    <ColorIcon color={estado.color} mr={3} />
                                    {estado.descripcion}
                                </>
                            )}
                        </MenuItem>
                    ))}
                </MenuList>
                </Portal>
        </Menu>
    );
};

export default StatusCell;