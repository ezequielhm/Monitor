import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Box,
} from '@chakra-ui/react';
import { useStore } from '@/lib/store';
import TablaDetallesIncidencia from '@/components/incidencias/tabla-detalles-incidencia';
import TablaSaldosDescuadrados from '@/components/incidencias/tabla-saldos-descuadrados';
import { tituloIncidencia } from '@/components/incidencias/tabla-incidencias';

function DetallesIncidenciaModal() {
    const { isDetallesIncidenciaModelOpen, openDetallesIncidenciaModal, closeDetallesIncidenciaModal, propsIncidenciaDetalle } = useStore();

    const hayIncidencias = propsIncidenciaDetalle?.length > 0;
    const tipoIncidencia = hayIncidencias ? propsIncidenciaDetalle[0].Tipo_Incidencia : '';

    {/* Estructura del modal */ }
    return (
        <Modal
            isOpen={isDetallesIncidenciaModelOpen}
            onClose={() => { document.body.style.overflow = 'hidden'; closeDetallesIncidenciaModal(); }}
            // se tiene que ajustar al tamaño de la pantalla pero con un pequeño margen
            size="6xl"
            blockScrollOnMount={true}
            preserveScrollBarGap={true}>
            <ModalOverlay />
            <ModalContent 
                maxWidth="90vw"
                maxHeight="90vh"
                overflow="auto"
                marginX="auto"
                marginY="5vh"
            >
                <ModalHeader>DETALLES INCIDENCIAS</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {/* Contenido del modal */}
                    <div className='w-full text-xl text-center font-bold'>
                        {tituloIncidencia(tipoIncidencia)}
                    </div>

                    {hayIncidencias && propsIncidenciaDetalle[0].Tipo_Incidencia !== 'apuntesVolcados' && propsIncidenciaDetalle[0].Tipo_Incidencia !== 'movimientosVolcados' && propsIncidenciaDetalle[0].Tipo_Incidencia !== 'saldosN43' &&
                        <div className='gap-1'>
                            <div> <span className='text-lg font-semibold inline-block pr-2'>Empresa:</span>{propsIncidenciaDetalle[0].Empresa}</div>
                            <div> <span className='text-lg font-semibold inline-block pr-2'>Cuenta:</span>{propsIncidenciaDetalle[0].NUM_CTA_BANCARIA?.slice(propsIncidenciaDetalle[0].NUM_CTA_BANCARIA?.length - 5)}</div>
                        </div>
                    }
                    {
                        hayIncidencias && propsIncidenciaDetalle[0].Tipo_Incidencia !== 'saldosDescuadrados' ?
                            <TablaDetallesIncidencia />
                            :
                            <TablaSaldosDescuadrados />
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default DetallesIncidenciaModal;