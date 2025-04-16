const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // attach socket.io

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const profileRoutes = require('./routes/profile');

const sequelize = require('./config/db');
const { User, AccessGroup } = require('./models');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve file uploads (if storing them on disk, e.g., in /uploads)
app.use('/uploads', express.static('uploads'));

// Mount the API routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/profile', profileRoutes);

// Sync models with database
sequelize.sync({ alter: true })  // alter: true will update tables as needed; use { force: true } to drop & re-create tables in development
  .then(() => console.log('Database synchronized'))
  .catch((error) => console.error('Database sync error:', error));

// Socket.io chat configuration
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Join room based on user id or a global room
  socket.on('join', (data) => {
    socket.join(data.room);
  });

  // Broadcast incoming messages to room
  socket.on('chatMessage', (data) => {
    io.to(data.room).emit('chatMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});