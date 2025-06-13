'use client'
import Tabla from '@/components/ui/tabla';

const TablaBancosConciliacionHistorica = () => {
    
    return (
        <Tabla
            tableType="bancos"
            tabla="bancosConciliacionHistorica"
            enableRowSelection={false}
        />
    );
};

export default TablaBancosConciliacionHistorica;
