const express = require('express');
const { createPayment, getAllPayments } = require('../controllers/paymentController');
const router = express.Router();

// Route to create a new payment
router.post('/create', createPayment);

// Route to get all payments (optional filters: clientName, caseId, noticeId)
router.get('/', getAllPayments);

module.exports = router;
