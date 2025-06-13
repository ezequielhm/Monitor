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
import BotonConciliar from '@/components/conciliaciones-cuentas/boton-conciliar';
import TablaApuntesRevision from '@/components/revision/tabla-apuntes-revision';
import TablaBancosRevision from '@/components/revision/tabla-bancos-revision';
import { gestionCuentasStore } from '@/lib/store/store-gestion-cuentas';
import TablaDerechaRevision from '@/components/revision-cuentas/tabla-derecha-revision';
import TablaIzquierdaRevision from '@/components/revision-cuentas/tabla-izquierda-revision';
import TablaDerechaRevisionTodos from '@/components/revision-cuentas/tabla-derecha-revision-todos';
import TablaIzquierdaRevisionTodos from '@/components/revision-cuentas/tabla-izquierda-revision-todos';
import TablaDerechaRevisionConciliados from '@/components/revision-cuentas/tabla-derecha-revision-conciliado';
import TablaIzquierdaRevisionConciliados from '@/components/revision-cuentas/tabla-izquierda-revision-conciliado';
import { FiltrosGestionCuentas } from '@/lib/definitions/gestion-cuentas-definitions';

const LoaderWrapper = dynamic(() => import('@/components/ui/loader/loaderWrapper'), { ssr: false });

export default function RevisionCuentas() {
  const filtro = gestionCuentasStore((state) => state.filtrosGestionCuentas);
  const [showTables, setShowTables] = useState(false);
  const setVentanaActual = useStore((state) => state.setVentanaActual);
  const socket = useStore(state => state.socket);

  const setListadoApuntes = gestionCuentasStore((state) => state.setListadoApuntes);

  useEffect(() => {
    setVentanaActual('RevisarCuentasCero');
  }, []);
  
  console.log('Filtro:', filtro);

  useEffect(() => {
    if(socket) {

      const handleSearch = async (datos: any) => {
        try{

          if(filtro?.empresa1 === datos.empresa1 && filtro?.cuenta1 === datos.cuenta1 
            && filtro?.empresa2 === datos.empresa2 && filtro?.cuenta2 === datos.cuenta2){
            
              console.log('SÍ SE RECARGA LA REVISIÓN');

            if(filtro?.regConciliados === 'N'){
              await setListadoApuntes(filtro.empresa1, filtro.empresa2, filtro.cuenta1, filtro.cuenta2,filtro.fechaInicio,filtro.fechaFin, filtro.regConciliados);
            }
            if(filtro?.regConciliados === 'S'){
              await setListadoApuntes(filtro.empresa1, filtro.empresa2, filtro.cuenta1, filtro.cuenta2,filtro.fechaInicio,filtro.fechaFin, filtro.regConciliados);
            }
            if(filtro?.regConciliados === '*'){
              await setListadoApuntes(filtro.empresa1, filtro.empresa2, filtro.cuenta1, filtro.cuenta2,filtro.fechaInicio,filtro.fechaFin, filtro.regConciliados);
            }
          }

        }catch (error) {
          console.error('No se recarga la revision de cuentas cero:', error);
        }
      }


      socket.on('recargaRevisionCuentasCero-toCliente', (datos: any) => {
        handleSearch(datos);
    });
    }
  }, [socket]);

  console.log('Registros Conciliados:', filtro?.regConciliados);

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
                <BotonesConciliaciones />
                <NotificacionesMenu />
                <PopupModal />
              </div>
            </div>
            {showTables && (
              <div>
              {
                filtro?.regConciliados === 'N' && (
                  <div className="flex flex-col flex-grow h-[calc(90vh-220px)]"> {/* Altura dinámica */}
                    <div className="flex flex-col lg:flex-row flex-grow min-h-0 gap-2"> {/* Contenedor flexible */}
                      <div className="flex-1 min-w-0 overflow-auto bg-gray-50 rounded-lg shadow-inner">
                        <TablaIzquierdaRevision />
                      </div>
                      <div className="flex-1 min-w-0 overflow-auto bg-gray-50 rounded-lg shadow-inner">
                        <TablaDerechaRevision />
                      </div>
                    </div>
                  </div>
                )}
              {
                filtro?.regConciliados === 'S' && (
                  <div className="flex flex-col flex-grow h-[calc(90vh-220px)]"> {/* Altura dinámica */}
                    <div className="flex flex-col lg:flex-row flex-grow min-h-0 gap-2"> {/* Contenedor flexible */}
                      <div className="flex-1 min-w-0 overflow-auto bg-gray-50 rounded-lg shadow-inner">
                        <TablaIzquierdaRevisionConciliados />
                      </div>
                      <div className="flex-1 min-w-0 overflow-auto bg-gray-50 rounded-lg shadow-inner">
                        <TablaDerechaRevisionConciliados />
                      </div>
                    </div>
                  </div>
                )}
              {
                filtro?.regConciliados === '*' && (
                  <div className="flex flex-col flex-grow h-[calc(90vh-220px)]"> {/* Altura dinámica */}
                    <div className="flex flex-col lg:flex-row flex-grow min-h-0 gap-2"> {/* Contenedor flexible */}
                      <div className="flex-1 min-w-0 overflow-auto bg-gray-50 rounded-lg shadow-inner">
                        <TablaIzquierdaRevisionTodos />
                      </div>
                      <div className="flex-1 min-w-0 overflow-auto bg-gray-50 rounded-lg shadow-inner">
                        <TablaDerechaRevisionTodos />
                      </div>
                    </div>
                  </div>
                )}
                </div>
            )}
          </div>
        </main>
      </LoaderWrapper>
    </ProtectedPage>
  );
}
