'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchActualizarEstado(estado: string, comentario: string, apunte: string) {
    try {
        const pool = await getConnection();
        let query = `UPDATE [dbo].[GH_CON_Apuntes_Conciliados]
                     SET [Estado] = @estado
                     ,[Comentario] = @comentario
                     WHERE ID_Apuntes = @apunte`;

        const result = await pool.request()
            .input('apunte', sql.VarChar, apunte)
            .input('estado', sql.VarChar, estado)
            .input('comentario',sql.VarChar, comentario)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}
