'use server'
import { getConnection } from "@/lib/db"
import sql from 'mssql'
export async function saldoMovimiento(EMP_CONTABLE: string, cuenta_bancaria: string, numeroCuenta: string, COD_PROD_BANCARIO: number, fechaInicio: string | null, fechaCorte: string, ventanaActual: string) {
    try {
        console.time('Tiempo de ejecución de la consulta SQL de saldo movimientos');
        const pool = await getConnection();
        if (ventanaActual === 'conciliacionHistorica') {
            let query = `Select *
            from dbo.fn_ObtenerSaldoMovimientosHistorico(@cuenta_bancaria, @numeroCuenta, @fechaInicio, @fechaCorte, @EMP_CONTABLE, @COD_PROD_BANCARIO)`;

            const result = await pool.request()
                .input('EMP_CONTABLE', sql.VarChar, EMP_CONTABLE)
                .input('cuenta_bancaria', sql.VarChar, cuenta_bancaria)
                .input('numeroCuenta', sql.VarChar, `%${numeroCuenta}`)
                .input('COD_PROD_BANCARIO', sql.Numeric, COD_PROD_BANCARIO)
                .input('fechaInicio', sql.VarChar, fechaInicio)
                .input('fechaCorte', sql.VarChar, fechaCorte)
                .query(query);

            // Extraemos el primer objeto dentro de recordsets[0]
            const saldos = result.recordsets[0][0];
            return saldos;
        }
        else {
            let query = `Select *
                     from dbo.fn_ObtenerSaldoMovimientos(@cuenta_bancaria, @numeroCuenta, @fechaInicio, @EMP_CONTABLE, @COD_PROD_BANCARIO)`;

            const result = await pool.request()
                .input('EMP_CONTABLE', sql.VarChar, EMP_CONTABLE)
                .input('cuenta_bancaria', sql.VarChar, cuenta_bancaria)
                .input('numeroCuenta', sql.VarChar, `%${numeroCuenta}`)
                .input('COD_PROD_BANCARIO', sql.Numeric, COD_PROD_BANCARIO)
                .input('fechaInicio', sql.VarChar, fechaInicio)
                .query(query);

            // Extraemos el primer objeto dentro de recordsets[0]
            const saldos = result.recordsets[0][0];
            
            console.timeEnd('Tiempo de ejecución de la consulta SQL de saldo movimientos');

            return saldos;
        }
    } catch (error) {
        console.error('error en la base de datos: ', error);
        throw error;
    }
}
