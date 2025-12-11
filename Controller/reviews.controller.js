import { prisma } from "../config/prisma.js";

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId, title, content, rating } = req.body;

    // 1. Verificar si la reseña existe
    const review = await prisma.review.findUnique({
      where: { id: Number(reviewId) },
    });

    if (!review) {
      return res.status(404).json({
        message: "La reseña no existe",
      });
    }

    // 2. Verificar si la reseña pertenece al usuario (opcional pero recomendado)
    if (review.userId !== Number(userId)) {
      return res.status(403).json({
        message: "No tienes permiso para editar esta reseña",
      });
    }

    // 3. Actualizar la reseña
    const updatedReview = await prisma.review.update({
      where: { id: Number(reviewId) },
      data: {
        title: title || review.title,
        content: content || review.content,
        rating: rating || review.rating,
        updatedAt: new Date(),
      },
    });

    return res.json({
      funcion: "updateReview",
      descripcion:
        "Actualiza una reseña existente creada por un usuario.",
      message: "Reseña actualizada exitosamente",
      updatedReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al actualizar la reseña",
    });
  }
};
