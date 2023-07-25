const jwt = require("jsonwebtoken");
const { UserDetails, UserAccount } = require("../models");
const { FindRoleByName, FindUserByEmail, FindUser } = require("../models/dbHelper/helper");
const { SendResponse } = require("../utils/utils");

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


module.exports = { RoleExistsMiddleware, UserExistsByEmailSignin, UserExistsByEmailSignup, CheckUserActivation };
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

const IsLoggedIn = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader, typeof authHeader);
    if (!authHeader) {
        return SendResponse(res, 401, "Token is required", null, false);
    }

    if (!authHeader.startsWith('Bearer ')) {
        return SendResponse(res, 401, "Invalid Token Format", null, false);
    }

    const token = authHeader.split(' ')[1];

    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log("verify user hai", verifiedUser.UserDetails);

    if (!verifiedUser.FirstName || !verifiedUser.LastName || !verifiedUser.Email) {
        return SendResponse(res, 401, "Invalid Token Data || Unauthorized", null, false);
    }

    const user = {
        FirstName: verifiedUser.FirstName,
        LastName: verifiedUser.LastName,
        Email: verifiedUser.Email
    }

    req.User = user;
    next();
};

module.exports = {
    RoleExistsMiddleware, UserExistsByEmailSignin,
    UserExistsByEmailSignup, CheckUserForUserDetails,
    CheckUserForUserAccount, CheckUserActivation, IsLoggedIn
};
