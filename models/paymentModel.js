const mongoose = require('mongoose');

// Schema for Payments
const paymentSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
    noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', required: true },
    paymentAmount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMode: { type: String, required: true }, // e.g., Credit Card, Debit Card, Bank Transfer, etc.
    transactionId: { type: String, required: true },
    tdsDeduction: { type: Boolean, default: false }, // Tax Deducted at Source
    additionalCharges: {
        postalCharges: { type: Number, default: 0 },
        letterheadCharges: { type: Number, default: 0 },
        printingCharges: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
