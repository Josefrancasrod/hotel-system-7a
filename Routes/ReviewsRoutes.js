import { Router } from "express";
import {
    getReviewsByUser,
    deleteReview,
    updateReview
} from "../controllers/ReviewsControlles.js";
import { authRequired } from "../middlewares/authRequired.js";

const router = Router();

// Obtener reseñas de un usuario
router.get("/reviews/user/:userId", authRequired, getReviewsByUser);

// Editar una reseña existente
router.put("/reviews/:reviewId", authRequired, updateReview);

// Eliminar una reseña de un usuario
router.delete("/reviews/user/:userId/:reviewId", authRequired, deleteReview);

export default router;
const { deleteReview } = require("../Controller/ReviewsController");

// BORRAR RESEÑA
router.delete("/reviews/user/:userId/:reviewId", deleteReview);
