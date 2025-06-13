'use server'

import { getConnection } from '@/lib/db';
import sql from 'mssql';

function formatearFecha(fecha: string) {
  const date = new Date(fecha);
  if (isNaN(date.getTime())) {
    throw new Error(`Fecha inválida: ${fecha}`);
  }
  return date.toLocaleDateString('en-CA');
}

async function insertarPorLotes(lista: any[], tabla: string, columnas: string, nuevoID: number, transaction: any): Promise<boolean> {
  try {
    for (let i = 0; i < lista.length; i += 200) {
      const lote = lista.slice(i, i + 200);
      let cadenaValues = '';

      for (const item of lote) {
        let valores = '';

        if (tabla === '[dbo].[GH_CON_Apuntes_Conciliados]') {
          const idApunte = item.ID;
          const fechaApunte = formatearFecha(String(item.FECHA));
          const importeApunte = item.IMPORTE;
          const DebeHaberApunte = item.CLAVE_IMPORTE;

          valores = `(${nuevoID}, '${idApunte}', ${importeApunte}, '${fechaApunte}', '${DebeHaberApunte}')`;
        } else if (tabla === '[dbo].[GH_CON_Movimientos_Conciliados]') {
          const idMovimiento = item.ID;
          const fechaMovimiento = formatearFecha(String(item.fechaOperacion));
          const importeMovimiento = item.IMPORTE;
          const DebeHaberMovimiento = item.claveDebeHaber;

          valores = `(${nuevoID}, ${idMovimiento}, ${importeMovimiento}, '${fechaMovimiento}', '${DebeHaberMovimiento}')`;
        }

        cadenaValues += `${valores},`;
      }

      // Eliminar la última coma y hacer la consulta
      cadenaValues = cadenaValues.slice(0, -1);

      const query = `
        INSERT INTO ${tabla}
        ${columnas}
        VALUES ${cadenaValues};
      `;

      await transaction.request().query(query);
    }

    return true;
  } catch (error) {
    console.error(`Error al insertar registros en ${tabla}: `, error);
    return false;
  }
}

export async function insertConciliacionCompleta(
  empresa: string,
  cuentaBanc: string,
  importeConciliado: number,
  idUsuario: string,
  empresaSeleccionada: string,
  fechaEfectiva: string,
  listaIdSelBancos: any[],
  listaIdSelCuentas: any[],
) {
  const pool = await getConnection();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // Insertar en GH_CON_CONCILIACIONES y obtener el nuevo ID
    const queryConciliacion = `
      INSERT INTO [dbo].[GH_CON_CONCILIACIONES] 
      (Empresa, CuentaBanc, ImporteConciliado, CargaAutomatica, FechaCreacion, ID_Usuario, NombreEmpresa, FechaEfectiva)
      OUTPUT INSERTED.ID_conciliacion AS nuevoID
      VALUES 
      (@empresa, @cuentaBanc, @importeConciliado, 0, GETDATE(), @idUsuario, @empresaSeleccionada, @fechaEfectiva);
    `;

    const requestConciliacion = transaction.request();
    requestConciliacion
      .input('empresa', sql.VarChar, empresa)
      .input('cuentaBanc', sql.VarChar, cuentaBanc)
      .input('importeConciliado', sql.Decimal(18, 2), importeConciliado)
      .input('idUsuario', sql.VarChar, idUsuario)
      .input('empresaSeleccionada', sql.VarChar, empresaSeleccionada)
      .input('fechaEfectiva', sql.VarChar, fechaEfectiva);

    const resultConciliacion = await requestConciliacion.query(queryConciliacion);
    console.log('Primera consulta');
    const nuevoID = resultConciliacion.recordset[0].nuevoID;

    let successApuntes = true;
    let successMovimientos = true;

    // Insertar apuntes contables en lotes de 200 si existen
    if (listaIdSelCuentas.length > 0) {
      const columnasApuntes = `
        ([ID_CONCILIACION], [ID_Apuntes], [Importe], [FechaApunte], [DebeHaber])
      `;
      successApuntes = await insertarPorLotes(listaIdSelCuentas, '[dbo].[GH_CON_Apuntes_Conciliados]', columnasApuntes, nuevoID, transaction);
      console.log('Segunda consulta');
    }

    // Insertar movimientos bancarios en lotes de 200 si existen
    if (listaIdSelBancos.length > 0) {
      const columnasMovimientos = `
        ([ID_CONCILIACION], [ID_Movimiento], [Importe], [FechaMovimiento], [DebeHaber])
      `;
      successMovimientos = await insertarPorLotes(listaIdSelBancos, '[dbo].[GH_CON_Movimientos_Conciliados]', columnasMovimientos, nuevoID, transaction);
      console.log('Tercera consulta');
    }

    // Verificar si ambas inserciones fueron exitosas si hay registros para ambas
    if (listaIdSelCuentas.length > 0 && listaIdSelBancos.length > 0 && (!successApuntes || !successMovimientos)) {
      throw new Error('Error al insertar apuntes contables o movimientos bancarios');
    }

    // Confirmar la transacción
    await transaction.commit();

    return { success: true, nuevoID };
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();
    console.error('Error al insertar conciliación completa: ', error);
    throw error;
  }
}
