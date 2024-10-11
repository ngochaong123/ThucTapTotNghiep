-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS library_management;

-- Sử dụng cơ sở dữ liệu vừa tạo
USE library_management;

-- Tạo bảng users (tài khoản người dùng)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thêm tài khoản người dùng (users)
INSERT INTO users (username, password, email) VALUES 
('admin1', 'Tien%123', 'admin1@library.com'), 
('librarian1', '123456', 'librarian1@library.com'), 
('member1', '123456', 'member1@library.com');
