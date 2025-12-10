const prisma = require("../prisma/prismaClient");

const getAverageStay = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      select: { checkIn: true, checkOut: true },
    });

    if (bookings.length === 0) {
      return res.json({ averageStayDays: 0, message: "No hay reservas registradas" });
    }

    let totalDays = 0;
    bookings.forEach((booking) => {
      const diffTime = new Date(booking.checkOut) - new Date(booking.checkIn);
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      totalDays += diffDays;
    });

    const average = totalDays / bookings.length;

    res.json({
      totalReservations: bookings.length,
      averageStayDays: parseFloat(average.toFixed(2))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al calcular el promedio' });
  }
};

module.exports = { getAverageStay };