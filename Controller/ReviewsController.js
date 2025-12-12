import { prisma } from "../config/prisma.js";

// ==============================================
// Obtener reseñas por usuario
// ==============================================
export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: "El usuario no existe" });
    }

    // 2. Obtener reseñas
    const reviews = await prisma.review.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      funcion: "getReviewsByUser",
      descripcion: "Obtiene las reseñas creadas por un usuario",
      totalReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Error en getReviewsByUser:", error);
    return res.status(500).json({ message: "Error al obtener las reseñas" });
  }
};

// ==============================================
// Eliminar reseña de un usuario
// ==============================================
export const deleteReview = async (req, res) => {
  try {
    const { userId, reviewId } = req.params;

    // 1. Verificar usuario
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: "El usuario no existe" });
    }

    // 2. Verificar reseña
    const review = await prisma.review.findUnique({
      where: { id: Number(reviewId) },
    });

    if (!review) {
      return res.status(404).json({ message: "La reseña no existe" });
    }

    // 3. Verificar que la reseña sea del usuario
    if (Number(review.userId) !== Number(userId)) {
      return res.status(403).json({
        message: "No puedes eliminar una reseña que no te pertenece",
      });
    }

    // 4. Eliminar reseña
    await prisma.review.delete({
      where: { id: Number(reviewId) },
    });

    return res.json({
      message: "Reseña eliminada correctamente",
      deletedReviewId: reviewId,
    });
  } catch (error) {
    console.error("Error en deleteReview:", error);
    return res.status(500).json({
      message: "Error al eliminar la reseña",
    });
  }
};
const { deleteReviewService } = require("../Services/ReviewsServices");

exports.deleteReview = async (req, res) => {
  try {
    const { userId, reviewId } = req.params;

    if (!userId || !reviewId) {
      return res.status(400).json({
        message: "Se requieren userId y reviewId",
      });
    }

    const result = await deleteReviewService(
      Number(userId),
      Number(reviewId)
    );

    return res.status(200).json({
      message: "Reseña eliminada correctamente",
      result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
