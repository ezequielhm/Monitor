'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchTodosMovimientos(numeroCuenta: string, fechaInicio: string, fechaFin?: string) {
    try {
        const pool = await getConnection();
        console.log('numeroCuenta: ', numeroCuenta);
        let query
        if (!fechaFin) {
            query = `SELECT M.ID, C.ID_CONCILIACION, M.fechaOperacion, M.info_1, M.info_2, M.info_3_4, 
                    M.info_5, M.importe as IMPORTE, M.claveDebeHaber, M.Excluir,
                    CASE 
                        WHEN C.ID_Movimiento IS NOT NULL THEN '1'
                        ELSE '0'
                    END AS Editar
                
                FROM dbo.vw_CON_MovimientosBancarios M
                LEFT JOIN dbo.GH_CON_Movimientos_Conciliados C ON M.ID = C.ID_Movimiento
                WHERE M.fechaOperacion >= @fechaInicio 
                AND M.numeroCuenta LIKE @numeroCuenta;`;
        } else if (fechaFin) {
            query = `SELECT M.ID, C.ID_CONCILIACION, M.fechaOperacion, M.info_1, M.info_2, M.info_3_4, 
            M.info_5, M.importe as IMPORTE, M.claveDebeHaber, M.Excluir,
            CASE 
                WHEN C.ID_Movimiento IS NOT NULL THEN '1'
                ELSE '0'
            END AS Editar
        FROM dbo.vw_CON_MovimientosBancarios M
        LEFT JOIN dbo.GH_CON_Movimientos_Conciliados C ON M.ID = C.ID_Movimiento
        WHERE M.fechaOperacion between @fechaInicio and @fechaFin
        AND M.numeroCuenta LIKE @numeroCuenta;`;
        }
        const result = await pool.request()
            .input('numeroCuenta', sql.VarChar, `%${numeroCuenta}`)
            .input('fechaInicio', sql.VarChar, fechaInicio)
            .input('fechaFin', fechaFin)
            .query(query);

        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}



