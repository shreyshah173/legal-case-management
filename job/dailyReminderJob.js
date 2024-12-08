const cron = require('node-cron');
const Case = require('../models/caseModel'); // Adjust the path as necessary
const { sendBulkEmails } = require('../controllers/emailController');
const logger = require('../utils/logger');

const scheduleDailyReminders = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            logger.info('Starting daily email reminders task...');
            const today = new Date();
            const oneDay = new Date(today);
            const threeDays = new Date(today);
            const sevenDays = new Date(today);

            oneDay.setDate(today.getDate() + 1);
            threeDays.setDate(today.getDate() + 3);
            sevenDays.setDate(today.getDate() + 7);

            const cases = await Case.find({
                nextHearingDate: { $in: [today, oneDay, threeDays, sevenDays] },
            });

            if (!cases.length) {
                logger.info('No cases with upcoming hearings found.');
                return;
            }

            const emailsWithMessages = cases.map((caseData) => ({
                email: caseData.clientEmail,
                message: `Dear ${caseData.clientName},

This is a reminder that your case "${caseData.caseName}" has a hearing scheduled on ${caseData.nextHearingDate.toDateString()}. Please be prepared and contact your lawyer if you have any questions.

Best regards,
Your Legal Team`,
            }));

            await sendBulkEmails(emailsWithMessages);
            logger.info('Daily email reminders sent successfully.');
        } catch (error) {
            logger.error('Error in daily email reminders task:', error);
        }
    });
};

module.exports = scheduleDailyReminders;
