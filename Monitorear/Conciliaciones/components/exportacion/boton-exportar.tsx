import React from 'react';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Flex,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { FaDownload } from 'react-icons/fa';
import ExportPDFButton from './exportar-pdf';
import ExportExcelButton from './exportar-excel';
import {
  ApunteContable,
  apuntesConciliadosType,
  MovimientoBancario,
  movimientosConciliadosType
} from '@/lib/definitions';
import { saldoStore } from '@/lib/store/store-saldos';
import { gestionCuentasStore } from '@/lib/store/store-gestion-cuentas';
import { Apunte } from '@/lib/store/store-gestion-cuentas';

interface CommonProps {
  ventanaActual: string;
  empContableSelec: string;
  cuentaSelec: string;
  cuentaBancSelec: string;
  busquedaRealizada?: boolean; // 👈 nueva prop
}


interface CuentasCeroProps extends CommonProps {
  isCuentasCero: true;
  apuntesContables: Apunte[];
  movimientosBancarios: Apunte[];
}

interface ConciliacionProps extends CommonProps {
  isCuentasCero?: false;
  apuntesContables: ApunteContable[];
  movimientosBancarios: MovimientoBancario[];
  regConciliados: string;
  apuntesConciliados: apuntesConciliadosType[];
  movimientosConciliados: movimientosConciliadosType[];
}

type ExportButtonProps = CuentasCeroProps | ConciliacionProps;

const ExportButton: React.FC<ExportButtonProps> = (props) => {
  const {
    ventanaActual,
    empContableSelec,
    cuentaSelec,
    cuentaBancSelec,
    busquedaRealizada
  } = props;

  // Get data from stores
  const { apuntesIzquierda, apuntesDerecha } = gestionCuentasStore();
  const saldoApunte = saldoStore(state => state.saldoApunte);
  const saldoMovimiento = saldoStore(state => state.saldoMovimiento);

  const isCero = props.isCuentasCero === true;
  
  const noHayRegistros = isCero
    ? apuntesIzquierda.length === 0 && apuntesDerecha.length === 0
    : 'apuntesContables' in props 
      ? props.apuntesContables.length === 0 && props.movimientosBancarios.length === 0
      : true;

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<FaDownload />}
        variant="outline"
        aria-label="Exportar"
        isRound
      />
      <MenuList minW="auto" rounded="full" p={0} m={0}>
        {!busquedaRealizada ? (
          <Alert status="error" rounded="md">
            <AlertIcon />
            No hay registros para exportar.
          </Alert>
        ) : (
          <Flex>
            {isCero ? (
              <>
                <ExportPDFButton
                  ventanaActual={ventanaActual}
                  apuntesContables={apuntesIzquierda}
                  movimientosBancarios={apuntesDerecha}
                  empContableSelec={empContableSelec}
                  cuentaSelec={cuentaSelec}
                  cuentaBancSelec={cuentaBancSelec}
                  isCuentasCero={true}
                />
                <ExportExcelButton
                  ventanaActual={ventanaActual}
                  apuntesContables={apuntesIzquierda}
                  movimientosBancarios={apuntesDerecha}
                  empContableSelec={empContableSelec}
                  cuentaSelec={cuentaSelec}
                  cuentaBancSelec={cuentaBancSelec}
                  isCuentasCero={true}
                />
              </>
            ) : (
              'apuntesContables' in props && (
                <>
                  <ExportPDFButton
                    ventanaActual={ventanaActual}
                    apuntesContables={props.apuntesContables}
                    movimientosBancarios={props.movimientosBancarios}
                    empContableSelec={empContableSelec}
                    cuentaSelec={cuentaSelec}
                    cuentaBancSelec={cuentaBancSelec}
                    regConciliados={props.regConciliados}
                    apuntesConciliados={props.apuntesConciliados}
                    movimientosConciliados={props.movimientosConciliados}
                    isCuentasCero={false}
                  />
                  <ExportExcelButton
                    ventanaActual={ventanaActual}
                    apuntesContables={props.apuntesContables}
                    movimientosBancarios={props.movimientosBancarios}
                    empContableSelec={empContableSelec}
                    cuentaSelec={cuentaSelec}
                    cuentaBancSelec={cuentaBancSelec}
                    regConciliados={props.regConciliados}
                    apuntesConciliados={props.apuntesConciliados}
                    movimientosConciliados={props.movimientosConciliados}
                    isCuentasCero={false}
                  />
                </>
              )
            )}
          </Flex>
        )}
      </MenuList>
    </Menu>
  );
};

export default ExportButton;