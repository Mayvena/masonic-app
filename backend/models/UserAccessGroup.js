// server/models/UserAccessGroup.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const AccessGroup = require('./AccessGroup');

const UserAccessGroup = sequelize.define('UserAccessGroup', {
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  AccessGroupId: {
    type: DataTypes.INTEGER,
    references: {
      model: AccessGroup,
      key: 'id',
    },
  },
}, {
  tableName: 'user_access_groups',
  timestamps: false,
});

module.exports = UserAccessGroup;