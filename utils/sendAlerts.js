const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Load environment variables
require('dotenv').config();
// Check if environment variables are loaded correctly
// // console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);
// // console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
// // console.log("TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER);
// // console.log("EMAIL_USER:", process.env.EMAIL_USER);
// // console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

// Twilio configuration
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const sendEmailAlert = async (recipientEmail, subject, message) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: subject,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
        // console.log(`Email sent to ${recipientEmail}`);
    } catch (error) {
        console.error(`Failed to send email to ${recipientEmail}:`, error.message);
    }
};

const sendWhatsAppAlert = async (recipientPhone, message) => {
    try {
        await twilioClient.messages.create({
            body: message,
            from: `whatsapp:${twilioPhoneNumber}`,
            to: `whatsapp:${recipientPhone}`
        });
        // console.log(`WhatsApp message sent to ${recipientPhone}`);
    } catch (error) {
        console.error(`Failed to send WhatsApp message to ${recipientPhone}:`, error.message);
    }
};

const sendCaseAlerts = async (alertData) => {
    const { clientEmail, clientPhone, lawyerEmail, lawyerPhone, subject, message } = alertData;

    try {
        await sendEmailAlert(clientEmail, subject, message);
        await sendEmailAlert(lawyerEmail, subject, message);
        await sendWhatsAppAlert(clientPhone, message);
        await sendWhatsAppAlert(lawyerPhone, message);
        // console.log('Case alerts sent successfully!');
    } catch (error) {
        console.error('Error sending case alerts:', error.message);
    }
};

module.exports = {
    sendEmailAlert,
    sendWhatsAppAlert,
    sendCaseAlerts
};
