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
import TablaApuntesIzquierda from "@/components/gestion-cuentas/tabla-apuntes-izquierda";
import TablaApuntesDerecha from "@/components/gestion-cuentas/tabla-apuntes-derecha";
import BotonConciliar from '@/components/conciliaciones-cuentas/boton-conciliar';

const LoaderWrapper = dynamic(() => import('@/components/ui/loader/loaderWrapper'), { ssr: false });

export default function ConciliarCuentas() {
  const [showTables, setShowTables] = useState(false);
  const setVentanaActual = useStore((state) => state.setVentanaActual);

  useEffect(() => {
    setVentanaActual('conciliacionCuentasCero');
  }, []);

  return (
    <ProtectedPage requiredGroups={['SHP_Conciliaciones_Admin', 'SHP_Conciliaciones_Operativo']}>
      <LoaderWrapper>
        <main className="flex flex-col w-full min-w-full h-full min-h-full overflow-hidden">
          <div>
            <div className="p-2">
              <BackMenuButton />
            </div>
            <div className="flex justify-center w-full mb-2">
              <div className="flex flex-col lg:flex-row items-center justify-center">
                {/* Se pasa el callback onSearch para actualizar el estado y mostrar las tablas */}
                <FiltroGenerico onSearch={() => setShowTables(true)} />
                <BotonesConciliaciones/>
                <NotificacionesMenu />
                <PopupModal />
              </div>
            </div>
            {/* Se renderizan las tablas solo si showTables es true */}
            {showTables && (
              <div>
              <div className="flex flex-col flex-grow h-[calc(90vh-220px)]"> {/* Altura dinámica */}
                <div className="flex flex-col lg:flex-row flex-grow min-h-0 gap-2"> {/* Contenedor flexible */}
                  <div className="flex-1 min-w-0 overflow-auto bg-gray-50 rounded-lg shadow-inner">
                    <TablaApuntesIzquierda />
                  </div>
                  <div className="flex-1 min-w-0 overflow-auto bg-gray-50 rounded-lg shadow-inner">
                    <TablaApuntesDerecha />
                  </div>
                </div>
              </div>
            <div className="w-full flex">
              <div className="flex justify-center py-5 w-full bg-gray-100">
                <BotonConciliar />
              </div>
            </div>
            </div>
            )}
          </div>
        </main>
      </LoaderWrapper>
    </ProtectedPage>
  );
}
