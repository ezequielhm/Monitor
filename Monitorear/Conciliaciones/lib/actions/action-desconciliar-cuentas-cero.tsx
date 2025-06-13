const fetchDeleteConciliacionCuentasCero = async (id: number): Promise<void> => {
    try {
        const baseURL = process.env.NEXT_PUBLIC_API_CONCILIACIONES;
        const endpoint = `/ApuntesDesconciliarCuentasCero/${id}`;

        const url = `${baseURL}${endpoint}`;

        console.log('URL de la API:', url);
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error al borrar la conciliación con id ${id}: ${response.statusText}`);
        }

        console.log(`Conciliación con id ${id} borrada exitosamente.`);
    } catch (error) {
        console.error('Error al intentar borrar la conciliación:', error);
    }
};

export default fetchDeleteConciliacionCuentasCero;