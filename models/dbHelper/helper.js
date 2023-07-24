const bcrypt = require("bcryptjs");
const { UserDetails, UserRole, UserAccount } = require("../index");
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

const FetchUserByIdAndDelete = async (UserId) => {
  const user = await UserAccount.findOne({ where: { UserId } });
  if (!user) {
    throw new Error("User Not Found");
  }
  // console.log("before", user);
  await user.update({ IsDeleted: true });
  // console.log("after", user);
  return;
};

const UpdateUserStatus = async (UserId, status) => {

  const user = await UserAccount.findOne({ where: { UserId } });
  if (!user) {
    throw new Error("User Not Found");
  }

  await user.update({ IsDisabled: status })
  // console.log(user);
  return user;
};

const FindUserByParam = async (UserId) => {
  const user = await UserDetails.findOne({ where: { UserId } });
  return user;
};

const DeleteUserDetails = async (UserId) => {

  const user = await UserDetails.findOne({ where: { UserId } });

  if (!user) {
    throw new Error("User Not Found!")
  }

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

module.exports = {
  GenerateHashPassword,
  SignUpUserAccount,
  SignUpUserDetails,
  FindRoleByName,
  FindUserById,
  FindUserByEmail,
  FetchUserDetails,
  FetchUserByIdAndDelete,
  UpdateUserStatus,
  FindUserByParam,
  DeleteUserDetails,
  FindUser
};
