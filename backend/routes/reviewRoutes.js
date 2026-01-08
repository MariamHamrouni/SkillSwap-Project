// backend/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// La route doit correspondre exactement à l'appel axios du frontend
router.post('/:serviceId', protect, addReview);

module.exports = router;