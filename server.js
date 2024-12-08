const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const paymentRoute = require('./routes/paymentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const accessRoutes = require('./routes/accessRoutes'); 
const multer = require('multer');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const uploadFiles = require('./utils/File');
const emailRoutes = require('./routes/emailRoutes');
const scheduleDailyReminders = require('./job/dailyReminderJob');


dotenv.config();
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/payment', paymentRoute);
app.use('/api/messages', messageRoutes);
app.use('/api/access', accessRoutes); 
app.use('/api/email', emailRoutes);


scheduleDailyReminders(); // will run in backend 


app.use(errorHandler);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

app.post('/upload-case-files', upload.array('files'), async (req, res) => {
    if (!req.files) {
        return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const filePaths = req.files.map(file => file.path);

    try {
        const results = await uploadFiles(filePaths);
        res.status(200).json({
            message: 'Files uploaded successfully',
            results: results.map(result => ({
                url: result.secure_url,
                public_id: result.public_id,
            })),
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
