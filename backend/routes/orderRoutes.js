const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Route : POST /api/orders/:serviceId
// On protège la route car il faut être connecté pour acheter
router.post('/:serviceId', protect, orderController.createOrder);
router.get('/my-orders', protect, orderController.getMyOrders);
module.exports = router;