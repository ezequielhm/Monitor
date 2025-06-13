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
        'bg-[#D33333]': ventanaActual === 'conciliacionCruzada',
        'bg-[#8E8E8E]': ventanaActual !== 'conciliacionCruzada'
      })}
      handleFunction={() => setVentanaActual('conciliacionCruzada')}
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
        'bg-[#D33333]': ventanaActual === 'conciliacionWorksheet',
        'bg-[#8E8E8E]': ventanaActual !== 'conciliacionWorksheet'
      })}
      handleFunction={() => setVentanaActual('conciliacionWorksheet')}
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
        'bg-[#D33333]': ventanaActual === 'conciliacionRevisar',
        'bg-[#8E8E8E]': ventanaActual !== 'conciliacionRevisar'
      })}
      handleFunction={() => setVentanaActual('conciliacionRevisar')}
    >
      Revision
    </Boton>
  );
}

export default function BotonesConciliaciones() {
  const ventanaActual = useStore((state) => state.ventanaActual);
  const router = useRouter();

  useEffect(() => {
    if (ventanaActual === 'conciliacionWorksheet') {
      router.push('/worksheet');
    }
    else if (ventanaActual === 'conciliacionCruzada') {
      router.push('/conciliaciones');
    }else if (ventanaActual === 'conciliacionRevisar') {
      router.push('/revision');
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
