// server/routes/files.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure the folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Middleware to check JWT for protected routes
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, jwtConfig.secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// File upload endpoint
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  const { title, author, description, category, tags, requiredAccess } = req.body;
  const filePath = req.file.path;
  try {
    await pool.query(
      'INSERT INTO files (title, author, description, category, tags, required_access, file_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, author, description, category, tags, requiredAccess, filePath]
    );
    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'File upload failed' });
  }
});

// File download endpoint (with filtering and access level check)
router.get('/download', async (req, res) => {
  // The request may include query params like title, author, category, and tags
  const { title, author, category, tags } = req.query;
  let userAccessLevel = 0; // default for guest users
  if (req.headers['authorization']) {
    const token = req.headers['authorization'].split(' ')[1];
    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      // you can decide how to derive access level from user groups; for example using the highest group value
      userAccessLevel = Math.max(...decoded.accessGroups);
    } catch (error) {
      console.error('Token invalid or expired, proceeding as guest');
    }
  }
  // Build dynamic query filtering
  let query = 'SELECT * FROM files WHERE required_access <= ?';
  const params = [userAccessLevel];
  if (title) {
    query += ' AND title LIKE ?';
    params.push(`%${title}%`);
  }
  if (author) {
    query += ' AND author LIKE ?';
    params.push(`%${author}%`);
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (tags) {
    query += ' AND tags LIKE ?';
    params.push(`%${tags}%`);
  }
  try {
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving files' });
  }
});

module.exports = router;