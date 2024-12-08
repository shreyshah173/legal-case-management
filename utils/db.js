const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info('MongoDB connected successfully');
    } catch (err) {
        logger.error('MongoDB connection failed', err);
        process.exit(1);
    }
};

module.exports = connectDB;
