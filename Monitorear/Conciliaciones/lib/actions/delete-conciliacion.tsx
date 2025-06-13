'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchBorrarConciliacion(idConciliacion: number) {
    try {
        const pool = await getConnection();
        let query = `DELETE FROM [dbo].[GH_CON_CONCILIACIONES]
                     WHERE ID_CONCILIACION = @id_conciliacion`;

        const result = await pool.request()
            .input('id_conciliacion', sql.Numeric, idConciliacion)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}