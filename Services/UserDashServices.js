// *¡HACK DE RUTA!*
// Apunta a la ubicación donde Prisma genera el cliente en tu sistema,
// resolviendo el error de inicialización persistente.
const { PrismaClient } = require('../prisma/node_modules/@prisma/client');
const prisma = new PrismaClient();

const getAllUsers = async () => {
  const users = await prisma.usuarios.findMany();
  return users;
};

module.exports = { getAllUsers };