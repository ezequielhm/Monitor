import * as XLSX from 'xlsx';
import moment from 'moment';

type Header = {
    key: string;        // Nombre del campo de origen de la lista
    title: string;      // Título que aparecerá en la columna del Excel.
};

/* Función para exportar en Excel 2 listas de elementos.

    Llamada a la función con los tipos definidos y listas de datos:
    export2ListToExcel(docName, sheetName, title, subtitle1, subtitle2, headersType1, headersType2, list1, list2);

    docName: Nombre del documento
    sheetName: Nombre de la hoja
    title: Título en la hoja
    subtitle1: título de la tabla 1
    subtitle2: título de la tabla 2
    headersType1 (): Nombre y contenido  de las Columnas de la lista 1
    headersType2 (): Nombre y contenido de las Columnas de la lista 2
    list1: Lista 1
    list2: Lista 2
*/

export const export2ListToExcel = <T1, T2>(
    docName: string,
    sheetName: string,
    title: string,
    subtitle1: string,
    subtitle2: string,
    headers1: Header[],
    headers2: Header[],
    list1: T1[],
    list2: T2[]
) => {
    // Crear una hoja de cálculo a partir de los datos JSON
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    // Añadir título
    XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: 'A1' });

    // Añadir subtítulo para la primera tabla
    XLSX.utils.sheet_add_aoa(worksheet, [[subtitle1]], { origin: 'A2' });

    // Extraer y añadir encabezados de list1
    const headersKey1 = headers1.map(header => header.key);
    const headersTitle1 = headers1.map(header => header.title);
    XLSX.utils.sheet_add_aoa(worksheet, [headersTitle1], { origin: 'A3' });

   // Añadir datos de list2
   const data1 = list1.map(item => headersKey1.map(key => (item as any)[key])); // Cast to any to access dynamic key
   XLSX.utils.sheet_add_aoa(worksheet, data1, {  origin: 'A4'  });

    // Añadir subtítulo para la segunda tabla
    const startCol = headersKey1.length + 1; // Columna de inicio para list2 (después de una columna en blanco)
    const startRowTable2 = 2; // Calcula la fila de inicio para la segunda tabla
    XLSX.utils.sheet_add_aoa(worksheet, [[subtitle2]], { origin: XLSX.utils.encode_cell({ c: startCol, r: 1 }) });

    // Extraer y añadir encabezados de list2
    const headersKey2 = headers2.map(header => header.key);
    const headersTitle2 = headers2.map(header => header.title);
    XLSX.utils.sheet_add_aoa(worksheet, [headersTitle2], { origin: XLSX.utils.encode_cell({ c: startCol, r: 2 }) });

    // Añadir datos de list2
    const data2 = list2.map(item => headersKey2.map(key => (item as any)[key])); // Cast to any to access dynamic key
    XLSX.utils.sheet_add_aoa(worksheet, data2, { origin: XLSX.utils.encode_cell({ c: startCol, r: 3 }) });

    // Crear el libro de trabajo y agregar la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Descargar el archivo Excel
    XLSX.writeFile(workbook, `${docName}.xlsx`);
};


/* Ejemplo de uso:
const docName = 'Informe';
const sheetName = 'Datos';
const title = 'Informe de Datos Combinados';
const subtitle1 = 'Subtítulo de la Primera Tabla';
const subtitle2 = 'Subtítulo de la Segunda Tabla';
const headersType1: Header[] = [
    { key: 'Fecha', title: 'Fecha' },
    { key: 'ID', title: 'ID' },
    { key: 'Descripcion', title: 'Descripción' },
    { key: 'Importe', title: 'Importe' }
];
const headersType2: Header[] = [
    { key: 'Empresa', title: 'Empresa' },
    { key: 'DH', title: 'D/H' },
    { key: 'Valor', title: 'Valor' }
];
const list1 = [
    { Fecha: '2023-01-01', ID: 1, Descripcion: 'Descripción 1', Importe: 100 },
    { Fecha: '2023-01-02', ID: 2, Descripcion: 'Descripción 2', Importe: 200 },
    { Fecha: '2023-01-03', ID: 2, Descripcion: 'Descripción 3', Importe: 300 },
    { Fecha: '2023-01-04', ID: 2, Descripcion: 'Descripción 4', Importe: 200 },
    { Fecha: '2023-01-05', ID: 2, Descripcion: 'Descripción 5', Importe: 150 },            
];
const list2 = [
    { Empresa: 'Empresa A', DH: 'D', Valor: 300 },
    { Empresa: 'Empresa B', DH: 'H', Valor: 400 },
    { Empresa: 'Empresa C', DH: 'H', Valor: 200 },
    { Empresa: 'Empresa D', DH: 'H', Valor: 400 },
    { Empresa: 'Empresa E', DH: 'H', Valor: 100 },
    { Empresa: 'Empresa F', DH: 'H', Valor: 500 },

];

// Llamada a la función con los tipos definidos y listas de datos
export2ListToExcel(docName, sheetName, title, subtitle1, subtitle2, headersType1, headersType2, list1, list2);

*/