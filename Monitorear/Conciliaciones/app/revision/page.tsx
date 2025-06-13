'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import BotonesConciliaciones from "@/components/conciliaciones/botones-navegar-worksheet";
import { FiltroGenerico } from "@/components/ui/filters/filtro-general";
import BackMenuButton from "@/components/ui/menu/back-button";
import TablaApuntesConciliadosRevision from "@/components/revision/tabla-apuntes-conciliados-revision";
import TablaBancosConciliadosRevision from "@/components/revision/tabla-bancos-conciliados-revision";
import TablaApuntesRevision from "@/components/revision/tabla-apuntes-revision";
import TablaBancosRevision from "@/components/revision/tabla-bancos-revision";
import { useStore } from '@/lib/store';
import { useEffect } from 'react';
import NotificacionesMenu from '@/components/ui/notificaciones-menu';
import OcultarFiltro from '@/components/ui/ocultar-filtros';
import Footer from '@/components/worksheet/footer-saldos';
import ProtectedPage from '@/components/ui/proteger-pantalla';
import TablaApuntesTodosRevision from '@/components/revision/tabla-apuntes-todos-revision';
import TablaBancosTodosRevision from '@/components/revision/tabla-bancos-todos-revision';
import PopupModal from '@/components/ui/resolver-incidencia-modal';
import { datosRecargarRevision } from '@/lib/definitions';
const LoaderWrapper = dynamic(() => import('@/components/ui/loader/loaderWrapper'), { ssr: false });

export default function Worksheet() {
    const regConciliados = useStore((state) => state.regConciliado);
    const setVentanaActual = useStore((state) => state.setVentanaActual);
    const { setApuntesContables, setMovimientosBancarios, setApuntesConciliados, setMovimientosConciliados, setTodosApuntes, setTodosMovimientos, fechaInicio } = useStore();
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(true);
    const [footer, setFooter] = useState(false);
    const setCargando = useStore(state => state.setCargando);
    const socket = useStore(state => state.socket);

    const handleSearch = () => {
        setHasSearched(true);
    };

    useEffect(() => {
        const savedVentana = 'conciliacionRevisar';
        // Aquí puedes hacer algo con `savedVentana`, como actualizar el estado de tu store
        setVentanaActual(savedVentana);  // Asumiendo que tienes una función `setVentanaActual` en tu store
    }, []);

    useEffect(() => {
        const handleSearch = async (datos: datosRecargarRevision) => {

            setCargando(true);
            try {
                const filters = JSON.parse(localStorage.getItem('filters') || '{}');
                console.log('COD PRODUCTO BANCARIO - FILTERS', filters.prodBancario.COD_PROD_BANCARIO);
                console.log('COD PRODUCTO BANCARIO - DATOS', datos.codProductoBancario);
                console.log('EMPRESA - FILTERS', filters.empContable);
                console.log('EMPRESA - DATOS', datos.empresa);
                console.log('NUMERO CUENTA - FILTERS', filters.prodBancario.numeroCuenta);
                console.log('NUMERO CUENTA - DATOS', datos.numeroCuenta);
                const compararPorApuntes = datos.empresa && datos.codProductoBancario;
                const compararPorMovimientos = datos.numeroCuenta;
                if (compararPorApuntes ? filters.empContable === datos.empresa && filters.prodBancario.COD_PROD_BANCARIO === datos.codProductoBancario 
                      : compararPorMovimientos ? filters.prodBancario.numeroCuenta === datos.numeroCuenta
                                               : false) {
                    console.log('SÍ SE RECARGA LA REVISIÓN');
                    if (filters.regConciliados === 'N') {
                        // console.log('RECARGANDO NO CONCILIADOS');
                        await setApuntesContables(filters.empContable, filters.prodBancario.COD_PROD_BANCARIO, fechaInicio ?? '');
                        await setMovimientosBancarios(filters.prodBancario.numeroCuenta, fechaInicio ?? '');
                    }
                    if (filters.regConciliados === 'S') {
                        // console.log('RECARGANDO CONCILIADOS');
                        await setApuntesConciliados(filters.empContable, filters.prodBancario.COD_PROD_BANCARIO, filters.fechaInicio, filters.fechaFin);
                        await setMovimientosConciliados(filters.prodBancario.numeroCuenta, filters.empContable, filters.fechaInicio, filters.fechaFin);
                    }
                    if (filters.regConciliados === '*') {
                        // console.log('RECARGANDO TODOS');
                        await setTodosApuntes(filters.empContable, filters.prodBancario.COD_PROD_BANCARIO, fechaInicio ?? '');
                        await setTodosMovimientos(filters.prodBancario.numeroCuenta, fechaInicio ?? '');
                    }
                } else {
                    // console.log('NO SE RECARGA LA REVISIÓN');
                }
            } finally {
                setCargando(false);
            }
        }

        if (socket) {
            socket.on('recargarRevision-toCliente', (datos: datosRecargarRevision) => {
                handleSearch(datos);
            });
        }
    }, [socket]);

    return (
        <ProtectedPage requiredGroups={['SHP_Conciliaciones_Admin', 'SHP_Conciliaciones_Operativo'/*, 'Inf_desarrollo'*/]}>

            <LoaderWrapper>
                <div className="flex flex-col w-full min-w-full h-full min-h-full overflow-hidden">
                    {/* Botón de menú */}
                    <div className="p-2">
                        <BackMenuButton />
                    </div>
                    <div className="flex justify-center w-full mb-4">
                        <div className="flex flex-col lg:flex-row items-center justify-center">
                            <FiltroGenerico onSearch={handleSearch} />
                            <BotonesConciliaciones />
                            <NotificacionesMenu />
                            <PopupModal />
                        </div>
                    </div>

                    {
                    // hasSearched && 
                    regConciliados === 'S' && (
                        <div className="flex justify-center w-full flex-grow overflow-auto">
                            <div className="flex flex-col lg:flex-row justify-center w-full flex-grow">
                                <div className="mx-1 flex-grow min-w-0 max-w-[39vw] overflow-auto">
                                    <TablaApuntesConciliadosRevision />
                                </div>
                                <div className="mx-1 flex-grow min-w-0 max-w-[59vw] overflow-auto">
                                    <TablaBancosConciliadosRevision />
                                </div>
                            </div>
                        </div>
                    )}
                    {
                    // hasSearched && 
                    regConciliados === 'N' && (
                        <div className="flex justify-center w-full flex-grow overflow-auto">
                            <div className="flex flex-col lg:flex-row justify-center w-full flex-grow">
                                <div className="mx-1 flex-grow min-w-0 max-w-[39vw] overflow-auto">
                                    <TablaApuntesRevision />
                                </div>
                                <div className="mx-1 flex-grow min-w-0 max-w-[59vw] overflow-auto">
                                    <TablaBancosRevision />
                                </div>
                            </div>
                        </div>
                    )}
                    {
                    // hasSearched && 
                    regConciliados === '*' && (
                        <div className="flex justify-center w-full flex-grow overflow-auto">
                            <div className="flex flex-col lg:flex-row justify-center w-full flex-grow">
                                <div className="mx-1 flex-grow min-w-0 max-w-[39vw] overflow-auto">
                                    <TablaApuntesTodosRevision />
                                </div>
                                <div className="mx-1 flex-grow min-w-0 max-w-[59vw] overflow-auto">
                                    <TablaBancosTodosRevision />
                                </div>
                            </div>
                        </div>
                    )}
                    {
                    // hasSearched && 
                    footer && (
                        <OcultarFiltro>
                            <Footer />
                        </OcultarFiltro>
                    )}
                </div>
            </LoaderWrapper>
        </ProtectedPage>
    );
}
