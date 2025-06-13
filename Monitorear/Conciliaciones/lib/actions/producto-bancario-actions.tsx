'use server'

import { getConnection } from '@/lib/db';

export async function fetchProductoBancario(empContable: string) {
    try {
        const pool = await getConnection();
        let query = `SELECT DISTINCT PB.COD_PROD_BANCARIO, 
        concat(PB.COD_EMPRESA,' - ', pb.SUBCTA_CONTABLE, ' - ',TI.TIPO_PROD_BANCARIO, ' - ', RIGHT(NUM_CTA_BANCARIA, 5), ' - ', EF.ENTIDAD, ' - ', FORMAT(PB.NOMINAL, 'N0')) as PROD_BANCARIO
        , CTA_CONTABLE
        , SUBCTA_CONTABLE
        , right(num_cta_bancaria, 5) as numeroCuenta
        , NUM_CTA_BANCARIA
        FROM GH_PRO.dbo.GH_TS_PROD_BANCARIOS PB
        INNER JOIN GH_PRO.dbo.GH_TS_CONCESIONES C ON C.COD_CONCESION = PB.COD_EMPRESA
        INNER JOIN GH_PRO.dbo.GH_TS_ENT_FINANCIERAS EF ON EF.COD_ENTIDAD = PB.ENTIDAD_FINANCIERA
        INNER JOIN GH_PRO.dbo.GH_TS_TIPO_PROD_BANCARIOS TI ON TI.COD_TIPO_PRODUCTO = PB.TIPO_PROD_BANCARIO
        INNER JOIN GH_PRO.dbo.GH_QU_EMPRESAS E ON E.EMP_CONTABLE = C.EMP_CONTABLE
        WHERE NUM_CTA_BANCARIA IS NOT NULL
        AND CTA_CONTABLE IS NOT NULL
        AND ES_CONCILIACION = 'S'	
        AND E.EMP_CONTABLE = @empContable
        AND ESTA_ACTIVA = 'S'`
        ;

        const result = await pool.request()
            .input('empContable', empContable)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}
