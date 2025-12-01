// userController.js

// 1. Importar el servicio de usuarios
// Asumo que este controlador se encuentra en el mismo nivel que la carpeta 'services'
const { getAllUsers } = require('../services/UserServices');

/**
 * @desc Obtener todos los usuarios
 * @route GET /api/users
 * @access Public
 */
const getUsers = async (req, res) => {
  try {
    // 2. Llamar a la función del servicio para obtener los datos
    const users = await getAllUsers();
    
    // 3. Enviar la respuesta al cliente con el código de estado 200 (OK)
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    // 4. Manejar errores (por ejemplo, si falla la conexión a la BD)
    console.error('Error al obtener usuarios:', error);
    
    // 5. Enviar una respuesta de error 500 (Internal Server Error)
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor al recuperar usuarios' 
    });
  }
};

module.exports = {
  getUsers
};