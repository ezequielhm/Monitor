import { useStore } from '@/lib/store';
import { useEffect, ReactNode } from 'react';
import BotonesConciliaciones from '../conciliaciones/botones-navegar-worksheet';
import BackMenuButton from './menu/back-button';
import { usePathname } from 'next/navigation'; // Importamos usePathname para verificar la ruta actual

interface ProtectedPageProps {
  requiredGroups: string[];
  children: ReactNode;
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ requiredGroups, children }) => {
  const { userData, ventanaActual } = useStore(); // Obtiene ventanaActual del store además de userData
  const pathname = usePathname(); // Obtenemos la ruta actual

  const userHasAccess = requiredGroups.some(group =>
    userData?.groups?.includes(group)
  ); // Verifica si el usuario pertenece a uno de los grupos requeridos

  useEffect(() => {
    if (!userHasAccess) {
      console.log('Acceso denegado. Redirigiendo...');
    }
  }, [userHasAccess]);

  if (!userHasAccess) {
    return (
      <main className="flex flex-col w-full min-w-full h-full min-h-full overflow-hidden">
        <div className="p-2">
          <BackMenuButton />
        </div>
        {/* Solo mostramos los botones si la ventana actual es conciliaciones, worksheet o revision
            Y si no estamos ya en una de las rutas correspondientes */}
        {['conciliacionWorksheet', 'conciliacionCruzada', 'conciliacionRevisar'].includes(ventanaActual) &&
          ['/worksheet', '/conciliaciones', '/revision'].includes(pathname ?? '') && (
          <div className="flex justify-center w-full mb-4">
            <div className="flex flex-col lg:flex-row items-center justify-center">
              <BotonesConciliaciones />
            </div>
          </div>
        )}
        <div className="text-center mt-20">
          <h1 className="text-4xl font-bold">Acceso denegado</h1>
          <p className="text-xl mt-4">Lo sentimos, no tienes permiso para acceder a esta pestaña.</p>
        </div>
      </main>
    );
  }

  return children; // Si el usuario tiene acceso, mostramos el contenido
};

export default ProtectedPage;
