import { prisma } from "../config/prisma.js";

// --------------------------------------------------
// DELETE REVIEW
// --------------------------------------------------
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role; // "admin" o "user"

    // 1. Buscar si existe la reseña
    const review = await prisma.review.findUnique({
      where: { id: Number(reviewId) },
    });

    if (!review) {
      return res.status(404).json({ message: "La reseña no existe" });
    }

    // 2. Validar permisos: autor o admin
    if (review.userId !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar esta reseña" });
    }

    // 3. Eliminar la reseña
    await prisma.review.delete({
      where: { id: Number(reviewId) },
    });

    return res.json({
      message: "La reseña fue eliminada correctamente",
      deletedReviewId: Number(reviewId),
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al eliminar la reseña" });
  }
};

// --------------------------------------------------
// GET REVIEWS BY USER
// --------------------------------------------------
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
