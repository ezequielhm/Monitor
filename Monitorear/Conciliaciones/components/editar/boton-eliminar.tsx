'use client';

import { fetchBorrarConciliacion } from '@/lib/actions/delete-conciliacion';
import { useRouter } from 'next/navigation'
import ConfirmarBorrado from '@/components/editar/confirmar-borrado';
import { useStore } from '@/lib/store';

function BotonEliminar({idConciliacion} : {idConciliacion:number}) {
  
  const router = useRouter()
  const apuntesConciliados = useStore(state => state.apuntesConciliados);
  const movimientosConciliados = useStore(state => state.movimientosConciliados);
  const socket = useStore(state => state.socket);

  const handleBorrado = async () => {
    try {
      let empresa, codProductoBancario, numeroCuenta;
      if (apuntesConciliados.length > 0) {
        empresa = apuntesConciliados[0].Empresa;
        codProductoBancario = apuntesConciliados[0].COD_PROD_BANCARIO;
      }
      if (movimientosConciliados.length > 0) {
        numeroCuenta = movimientosConciliados[0].CuentaBanc;
      }

      const filters = JSON.parse(localStorage.getItem('filters') || '{}');
      console.log('FILTERS', filters);

      // borrar la conciliacion
      // los apuntes y movimientos conciliados relacionados se borrarán en cascada
      
      await fetchBorrarConciliacion(idConciliacion);
      console.log('Conciliacion Borrada Totalmente. ID: ', idConciliacion);

      socket && socket.emit('recargarRevision-toServer', {id: idConciliacion, empresa, codProductoBancario, numeroCuenta});
      socket && socket.emit('revalidarIncidencias-toServer');
      window.close();

    } catch (error) {
      console.error('Error al insertar la conciliación o el apunte contable:', error);
    }
    
  };

  return (
      <ConfirmarBorrado onConfirm={handleBorrado}/>
  );
}

export default BotonEliminar;
