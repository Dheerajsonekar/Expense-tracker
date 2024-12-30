const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "payment",
  }
);

module.exports = Payment;
