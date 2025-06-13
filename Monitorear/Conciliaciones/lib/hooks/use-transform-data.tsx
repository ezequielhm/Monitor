import moment from 'moment';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ApunteContable, MovimientoBancario, apuntesConciliadosType, movimientosConciliadosType, todosApuntesType, todosMovimientosType } from '@/lib/definitions';
import { asignarTablaVacia, useStore } from '@/lib/store';

export const DataApuntesContables = () => { // Manipulamos campos de apuntes contables para mostrar en la tabla

    const apuntesContables: ApunteContable[] = useStore((state) => state.apuntesContables);
    const [data, setData] = useState<ApunteContable[]>([]);

    useEffect(() => {
        // Formateamos la fecha y el importe
        try {
            setData(apuntesContables.map((apunte) => ({
                ...apunte,
                // El objetivo es que las columnas 'Fecha' e 'impString' tengan el mismo nombre en todas las tablas
                Fecha: moment(apunte.FECHA).format('DD/MM/YYYY'),
                impString: new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                })
                    .format(apunte.IMPORTE)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
            })));

            const isTablaVacia = (apuntesContables.length === 0);
            asignarTablaVacia('apuntes', isTablaVacia); // si no hay registros, llamamos a la función del store para modifiicar el estado de 'tablaSinResultados'
        } catch (error) {
            console.error('Error formatting data in useEffect:', error);
        }
    }, [apuntesContables]);

    return {data, setData};
}

export const DataMovimientosBancarios = () => {

    const movimientosBancarios: MovimientoBancario[] = useStore((state) => state.movimientosBancarios);
    const [data, setData] = useState<MovimientoBancario[]>([]);

    useEffect(() => {
        try {
            setData(movimientosBancarios
                .filter(movimiento => movimiento.Excluir === '0') // Traemos todos los movimientos para que cuandren los saldos, pero no mostramos en la tabla los excluidos
                .map((movimiento) => ({
                ...movimiento,
                Fecha: moment(movimiento.fechaOperacion).format('DD/MM/YYYY'),
                impString: new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                })
                    .format(movimiento.IMPORTE)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
                })) 
            );

            const isTablaVacia = (movimientosBancarios.length === 0);
            asignarTablaVacia('bancos', isTablaVacia);
        } catch (error) {
            console.error('Error formatting data in useEffect:', error);
        }
    }, [movimientosBancarios]);

    // return data;
    return {data, setData};
}

export const DataApuntesConciliados = (setLoading?:Dispatch<SetStateAction<boolean>>) => { // Hay un parámetro opcional para controlar el estado de carga de la tabla que solo sirve para las tablas de edición (debido a su lógica)

    const apuntesConciliados: apuntesConciliadosType[] = useStore((state) => state.apuntesConciliados);
    const [data, setData] = useState<apuntesConciliadosType[]>([]);

    useEffect(() => {
        try {
            if (apuntesConciliados.length > 0) {
                setData(apuntesConciliados
                    .map((apunte) => ({
                        ...apunte,
                        Fecha: moment(apunte.FechaApunte).format('DD/MM/YYYY'),
                        impString: new Intl.NumberFormat('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                            .format(Number(apunte.IMPORTE))
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
                    }))
                );
                setLoading && setLoading(false);
            } else {
                setLoading && setLoading(true);
            }
            
            const isTablaVacia = (apuntesConciliados.length === 0);
            asignarTablaVacia('apuntes', isTablaVacia);
        } catch (error) {
            console.error('Error formatting data in useEffect:', error);
        }
    }, [apuntesConciliados]);

    // return data;
    return {data, setData};
}

export const DataMovimientosConciliados = (setLoading?:Dispatch<SetStateAction<boolean>>) => {

    const movimientosConciliados: movimientosConciliadosType[] = useStore((state) => state.movimientosConciliados);
    const [data, setData] = useState<movimientosConciliadosType[]>([]);

    useEffect(() => {
        try {
            if (movimientosConciliados.length > 0) {
                setData(movimientosConciliados
                    .map((movimiento) => ({
                        ...movimiento,
                        Fecha: moment(movimiento.FechaMovimiento).format('DD/MM/YYYY'),
                        impString: new Intl.NumberFormat('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                            .format(Number(movimiento.IMPORTE))
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
                    }))
                );
                setLoading && setLoading(false);
            } else {
                setLoading && setLoading(true);
            }
            
            const isTablaVacia = (movimientosConciliados.length === 0);
            asignarTablaVacia('bancos', isTablaVacia);
            setLoading && setLoading(false);
        } catch (error) {
            console.error('Error formatting data in useEffect:', error);
        }
    }, [movimientosConciliados]);

    // return data;
    return {data, setData};
}

export const DataTodosApuntes = () => { // Datos procedentes tanto de apuntes contables como de apuntes conciliados

    const todosApuntes: todosApuntesType[] = useStore((state) => state.todosApuntes);
    const [data, setData] = useState<todosApuntesType[]>([]);

    useEffect(() => {
        try {
            if (todosApuntes.length > 0) {
                setData(todosApuntes
                    .map((apunte) => ({
                        ...apunte,
                        Fecha: moment(apunte.FECHA).format('DD/MM/YYYY'),
                        impString: new Intl.NumberFormat('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                            .format(Number(apunte.IMPORTE))
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
                    }))
                );
            }
            
            const isTablaVacia = (todosApuntes.length === 0);
            asignarTablaVacia('apuntes', isTablaVacia);
        } catch (error) {
            console.error('Error formatting data in useEffect:', error);
        }
    }, [todosApuntes]);

    // return data;
    return {data, setData};
}
export const DataTodosMovimientos = () => {

    const todosMovimientos: todosMovimientosType[] = useStore((state) => state.todosMovimientos);
    const [data, setData] = useState<todosMovimientosType[]>([]);

    useEffect(() => {
        try {
            if (todosMovimientos.length > 0) {
                setData(todosMovimientos
                    .map((movimiento) => ({
                        ...movimiento,
                        Fecha: moment(movimiento.fechaOperacion).format('DD/MM/YYYY'),
                        impString: new Intl.NumberFormat('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                            .format(Number(movimiento.IMPORTE))
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
                    }))
                );
            }
            
            const isTablaVacia = (todosMovimientos.length === 0);
            asignarTablaVacia('bancos', isTablaVacia);
        } catch (error) {
            console.error('Error formatting data in useEffect:', error);
        }
    }, [todosMovimientos]);

    // return data;
    return {data, setData};
}


export const DataApuntesConciliacionHistorica = () => { // Manipulamos campos de apuntes contables para mostrar en la tabla

    const apuntesConciliacionHistorica: ApunteContable[] = useStore((state) => state.apuntesConciliacionHistorica);
    const [data, setData] = useState<ApunteContable[]>([]);

    useEffect(() => {
        // Formateamos la fecha y el importe
        try {
            setData(apuntesConciliacionHistorica.map((apunte) => ({
                ...apunte,
                // El objetivo es que las columnas 'Fecha' e 'impString' tengan el mismo nombre en todas las tablas
                Fecha: apunte.FECHA ? moment(apunte.FECHA).format('DD/MM/YYYY') : '',
                fechaEfectiva: apunte.FechaEfectiva ? moment(apunte.FechaEfectiva).format('DD/MM/YYYY') : '',
                impString: new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                })
                    .format(apunte.IMPORTE)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
            })));

            const isTablaVacia = (apuntesConciliacionHistorica.length === 0);
            asignarTablaVacia('', isTablaVacia); // si no hay registros, llamamos a la función del store para modifiicar el estado de 'tablaSinResultados'
        } catch (error) {
            console.error('Error formatting data in useEffect:', error);
        }
    }, [apuntesConciliacionHistorica]);

    return {data, setData};
}

export const DataMovimientosConciliacionHistorica = () => { // Manipulamos campos de apuntes contables para mostrar en la tabla

    const movimientosConciliacionHistorica: MovimientoBancario[] = useStore((state) => state.movimientosConciliacionHistorica);
    const [data, setData] = useState<MovimientoBancario[]>([]);

    useEffect(() => {
        // Formateamos la fecha y el importe
        try {
            setData(movimientosConciliacionHistorica
                .map((movimiento) => ({
                ...movimiento,
                Fecha: movimiento.fechaOperacion ? moment(movimiento.fechaOperacion).format('DD/MM/YYYY') : '',
                fechaEfectiva: movimiento.FechaEfectiva ? moment(movimiento.FechaEfectiva).format('DD/MM/YYYY') : '',
                impString: new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                })
                    .format(movimiento.IMPORTE)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
                })) 
            );

            const isTablaVacia = (movimientosConciliacionHistorica.length === 0);
            asignarTablaVacia('', isTablaVacia); // si no hay registros, llamamos a la función del store para modifiicar el estado de 'tablaSinResultados'
        } catch (error) {
            console.error('Error formatting data in useEffect:', error);
        }
    }, [movimientosConciliacionHistorica]);

    return {data, setData};
}