import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Button,
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { incidencia } from '@/lib/definitions/incidencia-definition';

const NotificacionesMenu = () => {

  const notificaciones: incidencia[] = useStore(state => state.incidencias);
  const userData = useStore(state => state.userData);

  const numeroNotificaciones = notificaciones.length;
  // De momento, todos los usuarios tienen acceso a incidencias - hasta nuevo aviso
  const permisosUser = true;
  // const permisosUser = (['SHP_Conciliaciones_Admin', 'SHP_Conciliaciones_Operativo'].some(group =>
  //   userData?.groups?.includes(group)));
  return (
    <Box position="relative" display="inline-block">
      <Link href={permisosUser ? `/incidencias` : ''} target={permisosUser ? '_blank' : undefined} className='hover:bg-none'>
        <Button
          as={IconButton}
          aria-label="Notificaciones"
          icon={
            <Box position="relative">
              <BellIcon boxSize={8} />
              {numeroNotificaciones > 0 && (
                <Badge
                  colorScheme="red"
                  borderRadius="full"
                  position="absolute"
                  top="-1px"
                  right="-1px"
                  boxSize="1.25rem"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="0.75rem"
                >
                  {numeroNotificaciones}
                </Badge>
              )}
            </Box>
          }
          variant="ghost"
        />
      </Link>
    </Box>
  );
};

export default NotificacionesMenu;
