'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchApuntesConciliados(empresa: string, productoBancario: number, fechaInicio: string, fechaFin?: string) {
    try {
        const pool = await getConnection();
        let query;
        console.log(fechaFin)
        if(!fechaFin){
        query = `SELECT apuntesConciliados.[ID], apuntesConciliados.[ID_CONCILIACION], [ID_Apuntes], apuntesConciliados.[Importe] as IMPORTE, 
		                    [FechaApunte], conciliaciones.Empresa, apuntesConciliados.DebeHaber
		                    , apuntesContables.COD_PROD_BANCARIO, apuntesContables.DESCRI_ASI
                        FROM [dbo].[GH_CON_Apuntes_Conciliados] apuntesConciliados
                        left join GH_CON_CONCILIACIONES conciliaciones on
                        conciliaciones.ID_CONCILIACION = apuntesConciliados.ID_CONCILIACION
                        LEFT join dbo.vw_CON_ApuntesContablesConciliables apuntesContables on
                        apuntesContables.ID = apuntesConciliados.ID_Apuntes
                        where conciliaciones.empresa = @empresa and
                        apuntesContables.COD_PROD_BANCARIO = @productoBancario and
						FechaApunte >= @fecha`;

        }else if(fechaFin){
            
            query = `SELECT apuntesConciliados.[ID], apuntesConciliados.[ID_CONCILIACION], [ID_Apuntes], apuntesConciliados.[Importe] as IMPORTE, 
                        [FechaApunte], conciliaciones.Empresa, apuntesConciliados.DebeHaber
                        , apuntesContables.COD_PROD_BANCARIO, apuntesContables.DESCRI_ASI
                    FROM [dbo].[GH_CON_Apuntes_Conciliados] apuntesConciliados
                    left join GH_CON_CONCILIACIONES conciliaciones on
                    conciliaciones.ID_CONCILIACION = apuntesConciliados.ID_CONCILIACION
                    LEFT join dbo.vw_CON_ApuntesContablesConciliables apuntesContables on
                    apuntesContables.ID = apuntesConciliados.ID_Apuntes
                    where conciliaciones.empresa = @empresa and
                    apuntesContables.COD_PROD_BANCARIO = @productoBancario and
                    FechaApunte between @fecha and @fechaFin`;
        }

        const result = await pool.request()
            .input('empresa', sql.VarChar, empresa)
            .input('productoBancario',  productoBancario)
            .input('fecha', sql.VarChar, fechaInicio)
            .input('fechaFin', sql.VarChar, fechaFin)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}