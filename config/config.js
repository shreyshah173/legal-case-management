const dotenv = require('./dotenv');

// Configuration object
module.exports = {
    app: {
        port: dotenv.PORT,
        environment: dotenv.NODE_ENV,
    },
    db: {
        connectionString: dotenv.DB_CONNECTION_STRING,
    },
    email: {
        user: dotenv.EMAIL_USER,
        pass: dotenv.EMAIL_PASS,
    },
    twilio: {
        accountSid: dotenv.TWILIO_ACCOUNT_SID,
        authToken: dotenv.TWILIO_AUTH_TOKEN,
        phoneNumber: dotenv.TWILIO_PHONE_NUMBER,
    }
};

