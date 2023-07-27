'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserAccount.init({
    UserId: DataTypes.INTEGER,
    CreatedOn: DataTypes.DATE,
    LastLoginIn: DataTypes.DATE,
    IsDeleted: DataTypes.BOOLEAN,
    IsDisabled: DataTypes.BOOLEAN,
    IsAdmin: DataTypes.BOOLEAN,
    RoleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserAccount',
  });
  return UserAccount;
};