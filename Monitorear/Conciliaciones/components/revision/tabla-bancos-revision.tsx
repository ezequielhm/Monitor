'use client'
import Tabla from '@/components/ui/tabla';

const TablaBancosRevision = () => {
    
    return (
        <Tabla
            tableType="bancos"
            tabla="bancosRevision"
            enableRowSelection={false}
        />
    );
};

export default TablaBancosRevision;
