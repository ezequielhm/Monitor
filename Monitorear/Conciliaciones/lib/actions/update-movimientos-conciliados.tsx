'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchActualizarEstado(estado: string, comentario: string, movimiento: number) {
    try {
        console.log('ACTUALIZANDO');
        const pool = await getConnection();
        let query = `UPDATE [dbo].[GH_CON_Movimientos_Conciliados]
                     SET [Estado] = @estado
                     ,[Comentario] = @comentario
                     WHERE ID_Movimiento = @movimiento`;

        const result = await pool.request()
            .input('movimiento', sql.Numeric, movimiento)
            .input('estado', sql.VarChar, estado)
            .input('comentario',sql.VarChar, comentario)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}
