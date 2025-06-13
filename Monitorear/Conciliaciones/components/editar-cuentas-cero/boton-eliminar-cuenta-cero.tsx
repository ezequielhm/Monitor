import { useStore } from "@/lib/store";
import ConfirmarBorrado from "./confirmar-borrado-cuenta-cero";
import fetchDeleteConciliacionCuentasCero from "@/lib/actions/action-desconciliar-cuentas-cero";

export default function BotonEliminarCuentaCero({idConciliacion} : {idConciliacion:number}) {

  const socket = useStore(state => state.socket);

  const handleBorrado = async () => {
    try {
        const filterCuentaCero = JSON.parse(localStorage.getItem('filterCuentaCero') ?? '{}');
        console.log('filterCuentaCero', filterCuentaCero);

        await fetchDeleteConciliacionCuentasCero(idConciliacion);
    
        // Emitir evento al socket con los datos de filterCuentaCero
        socket && socket.emit('recargaRevisionCuentasCero-toServer', {
            empresa1: filterCuentaCero.empresa1,
            cuenta1: filterCuentaCero.cuenta1,
            empresa2: filterCuentaCero.empresa2,
            cuenta2: filterCuentaCero.cuenta2,
        });
        socket && socket.emit('recargaRevisionCuentasCero-toServer');

        // Cerrar la ventana
        window.close();
    } catch (error) {
        console.error('Error al procesar la eliminación:', error);
    }
  };

    return (
        <ConfirmarBorrado onConfirm={handleBorrado} />
    )
}