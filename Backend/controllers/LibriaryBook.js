const db = require('../Data/Database'); 
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'Public', 'Book'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Hàm lấy tất cả sách
const getAllBooks = (req, res) => {
    const { category } = req.query;
    let sql = 'SELECT * FROM books';
    const params = [];

    // Kiểm tra xem có category hay không
    if (category) {
        sql += ' WHERE category = ?';
        params.push(category);
    }

    // Thêm điều kiện ORDER BY sau khi đã xác định điều kiện WHERE
    sql += ' ORDER BY location';

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error fetching books data: ', err);
            return res.status(500).json({ error: 'Error fetching books data' });
        }
        
        // Cập nhật link hình ảnh cho từng sách
        results.forEach(book => {
            book.image_link = `/Book/${book.image_link}`;
        });

        res.json(results);
    });
};


// Hàm tìm kiếm sách
const searchBooks = (req, res) => {
    const { keyword } = req.query;

    const sql = `SELECT * FROM books WHERE book_name LIKE ? OR author LIKE ?`;
    const searchKeyword = `%${keyword}%`;

    db.query(sql, [searchKeyword, searchKeyword], (err, results) => {
        if (err) {
            console.error('Error searching books: ', err);
            return res.status(500).json({ error: 'Error searching books' });
        }
        results.forEach(book => {
            book.image_link = `/Book/${book.image_link}`;
        });
        res.json(results);
    });
};

// Hàm thêm sách
const addBook = (req, res) => {
    const { book_name, book_code, author, category, quantity, location, language, received_date } = req.body;

    // Kiểm tra dữ liệu hợp lệ
    if (!book_name || !book_code || !author || !category || !quantity || !location || !language) {
        return res.status(400).json({ message: 'Tất cả các trường là bắt buộc!' });
    }

    const image_link = req.file ? req.file.filename : null; // Chỉ lấy tên tệp nếu có

    // Truy vấn để thêm sách vào MySQL
    let sql = `INSERT INTO books (book_code, book_name, author, category, quantity, location, language, received_date, image_link) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [book_code, book_name, author, category, quantity, location, language, received_date, image_link];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting book:', err);
            // Nếu có lỗi trong việc thêm sách, xóa tệp hình ảnh đã tải lên nếu có
            if (req.file) {
                const fs = require('fs');
                const filePath = path.join(__dirname, '..', 'Public', 'Book', req.file.filename);
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
                });
            }
            return res.status(500).json({ error: 'Error inserting book' });
        }
        res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
    });
};

// Hàm cập nhật thông tin sách
const updateBook = async (req, res) => {
    const { book_code } = req.params;
    const updatedData = req.body; // This will include the form data sent in the request

    try {
        // Your logic to find the book by book_code and update it
        // For example:
        const book = await Book.findOneAndUpdate({ code: book_code }, updatedData, { new: true });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json({ message: 'Book updated successfully', book });
    } catch (error) {
        console.error('Error updating book:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getAllBooks, searchBooks, addBook,updateBook ,upload };
