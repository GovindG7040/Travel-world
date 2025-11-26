// backend/controllers/tourController.js
import Tour from '../models/Tour.js';

// create new tour
export const createTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    const savedTour = await newTour.save();
    return res
      .status(200)
      .json({ success: true, message: 'Successfully created', data: savedTour });
  } catch (err) {
    console.error('createTour error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to create. Try again' });
  }
};

// update tour
export const updateTour = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: 'Successfully updated', data: updatedTour });
  } catch (err) {
    console.error('updateTour error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to update' });
  }
};

// delete tour
export const deleteTour = async (req, res) => {
  const id = req.params.id;
  try {
    await Tour.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: 'Successfully deleted' });
  } catch (err) {
    console.error('deleteTour error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to delete' });
  }
};

// ✅ get single tour (NEEDED by TourDetails, Booking, Reviews, etc.)
export const getSingleTour = async (req, res) => {
  const id = req.params.id;
  try {
    const tour = await Tour.findById(id).populate('reviews');
    return res
      .status(200)
      .json({ success: true, message: 'Successfully found', data: tour });
  } catch (err) {
    console.error('getSingleTour error:', err);
    return res.status(404).json({ success: false, message: 'Not found' });
  }
};

// get all tours (with simple pagination)
export const getAllTour = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  try {
    const tours = await Tour.find({})
      .populate('reviews')
      .skip(page * 8)
      .limit(8);
    return res.status(200).json({
      success: true,
      count: tours.length,
      message: 'Successfully found all',
      data: tours,
    });
  } catch (err) {
    console.error('getAllTour error:', err);
    return res.status(404).json({ success: false, message: 'No data found' });
  }
};

// get tour by search
export const getTourBySearch = async (req, res) => {
  try {
    const { city = '', distance, maxGroupSize } = req.query;
    const query = {};

    if (typeof city === 'string' && city.trim()) {
      const cityRegex = new RegExp(city.trim(), 'i');
      query.$or = [{ city: cityRegex }, { title: cityRegex }];
    }

    const distNum = distance ? Number(distance) : null;
    const groupNum = maxGroupSize ? Number(maxGroupSize) : null;

    if (!isNaN(distNum) && distNum !== null) {
      query.distance = { $lte: distNum };
    }

    if (!isNaN(groupNum) && groupNum !== null) {
      query.maxGroupSize = { $gte: groupNum };
    }

    console.log('search query:', query);
    const tours = await Tour.find(query).populate('reviews').limit(200);
    return res
      .status(200)
      .json({ success: true, message: 'Successfully found', data: tours });
  } catch (err) {
    console.error('getTourBySearch error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'No data found' });
  }
};

// get featured tours
export const getFeaturedTour = async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true })
      .populate('reviews')
      .limit(8);
    return res.status(200).json({
      success: true,
      message: 'Successfully found featured',
      data: tours,
    });
  } catch (err) {
    console.error('getFeaturedTour error:', err);
    return res.status(404).json({ success: false, message: 'No data found' });
  }
};

// get tour counts
export const getTourCount = async (req, res) => {
  try {
    const tourCount = await Tour.estimatedDocumentCount();
    return res.status(200).json({ success: true, data: tourCount });
  } catch (err) {
    console.error('getTourCount error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to fetch count' });
  }
};
