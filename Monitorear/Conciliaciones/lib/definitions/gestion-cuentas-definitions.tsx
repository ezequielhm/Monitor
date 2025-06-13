export type gestionCuentas = {
    id: number;
    empresa1: string;
    cuenta1: string;
    empresa2: string;
    cuenta2: string;
    usuario: string;
    activo: boolean;
    tercero: boolean;
    tercero1: string;
    tercero2: string;
    fechaInicio: Date;
}

export type ApunteConciliable = {
    empresa: string;
    cuentam: string;
    cuentap: string;
    fecha: Date;
    id: string;
    descripcion: string;
    importe: number;
    clave_importe: string;
    check?: boolean;
  };

export type FiltrosGestionCuentas = {
    empresa1: string;
    cuenta1: string;
    empresa2: string;
    cuenta2: string;
    fechaInicio: Date;
    fechaFin: Date;
    regConciliados: string;
  };

export type saldo = {
  empresa: string;
  cuentam: string;
  cuentap: string;
  saldo_inicial: number;
  saldo_no_conciliado: number;
  saldo_final: number;
}