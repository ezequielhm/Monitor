'use client'
import { useStore } from "@/lib/store"
import { MouseEventHandler, useEffect } from "react";
import { useRouter } from 'next/navigation';
import clsx from "clsx";

interface Boton {
  onAction: (value: string) => void;
}

export function Boton({ estilo, children, handleFunction }: {
  estilo: string,
  children: string,
  handleFunction: MouseEventHandler
}) {
  return (
    <button
      className={`rounded-3xl py-2 px-10 mx-1 text-white font-bold ${estilo}`}
      onClick={handleFunction}
    >
      {children}
    </button>
  )
}

export function BotonConciliar() {
  const setVentanaActual = useStore((state) => state.setVentanaActual);
  const ventanaActual = useStore((state) => state.ventanaActual);

  return (
    <Boton
      estilo={clsx({
        'bg-[#D33333]': ventanaActual === 'conciliacionCuentasCero',
        'bg-[#8E8E8E]': ventanaActual !== 'conciliacionCuentasCero'
      })}
      handleFunction={() => setVentanaActual('conciliacionCuentasCero')}
    >
      Conciliar
    </Boton>
  );
}

export function BotonWorksheet() {
  const setVentanaActual = useStore((state) => state.setVentanaActual);
  const ventanaActual = useStore((state) => state.ventanaActual);
  return (
    <Boton
      estilo={clsx({
        'bg-[#D33333]': ventanaActual === 'WorksheetCuentasCero',
        'bg-[#8E8E8E]': ventanaActual !== 'WorksheetCuentasCero'
      })}
      handleFunction={() => setVentanaActual('WorksheetCuentasCero')}
    >
      Hoja de Trabajo
    </Boton>
  );
}
export function BotonRevision() {
  const setVentanaActual = useStore((state) => state.setVentanaActual);
  const ventanaActual = useStore((state) => state.ventanaActual);
  return (
    <Boton
      estilo={clsx({
        'bg-[#D33333]': ventanaActual === 'RevisarCuentasCero',
        'bg-[#8E8E8E]': ventanaActual !== 'RevisarCuentasCero'
      })}
      handleFunction={() => setVentanaActual('RevisarCuentasCero')}
    >
      Revision
    </Boton>
  );
}

export default function BotonesConciliaciones() {
  const ventanaActual = useStore((state) => state.ventanaActual);
  const router = useRouter();

  useEffect(() => {
    if (ventanaActual === 'WorksheetCuentasCero') {
      router.push('/worksheet-cuentas');
    }else if (ventanaActual === 'conciliacionCuentasCero') {
      router.push('/conciliacion-cuentas');
    }else if (ventanaActual === 'RevisarCuentasCero') {
      router.push('/revision-cuentas');
    }
  }, [ventanaActual, router]);

  return (
    <div className='flex sm:w-[40%] justify-center 3xl:w-auto'>
      <BotonConciliar />
      <BotonWorksheet />
      <BotonRevision />
    </div>
  )
}
