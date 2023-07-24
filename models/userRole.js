const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const UserRole = sequelize.define(
  "UserRole",
  {
    RoleId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },

    Role: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = UserRole;
