'use server'

export async function fetchListaApuntesEditar(id : number, empresa1: string, empresa2: string,cuenta1: string, cuenta2: string) {
    
    try {

        const baseURL = process.env.NEXT_PUBLIC_API_CONCILIACIONES;
        const endpoint = '/ApuntesConciliablesCuentasCero/editar';

        const url = `${baseURL}${endpoint}`

        const paramsIzquierda = new URLSearchParams({
            id_conciliacion: id.toString(),
            empresa: empresa1,
            cuenta: cuenta1,
            cuenta2: empresa2,
        })

        const paramsDerecha = new URLSearchParams({
            id_conciliacion: id.toString(),
            empresa: empresa2,
            cuenta: cuenta2,
            cuenta2: empresa1,
        })

        const urlParamsIzquierda = `${url}?${paramsIzquierda}`
        const urlParamsDerecha = `${url}?${paramsDerecha}`

        const respuestaIzquierda = await fetch(urlParamsIzquierda, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const respuestaDerecha = await fetch(urlParamsDerecha, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const tablaIzquierda = await respuestaIzquierda.json();
        const tablaDerecha = await respuestaDerecha.json();

        return { tablaIzquierda, tablaDerecha };
    }catch(error){
        console.error('Error al recoger los datos en el action "action-lista-apuntes-editar": ', error);
        throw error;
    }
}