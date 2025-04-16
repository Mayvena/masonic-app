// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { User, AccessGroup } = require('../models'); // using Sequelize models

// Register new user with robust model and access groups (an array of group names)
router.post('/register', async (req, res) => {
  const { username, password, email, accessGroups } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user record
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    // If accessGroups is provided, associate the user with those groups
    if (accessGroups && Array.isArray(accessGroups)) {
      // Find or create each access group and add the association
      for (const groupName of accessGroups) {
        const [group, created] = await AccessGroup.findOrCreate({
          where: { name: groupName },
          defaults: { accessLevel: 1 } // Set a default accessLevel, adjust as needed
        });
        await user.addAccessGroup(group);
      }
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// Login endpoint using Sequelize
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ 
      where: { username },
      include: [{
        model: AccessGroup,
        attributes: ['name', 'accessLevel'],
        through: { attributes: [] }
      }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Calculate effective access by determining the highest access level among user's groups
    const accessLevels = user.AccessGroups.map((group) => group.accessLevel);
    const effectiveAccessLevel = accessLevels.length > 0 ? Math.max(...accessLevels) : 0;

    const payload = {
      id: user.id,
      username: user.username,
      effectiveAccessLevel,
      // Optionally include groups:
      groups: user.AccessGroups.map(g => ({ name: g.name, accessLevel: g.accessLevel }))
    };

    const token = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;