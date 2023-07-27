const jwt = require("jsonwebtoken");
const { UserDetails, UserAccount } = require("../models");
const { FindRoleByName, FindUserByEmail, FindUser, GenerateHashPassword } = require("../models/dbHelper/helper");
const { SendResponse } = require("../utils/utils");
const bcrypt = require("bcryptjs");

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

const
    CheckUserActivation = async (req, res, next) => {

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

        if (user.IsAdmin === true) {
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
}

// const ValidatingAndUpdatePassword = async (req, res, next) => {
//     const { Password, NewPassword } = req.body;

//     try {
//         const user = req.validUser;

//         const isValidPassword = await bcrypt.compare(Password, user.Password)
//         // console.log("user hai", user);
//         // console.log("valid hai kya", isValidPassword)

//         if (!isValidPassword) {
//             return SendResponse(res, 401, "User Not Found", null, false)
//         }

//         // if valid then do the encyryption.....
//         const hashedPassword = await GenerateHashPassword(NewPassword);

//         await UserDetails.update({
//             Password: hashedPassword,
//             where: { Email: user.Email }
//         });

//         next();
//     } catch (error) {
//         next(error);
//     }
// };

module.exports = {
    RoleExistsMiddleware, UserExistsByEmailSignin, CheckUserAccountSanitizer, FetchUserWithPassword,
    UserExistsByEmailSignup, CheckUserForUserDetails, ValidateIsNormalUser,
    CheckUserForUserAccount, CheckUserActivation, IsLoggedIn, ValidateIsAdmin
};

