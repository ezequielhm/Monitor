'use client'
import Tabla from '@/components/ui/tabla';

const TablaBancosConciliadosRevision = () => {
  
    return (
        <Tabla
            tableType="bancos"
            tabla="bancosConciliadosRevision"
            enableRowSelection={false}
        />
    );
};

export default TablaBancosConciliadosRevision;
