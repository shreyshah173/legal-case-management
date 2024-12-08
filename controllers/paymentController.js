const Payment = require('../models/paymentModel');
const Notice = require('../models/noticeModel');

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const { clientName, caseId, noticeId, paymentAmount, paymentMode, transactionId, tdsDeduction, additionalCharges } = req.body;

        // Create a new payment entry
        const newPayment = new Payment({
            clientName,
            caseId,
            noticeId,
            paymentAmount,
            paymentMode,
            transactionId,
            tdsDeduction,
            additionalCharges
        });

        // Save the payment in the database
        await newPayment.save();

        // Update the associated notice payment status
        const notice = await Notice.findById(noticeId);
        if (notice) {
            notice.paymentReceived = true; // Mark as payment received
            notice.noticeStatus = 'Paid';  // Update notice status
            await notice.save();
        }

        res.status(201).json({ message: 'Payment recorded successfully', payment: newPayment });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
// Get all payments or filter by client/case/notice
exports.getAllPayments = async (req, res) => {
    try {
        const { clientName, caseId, noticeId } = req.query;
        let filter = {};

        if (clientName) filter.clientName = clientName;
        if (caseId) filter.caseId = caseId;
        if (noticeId) filter.noticeId = noticeId;

        const payments = await Payment.find(filter).populate('caseId').populate('noticeId');

        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
