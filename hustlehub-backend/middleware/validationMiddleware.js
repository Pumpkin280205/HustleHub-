
const Joi = require('joi');
const xss = require('xss');

const registerSchema = Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string()
        .min(8)
        .max(72, 'utf8')
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
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
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const GIG_CATEGORIES = [
    'Design', 'Writing', 'Development', 'Marketing',
    'Video & Animation', 'Music & Audio', 'Business', 'Other'
];

const gigCreateSchema = Joi.object({
    title: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().min(10).max(2000).required(),

    category: Joi.string()
        .valid(...GIG_CATEGORIES)
        .required()
        .messages({
            'any.only': 'Choose a valid category'
        }),

    price: Joi.number()
        .min(1)
        .precision(2)
        .max(1000000)
        .required()
        .messages({
            'number.min': 'Price must be at least R1'
        })
});

const gigUpdateSchema = gigCreateSchema
    .fork(['title', 'description', 'category', 'price'], field => field.optional())
    .min(1)
    .messages({
        'object.min': 'At least one field must be provided to update'
    });

const xssOptions = {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style']
};

// Passwords must reach bcrypt exactly as typed.
const NEVER_SANITISE = ['password'];

const sanitiseBody = (body = {}) => Object.fromEntries(
    Object.entries(body).map(([key, val]) =>
        typeof val === 'string' && !NEVER_SANITISE.includes(key)
            ? [key, xss(val, xssOptions).trim()]
            : [key, val]
    )
);

const validate = schema => (req, res, next) => {
    const { error, value } = schema.validate(sanitiseBody(req.body), {
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

    req.body = value;
    next();
};

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

module.exports = {
    validateRegister: validate(registerSchema),
    validateLogin: validate(loginSchema),
    validateGigCreate: validate(gigCreateSchema),
    validateGigUpdate: validate(gigUpdateSchema),
    validateObjectId,
    validateBookingCreate: validate(bookingCreateSchema)
};
