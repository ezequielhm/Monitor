'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchIncidencias() {
    try {
        const pool = await getConnection();        
        let query = `SELECT ID, EMPRESA, SUBCTA_CONTABLE, ID_Conciliado, ID_CONCILIACION, Importe_Conciliado, ID_Quiter,Importe_Quiter, Tipo_Incidencia, Descripcion
                     FROM [dbo].[vw_CON_Incidencias]`; 

        const result = await pool.request()
            .query(query, { timeout: 60000 });  // Aumenta el tiempo de espera a 60 segundos

        return result.recordset;
    } catch (error) {
        console.error('Error en la base de datos: ', error);
        throw error;
    }
}
