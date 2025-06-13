import { create } from 'zustand';
import { saldosApuntes, saldosMovimientos } from '@/lib/definitions';
import { saldoApunte } from '../actions/saldo-apuntes';
import { saldoMovimiento } from '../actions/saldo-movimientos';
import { saldo } from '../definitions/gestion-cuentas-definitions';
import { fetchSaldosCuentasCero } from '../actions/action-saldos-cuentas-cero';

interface saldoState {
    saldoApunte: saldosApuntes;
    saldoMovimiento: saldosMovimientos;
    setSaldoApunte: (empContable:string, SUBCTA_CONTABLE:string, numeroCuenta:string, COD_PROD_BANCARIO:number, fechaInicio:string, fechaCorte: string, ventanaActual:string) => void;
    setSaldoMovimiento: (empContable:string, SUBCTA_CONTABLE:string, numeroCuenta:string, COD_PROD_BANCARIO:number, fechaInicio:string, fechaCorte: string, ventanaActual:string) => void;
    clearSaldos: () => void;

    saldoIzquierda: saldo;
    saldoDerecho: saldo;
    setSaldoCuentasCero: (empresa1: string, empresa2: string, cuenta1: string, cuenta2: string) => void;
}

export const saldoStore = create<saldoState>((set, get) => ({
    saldoApunte: {
        Saldo_Inicial: 0,
        IMPORTE_MOVIMIENTOS_SIN_CONCILIAR: 0,
        EMPRESA: 0,
    },
    saldoMovimiento: {
        SALDO:0,
        importe:0,
        saldoFinal: 0,
        IMPORTE_APUNTE_SIN_CONCILIAR: 0,
        fechaFinal: '',
    },
    saldoIzquierda: {
        empresa: '',
        cuentam: '',
        cuentap: '',
        saldo_inicial: 0,
        saldo_no_conciliado: 0,
        saldo_final: 0,
    },
    saldoDerecho: {
        empresa: '',
        cuentam: '',
        cuentap: '',
        saldo_inicial: 0,
        saldo_no_conciliado: 0,
        saldo_final: 0,
    },
    setSaldoCuentasCero: async (empresa1: string, empresa2: string, cuenta1: string, cuenta2: string) => {
        const result = await fetchSaldosCuentasCero(empresa1, empresa2, cuenta1, cuenta2);
        set({
            saldoIzquierda: result.saldoIzquierda,
            saldoDerecho: result.saldoDerecha,
        });
    },
    setSaldoApunte: async (empContable:string, SUBCTA_CONTABLE:string, numeroCuenta:string, COD_PROD_BANCARIO:number, fechaInicio:string, fechaCorte: string, ventanaActual:string) => {
        const result: saldosApuntes = await saldoApunte(empContable, SUBCTA_CONTABLE, numeroCuenta, COD_PROD_BANCARIO, fechaInicio, fechaCorte, ventanaActual);
        set({saldoApunte: result});
    },
    setSaldoMovimiento: async (empContable:string, SUBCTA_CONTABLE:string, numeroCuenta:string, COD_PROD_BANCARIO:number, fechaInicio:string, fechaCorte: string, ventanaActual:string) => {
        const result = await saldoMovimiento(empContable, SUBCTA_CONTABLE, numeroCuenta, COD_PROD_BANCARIO, fechaInicio, fechaCorte, ventanaActual);
        set({ saldoMovimiento: result });
    }, 
    clearSaldos: () => {
        // Restablecer los saldos a sus valores iniciales
        set({
            saldoApunte: {
                Saldo_Inicial: 0,
                IMPORTE_MOVIMIENTOS_SIN_CONCILIAR: 0,
                EMPRESA: 0,
            },
            saldoMovimiento: {
                SALDO: 0,
                importe: 0,
                saldoFinal: 0,
                IMPORTE_APUNTE_SIN_CONCILIAR: 0,
                fechaFinal: '',
            },
        });
    },
}));