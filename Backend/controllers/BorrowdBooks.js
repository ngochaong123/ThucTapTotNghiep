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

    // Nếu một thể loại được cung cấp, thêm điều kiện vào truy vấn
    if (category) {
        query += ` WHERE books.category = ?`;
    }

    // Chuẩn bị tham số cho câu truy vấn
    const params = category ? [category] : [];

    // Thực hiện truy vấn với các tham số đã cung cấp
    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching borrowed books:', err);
            return res.status(500).json({ error: 'Error fetching borrowed books' });
        }
        
        // Cập nhật liên kết hình ảnh
        results.forEach(borrowBook => {
            borrowBook.image_link = `/Book/${borrowBook.image_link}`;
            borrowBook.avatar_link = `/Members/${borrowBook.avatar_link}`;
        });

        // Gửi kết quả dưới dạng phản hồi
        res.json(results);
    });
};


module.exports = { getAllBorrowBooks };
