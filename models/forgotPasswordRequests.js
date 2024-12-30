const { DataTypes } = require("sequelize");
const Sequelize = require("../util/database");

const forgotPasswordRequests = Sequelize.define("forgotPasswordRequests", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = forgotPasswordRequests;
