const { SendResponse } = require("../utils/utils");
const {
  FindRoleByName,
  SignUpUserDetails,
  SignUpUserAccount,
} = require("../models/dbHelper/helper");

const CreateUserDetails = async (req, res, next) => {
  const { Email, Password, FirstName, LastName, RoleName } = req.body;
  try {
    const existingRole = await FindRoleByName(RoleName);
    if (!existingRole) {
      SendResponse(res, 400, "User role does not exist!", [], false);
    }

    const newUserDetails = SignUpUserDetails(
      Email,
      Password,
      FirstName,
      LastName
    );
    console.log("new user details", newUserDetails);

    const newUserAccount = await SignUpUserAccount(
      newUserDetails.Id,
      existingRole.RoleId
    );
    console.log("newUser Account", newUserAccount);

    SendResponse(
      res,
      200,
      "User Registered Successfully",
      newUserAccount,
      true
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { CreateUserDetails };
