import { Router } from "express";
import { deleteReview } from "../controllers/reviews.controller.js";
import { authRequired } from "../middlewares/authRequired.js";

const router = Router();

router.delete("/reviews/:reviewId", authRequired, deleteReview);

export default router;
