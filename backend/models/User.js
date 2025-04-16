// server/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    unique: {
      args: true,
      msg: 'Username already in use!'
    },
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Username is required.' },
      len: {
        args: [3, 50],
        msg: 'Username must be between 3 and 50 characters long.'
      }
    },
  },
  email: {
    type: DataTypes.STRING(100),
    unique: {
      args: true,
      msg: 'Email address already registered!'
    },
    allowNull: false,
    validate: {
      isEmail: { msg: 'Must be a valid email address.' },
      notEmpty: { msg: 'Email is required.' }
    },
  },
  password: {
    type: DataTypes.STRING(255), // stores the hashed password
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password is required.' },
      len: {
        args: [6, 255],
        msg: 'Password must be at least 6 characters long.'
      }
    },
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      notEmpty: { msg: 'If provided, phone cannot be empty.' }
    }
  },
  profession: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  masonicDegree: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  lodgePosition: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  profilePhoto: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: { msg: 'Profile photo must be a valid URL.' }
    },
  },
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        // Hash the password before storing it
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      // Only hash the password if it was changed
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

module.exports = User;