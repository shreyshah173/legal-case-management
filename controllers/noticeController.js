// const Notice = require('../models/noticeModel');

// // Create a new notice (already discussed earlier)
// exports.createNotice = async (req, res) => {
//     try {
//         const { clientName, caseId, accountNumber, demandedAmount, paymentDueDate } = req.body;

//         // Create the notice
//         const newNotice = new Notice({
//             clientName,
//             caseId,
//             accountNumber,
//             demandedAmount,
//             paymentDueDate
//         });

//         // Save notice to the database
//         await newNotice.save();

//         res.status(201).json({ message: 'Notice created successfully', notice: newNotice });
//     } catch (err) {
//         res.status(500).json({ message: 'Server Error', error: err.message });
//     }
// };

// // Update notice payment and transaction history
// exports.updateNoticePayment = async (req, res) => {
//     try {
//         const { noticeId, paymentMode, amount, transactionId, tdsDeduction, postalCharges, letterheadCharges, printingCharges } = req.body;

//         const notice = await Notice.findById(noticeId);
//         if (!notice) {
//             return res.status(404).json({ message: 'Notice not found' });
//         }

//         // Add new payment transaction to the transaction history
//         const transaction = {
//             amount,
//             paymentMode,
//             transactionId,
//             tdsDeduction,
//             postalCharges,
//             letterheadCharges,
//             printingCharges
//         };

//         notice.transactionHistory.push(transaction);

//         // If payment received matches or exceeds the demanded amount, mark as Paid
//         const totalPaid = notice.transactionHistory.reduce((total, txn) => total + txn.amount, 0);
//         if (totalPaid >= notice.demandedAmount) {
//             notice.noticeStatus = 'Paid';
//             notice.paymentReceived = true;
//         }

//         await notice.save();

//         res.json({ message: 'Payment updated successfully', notice });
//     } catch (err) {
//         res.status(500).json({ message: 'Server Error', error: err.message });
//     }
// };

// // Get all notices
// exports.getAllNotices = async (req, res) => {
//     try {
//         const notices = await Notice.find().populate('caseId');
//         res.json(notices);
//     } catch (err) {
//         res.status(500).json({ message: 'Server Error', error: err.message });
//     }
// };


const Notice = require('../models/noticeModel');

// Create a new notice
exports.createNotice = async (req, res) => {
    try {
        const { clientName, caseId, accountNumber, demandedAmount, paymentDueDate } = req.body;

        // Create the notice
        const newNotice = new Notice({
            clientName,
            caseId,
            accountNumber,
            demandedAmount,
            paymentDueDate
        });

        // Save notice to the database
        await newNotice.save();

        res.status(201).json({ message: 'Notice created successfully', notice: newNotice });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Update notice payment and transaction history
exports.updateNoticePayment = async (req, res) => {
    try {
        const { noticeId, paymentMode, amount, transactionId, tdsDeduction, postalCharges, letterheadCharges, printingCharges } = req.body;
        const notice = await Notice.findById(noticeId);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }
        
        // Add new payment transaction to the transaction history
        const transaction = {
            amount,
            paymentMode,
            transactionId,
            tdsDeduction,
            postalCharges,
            letterheadCharges,
            printingCharges
        };
        
        notice.transactionHistory.push(transaction);
        
        // If payment received matches or exceeds the demanded amount, mark as Paid
        const totalPaid = notice.transactionHistory.reduce((total, txn) => total + txn.amount, 0);
        if (totalPaid >= notice.demandedAmount) {
            notice.noticeStatus = 'Paid';
            notice.paymentReceived = true;
        }
        
        await notice.save();

        res.json({ message: 'Payment updated successfully', notice });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// List all notices or filter by clientName or caseId
exports.listNotices = async (req, res) => {
    try {
        const { clientName, caseId } = req.query;

        // Build a query based on the filters provided
        const query = {};
        if (clientName) query.clientName = clientName;
        if (caseId) query.caseId = caseId;

        const notices = await Notice.find(query).populate('caseId');

        if (notices.length === 0) {
            return res.status(404).json({ message: 'No notices found' });
        }

        res.json(notices);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get a specific notice by ID
exports.getNoticeById = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id).populate('caseId');

        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        res.json(notice);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Delete a notice by ID
exports.deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findByIdAndDelete(req.params.id);

        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        res.json({ message: 'Notice deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
