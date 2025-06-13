'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchFechaInicio(empContable: string) {
    try {
        const pool = await getConnection();
        let query = `SELECT fechaInicio
                     FROM [dbo].[GH_CON_FECHAINICIO]
                     WHERE COD_EMPRESA = @empContable`;
        const result = await pool.request()
            .input('empContable', sql.VarChar, empContable)
            .query(query);

        if (result.recordset.length > 0) {
            const fechaInicio = result.recordset[0].fechaInicio;
            const formattedFechaInicio = new Date(fechaInicio).toISOString().split('T')[0];
            return formattedFechaInicio;
        } else {
            console.log('No se encontró la fecha de inicio para la empresa:', empContable);
            return null;
        }

    } catch (error) {
        console.error('Error en la base de datos:', error);
        throw error;
    }
}
