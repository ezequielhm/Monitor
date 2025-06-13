'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchApuntesContables(empresa:string, cod_prod_bancario:number, fechaInicio:string) {
    try {

        console.log('empresa: ', empresa, 'cod_prod_bancario: ', cod_prod_bancario, 'fechaInicio: ', fechaInicio);

        console.time('Tiempo de ejecución de la consulta SQL de apuntes contables');

        const pool = await getConnection();
        let query = `SELECT A.tipo, A.ID, A.FECHA, A.EMPRESA, A.REF_APUNTE, A.REF_APUNTE_LINEA, A.REF_ASI, A.DESCRI_ASI, A.IMPORTE AS impString, A.IMPORTE, 
                     A.CLAVE_IMPORTE, A.IMP_DEBE, A.IMP_HABER, A.COD_PROD_BANCARIO, A.COD_EMPRESA, A.ENTIDAD_FINANCIERA, A.TIPO_PROD_BANCARIO, A.NUM_CTA_BANCARIA, 
                     A.CTA_CONTABLE, A.SUBCTA_CONTABLE, A.Estado, A.Comentario, A.Usuario
                     FROM vw_CON_ApuntesContablesConciliables A
                     LEFT JOIN GH_CON_Apuntes_Conciliados AC ON A.ID = AC.ID_Apuntes
                    WHERE EMPRESA = @empresa AND 
						(FECHA >= @fecha OR
						TIPO IN ('INICIAL', 'IMPORTADO')) AND
                    COD_PROD_BANCARIO = @cod_prod_bancario AND
                    DIARIO <> 'DCA' AND DIARIO <> 'ACP' AND AC.ID_Apuntes IS NULL`;                  

        const result = await pool.request()
        .input('fecha', sql.VarChar, fechaInicio)
        .input('empresa',sql.VarChar, empresa)
        .input('cod_prod_bancario', cod_prod_bancario)
        .query(query);

        console.timeEnd('Tiempo de ejecución de la consulta SQL de apuntes contables');

        console.log('result: ', result.recordset);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}
