'use server';

export async function fetchValidacionCuentas(
    empresa1: string,
    cuenta1: string,
    empresa2: string,
    cuenta2: string
) {
    try {
        const baseURL = process.env.NEXT_PUBLIC_API_CONCILIACIONES;
        const endpoint = '/GestionCuenta/ValidarCombinacion';
        const url = `${baseURL}${endpoint}`;

        const params1 = new URLSearchParams({
            empresa: empresa1,
            cuentaM: cuenta1,
            cuentaP: empresa2
        });
        const params2 = new URLSearchParams({
            empresa: empresa2,
            cuentaM: cuenta2,
            cuentaP: empresa1
        });

        const urlParams1 = `${url}?${params1}`;
        const urlParams2 = `${url}?${params2}`;

        const response1 = await fetch(urlParams1, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const response2 = await fetch(urlParams2, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const texto1 = await response1.text();
        const texto2 = await response2.text();

        return { texto1, texto2 };
    } catch (error) {
        console.error("Error en fetchValidacionCuentas:", error);
        return null;
    }
}
