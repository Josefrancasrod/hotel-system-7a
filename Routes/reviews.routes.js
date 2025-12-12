import { Router } from "express";
import { deleteReview, getReviewsByUser } from "../controllers/reviews.controller.js";
import { authRequired } from "../middlewares/authRequired.js";

const router = Router();

// Eliminar reseña
router.delete("/reviews/:reviewId", authRequired, deleteReview);

// Obtener reseñas de un usuario
router.get("/reviews/user/:userId", authRequired, getReviewsByUser);

export default router;
