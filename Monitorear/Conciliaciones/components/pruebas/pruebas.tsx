'use client';
import { useRef, useEffect, useState } from 'react';
// import { fetchPermisos } from '@/lib/actions/action-permisos';
import { useStore } from '@/lib/store';

const Pruebas = () => {
  const miRef = useRef(0); // Valor que no provoca renderizado
  const [permisos, setPermisos] = useState([]);
  const userData = useStore((state) => state.userData);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await fetchPermisos(userData.user.usuario);
  //       console.log(result)
  //       setPermisos(result);
  //     } catch (error) {
  //       console.error('Error fetching permisos:', error);
  //     }
  //   };

  //   fetchData();
  // }, [userData.user.usuario]);

  // console.log(permisos);

  const actualizarValor = () => {
    miRef.current += 1; // Actualizas el valor sin provocar renderizado
    console.log(miRef.current);
  };

  return (
    <div>
      <button onClick={actualizarValor}>{`Actualizar valor ${miRef.current}`}</button>
    </div>
  );
};

export default Pruebas;
