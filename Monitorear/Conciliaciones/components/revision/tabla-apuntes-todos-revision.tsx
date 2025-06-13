'use client'
import Tabla from '@/components/ui/tabla';

const TablaApuntesTodosRevision = () => {
  
    return (
        <Tabla
            tableType="apuntes"
            tabla="apuntesTodosRevision"
            enableRowSelection={false}
        />
    );
};

export default TablaApuntesTodosRevision;
