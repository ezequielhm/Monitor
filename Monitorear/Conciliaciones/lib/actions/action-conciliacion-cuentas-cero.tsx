export async function fetchConciliarCuentasCero({
    empresa1,
    empresa2,
    cuenta1,
    cuenta2,
    importe,
    usuario,
    apuntes,
  }: {
    empresa1: string;
    empresa2: string;
    cuenta1: string;
    cuenta2: string;
    importe: number;
    usuario: string;
    apuntes: {
      idApunte: string;
      fecha: Date;
      importe: number;
      claveImporte: string;
    }[];
  }) {
    const baseURL = process.env.NEXT_PUBLIC_API_CONCILIACIONES;
    const endpoint = '/ConciliacionCuentasCero';
  
    const url = `${baseURL}${endpoint}`;
  
    const body = {
      empresa1,
      empresa2,
      cuenta1,
      cuenta2,
      importe,
      usuario,
      apuntes: apuntes.map((a) => ({
        idApunte: a.idApunte,
        fecha: a.fecha.toISOString(),
        importe: a.importe,
        claveImporte: a.claveImporte,
      })),
    };
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  
    if (!response.ok) {
      const error = await response.json();
      console.error('Error al conciliar:', error);
      throw new Error(error.message || 'Error al conciliar cuentas cero');
    }
  
    const resultado = await response.json();
    return resultado;
  }
  