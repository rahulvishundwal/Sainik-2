-- Sainik Defense College Database Schema for MySQL
-- Run this SQL in your Render MySQL database

-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create news table for news bulletin
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user
-- Email: admin@sainikdefense.com
-- Password: admin123 (CHANGE THIS AFTER FIRST LOGIN!)
-- Hash generated using: bcrypt.hash('admin123', 10)
INSERT INTO users (email, password, role) VALUES 
('admin@sainikdefense.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1XbRwu0wHw8vGF0dQhWQmJKLHGHqJq2', 'admin')
ON DUPLICATE KEY UPDATE email=email;

-- Note: The password hash above is for 'admin123'
-- To generate your own password hash, use this Node.js code:
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('your-password', 10);
-- console.log(hash);

-- Insert sample news items
INSERT INTO news (title, content, date) VALUES 
('Admission Open 2026-27', 'Admissions are now open for the academic year 2026-27. Visit our office for application forms.', NOW()),
('Annual Sports Day', 'Annual Sports Day will be celebrated on March 15, 2026. All students must participate.', NOW()),
('Exam Schedule Released', 'Final examination schedule for class 10th and 12th has been uploaded. Check notice board.', NOW())
ON DUPLICATE KEY UPDATE title=title;

-- Verify tables created
SHOW TABLES;

-- Display sample data
SELECT * FROM users;
SELECT * FROM news;
