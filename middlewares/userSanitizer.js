const jwt = require("jsonwebtoken");
const { UserDetails, UserAccount } = require("../models");
const { FindRoleByName, FindUserByEmail, FindUser, GenerateHashPassword, updateUserDetailsProfilePicUrl, getProfilePicUrl } = require("../models/dbHelper/helper");
const { SendResponse } = require("../utils/utils");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const UserId = req.User.UserId;
        const extension = path.extname(file.originalname);
        cb(null, `${UserId}${extension}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {

        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            return cb(new Error('Invalid mime type only jpg,png,jpeg formats are allowed'));
        }
    }
});

const RoleExistsMiddleware = async (req, res, next) => {

    const { RoleName } = req.body;

    try {

        const existingRole = await FindRoleByName(RoleName);

        if (!existingRole) {
            return SendResponse(res, 400, "User Role DoesNot Exists!", null, false);
        }

        // Storing the RoleId on the request object...
        req.RoleId = existingRole.RoleId;

        next();
    } catch (error) {
        next(error);
    }
};


const UserExistsByEmailSignup = async (req, res, next) => {

    const { Email } = req.body;

    try {

        const existingUser = await FindUserByEmail(Email);

        if (existingUser) {
            return SendResponse(res, 400, "User Already Exists!", null, false);
        }

        next();
    } catch (error) {
        next(error);
    }
};

const UserExistsByEmailSignin = async (req, res, next) => {

    const { Email } = req.body;

    try {

        const existingUser = await FindUserByEmail(Email);

        if (!existingUser) {
            return SendResponse(res, 404, "User Not Found!", null, false);
        }
        console.log(existingUser);
        req.existingUser = existingUser;

        next();
    } catch (error) {
        next(error);
    }
};

const CheckUserActivation = async (req, res, next) => {

    const { Email } = req.body;

    try {

        const existingUser = await FindUserByEmail(Email);

        if (!existingUser) {
            return SendResponse(res, 404, "User Not Found!", null, false);
        }

        const user = await FindUser(existingUser);

        if (!user) {
            return SendResponse(res, 404, "User Not Found!", null, false);
        }

        if (user.IsDeleted || user.IsDisabled) {
            const message = user.IsDeleted ? "User Account is Deleted!" : "User Account is Disabled";
            return SendResponse(res, 403, message, null, false);
        }

        next();
    } catch (error) {
        next(error);
    }
};


// module.exports = { RoleExistsMiddleware, UserExistsByEmailSignin, UserExistsByEmailSignup, CheckUserActivation };
const CheckUserForUserDetails = async (req, res, next) => {

    const UserId = parseInt(req.params.id);

    try {
        const user = await UserDetails.findOne({ where: { UserId } });

        if (!user) {
            return SendResponse(res, 404, "User Not Found!", null, false);
        }

        req.foundUser = user;

        next();
    } catch (error) {
        next(error);
    }
};

const CheckUserForUserAccount = async (req, res, next) => {
    const UserId = parseInt(req.params.id);

    try {
        const user = await UserAccount.findOne({ where: { UserId } });

        if (!user) {
            return SendResponse(res, 404, "User Not Found!", null, false);
        }

        req.foundUser = user;

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Validates tokrn
 */
const IsLoggedIn = (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return SendResponse(res, 401, "Token is required", null, false);
        }

        if (!authHeader.startsWith('Bearer ')) {
            return SendResponse(res, 401, "Invalid Token Format", null, false);
        }

        const token = authHeader.split(' ')[1];

        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!verifiedUser.FirstName || !verifiedUser.LastName || !verifiedUser.Email) {
            return SendResponse(res, 401, "Invalid Token Data || Unauthorized", null, false);
        }

        const user = {
            UserId: verifiedUser.UserId,
            FirstName: verifiedUser.FirstName,
            LastName: verifiedUser.LastName,
            Email: verifiedUser.Email,
            IsAdmin: verifiedUser.IsAdmin
        }

        req.User = user;
        next();
    } catch (error) {
        next(error);
    }
};

const CheckUserAccountSanitizer = async (req, res, next) => {
    let user = req.existingUser;

    user = await UserAccount.findOne({
        where: {
            UserId: user.UserId
        }
    });

    req.admin = user;

    next();
}

const ValidateIsAdmin = (req, res, next) => {

    try {
        const user = req.User;

        if (user.IsAdmin === true) {
            next();
        } else {
            return SendResponse(res, 401, "Unauthorized User!", null, false)
        }

    } catch (error) {
        next(error);
    }
};

const ValidateIsNormalUser = (req, res, next) => {

    try {
        const user = req.User;

        if (user.IsAdmin) {
            return SendResponse(res, 401, "Unauthorized User!", null, false);
        } else {
            next();
        }

    } catch (error) {
        next(error);
    }
};



const FetchUserWithPassword = async (req, res, next) => {
    const user = req.User;
    const validUser = await UserDetails.findOne({
        where: {
            FirstName: user.FirstName
        }
    });

    req.validUser = validUser;
    next();
};

const uploadSingleImage = upload.single("profilePic");

const UploadProfilePicMiddleware = async (req, res, next) => {

    const contentTypeHeader = req.headers['content-type'];

    try {
        if (!contentTypeHeader || !contentTypeHeader.includes('multipart/form-data')) {
            return res.status(400).send({ message: 'Invalid Content-Type header. Use "multipart/form-data"' });
        }

        const userId = req.User.UserId;
        const existingProfilePic = await getProfilePicUrl(userId);

        if (existingProfilePic) {
            return SendResponse(res, 400, "User had already uploaded picture", null, false);
        }

        uploadSingleImage(req, res, async (err) => {
            if (err) {
                return res.status(400).send({ message: err.message + " give proper profilePic" });
            }

            if (!req.file) {
                return res.status(400).send({ message: 'No image uploaded' });
            }

            const userId = req.User.UserId;
            const imageUrl = path.join('uploads', `${userId}${path.extname(req.file.originalname)}`);

            await updateUserDetailsProfilePicUrl(userId, imageUrl);

            next();
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    RoleExistsMiddleware, UserExistsByEmailSignin, CheckUserAccountSanitizer, FetchUserWithPassword,
    UserExistsByEmailSignup, CheckUserForUserDetails, ValidateIsNormalUser, UploadProfilePicMiddleware,
    CheckUserForUserAccount, CheckUserActivation, IsLoggedIn, ValidateIsAdmin
};

