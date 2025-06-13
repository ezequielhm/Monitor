import React, { useState, useRef, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, Box } from '@chakra-ui/react';
import ColorPicker from '@/lib/color-picker'; // Importa el nuevo componente
import { getTextColor } from '@/lib/color-utils';

interface EstadoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newEstado: { descripcion: string; color: string; tipo: string; deshabilitado: boolean; }) => void;
  handleColorChange: (color: string) => void;
}

const EstadoFormModal: React.FC<EstadoFormModalProps> =  ({ isOpen, onClose, onSave, handleColorChange }) => {
  const [descripcion, setDescripcion] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [inputValue, setInputValue] = useState('#ffffff');
  const [tipo, setTipo] = useState('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Restablecer el estado del color y otros estados al abrir el modal
      setDescripcion('');
      setColor('#ffffff');
      setInputValue('#ffffff');
      setTipo('');
    }
  }, [isOpen]);

  const handleSave = () => {
    const newEstado = { descripcion, color, tipo, deshabilitado: true };
    onSave(newEstado);
    onClose();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setInputValue(newColor);

    // Validar que el nuevo color sea un hexadecimal válido antes de aplicar el cambio
    if (/^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
      setColor(newColor);  // Actualiza el color en el estado
      handleColorChange(newColor);  // Propaga el cambio
    }
  };

  const isFormValid = descripcion.trim() !== '' && color.trim() !== '' && tipo !== '';

  const textColorClass = getTextColor(color);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Insertar Nuevo Estado</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            mb={4}
            isRequired
          />
          <Box mb={4}>
            <ColorPicker color={color} onChange={(newColor) => {
              setColor(newColor);
              setInputValue(newColor);
              handleColorChange(newColor);
            }} />
            <Input
              placeholder="Color (ej. #FF5733)"
              value={inputValue.toUpperCase()}
              onChange={handleInputChange}
              className={`p-2 rounded ${textColorClass}`}
              style={{ backgroundColor: color }}
              maxLength={7} // Limitar el input a 7 caracteres
              mt={2}
              isRequired
            />
          </Box>
          <Select
            placeholder="Seleccionar tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            isRequired
          >
            <option value="A">Apunte</option>
            <option value="M">Movimiento</option>
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave} isDisabled={!isFormValid}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EstadoFormModal;
