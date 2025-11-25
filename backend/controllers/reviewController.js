// backend/controllers/reviewController.js
import Review from "../models/Review.js";
import Tour from "../models/Tour.js";

export const createReview = async (req, res) => {
  try {
    // req.user is populated by verifyToken (payload contains id, role)
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // prefer route param id (frontend posts to /review/:id), fallback to body productId
    const tourId = req.params.id || req.body.productId;
    const { reviewText, rating } = req.body;

    if (!tourId || !reviewText) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const newReview = new Review({
      productId: tourId,
      userId,
      username: req.user.username || req.user.name || "Anonymous",
      reviewText,
      rating: Number(rating) || 0,
    });

    const saved = await newReview.save();

    // push review id to Tour.reviews array (optional)
    if (tourId) {
      await Tour.findByIdAndUpdate(tourId, { $push: { reviews: saved._id } });
    }

    return res.status(201).json({ success: true, message: "Review added", data: saved });
  } catch (err) {
    console.error("createReview error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getReviewsByTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const reviews = await Review.find({ productId: tourId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error("getReviewsByTour error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
