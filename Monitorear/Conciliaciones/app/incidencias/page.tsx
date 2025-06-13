'use client'
import React, { useEffect } from 'react';
import TablaIncidencias from '@/components/incidencias/tabla-incidencias';
import BackMenuButton from '@/components/ui/menu/back-button';
import ProtectedPage from '@/components/ui/proteger-pantalla';

export default function Home() {

  return (
    // <ProtectedPage requiredGroups={['SHP_Conciliaciones_Admin', 'SHP_Conciliaciones_Operativo'/*, 'Inf_desarrollo'*/]}>
    <>
      <BackMenuButton />
      <TablaIncidencias />
    </>
    // </ProtectedPage>
  );
}
