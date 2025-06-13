'use server'
export async function fetchSaldosCuentasCero(empresa1: string, empresa2: string, cuenta1: string, cuenta2: string) {
    try{
        const baseUrl = process.env.NEXT_PUBLIC_API_CONCILIACIONES;
        const endpoint1 = '/Saldo/ObtenerSaldoIzquierda';
        const endpoint2 = '/Saldo/ObtenerSaldoDerecha';

        const url1 = `${baseUrl}${endpoint1}`;
        const url2 = `${baseUrl}${endpoint2}`;

        const params = new URLSearchParams({
            empresa1: empresa1,
            empresa2: empresa2,
            cuenta1: cuenta1,
            cuenta2: cuenta2,
        });
        const urlParams1 = `${url1}?${params}`;
        const urlParams2 = `${url2}?${params}`;
        
        const response1 = await fetch(urlParams1, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const response2 = await fetch(urlParams2, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response1.ok || !response2.ok) {
            throw new Error('Error fetching data');
        }

        const saldoIzquierda = await response1.json();
        const saldoDerecha = await response2.json();

        return { saldoIzquierda, saldoDerecha };
    } catch (error) {
        console.error('Error fetching saldos:', error);
        throw new Error('Failed to fetch saldos');
    }
}