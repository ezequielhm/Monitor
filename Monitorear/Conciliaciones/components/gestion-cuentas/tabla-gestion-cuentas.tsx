'use client'
import Tabla from '@/components/ui/tabla';

const TablaGestionCuentas = () => {
    return (
        <Tabla
            tableType="gestionCuentas"
            tabla="gestionCuentas"
            enableRowSelection={false}
        />
    );
};

export default TablaGestionCuentas;
