import React from 'react'

export const SinResultados = ({tabla} : {tabla:string}) => {

    const mostrarAccionMensaje = () => {

        switch (tabla) {
            case 'conciliar':
                    return 'conciliar'
            case 'worksheet':
                    return 'consultar'
            case 'revision':
                    return 'revisar'
            case 'editar':
                    return 'editar'        
            default:
                'error'
                break;
        }                    
    }

  return (

        <></>
//     <div className='w-full flex justify-center py-10 text-2xl bg-gray-400 text-gray-50 rounded-md select-none'>
//         Lo sentimos, pero no hay datos para {mostrarAccionMensaje()}
//     </div>
  )
}
