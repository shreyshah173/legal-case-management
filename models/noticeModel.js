const mongoose = require('mongoose');

// Schema for Legal Notices
const noticeSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
    accountNumber: { type: String, required: true },
    demandedAmount: { type: Number, required: true },
    paymentDueDate: { type: Date, required: true },
    paymentReceived: { type: Boolean, default: false },
    transactionHistory: [
        {
            date: { type: Date, default: Date.now },
            amount: Number,
            paymentMode: String,
            transactionId: String,
            tdsDeduction: { type: Boolean, default: false },
            postalCharges: { type: Number, default: 0 },
            letterheadCharges: { type: Number, default: 0 },
            printingCharges: { type: Number, default: 0 },
        }
    ],
    noticeStatus: { type: String, enum: ['Pending', 'Paid', 'Overdue'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', noticeSchema);
