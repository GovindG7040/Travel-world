// backend/routes/bookings.js
import express from "express";
import {
  createBooking,
  getAllBooking,
  getBooking,
  getBookingsByUser,
} from "../controllers/bookingController.js";
import verifyToken, { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// create booking (any authenticated user)
router.post("/", verifyToken, createBooking);

// get bookings for current user
router.get("/user", verifyToken, getBookingsByUser);

// get single booking (user or admin - existing behavior)
router.get("/:id", verifyUser, getBooking);

// get all bookings (admin)
router.get("/", verifyAdmin, getAllBooking);

export default router;
