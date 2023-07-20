const bcrypt = require("bcryptjs");
const { UserDetails, UserRole, UserAccount } = require("../index");

const FindRoleByName = async (roleName) => {
  return UserRole.findOne({
    where: { Role: roleName },
  });
};

const GenerateHashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);

  return bcrypt.hash(password, salt);
};

const SignUpUserDetails = async (email, password, firstName, lastName) => {
  const hashedPassword = await GenerateHashPassword(password);

  return UserDetails.create({
    UserId: 23,
    Email: email,
    Password: hashedPassword,
    FirstName: firstName,
    LastName: lastName,
  });
};

const SignUpUserAccount = async (userDetailsId, roleId) => {
  return UserAccount.create({
    UserId: userDetailsId,
    RoleId: roleId,
  });
};

module.exports = {
  GenerateHashPassword,
  SignUpUserAccount,
  SignUpUserDetails,
  FindRoleByName,
};
