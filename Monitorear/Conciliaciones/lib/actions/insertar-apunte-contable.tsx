'use server'

import { getConnection } from '@/lib/db';

export async function fetchInsertApunteContable(cadenaValues:string) {
    const pool = await getConnection();
    const transaction = pool.transaction();

    try {
        await transaction.begin();

        const query = `INSERT INTO [dbo].[GH_CON_Apuntes_Conciliados] 
                                   ([ID_CONCILIACION], [ID_Apuntes], [Importe], [FechaApunte], [DebeHaber])
                        VALUES ${cadenaValues}`

        await transaction.request().query(query);
        
        await transaction.commit();
    
        return { success: true };
    } catch (error) {
        await transaction.rollback();
        console.error('Error al insertar el apunte contable en la tabla GH_CON_Apuntes_Conciliados: ', error);
        throw error;
    }
}