import { create } from 'zustand';
import { FiltrosGestionCuentas, gestionCuentas } from '../definitions/gestion-cuentas-definitions';
import { fetchListaCuentas } from '../actions/action-lista-cuentas';
import { fetchListadoApuntes } from '../actions/action-lista-apuntes';
import { IdentifiedColumnDef } from '@tanstack/react-table';
import { fetchListaApuntesEditar } from '../actions/action-lista-apuntes-editar';

export type Apunte = {
  id_conciliacion?: number;
  empresa: string;
  cuentam: string;
  cuentap: string;
  fecha: Date;  // Changed from string to Date for consistency
  id: string;
  descripcion: string;
  importe: number;
  clave_importe: string;
  debeHaber?: string; // Added to match export requirements
  referencia?: string; // Optional field for additional info
  comentario?: string; // Optional field for additional info
}

interface GestionCuentasStore {
  selectedRowsApuntesIzquierda: any;
  selectedRowsApuntesDerecha: any;
  listaCuentas: gestionCuentas[];
  setListaCuentas: () => void;
  datosFormulario: gestionCuentas;
  setDatosFormulario: (datos: gestionCuentas) => void;
  apuntesCuentasCeroIzquierda: Apunte[];
  apuntesCuentasCeroDerecha: Apunte[];
  apuntesIzquierda: Apunte[];
  apuntesDerecha: Apunte[];
  importeTotalApuntesIzquierda: number;
  importeTotalApuntesDerecha: number;
  listaIdSelIzquierda: any;
  listaIdSelDerecha: any;
  setListadoApuntesCuentasCero: (
    idConciliacion: number,
    empresa1: string,
    empresa2: string,
    cuenta1: string,
    cuenta2: string,
  ) => Promise<void>;
  setImporteTotalApuntesIzquierda: (importeTotal: number) => void;
  setImporteTotalApuntesDerecha: (importeTotal: number) => void;
  setSelectedRowsApuntesIzquierda: (selectedRows: any) => void;
  setSelectedRowsApuntesDerecha: (selectedRows: any) => void;
  setListaIdSelIzquierda: (listaIdSel: any) => void;
  setListaIdSelDerecha: (listaIdSel: any) => void;
  setListadoApuntes: (
    empresa1: string,
    cuenta1: string,
    empresa2: string,
    cuenta2: string,
    fechaInicio: Date,
    fechaFin: Date,
    conciliado: string
  ) => Promise<void>;
  setListado: (listadoIzquierda: any, listadoDerecha: any) => void;
  filtrosGestionCuentas: FiltrosGestionCuentas | null;
  setFiltrosGestionCuentas: (params: FiltrosGestionCuentas) => void;
}

export const gestionCuentasStore = create<GestionCuentasStore>((set, get) => ({
  selectedRowsApuntesIzquierda: [],
  selectedRowsApuntesDerecha: [],
  setSelectedRowsApuntesIzquierda: (selectedRows: any) => set({ selectedRowsApuntesIzquierda: selectedRows }),
  setSelectedRowsApuntesDerecha: (selectedRows: any) => set({ selectedRowsApuntesDerecha: selectedRows }),
  listaCuentas: [],
  setListaCuentas: async () => {
    const result = await fetchListaCuentas();
    set({ listaCuentas: result });
  },
  datosFormulario: {} as gestionCuentas,
  setDatosFormulario: (datos) => set({ datosFormulario: datos }),
  apuntesIzquierda: [],
  apuntesDerecha: [],
  setListadoApuntes: async (empresa1, cuenta1, empresa2, cuenta2, fechaInicio, fechaFin, conciliado) => {
    const result = await fetchListadoApuntes(empresa1, cuenta1, empresa2, cuenta2, fechaInicio, fechaFin, conciliado);
    set({
      apuntesIzquierda: result.apuntesIzquierda,
      apuntesDerecha: result.apuntesDerecha,
    });
  },
  apuntesCuentasCeroIzquierda: [],
  apuntesCuentasCeroDerecha: [],
  setListadoApuntesCuentasCero: async (idConciliacion, empresa1, empresa2, cuenta1, cuenta2) => {
    const result = await fetchListaApuntesEditar(idConciliacion, empresa1, empresa2, cuenta1, cuenta2);

    set({
      apuntesCuentasCeroDerecha: result.tablaDerecha,
      apuntesCuentasCeroIzquierda: result.tablaIzquierda,
    });
  },
  setListado: (listadoIzquierda: any, listadoDerecha: any) => set({ apuntesIzquierda: listadoIzquierda, apuntesDerecha: listadoDerecha }),
  importeTotalApuntesIzquierda: 0,
  importeTotalApuntesDerecha: 0,
  setImporteTotalApuntesIzquierda: (importeTotal: number) => set({ importeTotalApuntesIzquierda: importeTotal }),
  setImporteTotalApuntesDerecha: (importeTotal: number) => set({ importeTotalApuntesDerecha: importeTotal }),
  listaIdSelIzquierda: [],
  listaIdSelDerecha: [],
  setListaIdSelIzquierda: (listaIdSel: any) => set({ listaIdSelIzquierda: listaIdSel }),
  setListaIdSelDerecha: (listaIdSel: any) => set({ listaIdSelDerecha: listaIdSel }),
  filtrosGestionCuentas: null,
  setFiltrosGestionCuentas: (params) => set({ filtrosGestionCuentas: params }),
}));
