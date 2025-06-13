// components/Loader.tsx
import React, { useState, useRef, useEffect } from 'react';

export default function Loader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);

  const [loadingText, setLoadingText] = useState('');
  const [index, setIndex] = useState(0);
  const loadingString = 'Cargando...';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const size = 64; // Tamaño del canvas
    canvas.width = size;
    canvas.height = size;

    let angle = 0;
    const radius = size / 3; // Radio del círculo

    const drawLoader = () => {
      // Limpiar el canvas
      context.clearRect(0, 0, size, size);

      // Configuración del círculo
      context.lineWidth = 8;
      context.strokeStyle = '#ef4444'; // Color del círculo (rojo)

      // Dibujar el círculo exterior
      context.beginPath();
      context.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
      context.stroke();

      // Dibujar el arco animado
      context.beginPath();
      context.arc(size / 2, size / 2, radius, angle, angle + Math.PI / 2);
      context.stroke();

      // Incrementar el ángulo para la animación
      angle += 0.1;

      requestRef.current = requestAnimationFrame(drawLoader);
    };

    drawLoader();

    // Animación del texto
    const interval = setInterval(() => {
      setLoadingText((prevText) => {
        if (index < loadingString.length) {
          setIndex(index + 1);
          return loadingString.slice(0, index + 1);
        } else {
          setIndex(0);
          return '';
        }
      });
    }, 150);

    return () => {
      cancelAnimationFrame(requestRef.current as number);
      clearInterval(interval);
    };
  }, [index]);

  return (
    <div className="loader-container flex flex-col items-center justify-center h-screen">
      <canvas ref={canvasRef} className="loader w-16 h-16" />
      <div className="mt-4 text-center">
        {loadingText}
      </div>
    </div>
  );
}
