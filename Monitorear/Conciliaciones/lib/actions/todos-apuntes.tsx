'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchTodosApuntes(empresa: string, cod_prod_bancario: number, fechaInicio: string, fechaFin?: string) {
    try {

        console.log('FECHA INICIO: ' + fechaInicio + ' EMPRESA: ' + empresa + ' COD_PROD_BANCARIO: ' + cod_prod_bancario);
        const pool = await getConnection();
        let query
        if (!fechaFin) {
            query = `SELECT A.ID, C.ID_CONCILIACION, C.ID_Apuntes, A.IMPORTE,A.FECHA, A.EMPRESA ,A.CLAVE_IMPORTE as DebeHaber,
                    CASE 
                        WHEN C.ID_Apuntes IS NOT NULL THEN '1'
                        ELSE '0'
                    END AS Editar
                    , A.DESCRI_ASI As DESCRI_ASI
                    FROM dbo.vw_CON_ApuntesContablesConciliables A
                    LEFT JOIN dbo.GH_CON_Apuntes_Conciliados C ON A.ID = C.ID_Apuntes
                    LEFT JOIN GH_CON_FECHAINICIO FI on FI.COD_EMPRESA = A.EMPRESA
                    WHERE A.EMPRESA = @empresa
                    AND A.FECHA >= @fecha and fecha >= fechaInicio
                    AND A.COD_PROD_BANCARIO = @cod_prod_bancario;`;
        } else if (fechaFin) {
            query = `SELECT A.ID, C.ID_CONCILIACION, C.ID_Apuntes, A.IMPORTE,A.FECHA, A.EMPRESA ,A.CLAVE_IMPORTE as DebeHaber,
            CASE 
                WHEN C.ID_Apuntes IS NOT NULL THEN '1'
                ELSE '0'
            END AS Editar
            , A.DESCRI_ASI As DESCRI_ASI
            FROM dbo.vw_CON_ApuntesContablesConciliables A
            LEFT JOIN dbo.GH_CON_Apuntes_Conciliados C ON A.ID = C.ID_Apuntes
            WHERE A.EMPRESA = @empresa
            AND A.FECHA between @fecha and @fechaFin and fecha >= fechaInicio
            AND A.COD_PROD_BANCARIO = @cod_prod_bancario;`;
        }
        const result = await pool.request()
            .input('fecha', sql.VarChar, fechaInicio)
            .input('empresa', sql.VarChar, empresa)
            .input('cod_prod_bancario', cod_prod_bancario)
            .input('fechaFin', fechaFin)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}



