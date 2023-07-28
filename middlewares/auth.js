const { body, validationResult, param, check } = require("express-validator");

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
        .notEmpty().withMessage('ID is required').bail()
        .isInt({ min: 1 }).withMessage('ID must be a positive integer').bail()
        .custom((value) => {
            if (isNaN(value)) {
                throw new Error("ID must be a positive integer")
            }
            return value;
        })
];

const ValidateUpdateFields = [
    body('FirstName')
        .optional()
        .isLength({ min: 3, max: 20 }).withMessage("firstname length should be more than 3 and less than 21 characters!").bail()
        .isAlpha().withMessage('First name must contain only alphabetic characters'),

    body('LastName')
        .optional()
        .isLength({ min: 3, max: 20 }).withMessage("lastname length should be more than 8 and less than 21 characters!").bail()
        .isAlpha().withMessage('Last name must contain only alphabetic characters').bail()
        .custom((value, { req }) => {
            if (value == req.body.FirstName) {
                throw new Error("FirstName should not be equals to LastName!");
            } else {
                return value;
            }
        }),

    body("Password")
        .optional()
        .isStrongPassword().withMessage("the password must contain 6 characters, 1 lower case letter, 1 upper case letter, 1 number and 1 symbol"),
];

const validateActivationStatus = [
    body('status')
        .notEmpty().withMessage('status should not be empty').bail()
        .isBoolean().withMessage('status should only contain boolean values')
];

const ValidatePasswordFields = [
    body('Password')
        .notEmpty().withMessage("Password field is required").bail()
        .isStrongPassword().withMessage('the password must contain 6 characters, 1 lower case letter, 1 upper case letter, 1 number and 1 symbol'),

    body("NewPassword")
        .notEmpty().withMessage("New Password field is required").bail()
        .isStrongPassword().withMessage('the password must contain 6 characters, 1 lower case letter, 1 upper case letter, 1 number and 1 symbol').bail()
    // .custom((value, { req }) => {
    //     if (value == req.body.NewPassword) {
    //         throw new Error("New Password should not be equals to Current Password!");
    //     } else {
    //         return value;
    //     }
    // }),
];

const ErrorHandling = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

module.exports = { ValidateSignupFields, ValidateSigninFields, ValidateUpdateFields, validateIdParam, validateActivationStatus, ValidatePasswordFields, ErrorHandling }