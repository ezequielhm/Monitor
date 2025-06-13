'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchInsertEstado(id: string, color: string, descripcion: string, tipo: string, deshabilitado: boolean) {
    const pool = await getConnection();
    const transaction = pool.transaction();
    console.log('Datos a insertar: ',id, color, descripcion, tipo, deshabilitado)
    try {
        await transaction.begin();

        const insertQuery = `
            INSERT INTO [dbo].[GH_CON_Estado_Worksheet]
                   ([id], [color], [descripcion],  [tipo], [deshabilitado])
             VALUES
                   (@id, @color, @descripcion, @tipo, @deshabilitado);
        `;

        await transaction.request()
            .input('id', sql.VarChar(5), id)
            .input('color', sql.VarChar(7), color)
            .input('descripcion', sql.VarChar(255), descripcion)
            .input('tipo', sql.VarChar(1), tipo)
            .input('deshabilitado', sql.Bit, deshabilitado)
            .query(insertQuery);

        await transaction.commit();
        console.log('Record inserted successfully');
    } catch (error) {
        await transaction.rollback();
        console.error('Database error: ', error);
        throw error;
    }
}
