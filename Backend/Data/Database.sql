-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS library_management;

-- Sử dụng cơ sở dữ liệu vừa tạo
USE library_management;

-- Tạo bảng users (tài khoản người dùng)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Nên được mã hóa
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_code VARCHAR(255) NOT NULL,
    book_name VARCHAR(255) NOT NULL,
    image_link VARCHAR(255) NOT NULL, -- Đường dẫn đến hình ảnh
    quantity INT NOT NULL,
    category VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    publication_year YEAR NOT NULL,
    received_date DATE NOT NULL
);

-- Thêm tài khoản người dùng (users)
INSERT INTO users (username, password, email) VALUES 
('admin1', 'Tien%123', 'admin1@library.com'), 
('librarian1', '123456', 'librarian1@library.com'), 
('member1', '123456', 'member1@library.com');

-- Thêm dữ liệu sách (books)
INSERT INTO books (book_code, book_name, image_link, quantity, category, author, location, publication_year, received_date)
VALUES 
('BK001', 'Harry Potter and the Philosopher', 'TuyetTac.png', 10, 'Fantasy', 'J.K. Rowling', 'Aisle 1', 1997, '2023-01-15'),
('BK002', 'The Great Gatsby', 'TuyetTac.png', 5, 'Classic', 'F. Scott Fitzgerald', 'Aisle 2', 1925, '2023-02-20'),
('BK003', 'To Kill a Mockingbird', 'TuyetTac.png', 8, 'Fiction', 'Harper Lee', 'Aisle 3', 1960, '2023-03-10');
