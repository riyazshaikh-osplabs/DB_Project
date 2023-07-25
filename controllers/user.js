const { SendResponse } = require("../utils/utils");
const { SignUpUserDetails, SignUpUserAccount, FetchUserDetails, DeleteUserDetails } = require("../models/dbHelper/helper");
const bcrypt = require("bcryptjs");

const SignUp = async (req, res, next) => {
  const { Email, Password, FirstName, LastName } = req.body;

  try {

    // const existingUser = await FindUserByEmail(Email);
    // if (existingUser) {
    //   return SendResponse(res, 400, "User Already Exists!", null, false);
    // }

    // const existingRole = await FindRoleByName(RoleName);
    // if (!existingRole) {
    //   return SendResponse(res, 400, "User Role DoesNot Exists!", null, false);
    // }

    const newUserAccount = await SignUpUserAccount(req.RoleId);
    // console.log("newUserAccount", newUserAccount);

    const newUserDetails = await SignUpUserDetails(newUserAccount.UserId, Email, Password, FirstName, LastName);
    // console.log("newUserDetails", newUserDetails);

    return SendResponse(res, 200, "User Registered Successfully", newUserDetails, true);
  } catch (error) {
    next(error);
  }
};

const SignIn = async (req, res, next) => {
  const { Password } = req.body;

  try {
    // const existingUser = await FindUserByEmail(Email);

    // if (!existingUser) {
    //   return SendResponse(res, 404, "User Not Found!", null, false);
    // }
    const existingUser = req.existingUser;
    // const user = await FindUser(existingUser);

    // if (!user) {
    //   return SendResponse(res, 404, "User Not Found!", null, false);
    // }

    // if user is deleted or disabled then prevent login....
    // if (user.IsDeleted || user.IsDisabled) {
    //   const message = user.IsDeleted ? "User Account is Deleted!" : "User Account is Disabled";
    //   return SendResponse(res, 403, message, null, false);
    // }

    // comparing the password..
    const isValidPassword = await bcrypt.compare(Password, existingUser.Password);

    if (!isValidPassword) {
      return SendResponse(res, 400, "Invalid Password", null, false);
    }

    // if password is valid...
    return SendResponse(res, 200, "Signin Successful", existingUser, true);

  } catch (error) {
    next(error);
  }
};

const GetUserDetails = async (req, res, next) => {

  const id = parseInt(req.params.id);

  try {

    const usersDetails = await FetchUserDetails(id);

    return SendResponse(res, 200, "User Details", usersDetails, true);
  } catch (error) {
    next(error);
  }
};

const DeleteUser = async (req, res, next) => {

  try {

    // await FetchUserByIdAndDelete(id);
    const user = req.foundUser;

    await user.update({ IsDeleted: true });


    SendResponse(res, 200, "User Deleted Successfully", null, true);
  } catch (error) {
    next(error);
  }
};

const UserActivation = async (req, res, next) => {
  const status = req.body.status;

  try {

    const user = req.foundUser;

    console.log(user);

    user.update({ IsDisabled: status });

    return SendResponse(res, 200, `User ${user.IsDisabled == true ? ' deactivated' : ' activated'}`, user, true);
  } catch (error) {
    next(error);
  }
};


const UpdateUser = async (req, res, next) => {

  // const UserId = parseInt(req.params.id);
  const { FirstName, LastName, Email } = req.body;

  try {

    const user = req.foundUser;

    await user.update({ FirstName: FirstName, LastName: LastName, Email: Email });

    return SendResponse(res, 200, "User Updated Successfully", user, true);
  } catch (error) {
    next(error);
  }
}

const PermanentDeleteUser = async (req, res, next) => {

  const UserId = parseInt(req.params.id);
  try {

    await DeleteUserDetails(UserId);

    return SendResponse(res, 200, "User Deleted Successfully!", null, true);
  } catch (error) {
    next(error);
  }
};

module.exports = { SignUp, SignIn, DeleteUser, UserActivation, GetUserDetails, PermanentDeleteUser, UpdateUser };
