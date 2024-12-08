const Case = require('../models/caseModel');

// Create a new case
exports.createCase = async (req, res) => {
    try {
        const newCase = new Case({
            title: req.body.title,
            client: req.body.client,
            description: req.body.description,
            caseType: req.body.caseType,
            caseStatus: req.body.caseStatus || 'open', // Default status to 'open'
            lawyer: req.body.lawyer,
            nextHearingDate: req.body.nextHearingDate,
            noticeSent: req.body.noticeSent || false,
        });

        const savedCase = await newCase.save();
        res.status(201).json({
            message: 'Case created successfully',
            case: savedCase
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating case', error: error.message });
    }
};

// Get all cases
exports.getAllCases = async (req, res) => {
    try {
        const cases = await Case.find();
        res.status(200).json(cases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cases', error: error.message });
    }
};

// Get a specific case by ID
exports.getCaseById = async (req, res) => {
    try {
        const caseId = req.params.id;
        const foundCase = await Case.findById(caseId);

        if (!foundCase) {
            return res.status(404).json({ message: 'Case not found' });
        }

        res.status(200).json(foundCase);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching case', error: error.message });
    }
};

// Update a case (e.g., case status, hearing date)
exports.updateCase = async (req, res) => {
    try {
        const caseId = req.params.id;
        const updatedData = req.body;

        const updatedCase = await Case.findByIdAndUpdate(caseId, updatedData, { new: true });

        if (!updatedCase) {
            return res.status(404).json({ message: 'Case not found' });
        }

        res.status(200).json({
            message: 'Case updated successfully',
            case: updatedCase
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating case', error: error.message });
    }
};

// Delete a case
exports.deleteCase = async (req, res) => {
    try {
        const caseId = req.params.id;
        const deletedCase = await Case.findByIdAndDelete(caseId);

        if (!deletedCase) {
            return res.status(404).json({ message: 'Case not found' });
        }

        res.status(200).json({
            message: 'Case deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting case', error: error.message });
    }
};

// Real-time case status update (open, ongoing, closed)
exports.updateCaseStatus = async (req, res) => {
    try {
        const caseId = req.params.id;
        const { caseStatus } = req.body;

        const caseToUpdate = await Case.findById(caseId);
        if (!caseToUpdate) {
            return res.status(404).json({ message: 'Case not found' });
        }

        // Only allow valid statuses
        const validStatuses = ['open', 'ongoing', 'closed'];
        if (!validStatuses.includes(caseStatus)) {
            return res.status(400).json({ message: 'Invalid case status' });
        }

        caseToUpdate.caseStatus = caseStatus;
        await caseToUpdate.save();

        res.status(200).json({
            message: `Case status updated to ${caseStatus}`,
            case: caseToUpdate
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating case status', error: error.message });
    }
};
