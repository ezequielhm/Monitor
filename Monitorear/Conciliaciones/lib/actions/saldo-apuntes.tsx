'use server'
import { getConnection } from "@/lib/db"
import sql from 'mssql'
export async function saldoApunte(EMP_CONTABLE: string, cuenta_bancaria: string, numeroCuenta: string, COD_PROD_BANCARIO: number, fechaInicio: string | null, fechaCorte: string, ventanaActual: string) {
    console.log(EMP_CONTABLE, cuenta_bancaria, numeroCuenta, COD_PROD_BANCARIO, fechaInicio)
    try {
        console.time('Tiempo de ejecución de la consulta SQL de saldo Apuntes');

        const pool = await getConnection();
        if (ventanaActual === 'conciliacionHistorica') {
            let query = `SELECT *
                         FROM dbo.fn_ObtenerSaldoApuntesHistorico(@fechaInicio, @fechaCorte, @numeroCuenta, @EMP_CONTABLE, @COD_PROD_BANCARIO)`;
            const result = await pool.request()
                .input('emp_contable', sql.VarChar, EMP_CONTABLE)
                .input('cuenta_bancaria', sql.VarChar, cuenta_bancaria)
                .input('numeroCuenta', sql.VarChar, `%${numeroCuenta}`)
                .input('COD_PROD_BANCARIO', sql.Numeric, COD_PROD_BANCARIO)
                .input('fechaInicio', sql.VarChar, fechaInicio)
                .input('fechaCorte', sql.VarChar, fechaCorte)
                .query(query);

            // Extraemos el primer objeto dentro de recordsets[0]
            const saldos = result.recordsets[0][0];
            return saldos;
        } else {
            let query = `SELECT *
                                     FROM dbo.fn_ObtenerSaldoApuntes(@fechaInicio, @numeroCuenta, @EMP_CONTABLE, @COD_PROD_BANCARIO)`;
            const result = await pool.request()
                .input('emp_contable', sql.VarChar, EMP_CONTABLE)
                .input('cuenta_bancaria', sql.VarChar, cuenta_bancaria)
                .input('numeroCuenta', sql.VarChar, `%${numeroCuenta}`)
                .input('COD_PROD_BANCARIO', sql.Numeric, COD_PROD_BANCARIO)
                .input('fechaInicio', sql.VarChar, fechaInicio)
                .query(query);

            // Extraemos el primer objeto dentro de recordsets[0]
            const saldos = result.recordsets[0][0];
            console.timeEnd('Tiempo de ejecución de la consulta SQL de saldo Apuntes');
            return saldos;
        }
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}
