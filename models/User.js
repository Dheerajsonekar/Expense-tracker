const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define(
  "user",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    tableName: "user",
  }
);

module.exports = User;
