'use client';
import { useEffect, useState, useCallback } from 'react';
import { ApunteContable, MovimientoBancario, apuntesConciliadosType, movimientosConciliadosType, saldosApuntes, saldosMovimientos } from './definitions';
import { saldoStore } from './store/store-saldos';
import { useStore } from './store';
// Definición de la interfaz para los resultados
interface CalculationResult {
    saldoApuntes: number;
    saldoBancarios: number;
    totalImporteApuntes: number;
    totalImporteBancarios: number;
    totalImporteMovimientosConciliados: number;
    totalImporteApuntesConciliados: number;
}

// Función para ajustar el importe de apuntes contables (D es positivo, H es negativo)
const getAdjustedImporteApunte = (importe: string | number, clave: string): number => {
    const parsedImporte = isNaN(parseFloat(importe as string)) ? 0 : parseFloat(importe as string);
    return clave === 'H' ? -parsedImporte : parsedImporte; // D positivo, H negativo
};

// Función para ajustar el importe de movimientos bancarios (D es negativo, H es positivo)
const getAdjustedImporteMovimiento = (importe: string | number, clave: string): number => {
    const parsedImporte = isNaN(parseFloat(importe as string)) ? 0 : parseFloat(importe as string);
    return clave === 'D' ? -parsedImporte : parsedImporte; // D negativo, H positivo
};

export const useCalculations = (
    apuntesContables: ApunteContable[],
    movimientosConciliados: movimientosConciliadosType[],
    apuntesConciliados: apuntesConciliadosType[],
    movimientosBancarios: MovimientoBancario[],
    // saldos: saldos,
    saldos: saldosApuntes = {   
        Saldo_Inicial: 0 , 
        IMPORTE_MOVIMIENTOS_SIN_CONCILIAR:0, 
        EMPRESA:0,
    } // Valor por defecto para saldos
): CalculationResult => {
    const [saldoApuntes, setSaldoApuntes] = useState(0);
    const [saldoBancarios, setSaldoBancarios] = useState(0);
    const [totalImporteApuntes, setTotalImporteApuntes] = useState(0);
    const [totalImporteBancarios, setTotalImporteBancarios] = useState(0);
    const [totalImporteMovimientosConciliados, setTotalImporteMovimientosConciliados] = useState(0);
    const [totalImporteApuntesConciliados, setTotalImporteApuntesConciliados] = useState(0);
   
    const setSaldoFinalApunte = saldoStore(state => state.setSaldoApunte);
    const setSaldoSumaApunte = saldoStore(state => state.setSaldoApunte);
    const setSaldoNoCasadoApunte = saldoStore(state => state.setSaldoApunte);
    const setSaldoFinalMovimiento = saldoStore(state => state.setSaldoApunte); 
    const setSaldoNoCasadoMovimiento = saldoStore(state => state.setSaldoApunte);
    const setSaldoSumaMovimiento = saldoStore(state => state.setSaldoApunte);
    


    useEffect(() => {
        // Inicializamos con el saldo que viene en el objeto saldos
        setTotalImporteApuntes(saldos.Saldo_Inicial);
        setTotalImporteBancarios(saldos.Saldo_Inicial);

        // Cálculo de los apuntes contables usando la lógica D positivo, H negativo
        const totalApuntesContables = apuntesContables.reduce((sum, apunte) => {
            return sum + getAdjustedImporteApunte(apunte.IMPORTE, apunte.CLAVE_IMPORTE);
        }, 0);

        // Cálculo de los movimientos bancarios usando la lógica D negativo, H positivo
        const totalMovimientosBancarios = movimientosBancarios.reduce((sum, movimiento) => {
            return sum + getAdjustedImporteMovimiento(movimiento.IMPORTE, movimiento.claveDebeHaber);
        }, 0);

        // Establecemos los valores conciliados (invertimos las lógicas)
        setTotalImporteApuntesConciliados(totalApuntesContables);
        setTotalImporteMovimientosConciliados(totalMovimientosBancarios);

        // Ajustamos los saldos finales
        const saldoApunteSuma = saldos.Saldo_Inicial + totalMovimientosBancarios; // Conciliando con movimientos
        const saldomovimientoSuma = saldos.Saldo_Inicial + totalApuntesContables; // Conciliando con apuntes

        // Actualizamos los saldos
        setSaldoApuntes(saldoApunteSuma);
        setSaldoBancarios(saldomovimientoSuma);

    }, [apuntesContables, movimientosConciliados, apuntesConciliados, movimientosBancarios, saldos]);

    useEffect(() => {

    }, [totalImporteApuntes, totalImporteBancarios, totalImporteApuntesConciliados, totalImporteMovimientosConciliados, saldoApuntes, saldoBancarios]);

    return {
        saldoApuntes,
        saldoBancarios,
        totalImporteApuntes,
        totalImporteBancarios,
        totalImporteMovimientosConciliados,
        totalImporteApuntesConciliados,
    };
};
