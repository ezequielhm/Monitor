'use client';

import { useStore } from '@/lib/store';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { gestionCuentasStore } from '@/lib/store/store-gestion-cuentas';
import fetchDeleteConciliacionParcialCuentasCero from '@/lib/actions/action-descociliar-parcial-cuentas-cero';

export default function BotonDesconciliarCuentaCero({ idConciliacion }: { idConciliacion: number }) {

    const socket = useStore(state => state.socket);

    const {
        importeTotalApuntesIzquierda,
        importeTotalApuntesDerecha,
        listaIdSelDerecha,
        listaIdSelIzquierda,
        apuntesCuentasCeroIzquierda,
        apuntesCuentasCeroDerecha,
    } = gestionCuentasStore(state => ({
        importeTotalApuntesIzquierda: state.importeTotalApuntesIzquierda,
        importeTotalApuntesDerecha: state.importeTotalApuntesDerecha,
        listaIdSelDerecha: state.listaIdSelDerecha,
        listaIdSelIzquierda: state.listaIdSelIzquierda,
        apuntesCuentasCeroIzquierda: state.apuntesCuentasCeroIzquierda,
        apuntesCuentasCeroDerecha: state.apuntesCuentasCeroDerecha,
    }))

    // importeMaximo es para evitar que se pueda desconciliar parcialmente todo - cuando todo este seleccionado no se puede desconciliar parcialmente
    const [importeMaximo, setImporteMaximo] = useState<number | null>(null);
    const variablesCoinciden = importeTotalApuntesIzquierda === importeTotalApuntesDerecha;
    const sinSeleccionar = listaIdSelIzquierda.length === 0 && listaIdSelDerecha.length === 0;
    let todosSeleccionados = true;

    let botonDeshabilitado;

    if (apuntesCuentasCeroIzquierda.length > 0 && apuntesCuentasCeroDerecha.length > 0) {
        // Concicliación horizontal
        todosSeleccionados = listaIdSelIzquierda.length === apuntesCuentasCeroIzquierda.length && listaIdSelDerecha.length === apuntesCuentasCeroDerecha.length;
        botonDeshabilitado = !variablesCoinciden || sinSeleccionar || todosSeleccionados;
    } else {
        // Concicliación vertical
        if (apuntesCuentasCeroIzquierda && apuntesCuentasCeroIzquierda.length > 0) {
            todosSeleccionados = apuntesCuentasCeroIzquierda.length === listaIdSelIzquierda.length;
        }
        if (apuntesCuentasCeroDerecha && apuntesCuentasCeroDerecha.length > 0) {
            todosSeleccionados = apuntesCuentasCeroDerecha.length === listaIdSelDerecha.length;
        }
        botonDeshabilitado = !variablesCoinciden || sinSeleccionar || todosSeleccionados;
    }

    useEffect(() => {
        !importeMaximo && setImporteMaximo(importeTotalApuntesIzquierda);
    },[importeTotalApuntesIzquierda])

    const todosApuntesCuentasCeroIzquierda = apuntesCuentasCeroIzquierda;
    const todosApuntesCuentasCeroDerecha = apuntesCuentasCeroDerecha;

    // Lista de apuntes izquierda que deben ser desconciliados, filtrando los apuntes que no están en la lista de seleccionados
    const listaApuntesIzquierdaDesconciliar = [
        // Filtrar los apuntes que están seleccionados (marcados) en la lista de seleccionados
        ...todosApuntesCuentasCeroIzquierda.filter(apunte => 
            !listaIdSelIzquierda.some((apunteSeleccionado: any) => 
                apunteSeleccionado.id === apunte.id // Busca el ID en toda la lista de seleccionados
            )
        )
    ];
    
    const listaApuntesDerechaDesconciliar = [
        // Filtrar los apuntes que están seleccionados (marcados) en la lista de seleccionados
        ...todosApuntesCuentasCeroDerecha.filter(apunteDerecha => 
            !listaIdSelDerecha.some((apunteSeleccionado: any) => 
                apunteSeleccionado.id == apunteDerecha.id // Busca el ID en toda la lista de seleccionados
            )
        )
    ];

    const handleClick = async () => {
        try {
            console.log('ENTRANDO A DESCONCILIAR parcialmente');
            
            const filterCuentaCero = JSON.parse(localStorage.getItem('filterCuentaCero') ?? '{}');
            console.log('filterCuentaCero', filterCuentaCero);

            await fetchDeleteConciliacionParcialCuentasCero(
                listaApuntesIzquierdaDesconciliar, listaApuntesDerechaDesconciliar, idConciliacion, importeMaximo
            );

            socket && socket.emit('recargaRevisionCuentasCero-toServer', {
                empresa1: filterCuentaCero.empresa1,
                cuenta1: filterCuentaCero.cuenta1,
                empresa2: filterCuentaCero.empresa2,
                cuenta2: filterCuentaCero.cuenta2,
            });
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