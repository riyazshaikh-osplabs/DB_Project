const { SendResponse } = require("../utils/utils");
const { UserAccount, UserRole } = require("../models/index");

const CreateUserAccount = async (req, res, next) => {
  const { UserId, Role } = req.body;
  try {
    const existingUserId = await UserAccount.findOne({ where: { UserId } });
    if (existingUserId) {
      SendResponse(res, 400, "UserId already exist!", [], false);
    }

    const existingRole = await UserRole.findOne({
      where: { Role },
    });
    if (!existingRole) {
      SendResponse(res, 400, "User role does not exist!", [], false);
    }

    // now creating user with hashed password...
    const newUser = await UserAccount.create({
      UserId,
      RoleId: existingRole.RoleId,
    });

    SendResponse(res, 200, "User Account Created Successfully", newUser, true);
  } catch (error) {
    next(error);
  }
};

module.exports = { CreateUserAccount };
