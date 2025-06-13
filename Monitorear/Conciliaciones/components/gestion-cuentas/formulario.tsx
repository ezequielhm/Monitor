"use client";

import { useForm } from "react-hook-form";
import { gestionCuentas } from "@/lib/definitions/gestion-cuentas-definitions";
import { useStore } from '@/lib/store';
import { insertarGestionCuentas } from '@/lib/actions/action-insertar-cuentas';
import { gestionCuentasStore } from "@/lib/store/store-gestion-cuentas";
import { useEffect, useState } from 'react';
import { fetchValidacionCuentas } from "@/lib/actions/action-validacion-cuentas";

interface GestionCuentasFormProps {
    cerrarModal: () => void;
}

export default function GestionCuentasForm({ cerrarModal }: GestionCuentasFormProps) {
    const { register, handleSubmit, reset, watch, setValue } = useForm<gestionCuentas>();
    const setDatosFormulario = gestionCuentasStore(state => state.setDatosFormulario);
    const [combinacionInvalida, setCombinacionInvalida] = useState(false);

    const empresas = useStore(state => state.permisosUsuario);
    const usuario = useStore(state => state.userData);
    const terceroChecked = watch("tercero");
    const cuenta1Value = watch("cuenta1");
    const cuenta2Value = watch("cuenta2");

    // Pares válidos de cuentas (intercambiables)
    const cuentasValidas: [string, string][] = [
        ["010105", "010205"],
        ["010305", "010405"],
        ["010905", "010905"],
        ["109005", "109005"],
        ["109305", "109305"],
        ["109505", "109505"],
    ];

    // Buscar la contraparte de una cuenta si existe
    const getCounterpart = (code: string): string => {
        for (const [a, b] of cuentasValidas) {
            if (code === a) return b;
            if (code === b) return a;
        }
        return code;
    };

    // Auto-rellenar cuenta2 cuando cambia cuenta1
    useEffect(() => {
        if (cuenta1Value && cuenta1Value.length === 6) {
            const counterpart = getCounterpart(cuenta1Value);
            if (counterpart !== cuenta2Value) {
                setValue("cuenta2", counterpart);
            }
        }
    }, [cuenta1Value]);

    // Auto-rellenar cuenta1 cuando cambia cuenta2
    useEffect(() => {
        if (cuenta2Value && cuenta2Value.length === 6) {
            const counterpart = getCounterpart(cuenta2Value);
            if (counterpart !== cuenta1Value) {
                setValue("cuenta1", counterpart);
            }
        }
    }, [cuenta2Value]);

    // Validación para solo números en cuentas
    const handleNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
            e.preventDefault();
        }
    };

    // Actualizar campos de terceros si está activado
    useEffect(() => {
        if (terceroChecked) {
            setValue("tercero1", cuenta2Value);
            setValue("tercero2", cuenta1Value);
        }
    }, [cuenta1Value, cuenta2Value, terceroChecked]);

    const handleGuardar = async (data: gestionCuentas) => {
        const dataConUsuario = {
            ...data,
            usuario: usuario.user.usuario
        };

        setDatosFormulario(dataConUsuario);

        // Validación local de combinación válida
        const esCombinacionValida = cuentasValidas.some(
            ([a, b]) =>
                (data.cuenta1 === a && data.cuenta2 === b) ||
                (data.cuenta1 === b && data.cuenta2 === a)
        );

        if (!esCombinacionValida) {
            setCombinacionInvalida(true);
            return;
        }

        try {
            const result = await fetchValidacionCuentas(
                data.empresa1,
                data.cuenta1,
                data.empresa2,
                data.cuenta2
            );

            if (!result) {
                alert("Error al validar la Cuenta. Intenta nuevamente.");
                return;
            }

            const { texto1, texto2 } = result;

            if (texto1.includes("NO existe") || texto2.includes("NO existe")) {
                setCombinacionInvalida(true);
                return;
            }

            setCombinacionInvalida(false);

            await insertarGestionCuentas(dataConUsuario);
            reset();
            cerrarModal();
        } catch (error) {
            console.error("Error al insertar la cuenta:", error);
        }
    };

    return (
        <form className="max-w-4xl mx-auto mt-5 space-y-3 text-xs" onSubmit={handleSubmit(handleGuardar)}>
            <div className="flex justify-center gap-2 items-end">
                <div className="flex flex-col">
                    <label>Empresa 1</label>
                    <select {...register("empresa1")} className="border p-1 text-xs w-40">
                        <option value="">Selecciona Empresa 1</option>
                        {empresas.map((empresa, index) => (
                            <option key={index} value={empresa.COD_EMP_CONTABLE}>
                                {empresa.NOMBRE_EMP_CONTABLE}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label>Cuenta 1</label>
                    <input
                        type="text"
                        placeholder="Cuenta 1"
                        {...register("cuenta1")}
                        className="border p-1 text-xs w-32"
                        onKeyPress={handleNumericInput}
                    />
                </div>

                <div className="flex flex-col">
                    <label>Empresa 2</label>
                    <select {...register("empresa2")} className="border p-1 text-xs w-40">
                        <option value="">Empresa 2</option>
                        {empresas.map((empresa, index) => (
                            <option key={index} value={empresa.COD_EMP_CONTABLE}>
                                {empresa.NOMBRE_EMP_CONTABLE}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label>Cuenta 2</label>
                    <input
                        type="text"
                        placeholder="Cuenta 2"
                        {...register("cuenta2")}
                        className="border p-1 text-xs w-32"
                        onKeyPress={handleNumericInput}
                    />
                </div>
            </div>

            <div className="flex items-center justify-center gap-6">
                <label className="flex items-center gap-2">
                    <input type="checkbox" {...register("activo")} /> Activo
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" {...register("tercero")} /> Tercero
                </label>
            </div>

            {terceroChecked && (
                <div className="flex justify-center gap-2 items-end">
                    <div className="flex flex-col">
                        <label>Tercero 1</label>
                        <input
                            type="text"
                            {...register("tercero1")}
                            value={cuenta2Value || ""}
                            className="border p-1 text-xs w-40 bg-gray-100"
                            readOnly
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Tercero 2</label>
                        <input
                            type="text"
                            {...register("tercero2")}
                            value={cuenta1Value || ""}
                            className="border p-1 text-xs w-40 bg-gray-100"
                            readOnly
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-center">
                <div className="flex flex-col">
                    <label>Fecha Inicio</label>
                    <input type="date" {...register("fechaInicio")} className="border p-1 w-28 text-xs" />
                </div>
            </div>

            <div className="flex justify-center">
                <button type="submit" className="bg-[#DD1C1A] hover:bg-[#c11816] px-5 py-3 text-white rounded-md">
                    Guardar
                </button>
            </div>

            {combinacionInvalida && (
                <div className="text-red-600 text-center text-sm font-semibold">
                    LA CUENTA NO EXISTE PARA ESA EMPRESA O NO ES UNA COMBINACIÓN VÁLIDA.
                </div>
            )}
        </form>
    );
}
