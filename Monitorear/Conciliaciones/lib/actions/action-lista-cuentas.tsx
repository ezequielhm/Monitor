'use server'

export async function fetchListaCuentas() {
    try {
        const baseURL = process.env.NEXT_PUBLIC_API_CONCILIACIONES;
        const endpoint = '/GestionCuenta';

        const url = `${baseURL}${endpoint}`

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const cuentas = await response.json();
        return cuentas;
    }catch{

    }
}