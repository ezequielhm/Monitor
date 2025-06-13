'use client'
import React, { useEffect, useState } from 'react';
import { fetchEmpresa } from '@/lib/actions/empresa-actions';
import dynamic from 'next/dynamic';
import { useStore } from '@/lib/store';

const FiltroCliente = dynamic(() => import('@/components/ui/filters/filtro-cliente'), { ssr: false });

interface FiltroGenericoProps {
    onSearch?: () => void;
}

export const FiltroGenerico: React.FC<FiltroGenericoProps> = ({ onSearch = () => {} }) => {
  const [empresas, setEmpresas] = useState([]);
  const estados = useStore(state => state.estadosApuntes);
  const ventanaActual = useStore(state => state.ventanaActual);
  const userData = useStore(state => state.userData);
  const [loading, setloading] = useState(true);
  const socket = useStore(state => state.socket);

  useEffect(() => {
    if (socket) {
      socket.on('revalidarIncidencias-toCliente', () => {
          // TODO: Llamar a la función que actualiza las incidencias
      });
    }
  }, [socket]);

  useEffect(() => {
    const fetchData = async () => {
      setloading(true);  // Inicia la carga
      const empresasData = await fetchEmpresa(userData.user.usuario);
      console.log('EmpresaData: ', empresasData);
      setEmpresas(empresasData);
      setloading(false);  // Termina la carga
    };
    fetchData();
  }, [ventanaActual]);
      

  return (
      <div className="max-w-7xl mx-auto p-2">
          {loading ? (
              <p>Cargando empresas...</p>
          ) : (
              <FiltroCliente empresas={empresas} estados={estados} onSearch={onSearch} />
          )}
      </div>
  );
};
