'use client';
import BotonesConciliaciones from '@/components/conciliaciones/botones-navegar-worksheet';
import { FiltroGenerico } from '@/components/ui/filters/filtro-general';
import TablaBancosConciliar from '@/components/conciliaciones/tabla-bancos-conciliar';
import TablaApuntesConciliar from '@/components/conciliaciones/tabla-apuntes-conciliar';
import BackMenuButton from '@/components/ui/menu/back-button';
import dynamic from 'next/dynamic';
import BotonConciliar from '@/components/conciliaciones/boton-conciliar';
import BotonImprimir from '@/components/conciliaciones/boton-Imprimir-conciliaciones';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import NotificacionesMenu from '@/components/ui/notificaciones-menu';
import Footer from '@/components/worksheet/footer-saldos';
import OcultarFiltro from '@/components/ui/ocultar-filtros';
import ProtectedPage from '@/components/ui/proteger-pantalla';
import PopupModal from '@/components/ui/resolver-incidencia-modal';

const LoaderWrapper = dynamic(() => import('@/components/ui/loader/loaderWrapper'), { ssr: false });

export default function Conciliaciones() {
  const [footer, setFooter] = useState(false); // Se mantiene para manejar la visibilidad del footer
  const setVentanaActual = useStore((state) => state.setVentanaActual);

  useEffect(() => {
    setVentanaActual('conciliacionCruzada');
  }, []);

  return (
    <ProtectedPage requiredGroups={['SHP_Conciliaciones_Admin', 'SHP_Conciliaciones_Operativo']}>
      <LoaderWrapper>
        <main className="flex flex-col w-full min-w-full h-full min-h-full overflow-hidden">
          {/* Botón de menú */}
          <div className="p-2">
            <BackMenuButton />
          </div>

          {/* Contenedor de filtros y botones */}
          <div className="flex justify-center w-full mb-4">
            <div className="flex flex-col lg:flex-row items-center justify-center">
              <FiltroGenerico />
              <BotonesConciliaciones />
              <NotificacionesMenu />
              <PopupModal />
            </div>
          </div>

          {/* Contenedor de las tablas - SIEMPRE SE MUESTRA */}
          <div className="flex justify-center w-full flex-grow overflow-auto">
            <div className="flex flex-col lg:flex-row justify-center w-full flex-grow">
              <div className="mx-1 flex-grow min-w-0 max-w-[39vw] overflow-auto">
                <TablaApuntesConciliar />
              </div>
              <div className="mx-1 flex-grow min-w-0 max-w-[59vw] overflow-auto">
                <TablaBancosConciliar />
              </div>
            </div>
          </div>

          {/* Botones de acción - SIEMPRE SE MUESTRAN */}
          <div className="w-full flex">
            <div className="flex justify-center py-7 w-full bg-gray-100">
              <BotonConciliar />
            </div>
          </div>

          {/* Footer - SOLO SE MUESTRA SI footer ES TRUE */}
          {footer && (
            <OcultarFiltro>
              <Footer />
            </OcultarFiltro>
          )}
        </main>
      </LoaderWrapper>
    </ProtectedPage>
  );
}
