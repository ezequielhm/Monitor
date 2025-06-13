// actions/action-gestion-cuentas.ts

'use server';

import { gestionCuentas } from '@/lib/definitions/gestion-cuentas-definitions';

export async function insertarGestionCuentas(data: gestionCuentas) {
    try {
        const baseURL = process.env.NEXT_PUBLIC_API_CONCILIACIONES;
        const endpoint = '/GestionCuenta';

        const url = `${baseURL}${endpoint}`;

        console.log('Datos: ', data);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al insertar cuenta: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Error en la solicitud: ${error}`);
    }
}
