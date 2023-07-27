const { SendResponse } = require("../utils/utils");
const { FetchAdminDetails, FetchNormalUsersDetails, GenerateHashPassword, UpdateUser } = require("../models/dbHelper/helper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserDetails, UserAccount } = require("../models");

const AdminSignIn = async (req, res, next) => {

    const { Password } = req.body;
    try {

        const existingUser = req.existingUser;

        const userAccount = req.admin;

        // comparing the password..
        const isValidPassword = await bcrypt.compare(Password, existingUser.Password);

        if (!isValidPassword) {
            return SendResponse(res, 400, "Invalid Password", null, false);
        }

        // if password is valid. creating a token with payload..
        const payload = {
            FirstName: existingUser.FirstName,
            LastName: existingUser.LastName,
            Email: existingUser.Email,
            IsAdmin: userAccount.IsAdmin
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "240s" });

        const user = {
            token,
            IsAdmin: userAccount.IsAdmin
        }

        return SendResponse(res, 200, "Signin Successful", user, true);

    } catch (error) {
        next(error);
    }
};

const GetAdminDetails = async (req, res, next) => {
    try {

        const adminDetails = await FetchAdminDetails();

        return SendResponse(res, 200, "Admin User Details", adminDetails, true);

    } catch (error) {
        next(error);
    }
};

const GetUsersList = async (req, res, next) => {
    try {
        const usersDetails = await FetchNormalUsersDetails();

        return SendResponse(res, 200, "Users List", usersDetails, true);
    } catch (error) {
        next(error);
    }
};

const UpdateAdminUserPassword = async (req, res, next) => {
    const { Password, NewPassword } = req.body;

    try {
        const user = req.validUser;

        const isValidPassword = await bcrypt.compare(Password, user.Password)
        // console.log("user hai", user);
        // console.log("valid hai kya", isValidPassword)

        if (!isValidPassword) {
            return SendResponse(res, 401, "User Not Found", null, false)
        }

        // if valid then do the encyryption.....
        const hashedPassword = await GenerateHashPassword(NewPassword);

        await UserDetails.update(
            { Password: hashedPassword },
            { where: { Email: user.Email } }
        );

        return SendResponse(res, 200, "Password Changed Successfully", null, true);
    } catch (error) {
        next(error);
    }
};

const UpdateNormalUser = async (req, res, next) => {
    const { Email, FirstName, LastName } = req.body;

    try {

        const user = { Email, FirstName, LastName }
        const foundUser = req.foundUser;
        const updatedUser = await UpdateUser(user, foundUser);
        console.log(updatedUser);

        SendResponse(res, 200, "User Updated Successfully", updatedUser, true);
    } catch (error) {
        next(error);
    }
};

const ViewEngine = async (req, res, next) => {
    try {
        res.render('index', { FirstName: "Riyaz", LastName: "Shaikh" });
    } catch (error) {
        next(error);
    }
}

const GetAdminDetails1 = async (req, res, next) => {
    try {
        const adminDetails = await UserDetails.findOne({
            attributes: ['Email', 'FirstName', 'LastName'],
            include: [{
                model: UserAccount,
                where: { IsAdmin: true },
                attributes: ["IsAdmin", "RoleId"],
                required: true
            }],
        });

        if (!adminDetails) {
            return SendResponse(res, 400, "Admin User Not Found", null, false);
        }

        const user = {
            Email: adminDetails.Email,
            FirstName: adminDetails.FirstName,
            LastName: adminDetails.LastName,
            IsAdmin: adminDetails.UserAccount.IsAdmin,
            RoleId: adminDetails.UserAccount.RoleId
        };
        SendResponse(res, 200, "User List", user, true);
    } catch (error) {
        next(error);
    }
};

module.exports = { AdminSignIn, GetAdminDetails, GetUsersList, UpdateAdminUserPassword, UpdateNormalUser, GetAdminDetails1, ViewEngine };