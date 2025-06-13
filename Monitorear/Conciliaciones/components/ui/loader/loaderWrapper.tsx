// components/LoaderWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import Loader from '@/components/ui/loader/loader';

interface LoaderWrapperProps {
  children: React.ReactNode;
}

interface LoaderWrapperProps {
    children: React.ReactNode;
  }
  
  const LoaderWrapper = ({ children }: LoaderWrapperProps) => {
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      // Simula una carga completa de la página
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Ajusta el tiempo según tus necesidades
    }, []);
  
    return (
      <>
        {isLoading ? <Loader /> : children}
      </>
    );
  }
  
  export default LoaderWrapper;
