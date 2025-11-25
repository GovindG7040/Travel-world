// backend/routes/reviews.js
import express from "express";
import {
  createReview,
  getReviewsByTour,
  // ... other controller functions
} from "../controllers/reviewController.js";
import verifyToken, { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// Create review (any authenticated user)
router.post("/:id", verifyToken, createReview);

// Get reviews by tour id (example)
router.get("/tour/:tourId", getReviewsByTour);

// Admin routes...
// router.delete('/:id', verifyAdmin, deleteReview)

export default router;
