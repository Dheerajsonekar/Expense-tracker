const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Notes = sequelize.define("notes", {
    note:{
        type:DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Notes;