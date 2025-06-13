'use client'
import MenuPage from "@/components/ui/menu/menu-page";
import { guardarConExpiracion } from "@/lib/hooks/use-guardar-localStorage-expiracion";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

export default function Page() {

  return (
    <div>
      
      <MenuPage />

    </div>
  )
}
