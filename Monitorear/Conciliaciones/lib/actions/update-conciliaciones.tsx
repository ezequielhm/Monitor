'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchActualizarConciliacion(idConciliacion: number, importeConciliacion: number) {
    try {
        const pool = await getConnection();
        let query = `UPDATE [dbo].[GH_CON_CONCILIACIONES]
                     SET ImporteConciliado = @importe_conciliacion, ID_Usuario = 0
                     WHERE ID_CONCILIACION = @id_conciliacion`;

        const result = await pool.request()
        .input('id_conciliacion', idConciliacion)
        .input('importe_conciliacion', importeConciliacion)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}