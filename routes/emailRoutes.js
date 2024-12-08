const express = require('express');
const { sendEmail } = require('../controllers/emailController');

const router = express.Router();

// POST route to send email
router.post('/send-email', sendEmail);

// router.post('/send-reminders', async (req, res) => {
//     try {
//         const today = new Date();
//         const oneDay = new Date(today);
//         const threeDays = new Date(today);
//         const sevenDays = new Date(today);

//         oneDay.setDate(today.getDate() + 1);
//         threeDays.setDate(today.getDate() + 3);
//         sevenDays.setDate(today.getDate() + 7);

//         const cases = await Case.find({
//             nextHearingDate: { $in: [today, oneDay, threeDays, sevenDays] },
//         });

//         if (!cases.length) {
//             return res.status(200).json({ message: 'No cases with upcoming hearings found.' });
//         }

//         const emailsWithMessages = cases.map((caseData) => ({
//             email: caseData.clientEmail,
//             message: `Dear ${caseData.clientName},

// This is a reminder that your case "${caseData.caseName}" has a hearing scheduled on ${caseData.nextHearingDate.toDateString()}. Please be prepared and contact your lawyer if you have any questions.

// Best regards,
// Your Legal Team`,
//         }));

//         await sendBulkEmails(emailsWithMessages);

//         res.status(200).json({ message: 'Reminders sent successfully' });
//     } catch (error) {
//         console.error('Error sending reminders:', error);
//         res.status(500).json({ error: 'Failed to send reminders' });
//     }
// });


module.exports = router;
