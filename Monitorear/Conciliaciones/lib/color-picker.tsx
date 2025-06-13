import React, { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [internalColor, setInternalColor] = useState<string>(color);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInternalColor(color);
  }, [color]);

  const handlePickerChange = (newColor: string) => {
    setInternalColor(newColor);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      onChange(newColor);
    }, 300); // Debounce de 300ms para actualizar el color
  };

  return <HexColorPicker color={internalColor} onChange={handlePickerChange} />;
};

export default ColorPicker;
