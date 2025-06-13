import BackMenuButton from "./back-button";
import MenuLink from "./menu-link";
import Image from "next/image";

const MenuPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full bg-white shadow-sm py-4">
        <div className="flex flex-col items-center">
          <Image 
            src="/logohuertas.png"
            alt="logohuertas"
            width={250}
            height={120}
            className="mx-auto drop-shadow-md"
          />
          <h1 className="text-5xl font-light text-red-600 mt-4">App Conciliaciones</h1>
          <p className="text-base text-gray-600 mt-2">Departamento Financiero y Bancos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-5xl px-4">
        <MenuLink href="/worksheet" text="Conciliación bancos" icon="🔗" colorClass="bg-red-600 hover:bg-red-500 text-white" enabled={true} />
        <MenuLink href="/conciliacion-cuentas" text="Conciliación cuentas" icon="💰" colorClass="bg-red-600 hover:bg-red-500 text-white" enabled={true} />
        <MenuLink href="/gestion-cuentas" text="Gestión cuentas" icon="📊" colorClass="bg-red-600 hover:bg-red-500 text-white" enabled={true} />
        <MenuLink href="/informes" text="Informes" icon="📄" colorClass="bg-red-600 hover:bg-red-500 text-white" enabled={true} />
        <MenuLink href="/incidencias" text="Incidencias" icon="⚠️" colorClass="bg-red-600 hover:bg-red-500 text-white" enabled={true} />
        <MenuLink href="/importar-ficheros" text="Importar ficheros" icon="📥" colorClass="bg-red-600 hover:bg-red-500 text-white" enabled={true} />
        <MenuLink href="/gestion-estados" text="Gestión Estados" icon="⚙️" colorClass="bg-red-600 hover:bg-red-500 text-white" enabled={true} />
        <MenuLink href="http://tesoreria.appnet/" text="Tesorería" icon="👁‍🗨" colorClass="bg-red-600 hover:bg-red-500 text-white" enabled={true} />
      </div>

      <div className="absolute bottom-0 right-0 p-4 text-sm text-gray-500">
        v0.4.5.3
      </div>
    </div>
  );
};

export default MenuPage;
