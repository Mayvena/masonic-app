CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  -- store the hashed password
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),               -- optional; can be null if not provided
  profession VARCHAR(100),
  masonic_degree VARCHAR(50),
  lodge_position VARCHAR(50),
  profile_photo VARCHAR(255),      -- store URL or path to the profile photo
  access_groups JSON,              -- JSON structure to hold multiple access groups/degrees
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  tags VARCHAR(255),             -- comma separated tags; you could also use JSON if preferred
  required_access INT DEFAULT 0,   -- 0 for guest access; higher numbers indicate restricted access
  file_path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room VARCHAR(50) NOT NULL,       -- e.g., "global" or a specific room name
  sender_id INT NOT NULL,          -- references the users.id value for the message sender
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;