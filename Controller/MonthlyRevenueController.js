const prisma = require("../prisma/prismaClient");

const getMonthlyRevenue = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const result = await prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: {
        checkIn: { gte: startOfMonth, lte: endOfMonth },
        status: 'CONFIRMED',
      },
    });

    res.json({
      month: now.toLocaleString('es-ES', { month: 'long' }),
      year: now.getFullYear(),
      totalRevenue: result._sum.totalPrice || 0
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al calcular ingresos' });
  }
};

module.exports = { getMonthlyRevenue };