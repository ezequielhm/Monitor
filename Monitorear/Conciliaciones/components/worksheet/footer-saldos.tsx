import React from 'react';  // Añadido React para resolver el error
import { useStore } from '@/lib/store';
import { saldosApuntes, saldosMovimientos } from '@/lib/definitions';
import { useEffect, useState } from 'react';
import { saldoApunte } from '@/lib/actions/saldo-apuntes';
import { saldoMovimiento } from '@/lib/actions/saldo-movimientos';
import { saldoStore } from '@/lib/store/store-saldos';

export const formatEuro = (amount: number) => {
    const positiveAmount = Math.abs(amount);
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
    }).format(positiveAmount);
};

export const getSign = (amount: number, type: 'apunte' | 'movimiento') => {
    if (type === 'apunte') {
        return amount >= 0 ? 'D' : 'H';
    } else if (type === 'movimiento') {
        return amount >= 0 ? 'H' : 'D';
    }
};

const Footer = () => {
    const {
        saldoApunte,
        saldoMovimiento,
        saldoDerecha,
        saldoIzquierda,
    } = saldoStore(state => ({
        saldoApunte: state.saldoApunte,
        saldoMovimiento: state.saldoMovimiento,
        saldoDerecha: state.saldoDerecho,
        saldoIzquierda: state.saldoIzquierda,
    }));

    const ventanaActual = useStore(state => state.ventanaActual);

    const cargando = useStore(state => state.cargando);


    const sumaApunte = (saldoApunte?.Saldo_Inicial || 0) + (saldoApunte?.IMPORTE_MOVIMIENTOS_SIN_CONCILIAR || 0);
    const sumaMovimiento = (saldoMovimiento?.saldoFinal || 0) + (saldoMovimiento?.IMPORTE_APUNTE_SIN_CONCILIAR || 0);
    return (
        <div className="flex text-center mt-2">
            {cargando ? (
                <></>
            ) : !ventanaActual.includes('CuentasCero') ? (
                <>
                    <div className="bg-white text-gray-700 p-2 shadow-md rounded-md w-[39.5%] mr-4">
                        <div className="flex justify-between">
                            <span>
                                Saldo F. Contable: {formatEuro(saldoApunte?.Saldo_Inicial || 0)}{' '}
                                {getSign(saldoApunte?.Saldo_Inicial || 0, 'apunte')}
                            </span>
                            <span>
                                No casado Banco: {formatEuro(saldoApunte?.IMPORTE_MOVIMIENTOS_SIN_CONCILIAR || 0)}{' '}
                                {getSign(saldoApunte?.IMPORTE_MOVIMIENTOS_SIN_CONCILIAR || 0, 'apunte')}
                            </span>
                            <span>
                                Suma: {formatEuro(sumaApunte)}{' '}
                                {getSign(sumaApunte, 'apunte')}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white text-gray-700 p-2 shadow-md rounded-md w-[60%] mr-6">
                        <div className="flex justify-between">
                            <span>
                                Saldo F. Banco: {formatEuro(saldoMovimiento?.saldoFinal || 0)}{' '}
                                {getSign(saldoMovimiento?.saldoFinal || 0, 'movimiento')}
                            </span>
                            <span>
                                No Casado Contable: {formatEuro(saldoMovimiento?.IMPORTE_APUNTE_SIN_CONCILIAR || 0)}{' '}
                                {getSign(saldoMovimiento?.IMPORTE_APUNTE_SIN_CONCILIAR || 0, 'movimiento')}
                            </span>
                            <span>
                                Suma: {formatEuro(sumaMovimiento)}{' '}
                                {getSign(sumaMovimiento, 'movimiento')}
                            </span>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="bg-white text-gray-700 p-2 shadow-md rounded-md w-[50%] mr-4">
                        <div className="flex justify-between">
                            <span>
                                Saldo F. {saldoIzquierda.empresa}: {formatEuro(saldoIzquierda.saldo_inicial || 0)}{' '}
                                {getSign(saldoIzquierda.saldo_inicial || 0, 'apunte')}
                            </span>
                            <span>
                                No casado {saldoIzquierda.cuentap}: {formatEuro(saldoIzquierda.saldo_no_conciliado || 0)}{' '}
                                {getSign(saldoIzquierda.saldo_no_conciliado || 0, 'apunte')}
                            </span>
                            <span>
                                Suma: {formatEuro(saldoIzquierda.saldo_final)}{' '}
                                {getSign(saldoIzquierda.saldo_final, 'apunte')}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white text-gray-700 p-2 shadow-md rounded-md w-[50%] mr-6">
                        <div className="flex justify-between">
                            <span>
                                Saldo F. {saldoDerecha.empresa}: {formatEuro(saldoDerecha.saldo_inicial || 0)}{' '}
                                {getSign(saldoDerecha.saldo_inicial || 0, 'movimiento')}
                            </span>
                            <span>
                                No Casado {saldoDerecha.cuentap}: {formatEuro(saldoDerecha.saldo_no_conciliado || 0)}{' '}
                                {getSign(saldoDerecha.saldo_no_conciliado  || 0, 'movimiento')}
                            </span>
                            <span>
                                Suma: {formatEuro(saldoDerecha.saldo_final)}{' '}
                                {getSign(saldoDerecha.saldo_final, 'movimiento')}
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Footer;
