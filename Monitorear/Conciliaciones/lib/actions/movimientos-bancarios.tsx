'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchMovimientosBancarios(numeroCuenta:string, fechaInicio:string) {
    console.time('Tiempo de ejecución de la consulta SQL de movimientos bancarios');
    try {
        const pool = await getConnection();      
        let query = `SELECT M.ID, M.fechaOperacion, M.fechaValor, M.info_1, M.info_2, M.info_3_4, M.info_5, M.importe AS impString, M.importe as IMPORTE, 
                     M.claveDebeHaber, M.descripcionTipoMovimiento, M.claveEntidad, M.claveOficina, M.numeroCuenta, M.Estado, M.Comentario, M.Usuario, M.Excluir
                     FROM vw_CON_MovimientosBancarios M
                     LEFT JOIN GH_CON_Movimientos_Conciliados MC on M.ID = MC.ID_Movimiento
                     WHERE (fechaOperacion >= @fechaInicio OR TIPO IN ('INICIAL'))
                     AND numeroCuenta LIKE @numeroCuenta AND MC.ID_Movimiento IS NULL and descripcionTipoMovimiento<> 'REGULARIZACION'`;

                    const result = await pool.request()                    
                    .input('numeroCuenta', sql.VarChar, `%${numeroCuenta}`)
                    .input('fechaInicio', sql.VarChar, fechaInicio)
                    .query(query);

                    console.timeEnd('Tiempo de ejecución de la consulta SQL de movimientos bancarios');

        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}
