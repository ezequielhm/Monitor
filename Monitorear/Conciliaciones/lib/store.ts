import { create } from 'zustand';
import { fetchProductoBancario } from '@/lib/actions/producto-bancario-actions';
import { fetchFechaInicio  } from '@/lib/actions/fecha-inicio-empresa-actions';
import { User, ApunteContable, apuntesConciliadosType, MovimientoBancario, ProductoBancario, movimientosConciliadosType, TablaSinResultados, 
        Status, saldosApuntes, saldosMovimientos, todosApuntesType, todosMovimientosType, permisosGrupos, permisosUsuario} from '@/lib/definitions';
import { incidencia } from '@/lib/definitions/incidencia-definition';
import { fetchApuntesContables } from '@/lib/actions/apuntes-contables';
import { fetchMovimientosBancarios } from '@/lib/actions/movimientos-bancarios';
import { fetchApuntesConciliados } from '@/lib/actions/apuntes-conciliados';
import { fetchMovimientosConciliados } from '@/lib/actions/movimientos-conciliados';
import { fetchApuntesConciliadosByConciliacion } from '@/lib/actions/apuntes-coinciliados-by-conciliacion';
import { fetchMovimientosConciliadosByConciliacion } from '@/lib/actions/movimientos-conciliados-by-conciliacion';
import { fetchApuntesConciliacionHistorica } from '@/lib/actions/apuntes-conciliacion-historica';
import { fetchMovimientosConciliacionHistorica } from '@/lib/actions/movimientos-conciliacion-historica';
import { fetchUserData } from '@/lib/actions/fetch-userdata';
import { Socket, io } from 'socket.io-client';
import { fetchEstadosApuntes } from '@/lib/actions/estados-apuntes';
import { fetchEstadosMovimientos } from '@/lib/actions/estados-movimientos';
import { saldoInicial } from '@/lib/actions/saldo-inicial';
import { fetchTodosApuntes } from '@/lib/actions/todos-apuntes';
import { fetchTodosMovimientos } from '@/lib/actions/todos-movimientos';
import { guardarConExpiracion, obtenerConExpiracion } from '@/lib/hooks/use-guardar-localStorage-expiracion';
import { fetchPermisosGrupo, fetchPermisosUsuario } from './actions/action-permisos';
import { fetchFechaCarga } from './actions/fecha-carga-action';
const socketioURL = process.env.NEXT_PUBLIC_SERVICIO_SOCKETIO_URL;

interface StoreState {
  permisosUsuario: permisosUsuario[],
  permisosGrupos: permisosGrupos[],
  ventanaActual: string,
  isFiltroVisible: boolean,
  empContable: string,
  productosBancarios: ProductoBancario[],
  fechaInicio: string | null,
  numCuenta: string,
  apuntesContables: ApunteContable[],
  apuntesConciliacionHistorica: ApunteContable[],
  apuntesConciliados: apuntesConciliadosType[],
  todosApuntes: todosApuntesType[],
  movimientosConciliados: movimientosConciliadosType[],
  todosMovimientos: todosMovimientosType[],
  movimientosBancarios: MovimientoBancario[],
  movimientosConciliacionHistorica: MovimientoBancario[],
  incidencias: incidencia[],
  recargaIncidenciaSaldoN43: boolean,
  selectedRowsCuentas: any,
  selectedRowsBancos: any,
  importeTotalCuentasSel: number,
  importeTotalBacnSel: number,
  listaIdSelCuentas: any,
  listaIdSelBancos: any,
  concatenatedIds:string[],
  codProductoBancario:number,
  empresaSeleccionada:string,
  regConciliado:string,
  userData: {
    user: User;
    groups: string[];
  };
  estadosApuntes: Status[],
  estadosMovimientos: Status[],
  tablaSinResultados: TablaSinResultados,
  socket: Socket | null;
  cargando: boolean;
  saldos: saldosApuntes;
  empContableSelec: string;
  cuentaSelec: string;
  cuentaBancSelec: string;
  prodBancSelec: ProductoBancario;
  isResolverIncidenciaModalOpen: boolean;
  isDetallesIncidenciaModelOpen: boolean;
  propsIncidenciaDetalle: incidencia[];
  fechaCarga: Date;
  openResolverIncidenciaModal: () => void;
  closeResolverIncidenciaModal: () => void;
  openDetallesIncidenciaModal: () => void;
  closeDetallesIncidenciaModal: () => void;
  setPropsIncidenciaDetalle: (incidencias: incidencia[]) => void;
  setProdBancSelec: (ProductoBancario: ProductoBancario) => void,
  setEmpContableSelec: (empContable:string) => void,
  setCuentaSelec: (cuentaBancaria:string) => void,
  setCuentaBancSelec: (cuenta:string) => void,
  setUserData: () => void,
  setVentanaActual: (ventana: string) => void;
  setIsFiltroVisible: (isVisible: boolean) => void;
  setEmpContable: (newEmpContable: string) => void;
  setProductosBancarios: (newProductoBancario: ProductoBancario[]) => void;
  setFechaInicio: (newFechaInicio: string | null) => void;
  setNumCuenta: (newNumCuenta: string) => void;
  setApuntesContables: (empresa: string, empContable: number, fecha:string) => void;
  setApuntesConciliacionHistorica: (empresa: string, cod_prod_bancario: number, fechaInicio: string, fechaCorte: string) => void;
  setApuntesConciliados: (empresa: string, productoBancario: number, fechaInicio: string, fechaFin?: string) => void;
  setTodosApuntes: (empresa: string, productoBancario: number, fechaInicio: string, fechaFin?: string) => void;
  // byConciliacion -> de una única conciliacion - para editar
  setApuntesConciliadosByConciliacion: (id_conciliacion: number) => void;
  setMovimientosConciliadosByConciliacion: (id_conciliacion: number) => void;
  setMovimientosConciliados: (numeroCuenta: string, empresa: string, fechaInicio:string, fechaFin?: string) => void;
  setTodosMovimientos: (numeroCuenta: string, fechaInicio: string, fechaFin?: string) => void;
  setMovimientosBancarios: ( numeroCuenta: string, fechaInicio:string) => void;
  setMovimientosConciliacionHistorica: (numeroCuenta: string, fechaInicio: string, fechaCorte: string) => void;
  setIncidencias: (incidencias: incidencia[]) => void,
  setRecargaIncidenciaSaldoN43: (recarga: boolean) => void,
  setSelectedRowsCuentas: ( selectedRows: any) => void;
  setSelectedRowsBancos: ( selectedRows: MovimientoBancario[] | movimientosConciliadosType[]) => void;
  setImporteTotalCuentasSel: (importeTotal: number) => void;
  setImporteTotalBacnSel: (importeTotal: number) => void;
  setListaIdSelCuentas: (listaIdSel: any) => void;
  setListaIdSelBancos: (listaIdSel: MovimientoBancario[] | movimientosConciliadosType[]) => void;
  setCodProductoBancario: (codsProductos:number) => void;
  setEmpresaSeleccionada: (EmpSelec:string) => void;
  setRegConciliado: (regConciliado:string) => void;
  setSocket: (socket: Socket) => void;
  setEstadosApuntes: () => void;
  setEstadosMovimientos: () => void;
  setCargando: (carga: boolean) => void;
  setSaldos: (EMP_CONTABLE: string, cuenta_bancaria: string) => void;
  setPermisos: (login:string) => void;
  setFechaCarga:(productoBancario: number) => void;
  clearData: () => void;
}

export const asignarTablaVacia = (nombreTabla: string, isTablaVacia:boolean) => {
  nombreTabla === 'apuntes' ?
    useStore.setState((state) => ({
      tablaSinResultados: {
        apuntes: isTablaVacia,
        bancos: state.tablaSinResultados.bancos
      }
    }))
                            :
    useStore.setState((state) => ({
      tablaSinResultados: {
        apuntes: state.tablaSinResultados.apuntes,
        bancos: isTablaVacia,
      }
    }))
}

export const useStore = create<StoreState>((set, get) => ({
  permisosUsuario: [],
  permisosGrupos: [],
  ventanaActual:'conciliacionWorksheet',
  isFiltroVisible: true,
  empContable: '',
  productosBancarios: [],
  fechaInicio: null,
  numCuenta: '',
  apuntesContables: [],
  apuntesConciliacionHistorica: [],
  apuntesConciliados: [],
  todosApuntes: [],
  movimientosConciliados: [],
  todosMovimientos: [],
  movimientosBancarios: [],
  movimientosConciliacionHistorica: [],
  incidencias: [],
  recargaIncidenciaSaldoN43: false,
  selectedRowsCuentas: [],
  selectedRowsBancos: [],
  importeTotalCuentasSel: 0,
  importeTotalBacnSel: 0,
  listaIdSelCuentas: [],
  listaIdSelBancos: [],
  codProductoBancario: 0,
  empresaSeleccionada: '',
  regConciliado: '',
  tablaSinResultados: {apuntes: false, bancos: false},
  userData: { 
    user: {
      usuario: '',
      nombre: '',
      apellido: '',
      email: '',
      puesto: ''
    },
    groups: []
  },
  prodBancSelec:{
    COD_PROD_BANCARIO: 0,
    PROD_BANCARIO: '',
    numeroCuenta: '',
    CTA_CONTABLE: '',
    SUBCTA_CONTABLE: '',
    NUM_CTA_BANCARIA: '',
  },
  estadosApuntes: [],
  estadosMovimientos: [],
  socket: null,
  cargando: false,
  saldos: {           Saldo_Inicial: 0 , 
    IMPORTE_MOVIMIENTOS_SIN_CONCILIAR:0, 
    EMPRESA:0,},
  empContableSelec: '',
  cuentaSelec: '',
  cuentaBancSelec: '',
  isResolverIncidenciaModalOpen: false,
  isDetallesIncidenciaModelOpen: false,
  propsIncidenciaDetalle: [],
  fechaCarga: new Date(),

  openResolverIncidenciaModal: () => set({ isResolverIncidenciaModalOpen: true }),
  closeResolverIncidenciaModal: () => set({ isResolverIncidenciaModalOpen: false }),
  openDetallesIncidenciaModal: () => set({ isDetallesIncidenciaModelOpen: true }),
  closeDetallesIncidenciaModal: () => set({ isDetallesIncidenciaModelOpen: false }),
  setPropsIncidenciaDetalle: (incidencias: incidencia[]) => set({ propsIncidenciaDetalle: incidencias }),
  setProdBancSelec: (ProductoBancario: ProductoBancario) => set({ prodBancSelec: ProductoBancario }),
  setEmpContableSelec: (empContable: string) => set({ empContableSelec: empContable }),
  setCuentaBancSelec: (cuenta: string) => set({ cuentaBancSelec: cuenta }),
  setCuentaSelec: (cuentaBancaria: string) => set({ cuentaSelec: cuentaBancaria }),
  setEmpresaSeleccionada: (empSelec: string) => set({ empresaSeleccionada: empSelec }),
  setListaIdSelCuentas: (listaIdSel: ApunteContable[] | apuntesConciliadosType[]) => set({ listaIdSelCuentas: listaIdSel }),
  setListaIdSelBancos: (listaIdSel: MovimientoBancario[] | movimientosConciliadosType[]) => set({ listaIdSelBancos: listaIdSel }),
  setCodProductoBancario: (codsProductos: number) => set({ codProductoBancario: codsProductos }),
  setVentanaActual: (ventana: string) => set({ ventanaActual: ventana }),
  setIsFiltroVisible: (isVisible: boolean) => set({ isFiltroVisible: isVisible }),
  setEmpContable: async (newEmpContable: string) => {
    set({ empContable: newEmpContable });
    const response: ProductoBancario[] = await fetchProductoBancario(newEmpContable);
    set({ productosBancarios: response });
    const responseDate: string | null = await fetchFechaInicio(newEmpContable);
    set({ fechaInicio: responseDate ?? '' });  // Asignar una cadena vacía si responseDate es null
  },
  setProductosBancarios: (newProductoBancario: ProductoBancario[]) => set({ productosBancarios: newProductoBancario }),
  
  setFechaInicio: async (newFechaInicio: string | null) => {
    if (newFechaInicio) {
        const responseDate: string | null = await fetchFechaInicio(newFechaInicio);
        set({ fechaInicio: responseDate ?? '' });  // Asignar una cadena vacía si responseDate es null
    } else {
        set({ fechaInicio: '' });  // Handle the case where newFechaInicio is null
    }
  },
  
  setNumCuenta: (newNumCuenta: string) => set({ numCuenta: newNumCuenta }),
  setSelectedRowsCuentas: (selectedRows: ApunteContable[] | apuntesConciliadosType[]) => set({ selectedRowsCuentas: selectedRows }),
  setSelectedRowsBancos: (selectedRows: MovimientoBancario[] | movimientosConciliadosType[]) => set({ selectedRowsBancos: selectedRows }),
  setImporteTotalCuentasSel: (importeTotal: number) => set({ importeTotalCuentasSel: importeTotal }),
  setImporteTotalBacnSel: (importeTotal: number) => set({ importeTotalBacnSel: importeTotal }),
  setApuntesContables: async (empContable: string, productoBancario: number, fechaInicio: string) => {
    const response: ApunteContable[] = await fetchApuntesContables(empContable, productoBancario, fechaInicio);
    set({ apuntesContables: response });
  },
  setApuntesConciliacionHistorica: async (empresa: string, cod_prod_bancario: number, fechaInicio: string, fechaCorte: string) => {
    const response: ApunteContable[] = await fetchApuntesConciliacionHistorica(empresa, cod_prod_bancario, fechaInicio, fechaCorte);
    set({ apuntesConciliacionHistorica: response });
  },
  setApuntesConciliados: async (empresa: string, productoBancario: number, fechaInicio: string, fechaFin?: string) => {
    const response: apuntesConciliadosType[] = await fetchApuntesConciliados(empresa, productoBancario, fechaInicio, fechaFin);
    set({ apuntesConciliados: response });
  },
  setTodosApuntes: async (empresa: string, productoBancario: number, fechaInicio: string, fechaFin?: string) => {
    const response: todosApuntesType[] = await fetchTodosApuntes(empresa, productoBancario, fechaInicio, fechaFin);
    set({ todosApuntes: response });
  },
  setApuntesConciliadosByConciliacion: async (id_conciliacion:number) => {
    const response: apuntesConciliadosType[] = await fetchApuntesConciliadosByConciliacion(id_conciliacion);
    set({ apuntesConciliados: response });
  },
  setMovimientosConciliados: async (numeroCuenta: string, empresa: string, fechaInicio: string, fechaFin?: string) => {
    const response: movimientosConciliadosType[] = await fetchMovimientosConciliados(numeroCuenta, empresa, fechaInicio, fechaFin);
    set({ movimientosConciliados: response });
  },
  setTodosMovimientos: async (numeroCuenta: string, fechaInicio: string, fechaFin?: string) => {
    const response: todosMovimientosType[] = await fetchTodosMovimientos(numeroCuenta, fechaInicio, fechaFin);
    set({ todosMovimientos: response });
  },
  setMovimientosConciliadosByConciliacion: async (idConciliacion:number) => {
    const response: movimientosConciliadosType[] = await fetchMovimientosConciliadosByConciliacion(idConciliacion);
    set({ movimientosConciliados: response });
  },
  setMovimientosBancarios: async (numeroCuenta: string, fechaInicio:string) => {
    const response: MovimientoBancario[] = await fetchMovimientosBancarios(numeroCuenta, fechaInicio);
    set({ movimientosBancarios: response });
  },
  setMovimientosConciliacionHistorica: async (numeroCuenta: string, fechaInicio: string, fechaCorte: string) => {
    const response: MovimientoBancario[] = await fetchMovimientosConciliacionHistorica(numeroCuenta, fechaInicio, fechaCorte);
    set({ movimientosConciliacionHistorica: response });
  },
  setIncidencias: (incidencias: incidencia[]) => set({ incidencias }),
  setRecargaIncidenciaSaldoN43: (recarga: boolean) => set({ recargaIncidenciaSaldoN43: recarga }),
  concatenatedIds: [],
  setRegConciliado: (regConc: string) => set({ regConciliado: regConc }),
  setUserData: async () => {
    try {
      const data = await fetchUserData(); // Realiza el fetch
      set({ userData: data }); // Almacena el objeto JSON en userData
    } catch (error) {
      console.error("Error fetching user data:", error);
      set({ 
        userData: { 
          user: {
            usuario: '',
            nombre: '',
            apellido: '',
            email: '',
            puesto: ''
          },
          groups: []
        } 
      }); // Opción: manejar el error poniendo userData como null
    }
  },
  setSocket: (socket) => set({ socket }),
  setEstadosApuntes: async () => {
    const response: Status[] = await fetchEstadosApuntes();
    set({ estadosApuntes: response });
  },
  setEstadosMovimientos: async () => {
    const response: Status[] = await fetchEstadosMovimientos();
    set({ estadosMovimientos: response });
  },
  setCargando: (carga: boolean) => set({ cargando: carga }),
  setSaldos: async (EMP_CONTABLE, cuenta_bancaria) => {
    const response: saldosApuntes = await saldoInicial(EMP_CONTABLE, cuenta_bancaria);
    set({ saldos: response})
  },
  setPermisos:async(login: string)=>{
    const responseUsu: permisosUsuario[] = await fetchPermisosUsuario(login);
    const responseGrup: permisosGrupos[] = await fetchPermisosGrupo();

    set({permisosUsuario: responseUsu})
    set({permisosGrupos: responseGrup})
  },
  setFechaCarga: async (productoBancario) => {
    const result = await fetchFechaCarga(productoBancario);
    
    // Asegúrate de extraer la propiedad FECHA_ACTUALIZACION del objeto result
    const fechaActualizacion = result?.FECHA_ACTUALIZACION;
  
    // Intenta convertir FECHA_ACTUALIZACION a una fecha
    const fecha = new Date(fechaActualizacion);
  
    if (!isNaN(fecha.getTime())) {  // Verifica que sea una fecha válida
      set({ fechaCarga: fecha });
    } else {
      console.error("La fecha recibida no es válida:", result);
    }
  },  
  clearData: () => {
    console.log('Limpiando los estados...'); // Debug: para verificar que se llama a la función
    set({
      apuntesContables: [],
      apuntesConciliacionHistorica: [],
      apuntesConciliados: [],
      todosApuntes: [],
      movimientosConciliados: [],
      todosMovimientos: [],
      movimientosBancarios: [],
      movimientosConciliacionHistorica: [],
    });
  },
  
}));

// Inicializa el socket cuando se carga el store
const socket = io(`${socketioURL}`, {
  transports: ['websocket'], // Fuerza el uso de WebSockets
  withCredentials: true
});
useStore.getState().setSocket(socket);