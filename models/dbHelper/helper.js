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
  return UserAccount.create({
    RoleId: roleId,
  });
};

const FindUserById = async (UserId) => {
  return UserAccount.findOne({ where: { UserId } })
}

const FindUserByEmail = async (Email) => {
  return UserDetails.findOne({ where: { Email } })
}

const FindUser = async (userDetails) => {
  return UserAccount.findByPk(userDetails.UserId);
}

const FetchUserDetails = async (UserId) => {
  // const response = await UserRole.findAll({});
  // const user = await UserDetails.findOne({
  //   where: { UserId },
  //   include: [{
  //     model: UserAccount,
  //     include: [{
  //       model: UserRole,
  //       attributes: ['Role']
  //     }]
  //   }]
  // });

  // const response = await UserAccount.findByPk(UserId)
  // const RoleId = response.RoleId;
  // console.log(response);
  // const role = await UserRole.findOne({
  //   where: { RoleId }
  // })


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

  return {
    Email: user.Email,
    FirstName: user.FirstName,
    LastName: user.LastName,
    RoleName: user.UserAccount?.UserRole.Role ?? "null"
  };
}

const FetchUserByIdAndDelete = async (UserId) => {
  const user = await UserAccount.findOne({ where: { UserId } });
  if (!user) {
    throw new Error("User Not Found");
  }
  // console.log("before", user);
  await user.update({ IsDeleted: true });
  // console.log("after", user);
  return;
}

const UpdateUserStatus = async (UserId, status) => {
  console.log(UserId, typeof status)
  const user = await UserAccount.findOne({ where: { UserId } });
  if (!user) {
    throw new Error("User Not Found");
  }

  await user.update({ IsDisabled: status })
  console.log(user);
  return user;

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
  FindUser
};
