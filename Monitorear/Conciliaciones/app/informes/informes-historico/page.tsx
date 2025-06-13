'use client';
import BotonesConciliaciones from '@/components/conciliaciones/botones-navegar-worksheet';
import { FiltroGenerico } from '@/components/ui/filters/filtro-general';
import BackMenuButton from '@/components/ui/menu/back-button';
import dynamic from 'next/dynamic';
import BotonConciliar from '@/components/conciliaciones/boton-conciliar';
import BotonImprimir from '@/components/conciliaciones/boton-Imprimir-conciliaciones';
import { useState } from 'react';
const LoaderWrapper = dynamic(() => import('@/components/ui/loader/loaderWrapper'), { ssr: false });
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import NotificacionesMenu from '@/components/ui/notificaciones-menu';
import Footer from '@/components/worksheet/footer-saldos';
import OcultarFiltro from '@/components/ui/ocultar-filtros';
import ProtectedPage from '@/components/ui/proteger-pantalla';
import PopupModal from '@/components/ui/resolver-incidencia-modal';
import TablaApuntesConciliacionHistorica from '@/components/informes/tabla-apuntes-conciliacion-historica';
import TablaBancosConciliacionHistorica from '@/components/informes/tabla-bancos-conciliacion-historica';

export default function Informes() {
    // Puedes hacer cualquier llamada a API o carga de datos aquí si es necesario

    const [hasSearched, setHasSearched] = useState(false);
    const [footer, setFooter] = useState(false);

    const setVentanaActual = useStore((state) => state.setVentanaActual)

    const handleSearch = () => {
      setHasSearched(true);
    };

    useEffect(() => {
      const savedVentana = 'conciliacionHistorica';
      // Aquí puedes hacer algo con `savedVentana`, como actualizar el estado de tu store
      setVentanaActual(savedVentana);  // Asumiendo que tienes una función `setVentanaActual` en tu store
    }, []);

    return (
      <LoaderWrapper>
        <main className="flex flex-col w-full min-w-full h-full min-h-full overflow-hidden">
          {/* Botón de menú */}
          <div className="p-2">
            <BackMenuButton />
          </div>
          {/* Contenedor de filtros y botones */}
          <div className="flex justify-center w-full mb-4">
            <div className="flex flex-col lg:flex-row items-center justify-center">
              <FiltroGenerico onSearch={handleSearch} />
              <NotificacionesMenu />
              <PopupModal />
            </div>
          </div>

          <div className="flex justify-center w-full flex-grow overflow-auto">
            <div className="flex flex-col lg:flex-row justify-center w-full flex-grow">
              <div className="mx-1 flex-grow min-w-0 max-w-[39vw] overflow-auto">
                <TablaApuntesConciliacionHistorica />
              </div>
              <div className="mx-1 flex-grow min-w-0 max-w-[59vw] overflow-auto">
              <TablaBancosConciliacionHistorica />
              </div>
            </div>
          </div>
            <OcultarFiltro>
              <Footer />
            </OcultarFiltro>

        </main>
      </LoaderWrapper >
    );
  }
  