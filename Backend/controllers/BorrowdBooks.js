const db = require('../Data/Database'); // Kết nối đến cơ sở dữ liệu

// Hàm xác thực dữ liệu sách
const validateBookData = (data) => {
    const { book_name, book_code, author, category, quantity, location, language } = data;
    return book_name && book_code && author && category && quantity && location && language;
};

// Hàm lấy tất cả sách đã mượn
const getAllBorrowBooks = (req, res) => {
    const category = req.query.category; 
    let query = `
        SELECT 
            members.member_code, 
            members.name, 
            members.avatar_link, 
            books.category, 
            books.image_link, 
            books.book_name, 
            borrowBooks.quantity, 
            borrowBooks.borrowDate, 
            borrowBooks.returnDate
        FROM 
            borrowBooks 
        JOIN 
            members ON borrowBooks.member_code = members.member_code
        JOIN 
            books ON borrowBooks.book_code = books.book_code
    `;

    if (category) {
        query += ` WHERE books.category = ?`;
    }

    query += ' ORDER BY member_code';

    const params = category ? [category] : [];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching borrowed books:', err);
            return res.status(500).json({ error: 'Error fetching borrowed books' });
        }
        
        results.forEach(borrowBook => {
            borrowBook.image_link = `/Book/${borrowBook.image_link}`;
            borrowBook.avatar_link = `/Members/${borrowBook.avatar_link}`;
        });

        res.json(results);
    });
};

// Hàm lấy thông tin thành viên theo mã thành viên
const getMemberByCode = (req, res) => {
    const { member_code } = req.params;
    db.query('SELECT name FROM members WHERE member_code = ?', [member_code], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error fetching member information' });
        if (result.length > 0) res.json(result[0]);
        else res.status(404).json({ message: 'Không tìm thấy thành viên' });
    });
};

// Hàm lấy thông tin sách theo mã sách
const getBookByCode = (req, res) => {
    const { book_code } = req.params;
    db.query('SELECT book_name, category, image_link FROM books WHERE book_code = ?', [book_code], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error fetching book information' });

        if (result.length > 0) {
            // Prefix the image link with the public path
            const bookData = result[0];
            bookData.image_link = `/Book/${bookData.image_link}`; // Adjust the path as needed

            res.json(bookData);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sách' }); 
        }
    });
};

// Hàm lưu thông tin mượn sách
const addborrowBook = (req, res) => {
    const { member_code, book_code, quantity, borrowDate, returnDate } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!member_code || !book_code || !quantity || !borrowDate || !returnDate) {
        return res.status(400).json({ error: 'Thiếu dữ liệu mượn sách' });
    }

    // Câu truy vấn chèn dữ liệu vào bảng borrowBooks
    const query = `
        INSERT INTO borrowBooks (member_code, book_code, quantity, borrowDate, returnDate) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const params = [member_code, book_code, quantity, borrowDate, returnDate];

    // Thực hiện truy vấn
    db.query(query, params, (err) => {
        if (err) return res.status(500).json({ error: 'Lỗi khi lưu thông tin mượn sách' });
        res.json({ message: 'Lưu thông tin mượn sách thành công' });
    });
};

module.exports = { getAllBorrowBooks, getMemberByCode, getBookByCode, addborrowBook };
