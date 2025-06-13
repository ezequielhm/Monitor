'use client';

import { useStore } from '@/lib/store';
import clsx from 'clsx';
import { useEffect } from 'react';
import { fetchInsertConciliaciones } from '@/lib/actions/insertar-conciliaciones';
import { fetchInsertApunteContable } from '@/lib/actions/insertar-apunte-contable';
import { fetchInsertMovimientoBancario } from '@/lib/actions/insertar-movimiento-bancario';
import { Apunte, Movimiento } from '@/lib/definitions';
import { verificarIdsEnConciliados } from '@/lib/actions/consultar-id-conciliacion';
import { insertConciliacionCompleta } from '@/lib/actions/insert-conciliacion-completa';

function BotonConciliar() {
  const {
    importeTotalBacnSel,
    importeTotalCuentasSel,
    empContable,
    numCuenta,
    fechaInicio,
    listaIdSelCuentas,
    listaIdSelBancos,
    codProductoBancario,
    empresaSeleccionada,
    usuario,
    setApuntesContables,
    setMovimientosBancarios,
    setSelectedRowsCuentas,
    setSelectedRowsBancos,
  } = useStore(state => ({
    importeTotalBacnSel: state.importeTotalBacnSel,
    empresaSeleccionada: state.empresaSeleccionada,
    importeTotalCuentasSel: state.importeTotalCuentasSel,
    empContable: state.empContable,
    numCuenta: state.numCuenta,
    fechaInicio: state.fechaInicio,
    listaIdSelBancos: state.listaIdSelBancos,
    listaIdSelCuentas: state.listaIdSelCuentas,
    codProductoBancario: state.codProductoBancario,
    usuario: state.userData.user.usuario,
    setApuntesContables: state.setApuntesContables,
    setMovimientosBancarios: state.setMovimientosBancarios,
    setSelectedRowsCuentas: state.setSelectedRowsCuentas,
    setSelectedRowsBancos: state.setSelectedRowsBancos,
  }));
  const variablesCoinciden = importeTotalBacnSel === importeTotalCuentasSel;
  const ambosSonCero = importeTotalBacnSel === 0 && importeTotalCuentasSel === 0 && listaIdSelBancos.length === 0 && listaIdSelCuentas.length === 0;
  const botonDeshabilitado = !variablesCoinciden || ambosSonCero;

  useEffect(() => {
    // console.warn('importeTotalBacnSel:', importeTotalBacnSel);
    // console.warn('importeTotalCuentasSel:', importeTotalCuentasSel);
    // console.log('empContable:', empContable);
    // console.log('numCuenta:', numCuenta);
  }, [importeTotalBacnSel, importeTotalCuentasSel, variablesCoinciden, ambosSonCero]);

  function formatearFecha(fecha: string) {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) {
      throw new Error(`Fecha inválida: ${fecha}`);
    }
    return date.toLocaleDateString('en-CA');
  }

  let fechaEfectiva = '';
  function calcularFechaEfectiva() {
    const maxFechaApuntes = listaIdSelCuentas.reduce((maxFecha: string, apunte: any) => {
      const fecha = formatearFecha(String(apunte.FECHA));
      return fecha > maxFecha ? fecha : maxFecha;
    }, '0000-00-00');
    const maxFechaMovimientos = listaIdSelBancos.reduce((maxFecha: string, movimiento: any) => {
      const fecha = formatearFecha(String(movimiento.fechaOperacion));
      return fecha > maxFecha ? fecha : maxFecha;
    }, '0000-00-00');

    fechaEfectiva = maxFechaMovimientos > maxFechaApuntes ? maxFechaMovimientos : maxFechaApuntes;
    console.log('Fecha efectiva:', fechaEfectiva);
  }


  const handleClick = async () => {
    try {
      if (!usuario || usuario === '') throw new Error('El usuario no está registrado');

      calcularFechaEfectiva();

      const idsMovimientos = listaIdSelBancos.map((movimiento: Movimiento) => movimiento.ID);
      const idsApuntes = listaIdSelCuentas.map((apunte: Apunte) => apunte.ID);

      const { movimientosDuplicados, apuntesDuplicados } = await verificarIdsEnConciliados(idsMovimientos, idsApuntes);

      console.warn('duplicados:', apuntesDuplicados)

      // Si hay duplicados, mostrar un mensaje de error y no continuar con la inserción
      if (movimientosDuplicados.length > 0 || apuntesDuplicados.length > 0) {
        console.error('Algunos IDs ya están conciliados:', {
          movimientosDuplicados,
          apuntesDuplicados,
        });
        alert(`Error: Algunos de los registros seleccionados ya están conciliados.
            Movimientos duplicados: ${Array.isArray(movimientosDuplicados) ? movimientosDuplicados.join(', ') : ''}
            Apuntes duplicados: ${Array.isArray(apuntesDuplicados) ? apuntesDuplicados.join(', ') : ''}`);
        return;
      }
      // // Insertar conciliación y obtener el nuevo ID_conciliacion
      // const { success, nuevoID } = await fetchInsertConciliaciones(empContable, numCuenta, importeTotalCuentasSel, usuario, empresaSeleccionada, fechaEfectiva);

      // if (!success) throw new Error('Error al insertar la conciliación en la tabla GH_CON_CONCILIACIONES');

      // // Insertar movimientos bancarios con el ID_conciliacion
      // let cadenaValuesMovimientos = '';

      // for (const movimientoBancario of listaIdSelBancos) {
      //   const idMovimiento = movimientoBancario.ID;
      //   const fechaMovimiento = formatearFecha(String(movimientoBancario.fechaOperacion));
      //   const importe = movimientoBancario.IMPORTE;
      //   const DebeHaber = movimientoBancario.claveDebeHaber;

      //   // Aquí se incluye el nuevo ID de la conciliación
      //   cadenaValuesMovimientos += `(${nuevoID}, ${idMovimiento}, ${importe}, '${fechaMovimiento}', '${DebeHaber}'),`;
      // }
      // cadenaValuesMovimientos = cadenaValuesMovimientos.slice(0, -1);

      // const resultadoMovimientos = await fetchInsertMovimientoBancario(cadenaValuesMovimientos);
      // if (!resultadoMovimientos.success) throw new Error('Error al insertar los movimientos bancarios en la base de datos');

      // // Insertar apuntes contables con el ID_conciliacion
      // let cadenaValuesApuntes = '';

      // for (const apunteContable of listaIdSelCuentas) {
      //   const idApunte = apunteContable.ID;
      //   const fechaApunte = formatearFecha(String(apunteContable.FECHA));
      //   const importe = apunteContable.IMPORTE;
      //   const DebeHaber = apunteContable.CLAVE_IMPORTE;

      //   // Aquí se incluye el nuevo ID de la conciliación
      //   cadenaValuesApuntes += `(${nuevoID}, '${idApunte}', ${importe}, '${fechaApunte}', '${DebeHaber}'),`;
      // }
      // cadenaValuesApuntes = cadenaValuesApuntes.slice(0, -1);

      // const resultadoApuntes = await fetchInsertApunteContable(cadenaValuesApuntes);
      // if (!resultadoApuntes.success) throw new Error('Error al insertar los apuntes contables en la base de datos');

      await insertConciliacionCompleta(empContable, numCuenta, importeTotalCuentasSel, usuario, empresaSeleccionada, fechaEfectiva, listaIdSelBancos, listaIdSelCuentas)

      // Recargar la tabla de apuntes contables y movimientos bancarios
      setApuntesContables(empContable, codProductoBancario, fechaInicio ?? '');
      setMovimientosBancarios(numCuenta, fechaInicio ?? '');

      // Limpiar las filas seleccionadas
      setSelectedRowsCuentas([]);
      setSelectedRowsBancos([]);

    } catch (error) {
      alert(`Error al conciliar, no se ha insertado ninguna conciliacion`);
    }
  };

  return (
    <>              
    <div className={`text-lg justify-end text-white rounded-md bg-red-500 pt-2 px-2 mx-2 transition-colors duration-300`}>
      Diferencia: {(() => {
        const diferencia = importeTotalBacnSel- importeTotalCuentasSel;

        const isNegative = diferencia < 0;
        const absDiferencia = Math.abs(diferencia);
        const prefix = isNegative ? 'H' : 'D'

        return `${new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
        }).format(absDiferencia)} ${prefix}`;
      })()}
    </div>
      <button
        onClick={handleClick}
        disabled={botonDeshabilitado}
        className={clsx(
          'm-0 w-fit rounded-md px-10 py-2 text-lg font-medium transition-colors mr-48 duration-300',
          {
            'text-gray-200 bg-gray-500 hover:bg-gray-600 cursor-not-allowed': botonDeshabilitado,
            'text-gray-200 bg-green-500 hover:bg-green-600': !botonDeshabilitado,
          }
        )}
      >
        Conciliar
      </button>
    </>
  );
}

export default BotonConciliar;
