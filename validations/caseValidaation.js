const Joi = require('joi');

// Validation schema for creating and updating cases
const caseValidationSchema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title must not exceed 100 characters'
    }),
    client: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Client name is required',
        'string.min': 'Client name must be at least 3 characters long',
        'string.max': 'Client name must not exceed 100 characters'
    }),
    description: Joi.string().min(10).required().messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 10 characters long'
    }),
    caseType: Joi.string().valid('Civil', 'Criminal', 'Corporate', 'Family', 'Other').required().messages({
        'any.only': 'Case type must be one of Civil, Criminal, Corporate, Family, or Other',
        'string.empty': 'Case type is required'
    }),
    caseStatus: Joi.string().valid('open', 'ongoing', 'closed').optional().messages({
        'any.only': 'Case status must be one of open, ongoing, or closed'
    }),
    lawyer: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Lawyer name is required',
        'string.min': 'Lawyer name must be at least 3 characters long',
        'string.max': 'Lawyer name must not exceed 100 characters'
    }),
    nextHearingDate: Joi.date().iso().optional().messages({
        'date.base': 'Next hearing date must be a valid date',
        'date.format': 'Next hearing date must be in ISO format'
    }),
    noticeSent: Joi.boolean().optional().messages({
        'boolean.base': 'Notice sent must be a boolean value'
    })
});

// Middleware to validate case creation and updates
const validateCase = (req, res, next) => {
    const { error } = caseValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: 'Validation error',
            details: error.details.map(detail => detail.message)
        });
    }
    next();
};

module.exports = validateCase;
