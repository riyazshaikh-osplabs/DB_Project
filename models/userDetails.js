const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");
const { UserAcccount } = require("./index")

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

    profilePicUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }

  },
  { freezeTableName: true, timestamps: false }
);

module.exports = UserDetails;
