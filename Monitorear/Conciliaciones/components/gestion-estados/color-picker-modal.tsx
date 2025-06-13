import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Box, Input } from '@chakra-ui/react';
import ColorPicker from '@/lib/color-picker'; // Importa el nuevo componente
import { getTextColor } from '@/lib/color-utils';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColor: string;
  handleColorChange: (color: string) => void;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ isOpen, onClose, selectedColor, handleColorChange }) => {
  const [inputValue, setInputValue] = useState<string>(selectedColor);

  useEffect(() => {
    setInputValue(selectedColor);
  }, [selectedColor]);

  const textColorClass = getTextColor(selectedColor);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setInputValue(newColor);

    // Validar que el nuevo color sea un hexadecimal válido antes de aplicar el cambio
    if (/^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
      handleColorChange(newColor);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Seleccionar Color</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ColorPicker color={selectedColor} onChange={handleColorChange} />
          <Box className="mt-4">
            <Input
              value={inputValue.toUpperCase()}
              onChange={handleInputChange}
              className={`p-2 rounded ${textColorClass}`}
              style={{ backgroundColor: selectedColor }}
              maxLength={7} // Limitar el input a 7 caracteres (# + 6 dígitos hexadecimales)
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ColorPickerModal;
