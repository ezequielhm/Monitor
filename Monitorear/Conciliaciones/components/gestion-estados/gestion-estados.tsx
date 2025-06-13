'use client'
import { useState, useEffect } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useStore } from '@/lib/store';
import { Status } from '@/lib/definitions';
import TableEstados from './table-estados';
import ColorPickerModal from './color-picker-modal';
import EstadoFormModal from './añadir-estado-modal';
import { fetchInsertEstado } from '@/lib/actions/insertar-estado-nuevo';
import { fetchUpdateColor } from '@/lib/actions/actualizar-color-estado';

const GestionEstadosComponent = () => {
  const [data, setData] = useState<Status[]>([]);
  const { estadosApuntes, estadosMovimientos } = useStore(state => ({ estadosApuntes: state.estadosApuntes, estadosMovimientos: state.estadosMovimientos }));
  const [isOpenColorPicker, setIsOpenColorPicker] = useState(false);
  const [isOpenFormModal, setIsOpenFormModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('#ffffff');
  const [currentRow, setCurrentRow] = useState<number | null>(null);

  useEffect(() => {
    const loadEstados = async () => {
      try {
        const combinedData = [...estadosMovimientos, ...estadosApuntes];
        setData(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadEstados();
  }, [estadosApuntes, estadosMovimientos]);

  const openColorPicker = (id: string) => {  // Recibir id en lugar de index
    const rowIndex = data.findIndex((status) => status.id === id); // Buscar el índice basado en el id
    setCurrentRow(rowIndex); // Guardar el índice encontrado
    setSelectedColor(data[rowIndex].color); // Obtener el color del estado basado en el índice
    setIsOpenColorPicker(true); // Abrir el selector de color
  };


  const handleColorChange = async (newColor: string) => {
    if (currentRow !== null) {
      const updatedData = [...data];
      updatedData[currentRow].color = newColor;
      setData(updatedData);
      setSelectedColor(newColor);

      try {
        const estadoId = updatedData[currentRow].id;
        console.log('Actualizando color en la base de datos...', estadoId, newColor);
        await fetchUpdateColor(estadoId, newColor);
        console.log('Color actualizado exitosamente');
      } catch (error) {
        console.error('Error al actualizar el color:', error);
      }
    }
  };

  const closeColorPickerModal = () => {
    setIsOpenColorPicker(false);
    setCurrentRow(null); // Resetear la fila seleccionada usando el id
    setSelectedColor('#ffffff'); // Resetear el color seleccionado
  }; 

  const openFormModal = () => {
    setIsOpenFormModal(true);
  };

  const closeFormModal = () => {
    setIsOpenFormModal(false);
  };

  const handleSaveEstado = async (newEstado: { descripcion: string; color: string; tipo: string; deshabilitado: boolean; }) => {
    const lastId = data.length > 0 ? Math.max(...data.map(estado => parseInt(estado.id, 10))) : 0;
    const newId = (lastId + 1).toString();

    const estadoConId: Status = {
      id: newId,
      ...newEstado,
    };

    try {
      await fetchInsertEstado(newId, estadoConId.color, estadoConId.descripcion, estadoConId.tipo, estadoConId.deshabilitado);
      setData(prevData => [...prevData, estadoConId]);
      closeFormModal();
    } catch (error) {
      console.error('Error al guardar el estado:', error);
    }
  };

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gray-100">
      <Box className="container p-4 pb-0 bg-white rounded-md shadow-md flex flex-col items-center">
        <TableEstados
          data={data}
          openColorPicker={openColorPicker}
        />
        <ColorPickerModal
          isOpen={isOpenColorPicker}
          onClose={closeColorPickerModal}
          selectedColor={selectedColor}
          handleColorChange={handleColorChange}
        />
        <EstadoFormModal
          isOpen={isOpenFormModal}
          onClose={closeFormModal}
          onSave={handleSaveEstado}
          handleColorChange={handleColorChange}
        />
        <Button colorScheme="green" my={2} onClick={openFormModal}>
          +
        </Button>
      </Box>
    </Box>
  );
}

export default GestionEstadosComponent;
