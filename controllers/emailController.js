const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const sendEmail = async (req, res) => {
    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ error: 'Email and message are required' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS 
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Message from Your Application',
            text: message
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent: ${info.response}`);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        logger.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};

// const sendBulkEmails = async (emailsWithMessages) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//         });

//         for (const { email, message } of emailsWithMessages) {
//             const mailOptions = {
//                 from: process.env.EMAIL_USER,
//                 to: email,
//                 subject: 'Upcoming Hearing Reminder',
//                 text: message,
//             };

//             await transporter.sendMail(mailOptions);
//             logger.info(`Email sent to: ${email}`);
//         }
//     } catch (error) {
//         logger.error('Error sending emails:', error);
//         throw new Error('Failed to send emails');
//     }
// };


module.exports = { sendEmail };