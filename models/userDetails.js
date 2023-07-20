const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");
const { UserAcccount } = require("./index");

const UserDetails = sequelize.define(
  "UserDetails",
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserAcccount,
        key: "UserId",
      },
    },

    Email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = { UserDetails };
