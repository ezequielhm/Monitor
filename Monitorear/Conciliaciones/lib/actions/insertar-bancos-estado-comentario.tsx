'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchInsertMovimientoEstComen(id: number, Estado: string, comentario: string, usuario:string) {
    const pool = await getConnection();
    const transaction = pool.transaction();

    try {
        await transaction.begin();

        // Usando MERGE para realizar un UPSERT
        const mergeQuery = `
            MERGE INTO [dbo].[GH_CON_Movimientos_Estado_Comentario] AS target
            USING (VALUES (@id, @Estado, @comentario, @usuario)) AS source ([ID], [Estado], [Comentario], [Usuario])
            ON target.[ID] = source.[ID]
            WHEN MATCHED THEN
                UPDATE SET 
                    target.[Estado] = source.[Estado], 
                    target.[Comentario] = source.[Comentario],
                                        [usuario] = source.[usuario]

            WHEN NOT MATCHED THEN
                INSERT ([ID], [Estado], [Comentario], [Usuario])
                VALUES (source.[ID], source.[Estado], source.[Comentario], source.[usuario]);
        `;

        await transaction.request()
            .input('id', sql.Int, id)
            .input('Estado', sql.VarChar, Estado)
            .input('comentario', sql.VarChar, comentario)
            .input('usuario', sql.VarChar, usuario)
            .query(mergeQuery);

        await transaction.commit();
        console.log('Record merged successfully');

    } catch (error) {
        await transaction.rollback();
        console.error('Error en la base de datos: ', error);
        throw error;
    }
}
