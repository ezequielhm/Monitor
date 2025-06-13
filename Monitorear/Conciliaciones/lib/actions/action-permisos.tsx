'use server'

import { getConnection } from '@/lib/db';
export async function fetchPermisosUsuario(login: string) {
    console.log(login)
    try {
        const pool = await getConnection();
        let query =`select *
                    from GH_PRO.dbo.vw_CON_PermisosConciliaciones_new
                    where login = @login`;
        const result = await pool.request()
        .input('login', login)
        .query(query)
        return result.recordset//.push({COD_EMP_CONTABLE: '', NOMBRE_EMP_CONTABLE: 'Seleccione una empresa...'});
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error
    }
}

export async function fetchPermisosGrupo() {
    try {
        const pool = await getConnection();
        let query =`Select PA.*, PAE.EmpContable
                    from GH_PRO.dbo.GH_CON_PERMISOS_AREAS PA
                    left join GH_CON_PERMISOS_AREAS_EMPRESA PAE on PAE.Area = PA.Area`;
        const result = await pool.request()
        .query(query)
        return result.recordset//.push({COD_EMP_CONTABLE: '', NOMBRE_EMP_CONTABLE: 'Seleccione una empresa...'});
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error
    }
}

