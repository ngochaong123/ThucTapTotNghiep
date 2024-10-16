const db = require('../Data/Database'); // Đảm bảo đường dẫn này đúng với cấu trúc dự án của bạn

// Hàm lấy tất cả sách
const getAllBooks = (req, res) => {
    const { category } = req.query;
    let sql = 'SELECT * FROM books';
    const params = [];

    // Nếu có tham số category, thêm điều kiện tìm kiếm
    if (category) {
        sql += ' WHERE category = ?';
        params.push(category);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error fetching books data: ', err);
            return res.status(500).json({ error: 'Error fetching books data' });
        }
        // Điều chỉnh đường dẫn hình ảnh cho đúng
        results.forEach(book => {
            book.image_link = `/Book/${book.image_link}`;
        });
        res.json(results);
    });
};

const searchBooks = (req, res) => {
    const { keyword } = req.query; // Lấy từ khóa tìm kiếm từ query params

    const sql = `
        SELECT * 
        FROM books 
        WHERE book_name LIKE ? OR author LIKE ?
    `;

    const searchKeyword = `%${keyword}%`; // Tìm kiếm theo chuỗi chứa từ khóa

    db.query(sql, [searchKeyword, searchKeyword], (err, results) => {
        if (err) {
            console.error('Error searching books: ', err);
            return res.status(500).json({ error: 'Error searching books' });
        }
        results.forEach(book => {
            book.image_link = `/Book/${book.image_link}`; // Điều chỉnh đường dẫn ảnh
        });
        res.json(results);
    });
};

module.exports = { getAllBooks, searchBooks  };
