'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchApuntesConciliacionHistorica(empresa:string, cod_prod_bancario:number, fechaInicio:string, fechaCorte: string) {
    try {
        
        console.time('fetchApuntesQuery');
        console.log('empresa: ', empresa, 'cod_prod_bancario: ', cod_prod_bancario, 'fechaInicio: ', fechaInicio, 'fechaCorte: ', fechaCorte);
        const pool = await getConnection();
        let query =    `SELECT A.ID, A.FECHA, A.EMPRESA, A.REF_APUNTE, A.REF_APUNTE_LINEA, A.REF_ASI, 
                            A.DESCRI_ASI, A.IMPORTE AS impString, A.IMPORTE, A.CLAVE_IMPORTE, A.IMP_DEBE, 
                            A.IMP_HABER, A.COD_PROD_BANCARIO, A.COD_EMPRESA, C.FechaEfectiva
                        FROM dbo.vw_CON_ApuntesContablesConciliables A
                        LEFT JOIN dbo.GH_CON_Apuntes_Conciliados AC
                            ON A.ID = AC.ID_Apuntes
                        LEFT JOIN dbo.GH_CON_CONCILIACIONES C
                            ON AC.ID_CONCILIACION = C.ID_CONCILIACION
                        WHERE A.EMPRESA = @empresa
                            AND A.COD_PROD_BANCARIO = @cod_prod_bancario
                            AND A.FECHA BETWEEN @fechaInicio AND @fechaCorte
                            AND (CAST(C.FechaEfectiva as DATE) > @fechaCorte OR c.ID_CONCILIACION IS NULL) 
                            AND DIARIO <> 'DCA'
                        `;                  
                        // tu consulta
                        console.timeEnd('fetchApuntesQuery');
                        
        const result = await pool.request()
        .input('fechaInicio', fechaInicio)
        .input('fechaCorte', fechaCorte)
        .input('empresa',sql.VarChar, empresa)
        .input('cod_prod_bancario', cod_prod_bancario)
        .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}
