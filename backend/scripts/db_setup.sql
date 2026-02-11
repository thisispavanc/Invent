CREATE DATABASE IF NOT EXISTS tanuh_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'tanuh_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON tanuh_inventory.* TO 'tanuh_user'@'localhost';
FLUSH PRIVILEGES;
