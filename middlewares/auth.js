const { body, validationResult, param } = require("express-validator");

const ValidateSignupFields = [

    body("Email")
        .notEmpty()
        .withMessage("Email is required!").bail()
        .isEmail()
        .withMessage("Email is not a valid email address"),

    body("Password")
        .notEmpty()
        .withMessage("password is required!")
        .bail()
        .isStrongPassword().withMessage("'the password must contain 6 characters, 1 lower case letter, 1 upper case letter, 1 number and 1 symbol'"),

    body('FirstName')
        .notEmpty().withMessage('First name is required').bail()
        .isLength({ min: 3, max: 20 }).withMessage("firstname length should be more than 8 and less than 21 characters!").bail()
        .isAlpha().withMessage('First name must contain only alphabetic characters'),

    body('LastName').notEmpty().withMessage('Last name is required').bail()
        .isAlpha().withMessage('Last name must contain only alphabetic characters')
        .isLength({ min: 3, max: 20 }).withMessage("lastname length should be more than 8 and less than 21 characters!").bail()
        .custom((value, { req, }) => {
            if (value == req.body.FirstName) {
                throw new Error("FirstName should not be equals to LastName!");
            } else {
                return value;
            }
        }),

    body('RoleName').notEmpty().withMessage('Role name is required').bail()
        .isAlpha().withMessage('Role name must contain only alphabetic characters'),
];


const ValidateSigninFields = [
    body("Email")
        .notEmpty()
        .withMessage("Email is required!").bail()
        .isEmail()
        .withMessage("Email is not a valid email address"),

    body("Password")
        .notEmpty().withMessage("password is required!").bail()
        .isStrongPassword().withMessage("'the password must contain 6 characters, 1 lower case letter, 1 upper case letter, 1 number and 1 symbol'"),
];

const validateIdParam = [
    param('id')
        .notEmpty().withMessage('ID is required')
        .isInt({ min: 1 }).withMessage('ID must be a positive integer').bail()

];

const ValidateUpdateFields = [
    body('FirstName')
        .optional()
        .isLength({ min: 3, max: 20 }).withMessage("firstname length should be more than 8 and less than 21 characters!").bail()
        .isAlpha().withMessage('First name must contain only alphabetic characters'),

    body('LastName')
        .optional()
        .isAlpha().withMessage('Last name must contain only alphabetic characters')
        .isLength({ min: 3, max: 20 }).withMessage("lastname length should be more than 8 and less than 21 characters!").bail()
        .custom((value, { req }) => {
            if (value == req.body.FirstName) {
                throw new Error("FirstName should not be equals to LastName!");
            } else {
                return value;
            }
        }),

    body("Password")
        .optional()
        .isStrongPassword().withMessage("'the password must contain 6 characters, 1 lower case letter, 1 upper case letter, 1 number and 1 symbol'"),
];

const ErrorHandling = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

module.exports = { ValidateSignupFields, ValidateSigninFields, ValidateUpdateFields, validateIdParam, ErrorHandling }