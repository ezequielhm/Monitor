'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchMovimientosConciliadosByConciliacion(idConciliacion: number) {
    try {
        const pool = await getConnection();
        let query = `SELECT movimientosConciliados.[ID], movimientosConciliados.[ID_CONCILIACION], [ID_Movimiento], movimientosConciliados.[Importe] as IMPORTE, 
                            [FechaMovimiento], MVB.claveDebeHaber, 
                            -- movimientosConciliados.DebeHaber as claveDebeHaber, 
                            conciliaciones.Empresa, CuentaBanc, MVB.info_1, MVB.info_2, MVB.info_3_4, MVB.info_5
                     FROM [dbo].[GH_CON_Movimientos_Conciliados] movimientosConciliados
                     left join GH_CON_CONCILIACIONES conciliaciones on 
                     conciliaciones.ID_CONCILIACION = movimientosConciliados.ID_CONCILIACION
                     left join [dbo].[vw_CON_MovimientosBancarios] MVB on MVB.id = movimientosConciliados.ID_Movimiento
                     where movimientosConciliados.ID_CONCILIACION = @id_conciliacion`;

        const result = await pool.request()
            .input('id_conciliacion', sql.Numeric, `${idConciliacion}`)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}
