'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchUpdateColor(id: string, newColor: string) {
    const pool = await getConnection();
    const transaction = pool.transaction();

    try {
        console.log('Iniciando transacción para actualizar color...');
        await transaction.begin();

        const updateQuery = `
            UPDATE [dbo].[GH_CON_Estado_Worksheet]
            SET [color] = @newColor
            WHERE [id] = @id;
        `;

        await transaction.request()
            .input('id', sql.VarChar(5), id)
            .input('newColor', sql.VarChar(7), newColor)
            .query(updateQuery);

        await transaction.commit();
        console.log('Color actualizado correctamente en la base de datos.');
    } catch (error) {
        await transaction.rollback();
        console.error('Error durante la actualización:', error);
        throw error;
    }
}
