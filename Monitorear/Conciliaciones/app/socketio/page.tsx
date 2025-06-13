'use client'

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [inbox, setInbox] = useState<string[]>(["hello", "nice"]);
  const [message, setMessage] = useState<string>("");
  const [estado, setEstado] = useState<string>("pendiente");

  useEffect(() => {
    const newSocket = io("http://localhost:3030");
    setSocket(newSocket);

    // Escucha el evento 'mensaje' para recibir nuevos mensajes
    newSocket.on('mensaje', (nuevoMensaje: string) => {
      setInbox((prevInbox) => [...prevInbox, nuevoMensaje]);
    });

    // Escucha el evento 'estado actualizado' para recibir cambios de estado
    newSocket.on('estado actualizado', (nuevoEstado: string) => {
      setEstado(nuevoEstado);
    });

    // depuración
    newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
    });
    
    newSocket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
    });

    newSocket.on('connect_error', (error) => {
        console.error('Connection Error:', error);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const enviarMensaje = () => {
    if (socket && message) {
      socket.emit('mensaje', message);
      setMessage(""); // Limpia el campo de entrada después de enviar
    }
  };

  const cambiarEstado = (nuevoEstado: string) => {
    if (socket) {
      socket.emit('cambiar estado', nuevoEstado);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <div>
        <h2>Mensajes</h2>
        <ul>
          {inbox.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={enviarMensaje}>Enviar</button>
      </div>
      
      <div>
        <h2>Estado Actual: {estado}</h2>
        <select value={estado} onChange={(e) => cambiarEstado(e.target.value)}>
          <option value="pendiente">Pendiente</option>
          <option value="validado">Validado</option>
          <option value="cerrado">Cerrado</option>
        </select>
      </div>
    </div>    
  );
}
