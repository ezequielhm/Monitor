import React from 'react';
import Link from 'next/link';

const MenuLateral: React.FC = () => {
  return (
    <nav className="flex flex-col space-y-2 mt-4">
      <Link href="/conciliaciones" className="text-red-600 font-bold">Conciliación bancos</Link>
      <Link href="/conciliacion-cuentas" className="text-gray-600">Conciliacion cuentas</Link>
      <Link href="/gestion-cuentas" className="text-gray-600">Gestión cuentas</Link>
      <Link href="/informes" className="text-gray-600">Informes</Link>
      <Link href="/incidencias" className="text-gray-600">Incidencias</Link>
      <Link href="/importar-ficheros" className="text-gray-600">Importar ficheros</Link>
      <Link href="/gestion-estados" className="text-gray-600">Gestión Estados</Link>
    </nav>
  );
};

export default MenuLateral;
