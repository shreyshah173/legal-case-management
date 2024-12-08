const Case = require('../models/caseModel');
const { sendCaseAlerts } = require('../utils/sendAlerts');

// Get all cases
const getAllCases = async (req, res) => {
    try {
        const cases = await Case.find({});
        res.status(200).json(cases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new case
const createCase = async (req, res) => {
    const { caseName, clientName, caseCategory, nextHearingDate, caseId } = req.body;

    try {
        const newCase = new Case({
            caseName,
            clientName,
            caseCategory,
            nextHearingDate,
            caseId
        });

        await newCase.save();
        res.status(201).json({ message: 'Case created successfully', newCase });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get case by ID
const getCaseById = async (req, res) => {
    try {
        const foundCase = await Case.findById(req.params.id);
        if (!foundCase) {
            return res.status(404).json({ message: 'Case not found' });
        }
        res.status(200).json(foundCase);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update case
const updateCase = async (req, res) => {
    const { caseName, clientName, caseCategory, nextHearingDate, status } = req.body;

    try {
        const updatedCase = await Case.findByIdAndUpdate(
            req.params.id,
            { caseName, clientName, caseCategory, nextHearingDate, status },
            { new: true }
        );
        if (!updatedCase) {
            return res.status(404).json({ message: 'Case not found' });
        }
        res.status(200).json({ message: 'Case updated successfully', updatedCase });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete case
const deleteCase = async (req, res) => {
    try {
        const deletedCase = await Case.findByIdAndDelete(req.params.id);
        if (!deletedCase) {
            return res.status(404).json({ message: 'Case not found' });
        }
        res.status(200).json({ message: 'Case deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update case status
const updateCaseStatus = async (req, res) => {
    try {
        const { caseId, status } = req.body;
        const updatedCase = await Case.findByIdAndUpdate(caseId, { status }, { new: true });
        res.status(200).json({ message: "Case status updated successfully", updatedCase });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to send an alert for an upcoming hearing
const sendHearingReminder = async (req, res) => {
    try {
        const caseId = req.params.id;
        const foundCase = await Case.findById(caseId);
        
        if (!foundCase) {
            return res.status(404).json({ message: 'Case not found' });
        }
        // Check if required fields exist
        if (!foundCase.clientEmail || !foundCase.clientPhone || !foundCase.lawyerEmail || !foundCase.lawyerPhone) {
            const {clientEmail,clientPhone,lawyerEmail,lawyerPhone} = req.body;
            if(clientEmail && clientPhone && lawyerEmail && lawyerPhone){
                foundCase.clientEmail = clientEmail;
                foundCase.clientPhone = clientPhone;
                foundCase.lawyerEmail = lawyerEmail;
                foundCase.lawyerPhone = lawyerPhone;
            }else{
                return res.status(400).json({ message: 'Missing required client or lawyer contact information' });
            }
        }

        const alertData = {
            clientEmail: foundCase.clientEmail,
            clientPhone: foundCase.clientPhone,
            lawyerEmail: foundCase.lawyerEmail,
            lawyerPhone: foundCase.lawyerPhone,
            subject: `Reminder for Upcoming Hearing - ${foundCase.title}`,
            message: `Dear ${foundCase.clientName},\n\nThis is a reminder that you have an upcoming hearing on ${foundCase.nextHearingDate}. Please ensure to coordinate with your lawyer, ${foundCase.lawyer}.\n\nBest regards,\nCase Management System`
        };

        await sendCaseAlerts(alertData);

        res.status(200).json({ message: 'Hearing reminder sent successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Fuzzy search for cases by clientName or caseTitle
const searchCases = async (req, res) => {
    try {
        const { searchQuery } = req.body;

        // Create a regular expression for fuzzy search
        const regex = new RegExp(searchQuery, 'i');  // 'i' for case-insensitive search

        // Search for cases where clientName or caseTitle match the search query
        const cases = await Case.find({
            $or: [
                { clientName: { $regex: regex } },
                { caseTitle: { $regex: regex } }
            ]
        });

        if (cases.length === 0) {
            return res.status(404).json({ message: 'No matching cases found' });
        }

        res.status(200).json(cases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllCases,
    createCase,
    getCaseById,
    updateCase,
    deleteCase,
    updateCaseStatus,
    sendHearingReminder,
    searchCases
};
