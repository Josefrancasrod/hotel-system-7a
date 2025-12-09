import { Router } from "express";
import { getReviewsByUser } from "../controllers/reviews.controller.js";
import { authRequired } from "../middlewares/authRequired.js";

const router = Router();

// Obtener reseñas de un usuario
router.get("/reviews/user/:userId", authRequired, getReviewsByUser);

export default router;
