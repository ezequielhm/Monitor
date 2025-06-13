'use server'

import { getConnection } from '@/lib/db';
export async function fetchEmpresa(login: string) {
    try {
        const pool = await getConnection();
        let query =`select distinct COD_EMP_CONTABLE, COD_EMPRESA, NOMBRE_EMP_CONTABLE
                    from vw_CON_Prueba_Permisos_Dinamicos
                    where usuario = @login`;

        const result = await pool.request()
        .input('login', login)
        .query(query)
        return result.recordset//.push({COD_EMP_CONTABLE: '', NOMBRE_EMP_CONTABLE: 'Seleccione una empresa...'});
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error
    }
}