import React, { useEffect, useState } from 'react';
import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';
import { Box, Table, Tbody, Td, Th, Thead, Tr, Button } from '@chakra-ui/react';
import { incidencia, SaldosDescuadrados } from '@/lib/definitions/incidencia-definition';
import { useStore } from '@/lib/store';
import { getSign, formatEuro } from '@/components/worksheet/footer-saldos';

const TablaSaldosDescuadrados = () => {

    const [data, setData] = useState<{ header: string; contabilidad: string; banco: string; }[]>([]);

    const { propsIncidenciaDetalle } = useStore();
    const incidencia = propsIncidenciaDetalle[0];

    useEffect(() => {

        if (incidencia.Tipo_Incidencia !== 'saldosDescuadrados') return;

        const newData = [
            {
                header: 'Saldo Final',
                contabilidad: formatEuro(incidencia.Saldo_Final_Contable || 0) + ' ' + getSign(incidencia.Saldo_Final_Contable || 0, 'apunte'),
                banco: formatEuro(incidencia.Saldo_Final_Banco || 0) + ' ' + getSign(incidencia.Saldo_Final_Banco || 0, 'movimiento'),
            },
            {
                header: 'No casado',
                contabilidad: formatEuro(incidencia.No_Casado_Contable || 0) + ' ' + getSign(incidencia.No_Casado_Contable || 0, 'apunte'),
                banco: formatEuro(incidencia.No_Casado_Banco || 0) + ' ' + getSign(incidencia.No_Casado_Banco || 0, 'movimiento'),
            },
            {
                header: 'Suma',
                contabilidad: formatEuro(incidencia.sumaApunte || 0) + ' ' + getSign(incidencia.sumaApunte || 0, 'apunte'),
                banco: formatEuro(incidencia.sumaMovimientos || 0) + ' ' + getSign(incidencia.sumaMovimientos || 0, 'movimiento'),
            }
        ];
        setData(newData);
    }, [propsIncidenciaDetalle]);

    // Define las columnas para la tabla transpuesta
    const columns = [
        {
            accessorKey: 'header',
            header: '', // Columna vacía para los encabezados de las filas (Saldo Final, No casado, Suma)
        },
        {
            accessorKey: 'contabilidad',
            header: 'Contabilidad',
        },
        {
            accessorKey: 'banco',
            header: 'Banco',
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Box
            className="w-100"
            overflowX="auto"
            display="flex"
            justifyContent="center"
            alignItems="start"
            background="white"
        >
            <Table width="60%" marginTop={'3%'} border="1px solid black" borderRadius="md">
                <Thead>
                    <Tr background={'#f0f0f0'}>
                        {table.getHeaderGroups().map(headerGroup => (
                            headerGroup.headers.map(header => (
                                <Th key={header.id} textAlign="center" border="1px solid black">
                                    {header.isPlaceholder ? null : typeof header.column.columnDef.header === 'function' ? header.column.columnDef.header(header.getContext()) : header.column.columnDef.header}
                                </Th>
                            ))
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {table.getRowModel().rows.map(row => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <Td key={cell.id} textAlign="center" border="1px solid black">
                                    {cell.getValue() as React.ReactNode}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default TablaSaldosDescuadrados;
