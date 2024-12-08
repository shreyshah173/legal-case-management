const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');

// Create a new notice
router.post('/create', noticeController.createNotice);

// Update an existing notice (e.g., update payment status)
router.put('/update', noticeController.updateNoticePayment);

// List all notices or filter by criteria (e.g., client, case)
router.get('/list', noticeController.listNotices);

// Get a specific notice by ID
router.get('/:id', noticeController.getNoticeById);

// Delete a notice by ID
router.delete('/:id', noticeController.deleteNotice);

module.exports = router;
