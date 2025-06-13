'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchMovimientosConciliacionHistorica(numeroCuenta:string, fechaInicio:string, fechaCorte:string) {
    try {
        console.time('fetchMovimientosQuery');

        console.log('numeroCuenta: ', numeroCuenta, 'fechaInicio: ', fechaInicio, 'fechaCorte: ', fechaCorte);
        const pool = await getConnection();      
        let query =    `SELECT M.ID, M.fechaOperacion, info_1, info_2, info_3_4, info_5, M.importe AS impString, M.importe as IMPORTE, M.claveDebeHaber, M.descripcionTipoMovimiento, claveEntidad, claveOficina, numeroCuenta, C.FechaEfectiva
                        FROM dbo.vw_CON_MovimientosBancarios M
                        LEFT JOIN dbo.GH_CON_Movimientos_Conciliados MC
                        ON M.id = MC.ID_Movimiento
                        LEFT JOIN dbo.GH_CON_CONCILIACIONES C
                        ON MC.ID_CONCILIACION = C.ID_CONCILIACION
                        WHERE M.numeroCuenta like @numeroCuenta and Excluir = 0
                        AND (CAST(C.FechaEfectiva as DATE) > @fechaCorte OR c.ID_CONCILIACION IS NULL)
                        AND (M.fechaOperacion BETWEEN @fechaInicio AND @fechaCorte or TIPO = 'INICIAL')`;

                    const result = await pool.request()                    
                    .input('numeroCuenta', sql.VarChar, `%${numeroCuenta}`)
                    .input('fechaInicio', fechaInicio)
                    .input('fechaCorte', fechaCorte)
                    .query(query);

                    console.timeEnd('fetchMovimientosQuery');

        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}
