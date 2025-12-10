const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUsersByMonth = async (month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const users = await prisma.users.findMany({
    where: {
      created_at: {
        gte: startDate,
        lte: endDate
      }
    }
  });

  // Convertimos BigInt a String para evitar errores
  return users.map(user => ({
    ...user,
    id: user.id.toString()
  }));
};

module.exports = { getUsersByMonth };