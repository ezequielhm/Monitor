// Función para guardar con expiración
export function guardarConExpiracion(clave, valor, tiempoExpiracionEnMilisegundos) {
    const ahora = new Date().getTime();
  
    const item = {
      valor: valor,
      expiracion: ahora + tiempoExpiracionEnMilisegundos,
    };
  
    localStorage.setItem(clave, JSON.stringify(item));
  }
  
  // Función para obtener con verificación de expiración
export function obtenerConExpiracion(clave) {
    const itemStr = localStorage.getItem(clave);
  
    if (!itemStr) {
      return null;
    }
  
    const item = JSON.parse(itemStr);
    const ahora = new Date().getTime();
  
    if (ahora > item.expiracion) {
      localStorage.removeItem(clave);
      return null;
    }
  
    return item.valor;
  }