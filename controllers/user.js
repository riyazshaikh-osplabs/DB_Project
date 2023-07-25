const { SendResponse } = require("../utils/utils");
const { SignUpUserDetails, SignUpUserAccount, FetchUserDetails, DeleteUserDetails } = require("../models/dbHelper/helper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SignUp = async (req, res, next) => {
  const { Email, Password, FirstName, LastName } = req.body;

  try {

    const newUserAccount = await SignUpUserAccount(req.RoleId);

    const newUserDetails = await SignUpUserDetails(newUserAccount.UserId, Email, Password, FirstName, LastName);

    return SendResponse(res, 200, "User Registered Successfully", newUserDetails, true);
  } catch (error) {
    next(error);
  }
};

const SignIn = async (req, res, next) => {
  const Password = req.body.Password;

  try {

    const existingUser = req.existingUser;

    // comparing the password..
    const isValidPassword = await bcrypt.compare(Password, existingUser.Password);

    if (!isValidPassword) {
      return SendResponse(res, 400, "Invalid Password", null, false);
    }

    // if password is valid. creating a token with payload..
    const payload = {
      FirstName: existingUser.FirstName,
      LastName: existingUser.LastName,
      Email: existingUser.Email
    };

    // setting token expiration for only 2 minutes...
    // const expireTime = 120;

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });



    return SendResponse(res, 200, "Signin Successful", token, true);

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
