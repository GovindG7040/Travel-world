// backend/controllers/bookingController.js
import Booking from "../models/Booking.js";

// create new booking
export const createBooking = async (req, res) => {
  try {
    // Ensure the booking is associated with the logged-in user (do not trust client)
    if (req.user && req.user.id) {
      req.body.userId = req.user.id;
    }

    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();

    res.status(200).json({
      success: true,
      message: "Your tour is booked",
      data: savedBooking,
    });
  } catch (err) {
    console.error("Booking create error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// get single booking
export const getBooking = async (req, res) => {
  const id = req.params.id;
  try {
    const book = await Booking.findById(id);
    res.status(200).json({
      success: true,
      message: "Booking found",
      data: book,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Booking not found" });
  }
};

// get all bookings (admin)
export const getAllBooking = async (req, res) => {
  try {
    const books = await Booking.find({});
    res.status(200).json({
      success: true,
      message: "Bookings found",
      data: books,
    });
  } catch (err) {
    console.error("Booking list error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// NEW: get bookings for current logged-in user
export const getBookingsByUser = async (req, res) => {
  try {
    // req.user is set by verifyToken middleware (payload contains id)
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: user id missing" });
    }

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "User bookings fetched",
      data: bookings,
    });
  } catch (err) {
    console.error("Get user bookings error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
