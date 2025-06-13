// Función para calcular el brillo de un color hexadecimal
export const getBrightness = (hex: string): number => {
    const c = hex.substring(1); // Elimina el #
    const rgb = parseInt(c, 16); // Convierte el hex en un número entero
    const r = (rgb >> 16) & 0xff; // Extrae el componente rojo
    const g = (rgb >> 8) & 0xff;  // Extrae el componente verde
    const b = (rgb >> 0) & 0xff;  // Extrae el componente azul
    // Cálculo del brillo basado en la fórmula común
    return (r * 299 + g * 587 + b * 114) / 1000;
  };
  
  // Función para determinar el color del texto en función del color de fondo
  export const getTextColor = (backgroundColor: string): string => {
    const brightness = getBrightness(backgroundColor);
    // Si el brillo es mayor a 128, el color del texto será negro, de lo contrario, blanco
    return brightness > 128 ? 'text-black' : 'text-white';
  };
  