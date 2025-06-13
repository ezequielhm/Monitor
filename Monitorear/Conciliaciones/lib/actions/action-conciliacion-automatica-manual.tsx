'use server';

export async function fetchConciliacionAutomaticaManual(empresa1: string, empresa2: string, cuenta1: string, cuenta2: string) {
    console.log('Parámetros recibidos:', { empresa1, empresa2, cuenta1, cuenta2 });

    if (!empresa1 || !empresa2 || !cuenta1 || !cuenta2) {
        throw new Error('Faltan parámetros obligatorios para la conciliación automática.');
    }

    const baseURL = process.env.NEXT_PUBLIC_API_CONCILIACIONES;
    const endpoint = '/ConciliacionAutomatica/Ejecutar';
    const url = `${baseURL}${endpoint}`;
    const params = new URLSearchParams({
        empresa1Filter: empresa1,
        empresa2Filter: empresa2,
        cuenta1Filter: cuenta1,
        cuenta2Filter: cuenta2,
    });
    const urlParams = `${url}?${params}`;
    console.log('fetchConciliacionAutomaticaManual: ', urlParams);
    
    const response = await fetch(urlParams, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
    }
    
    // Verificar si la respuesta ya es un objeto JSON
    let data;
    if (typeof response.json === 'function') {
        data = await response.json();
    } else {
        data = response; // Si ya es un objeto JSON, usarlo directamente
    }
    
    return data; // Retornar el objeto JSON
}