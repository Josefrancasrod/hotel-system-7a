const { filterUsers } = require("../Services/FilterUsersServices");

/**
 * Controlador para filtrar usuarios
 * Acepta parámetros de query string para filtrar usuarios
 * Ejemplo: GET /api/users/filter?nombre=Fernando&role=user&page=1&limit=10
 */
const filterUsersController = async (req, res) => {
  try {
    // Obtener los filtros de los query parameters
    const filters = {
      nombre: req.query.nombre,
      apellidos: req.query.apellidos,
      email: req.query.email,
      username: req.query.username,
      role: req.query.role,
      cell_number: req.query.cell_number,
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    // Validar que page y limit sean números válidos
    if (filters.page && (isNaN(filters.page) || filters.page < 1)) {
      return res.status(400).json({
        message: "El parámetro 'page' debe ser un número mayor a 0",
      });
    }

    if (filters.limit && (isNaN(filters.limit) || filters.limit < 1)) {
      return res.status(400).json({
        message: "El parámetro 'limit' debe ser un número mayor a 0",
      });
    }

    // Validar que role sea válido si se proporciona
    if (filters.role && !["user", "admin"].includes(filters.role)) {
      return res.status(400).json({
        message: "El parámetro 'role' debe ser 'user' o 'admin'",
      });
    }

    // Llamar al servicio de filtrado
    const result = await filterUsers(filters);

    // Si no hay usuarios encontrados
    if (result.users.length === 0) {
      return res.status(200).json({
        message: "No se encontraron usuarios con los criterios especificados",
        users: [],
        pagination: result.pagination,
      });
    }

    // Retornar los usuarios filtrados con paginación
    return res.status(200).json({
      message: "Usuarios filtrados correctamente",
      ...result,
    });
  } catch (error) {
    console.error("Error en filterUsersController:", error);
    return res.status(500).json({
      message: "Error al filtrar usuarios",
      error: error.message,
    });
  }
};

module.exports = { filterUsersController };

