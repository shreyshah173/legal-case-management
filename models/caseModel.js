const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    caseName: String,
    clientName: String,
    caseCategory: String,
    status: { type: String, default: 'In Progress' },
    nextHearingDate: Date,
    clientPhone: String,
    clientEmail: String,
    lawyerPhone: String,
    lawyerEmail: String,
    caseId: Number,
});
caseSchema.index({ clientName: 'text', caseTitle: 'text' });

module.exports = mongoose.model('Case', caseSchema);
