import React from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { FaFilePdf } from 'react-icons/fa';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ApunteContable, MovimientoBancario } from '@/lib/definitions';
import { saldoStore } from '@/lib/store/store-saldos';
import useMaxFecha from '@/lib/hooks/use-max-fecha';
import { Apunte } from '@/lib/store/store-gestion-cuentas';

(pdfMake as any).vfs = pdfFonts.vfs;

const formatDate = (d: string | Date) => {
  const dateObj = d instanceof Date ? d : new Date(d);
  return dateObj.toLocaleDateString();
};

interface CommonProps {
  ventanaActual: string;
  empContableSelec: string;
  cuentaSelec: string;
  cuentaBancSelec: string;
  isCuentasCero: boolean;
}

interface CuentasCeroProps extends CommonProps {
  apuntesContables: Apunte[];
  movimientosBancarios: Apunte[];
}

interface NormalProps extends CommonProps {
  apuntesContables: ApunteContable[];
  movimientosBancarios: MovimientoBancario[];
  regConciliados?: string;
  apuntesConciliados?: any[];
  movimientosConciliados?: any[];
}

type ExportPDFButtonProps = CuentasCeroProps | NormalProps;

const ExportPDFButton: React.FC<ExportPDFButtonProps> = (props) => {
  const {
    apuntesContables,
    movimientosBancarios,
    empContableSelec,
    cuentaSelec,
    cuentaBancSelec,
    isCuentasCero
  } = props;

  const { saldoApunte, saldoMovimiento } = saldoStore(state => ({
    saldoApunte: state.saldoApunte,
    saldoMovimiento: state.saldoMovimiento,
  }));

  const { maxFechaApunte, maxFechaMovimiento } = useMaxFecha();

  const sumaApunte = (saldoApunte?.Saldo_Inicial || 0) + (saldoApunte?.IMPORTE_MOVIMIENTOS_SIN_CONCILIAR || 0);
  const sumaMovimiento = (saldoMovimiento?.saldoFinal || 0) + (saldoMovimiento?.IMPORTE_APUNTE_SIN_CONCILIAR || 0);

  const handleExportPDF = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const fileName = `${formattedDate} ${empContableSelec}.pdf`;

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [20, 40, 20, 40],
      content: [
        {
          text: isCuentasCero
            ? 'GESTIÓN DE CUENTAS CERO - Empresa: ' + empContableSelec
            : 'CONCILIACIÓN BANCARIA - Empresa: ' + empContableSelec,
          style: 'header'
        },
        {
          columns: [
            { width: '47%', text: `CUENTA CONTABLE: ${cuentaSelec}`, style: 'subheader' },
            { width: '6%', text: ' ' },
            { width: '47%', text: `CUENTA BANCARIA: ${cuentaBancSelec}`, style: 'subheader', alignment: 'right' }
          ]
        },
        {
          columns: [
            {
              width: '47%',
              stack: [
                { text: 'SALDO CONTABILIDAD', style: 'header' },
                { text: (saldoApunte?.Saldo_Inicial || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }
              ]
            },
            { width: '6%', text: ' ' },
            {
              width: '47%',
              stack: [
                { text: 'SALDO BANCO', style: 'header', alignment: 'right' },
                { text: (saldoMovimiento?.saldoFinal || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), alignment: 'right' }
              ]
            }
          ]
        },
        {
          columns: [
            {
              width: '47%',
              stack: [
                {
                  text: isCuentasCero
                    ? 'APUNTES CONTABLES'
                    : `APUNTES CONTABLES (Últ. Fecha: ${formatDate(maxFechaApunte?.FECHA || new Date())})`,
                  style: 'subheader', margin: [0, 0, 0, 10]
                },
                {
                  table: {
                    headerRows: 1,
                    widths: ['20%', '*', '20%', '10%'],
                    body: [
                      [
                        { text: 'Fecha', style: 'tableHeader' },
                        { text: 'Descripción', style: 'tableHeader' },
                        { text: 'Importe', style: 'tableHeader' },
                        { text: 'D/H', style: 'tableHeader' }
                      ],
                      ...(isCuentasCero
                        ? (apuntesContables as Apunte[]).map(a => [
                          { text: formatDate(a.fecha), style: 'tableBody' },
                          { text: a.descripcion, style: 'tableBody' },
                          { text: a.importe.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), style: 'tableBody' },
                          { text: a.debeHaber || a.clave_importe, style: 'tableBody' }
                        ])
                        : (apuntesContables as ApunteContable[]).map(a => [
                          { text: formatDate(a.FECHA), style: 'tableBody' },
                          { text: a.DESCRI_ASI, style: 'tableBody' },
                          { text: a.IMPORTE.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), style: 'tableBody' },
                          { text: a.CLAVE_IMPORTE, style: 'tableBody' }
                        ])
                      )
                    ]
                  }
                }
              ]
            },
            { width: '3%', text: ' ' },
            {
              width: '47%',
              stack: [
                {
                  text: isCuentasCero
                    ? 'MOVIMIENTOS BANCARIOS'
                    : `(Últ. Fecha: ${formatDate(maxFechaMovimiento?.fechaOperacion || new Date())}) MOVIMIENTOS BANCARIOS`,
                  style: 'subheader', margin: [0, 0, 0, 10], alignment: 'right'
                },
                {
                  table: {
                    headerRows: 1,
                    widths: isCuentasCero ? ['20%', '*', '20%', '10%'] : ['15%', '20%', '40%', '20%', '10%'],
                    body: [
                      ...(isCuentasCero
                        ? [
                          [
                            { text: 'Fecha', style: 'tableHeader' },
                            { text: 'Descripción', style: 'tableHeader' },
                            { text: 'Importe', style: 'tableHeader' },
                            { text: 'D/H', style: 'tableHeader' }
                          ]
                        ]
                        : [
                          [
                            { text: 'Fecha Operación', style: 'tableHeader' },
                            { text: 'INFO1', style: 'tableHeader' },
                            { text: 'INFO5', style: 'tableHeader' },
                            { text: 'Importe', style: 'tableHeader' },
                            { text: 'D/H', style: 'tableHeader' }
                          ]
                        ]
                      ),
                      ...(isCuentasCero
                        ? (movimientosBancarios as Apunte[]).map(m => [
                          { text: formatDate(m.fecha), style: 'tableBody' },
                          { text: m.descripcion, style: 'tableBody' },
                          { text: m.importe.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), style: 'tableBody' },
                          { text: m.debeHaber || m.clave_importe, style: 'tableBody' }
                        ])
                        : (movimientosBancarios as MovimientoBancario[]).map(m => [
                          { text: formatDate(m.fechaOperacion), style: 'tableBody' },
                          { text: m.info_1, style: 'tableBody' },
                          { text: m.info_5, style: 'tableBody' },
                          { text: m.IMPORTE.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), style: 'tableBody' },
                          { text: m.claveDebeHaber, style: 'tableBody' }
                        ])
                      )
                    ]
                  }
                }
              ]
            }
          ]
        },
        { text: ' ', margin: [0, 20, 0, 10] },
        {
          columns: [
            {
              width: '47%',
              stack: [
                { text: 'TOTAL APUNTES', style: 'header', margin: [0, 0, 0, 10] },
                { text: (saldoApunte?.IMPORTE_MOVIMIENTOS_SIN_CONCILIAR || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) },
                { text: `SALDO CONCILIADO: ${sumaApunte.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}` }
              ]
            },
            { width: '6%', text: ' ' },
            {
              width: '47%',
              stack: [
                { text: 'TOTAL MOVIMIENTOS', style: 'header', alignment: 'right', margin: [0, 0, 0, 10] },
                { text: (saldoMovimiento?.IMPORTE_APUNTE_SIN_CONCILIAR || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), alignment: 'right' },
                { text: `SALDO CONCILIADO: ${sumaMovimiento.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`, alignment: 'right' }
              ]
            }
          ]
        }
      ],
      styles: {
        header: { fontSize: 10, bold: true, lineHeight: 1 },
        subheader: { fontSize: 8, bold: true, margin: [0, 10, 0, 10], lineHeight: 0.5 },
        tableHeader: { bold: true, fontSize: 8, color: 'white', fillColor: '#EF4444' },
        tableBody: { fontSize: 7, color: 'black' }
      }
    };

    pdfMake.createPdf(docDefinition).download(fileName);
  };

  return (
    <Box onClick={handleExportPDF} p={0} m={0} display="flex" justifyContent="center">
      <IconButton
        aria-label="Exportar PDF"
        icon={<FaFilePdf color="red" />}
        variant="ghost"
        size="lg"
        isRound
      />
    </Box>
  );
};

export default ExportPDFButton;
