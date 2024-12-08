const express = require('express');
const { addAccess, removeAccess } = require('../models/userModel');
const router = express.Router();

router.post('/add-access', async (req, res) => {
    const { userId, accessRight } = req.body;
    try {
        await addAccess(userId, accessRight);
        res.status(200).json({ message: `Access right ${accessRight} added to user ${userId}` });
    } catch (error) {
        console.error('Error adding access:', error);
        res.status(500).json({ error: 'Could not add access right' });
    }
});

router.post('/remove-access', async (req, res) => {
    const { userId, accessRight } = req.body;
    try {
        await removeAccess(userId, accessRight);
        res.status(200).json({ message: `Access right ${accessRight} removed from user ${userId}` });
    } catch (error) {
        console.error('Error removing access:', error);
        res.status(500).json({ error: 'Could not remove access right' });
    }
});

module.exports = router;
