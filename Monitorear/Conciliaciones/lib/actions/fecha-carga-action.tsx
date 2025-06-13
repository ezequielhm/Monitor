'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchFechaCarga(productoBancario: number) {
    try {
        const pool = await getConnection();
        let query = `select max(FECHA) AS FECHA_ACTUALIZACION 
                    from vw_CON_ApuntesContablesConciliables
                    where COD_PROD_BANCARIO = @productoBancario`;

        const result = await pool.request()
            .input('productoBancario', productoBancario)
            .query(query);
        return result.recordset[0];
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}
