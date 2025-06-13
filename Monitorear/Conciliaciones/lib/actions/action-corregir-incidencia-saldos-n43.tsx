'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchCorregirIncidenciaSaldosN43(id: number) {
    try {
        const pool = await getConnection();
        let query = `update [dbo].GH_CON_N43_LOG_ERRORES set corregido = 1 where id = @id`;

        const result = await pool.request()
        .input('id', id)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}