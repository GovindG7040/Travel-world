// backend/routes/tours.js
import express from 'express'
import {
  createTour,
  deleteTour,
  getAllTour,
  getFeaturedTour,
  getSingleTour,      // ✅ import again
  getTourBySearch,
  getTourCount,
  updateTour
} from '../controllers/tourController.js'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

// admin CRUD
router.post('/', verifyAdmin, createTour)
router.put('/:id', verifyAdmin, updateTour)
router.delete('/:id', verifyAdmin, deleteTour)

// search endpoints FIRST
router.get('/search', getTourBySearch)
router.get('/search/getFeaturedTours', getFeaturedTour)
router.get('/search/getTourCount', getTourCount)

// then single tour and list
router.get('/:id', getSingleTour)   // ✅ needed for /tours/:id
router.get('/', getAllTour)

export default router
