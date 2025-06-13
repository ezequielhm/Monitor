export type Empresa = {
  COD_EMP_CONTABLE: string;
  COD_EMPRESA: string;
  NOMBRE_EMP_CONTABLE: string;
};
export type ProductoBancario = {
  COD_PROD_BANCARIO: number;
  PROD_BANCARIO: string;
  numeroCuenta: string;
  CTA_CONTABLE: string;
  SUBCTA_CONTABLE: string;
  NUM_CTA_BANCARIA: string;
};
export type User = {
  usuario: string;
  nombre: string;
  apellido: string;
  email: string;
  puesto: string;
}

export type Movimiento = {
  ID: number;
  fechaOperacion: string;
  IMPORTE: number;
  claveDebeHaber: string;
}

export type  Apunte = {
  ID: string;
  FECHA: string;
  IMPORTE: number;
  CLAVE_IMPORTE: string;
}

export interface Status {
  id: string;
  color: string;
  descripcion: string;
  tipo: string;
  deshabilitado: boolean;
}

export interface TablaSinResultados {
  apuntes: boolean,
  bancos: boolean
}

export type ApunteContable = {
  ID: string,
  FECHA: Date,
  EMPRESA: string,
  REF_APUNTE: string,
  REF_APUNTE_LINEA: number,
  REF_ASI: string,
  DESCRI_ASI: string,
  impString: string,
  IMPORTE: number,
  CLAVE_IMPORTE: string,
  IMP_DEBE: number,
  IMP_HABER: number,
  COD_PROD_BANCARIO: number,
  COD_EMPRESA: string,
  ENTIDAD_FINANCIERA: number,
  TIPO_PROD_BANCARIO: number,
  NUM_CTA_BANCARIA: string,
  CTA_CONTABLE: string,
  SUBCTA_CONTABLE: string,
  Estado: string,
  Comentario: string,
  Usuario: string,
  FechaEfectiva: Date
}

export type MovimientoBancario = {
  ID: number,
  fechaOperacion:Date,
  fechaValor: Date,
  info_1:string,
  info_2:string,
  info_3_4: string,
  info_5:string,
  impString: string,
  IMPORTE: number,
  claveDebeHaber: string,
  descripcionTipoMovimiento: string,
  claveEntidad: string,
  claveOficina: string,
  numeroCuenta: string,
  Estado: string,
  Comentario: string,
  Usuario: string,
  Excluir: string,
  FechaEfectiva: Date
}

export type apuntesConciliadosType = {
  ID: number,
  ID_CONCILIACION: number,
  ID_Apuntes: string,
  IMPORTE: number | string,
  FechaApunte: string,
  Empresa: string,
  DebeHaber: string,
  CLAVE_IMPORTE: string,
  COD_PROD_BANCARIO: number,
  DESCRI_ASI: string
}

export type movimientosConciliadosType = {
  ID: number,
  ID_CONCILIACION: number,
  ID_Movimiento: number,
  IMPORTE: number | string,
  FechaMovimiento: string,
  claveDebeHaber: string,
  Empresa: string,
  CuentaBanc: string,
  info_1:string,
  info_2:string,
  info_3_4: string,
  info_5:string,
}

export type todosApuntesType = {
  ID: number,
  ID_CONCILIACION: number,
  ID_Apuntes: string,
  IMPORTE: number | string,
  FECHA: string,
  EMPRESA: string,
  DebeHaber: string,
  Editar: string,
  DESCRI_ASI:string 
}

export type todosMovimientosType = {
  ID: number,
  ID_CONCILIACION: number,
  fechaOperacion: string,
  info_1:string,
  info_2:string,
  info_3_4: string,
  info_5:string,
  IMPORTE: number | string,
  claveDebeHaber: string,
  CuentaBanc: string,
  Excluir: string,
  Editar: string
}

export type saldosApuntes = {
  Saldo_Inicial:number, 
  IMPORTE_MOVIMIENTOS_SIN_CONCILIAR:number, 
  EMPRESA:number,
}

export type saldosMovimientos = {
  SALDO: number,
  importe: number,
  saldoFinal: number, 
  IMPORTE_APUNTE_SIN_CONCILIAR:number,
  fechaFinal: Date | string, 
}

export type datosRecargarRevision = {
  id: number,
  empresa: string,
  codProductoBancario: string
  numeroCuenta: string,
}

export type permisosUsuario ={
  Login:string,
  COD_EMP_CONTABLE:string,
  COD_EMPRESA:string,
  NOMBRE_EMP_CONTABLE:string,
  Permiso:string
}
export type permisosGrupos ={
  GrupoAD:string,
  Area:string,
  Permiso:string,
  EmpContable: string,
}