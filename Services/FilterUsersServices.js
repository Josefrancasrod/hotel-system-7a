const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Servicio para filtrar usuarios con múltiples criterios
 * @param {Object} filters - Objeto con los filtros a aplicar
 * @param {string} filters.nombre - Búsqueda parcial por nombre
 * @param {string} filters.apellidos - Búsqueda parcial por apellidos
 * @param {string} filters.email - Búsqueda parcial por email
 * @param {string} filters.username - Búsqueda parcial por username
 * @param {string} filters.role - Filtro exacto por rol (user/admin)
 * @param {string} filters.cell_number - Búsqueda parcial por número de celular
 * @param {number} filters.page - Número de página (default: 1)
 * @param {number} filters.limit - Cantidad de resultados por página (default: 10)
 * @returns {Object} Objeto con los usuarios filtrados y metadatos de paginación
 */
const filterUsers = async (filters = {}) => {
  const {
    nombre,
    apellidos,
    email,
    username,
    role,
    cell_number,
    page = 1,
    limit = 10,
  } = filters;

  // Construir el objeto where para Prisma
  const where = {};

  // Filtro por nombre (búsqueda parcial case-insensitive)
  if (nombre) {
    where.nombre = {
      contains: nombre,
      mode: "insensitive",
    };
  }

  // Filtro por apellidos (búsqueda parcial case-insensitive)
  if (apellidos) {
    where.apellidos = {
      contains: apellidos,
      mode: "insensitive",
    };
  }

  // Filtro por email (búsqueda parcial case-insensitive)
  if (email) {
    where.email = {
      contains: email,
      mode: "insensitive",
    };
  }

  // Filtro por username (búsqueda parcial case-insensitive)
  if (username) {
    where.username = {
      contains: username,
      mode: "insensitive",
    };
  }

  // Filtro por role (exacto)
  if (role) {
    where.role = role;
  }

  // Filtro por cell_number (búsqueda parcial)
  if (cell_number) {
    where.cell_number = {
      contains: cell_number,
    };
  }

  // Calcular el offset para la paginación
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Ejecutar la consulta con paginación
  const [users, total] = await Promise.all([
    prisma.users.findMany({
      where,
      skip,
      take,
      orderBy: {
        created_at: "desc", // Ordenar por fecha de creación descendente
      },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
        username: true,
        cell_number: true,
        role: true,
        created_at: true,
        updated_at: true,
        // No incluir password por seguridad
      },
    }),
    prisma.users.count({ where }),
  ]);

  // Calcular metadatos de paginación
  const totalPages = Math.ceil(total / take);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    users,
    pagination: {
      page: parseInt(page),
      limit: take,
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
  };
};

module.exports = { filterUsers };

