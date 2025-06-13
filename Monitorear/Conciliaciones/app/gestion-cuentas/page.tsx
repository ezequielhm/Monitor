"use client";

import { useEffect, useState } from "react";
import GestionCuentasForm from "@/components/gestion-cuentas/formulario";
import BackMenuButton from "@/components/ui/menu/back-button";
import { gestionCuentasStore } from "@/lib/store/store-gestion-cuentas";
import TablaGestionCuentas from "@/components/gestion-cuentas/tabla-gestion-cuentas";

export default function GestionCuentasPage() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const setListaCuentas = gestionCuentasStore(state => state.setListaCuentas);
  const listaCuentas = gestionCuentasStore(state => state.listaCuentas)

  useEffect(() => {
    setListaCuentas();
  }, [])

  console.log("Este es el listado de cuentas: ", listaCuentas)

  return (
    <div>
      <button
        onClick={() => setMostrarModal(true)}
        className="fixed bottom-10 right-10 bg-[#DD1C1A] text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg hover:bg-[#BC1816] transition"
      >
        +
      </button>

      <div className="p-2">
        <BackMenuButton />
      </div>
      <div>
        <div className="ml-8">
          <TablaGestionCuentas />
        </div>
      </div>
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl overflow-hidden">
            {/* Encabezado en rojo ocupando todo el ancho del modal */}
            <div className="bg-[#DD1C1A] px-4 py-2 flex items-center justify-between">
              <h2 className="text-white font-medium">Combinacion Cuentas</h2>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-white text-lg"
              >
                ✕
              </button>
            </div>

            {/* Contenido con padding */}
            <div className="p-4">
              <GestionCuentasForm cerrarModal={() => setMostrarModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
