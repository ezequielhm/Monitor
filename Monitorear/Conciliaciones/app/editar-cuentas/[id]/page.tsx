'use client';

import { useEffect, useState, use } from "react";
import TablaEditarIzquierda from "@/components/editar-cuentas-cero/tabla-editar-izquierda";
import TablaEditarDerecha from "@/components/editar-cuentas-cero/tabla-editar-derecha";
import LoaderWrapper from "@/components/ui/loader/loaderWrapper";
import { gestionCuentasStore } from "@/lib/store/store-gestion-cuentas";
import BotonEliminarCuentaCero from "@/components/editar-cuentas-cero/boton-eliminar-cuenta-cero";
import BotonDesconciliarCuentaCero from "@/components/editar-cuentas-cero/boton-desconciliar-cuentas";

export default function Page(props: { params: Promise<{ id: number }> }) {
  const params = use(props.params);
  const setListadoApuntesCuentasCero = gestionCuentasStore((state) => state.setListadoApuntesCuentasCero);
  const apuntesCuentasCeroIzquierda = gestionCuentasStore((state) => state.apuntesCuentasCeroIzquierda);
  const apuntesCuentasCeroDerecha = gestionCuentasStore((state) => state.apuntesCuentasCeroDerecha);

  const [filterCuentaCero, setFilterCuentaCero] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const filtro = JSON.parse(localStorage.getItem("filterCuentaCero") ?? "{}");
      setFilterCuentaCero(filtro);

      if (!params?.id || !filtro?.empresa1 || !filtro?.cuenta1) {
        console.warn("Faltan datos para cargar conciliación", { params, filtro });
        return;
      }

      setListadoApuntesCuentasCero(params.id, filtro.empresa1, filtro.empresa2, filtro.cuenta1, filtro.cuenta2);
    } catch (err) {
      console.error("Error cargando datos iniciales:", err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  if (loading || !filterCuentaCero) {
    return <LoaderWrapper>Cargando datos...</LoaderWrapper>;
  }

  return (
    <LoaderWrapper>
      <main className="flex flex-col w-full min-w-full h-full min-h-full overflow-hidden">
        <div className="flex justify-center w-full">
          <p className="p-2 bg-white rounder-full m-1">
            {'Empresa: ' + (filterCuentaCero.empresa1 ?? '') + ' Cuenta: ' + (filterCuentaCero.cuenta1 ?? '') + ' Cuenta terceros: ' + (filterCuentaCero.empresa2 ?? '')}
          </p>
        </div>

        <div className="flex justify-center w-full flex-grow overflow-auto">
          <div className="flex flex-col lg:flex-row justify-center w-full flex-grow">
            <div className="mx-1 flex-grow min-w-0 max-w-[49vw] overflow-auto">
              <TablaEditarIzquierda apuntesCuentasCeroIzquierda={apuntesCuentasCeroIzquierda} />
            </div>
            <div className="mx-1 flex-grow min-w-0 max-w-[51vw] overflow-auto">
              <TablaEditarDerecha apuntesCuentasCeroDerecha={apuntesCuentasCeroDerecha} />
            </div>
          </div>
        </div>

        <div className="w-full flex">
          <div className="flex justify-center py-7 w-full bg-gray-100">
            <BotonEliminarCuentaCero idConciliacion={params.id} />
          </div>
          <div className="flex justify-center py-7 w-full bg-gray-100">
            <BotonDesconciliarCuentaCero idConciliacion={params.id} />
          </div>
        </div>
      </main>
    </LoaderWrapper>
  );
}
