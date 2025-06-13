'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchInsertMovimientoBancario(cadenaValues: string) {
    const pool = await getConnection();
    const transaction = pool.transaction();

    try {
        await transaction.begin();

        const query = `INSERT INTO [dbo].[GH_CON_Movimientos_Conciliados]
                        ([ID_CONCILIACION], [ID_Movimiento], [Importe], [FechaMovimiento], [DebeHaber])
            VALUES ${cadenaValues}`;

        await transaction.request().query(query);

        await transaction.commit();

        return { success: true };
    } catch (error) {
        await transaction.rollback();
        console.error('Error al insertar el movimiento bancario en la tabla GH_CON_Movimientos_Conciliados09/20', error);
        throw error;
    }
}