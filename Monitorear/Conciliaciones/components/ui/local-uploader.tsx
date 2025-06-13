'use client';

import React, { useEffect, useState } from 'react';
import { PlusOutlined, DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import { Image, Upload, message } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useStore } from '@/lib/store'; // Supongamos que tu socket está en un store
import Loader from '@/components/ui/loader/loader';
import './local-uploader.css';

// Función para leer el archivo como ArrayBuffer
const getArrayBuffer = (file: RcFile): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = (error) => reject(error);
  });

const LocalUploader: React.FC = () => {
  const socket = useStore(state => state.socket); // Obtenemos el socket del store
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<RcFile[]>([]); // Archivos seleccionados
  const [uploading, setUploading] = useState(false);
  const [fileDetected, setFileDetected] = useState<boolean>(false);
  const [importMessages, setImportMessages] = useState<{ fileName: string, message: string, type: string, error: boolean }[]>([]); // Mensajes sincronizados
  const [showLoadingGif, setShowLoadingGif] = useState(false); // Estado para controlar el GIF de carga
  const [expandedErrors, setExpandedErrors] = useState<{ [key: string]: boolean }>({});

  // Manejar la previsualización del archivo
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      const arrayBuffer = await getArrayBuffer(file.originFileObj as RcFile);
      file.preview = URL.createObjectURL(new Blob([arrayBuffer]));
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // Función para enviar el archivo al socket
  const handleFilesUpload = async () => {
    if (!selectedFiles.length) {
      message.error('No hay archivos seleccionados para subir');
      return;
    }

    if (!socket) {
      message.error('El socket no está disponible');
      return;
    }

    setUploading(true);
    setShowLoadingGif(true); // Mostrar GIF de carga

    try {
      // Leer todos los archivos seleccionados y convertirlos en ArrayBuffers
      const filesData = await Promise.all(
        selectedFiles.map(async (file) => ({
          fileName: file.name,
          fileBuffer: await getArrayBuffer(file), // Obtener el ArrayBuffer del archivo
        }))
      );

      // Enviar los archivos al socket
      filesData.forEach((fileData) => {
        socket.emit('upload_files', {
          file: fileData.fileBuffer,
          fileName: fileData.fileName,
        });

        // Actualizar el mensaje de éxito para cada archivo
        setImportMessages((prev) => [
          ...prev.filter((msg) => msg.fileName !== fileData.fileName),
          { fileName: fileData.fileName, message: `Archivo enviado correctamente`, error: false, type: 'enviado' },
        ]);
      });

      message.success('Archivos enviados al socket con éxito');
      setFileList([]);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error al enviar archivos por socket:', error);
      setImportMessages((prev) => [
        ...prev,
        { fileName: 'Error', message: 'Error al enviar archivos', error: true, type: 'error' },
      ]);
    } finally {
      setUploading(false);
    }
  };

  // Manejar el cambio de archivos seleccionados
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const validFiles = newFileList.filter((file) => file.originFileObj && file.originFileObj instanceof File);

    if (validFiles.length) {
      setFileDetected(true); // Activar la detección del archivo

      // Mapear nombres de archivos para detectar duplicados en la lista de nuevos archivos
      const seenFiles: { [key: string]: boolean } = {}; // Para almacenar archivos ya procesados
      const newSelectedFiles: RcFile[] = [];

      const filteredFileList = validFiles.filter((file) => {
        // Comprobar si ya hemos procesado un archivo con el mismo nombre
        if (seenFiles[file.name]) {
          // Si ya se ha visto este archivo, es un duplicado
          message.warning(`El archivo ${file.name} está duplicado y no se añadirá.`);
          return false; // No incluir en la lista de archivos
        }

        // Si no es duplicado, marcar como visto y permitir su inclusión
        seenFiles[file.name] = true;
        newSelectedFiles.push(file.originFileObj as RcFile);

        // Emitir el archivo detectado al socket
        if (socket && file.originFileObj) {
          const fileBuffer = file.originFileObj;
          socket.emit('numero_registros_toServer', {
            fileName: file.name,
            file: fileBuffer,
          });
        }

        return true; // Incluir en la lista de archivos
      });

      // Actualizar el estado de archivos seleccionados y fileList
      setFileList(filteredFileList); // Actualizamos con solo archivos no duplicados
      setSelectedFiles(newSelectedFiles); // Guardar los archivos seleccionados

    } else {
      setFileDetected(false); // No se detectó ningún archivo válido
      setFileList([]); // Limpiar la lista si no se encuentran archivos válidos
      setSelectedFiles([]); // Limpiar archivos seleccionados
      setImportMessages([]); // Limpiar mensajes si no hay archivos válidos
    }
  };

  // Socket listener para detener el GIF cuando se complete la importación
  useEffect(() => {
    if (socket) {
      socket.on('import_acabado_toCliente', (data) => {
        if (data === 1) {
          console.warn('Progreso de importación:');
          console.log('Importación completada');
          setShowLoadingGif(false); // Detener el GIF cuando llega el evento 'import_progress'
        }
      });
    }
  }, [socket]);

  // Socket listener para recibir registros leídos
  useEffect(() => {
    if (socket) {
      socket.on('numero_registros_toCliente', (data) => {
        const { numRegistros, fileName } = data;
        console.log('numeroRegistros llegados: ', numRegistros);

        // Actualizar el mensaje de "leídos correctamente" por archivo
        setImportMessages((prev) => [
          ...prev.filter((msg) => !(msg.fileName === fileName && msg.type === 'leidos')),
          { fileName, message: `${numRegistros} registros leídos correctamente del fichero ${fileName}`, error: false, type: 'leidos' },
        ]);
      });
    }
  }, [socket]);

  // useeffect para mostrar por consola los mensajes de importMessages
  useEffect(() => {
    console.log('importMessages: ', importMessages);
  }, [importMessages]);

  // Socket listener para recibir los mensajes de inserción y errores
  useEffect(() => {
    if (socket) {
      socket.on('import_complete', ({ fileName, numRegistros, errores }) => {
        const newMessages = [
          { fileName, message: `Se han insertado ${numRegistros} registros correctamente del fichero ${fileName}`, error: false, type: 'insertados' },
        ];

        if (errores && errores.length > 0) {
          errores.forEach((error: string) => {
            newMessages.push({ fileName, message: error, error: true, type: 'error' });
          });
        }

        // Actualizar el estado con los nuevos mensajes
        setImportMessages((prev) => [
          ...prev.filter((msg) => !(msg.fileName === fileName && (msg.type === 'insertados' || msg.type === 'error'))),
          ...newMessages,
        ]);
      });
    }
  }, [socket]);

  // Sincronizar mensajes con los archivos dropeados: si se quita un archivo, eliminar el mensaje correspondiente
  useEffect(() => {
    setImportMessages((prev) => prev.filter((msg) => selectedFiles.some((file) => file.name === msg.fileName)));
  }, [selectedFiles]);

  // Función para manejar el despliegue de los errores
  const toggleErrors = (fileName: string) => {
    setExpandedErrors((prev) => ({
      ...prev,
      [fileName]: !prev[fileName], // Alternar entre abierto/cerrado para cada archivo
    }));
  };

  // Componente que muestra los mensajes
  const renderImportMessages = () => {
    if (importMessages.length === 0) return null;

    return (
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm max-h-[550px] overflow-y-auto">
        {/* Mostrar mensajes de tipo 'leidos' normalmente */}
        {importMessages
          .filter((msg) => msg.type === 'leidos')
          .map((msg, index) => (
            <div key={index} className="p-3 rounded mb-2 bg-blue-100 text-blue-700">
              {msg.message}
            </div>
          ))}

        {/* Mostrar mensajes de tipo 'insertados' con posibilidad de expansión si hay errores */}
        {importMessages
          .filter((msg) => msg.type === 'insertados')
          .map((msg, index) => {
            // Verificar si hay errores asociados al mensaje de 'insertados'
            const associatedErrors = importMessages.filter(
              (errorMsg) => errorMsg.fileName === msg.fileName && errorMsg.type === 'error'
            );
            const hasErrors = associatedErrors.length > 0;

            return (
              <div
                key={index}
                className={`p-3 rounded mb-2 bg-green-100 text-green-700 relative ${hasErrors ? 'cursor-pointer' : ''} ${expandedErrors[msg.fileName] ? 'expanded-container' : 'collapsed-container'
                  }`}
                onClick={() => hasErrors && toggleErrors(msg.fileName)} // Detectar click solo si hay errores
              >
                {/* Mensaje principal */}
                {msg.message}

                {/* Ícono para desplegar/cerrar si hay errores */}
                {hasErrors && (
                  <span className="absolute right-4 top-4">
                    {expandedErrors[msg.fileName] ? <RightOutlined /> : <DownOutlined />}
                  </span>
                )}

                {/* Mostrar errores si están desplegados */}
                {expandedErrors[msg.fileName] && hasErrors && (
                  <div className="mt-2">
                    {associatedErrors.map((errorMsg, i) => (
                      <div key={i} className="p-2 rounded bg-red-100 text-red-700 mb-2">
                        {errorMsg.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    );
  };


  const uploadButton = (
    <div className="w-full h-full flex justify-center items-center">
      <PlusOutlined />
      <div>Subir</div>
    </div>
  );

  return (
    <div className="w-1/2 mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl max-h-full">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Importar ficheros</h2>

      <div className="uploader-container">
        <Upload
          multiple // Permitir la subida de múltiples archivos
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={() => false} // Desactivar la subida automática
          className="w-full h-full"
        >
          {uploadButton}
        </Upload>

        {previewImage && (
          <Image
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />
        )}
      </div>

      {fileDetected && (
        <div className="mt-4">
          <button
            onClick={handleFilesUpload}
            className="w-full mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Importar
          </button>
        </div>
      )}

      {showLoadingGif && <Loader />}

      {/* Render mensajes en dos columnas con scroll */}
      {renderImportMessages()}
    </div>
  );
};

export default LocalUploader;
