'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchApuntesConciliadosByConciliacion(idConciliacion: number) {
    try {
        const pool = await getConnection();
        let query = `SELECT apuntesConciliados.[ID], apuntesConciliados.[ID_CONCILIACION], [ID_Apuntes], apuntesConciliados.[Importe] as IMPORTE, 
		[FechaApunte], conciliaciones.Empresa, apuntesConciliados.[DebeHaber]
        --  apuntesConciliados.[Desc], 
		 , apuntesContables.COD_PROD_BANCARIO, apuntesContables.DESCRI_ASI
        FROM [dbo].[GH_CON_Apuntes_Conciliados] apuntesConciliados
        left join GH_CON_CONCILIACIONES conciliaciones on
        conciliaciones.ID_CONCILIACION = apuntesConciliados.ID_CONCILIACION
        LEFT join dbo.vw_CON_ApuntesContablesConciliables apuntesContables on
        apuntesContables.ID = apuntesConciliados.ID_Apuntes
        where apuntesConciliados.ID_CONCILIACION = @id_conciliacion`;

        const result = await pool.request()
            .input('id_conciliacion', sql.Numeric, idConciliacion)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}