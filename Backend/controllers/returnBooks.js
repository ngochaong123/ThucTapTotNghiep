const db = require('../Data/Database'); 
const path = require('path');

const getAllreturnBooks = (req, res) => {
  // Cập nhật trạng thái, tính PenaltyFees và latePaymDate trước khi lấy dữ liệu
  const updateStatusAndFeesQuery = `
      UPDATE returnBook rb
      JOIN borrowBooks bb ON rb.borrowBooks_id = bb.borrowBooks_id
      SET 
          rb.Status = CASE
              WHEN bb.returnDate < CURDATE() THEN 'Trễ hạn'
              ELSE 'Đang mượn'
          END,
          rb.PenaltyFees = CASE
              WHEN bb.returnDate < CURDATE() THEN GREATEST(DATEDIFF(CURDATE(), bb.returnDate) * rb.Fee, 0) -- Sử dụng giá trị cố định
              ELSE 0
          END,
          rb.latePaymDate = CASE
              WHEN bb.returnDate < CURDATE() THEN DATEDIFF(CURDATE(), bb.returnDate)
              ELSE 0
          END
      WHERE bb.returnDate IS NOT NULL;
  `;

  db.query(updateStatusAndFeesQuery, (updateErr) => {
      if (updateErr) {
          console.error('Error updating returnBook Status, PenaltyFees, and latePaymDate:', updateErr);
          return res.status(500).json({ error: 'Error updating returnBook Status, PenaltyFees, and latePaymDate' });
      }

      // Truy vấn dữ liệu sau khi cập nhật
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
              returnBook.latePaymDate,    
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

const calculatePenaltyForAll = async (req, res) => {
  const { dailyPenaltyRate } = req.body;

  // Kiểm tra nếu dailyPenaltyRate hợp lệ
  if (!dailyPenaltyRate || dailyPenaltyRate <= 0) {
    return res.status(400).json({ message: 'Phí phạt hàng ngày không hợp lệ.' });
  }

  try {
    // Truy vấn tất cả các sách trong bảng returnBook
    const query = `
      SELECT b.borrowBooks_id, r.latePaymDate, r.returnBook_id, r.Status
      FROM borrowBooks b
      INNER JOIN returnBook r ON b.borrowBooks_id = r.borrowBooks_id
    `;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Lỗi truy vấn:', err);
        return res.status(500).json({ message: 'Lỗi khi tính phí phạt.' });
      }

      // Cập nhật phí phạt vào bảng returnBook
      const updateQuery = `UPDATE returnBook SET Fee = ? WHERE borrowBooks_id = ?`;

      results.forEach((row) => {
        const { borrowBooks_id, latePaymDate, Status } = row;

        // Cập nhật phí phạt cho toàn bộ sách
        db.query(updateQuery, [dailyPenaltyRate, borrowBooks_id], (updateErr) => {
          if (updateErr) {
            console.error('Lỗi khi cập nhật phí phạt:', updateErr);
          }
        });

        // Tính phí phạt cho các sách trễ hạn và cập nhật vào cột PenaltyFees
        if (Status === 'Trễ hạn' && latePaymDate > 0) {
          const penaltyFees = latePaymDate * dailyPenaltyRate; // Tính phí phạt
          
          // Cập nhật phí phạt vào cột PenaltyFees
          const updatePenaltyQuery = `UPDATE returnBook SET PenaltyFees = ? WHERE borrowBooks_id = ?`;
          db.query(updatePenaltyQuery, [penaltyFees, borrowBooks_id], (penaltyErr) => {
            if (penaltyErr) {
              console.error('Lỗi khi cập nhật phí phạt:', penaltyErr);
            }
          });
        }
      });

      res.status(200).json({ message: 'Đã tính và cập nhật phí phạt cho tất cả sách.' });
    });
  } catch (error) {
    console.error('Lỗi khi tính phí phạt:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi tính phí phạt.' });
  }
};
 
const getUniqueFee = async (req, res) => {
  const query = 'SELECT DISTINCT Fee FROM returnBook'; // Truy xuất tất cả các giá trị Fee duy nhất

  db.query(query, (err, result) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    // Kiểm tra nếu không có kết quả
    if (result.length === 0) {
      return res.status(404).json({ message: 'Không có phí trả sách' });
    }

    // Trả về danh sách các phí trả sách (không bao bọc trong `fees`)
    res.json(result);
  });
};

const returnBooks = async (req, res) => {
  const returnBookId = req.params.id;

  // Kiểm tra nếu không có ID
  if (!returnBookId) {
    return res.status(400).json({ message: 'ID sách trả không hợp lệ.' });
  }

  // Truy vấn để lấy borrowBooks_id từ returnBook trước khi xóa
  const selectBorrowIdQuery = 'SELECT borrowBooks_id FROM returnBook WHERE returnBook_id = ?';

  db.query(selectBorrowIdQuery, [returnBookId], (err, selectResult) => {
    if (err) {
      console.error('Lỗi khi lấy borrowBooks_id:', err);
      return res.status(500).json({ message: 'Có lỗi xảy ra khi xử lý dữ liệu.' });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi sách trả.' });
    }

    const borrowBooksId = selectResult[0].borrowBooks_id;

    // Truy vấn để lấy book_code và quantity từ borrowBooks
    const selectBookQuery = 'SELECT book_code, quantity FROM borrowBooks WHERE borrowBooks_id = ?';

    db.query(selectBookQuery, [borrowBooksId], (err, bookResult) => {
      if (err) {
        console.error('Lỗi khi lấy thông tin sách từ borrowBooks:', err);
        return res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin sách.' });
      }

      if (bookResult.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy bản ghi sách mượn.' });
      }

      const bookCode = bookResult[0].book_code;
      const quantityReturned = bookResult[0].quantity;

      // Xóa bản ghi trong bảng returnBook
      const deleteReturnQuery = 'DELETE FROM returnBook WHERE returnBook_id = ?';

      db.query(deleteReturnQuery, [returnBookId], (err, deleteResult) => {
        if (err) {
          console.error('Lỗi khi xóa sách trả:', err);
          return res.status(500).json({ message: 'Có lỗi xảy ra khi xóa sách trả.' });
        }

        if (deleteResult.affectedRows === 0) {
          return res.status(404).json({ message: 'Không tìm thấy bản ghi sách trả.' });
        }

        // Cập nhật lại số lượng sách trong bảng books
        const updateBookQuery = 'UPDATE books SET quantity = quantity + ? WHERE book_code = ?';
        db.query(updateBookQuery, [quantityReturned, bookCode], (err) => {
          if (err) {
            console.error('Lỗi cập nhật số lượng sách:', err);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật số lượng sách.' });
          }

          // Xóa bản ghi trong bảng borrowBooks
          const deleteBorrowQuery = 'DELETE FROM borrowBooks WHERE borrowBooks_id = ?';

          db.query(deleteBorrowQuery, [borrowBooksId], (err, borrowDeleteResult) => {
            if (err) {
              console.error('Lỗi khi xóa borrowBooks:', err);
              return res.status(500).json({ message: 'Có lỗi xảy ra khi xóa thông tin mượn sách.' });
            }

            return res.status(200).json({ message: 'Xóa sách trả, cập nhật số lượng sách và thông tin mượn sách thành công!' });
          });
        });
      });
    });
  });
};

module.exports = { getAllreturnBooks, getStatuses, calculatePenaltyForAll, getUniqueFee, returnBooks };
