export const fetchUserData = async () => {
    try {
      const response = await fetch('http://api.usuarios.appnet/V2/userdata', {

        // suplantar a otro usuario
      // const response = await fetch('http://api.usuarios.appnet/V2/userdata?usuario=TRM00746', {

        method: 'GET',
        credentials: 'include', // Esto permite incluir las credenciales de Windows en la solicitud
      });
  
      if (!response.ok) {
        throw new Error('Error fetching the data');
      }
      
      const result = await response.json();
      return result; // Devuelve el JSON
    } catch (error:any) {
      throw new Error(error.message);
    }
  };
  