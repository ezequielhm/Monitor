'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchBorrarApunteConciliado(idApunte: number) {
    try {
        const pool = await getConnection();
        let query = `DELETE FROM [dbo].[GH_CON_Apuntes_Conciliados]
                     WHERE ID = @id_apunte`;

        const result = await pool.request()
            .input('id_apunte', sql.Numeric, idApunte)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}