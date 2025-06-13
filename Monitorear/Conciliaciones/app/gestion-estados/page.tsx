'use client'
import GestionEstadosComponent from "@/components/gestion-estados/gestion-estados";
import dynamic from 'next/dynamic';
import BackMenuButton from "@/components/ui/menu/back-button";
import ProtectedPage from "@/components/ui/proteger-pantalla";

const LoaderWrapper = dynamic(() => import('@/components/ui/loader/loaderWrapper'), { ssr: false });

export default function GestionEstados() {
  return (
    <ProtectedPage requiredGroups={['SHP_Conciliaciones_Admin']}>
    <LoaderWrapper>
      <div>
        <BackMenuButton />
      </div>
      <div>
        <GestionEstadosComponent />
      </div>
    </LoaderWrapper>
    </ProtectedPage>
  );
}
