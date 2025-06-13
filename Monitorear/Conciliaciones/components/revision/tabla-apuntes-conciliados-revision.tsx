'use client'
import Tabla from '@/components/ui/tabla';

const TablaApuntesConciliadosRevision = () => {
  
    return (
        <Tabla
            tableType="apuntes"
            tabla="apuntesConciliadosRevision"
            enableRowSelection={false}
        />
    );
};

export default TablaApuntesConciliadosRevision;
