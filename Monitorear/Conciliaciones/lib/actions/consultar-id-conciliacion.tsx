'use server'
import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function verificarIdsEnConciliados(idsMovimientos: number[], idsApuntes: string[]) {
    const pool = await getConnection();

    try {
        let movimientosDuplicados = [];
        let apuntesDuplicados = [];
        const movs = Array.isArray(idsMovimientos) ? idsMovimientos.join(',') : '';

        // Comprobar si los IDs ya están en GH_CON_Movimientos_Conciliados si la lista no está vacía
        if (idsMovimientos.length > 0) {
            const movimientosQuery = `
                SELECT ID_Movimiento
                FROM GH_CON_Movimientos_Conciliados
                WHERE ID_Movimiento IN (${movs});
            `;
            const resultMovimientos = await pool.request().query(movimientosQuery);
            movimientosDuplicados = resultMovimientos.recordset.map((row: any) => row.ID_Movimiento);
        }

        // Comprobar si los IDs ya están en GH_CON_Apuntes_Conciliados si la lista no está vacía
        if (idsApuntes.length > 0) {
            // Añadir comillas a cada ID de apunte (porque son strings)
            const formattedIdsApuntes = Array.isArray(idsApuntes)
                                        ? idsApuntes.map(id => `'${id}'`).join(',')
                                        : '';
            const apuntesQuery = `
                SELECT ID_Apuntes
                FROM GH_CON_Apuntes_Conciliados
                WHERE ID_Apuntes IN (${formattedIdsApuntes});
            `;
            const resultApuntes = await pool.request().query(apuntesQuery);
            apuntesDuplicados = resultApuntes.recordset.map((row: any) => row.ID_Apuntes);
        }

        return {
            movimientosDuplicados,
            apuntesDuplicados,
        };
    } catch (error) {
        console.error('Error al verificar los IDs en las tablas de conciliados:', error);
        throw error;
    }
}
