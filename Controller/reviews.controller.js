import { prisma } from "../config/prisma.js";

export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({
        message: "El usuario no existe",
      });
    }

    // 2. Buscar reseñas del usuario
    const reviews = await prisma.review.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      funcion: "getReviewsByUser",
      descripcion:
        "Obtiene todas las reseñas creadas por un usuario específico utilizando su ID.",
      totalReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al obtener las reseñas del usuario",
    });
  }
};
