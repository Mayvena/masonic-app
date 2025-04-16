// server/routes/profile.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

// Middleware to check JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, jwtConfig.secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Get profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email, phone, profession, masonic_degree, lodge_position, profile_photo FROM users WHERE id = ?', [req.user.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving profile' });
  }
});

// Update profile
router.put('/', authenticateToken, async (req, res) => {
  const { email, phone, profession, masonic_degree, lodge_position, profile_photo } = req.body;
  try {
    await pool.query(
      'UPDATE users SET email = ?, phone = ?, profession = ?, masonic_degree = ?, lodge_position = ?, profile_photo = ? WHERE id = ?',
      [email, phone, profession, masonic_degree, lodge_position, profile_photo, req.user.id]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Profile update failed' });
  }
});

module.exports = router;