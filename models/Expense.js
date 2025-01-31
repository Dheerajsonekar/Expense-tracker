const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const expense = sequelize.define(
  "expense",
  {
    expenseType: {
      type:DataTypes.STRING,
      allowNull: false
    },
    
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
  },
  {
    tableName: "expense",
  }
);

module.exports = expense;
