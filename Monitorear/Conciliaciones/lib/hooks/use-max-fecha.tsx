import { ApunteContable, MovimientoBancario } from "../definitions";
import { useStore } from "../store";

  
const useMaxFecha = () => { // Hook para obtener la fecha más reciente de apuntes contables y movimientos bancarios
    const apuntesContables: ApunteContable[] = useStore((state) => state.apuntesContables); 
    const movimientosBancarios: MovimientoBancario[] = useStore((state) => state.movimientosBancarios);
    
    const maxFechaApunte = apuntesContables.length > 0
    ? apuntesContables.reduce((max, apunte) => 
        new Date(apunte.FECHA) > new Date(max.FECHA) ? apunte : max, apuntesContables[0])
    : { FECHA: new Date() };
    
    // Obtener la fecha más reciente de movimientos bancarios o usar la fecha de hoy si no hay registros
    const maxFechaMovimiento = movimientosBancarios.length > 0
    ? movimientosBancarios.reduce((max, movimiento) => 
        new Date(movimiento.fechaOperacion) > new Date(max.fechaOperacion) ? movimiento : max, movimientosBancarios[0])
    : { fechaOperacion: new Date() };

    return { maxFechaApunte, maxFechaMovimiento };
}

export default useMaxFecha;