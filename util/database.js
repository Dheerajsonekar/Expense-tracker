const Sequelize = require('sequelize');

const sequilize = new Sequelize(process.env.db_database, process.env.db_user, process.env.db_password, {
    dialect: process.env.db_dialect,
    host: process.env.db_host
})


module.exports = sequilize;