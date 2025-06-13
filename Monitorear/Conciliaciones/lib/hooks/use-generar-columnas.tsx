import { HStack, Box, Checkbox } from '@chakra-ui/react';
import { ColumnDef, CellContext, ColumnFilter, HeaderContext, FilterFn, SortingFn } from '@tanstack/react-table';
import SortIcon from '@/components/worksheet/sort-icon';  // Importa SortIcon
import FilterButton from '@/components/worksheet/filter-button';  // Importa FilterButton
import { Filter } from '@/components/worksheet/filters';
import getSizeBasedOnWidth from './get-size-based-on-width';
import moment from 'moment';
import { useStore } from '../store';
import { JSX } from 'react';

export interface ColumnConfig {
    accessorKey: string;
    nombre?: string;  // Nombre de la columna
    headerContent?: (context: HeaderContext<any, unknown>) => JSX.Element;  // Opción para un header especial
    cellContent?: (context: CellContext<any, unknown>) => JSX.Element;      // Opción para una celda especial
    sortIcon?: boolean;    // Si se incluye o no el SortIcon
    filterIcon?: boolean;  // Si se incluye o no el FilterIcon
    sortingFn?: string | false;  // Función de ordenamiento
    filterFn?: string | false;  // Función de filtrado
    nombreSize: string;  // Nombre para identificar el tamaño de la columna
}

const includesString: FilterFn<any> = (row, columnId, filterValue) => {
    const cellValue = row.getValue(columnId);
    if (Array.isArray(filterValue)) {
        return filterValue.some(value => String(cellValue).toLowerCase().includes(String(value).toLowerCase()));
    }
    return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
};

const sortingFecha: SortingFn<any> = (rowA, rowB, columnId) => {
    const dateA = moment(rowA.getValue<string>(columnId), 'DD/MM/YYYY').toDate();
    const dateB = moment(rowB.getValue<string>(columnId), 'DD/MM/YYYY').toDate();
    return dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
};

const estadoFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId) as { id: string; color: string; description: string } | undefined;
  if (!cellValue) return false;

  const filterValues = Array.isArray(filterValue) ? filterValue : [filterValue];
  return filterValues.map(value => value).includes(cellValue);
};

// Función general para generar columnas basado en la configuración
export function generarColumnas<T>(
  {columnsConfig, // Array de objetos con la configuración de las columnas
  columnFilters,
  setColumnFilters,
  sizeWidth,
  table} : {
    columnsConfig: ColumnConfig[],
    columnFilters: Filter[];
    setColumnFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
    sizeWidth: number,
    table: string,
  }):ColumnDef<T>[] {
  return columnsConfig.map((columnConfig) => {
    const {
      accessorKey,
      nombre,
      headerContent,  // Puede ser función especial o string básico
      cellContent,    // Puede ser función especial o string básico
      sortIcon = true,  // Definir si lleva SortIcon
      filterIcon= true,  // Definir si lleva FilterIcon
      sortingFn = false,  // Si no tiene ordenamiento, será false
      filterFn = false,  // Si no tiene filtro, será false
      nombreSize = ''
    } = columnConfig;
    
    const estados = useStore(state => state.estadosApuntes);

    const sortingImporte: SortingFn<any> = (rowA, rowB, columnId) => {
      return (table.startsWith('apunte')) ?
        rowA.original.IMPORTE > rowB.original.IMPORTE ? 1 : rowA.original.IMPORTE < rowB.original.IMPORTE ? -1 : 0
                                    :
        rowA.original.importe > rowB.original.importe ? 1 : rowA.original.importe < rowB.original.importe ? -1 : 0
    }

    return {
        accessorKey,
        header: headerContent
          ? headerContent  // Si se pasa una función para renderizar un header especial, se utiliza
          : ({ column }: HeaderContext<any, unknown>) => (
              <HStack>
                <Box className='th-titulo'>{nombre}</Box>
                {sortIcon && (
                  <SortIcon
                    isSorted={column.getIsSorted()}
                    isSortedDesc={column.getIsSorted() === 'desc'}
                    onClick={column.getToggleSortingHandler()}
                  />
                )}
                {filterFn && (
                  <FilterButton column={column} columnFilters={columnFilters} setColumnFilters={setColumnFilters} estados_={(table === 'apuntesWorksheet' || table === 'bancosWorksheet') ? estados : []} />
                )}
              </HStack>
            ),
        cell: cellContent
          ? cellContent  // Si se pasa una función para renderizar una celda especial, se utiliza
          : (props: CellContext<any, unknown>) => (
              <p className='text-left'>{props.getValue<string>()}</p>
            ),
        ...(sortingFn ? sortingFn === 'sortingImporte' ? {sortingFn: sortingImporte} :
                        sortingFn === 'sortingFecha' ? {sortingFn: sortingFecha} : {}
                      : {}),  // Si no hay función de ordenado, no se define
        enableColumnFilter: filterIcon,  // Habilita el filtro si lleva SortIcon y FilterButton
        size: getSizeBasedOnWidth(sizeWidth, nombreSize, table),  // Calcula el tamaño basado en el ancho
        ...(filterFn && filterFn === 'includesString' ? {filterFn: includesString} :
                        filterFn === 'estadoFilter' ? {filterFn: estadoFilter} : {}),    // Si no hay función de filtrado, no se define
      };
    });
  };
