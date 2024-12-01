const db = require('../Data/Database'); // Kết nối đến cơ sở dữ liệu

const getAllreturnBooks = (req, res) => {
    const query = `
        SELECT  
            returnBook.returnBook_id,
            members.member_code,  
            members.name, 
            members.avatar_link, 
            books.book_code,
            books.category, 
            books.image_link, 
            books.book_name, 
            borrowBooks.quantity, 
            borrowBooks.borrowDate, 
            borrowBooks.returnDate,      
            returnBook.PenaltyFees,     
            returnBook.Status           
        FROM 
            borrowBooks 
        JOIN 
            members ON borrowBooks.member_code = members.member_code
        JOIN 
            books ON borrowBooks.book_code = books.book_code
        JOIN 
            returnBook ON borrowBooks.borrowBooks_id = returnBook.borrowBooks_id   
        ORDER BY 
            members.member_code;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching borrowed books:', err);
            return res.status(500).json({ error: 'Error fetching borrowed books' });
        }
        
        // Chỉ thay đổi đường dẫn hình ảnh
        results.forEach(returnBooks => {
            returnBooks.image_link = `/Book/${returnBooks.image_link}`;  // Đảm bảo đường dẫn đúng
            returnBooks.avatar_link = `/Members/${returnBooks.avatar_link}`;
        });

        res.json(results);  // Trả về kết quả dưới dạng JSON
    });
};

const getStatuses = (req, res) => {
    const query = 'SELECT DISTINCT Status FROM returnBook';
  
    db.query(query, (err, result) => {
        if (err) {
        console.error('Error fetching statuses:', err);
        return res.status(500).json({ message: 'Lỗi truy vấn trạng thái' });
        }
        return res.json(result);  // Trả về danh sách các trạng thái duy nhất
    });
};

module.exports = { getAllreturnBooks, getStatuses };
