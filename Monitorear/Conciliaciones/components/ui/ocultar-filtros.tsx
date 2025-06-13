'use client';

import React, { useState } from 'react';

const OcultarFiltro = ({ children }: { children: any }) => {
  const [isFiltroVisible, setIsFiltroVisible] = useState(true);

  const toggleMenu = () => {
    setIsFiltroVisible(!isFiltroVisible);
  };

  return (
    <div className="flex items-center w-full">
      <button onClick={toggleMenu} className="rounded-full mr-2">
        {isFiltroVisible ? '▲' : '▼'}
      </button>
      <div className={`flex-1 ${!isFiltroVisible ? 'hidden' : ''}`}>
        {children}
      </div>
    </div>
  );
};


export default OcultarFiltro;
