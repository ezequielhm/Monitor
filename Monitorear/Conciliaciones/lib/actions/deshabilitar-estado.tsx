'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchDeshabilitarEstado(id: string, deshabilitar: boolean) {
    try {
        const pool = await getConnection();
        let query = `UPDATE [GH_CON_Estado_Worksheet]
                     SET deshabilitado = @deshabilitar
                     WHERE id = @id;`;

        const result = await pool.request()
            .input('id', sql.VarChar, id)  // Aquí especificas el tipo de SQL adecuado
            .input('deshabilitar', sql.Bit, deshabilitar)  // También especificas el tipo adecuado para el bit
            .query(query);

        return result.recordset;
    } catch (error) {
        console.error('Error en la base de datos: ', error);
        throw error;
    }
}
