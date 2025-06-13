'use client'
import Tabla from '@/components/ui/tabla';

const TablaApuntesRevision = () => {
  
    return (
        <Tabla
            tableType="apuntes"
            tabla="apuntesRevision"
            enableRowSelection={false}
        />
    );
};

export default TablaApuntesRevision;
