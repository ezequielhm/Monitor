export async function fetchListadoApuntes(empresa1:string ,cuenta1: string,empresa2: string, cuenta2:string, fechaInicio:Date, fechaFin: Date, conciliado: string){
    
    const baseURL = process.env.NEXT_PUBLIC_API_CONCILIACIONES;
    let endpoint
    if(conciliado === 'S'){
        endpoint = '/ApuntesConciliablesCuentasCero/conciliados';
    } else if (conciliado === 'N'){
        console.log('entra en los no conciliados');
        endpoint = '/ApuntesConciliablesCuentasCero';
    } else if(conciliado === '*'){
        endpoint = '/ApuntesConciliablesCuentasCero/todos';
    }

    const url = `${baseURL}${endpoint}`;
    
    const params1 = new URLSearchParams({
        empresa: empresa1,
        cuenta: cuenta1,
        cuenta2: empresa2,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
    })
    const params2 = new URLSearchParams({
        empresa: empresa2,
        cuenta: cuenta2,
        cuenta2: empresa1,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
    })
    const urlParams1 = `${url}?${params1}`;
    const urlParams2 = `${url}?${params2}`;
    
    const response1 = await fetch(urlParams1, {
        method: 'GET',
        headers:{ 
            'Content-Type': 'application/json',
        }
    });
    const response2 = await fetch(urlParams2, {
        method: 'GET',
        headers:{ 
            'Content-Type': 'application/json',
        }
    });
    const apuntesIzquierda = await response1.json();
    const apuntesDerecha = await response2.json();
    return { apuntesIzquierda, apuntesDerecha };
}