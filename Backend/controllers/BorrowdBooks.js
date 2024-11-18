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
            borrowBooks.id,
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
    const { member_code, book_code, quantity, borrowDate, returnDate } = req.body;

    if (!member_code || !book_code || !quantity || !borrowDate || !returnDate) {
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
                INSERT INTO borrowBooks (member_code, book_code, quantity, borrowDate, returnDate) 
                VALUES (?, ?, ?, ?, ?)
            `;
            const params = [member_code, book_code, quantity, borrowDate, returnDate];

            db.query(borrowQuery, params, (err) => {
                if (err) return res.status(500).json({ error: 'Lỗi khi lưu thông tin mượn sách' });

                const updateBookQuantityQuery = 'UPDATE books SET quantity = quantity - ? WHERE book_code = ?';
                db.query(updateBookQuantityQuery, [quantity, book_code], (err) => {
                    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật số lượng sách' });

                    res.json({ message: 'Lưu thông tin mượn sách và cập nhật số lượng thành công' });
                });
            });
        });
    });
};

// Hàm cập nhật thông tin mượn sách
const ChangeBorrowBook = (req, res) => {
    const { id, member_code, book_code, quantity, borrowDate, returnDate } = req.body;

    if (!id || !member_code || !book_code || !quantity || !borrowDate || !returnDate) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin.' });
    }

    // Bước 1: Lấy tổng số lượng sách có sẵn và số lượng sách mượn hiện tại của bản ghi mượn
    const getCurrentAndAvailableQuantityQuery = `
        SELECT b.quantity AS total_quantity, 
               COALESCE((SELECT quantity FROM borrowBooks WHERE id = ?), 0) AS current_borrowed_quantity
        FROM books b
        WHERE b.book_code = ?
    `;

    db.query(getCurrentAndAvailableQuantityQuery, [id, book_code], (err, result) => {
        if (err) {
            console.error('Lỗi khi lấy số lượng sách có sẵn:', err);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy số lượng sách có sẵn.' });
        }

        const totalQuantity = result[0]?.total_quantity;
        const currentBorrowedQuantity = result[0]?.current_borrowed_quantity;

        if (totalQuantity === undefined || currentBorrowedQuantity === undefined) {
            return res.status(404).json({ error: 'Không tìm thấy sách hoặc bản ghi mượn.' });
        }

        // Kiểm tra nếu số lượng sách mới yêu cầu vượt quá số lượng hiện có
        const newAvailableQuantity = totalQuantity - (quantity - currentBorrowedQuantity);
        if (newAvailableQuantity < 0) {
            return res.status(400).json({ error: 'Số lượng sách yêu cầu vượt quá số lượng hiện có.' });
        }

        // Bước 2: Cập nhật số lượng sách trong bảng `books`
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

            // Bước 3: Cập nhật thông tin mượn sách hoặc xóa nếu số lượng dưới hoặc bằng 0
            if (quantity <= 0) {
                // Nếu số lượng mượn mới là 0 hoặc ít hơn, xóa bản ghi
                const deleteBorrowQuery = `
                    DELETE FROM borrowBooks
                    WHERE id = ?
                `;
                db.query(deleteBorrowQuery, [id], (err, deleteResult) => {
                    if (err) {
                        console.error('Lỗi khi xóa thông tin mượn sách:', err);
                        return res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa thông tin mượn sách.' });
                    }

                    res.status(200).json({ message: 'Bản ghi mượn sách đã được xóa vì số lượng dưới 0.' });
                });
            } else {
                // Nếu số lượng hợp lệ, cập nhật thông tin mượn sách
                const updateBorrowQuery = `
                    UPDATE borrowBooks 
                    SET member_code = ?, 
                        book_code = ?, 
                        quantity = ?, 
                        borrowDate = ?, 
                        returnDate = ?
                    WHERE id = ?
                `;

                db.query(updateBorrowQuery, [member_code, book_code, quantity, borrowDate, returnDate, id], (err, updateResult) => {
                    if (err) {
                        console.error('Lỗi khi cập nhật thông tin mượn sách:', err);
                        return res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thông tin mượn sách.' });
                    }

                    if (updateResult.affectedRows === 0) {
                        return res.status(404).json({ error: 'Không tìm thấy bản ghi.' });
                    }

                    res.status(200).json({ message: 'Cập nhật thông tin mượn sách thành công.' });
                });
            }
        });
    });
};

const deleteBorrowBook = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Vui lòng cung cấp ID của bản ghi cần xóa.' });
    }

    const deleteQuery = 'DELETE FROM borrowBooks WHERE id = ?';

    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            console.error('Lỗi khi xóa thông tin mượn sách:', err);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa thông tin mượn sách.' });
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Xóa thông tin mượn sách thành công.' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy bản ghi cần xóa.' });
        }
    });
};

const Books = (req, res) => {
    const query = 'SELECT book_code FROM books';
    db.query(query, (err, result) => {
        if (err) {
        console.error('Lỗi khi truy vấn mã sách:', err);
        res.status(500).json({ message: 'Lỗi khi lấy mã sách' });
        } else {
        res.json(result);
        }
    });
}

const Members = (req, res) => {
    const query = 'SELECT member_code FROM members';
    db.query(query, (err, result) => {
        if (err) {
        console.error('Lỗi khi truy vấn mã thành viên:', err);
        res.status(500).json({ message: 'Lỗi khi lấy mã thành viên' });
        } else {
        res.json(result);
        }
    });
}

module.exports = { getAllBorrowBooks, getMemberByCode, getBookByCode, addborrowBook, ChangeBorrowBook, deleteBorrowBook, Books, Members };
