'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from "@/lib/store"; // Acceso a la tienda
import { incidencia } from '@/lib/definitions/incidencia-definition';
import { obtenerConExpiracion } from '@/lib/hooks/use-guardar-localStorage-expiracion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false); // Controla si los datos están cargados
  const mantenimiento = process.env.NEXT_PUBLIC_Mantenimiento;

  const {
    setEstadosApuntes,
    setEstadosMovimientos,
    setUserData,
    setPermisos,
    userData,
    socket,
    setIncidencias,
    recargaIncidenciaSaldoN43,
    incidencias,
    openModal,
    closeModal,
  } = useStore(state => ({
    setEstadosApuntes: state.setEstadosApuntes,
    setEstadosMovimientos: state.setEstadosMovimientos,
    setUserData: state.setUserData,
    setPermisos: state.setPermisos,
    userData: state.userData,
    socket: state.socket,
    setIncidencias: state.setIncidencias,
    recargaIncidenciaSaldoN43: state.recargaIncidenciaSaldoN43,
    incidencias: state.incidencias,
    openModal: state.openResolverIncidenciaModal,
    closeModal: state.closeResolverIncidenciaModal,
  }));

  useEffect(() => {
    if (socket) {
      socket.on('incidencias-SO_to_APP', (incidencias: incidencia[]) => { // Evento socket para actualizar el comentario una vez recibido del servidor
        setIncidencias(incidencias);
        console.log('INCIDENCIAS RECIBIDAS', incidencias);
        // gestión del popup de incidencias
        (incidencias.length > 0 && obtenerConExpiracion('alertaIncidencias') !== 'cerrado') ? openModal() : closeModal();
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      console.log('SOLICITANDO INCIDENCIAS - saldoN43 resuelto', incidencias);
      socket.emit('recarga-saldosN43-APP_to_SO');
    }
  }, [recargaIncidenciaSaldoN43]);

  useEffect(()=> {
    if (socket && incidencias.length === 0) {
      console.log('SOLICITANDO INCIDENCIAS', incidencias);
      socket.emit('incidencias-APP_to_SO');
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('revalidarIncidencias-toCliente', () => {
        console.log('SOLICITANDO INCIDENCIAS después de desconciliar', incidencias);
        socket.emit('incidencias-APP_to_SO');
      });
    }
  }, [socket]);

  // Cargamos los datos necesarios desde la tienda
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Llamadas a las funciones que actualizan los estados en el store
        await setEstadosApuntes();
        await setEstadosMovimientos();
        await setUserData();

        setIsReady(true); // Datos listos
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    cargarDatos();
  }, []);

  useEffect(()=>{
    const cargarPermisos = async () =>{
      try{
        setPermisos(userData.user.usuario);
      }catch (error){
        console.error("Error al cargar los datos:", error);
      }
    }
    cargarPermisos()
  },[userData])

  useEffect(()=> {
    if (mantenimiento === 'true') {
      if ('/' + window.location.href.split('/').pop() !== '/mantenimiento') router.push('/mantenimiento');
    } else {
      if ('/' + window.location.href.split('/').pop() === '/mantenimiento') router.push('/');
    }
  }, []);
  // Verificamos si el usuario tiene acceso una vez que los datos están cargados
  useEffect(() => {
    if (isReady && !userData.groups.includes('SHP_Conciliaciones_Acceso')) {
      console.log("El usuario no tiene acceso, redirigiendo...");
      router.push('/sin-acceso'); // Redirigir a una página sin acceso o mostrar un mensaje
    }
  }, [isReady, userData]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-700">Cargando datos...</p>
      </div>
    );  }

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-1 flex-col">
        {/* Contenido */}
        <main className="h-full flex-1 overflow-auto">{children}</main>

        {/* Footer */}
        {/* <footer className="bg-slate-400 p-1 text-xs text-white shadow-md">
          <p className="text-center">Beta Aplicación conciliaciones</p>
        </footer> */}
      </div>
    </div>
  );
};

export default Layout;
