const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ReviewServices {
    async updateReview(idReview, data) {
        try {
            const review = await prisma.reviews.update({
                where: { id: Number(idReview) },
                data,
            });

            return {
                status: 200,
                message: "Review actualizada con éxito",
                data: review
            };
        } catch (error) {
            return {
                status: 400,
                message: "No se pudo actualizar la review",
                error: error.message
            };
        }
    }

    async deleteReview(idReview) {
        try {
            const review = await prisma.reviews.delete({
                where: { id: Number(idReview) },
            });

            return {
                status: 200,
                message: "Review eliminada con éxito",
                data: review
            };
        } catch (error) {
            return {
                status: 400,
                message: "No se pudo eliminar la review",
                error: error.message
            };
        }
    }
}

module.exports = new ReviewServices();
