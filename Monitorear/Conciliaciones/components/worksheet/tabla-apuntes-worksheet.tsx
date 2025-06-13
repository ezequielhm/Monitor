'use client'
import Tabla from '@/components/ui/tabla';

const TablaApuntesConciliar = () => {
  
    return (
        <Tabla
            tableType="apuntes"
            tabla="apuntesWorksheet"
            enableRowSelection={false}
        />
    );
};

export default TablaApuntesConciliar;
