const twilio = require('twilio');

// Fetch from environment variables and log them
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

// console.log("Account SID:", accountSid);
// console.log("Auth Token:", authToken ? "Auth Token exists" : "Auth Token is missing");
// console.log("Messaging Service SID:", messagingServiceSid);

const client = twilio(accountSid, authToken);
// console.log("Twilio client initialized");

exports.sendMessage = async (req, res, next) => {
    const { to, body } = req.body;
    
    // Log the request body
    // console.log("Request received with To:", to, "and Body:", body);

    if (!to || !body) {
        console.error("Error: 'To' or 'Body' is missing");
        return res.status(400).json({
            message: "'To' phone number and 'Body' message are required",
        });
    }

    try {
        // console.log("Attempting to send message...");
        const message = await client.messages.create({
            body,
            to,  // recipient phone number
            messagingServiceSid  // Messaging Service SID
        });

        // Log success
        // console.log("Message sent successfully. SID:", message.sid);
        res.status(200).json({
            message: 'Message sent successfully',
            sid: message.sid,
        });
    } catch (error) {
        // Log error details
        console.error("Error occurred while sending message:", error.message);
        next(error);  // Pass error to global error handler
    }
};
