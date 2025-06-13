'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchBorrarMovimientoBancarioConciliado(idMovimiento: number) {
    try {
        const pool = await getConnection();
        let query = `DELETE FROM [dbo].[GH_CON_Movimientos_Conciliados]
                     WHERE ID = @id_movimiento`;

        const result = await pool.request()
            .input('id_movimiento', sql.Numeric, idMovimiento)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}