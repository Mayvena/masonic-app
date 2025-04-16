// server/models/index.js
const User = require('./User');
const AccessGroup = require('./AccessGroup');
const UserAccessGroup = require('./UserAccessGroup');

// Establish many-to-many relation
User.belongsToMany(AccessGroup, { through: UserAccessGroup });
AccessGroup.belongsToMany(User, { through: UserAccessGroup });

module.exports = { User, AccessGroup, UserAccessGroup };