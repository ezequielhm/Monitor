"use client";

import { MenuNavegacion } from "base-node/menu-navegacion";
import MenuLink from "./menu-link";
import BackMenuButton from "./back-button";

export default function MenuInformes() {
    const tabs = [
        { id: "bancos", label: "Bancos" },
        { id: "cuentasCero", label: "Cuentas Cero" }
    ];

    const botonEstiloFijo =
        "bg-red-600 hover:bg-red-500 text-white w-[300px] h-[60px]  rounded shadow flex items-center justify-center";

    const renderContenido = (activeTab: string) => (
        <div className="w-screen flex px-4 mt-10 min-h-[360px]">
            <div className="w-full max-w-[700px] flex flex-col items-center">
                <div className="h-[60px] flex items-center justify-center w-full">
                    <h2 className="text-3xl font-medium text-gray-700 text-center">
                        {activeTab === "bancos" ? "Bancos" : "Cuentas Cero"}
                    </h2>
                </div>

                {activeTab === "bancos" && (
                    <div className="w-full flex justify-center mt-6"> {/* Ajuste para centrar */}
                        <div className="grid grid-cols-2 gap-6">
                            <MenuLink
                                href="/informes/informes-historico"
                                text="Informes Histórico"
                                icon=""
                                colorClass={botonEstiloFijo}
                                enabled={true}
                            />
                            <MenuLink
                                href="/informes/informes-no-conciliados"
                                text="Informes No Conciliados"
                                icon=""
                                colorClass={botonEstiloFijo}
                                enabled={false}
                            />
                            <MenuLink
                                href="/informes/informes-saldos"
                                text="Informes Saldos"
                                icon=""
                                colorClass={botonEstiloFijo}
                                enabled={false}
                            />
                        </div>
                    </div>
                )}

                {/* Cuentas Cero */}
                {activeTab === "cuentasCero" && (
                    <div className="w-full flex justify-center mt-6"> {/* Ajuste para centrar */}
                        <div className="grid grid-cols-1 gap-6">
                            <MenuLink
                                href="/informes/informes-cuentas-cero"
                                text="Informes Cuentas"
                                icon=""
                                colorClass={botonEstiloFijo}
                                enabled={false}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center bg-white min-h-screen overflow-auto">
            {/* Botón de retroceso */}
            <div className="absolute top-2 left-2">
                <BackMenuButton />
            </div>

            {/* Título */}
            <div className="mt-6">
                <h1 className="text-5xl font-light text-red-600">📄 INFORMES</h1>
            </div>

            {/* Menú reutilizable de tu librería */}
            <div className="mt-10 w-[45%]">
                <MenuNavegacion
                    tabs={tabs}
                    initialTab="bancos"
                    renderTab={renderContenido}
                />
            </div>
        </div>
    );
}
