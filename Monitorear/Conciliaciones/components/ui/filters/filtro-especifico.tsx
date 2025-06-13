'use server'
export async function FiltroEspecifico() {

    return (
        <div className='mb-4'>
            <div className="flex justify-center items-center">
                <label className='p-2 pt-3'>Fecha: </label>
                <input
                    type="date"
                    name="fechaFin"
                    className="mt-1 rounded-md border-gray-300 text-xs shadow-md focus:border-red-500 focus:ring-red-500 sm:text-xs"
                />
            </div>
        </div>
    );
}
