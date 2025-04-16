// server/config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('your_database_name', 'your_mysql_username', 'your_mysql_password', {
  host: 'localhost',
  dialect: 'mysql',  // use 'mysql'
  logging: false,    // disable logging; change to console.log for debug
});

module.exports = sequelize;