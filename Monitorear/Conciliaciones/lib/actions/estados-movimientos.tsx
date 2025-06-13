'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchEstadosMovimientos() {
    try {
        const pool = await getConnection();
        let query = `SELECT [id]
                    ,[color]
                    ,[descripcion]
                    ,[tipo]
                    ,[deshabilitado]
                     FROM [dbo].[GH_CON_Estado_Worksheet] 
                     where deshabilitado = 1 and Tipo = 'M' OR Tipo IS NULL;`;

        const result = await pool.request()
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}
