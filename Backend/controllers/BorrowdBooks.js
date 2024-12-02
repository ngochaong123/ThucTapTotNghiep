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
            borrowBooks.borrowBooks_id ,
            members.member_code, 
            members.name, 
            members.avatar_link, 
            books.book_code,
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
            const bookData = result[0];
            bookData.image_link = `/Book/${bookData.image_link}`;

            res.json(bookData);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sách' }); 
        }
    });
};
 
// Hàm lưu thông tin mượn sách
const addborrowBook = (req, res) => {
    const { borrowBooks_id, member_code, book_code, quantity, borrowDate, returnDate } = req.body;

    if (!borrowBooks_id || !member_code || !book_code || !quantity || !borrowDate || !returnDate) {
        return res.status(400).json({ error: 'Thiếu dữ liệu mượn sách' });
    }

    const checkQuantityQuery = 'SELECT quantity FROM books WHERE book_code = ?';
    db.query(checkQuantityQuery, [book_code], (err, results) => {
        if (err) return res.status(500).json({ error: 'Lỗi khi kiểm tra số lượng sách' });

        const availableQuantity = results[0]?.quantity;

        if (availableQuantity < quantity) {
            return res.status(400).json({ error: 'Số lượng sách không đủ để mượn' });
        }

        const checkBorrowedQuery = 'SELECT * FROM borrowBooks WHERE member_code = ? AND book_code = ?';
        db.query(checkBorrowedQuery, [member_code, book_code], (err, borrowResults) => {
            if (err) return res.status(500).json({ error: 'Lỗi khi kiểm tra mượn sách' });

            if (borrowResults.length > 0) {
                return res.status(400).json({ error: 'Thành viên đã mượn cuốn sách này' });
            }

            const borrowQuery = `
                INSERT INTO borrowBooks (borrowBooks_id, member_code, book_code, quantity, borrowDate, returnDate) 
                VALUES ( ?, ?, ?, ?, ?, ?)
            `;
            const params = [borrowBooks_id, member_code, book_code, quantity, borrowDate, returnDate];

            db.query(borrowQuery, params, (err) => {
                if (err) return res.status(500).json({ error: 'Lỗi khi lưu thông tin mượn sách' });

                const updateBookQuantityQuery = 'UPDATE books SET quantity = quantity - ? WHERE book_code = ?';
                db.query(updateBookQuantityQuery, [quantity, book_code], (err) => {
                    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật số lượng sách' });

                    // Tạo mã returnBook_id tự động
                    const getLastReturnBookQuery = 'SELECT returnBook_id FROM returnBook ORDER BY returnBook_id DESC LIMIT 1';
                    db.query(getLastReturnBookQuery, (err, returnResults) => {
                        if (err) return res.status(500).json({ error: 'Lỗi khi lấy mã returnBook_id' });

                        let lastId = returnResults[0]?.returnBook_id || 'RB007';
                        const newId = 'RB' + String(parseInt(lastId.slice(2)) + 1).padStart(3, '0');

                        // Thêm bản ghi vào returnBook
                        const insertReturnBookQuery = `
                            INSERT INTO returnBook (returnBook_id, borrowBooks_id) 
                            VALUES (?, ?)
                        `;
                        const returnBookParams = [newId, borrowBooks_id];

                        db.query(insertReturnBookQuery, returnBookParams, (err) => {
                            if (err) return res.status(500).json({ error: 'Lỗi khi lưu thông tin returnBook' });

                            res.json({ message: 'Lưu thông tin mượn sách, cập nhật số lượng và thêm returnBook thành công' });
                        });
                    });
                });
            });
        });
    });
};

// Hàm cập nhật thông tin mượn sách
const ChangeBorrowBook = (req, res) => {
    const { borrowBooks_id, member_code, book_code, quantity, borrowDate, returnDate } = req.body;

    if (!borrowBooks_id || !member_code || !book_code || !quantity || !borrowDate || !returnDate) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin.' });
    }

    const getCurrentAndAvailableQuantityQuery = `
        SELECT b.quantity AS total_quantity, 
               COALESCE((SELECT quantity FROM borrowBooks WHERE borrowBooks_id = ?), 0) AS current_borrowed_quantity
        FROM books b
        WHERE b.book_code = ?
    `;

    db.query(getCurrentAndAvailableQuantityQuery, [borrowBooks_id, book_code], (err, result) => {
        if (err) {
            console.error('Lỗi khi lấy số lượng sách có sẵn:', err);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy số lượng sách có sẵn.' });
        }

        const totalQuantity = result[0]?.total_quantity;
        const currentBorrowedQuantity = result[0]?.current_borrowed_quantity;

        if (totalQuantity === undefined || currentBorrowedQuantity === undefined) {
            return res.status(404).json({ error: 'Không tìm thấy sách hoặc bản ghi mượn.' });
        }

        const newAvailableQuantity = totalQuantity - (quantity - currentBorrowedQuantity);
        if (newAvailableQuantity < 0) {
            return res.status(400).json({ error: 'Số lượng sách yêu cầu vượt quá số lượng hiện có.' });
        }

        const updateBookQuantityQuery = `
            UPDATE books 
            SET quantity = ?
            WHERE book_code = ?
        `;

        db.query(updateBookQuantityQuery, [newAvailableQuantity, book_code], (err) => {
            if (err) {
                console.error('Lỗi khi cập nhật số lượng sách:', err);
                return res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật số lượng sách.' });
            }

            if (quantity <= 0) {
                const deleteBorrowQuery = `
                    DELETE FROM borrowBooks
                    WHERE borrowBooks_id = ?
                `;
                db.query(deleteBorrowQuery, [borrowBooks_id], (err) => {
                    if (err) {
                        console.error('Lỗi khi xóa thông tin mượn sách:', err);
                        return res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa thông tin mượn sách.' });
                    }

                    const updateReturnBookQuery = `
                        UPDATE returnBook
                        SET borrowBooks_id = NULL
                        WHERE borrowBooks_id = ?
                    `;
                    db.query(updateReturnBookQuery, [borrowBooks_id], (err) => {
                        if (err) {
                            console.error('Lỗi khi cập nhật thông tin returnBook:', err);
                            return res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật returnBook.' });
                        }

                        res.status(200).json({ message: 'Bản ghi mượn sách đã được xóa và returnBook đã được cập nhật.' });
                    });
                });
            } else {
                const updateBorrowQuery = `
                    UPDATE borrowBooks 
                    SET member_code = ?, 
                        book_code = ?, 
                        quantity = ?, 
                        borrowDate = ?, 
                        returnDate = ?
                    WHERE borrowBooks_id = ?
                `;

                db.query(updateBorrowQuery, [member_code, book_code, quantity, borrowDate, returnDate, borrowBooks_id], (err, updateResult) => {
                    if (err) {
                        console.error('Lỗi khi cập nhật thông tin mượn sách:', err);
                        return res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thông tin mượn sách.' });
                    }

                    if (updateResult.affectedRows === 0) {
                        return res.status(404).json({ error: 'Không tìm thấy bản ghi.' });
                    }

                    const updateReturnBookQuery = `
                        UPDATE returnBook
                        SET borrowBooks_id = ?
                        WHERE borrowBooks_id = ?
                    `;
                    db.query(updateReturnBookQuery, [borrowBooks_id, borrowBooks_id], (err) => {
                        if (err) {
                            console.error('Lỗi khi cập nhật thông tin returnBook:', err);
                            return res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật returnBook.' });
                        }

                        res.status(200).json({ message: 'Cập nhật thông tin mượn sách và returnBook thành công.' });
                    });
                });
            }
        });
    });
}; 

module.exports = { getAllBorrowBooks, getMemberByCode, getBookByCode, addborrowBook, ChangeBorrowBook};