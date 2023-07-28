const bcrypt = require("bcryptjs");
const { UserDetails, UserRole, UserAccount } = require("../index");
const { Op } = require("sequelize");
const { SendResponse } = require("../../utils/utils");

const FindRoleByName = async (roleName) => {
  return UserRole.findOne({ where: { Role: roleName }, });
};

const GenerateHashPassword = async (password) => {

  const salt = await bcrypt.genSalt(10);

  return bcrypt.hash(password, salt);
};

const SignUpUserDetails = async (userId, email, password, firstName, lastName) => {

  const hashedPassword = await GenerateHashPassword(password);

  return UserDetails.create({
    UserId: userId,
    Email: email,
    Password: hashedPassword,
    FirstName: firstName,
    LastName: lastName,
  });
};

const SignUpUserAccount = async (roleId) => {
  return UserAccount.create({ RoleId: roleId, });
};

const FindUserById = async (UserId) => {
  return UserAccount.findOne({ where: { UserId } });
};

const FindUserByEmail = async (Email) => {
  return UserDetails.findOne({ where: { Email } });
};

const FindUser = async (userDetails) => {
  return UserAccount.findByPk(userDetails.UserId);
};

const FetchUserDetails = async (UserId) => {

  const user = await UserDetails.findOne({
    where: { UserId },
    include: [{
      model: UserAccount,
      include: [{
        model: UserRole,
      }]
    }]
  });

  if (!user) {
    throw new Error("User Not Found!");
  }

  // check if user account is disabled or deleted then give me a message....
  const IsDeleted = user.UserAccount.IsDeleted;
  const IsDisabled = user.UserAccount.IsDisabled;

  const message = IsDeleted ? "User Account is Deleted" : IsDisabled ? "User Account is Disabled" : null;

  if (message) {
    throw new Error(message);
  }

  return {
    Email: user.Email,
    FirstName: user.FirstName,
    LastName: user.LastName,
    RoleName: user.UserAccount?.UserRole.Role ?? "null"
  };
};


const FindUserByParam = async (UserId) => {
  const user = await UserDetails.findOne({ where: { UserId } });
  return user;
};

const DeleteUserDetails = async (UserId) => {

  await UserDetails.destroy({
    where: {
      UserId: UserId
    }
  });

  await UserAccount.destroy({
    where: { UserId }
  });

  return;
};

const FetchAdminDetails = async () => {
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

  return {
    Email: adminDetails.Email,
    FirstName: adminDetails.FirstName,
    LastName: adminDetails.LastName,
    IsAdmin: adminDetails.UserAccount.IsAdmin,
    RoleId: adminDetails.UserAccount.RoleId
  };
}

const FetchNormalUsersDetails = async () => {

  const normalUsers = await UserDetails.findAll({
    attributes: ['Email', 'FirstName', 'LastName'],
    include: [{
      model: UserAccount,
      where: {
        IsAdmin: {
          [Op.not]: true
        },
      },
      attributes: ["IsAdmin", "RoleId"],
      required: true
    }],
  });

  const users = normalUsers.map((user) => ({
    Email: user.Email,
    FirstName: user.FirstName,
    LastName: user.LastName,
    IsAdmin: user?.UserAccount?.IsAdmin,
    RoleId: user?.UserAccount?.RoleId
  }))

  return users;
};


const UpdateUser = async (user, foundUser) => {

  const { FirstName, LastName, Email } = user;

  const modifiedUser = await UserDetails.update({ FirstName: FirstName, LastName: LastName, Email: Email }, {
    where: {
      Email: foundUser.Email
    }
  });

  return modifiedUser;
}

module.exports = {
  GenerateHashPassword, SignUpUserAccount, SignUpUserDetails, FindRoleByName, FindUserById, FindUserByEmail,
  FetchUserDetails, FindUserByParam, DeleteUserDetails, FindUser, FetchAdminDetails, FetchNormalUsersDetails, UpdateUser
};
