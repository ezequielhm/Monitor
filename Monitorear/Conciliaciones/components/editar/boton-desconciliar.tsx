'use client';

import { useStore } from '@/lib/store';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { fetchBorrarApunteConciliado } from '@/lib/actions/delete-apunte-conciliado';
import { fetchBorrarMovimientoBancarioConciliado } from '@/lib/actions/delete-movimiento-conciliado';
import { fetchActualizarConciliacion } from '@/lib/actions/update-conciliaciones';
import { useRouter } from 'next/navigation';

function BotonDesconciliar({idConciliacion} : {idConciliacion:number}) {
  
  const router = useRouter()

  const {
    importeTotalBacnSel,
    importeTotalCuentasSel,
    listaIdSelCuentas,
    listaIdSelBancos,
    apuntesConciliados,
    movimientosConciliados,
    socket,
  } = useStore(state => ({
    importeTotalBacnSel: state.importeTotalBacnSel,
    importeTotalCuentasSel: state.importeTotalCuentasSel,
    listaIdSelBancos: state.listaIdSelBancos,
    apuntesConciliados: state.apuntesConciliados,
    movimientosConciliados : state.movimientosConciliados,
    listaIdSelCuentas: state.listaIdSelCuentas,
    socket: state.socket
  }));

  // importeMaximo es para evitar que se pueda desconciliar parcialmente todo - cuando todo este seleccionado no se puede desconciliar parcialmente
  const [importeMaximo, setImporteMaximo] = useState<number | null>(null);
  const variablesCoinciden = importeTotalBacnSel === importeTotalCuentasSel;
  const ambosSonCero = importeTotalBacnSel === 0 && importeTotalCuentasSel === 0;
  const sinSeleccionar = listaIdSelCuentas.length === 0 && listaIdSelBancos.length === 0;
  let todosSeleccionados = true;
  const importeEsMaximo = importeMaximo === importeTotalCuentasSel || importeMaximo === importeTotalBacnSel;
    
  let botonDeshabilitado;
  // console.log('VARIABLES CONINCIDEN: ', variablesCoinciden);
  // console.log('AMBOS SON CERO: ', ambosSonCero);
  // console.log('IMPORTE ES MAXIMO: ', importeEsMaximo);
  if (movimientosConciliados.length > 0 && apuntesConciliados.length > 0) {
    // console.log('CONCILIACIÓN HORIZONTAL');
    todosSeleccionados = listaIdSelCuentas.length === apuntesConciliados.length && listaIdSelBancos.length === movimientosConciliados.length;

    botonDeshabilitado = !variablesCoinciden || sinSeleccionar || todosSeleccionados;
  } else {
    // console.log('CONCILIACIÓN VERTICAL');
    if (apuntesConciliados && apuntesConciliados.length > 0) {
      todosSeleccionados = apuntesConciliados.length === listaIdSelCuentas.length;
    }
    if (movimientosConciliados && movimientosConciliados.length > 0) {
      todosSeleccionados = movimientosConciliados.length === listaIdSelBancos.length;
    }

    botonDeshabilitado = !variablesCoinciden || sinSeleccionar || todosSeleccionados;
  }
  
  // aqui inicializamos importe maximo - tiene que tener un único valor inmutable
  useEffect(() => {!importeMaximo && setImporteMaximo(importeTotalCuentasSel)}, [importeTotalCuentasSel]);

  // todos los apuntes conciliados y movimientos bancarios que vienen marcados por defecto (es decir, todos apuntes/movimientos conciliados de una misma conciliación)
  const todosApuntesConciliados = apuntesConciliados;
  const todosMovimientosConciliados = movimientosConciliados;

    // apuntes/movimientos conciliados desmarcados - se sacan de los que no pertenecen a ambos (todos apuntes/movimientos conciliados de una misma conciliación y todos los marcados)
  const listaCuentasDesconciliar = [...todosApuntesConciliados.filter(apunte => !listaIdSelCuentas.some((apunteSeleccionado:any) => apunteSeleccionado.ID === apunte.ID)),
                                    ...listaIdSelCuentas.filter((apunteSeleccionado:any) => !todosApuntesConciliados.some(apunte => apunte.ID === apunteSeleccionado.ID))];
                                    
  const listaBancosDesconciliar = [...todosMovimientosConciliados.filter(movimiento => !listaIdSelBancos.some((movimientoSeleccionado:any) => movimientoSeleccionado.ID === movimiento.ID)),
                            ...listaIdSelBancos.filter((movimientoSeleccionado:any) => !todosMovimientosConciliados.some(movimiento => movimiento.ID === movimientoSeleccionado.ID))];

  const handleClick = async () => {
    try {
      console.log('ENTRANDO A DESCONCILIAR')
      let empresa;
      let codProductoBancario;
      let numeroCuenta;
      // Borrar apuntes conciliados
      for (const apunteConciliado of listaCuentasDesconciliar) {
        const id = apunteConciliado.ID;
        empresa = apunteConciliado.Empresa;
        codProductoBancario = apunteConciliado.COD_PROD_BANCARIO;
        await fetchBorrarApunteConciliado(id);
        console.log(`Apunte contable borrado con éxito. ID: `, id);
      }

      //Borrar movimientos bancarios conciliados
      for (const movimientoConciliado of listaBancosDesconciliar) {
        const id = movimientoConciliado.ID;
        numeroCuenta = movimientoConciliado.CuentaBanc;

        await fetchBorrarMovimientoBancarioConciliado(id);
        console.log(`Apunte contable borrado con éxito. ID: `, id);
      }

      //Modificar la conciliación (importe nuevo y el usuario)
      
      await fetchActualizarConciliacion(idConciliacion,importeTotalCuentasSel);
      console.log('Conciliacion Actualizada / Borrada parcialmente. ID: ', idConciliacion, ' importeTotal: ', importeTotalCuentasSel);

      socket && socket.emit('recargarRevision-toServer', {id: idConciliacion, empresa, codProductoBancario, numeroCuenta}); 
      socket && socket.emit('revalidarIncidencias-toServer');
      window.close();
      
    } catch (error) {
      console.error('Error al insertar la conciliación o el apunte contable:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={botonDeshabilitado}
      className={clsx(
        'm-0 w-fit rounded-md px-10 py-2 text-lg font-medium transition-colors duration-300',
        {
          'text-gray-200 bg-gray-500 hover:bg-gray-600 cursor-not-allowed': botonDeshabilitado,
          'text-gray-200 bg-green-500 hover:bg-green-600': !botonDeshabilitado,
        }
      )}
    >
      Desconciliación Parcial
    </button>
  );
}

export default BotonDesconciliar;
