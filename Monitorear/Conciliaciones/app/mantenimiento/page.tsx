import React from 'react'

const page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-100">
      <div className="max-w-md text-center p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-yellow-600">
          🚧 ¡Estamos en mantenimiento!
        </h2>
        <p className="mt-4 text-gray-700">
          Actualmente estamos realizando mejoras en nuestra aplicación. Agradecemos tu
          paciencia y pronto volveremos a estar en línea. ¡Gracias por tu comprensión!
        </p>
        <p className="mt-2 text-gray-500">⏳ Por favor, ten un poco de paciencia.</p>
      </div>
    </div>
  )
}

export default page
