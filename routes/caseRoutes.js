const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');

// Routes
router.post('/create', caseController.createCase); // email add
router.get('/list', caseController.getAllCases); //
router.get('/:id', caseController.getCaseById);
router.put('/update/:id', caseController.updateCase);
router.delete('/delete/:id', caseController.deleteCase);
router.put('/update-status/:id', caseController.updateCaseStatus); // 
router.post('/reminder/:id', caseController.sendHearingReminder); //
// router.post('/reminder/:id', (req,res) => {
//     res.send('Reminder sent' ,req.params.id);
// }); //
router.post('/search', caseController.searchCases);


module.exports = router;
