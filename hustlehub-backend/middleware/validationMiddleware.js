const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(8)
        // bcrypt ignores everything after 72 bytes, so longer passwords are rejected
        .max(72, 'utf8')
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$'))
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must be at most 72 characters long',
            'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character'
        }),

    // Admin accounts are never created through public registration
    role: Joi.string()
        .valid('client', 'freelancer')
        .required()
        .messages({
            'any.only': 'Role must be either client or freelancer'
        })
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required()
});

const gigCreateSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required(),

    description: Joi.string()
        .trim()
        .min(10)
        .max(2000)
        .required(),

    category: Joi.string()
        .trim()
        .max(50)
        .required(),

    price: Joi.number()
        .positive()
        .precision(2)
        .max(1000000)
        .required()
        .messages({
            'number.positive': 'Price must be greater than 0'
        })
});

// Same rules as create, but every field is optional and at least one must be sent
const gigUpdateSchema = gigCreateSchema
    .fork(['title', 'description', 'category', 'price'], (field) => field.optional())
    .min(1)
    .messages({
        'object.min': 'At least one field must be provided to update'
    });

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }))
            });
        }

        // Replace the body with the cleaned value so unknown fields
        // (e.g. a spoofed "freelancer" id) never reach the controllers
        req.body = value;

        next();
    };
};

// MongoDB ObjectIds are 24 hex characters; reject anything else before it reaches the database
const validateObjectId = (req, res, next) => {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID'
        });
    }

    next();
};

const bookingCreateSchema = Joi.object({
    gigId: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'Invalid gig ID',
            'string.length': 'Invalid gig ID'
        })
});

const validateBookingCreate = validate(bookingCreateSchema);


const validateRegister = validate(registerSchema);
const validateLogin = validate(loginSchema);
const validateGigCreate = validate(gigCreateSchema);
const validateGigUpdate = validate(gigUpdateSchema);

module.exports = {
    validateRegister,
    validateLogin,
    validateGigCreate,
    validateGigUpdate,
    validateObjectId
};
