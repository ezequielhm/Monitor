'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchMovimientosConciliados(numeroCuenta: string, empresa: string, fechaInicio: string, fechaFin?: string) {
    try {
        const pool = await getConnection();
        let query
        if (!fechaFin) {
            query = `SELECT movimientosConciliados.[ID], movimientosConciliados.[ID_CONCILIACION], [ID_Movimiento], movimientosConciliados.[Importe] as IMPORTE, 
                            [FechaMovimiento], MVB.claveDebeHaber, 
                            conciliaciones.Empresa, CuentaBanc, MVB.info_1, MVB.info_2, MVB.info_3_4, MVB.info_5
                     FROM [dbo].[GH_CON_Movimientos_Conciliados] movimientosConciliados
                     left join GH_CON_CONCILIACIONES conciliaciones on 
                     conciliaciones.ID_CONCILIACION = movimientosConciliados.ID_CONCILIACION
                     left join [dbo].[vw_CON_MovimientosBancarios] MVB on MVB.id = movimientosConciliados.ID_Movimiento
                     where conciliaciones.empresa = @empresa
                     and MVB.numeroCuenta LIKE @numeroCuenta and
                     FechaMovimiento >= @fecha`;
        } else if (fechaFin) {
            query = `SELECT movimientosConciliados.[ID], movimientosConciliados.[ID_CONCILIACION], [ID_Movimiento], movimientosConciliados.[Importe] as IMPORTE, 
                            [FechaMovimiento], MVB.claveDebeHaber, 
                            conciliaciones.Empresa, CuentaBanc, MVB.info_1, MVB.info_2, MVB.info_3_4, MVB.info_5
                     FROM [dbo].[GH_CON_Movimientos_Conciliados] movimientosConciliados
                     left join GH_CON_CONCILIACIONES conciliaciones on 
                     conciliaciones.ID_CONCILIACION = movimientosConciliados.ID_CONCILIACION
                     left join [dbo].[vw_CON_MovimientosBancarios] MVB on MVB.id = movimientosConciliados.ID_Movimiento
                     where conciliaciones.empresa = @empresa
                     and MVB.numeroCuenta LIKE @numeroCuenta and
                     FechaMovimiento between @fecha and @fechaFin`;
        }
        const result = await pool.request()
            .input('numeroCuenta', sql.VarChar, `%${numeroCuenta}`)
            .input('empresa', sql.VarChar, empresa)
            .input('fecha', sql.VarChar, fechaInicio)
            .input('fechaFin', sql.VarChar, fechaFin)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}
