'use server'
export async function fetchCabecera(ID: number) {
    try {
        const response = await fetch(`http://api.conciliaciones.appnet/Conciliaciones/Cabecera/${ID}`);
        console.log(`URL: `, `http://api.conciliaciones.appnet/Conciliaciones/Cabecera/${ID}`);
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al llamar a la API: ', error);
        throw error;
    }
}
