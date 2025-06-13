'use client'
import Tabla from '@/components/ui/tabla';

const TablaBancosTodosRevision = () => {
    
    return (
        <Tabla
            tableType="bancos"
            tabla="bancosTodosRevision"
            enableRowSelection={false}
        />
    );
};

export default TablaBancosTodosRevision;
