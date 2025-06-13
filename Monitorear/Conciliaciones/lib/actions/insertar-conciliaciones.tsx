'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchInsertConciliaciones(empresa: string, cuentaBanc: string, importeConciliado: number, idUsuario: string, empresaSeleccionada: string, fechaEfectiva: string) {
    const pool = await getConnection();
    const transaction = pool.transaction();

    try {
        await transaction.begin();

        // Usar OUTPUT INSERTED para obtener el nuevo ID directamente
        const query = `
        INSERT INTO [dbo].[GH_CON_CONCILIACIONES] 
        (Empresa, CuentaBanc, ImporteConciliado, CargaAutomatica, FechaCreacion, ID_Usuario, NombreEmpresa, FechaEfectiva)
        OUTPUT INSERTED.ID_conciliacion AS nuevoID
        VALUES 
        (@empresa, @cuentaBanc, @importeConciliado, 0, GETDATE(), @idUsuario, @empresaSeleccionada, @fechaEfectiva);
        `;

        const request = transaction.request();
        request
            .input('empresa', sql.VarChar, empresa)
            .input('cuentaBanc', sql.VarChar, cuentaBanc)
            .input('importeConciliado', sql.Decimal(18, 2), importeConciliado)
            .input('idUsuario', sql.VarChar, idUsuario)
            .input('empresaSeleccionada', sql.VarChar, empresaSeleccionada)
            .input('fechaEfectiva', sql.VarChar, fechaEfectiva);

        // Ejecuta la consulta
        const result = await request.query(query);
        
        const nuevoID = result.recordset[0].nuevoID;

        await transaction.commit();

        return { success: true, nuevoID };
    } catch (error) {
        await transaction.rollback();
        console.error('Error al intentar insertar una conciliación en la tabla GH_CON_CONCILIACIONES: ', error);
        throw error;
    }
}
