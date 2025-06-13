export type tipoIncidencia = 'asientosModificados' | 'saldosDescuadrados' | 'conciliacionesDescuadradas' | 'lineasConciliadasDistintasEmpresas' | 'conciliacionAutomatica' | 'apuntesVolcados' | 'movimientosVolcados' | 'saldosN43';

export interface IncidenciaBase {
  Tipo_Incidencia: tipoIncidencia,
}

/*** Incidencias que contienen empresas */
export interface IncidenciaConEmpresa extends IncidenciaBase {
  Empresa: string,
  NUM_CTA_BANCARIA: string,
};

/***Incidencia Asientos Modificados */
export interface AsientosModificados extends IncidenciaConEmpresa {
  Tipo_Incidencia: 'asientosModificados',
  ID: number,
  ID_CONCILIACION: number,
  ID_Conciliado: string,
  ID_Quiter: string,
  Importe_Conciliado: number | string,
  Importe_Quiter: number,
  Descripcion: string
}

export interface SaldosDescuadrados extends IncidenciaConEmpresa {
  Tipo_Incidencia: 'saldosDescuadrados',
  SUBCTA_CONTABLE: string,
  sumaApunte: number,
  sumaMovimientos: number,
  diferencia: number,
  Saldo_Final_Contable: number,
  Saldo_Final_Banco: number,
  No_Casado_Contable: number,
  No_Casado_Banco: number
}

export interface ConciliacionesDescuadradas extends IncidenciaConEmpresa {
  Tipo_Incidencia: 'conciliacionesDescuadradas',
  ID_CONCILIACION: number,
  FechaCreacion: Date,
  ImporteConciliacion: number,
  TotalApuntes: number,
  TotalMovimientos: number,
  DiferenciaImportes: number,
  importeDistinto: number
}

export interface LineasConciliadasDistintasEmpresas extends IncidenciaConEmpresa {
  Tipo_Incidencia: 'lineasConciliadasDistintasEmpresas',
  ID_CONCILIACION: number,
  ID_linea: string,
  Cuenta_Conciliacion: string,
  Cuenta_Linea: string,
}

export interface ConciliacionAutomatica extends IncidenciaConEmpresa {
  Tipo_Incidencia: 'conciliacionAutomatica',
  ID_Apuntes: string,
  ID_Movimiento: number,
  importeApunte: number,
  importeMovimiento: number,
  fechaApunte: Date,
  fechaMovimiento: Date,
  claveApunte: string,
  claveMovimiento: string,
}

export interface ApuntesVolcados extends IncidenciaBase {
  Tipo_Incidencia: 'apuntesVolcados',
  ApuntesVolcados: number,
  ultimaCarga: Date
}

export interface MovimientosVolcados extends IncidenciaBase {
  Tipo_Incidencia: 'movimientosVolcados',
  MovimientosVolcados: number,
  ultimaCarga: Date
}

export interface SaldosN43 extends IncidenciaBase {
  Tipo_Incidencia: 'saldosN43',
  id: number,
  numeroCuenta: string,
  descripcion: string,
  fecha?: Date,
  saldoInicial: number,
  saldoFinal: number
}

export type incidencia = AsientosModificados | SaldosDescuadrados | ConciliacionesDescuadradas | LineasConciliadasDistintasEmpresas | ConciliacionAutomatica | ApuntesVolcados | MovimientosVolcados | SaldosN43;

export type incidenciasAgrupadas = {
  Tipo_Incidencia: tipoIncidencia,
  Empresa: string,
  NUM_CTA_BANCARIA: string,
  nombreGrupo: string,
  count: number,
  ultimaCarga?: Date,
  diferencia?: number,
};