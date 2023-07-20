const { UserAccount } = require("./userAccount");
const { UserDetails } = require("./userDetails");
const { UserRole } = require("./userRole");

// UserAccount.hasOne(UserRole, {
//   foreignKey: "RoleId",
//   targetKey: "RoleId",
// });

UserDetails.belongsTo(UserAccount, {
  foreignKey: "UserId",
  targetKey: "UserId",
});

module.exports = { UserAccount, UserDetails, UserRole };
