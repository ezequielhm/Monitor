'use client';

import { gestionCuentasStore } from "@/lib/store/store-gestion-cuentas";
import { fetchConciliarCuentasCero } from "@/lib/actions/action-conciliacion-cuentas-cero";
import clsx from "clsx";
import { useStore } from "@/lib/store";
import { fetchConciliacionAutomaticaManual } from "@/lib/actions/action-conciliacion-automatica-manual";

function BotonConciliar() {
  const {
    selectedRowsApuntesIzquierda,
    selectedRowsApuntesDerecha,
    setSelectedRowsApuntesIzquierda,
    setselectedRowsApuntesDerecha,
    importeTotalApuntesIzquierda,
    importeTotalApuntesDerecha,
    datosFormulario,
  } = gestionCuentasStore((state) => ({
    selectedRowsApuntesIzquierda: state.selectedRowsApuntesIzquierda,
    selectedRowsApuntesDerecha: state.selectedRowsApuntesDerecha,
    setSelectedRowsApuntesIzquierda: state.setSelectedRowsApuntesIzquierda,
    setselectedRowsApuntesDerecha: state.setSelectedRowsApuntesDerecha,
    importeTotalApuntesIzquierda: state.importeTotalApuntesIzquierda,
    importeTotalApuntesDerecha: state.importeTotalApuntesDerecha,
    datosFormulario: state.datosFormulario,
  }));

  const userdata = useStore(state => state.userData)
  const filtros = gestionCuentasStore.getState().filtrosGestionCuentas;

  const ambosSonCero =
    importeTotalApuntesIzquierda === 0 &&
    importeTotalApuntesDerecha === 0 &&
    selectedRowsApuntesIzquierda.length === 0 &&
    selectedRowsApuntesDerecha.length === 0;

  const iguales = importeTotalApuntesIzquierda === importeTotalApuntesDerecha;
  const botonDeshabilitado = !iguales || ambosSonCero;

  const handleClick = async () => {
    try {
      const apuntesSeleccionados = [
        ...selectedRowsApuntesIzquierda,
        ...selectedRowsApuntesDerecha,
      ];

      const apuntes = apuntesSeleccionados.map((a: any) => ({
        idApunte: a.id,
        fecha: new Date(a.fecha),
        importe: a.importe,
        claveImporte: a.clave_importe,
      }));

      const payload = {
        empresa1: datosFormulario.empresa1,
        empresa2: datosFormulario.empresa2,
        cuenta1: datosFormulario.cuenta1,
        cuenta2: datosFormulario.cuenta2,
        importe: importeTotalApuntesIzquierda,
        usuario: userdata.user.usuario,
        apuntes,
      };

      const res = await fetchConciliarCuentasCero(payload);

      if (filtros) {
        await gestionCuentasStore.getState().setListadoApuntes(
          filtros.empresa1,
          filtros.cuenta1,
          filtros.empresa2,
          filtros.cuenta2,
          filtros.fechaInicio,
          filtros.fechaFin,
          filtros.regConciliados
        );
      }

      setSelectedRowsApuntesIzquierda([]);
      setselectedRowsApuntesDerecha([]);
      // alert(`Conciliación realizada con éxito. ID: ${res.id_conciliacion}`);
    } catch (error) {
      alert('Error al conciliar. Revisa consola.');
      console.error('Error en conciliación:', error);
    }
  };

  const handleConciliar = async () => {
    try {
        const res = await fetchConciliacionAutomaticaManual(
            datosFormulario.empresa1,
            datosFormulario.empresa2,
            datosFormulario.cuenta1,
            datosFormulario.cuenta2
        );
        console.log('Conciliación automática:', res);

        // Verificar si la respuesta contiene la clave "respuesta" para éxito
        if (res && res.respuesta) {
            alert(res.respuesta); // Mostrar el mensaje de éxito
            if (filtros) {
              await gestionCuentasStore.getState().setListadoApuntes(
                filtros.empresa1,
                filtros.cuenta1,
                filtros.empresa2,
                filtros.cuenta2,
                filtros.fechaInicio,
                filtros.fechaFin,
                filtros.regConciliados
              );
            }
        } else if (res && res.error) {
            // Manejar errores devueltos por la API
            alert(`Error en la conciliación automática: ${res.error}`);
        } else {
            alert('Error desconocido en la conciliación automática. Revisa consola.');
        }
    } catch (error) {
        alert('Error al realizar la conciliación automática. Revisa consola.');
        console.error('Error en conciliación automática:', error);
    }
};

return (
    <>
      <div className="text-lg justify-end text-white rounded-md bg-red-500 pt-2 px-2 mx-2 transition-colors duration-300">
        Diferencia:{" "}
        {(() => {
          const diferencia = importeTotalApuntesIzquierda - importeTotalApuntesDerecha;
          const isNegative = diferencia < 0;
          const absDiferencia = Math.abs(diferencia);
          const prefix = isNegative ? "H" : "D";

          return `${new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
          }).format(absDiferencia)} ${prefix}`;
        })()}
      </div>
      <button
        onClick={handleClick}
        disabled={botonDeshabilitado}
        className={clsx(
          "m-0 w-fit rounded-md px-10 py-2 text-lg font-medium transition-colors mr-48 duration-300",
          {
            "text-gray-200 bg-gray-500 hover:bg-gray-600 cursor-not-allowed":
              botonDeshabilitado,
            "text-gray-200 bg-green-500 hover:bg-green-600":
              !botonDeshabilitado,
          }
        )}
      >
        Conciliar
      </button>
      <button onClick={handleConciliar} className="m-0 w-fit rounded-md px-10 py-2 text-lg font-medium bg-red-500 text-gray-200">
        Conciliacion Automatica
      </button>
    </>
  );
}

export default BotonConciliar;
