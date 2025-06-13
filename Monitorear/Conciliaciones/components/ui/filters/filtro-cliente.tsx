'use client'
import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Empresa, ProductoBancario } from '@/lib/definitions';
import OcultarFiltro from '@/components/ui/ocultar-filtros';
import Image from 'next/image';
import ExportButton from '@/components/exportacion/boton-exportar';
import { saldoStore } from '@/lib/store/store-saldos';
import { gestionCuentasStore } from '@/lib/store/store-gestion-cuentas';
import { gestionCuentas } from '@/lib/definitions/gestion-cuentas-definitions';

interface FiltroClienteProps {
  empresas: { COD_EMP_CONTABLE: string; COD_EMPRESA: string; NOMBRE_EMP_CONTABLE: string }[];
  estados: { color: string; descripcion: string }[];
  onSearch: () => void;
}

type ErroresFiltro = {
  empContable?: string | null;
  prodBancario?: string | null;
  fechaInicio?: string | null;
  fechaCorte?: string | null;
};

interface FiltersState {
  empContable: string;
  prodBancario: ProductoBancario;
  fechaInicio: string;
  fechaFin: string;
  fechaCorte: string;
  estado: string;
  regConciliados: string;
}

// Función que retorna el primer día del mes actual en formato YYYY-MM-DD
const getDefaultFechaInicio = () => {
  const today = new Date();
  const fechaInicio = new Date(today.getFullYear(), 0, 1); // 1 de enero del año actual
  return fechaInicio.toLocaleDateString('en-CA'); // Formato 'YYYY-MM-DD'
};

const getDefaultFechaFin = () => {
  const today = new Date();
  const fechaFin = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return fechaFin.toLocaleDateString('en-CA'); // formato YYYY-MM-DD
};

const defaultProdBancario = {
  COD_PROD_BANCARIO: 0,
  PROD_BANCARIO: '*',
  numeroCuenta: '*',
  CTA_CONTABLE: '*',
  SUBCTA_CONTABLE: '*',
  NUM_CTA_BANCARIA: '*',
};

interface CuentasCeroFiltersState {
  empresa: string;
  cuenta: string;
  cuentaTerceros: string;
  fechaInicio: string;
  fechaFin: string;
  regConciliados: string;
}

type ErroresCuentasCero = {
  empresa?: string;
  cuenta?: string;
  fechaInicio?: string;
  fechaFin?: string;
};

const FiltroCliente: React.FC<FiltroClienteProps> = ({ empresas, estados, onSearch }) => {
  const permisosUsuario = useStore((state) => state.permisosUsuario);
  const ventanaActual = useStore((state) => state.ventanaActual);

  const empresasFiltradas = empresas.filter(empresa => {
    const permiso = permisosUsuario.find(p => p.COD_EMP_CONTABLE === empresa.COD_EMP_CONTABLE);
    return permiso && (
      (permiso.Permiso !== 'Operativo' &&
        (ventanaActual === 'conciliacionWorksheet' || ventanaActual === 'conciliacionRevisar')) ||
      permiso.Permiso === 'Operativo'
    );
  });

  // Estado para modo original: ahora la fecha inicio es el primer día del mes y fecha fin es el último día del mes.
  const [filters, setFilters] = useState<FiltersState>({
    empContable: '',
    prodBancario: defaultProdBancario,
    fechaInicio: getDefaultFechaInicio(),
    fechaFin: getDefaultFechaFin(),
    fechaCorte: '',
    estado: '',
    regConciliados: 'S',
  });

  const [selectedEmpresaIndex, setSelectedEmpresaIndex] = useState<number>(-1);
  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const [search, setSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errores, setErrores] = useState<ErroresFiltro>({});

  // Store hooks para modo original
  const empContable = useStore((state) => state.empContable);
  const setEmpContable = useStore((state) => state.setEmpContable);
  const productosBancarios: ProductoBancario[] = useStore((state) => state.productosBancarios);
  const setApuntesContables = useStore((state) => state.setApuntesContables);
  const setMovimientosBancarios = useStore((state) => state.setMovimientosBancarios);
  const setNumCuenta = useStore((state) => state.setNumCuenta);
  const setCodProductoBancario = useStore((state) => state.setCodProductoBancario);
  const setEmpresaSeleccionada = useStore((state) => state.setEmpresaSeleccionada);
  const setApuntesConciliados = useStore((state) => state.setApuntesConciliados);
  const fechaInicioStore = useStore((state) => state.fechaInicio);
  const setFechaInicioStore = useStore((state) => state.setFechaInicio);
  const setImporteTotalBacnSel = useStore((state) => state.setImporteTotalBacnSel);
  const setImporteTotalCuentasSel = useStore((state) => state.setImporteTotalCuentasSel);
  const setImporteTotalApuntesDerecha = gestionCuentasStore(state => state.setImporteTotalApuntesDerecha);
  const setImporteTotalApuntesIzquierda = gestionCuentasStore(state => state.setImporteTotalApuntesIzquierda);
  const setMovimientosConciliados = useStore((state) => state.setMovimientosConciliados);
  const setApuntesConciliacionHistorica = useStore((state) => state.setApuntesConciliacionHistorica);
  const setMovimientosConciliacionHistorica = useStore((state) => state.setMovimientosConciliacionHistorica);
  const setRegConciliado = useStore((state) => state.setRegConciliado);
  const userData = useStore((state) => state.userData);
  const apuntesContables = useStore((state) => state.apuntesContables);
  const movimientosBancarios = useStore((state) => state.movimientosBancarios);
  const apuntesIzquierda = gestionCuentasStore(state => state.apuntesIzquierda);
  const apuntesDerecha = gestionCuentasStore(state => state.apuntesDerecha);
  const apuntesConciliados = useStore((state) => state.apuntesConciliados);
  const movimientosConciliados = useStore((state) => state.movimientosConciliados);
  const setTodosApuntes = useStore((state) => state.setTodosApuntes);
  const setTodosMovimientos = useStore((state) => state.setTodosMovimientos);
  const setCargando = useStore(state => state.setCargando);
  const cargando = useStore(state => state.cargando);
  const setEmpContableSelec = useStore(state => state.setEmpContableSelec);
  const empContableSelec = useStore(state => state.empContableSelec);
  const setCuentaSelec = useStore(state => state.setCuentaSelec);
  const cuentaSelec = useStore(state => state.cuentaSelec);
  const setCuentaBancSelec = useStore(state => state.setCuentaBancSelec);
  const cuentaBancSelec = useStore(state => state.cuentaBancSelec);
  const setProdBancSelec = useStore(state => state.setProdBancSelec);
  const setSaldoApunte = saldoStore(state => state.setSaldoApunte);
  const setSaldoMovimiento = saldoStore(state => state.setSaldoMovimiento);
  const setFechaCarga = useStore(state => state.setFechaCarga);
  const apuntesConciliacionHistorica = useStore((state) => state.apuntesConciliacionHistorica);
  const movimientosConciliacionHistorica = useStore((state) => state.movimientosConciliacionHistorica);
  const setSaldoCuentasCero = saldoStore(state => state.setSaldoCuentasCero);

  // Estado para modo "CuentasCero": también se actualizan las fechas por defecto.
  const [cuentasCeroFilters, setCuentasCeroFilters] = useState<CuentasCeroFiltersState>({
    empresa: '',
    cuenta: '',
    cuentaTerceros: '',
    fechaInicio: getDefaultFechaInicio(),
    fechaFin: getDefaultFechaFin(),
    regConciliados: 'N',
  });
  const [erroresCuentasCero, setErroresCuentasCero] = useState<ErroresCuentasCero>({});

  const { listaCuentas, setListaCuentas, setDatosFormulario } = gestionCuentasStore();

  useEffect(() => {
    if (ventanaActual.includes("CuentasCero") && (listaCuentas?.length ?? 0) === 0) {
      setListaCuentas();
    }
  }, [ventanaActual, listaCuentas?.length, setListaCuentas]);

  // Cargar filtros desde localStorage al montar el componente
  useEffect(() => {
    let isMounted = true;

    // Cargar filtros generales
    const savedFilters = localStorage.getItem('filters');
    if (savedFilters && isMounted) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setEmpContable(parsedFilters.empContable);
        setFilters(parsedFilters);
      } catch (error) {
        console.error('Error loading filters from localStorage:', error);
      }
    }

    // Cargar filtros de CuentasCero
    const savedCuentasCeroFilters = localStorage.getItem('cuentasCeroFilters');
    if (savedCuentasCeroFilters && isMounted) {
      try {
        const parsedCuentasCeroFilters = JSON.parse(savedCuentasCeroFilters);
        setCuentasCeroFilters(parsedCuentasCeroFilters);
      } catch (error) {
        console.error('Error loading cuentasCeroFilters from localStorage:', error);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setImporteTotalBacnSel(0);
    setImporteTotalCuentasSel(0);
    setImporteTotalApuntesIzquierda(0);
    setImporteTotalApuntesDerecha(0);
    useStore.getState().clearData();
    saldoStore.getState().clearSaldos();
    const { name, value } = e.target;
    let newFilters: FiltersState;
    if (name === 'prodBancario') {
      const selectedProduct = productosBancarios.find(p => p.COD_PROD_BANCARIO === Number(value)) || defaultProdBancario;
      newFilters = { ...filters, [name]: selectedProduct };
    } else {
      newFilters = {
        ...filters,
        [name]: value,
        ...(name === 'empContable' && { prodBancario: defaultProdBancario })
      };
    }
    localStorage.setItem('filters', JSON.stringify(newFilters));
    if (name === 'empContable') {
      const index = empresas.findIndex(empresa => empresa.COD_EMP_CONTABLE === value);
      setSelectedEmpresaIndex(index);
      setEmpContable(value || '');
    }
    setFilters(newFilters);
  };

  const handleCuentasCeroChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setCuentasCeroFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setCargando(true);
    try {
      if (ventanaActual.includes("CuentasCero")) {
        const nuevosErrores: ErroresCuentasCero = {};
        if (!cuentasCeroFilters.empresa) nuevosErrores.empresa = 'Falta por rellenar la empresa';
        if (!cuentasCeroFilters.cuenta) nuevosErrores.cuenta = 'Falta por rellenar la cuenta';
        if (!cuentasCeroFilters.cuentaTerceros) nuevosErrores.cuenta = 'Falta por rellenar la cuenta de terceros';
        if (!cuentasCeroFilters.fechaInicio) nuevosErrores.fechaInicio = 'Falta por rellenar la fecha inicio';
        if (!cuentasCeroFilters.fechaFin) nuevosErrores.fechaFin = 'Falta por rellenar la fecha fin';
        if (Object.keys(nuevosErrores).length > 0) {
          setErroresCuentasCero(nuevosErrores);
          return;
        }

        // Buscamos el objeto seleccionado en el listado de cuentas
        const cuentaSeleccionada = listaCuentas.find(
          item => item.empresa1 === cuentasCeroFilters.empresa && item.cuenta1 === cuentasCeroFilters.cuenta && item.empresa2 === cuentasCeroFilters.cuentaTerceros
        );

        // Extraemos empresa2 y cuenta2, en caso de existir
        const empresa2 = cuentaSeleccionada?.empresa2 || '';
        const cuenta2 = cuentaSeleccionada?.cuenta2 || '';

        localStorage.setItem('filterCuentaCero', JSON.stringify(cuentaSeleccionada));
        
        if (cuentaSeleccionada) {
          setSaldoCuentasCero(cuentaSeleccionada.empresa1, cuentaSeleccionada.empresa2, cuentaSeleccionada.cuenta1, cuentaSeleccionada.cuenta2);
        }
        
        // Actualizamos el formulario en el store con los datos completos
        setDatosFormulario({
          id: cuentaSeleccionada?.id || 0,
          empresa1: cuentasCeroFilters.empresa,
          cuenta1: cuentasCeroFilters.cuenta,
          empresa2: cuentasCeroFilters.cuentaTerceros,  // Asignamos la empresa2 seleccionada
          cuenta2,   // Asignamos la cuenta2 seleccionada
          usuario: userData?.user.usuario || '',
          activo: true,
          tercero: false,
          tercero1: '',
          tercero2: '',
          fechaInicio: new Date(cuentasCeroFilters.fechaInicio),
        });

        // Llamamos al método que realiza el fetch y almacena los apuntes en el store
        await gestionCuentasStore.getState().setListadoApuntes(
          cuentasCeroFilters.empresa,                   // empresa1
          cuentasCeroFilters.cuenta,                    // cuenta1
          cuentasCeroFilters.cuentaTerceros,            // empresa2 extraída del listado
          cuenta2,                                      // cuenta2 extraída del listado
          new Date(cuentasCeroFilters.fechaInicio),     // fechaInicio
          new Date(cuentasCeroFilters.fechaFin),         // fechaFin
          cuentasCeroFilters.regConciliados
        );

        gestionCuentasStore.getState().setFiltrosGestionCuentas({
          empresa1: cuentasCeroFilters.empresa,
          cuenta1: cuentasCeroFilters.cuenta,
          empresa2: cuentasCeroFilters.cuentaTerceros,
          cuenta2,
          fechaInicio: new Date(cuentasCeroFilters.fechaInicio),
          fechaFin: new Date(cuentasCeroFilters.fechaFin),
          regConciliados: cuentasCeroFilters.regConciliados,
        });

        onSearch();
      } else {
        setFechaCarga(filters.prodBancario.COD_PROD_BANCARIO);
        setRegConciliado(filters.regConciliados);
        const empresaSeleccionada = selectedEmpresaIndex !== -1 ? empresas[selectedEmpresaIndex].COD_EMPRESA : '';
        setEmpresaSeleccionada(empresaSeleccionada);
        if (filters.empContable && filters.prodBancario.COD_PROD_BANCARIO !== 0 && filters.fechaInicio && (ventanaActual !== 'conciliacionHistorica' || filters.fechaCorte)) {
          setCodProductoBancario(filters.prodBancario.COD_PROD_BANCARIO);
          await setSaldoApunte(
            filters.empContable,
            filters.prodBancario.SUBCTA_CONTABLE,
            filters.prodBancario.numeroCuenta,
            filters.prodBancario.COD_PROD_BANCARIO,
            fechaInicioStore || '',
            filters.fechaCorte,
            ventanaActual
          );
          await setSaldoMovimiento(
            filters.empContable,
            filters.prodBancario.SUBCTA_CONTABLE,
            filters.prodBancario.numeroCuenta,
            filters.prodBancario.COD_PROD_BANCARIO,
            fechaInicioStore || '',
            filters.fechaCorte,
            ventanaActual
          );
          if (ventanaActual !== 'conciliacionRevisar' && ventanaActual !== 'conciliacionHistorica') {
            await setApuntesContables(filters.empContable, filters.prodBancario.COD_PROD_BANCARIO, fechaInicioStore ?? '');
            await setMovimientosBancarios(filters.prodBancario.numeroCuenta, fechaInicioStore ?? '');
          }
          if (ventanaActual === 'conciliacionRevisar') {
            if (filters.regConciliados === 'N') {
              await setApuntesContables(filters.empContable, filters.prodBancario.COD_PROD_BANCARIO, fechaInicioStore ?? '');
              await setMovimientosBancarios(filters.prodBancario.numeroCuenta, fechaInicioStore ?? '');
            }
            if (filters.regConciliados === 'S') {
              await setApuntesConciliados(filters.empContable, filters.prodBancario.COD_PROD_BANCARIO, filters.fechaInicio, filters.fechaFin);
              await setMovimientosConciliados(filters.prodBancario.numeroCuenta, filters.empContable, filters.fechaInicio, filters.fechaFin);
            }
            if (filters.regConciliados === '*') {
              await setTodosApuntes(filters.empContable, filters.prodBancario.COD_PROD_BANCARIO, filters.fechaInicio, filters.fechaFin);
              await setTodosMovimientos(filters.prodBancario.numeroCuenta, filters.fechaInicio, filters.fechaFin);
            }
          }
          if (ventanaActual === 'conciliacionHistorica') {
            await setApuntesConciliacionHistorica(filters.empContable, filters.prodBancario.COD_PROD_BANCARIO, fechaInicioStore ?? '', filters.fechaCorte ?? '');
            await setMovimientosConciliacionHistorica(filters.prodBancario.numeroCuenta, fechaInicioStore ?? '', filters.fechaCorte ?? '');
          }
          setNumCuenta(filters.prodBancario.numeroCuenta);

          const indexEmpresa = empresas.find(empresa => empresa.COD_EMP_CONTABLE === filters.empContable);
          if (indexEmpresa) {
            setEmpContableSelec(indexEmpresa.NOMBRE_EMP_CONTABLE);
          }

          setCuentaSelec(`${filters.prodBancario.CTA_CONTABLE}-${filters.prodBancario.SUBCTA_CONTABLE}`);
          setCuentaBancSelec(filters.prodBancario.NUM_CTA_BANCARIA);
          setProdBancSelec(filters.prodBancario);

          setErrores({ empContable: '', prodBancario: '', fechaInicio: '', fechaCorte: '' });
          onSearch();
        } else {
          const nuevoError: ErroresFiltro = {
            empContable: !filters.empContable ? 'Falta por rellenar la empresa' : '',
            prodBancario: filters.prodBancario.COD_PROD_BANCARIO === 0 ? 'Falta por rellenar la cuenta bancaria' : '',
            fechaInicio: !filters.fechaInicio ? 'Falta por rellenar la fecha' : '',
            fechaCorte: ventanaActual === 'conciliacionHistorica' && !filters.fechaCorte ? 'Falta por rellenar la fecha de corte' : ''
          };
          setErrores(nuevoError);
        }
      }
    } finally {
      setIsSubmitting(false);
      setCargando(false);
      setSearch(true);
    }
  };

  const uniqueEmpresas = ventanaActual.includes("CuentasCero")
    ? Array.from(new Set(listaCuentas.map(item => item.empresa1))).sort()
    : [];
  const cuentasOptions = ventanaActual.includes("CuentasCero") && cuentasCeroFilters.empresa
    ? Array.from(new Set(listaCuentas
      .filter(item => item.empresa1 === cuentasCeroFilters.empresa)
      .map(item => item.cuenta1)
    )).sort()
    : [];

  return (
    <OcultarFiltro>
      <form className="relative w-full rounded-t bg-white p-2 shadow-lg " onSubmit={handleSubmit}>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center">
            <Image
              src="/logohuertas.png"
              alt="logohuertas"
              width={150}
              height={100}
              priority
            />
            <p className="ml-2 text-sm font-medium">{userData?.user.usuario}</p>
          </div>
        </div>
        {ventanaActual.includes("CuentasCero") ? (
          <div className="grid w-full gap-2 rounded-b mt-4">
            {/* Primera fila: 4 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {/* Empresa */}
              <div className="flex flex-col">
                <label className="mb-1 text-xs">Empresa</label>
                <select
                  name="empresa"
                  value={cuentasCeroFilters.empresa}
                  onChange={handleCuentasCeroChange}
                  className="mt-1 rounded-md border-gray-300 text-xs shadow-md focus:border-red-500 focus:ring-red-500">
                  <option value="">Seleccione empresa...</option>
                  {uniqueEmpresas.map((empresa) => (
                    <option key={empresa} value={empresa}>
                      {empresa}
                    </option>
                  ))}
                </select>
                {erroresCuentasCero.empresa && (
                  <p className="text-red-500 text-xs mt-1">{erroresCuentasCero.empresa}</p>
                )}
              </div>
              {/* Cuenta */}
              <div className="flex flex-col">
                <label className="mb-1 text-xs">Cuenta</label>
                <select
                  name="cuenta"
                  value={cuentasCeroFilters.cuenta}
                  onChange={handleCuentasCeroChange}
                  disabled={!cuentasCeroFilters.empresa}
                  className="mt-1 rounded-md border-gray-300 text-xs shadow-md focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">Seleccione cuenta...</option>
                  {cuentasOptions.map((cuenta) => (
                    <option key={cuenta} value={cuenta}>
                      {cuenta}
                    </option>
                  ))}
                </select>
                {erroresCuentasCero.cuenta && (
                  <p className="text-red-500 text-xs mt-1">{erroresCuentasCero.cuenta}</p>
                )}
              </div>
              {/* Cuenta Terceros */}
              <div className="flex flex-col">
                <label className="mb-1 text-xs">Cuenta Terceros</label>
                <select
                  name="cuentaTerceros"
                  value={cuentasCeroFilters.cuentaTerceros}
                  onChange={handleCuentasCeroChange}
                  disabled={!cuentasCeroFilters.empresa}
                  className="mt-1 rounded-md border-gray-300 text-xs shadow-md focus:border-red-500 focus:ring-red-500">
                  <option value="">Seleccione cuenta de terceros...</option>
                  {cuentasCeroFilters.empresa &&
                    Array.from(new Set(
                      listaCuentas
                        .filter(item => item.empresa1 === cuentasCeroFilters.empresa && item.cuenta1 === cuentasCeroFilters.cuenta)
                        .map(item => item.empresa2)
                    )).sort().map((empresa2) => (
                      <option key={empresa2} value={empresa2}>
                        {empresa2}
                      </option>
                    ))}
                </select>
                {erroresCuentasCero.cuenta && (
                  <p className="text-red-500 text-xs mt-1">{erroresCuentasCero.cuenta}</p>
                )}
              </div>
            </div>
            {/* Segunda fila: Fechas y botón */}
            <div className="flex items-end space-x-2">
              {/* Fecha Inicio */}
              <div className="flex flex-col">
                <label className="mb-1 text-xs">Fecha Inicio</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={cuentasCeroFilters.fechaInicio}
                  onChange={handleCuentasCeroChange}
                  className="rounded-md border-gray-300 text-xs shadow-md focus:border-red-500 focus:ring-red-500"
                />
              </div>
              {/* Fecha Fin */}
              <div className="flex flex-col">
                <label className="mb-1 text-xs">Fecha Fin</label>
                <input
                  type="date"
                  name="fechaFin"
                  value={cuentasCeroFilters.fechaFin}
                  onChange={handleCuentasCeroChange}
                  className="rounded-md border-gray-300 text-xs shadow-md focus:border-red-500 focus:ring-red-500"
                />
              </div>
              {ventanaActual === 'RevisarCuentasCero' && (
                  <div className="flex flex-col w-fit">
                    <label className="mb-1 text-xs">Registros conciliados</label>
                    <select
                      className="mt-1 rounded-md border-gray-300 text-xs shadow-md focus:border-red-500 focus:ring-red-500"
                      name="regConciliados"
                      value={cuentasCeroFilters.regConciliados}
                      onChange={handleCuentasCeroChange}
                    >
                      <option value="*">TODOS</option>
                      <option value="S">SI</option>
                      <option value="N">NO</option>
                    </select>
                  </div>
                )}
            </div>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 items-end gap-2 rounded-b md:grid-cols-3 mt-4">
            {!ventanaActual.includes("CuentasCero") && (
              <>
                <div className="flex flex-col">
                  <label className="mb-1 text-xs">Empresa</label>
                  <select
                    className="mt-1 rounded-md border-gray-300 text-xs shadow-md focus:border-red-500 focus:ring-red-500"
                    name="empContable"
                    value={filters.empContable}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione empresa...</option>
                    {empresasFiltradas.map((empresa) => (
                      <option key={empresa.COD_EMP_CONTABLE} value={empresa.COD_EMP_CONTABLE}>
                        {empresa.NOMBRE_EMP_CONTABLE}
                      </option>
                    ))}
                  </select>
                  {errores.empContable && <p className="text-red-500 text-xs mt-1">{errores.empContable}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-xs">Cuenta Bancaria</label>
                  <select
                    disabled={!filters.empContable}
                    className="mt-1 rounded-md border-gray-300 text-xs shadow-md focus:border-red-500 focus:ring-red-500"
                    name="prodBancario"
                    value={filters.prodBancario.COD_PROD_BANCARIO}
                    onChange={handleChange}
                  >
                    <option value={0}>Seleccione cuenta...</option>
                    {productosBancarios.map((prodbancario) => (
                      <option key={prodbancario.COD_PROD_BANCARIO} value={prodbancario.COD_PROD_BANCARIO}>
                        {prodbancario.PROD_BANCARIO}
                      </option>
                    ))}
                  </select>
                  {errores.prodBancario && <p className="text-red-500 text-xs mt-1">{errores.prodBancario}</p>}
                </div>
                {ventanaActual === 'conciliacionRevisar' && (
                  <div className="flex flex-col w-fit">
                    <label className="mb-1 text-xs">Registros conciliados</label>
                    <select
                      className="mt-1 rounded-md border-gray-300 text-xs shadow-md focus:border-red-500 focus:ring-red-500"
                      name="regConciliados"
                      value={filters.regConciliados}
                      onChange={handleChange}
                    >
                      <option value="*">TODOS</option>
                      <option value="S">SI</option>
                      <option value="N">NO</option>
                    </select>
                  </div>
                )}
                {(filters.regConciliados === 'S' || filters.regConciliados === '*') &&
                  ventanaActual === 'conciliacionRevisar' && (
                    <div className="flex space-x-4">
                      <div className="flex flex-col">
                        <label className="mb-1 text-xs">Fecha Inicio</label>
                        <input
                          type="date"
                          name="fechaInicio"
                          value={filters.fechaInicio}
                          onChange={handleChange}
                          className="mt-1 rounded-md border-gray-300 text-xs shadow-md focus:border-red-500 focus:ring-red-500"
                        />
                        {errores.fechaInicio && <p className="text-red-500 text-xs mt-1">{errores.fechaInicio}</p>}
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-xs">Fecha Fin</label>
                        <input
                          type="date"
                          name="fechaFin"
                          value={filters.fechaFin}
                          onChange={handleChange}
                          className="mt-1 rounded-md border-gray-300 text-xs shadow-md focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  )}
                {ventanaActual === 'conciliacionHistorica' && (
                  <div className="flex space-x-4">
                    <div className="flex flex-col">
                      <label className="mb-1 text-xs">Fecha de Corte</label>
                      <input
                        type="date"
                        name="fechaCorte"
                        value={filters.fechaCorte}
                        onChange={handleChange}
                        className="mt-1 rounded-md border-gray-300 text-xs shadow-md focus:border-red-500 focus:ring-red-500"
                      />
                      {errores.fechaCorte && <p className="text-red-500 text-xs mt-1">{errores.fechaCorte}</p>}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <div className="absolute bottom-2 right-2 flex space-x-4">
          <button
            type="submit"
            className={`w-24 rounded-md bg-red-500 px-5 py-2 text-xs text-white shadow-md hover:bg-red-600 ${cargando ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={cargando}
          >
            {cargando ? 'Cargando...' : 'Buscar'}
          </button>
          {ventanaActual.includes("CuentasCero") ? (
            <ExportButton
              ventanaActual={ventanaActual}
              isCuentasCero={true}
              apuntesContables={apuntesIzquierda}
              movimientosBancarios={apuntesDerecha}
              empContableSelec={cuentasCeroFilters.empresa}
              cuentaSelec={cuentasCeroFilters.cuenta}
              cuentaBancSelec={cuentasCeroFilters.cuentaTerceros}
            />
          ) : (
            ventanaActual !== 'conciliacionHistorica' ? (
              <ExportButton
                ventanaActual={ventanaActual}
                isCuentasCero={false}
                apuntesContables={apuntesContables}
                movimientosBancarios={movimientosBancarios.filter(movimiento => movimiento.Excluir === '0')}
                apuntesConciliados={apuntesConciliados}
                movimientosConciliados={movimientosConciliados}
                empContableSelec={empContableSelec}
                cuentaSelec={cuentaSelec}
                cuentaBancSelec={cuentaBancSelec}
                regConciliados={filters.regConciliados}
                busquedaRealizada={search}

              />
            ) : (
              <ExportButton
                ventanaActual={ventanaActual}
                isCuentasCero={false}
                apuntesContables={apuntesConciliacionHistorica}
                movimientosBancarios={movimientosConciliacionHistorica}
                apuntesConciliados={apuntesConciliados}
                movimientosConciliados={movimientosConciliados}
                empContableSelec={empContableSelec}
                cuentaSelec={cuentaSelec}
                cuentaBancSelec={cuentaBancSelec}
                regConciliados={filters.regConciliados}
                busquedaRealizada={search}

              />
            )
          )}
        </div>
      </form>
    </OcultarFiltro>
  );
};

export default FiltroCliente;
