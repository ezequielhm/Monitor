import { Apunte } from "../store/store-gestion-cuentas";

const fetchDeleteConciliacionParcialCuentasCero = async (
        apuntesCuentasCeroIzquierda : Apunte[],
        apuntesCuentasCeroDerecha : Apunte[],
        idConciliacion : number,
        importeMaximo : number | null,
    ): Promise<void> => {
    try {
        const baseURL = process.env.NEXT_PUBLIC_API_CONCILIACIONES;
        const endpoint = `/ApuntesDesconciliarCuentasCero`;

        const url = `${baseURL}${endpoint}`;
        console.log("apuntesCuentasCeroIzquierda", apuntesCuentasCeroIzquierda);
        const body = {
            id_conciliacion: idConciliacion,
            importe: importeMaximo,
            ApunteIzquierdaCuentaCero: apuntesCuentasCeroIzquierda.map((apunte) => (
                apunte.id
            )),
            ApunteDerechaCuentaCero: apuntesCuentasCeroDerecha.map((apunte) => (
                apunte.id
            )),
        };

        console.log('URL de la API:', url);
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        console.log('Respuesta de la API:', response);
        console.log('Cuerpo de la solicitud:', body);

        if (!response.ok) {
            const error = await response.json();
            console.error('Error al conciliar:', error);
            throw new Error(error.message || 'Error al conciliar apuntes cuentas cero');
        }

        const resultado = await response.json();
        console.log('Resultado de la conciliación:', resultado);
    } catch (error) {
        console.error('Error al intentar borrar la conciliación:', error);
    }
};

export default fetchDeleteConciliacionParcialCuentasCero;