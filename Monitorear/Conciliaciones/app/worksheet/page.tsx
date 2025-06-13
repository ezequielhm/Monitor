'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import BotonesConciliaciones from "@/components/conciliaciones/botones-navegar-worksheet";
import { FiltroGenerico } from "@/components/ui/filters/filtro-general";
import BackMenuButton from "@/components/ui/menu/back-button";
import TablaApuntesWorksheet from "@/components/worksheet/tabla-apuntes-worksheet";
import TablaBancosWorksheet from "@/components/worksheet/tabla-bancos-worksheet";
import Footer from "@/components/worksheet/footer-saldos";
import OcultarFiltro from "@/components/ui/ocultar-filtros";
import { useStore } from '@/lib/store';
import { useEffect } from 'react';
import NotificacionesMenu from '@/components/ui/notificaciones-menu';
import PopupModal from '@/components/ui/resolver-incidencia-modal';

const LoaderWrapper = dynamic(() => import('@/components/ui/loader/loaderWrapper'), { ssr: false });

export default function Worksheet() {
    const regConciliados = useStore((state) => state.regConciliado)
    const setVentanaActual = useStore((state) => state.setVentanaActual)
    const apuntesContables = useStore(state => state.apuntesContables)
    const movimientosBancarios = useStore(state => state.movimientosBancarios)

    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        setHasSearched(true);
    };

    useEffect(() => {
        const savedVentana = 'conciliacionWorksheet';
        // Aquí puedes hacer algo con `savedVentana`, como actualizar el estado de tu store
        setVentanaActual(savedVentana);  // Asumiendo que tienes una función `setVentanaActual` en tu store
    }, []);

    useEffect(() => {
        if (apuntesContables || movimientosBancarios) {
            setHasSearched(true);
        }
    }, [])

    return (
        <LoaderWrapper>
            <div className="flex flex-col w-full min-w-full h-full min-h-full overflow-hidden">
                {/* Botón de menú */}
                <div className="p-2">
                    <BackMenuButton />
                </div>
                {/* Contenedor de filtros y botones */}
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
                    <div className="flex justify-center w-full flex-grow overflow-auto">
                        <div className="flex flex-col lg:flex-row justify-center w-full flex-grow">
                            <div className="mx-1 flex-grow min-w-0 max-w-[39vw] overflow-auto">
                                <TablaApuntesWorksheet />
                            </div>
                            <div className="mx-1 flex-grow min-w-0 max-w-[59vw] overflow-auto">
                                <TablaBancosWorksheet />
                            </div>
                        </div>
                    </div>
                }

                {
                    hasSearched &&
                    (
                        <OcultarFiltro>
                            <Footer />
                        </OcultarFiltro>
                    )}
            </div>
        </LoaderWrapper>
    );
}
