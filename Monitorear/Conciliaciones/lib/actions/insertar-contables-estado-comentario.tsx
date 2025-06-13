'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function fetchInsertApunteEstComen(id: string, Estado: string, comentario: string, usuario:string) {
    const pool = await getConnection();
    const transaction = pool.transaction();

    try {
        await transaction.begin();

        // Upsert using MERGE
        const mergeQuery = `
            MERGE [dbo].[GH_CON_Apuntes_Estado_Comentario] AS target
            USING (VALUES (@id, @Estado, @comentario, @usuario)) AS source ([ID], [Estado], [Comentario], [Usuario])
            ON target.[ID] = source.[ID]
            WHEN MATCHED THEN 
                UPDATE SET 
                    [Estado] = source.[Estado],
                    [Comentario] = source.[Comentario],
                    [usuario] = source.[usuario]
            WHEN NOT MATCHED THEN
                INSERT ([ID], [Estado], [Comentario], [Usuario])
                VALUES (source.[ID], source.[Estado], source.[Comentario], source.[usuario]);
        `;

        await transaction.request()
            .input('id', sql.VarChar, id)
            .input('Estado', sql.VarChar, Estado)
            .input('comentario', sql.VarChar, comentario)
            .input('usuario', sql.VarChar, usuario)
            .query(mergeQuery);

        await transaction.commit();
        console.log('Record inserted or updated successfully');

    } catch (error) {
        await transaction.rollback();
        console.error('Database error: ', error);
        throw error;
    }
}