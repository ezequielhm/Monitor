'use client'
import Tabla from '@/components/ui/tabla';

const TablaApuntesConciliacionHistorica = () => {
  
    return (
        <Tabla
            tableType="apuntes"
            tabla="apuntesConciliacionHistorica"
            enableRowSelection={false}
        />
    );
};

export default TablaApuntesConciliacionHistorica;
