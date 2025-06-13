import React from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx-js-style';
import { ApunteContable, MovimientoBancario } from '@/lib/definitions';
import { saldoStore } from '@/lib/store/store-saldos';
import { Apunte } from '@/lib/store/store-gestion-cuentas';

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

type ExportExcelButtonProps = CuentasCeroProps | NormalProps;

const ExportExcelButton: React.FC<ExportExcelButtonProps> = ({
  ventanaActual,
  apuntesContables,
  movimientosBancarios,
  empContableSelec,
  cuentaSelec,
  cuentaBancSelec,
  isCuentasCero
}) => {
  const { saldoApunte, saldoMovimiento } = saldoStore(state => ({
    saldoApunte: state.saldoApunte,
    saldoMovimiento: state.saldoMovimiento,
  }));
  
  console.log('apuntesContables', apuntesContables);

  const handleExportExcel = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const fileName = `${formattedDate} ${empContableSelec}.xlsx`;

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);

    const headerStyle = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "EF4444" } }, border: { top: { style: "thin", color: { rgb: "000" } }, bottom: { style: "thin", color: { rgb: "000" } }, left: { style: "thin", color: { rgb: "000" } }, right: { style: "thin", color: { rgb: "000" } } }, alignment: { horizontal: "center", vertical: "center" } };
    const dataStyle = { border: { top: { style: "thin", color: { rgb: "000" } }, bottom: { style: "thin", color: { rgb: "000" } }, left: { style: "thin", color: { rgb: "000" } }, right: { style: "thin", color: { rgb: "000" } } } };
    const currencyStyle = { ...dataStyle, numFmt: "€#,##0.00" };

    // Cabecera Apuntes Contables
    XLSX.utils.sheet_add_aoa(ws, [
      ['Cuenta Contable:'],
      [cuentaSelec],
      [],
      ['Saldo Final Contable:'],
      [{ v: saldoApunte?.Saldo_Inicial || 0, s: currencyStyle }],
      [],
      ['Fecha', 'Descripción', 'Importe', 'Debe/Haber', 'Comentario'].map(text => ({ v: text, s: headerStyle }))
    ], { origin: "A1" });

    // Cabecera Movimientos Bancarios
    XLSX.utils.sheet_add_aoa(ws, [
      ['Cuenta Bancaria:'],
      [cuentaBancSelec],
      [],
      ['Saldo Final Movimiento:'],
      [{ v: saldoMovimiento?.saldoFinal || 0, s: currencyStyle }],
      [],
      isCuentasCero
        ? ['Fecha', 'Descripción', 'Importe', 'Debe/Haber'].map(text => ({ v: text, s: headerStyle }))
        : ['Fecha Operación', 'INFO1', 'INFO2', 'INFO5', 'Importe', 'D/H', 'Comentario'].map(text => ({ v: text, s: headerStyle }))
    ], { origin: "G1" });

    // Datos Apuntes Contables
    const data1 = isCuentasCero
      ? (apuntesContables as Apunte[]).map(a => [
        { v: formatDate(a.fecha) ?? '', s: dataStyle },
        { v: a.descripcion ?? '', s: dataStyle },
        { v: a.importe ?? '', s: currencyStyle },
        { v: a.debeHaber || a.clave_importe, s: dataStyle },
        { v: a.comentario ?? '', s: dataStyle }
      ])
      : (apuntesContables as ApunteContable[]).map(a => [
        { v: formatDate(a.FECHA) ?? '', s: dataStyle },
        { v: a.DESCRI_ASI ?? '', s: dataStyle },
        { v: a.IMPORTE ?? '', s: currencyStyle },
        { v: a.CLAVE_IMPORTE ?? '', s: dataStyle },
        { v: a.Comentario ?? '', s: dataStyle }
      ]);
    XLSX.utils.sheet_add_aoa(ws, data1, { origin: "A8" });

    // Datos Movimientos Bancarios
    const data2 = isCuentasCero
      ? (movimientosBancarios as Apunte[]).map(m => [
        { v: formatDate(m.fecha) ?? '', s: dataStyle },
        { v: m.descripcion ?? '', s: dataStyle },
        { v: m.importe ?? '', s: currencyStyle },
        { v: m.debeHaber  || m.clave_importe , s: dataStyle },
        { v: m.comentario ?? '', s: dataStyle }
      ])
      : (movimientosBancarios as MovimientoBancario[]).map(m => [
        { v: formatDate(m.fechaOperacion) ?? '', s: dataStyle },
        { v: m.info_1 ?? '', s: dataStyle },
        { v: m.info_2 ?? '', s: dataStyle },
        { v: m.info_5 ?? '', s: dataStyle },
        { v: m.IMPORTE ?? '', s: currencyStyle },
        { v: m.claveDebeHaber ?? '' , s: dataStyle },
        { v: m.Comentario ?? '', s: dataStyle }
      ]);
    XLSX.utils.sheet_add_aoa(ws, data2, { origin: "G8" });

    // Saldos Finales
    const endRow = Math.max(apuntesContables.length, movimientosBancarios.length) + 10;
    XLSX.utils.sheet_add_aoa(ws, [
      [`Saldo No Casado Apunte: ${saldoApunte?.IMPORTE_MOVIMIENTOS_SIN_CONCILIAR || 0}`],
      [`Saldo Suma Apunte: ${(saldoApunte?.Saldo_Inicial || 0) + (saldoApunte?.IMPORTE_MOVIMIENTOS_SIN_CONCILIAR || 0)}`]
    ], { origin: `A${endRow + 5}` });
    XLSX.utils.sheet_add_aoa(ws, [
      [`Saldo No Casado Movimiento: ${saldoMovimiento?.IMPORTE_APUNTE_SIN_CONCILIAR || 0}`],
      [`Saldo Suma Movimiento: ${(saldoMovimiento?.saldoFinal || 0) + (saldoMovimiento?.IMPORTE_APUNTE_SIN_CONCILIAR || 0)}`]
    ], { origin: `G${endRow + 5}` });

    // Ajuste de Columnas
    ws['!cols'] = isCuentasCero
      ? [
        { wch: 15 }, { wch: 35 }, { wch: 12 }, { wch: 10 },   // Apuntes Contables
        { wch: 2 },                                           // Espacio
        { wch: 15 }, { wch: 35 }, { wch: 12 }, { wch: 10 }    // Movimientos Bancarios (igual que contables)
      ]
      : [
        { wch: 15 }, { wch: 35 }, { wch: 12 }, { wch: 10 },   // Apuntes Contables
        { wch: 2 },
        { wch: 15 }, { wch: 20 }, { wch: 40 }, { wch: 15 }, { wch: 10 }  // Movimientos normales
      ];

    XLSX.utils.book_append_sheet(wb, ws, ventanaActual);
    XLSX.writeFile(wb, fileName);
  };

  return (
    <Box onClick={handleExportExcel} p={0} m={0} display="flex" justifyContent="center">
      <IconButton
        aria-label="Exportar Excel"
        icon={<FaFileExcel color="green" />}
        variant="ghost"
        size="lg"
        isRound
      />
    </Box>
  );
};

export default ExportExcelButton;
