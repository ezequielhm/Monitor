'use client'

import { useEffect, useState, use } from 'react';
import { useStore } from '@/lib/store';
import TablaApuntesEditar from '@/components/editar/tabla-apuntes-editar';
import TablaBancosEditar from '@/components/editar/tabla-bancos-editar';
import BotonDesconciliar from '@/components/editar/boton-desconciliar';
import BotonEliminar from '@/components/editar/boton-eliminar';
import { fetchCabecera } from '@/lib/actions/action-cabecera';

interface cabeceraType {
    nombre_emp_contable: string;
    cta_contable: string;
    subcta_contable: string;
    cuenta: string;
    id_conciliacion: number;
}

export default function Page(props: { params: Promise<{ id: number }> }) {
    const params = use(props.params);

    const [cabecera, setCabecera] = useState<cabeceraType[]>([]);
    const setApuntesConciliadosByConciliacion = useStore((state) => state.setApuntesConciliadosByConciliacion);
    const setMovimientosConciliadosByConciliacion = useStore((state) => state.setMovimientosConciliadosByConciliacion);

    useEffect(() => {
        setApuntesConciliadosByConciliacion(params.id);
        setMovimientosConciliadosByConciliacion(params.id);
        const fetchData = async () => {
            try {
                const result = await fetchCabecera(params.id);
                setCabecera(result);
            } catch (error) {
                console.error('Error fetching cabecera:', error);
            }
        };

        fetchData();
    }, []);
    return (
        <main className="flex flex-col w-full min-w-full h-full min-h-full overflow-hidden">
            <div className="flex justify-center w-full ">
                {cabecera[0] ? (
                    <p className='p-2 bg-white rounder-full m-1'>
                        {'Empresa: ' + cabecera[0].nombre_emp_contable + ' Cuenta: ' + cabecera[0].cta_contable + ' ' + cabecera[0].subcta_contable + ' ' + cabecera[0].cuenta}
                    </p>
                ) : (
                    <></>
                )}
            </div>
            <div className="flex justify-center w-full flex-grow overflow-auto">
                <div className="flex flex-col lg:flex-row justify-center w-full flex-grow">
                    <div className="mx-1 flex-grow min-w-0 max-w-[39vw] overflow-auto">
                        <TablaApuntesEditar />
                    </div>
                    <div className="mx-1 flex-grow min-w-0 max-w-[59vw] overflow-auto">
                        <TablaBancosEditar />
                    </div>
                </div>
            </div>

            <div className='w-full flex'>
                {/* Botón Imprimir */}
                <div className="flex justify-center py-7 w-full bg-gray-100">
                    <BotonEliminar idConciliacion={params.id} />
                </div>

                {/* Botón Conciliar */}
                <div className="flex justify-center py-7 w-full bg-gray-100">
                    <BotonDesconciliar idConciliacion={params.id} />
                </div>
            </div>
        </main>
    );
}
