const { SendResponse } = require("../utils/utils");
const { FindRoleByName, SignUpUserDetails, SignUpUserAccount, FindUser, FindUserByEmail, FetchUserDetails,
  UpdateUserStatus, FetchUserByIdAndDelete } = require("../models/dbHelper/helper");
const bcrypt = require("bcryptjs");

const SignUp = async (req, res, next) => {
  const { Email, Password, FirstName, LastName, RoleName } = req.body;

  try {

    const existingUser = await FindUserByEmail(Email);
    if (existingUser) {
      return SendResponse(res, 400, "User Already Exists!", null, false)
    }

    const existingRole = await FindRoleByName(RoleName);
    if (!existingRole) {
      return SendResponse(res, 400, "User Role DoesNot Exists!", null, false);
    }

    const newUserAccount = await SignUpUserAccount(existingRole.RoleId);
    // console.log("newUserAccount", newUserAccount);

    const newUserDetails = await SignUpUserDetails(newUserAccount.UserId, Email, Password, FirstName, LastName);
    // console.log("newUserDetails", newUserDetails);

    return SendResponse(res, 200, "User Registered Successfully", newUserDetails, true);
  } catch (error) {
    next(error);
  }
};

const SignIn = async (req, res, next) => {
  const { Email, Password } = req.body;

  try {
    const existingUser = await FindUserByEmail(Email);

    if (!existingUser) {
      return SendResponse(res, 404, "User Not Found!", null, false)
    }

    const user = await FindUser(existingUser);
    console.log(user);

    // if user is deleted or disabled then prevent login....
    if (user.IsDeleted || user.IsDisabled) {
      const message = user.IsDeleted ? "User Account is Deleted!" : "User Account is Disabled";
      return SendResponse(res, 403, message, null, false)
    }

    // comparing the password..
    const isValidPassword = await bcrypt.compare(Password, existingUser.Password);

    if (!isValidPassword) {
      return SendResponse(res, 400, "Invalid Password", null, false)
    }

    // if password is valid...
    return SendResponse(res, 200, "Signin Successful", existingUser, true)

  } catch (error) {
    next(error);
  }
};

const GetUserDetails = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const usersDetails = await FetchUserDetails(id);
    return SendResponse(res, 200, "User Details", usersDetails, true)
  } catch (error) {
    next(error);
  }
};

const DeleteUser = async (req, res, next) => {
  const id = req.params.id;

  try {

    await FetchUserByIdAndDelete(id);

    SendResponse(res, 200, "User Deleted Successfully", null, true);
  } catch (error) {
    next(error)
  }
};

const UserActivation = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  try {

    const user = await UpdateUserStatus(id, status);

    SendResponse(res, 200, `User ${status == true ? ' activated' : ' deactivated'}`, user, true)
  } catch (error) {
    next(error)
  }
}

module.exports = { SignUp, SignIn, DeleteUser, UserActivation, GetUserDetails };
