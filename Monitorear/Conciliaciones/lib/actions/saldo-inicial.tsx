'use server'
import { getConnection } from "@/lib/db"
import sql from 'mssql'
export async function saldoInicial(EMP_CONTABLE: string, cuenta_bancaria: string) {
    try {
      const pool = await getConnection();
      let query = `SELECT SALDO, prod.NOMINAL, ROUND(SALDO - NOMINAL, 2) AS SALDO_REAL
                   FROM GH_CON_SALDOS_EMP_CONTABLE s
                   LEFT JOIN GH_TS_PROD_BANCARIOS prod 
                     ON prod.SUBCTA_CONTABLE = s.CUENTA_BANCARIA
                   WHERE año = YEAR(GETDATE())
                   AND INCLUIR_EN_PREV = 'S'
                   AND ESTA_ACTIVA = 'S'
                   AND EMP_CONTABLE = @emp_contable
                   AND cuenta_bancaria = @cuenta_bancaria`;
      const result = await pool.request()
        .input('emp_contable', sql.VarChar, EMP_CONTABLE)
        .input('cuenta_bancaria', sql.VarChar, cuenta_bancaria)
        .query(query);
      
      // Extraemos el primer objeto dentro de recordsets[0]
      const saldos = result.recordsets[0][0];
      return saldos;
    } catch (error) {
      console.error('error en la base de datos: ', error);
      throw error;
    }
  }
  