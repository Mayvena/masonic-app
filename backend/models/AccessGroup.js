const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AccessGroup = sequelize.define('AccessGroup', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  accessLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // 0 = guest-level by default
  },
}, {
  tableName: 'access_groups',
  timestamps: false,
});

module.exports = AccessGroup;