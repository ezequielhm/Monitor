'use client'
import { useState, useEffect } from 'react';
import BotonesConciliaciones from "@/components/conciliaciones-cuentas/botones-navegacion-cuentasCero";
import { FiltroGenerico } from "@/components/ui/filters/filtro-general";
import BackMenuButton from "@/components/ui/menu/back-button";
import { useStore } from "@/lib/store";
import dynamic from 'next/dynamic';
import NotificacionesMenu from "@/components/ui/notificaciones-menu";
import PopupModal from '@/components/ui/resolver-incidencia-modal';
import ProtectedPage from "@/components/ui/proteger-pantalla";
import TablaDerechaWorksheet from '@/components/worksheet-cuentas/tabla-derecha-worksheet';
import TablaIzquierdaWorksheet from '@/components/worksheet-cuentas/tabla-izquierda-worksheet';
import OcultarFiltro from '@/components/ui/ocultar-filtros';
import Footer from '@/components/worksheet/footer-saldos';

const LoaderWrapper = dynamic(() => import('@/components/ui/loader/loaderWrapper'), { ssr: false });

export default function WorksheetCuentas() {
    const [showTables, setShowTables] = useState(false);
    const setVentanaActual = useStore((state) => state.setVentanaActual);

    useEffect(() => {
        setVentanaActual('WorksheetCuentasCero');
    }, []);

    return (
        <ProtectedPage requiredGroups={['SHP_Conciliaciones_Admin', 'SHP_Conciliaciones_Operativo']}>
            <LoaderWrapper>
                <main className="flex flex-col w-full h-screen overflow-hidden">
                    {/* Botón de regreso */}
                    <div className="p-2">
                        <BackMenuButton />
                    </div>

                    {/* Filtro y botones */}
                    <div className="flex justify-center w-full mb-2">
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
                            <FiltroGenerico onSearch={() => setShowTables(true)} />
                            <BotonesConciliaciones />
                            <NotificacionesMenu />
                            <PopupModal />
                        </div>
                    </div>

                    {/* Tablas y footer */}
                    {showTables && (
                        <div className="flex flex-col flex-grow min-h-0">
                            {/* Contenedor de tablas */}
                            <div className="flex flex-col lg:flex-row flex-grow min-h-0 gap-2 px-2 overflow-hidden">
                                <div className="flex-1 min-w-0 overflow-auto bg-gray-50 rounded-lg shadow-inner">
                                    <TablaIzquierdaWorksheet />
                                </div>
                                <div className="flex-1 min-w-0 overflow-auto bg-gray-50 rounded-lg shadow-inner">
                                    <TablaDerechaWorksheet />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex-shrink-0 shadow-md">
                                <OcultarFiltro>
                                    <Footer />
                                </OcultarFiltro>
                            </div>
                        </div>
                    )}
                </main>
            </LoaderWrapper>
        </ProtectedPage>
    );
}