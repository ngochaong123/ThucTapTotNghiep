const db = require('../Data/Database'); // Kết nối đến cơ sở dữ liệu
const multer = require('multer'); // Thư viện multer để xử lý upload file
const path = require('path'); // Thư viện path để xử lý đường dẫn
const fs = require('fs'); // Thư viện fs để làm việc với file hệ thống
const { v4: uuidv4 } = require('uuid'); // Thư viện để tạo UUID

// Cấu hình multer để lưu hình ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'Public', 'Book')); // Đường dẫn lưu file
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`); // Tạo tên file duy nhất
    }
});

// Đảm bảo rằng trường 'image_link' tồn tại trong form gửi lên
const bookUpload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'image_link') {
            cb(null, true); // Chấp nhận file
        } else {
            cb(new multer.MulterError('Unexpected field')); // Trả về lỗi nếu không đúng tên trường
        }
    }
});

// Hàm kiểm tra dữ liệu đầu vào
const validateBookData = (data) => {
    const { book_name, book_code, author, category, quantity, location, language } = data;
    return book_name && book_code && author && category && quantity && location && language;
};

// Hàm lấy tất cả sách
const getAllBooks = (req, res) => {
    const { category } = req.query; // Lấy tham số category từ query
    let sql = 'SELECT * FROM books'; // Câu truy vấn cơ bản
    const params = [];

    if (category) {
        sql += ' WHERE category = ?'; // Thêm điều kiện nếu có category
        params.push(category);
    }

    sql += ' ORDER BY location'; // Sắp xếp theo location

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error fetching books data: ', err);
            return res.status(500).json({ error: 'Error fetching books data' });
        }
        
        results.forEach(book => {
            book.image_link = `/Book/${book.image_link}`; // Cập nhật link hình ảnh
        });

        res.json(results); // Trả về danh sách sách
    });
};

// Hàm tìm kiếm sách
const searchBooks = (req, res) => {
    const { keyword } = req.query; // Lấy tham số keyword từ query
    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);

    const sql = `SELECT * FROM books WHERE book_name LIKE ? OR author LIKE ?`; // Câu truy vấn tìm kiếm
    const searchKeyword = `%${keyword}%`; // Tạo từ khóa tìm kiếm

    db.query(sql, [searchKeyword, searchKeyword], (err, results) => {
        if (err) {
            console.error('Error searching books: ', err);
            return res.status(500).json({ error: 'Error searching books' });
        }
        results.forEach(book => {
            book.image_link = `/Book/${book.image_link}`; // Cập nhật link hình ảnh
        });
        res.json(results); // Trả về kết quả tìm kiếm
    });
};

// Hàm thêm sách
const addBook = (req, res) => {
    if (!validateBookData(req.body)) { // Kiểm tra dữ liệu đầu vào
        return res.status(400).json({ message: 'Tất cả các trường là bắt buộc!' });
    }

    const { book_name, book_code, author, category, quantity, location, language, received_date } = req.body;
    const image_link = req.file ? req.file.filename : null; // Lấy tên file hình ảnh

    const sql = `INSERT INTO books (book_code, book_name, author, category, quantity, location, language, received_date, image_link) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [book_code, book_name, author, category, quantity, location, language, received_date, image_link];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting book:', err);
            if (req.file) { // Xóa file đã upload nếu có lỗi
                const filePath = path.join(__dirname, '..', 'Public', 'Book', req.file.filename);
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
                });
            }
            return res.status(500).json({ error: 'Error inserting book' });
        }
        res.status(201).json({ message: 'Book added successfully', bookId: result.insertId }); // Trả về thông báo thành công
    });
};

// Hàm chỉnh sửa sách
const editBook = (req, res) => {
    const { book_code } = req.params;
    const { book_name, author, category, quantity, location, language, received_date } = req.body;
    const new_image_link = req.file ? req.file.filename : null;

    // Log kiểm tra giá trị của req.file
    console.log("book code: ", req.params);
    console.log("image: ", req.body);
    console.log("data: ", new_image_link);

    if (!book_code || !book_name || !author) {
        return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    if (!validateBookData(req.body)) {
        return res.status(400).json({ message: 'Tất cả các trường là bắt buộc!' });
    }

    let formattedReceivedDate = null;
    if (received_date) {
        const date = new Date(received_date);
        formattedReceivedDate = date.toISOString().split('T')[0];
    }

    const sql = `SELECT image_link FROM books WHERE book_code = ?`;

    db.query(sql, [book_code], (err, results) => {
        if (err) {
            console.error('Error finding book:', err);
            return res.status(500).json({ error: 'Error finding book' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sách với mã này.' });
        }

        const old_image_link = results[0].image_link;

        const updateSql = `
            UPDATE books 
            SET 
                book_name = ?, 
                author = ?, 
                category = ?, 
                quantity = ?, 
                location = ?, 
                language = ?, 
                received_date = COALESCE(?, received_date), 
                image_link = COALESCE(?, image_link) 
            WHERE 
                book_code = ?`;

        const values = [book_name, author, category, quantity, location, language, formattedReceivedDate, new_image_link, book_code];

        db.query(updateSql, values, (err, result) => {
            if (err) {
                console.error('Error updating book:', err);
                return res.status(500).json({ error: 'Error updating book' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Không tìm thấy sách với mã này.' });
            }

            // Xóa ảnh cũ nếu có ảnh mới
            if (new_image_link) {
                const oldImagePath = path.join(__dirname, '..', 'Public', 'Book', old_image_link);
                fs.unlink(oldImagePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting old image:', unlinkErr);
                });
            }

            res.status(200).json({ message: 'Book updated successfully' });
        });
    });
};

// Xuất các hàm và middleware
module.exports = { getAllBooks, searchBooks, addBook, editBook, bookUpload };
