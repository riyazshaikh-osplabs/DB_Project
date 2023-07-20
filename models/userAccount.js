const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");
const { UserRole } = require("./index");
const { generateDate } = require("../utils/utils");

const UserAccount = sequelize.define(
  "UserAccount",
  {
    UserId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    CreatedOn: {
      type: DataTypes.DATE,
      defaultValue: () => generateDate(),
      allowNull: true,
    },

    LastLoginIn: {
      type: DataTypes.DATE,
      defaultValue: () => generateDate(),
      allowNull: true,
    },

    IsDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },

    IsDisabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },

    RoleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: UserRole,
        key: "RoleId",
      },
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = { UserAccount };
