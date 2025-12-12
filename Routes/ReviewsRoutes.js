import { Router } from "express";
import { getReviewsByUser, deleteReview } from "../controllers/ReviewsControlles.js";
import { authRequired } from "../middlewares/authRequired.js";

const router = Router();

// Obtener reseñas de un usuario
router.get("/reviews/user/:userId", authRequired, getReviewsByUser);

// Eliminar reseña de un usuario
router.delete("/reviews/user/:userId/:reviewId", authRequired, deleteReview);

export default router;
const { deleteReview } = require("../Controller/ReviewsController");

// BORRAR RESEÑA
router.delete("/reviews/user/:userId/:reviewId", deleteReview);
