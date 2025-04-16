// server/routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwtConfig = require('../config/jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register new user
router.post('/register', async (req, res) => {
  const { username, password, email, accessGroups } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert user into the database (assumes a users table with a JSON or serialized column for accessGroups)
    const [result] = await pool.query(
      'INSERT INTO users (username, password, email, access_groups) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, JSON.stringify(accessGroups)]
    );
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = {
      id: user.id,
      username: user.username,
      accessGroups: JSON.parse(user.access_groups) // stored as JSON
    };
    const token = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;