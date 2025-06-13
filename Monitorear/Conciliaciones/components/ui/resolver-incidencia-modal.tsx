import { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { guardarConExpiracion } from '@/lib/hooks/use-guardar-localStorage-expiracion';

function ResolverIncidenciaModal() {
    const { isResolverIncidenciaModalOpen, closeResolverIncidenciaModal, userData } = useStore();

    return (
        <>
        {/* Estructura del modal */}
        <Modal isOpen={isResolverIncidenciaModalOpen} onClose={closeResolverIncidenciaModal}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>INCIDENCIAS</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {/* Contenido del modal */}
                <p>Se han producido desajustes entre Apuntes Contables</p>
            </ModalBody>

            <ModalFooter >
                {
                    // (['SHP_Conciliaciones_Admin', 'SHP_Conciliaciones_Operativo'].some(group =>
                    //     userData?.groups?.includes(group)))
                    true ?
                    <Link href={`/incidencias`} target='_blank' className='hover:bg-none'>
                        <Button colorScheme='green' mr={3} onClick={closeResolverIncidenciaModal} >Resolver</Button>
                    </Link>
                    :
                    <button
                        disabled={true}    
                        className={`w-28 h-10 rounded-md bg-gray-500 px-5 py-2 mr-4 text-base text-white shadow-md hover:cursor-not-allowed`}
                    >
                        Resolver
                    </button>
                }
                <Button colorScheme="blue" mr={3} onClick={() => {
                    closeResolverIncidenciaModal();
                    guardarConExpiracion('alertaIncidencias', 'cerrado', 3600000); // 1 hora
                }}>Continuar</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    );
}

export default ResolverIncidenciaModal;
