const Sequelize = require('sequelize');

const sequilize = new Sequelize('node-complete', 'root', 'Kalki@151', {
    dialect: 'mysql',
    host: 'localhost'
})


module.exports = sequilize;